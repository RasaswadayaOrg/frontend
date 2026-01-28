"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X } from "lucide-react";
import Link from "next/link";
import { createAcademy, updateAcademy } from "@/app/actions/admin";
import { ImageUpload } from "./ImageUpload";

interface AcademyFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function AcademyForm({ initialData, isEdit = false }: AcademyFormProps) {
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
        ? await updateAcademy(initialData.id, formData)
        : await createAcademy(formData);

      if (result.success) {
        router.push("/admin/academies");
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
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Academy Information</h3>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Academy Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={initialData?.name}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. Royal Academy of Dance"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
              <input
                type="text"
                id="type"
                name="type"
                required
                defaultValue={initialData?.type}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. Dance School, Music Institute"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={initialData?.description}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="About the academy..."
              />
            </div>
            
             <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                required
                defaultValue={initialData?.location}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. Colombo 07"
              />
            </div>
          </div>
        </div>

        {/* Contact & Media */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Contact Details</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  defaultValue={initialData?.phone}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="+94 77..."
                />
              </div>

               <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={initialData?.email}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="contact@academy.com"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium text-slate-700 dark:text-slate-300">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  defaultValue={initialData?.website}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
          
           <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Media</h3>
            
            <ImageUpload
              name="imageUrl"
              label="Academy Image"
              initialUrl={initialData?.imageUrl}
              aspectRatio="video"
            />
           </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <Link 
          href="/admin/academies" 
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Academy
            </>
          )}
        </button>
      </div>
    </form>
  );
}
