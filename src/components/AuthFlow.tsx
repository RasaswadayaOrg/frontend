"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/app/actions/auth";
import { ArrowLeft, Mail, Eye, EyeOff } from "lucide-react";

interface AuthFlowProps {
  onComplete?: () => void;
  onClose?: () => void;
  isModal?: boolean;
  defaultView?: 'signin' | 'signup';
}

export function AuthFlow({ onComplete, onClose, isModal = false, defaultView = 'signin' }: AuthFlowProps) {
  const router = useRouter();
  const { loginWithGoogle, loginWithEmail, loginAfterSignup } = useAuth();
  const [view, setView] = useState<'options' | 'signin' | 'signup'>(defaultView === 'signup' ? 'signup' : 'options');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await loginWithGoogle();
      // OAuth will redirect, no need to handle completion here
    } catch (error: any) {
      console.error("Google sign-in failed:", error);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loginWithEmail(formData.email, formData.password);
      
      if (result.success) {
        onComplete?.();
        onClose?.();
        router.refresh();
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (error: any) {
      console.error("Sign in failed:", error);
      setError(error.message || "Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      });

      if (result.success && result.user && result.token) {
        // Set user in AuthContext so the app recognizes the logged-in state
        loginAfterSignup(result.user, result.token);
        onComplete?.();
        onClose?.();
        // Redirect to complete-profile for preferences (same as Google signup)
        router.push('/auth/complete-profile');
        router.refresh();
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Sign up failed:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  // Sign In Form
  if (view === 'signin') {
    return (
      <div className="w-full">
        <div className="flex items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
          <button onClick={() => setView('options')} className="mr-3 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Sign In</h2>
        </div>

        <form onSubmit={handleEmailSignIn} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all pr-12"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <button type="button" onClick={() => setView('signup')} className="text-violet-600 hover:text-violet-700 font-medium">
              Create one
            </button>
          </p>
        </form>
      </div>
    );
  }

  // Sign Up Form
  if (view === 'signup') {
    return (
      <div className="w-full">
        <div className="flex items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
          <button onClick={() => setView('options')} className="mr-3 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Create Account</h2>
        </div>

        <form onSubmit={handleEmailSignUp} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">First Name</label>
              <input
                type="text"
                required
                placeholder="John"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all pr-12"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <button type="button" onClick={() => setView('signin')} className="text-violet-600 hover:text-violet-700 font-medium">
              Sign in
            </button>
          </p>
        </form>
      </div>
    );
  }

  // Options View (default)
  return (
    <div className="w-full">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to Rasas
        </h2>
      </div>

      <div className="p-6 space-y-5">
        <div className="text-center space-y-2">
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign in to access events, follow artists, and discover Sri Lankan culture
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {/* Google Sign In - Primary */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full" />
            ) : (
              <GoogleIcon />
            )}
            {isLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400">or</span>
            </div>
          </div>

          {/* Email Sign In */}
          <button
            onClick={() => setView('signin')}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Mail size={18} />
            Sign in with Email
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-zinc-500 pt-2">
            New to Rasas?{" "}
            <button onClick={() => setView('signup')} className="text-violet-600 hover:text-violet-700 font-medium">
              Create an account
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-400 pt-2">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
