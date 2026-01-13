"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface AuthViewProps {
  isModal?: boolean;
  onClose?: () => void;
}

export function AuthView({ isModal = false, onClose }: AuthViewProps) {
  const { login, loginWithGoogle } = useAuth();
  const [view, setView] = useState<'options' | 'email_signup'>('options');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  // Mock form state
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: ""
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    login({ firstName: formData.firstName });
    if (onClose) onClose();
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error('Google sign-in failed:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (view === 'email_signup') {
    return (
      <div className="w-full">
         <div className="flex items-center p-6 border-b dark:border-zinc-800">
          <button 
            onClick={() => setView('options')}
            className="mr-3 text-zinc-500 hover:text-zinc-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSignup} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    First Name
                </label>
                <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Email
                </label>
                <input 
                    type="email" 
                    required
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Password
                </label>
                <input 
                    type="password" 
                    required
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
            </div>

            <button
                type="submit"
                className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors mt-2"
            >
                Create Account
            </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full">
        <div className="flex justify-between items-center p-6 border-b dark:border-zinc-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Join Rasas
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium dark:text-white">Sign in or create an account</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Unlock exclusive access to tickets, workshops, and our marketplace.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={() => setView('email_signup')}
              className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Sign up with Email
            </button>
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-2.5 px-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
          </div>
          
          <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 pt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
    </div>
  );
}