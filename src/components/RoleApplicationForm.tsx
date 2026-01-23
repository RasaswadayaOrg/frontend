"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, FileText, CheckCircle } from "lucide-react";
import { submitRoleApplication } from "@/app/actions/roleApplication";

interface RoleApplicationFormProps {
  role: "ARTIST" | "ORGANIZER";
  onClose: () => void;
  onSuccess: () => void;
}

export default function RoleApplicationForm({ role, onClose, onSuccess }: RoleApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("role", role);

    // Validate file for artist
    if (role === 'ARTIST' && !formData.get('proofDocument')) {
        // Just in case, though required html attribute handles basic check
        // Ideally we check size/type too
    }

    const result = await submitRoleApplication(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="font-bold text-lg">Apply as {role === 'ARTIST' ? 'Artist' : 'Organizer'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
          {role === 'ARTIST' && (
             <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-4">
               <h4 className="text-sm font-semibold text-brand-700 mb-1">Artist Requirement</h4>
               <p className="text-xs text-brand-600">
                 Please provide a valid proof of your artistic career (e.g., certificates, media coverage, or union membership) and a portfolio link.
               </p>
             </div>
          )}

          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium text-slate-700 dark:text-zinc-300">
              Biography / Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              id="bio"
              required
              rows={4}
              placeholder={role === 'ARTIST' ? "Tell us about your artistic journey..." : "Tell us about your organization or event planning experience..."}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="portfolioUrl" className="text-sm font-medium text-slate-700 dark:text-zinc-300">
              Portfolio / Website Link {role === 'ARTIST' && <span className="text-slate-400 text-xs">(Recommended)</span>}
            </label>
            <input
              type="url"
              name="portfolioUrl"
              id="portfolioUrl"
              placeholder="https://"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>

          {role === 'ARTIST' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                Proof Document <span className="text-red-500">*</span>
              </label>
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  name="proofDocument"
                  id="proofDocument"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors ${fileName ? 'border-brand-500 bg-brand-50/50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}`}>
                  {fileName ? (
                    <>
                       <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-2">
                          <FileText className="w-5 h-5" />
                       </div>
                       <p className="text-sm font-medium text-brand-700 truncate max-w-full px-4">{fileName}</p>
                       <p className="text-xs text-brand-500 mt-1">Click to change</p>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Click to upload document</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-brand-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
