"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { handleGoogleAuth, loginUser } from "@/app/actions/auth";

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
  openAuthModal: () => void;
  closeAuthModal: () => void;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const refreshUser = () => {
    const storedUser = localStorage.getItem("rasas_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  useEffect(() => {
    // Check local storage for session
    refreshUser();
    setIsLoading(false);

    // Listen for auth state changes from Supabase (for OAuth callbacks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // User signed in via OAuth, sync with our backend
          const result = await handleGoogleAuth(
            session.access_token,
            session.refresh_token || ''
          );
          
          if (result.success && result.user) {
            const newUser = {
              id: result.user.id,
              name: result.user.fullName || result.user.email,
              email: result.user.email,
              avatarUrl: result.user.avatarUrl,
              role: result.user.role,
              city: result.user.city,
            };
            setUser(newUser);
            localStorage.setItem("rasas_user", JSON.stringify(newUser));
            // Store token if available
            if (result.token) {
              localStorage.setItem("rasas_token", result.token);
            }
            setIsAuthModalOpen(false);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
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
      localStorage.setItem("rasas_token", token); // Store JWT token
      setIsAuthModalOpen(false);
      
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error('Google login error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to login with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear local state
    setUser(null);
    localStorage.removeItem("rasas_user");
    localStorage.removeItem("rasas_token");
    
    // Clear session cookie
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
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
    localStorage.setItem("rasas_token", token);
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
