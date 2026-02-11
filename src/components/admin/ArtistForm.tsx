"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X } from "lucide-react";
import Link from "next/link";
import { createArtist, updateArtist } from "@/app/actions/admin";
import { ImageUpload } from "./ImageUpload";

interface ArtistFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ArtistForm({ initialData, isEdit = false }: ArtistFormProps) {
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
        ? await updateArtist(initialData.id, formData)
        : await createArtist(formData);

      if (result.success) {
        router.push("/admin/artists");
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
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h3>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Artist Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={initialData?.name}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. Nanda Malini"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="profession" className="text-sm font-medium text-slate-700 dark:text-slate-300">Profession</label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  required
                  defaultValue={initialData?.profession}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="e.g. Vocalist"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="genre" className="text-sm font-medium text-slate-700 dark:text-slate-300">Genre</label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  defaultValue={initialData?.genre}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="e.g. Classical"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                defaultValue={initialData?.location}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. Colombo, Sri Lanka"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={initialData?.bio}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="Artist biography..."
              />
            </div>
          </div>
        </div>

        {/* Media & Social */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Media & Social</h3>

            <ImageUpload
              name="photoUrl"
              label="Profile Photo"
              initialUrl={initialData?.photoUrl}
              aspectRatio="square"
            />

            <ImageUpload
              name="coverUrl"
              label="Cover Image"
              initialUrl={initialData?.coverUrl}
              aspectRatio="banner"
            />

            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium text-slate-700 dark:text-slate-300">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                defaultValue={initialData?.website}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="instagram" className="text-sm font-medium text-slate-700 dark:text-slate-300">Instagram</label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                defaultValue={initialData?.instagram}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="facebook" className="text-sm font-medium text-slate-700 dark:text-slate-300">Facebook</label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                defaultValue={initialData?.facebook}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="username"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <Link 
          href="/admin/artists"
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? 'Update Artist' : 'Create Artist'}
        </button>
      </div>
    </form>
  );
}
