"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { loginUser, logoutUser } from "@/app/actions/auth";
import { clearAuthToken, getAuthToken, storeAuthToken } from "@/lib/token-storage";

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  city?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  loginAfterSignup: (userData: any, token: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (returnUrl?: string) => void;
  closeAuthModal: () => void;
  refreshUser: () => void;
  refreshUserFromAPI: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const refreshUser = () => {
    const token = getAuthToken();
    const storedUser = localStorage.getItem("rasas_user");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem("rasas_user");
      clearAuthToken();
      setUser(null);
    }
  };

  // Re-fetches the user profile from the backend and syncs role/avatar into
  // localStorage + in-memory state. Call this after role changes (e.g. on
  // NavCta mount, after returning from a role-request approval).
  const refreshUserFromAPI = async (): Promise<void> => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
      const res = await fetch(API_URL + "/auth/me", {
        headers: { Authorization: "Bearer " + token },
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = await res.json();
      const userData = json?.data;
      if (!userData?.id) return;
      const updated: User = {
        id: userData.id,
        name: userData.fullName || userData.name || userData.email,
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        role: userData.role,
        city: userData.city,
      };
      localStorage.setItem("rasas_user", JSON.stringify(updated));
      setUser(updated);
    } catch {
      // Non-fatal: fall back to cached data
    }
  };

  // Read the one-time `rasas_oauth_bootstrap` cookie set by /auth/callback,
  // mirror its contents into localStorage, then clear the cookie. Returns
  // true if a bootstrap was consumed.
  const consumeOAuthBootstrap = (): boolean => {
    if (typeof document === "undefined") return false;
    const match = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("rasas_oauth_bootstrap="));
    if (!match) return false;
    try {
      const raw = decodeURIComponent(match.split("=").slice(1).join("="));
      const parsed = JSON.parse(raw);
      if (parsed?.id && parsed?.email) {
        const u = {
          id: parsed.id,
          name: parsed.name || parsed.email,
          email: parsed.email,
          avatarUrl: parsed.avatarUrl,
          role: parsed.role,
          city: parsed.city,
        };
        localStorage.setItem("rasas_user", JSON.stringify(u));
        if (parsed.token) storeAuthToken(parsed.token);
        if (parsed.supabaseUid) {
          try { localStorage.setItem("rasas_synced_supabase_uid", parsed.supabaseUid); } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error("Failed to parse rasas_oauth_bootstrap:", e);
    } finally {
      // Clear the cookie regardless.
      document.cookie = "rasas_oauth_bootstrap=; Max-Age=0; path=/; SameSite=Lax";
    }
    return true;
  };

  useEffect(() => {
    // First, consume any OAuth bootstrap cookie from /auth/callback.
    consumeOAuthBootstrap();
    // Then hydrate user from localStorage.
    refreshUser();
    setIsLoading(false);

    // Note: We deliberately do NOT subscribe to supabase.auth.onAuthStateChange
    // here. The /auth/callback route handler is the single source of truth for
    // OAuth completion (it exchanges the PKCE code on the server, syncs with
    // our backend, sets all cookies, and redirects). Listening here as well
    // caused duplicate /auth/google calls on every page load when the Supabase
    // SDK re-emitted SIGNED_IN on session restore.
  }, []);

  const loginWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Use server action to login — this sets the session cookie (httpOnly)
      const result = await loginUser(email, password);

      if (!result.success) {
        return { success: false, error: result.error || "Invalid credentials" };
      }

      const { user: userData, token } = result;
      
      // Store user in state and localStorage
      const newUser = {
        id: userData.id,
        name: userData.fullName || userData.email,
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        role: userData.role,
        city: userData.city,
      };
      
      setUser(newUser);
      localStorage.setItem("rasas_user", JSON.stringify(newUser));
      storeAuthToken(token);
      setIsAuthModalOpen(false);
      
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const loginWithGoogle = async () => {
    const { isSupabaseConfigured } = await import("@/lib/supabase");
    if (!isSupabaseConfigured()) {
      throw new Error("Google sign-in isn't configured. Missing Supabase credentials.");
    }

    const redirectTo = window.location.origin + "/auth/callback";
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        // Force Google's account chooser every time so users can pick / add an account,
        // and request a refresh token so we can keep the session warm.
        queryParams: {
          prompt: "select_account",
          access_type: "offline",
        },
      },
    });

    if (error) {
      console.error("Google login error:", error);
      throw new Error(error.message || "Google sign-in failed");
    }

    // The Supabase SDK will normally do a full-page redirect to Google; if for any
    // reason it returns a URL without redirecting, navigate manually.
    if (data?.url && typeof window !== "undefined" && window.location.href !== data.url) {
      window.location.href = data.url;
    }
  };

  const logout = async () => {
    // Sign out from Supabase
    try { await supabase.auth.signOut(); } catch { /* ignore */ }

    // Clear server-side httpOnly session cookie via server action
    try { await logoutUser(); } catch { /* ignore */ }

    // Clear local state
    setUser(null);
    try {
      localStorage.removeItem("rasas_user");
      localStorage.removeItem("rasas_synced_supabase_uid");
    } catch { /* ignore */ }
    clearAuthToken();
  };

  const openAuthModal = (returnUrl?: string) => {
    if (returnUrl && typeof window !== "undefined") {
      sessionStorage.setItem("rasas_return_url", returnUrl);
    }
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginAfterSignup = (userData: any, token: string) => {
    const newUser = {
      id: userData.id,
      name: userData.fullName || userData.email,
      email: userData.email,
      avatarUrl: userData.avatarUrl,
      role: userData.role,
      city: userData.city,
    };
    setUser(newUser);
    localStorage.setItem("rasas_user", JSON.stringify(newUser));
    storeAuthToken(token);
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithEmail,
        loginWithGoogle,
        loginAfterSignup,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        refreshUser,
        refreshUserFromAPI,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
