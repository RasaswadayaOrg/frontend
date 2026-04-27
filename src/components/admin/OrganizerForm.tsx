"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { createOrganizer, updateOrganizer } from "@/app/actions/admin";
import { ImageUpload } from "./ImageUpload";

interface OrganizerFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function OrganizerForm({ initialData, isEdit = false }: OrganizerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const result = isEdit && initialData?.id
        ? await updateOrganizer(initialData.id, formData)
        : await createOrganizer(formData);

      if (result.success) {
        router.push("/admin/organizers");
        router.refresh();
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Organizer Information</h3>
            
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">Organization / Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                defaultValue={initialData?.fullName}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. Acme Events"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isEdit}
                defaultValue={initialData?.email}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white disabled:opacity-50"
                placeholder="e.g. contact@acme.com"
              />
            </div>

            {!isEdit && (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="Leave empty to auto-generate"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={initialData?.phone}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="e.g. +94 77 123 4567"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={initialData?.city}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="e.g. Colombo"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media & Other */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Profile Image</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Avatar</label>
              <div className="w-32 h-32 mx-auto">
                <ImageUpload 
                  name="avatarUrl" 
                  initialUrl={initialData?.avatarUrl || initialData?.photoUrl} 
                />
              </div>
              <p className="text-xs text-center text-slate-500 mt-2">Recommended: Square image, max 2MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Organizer
            </>
          )}
        </button>
      </div>
    </form>
  );
}
