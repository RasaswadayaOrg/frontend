"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { handleGoogleAuth } from "@/app/actions/auth";

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (details?: { firstName: string }) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check local storage or cookie for session
    const storedUser = localStorage.getItem("rasas_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
            };
            setUser(newUser);
            localStorage.setItem("rasas_user", JSON.stringify(newUser));
            setIsAuthModalOpen(false);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (details?: { firstName: string }) => {
    // Mock login logic (for email/password, use server actions instead)
    const mockUser = { 
        id: "1", 
        name: details?.firstName || "Rasas User", 
        email: "user@rasas.lk" 
    };
    setUser(mockUser);
    localStorage.setItem("rasas_user", JSON.stringify(mockUser));
    setIsAuthModalOpen(false);
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
    
    // Clear session cookie (call server action)
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
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
