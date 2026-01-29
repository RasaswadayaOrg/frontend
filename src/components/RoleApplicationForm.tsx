"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Check, Loader2, Link as LinkIcon, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { submitRoleApplication } from "../app/actions/roleApplication";

interface RoleApplicationFormProps {
  role: "ARTIST" | "ORGANIZER";
}

export function RoleApplicationForm({ role }: RoleApplicationFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    bio: "",
    portfolioUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Simple validation: 5MB max, PDF/Image
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size too large (max 5MB)");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // We need to get the session token to authenticate
      // In a real app, this might come from a cookie or AuthContext if exposed
      // Assuming we rely on the httpOnly cookie + a helper or just re-using the logic from other actions
      // However, we are making a client-side fetch here. We need the token.
      // Let's assume the token is stored in localStorage as well or we use a server action.
      // Since 'AuthContext' stores user but not token (usually), we might need to get it.
      // But looking at previous code, `fetch` calls in components often use a token or proxy.
      // Let's try to use a server action instead to handle the file upload and auth securely.
      
      // Actually, standard FormData submission is easier for file uploads than JSON
      const data = new FormData();
      data.append("role", role);
      data.append("bio", formData.bio);
      if (formData.portfolioUrl) data.append("portfolioUrl", formData.portfolioUrl);
      if (file) data.append("proofDocument", file);

      // We'll use a clearer way to get the token, or assume a cookie-based proxy if exists.
      // But the context shows `accessToken` usage in auth controller.
      // Let's stick to the client-side approach using the stored token if available, 
      // or try to fetch it.
      // Wait, the `AuthContext` in previous turns had `loginWithEmail` but didn't expose token directly.
      // But `actions/auth.ts` uses cookies.
      
      // Alternative: Use a Server Action for this form?
      // Next.js Server Actions are great for this.
      // But handling file uploads in Server Actions can be tricky with FormData.
      
      // Let's fetch using the session cookie which includes the token?
      // No, usually client-side fetch needs explicit Authorization header if using Bearer token strategy directly.
      
      // Let's assume there is a `getToken` helper or we can pass it from a Server Component wrapper.
      // For now, I'll attempt to use a Server Action strategy in a separate file, 
      // OR use a pure client side fetch and assume we can get the token from a cookie or localStorage if it was stored there.
      
      // Looking at `frontend/src/app/actions/user.ts`:
      // It imports `cookies` from `next/headers`, so it's server-side.
      
      // I will create a server action `submitRoleApplication` in `frontend/src/app/actions/roleApplication.ts` that handles this.
      // Server Actions can take FormData directly.
      
      const result = await submitRoleApplication(data);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/profile');
        }, 3000);
      } else {
        setError(result.error || "Failed to submit application");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-600 dark:text-green-300" />
        </div>
        <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">Application Submitted!</h3>
        <p className="text-green-700 dark:text-green-300">
          Your request to become an {role.toLowerCase()} has been received. <br/>
          We will review your details and get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Bio Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Tell us about yourself {role === 'ARTIST' ? '(Bio)' : '(Experience)'} *
        </label>
        <textarea
          required
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
          placeholder={role === 'ARTIST' ? "Share your artistic journey, style, and achievements..." : "Describe your experience in organizing events..."}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
      </div>

      {/* Portfolio Link (Mostly for Artists) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" /> Portfolio / Social Media Link
        </label>
        <input
          type="url"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
          placeholder="https://instagram.com/yourprofile"
          value={formData.portfolioUrl}
          onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
        />
        <p className="text-xs text-slate-500">
          Link to your Instagram, YouTube, or personal website showing your work.
        </p>
      </div>

      {/* Proof Document Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Verification Document (ID / Certificate)
        </label>
        <div className={`relative border-2 border-dashed rounded-xl p-8 transition-colors text-center ${file ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'border-slate-200 dark:border-zinc-700 hover:border-brand-300'}`}>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-8 h-8 text-brand-600" />
              <span className="text-sm font-medium text-brand-700 dark:text-brand-300">{file.name}</span>
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); setFile(null); }}
                className="text-xs text-red-500 hover:underline z-10"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Upload className="w-8 h-8" />
              <span className="text-sm">Click to upload or drag and drop</span>
              <span className="text-xs opacity-70">PDF, JPG or PNG (Max 5MB)</span>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Please upload a valid ID or certification to verify your identity.
        </p>
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.bio}
          className="flex-1 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Submit Application
        </button>
      </div>
    </form>
  );
}
