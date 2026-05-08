'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSponsoredAd, updateSponsoredAd } from '@/app/actions/admin';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface SponsoredAdFormProps {
  ad?: {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl?: string;
    placement: string;
    size: string;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
  };
}

const placements = [
  { value: 'home-sidebar', label: 'Home Page - Sidebar' },
  { value: 'home-banner', label: 'Home Page - Banner' },
  { value: 'home-seasonal', label: 'Home Page - Seasonal Promotion' },
  { value: 'marketplace-banner', label: 'Marketplace - Banner' },
  { value: 'events-sidebar', label: 'Events Page - Sidebar' },
];

const sizes = [
  { value: 'small', label: 'Small (128px height)' },
  { value: 'medium', label: 'Medium (256px height)' },
  { value: 'large', label: 'Large (384px height)' },
  { value: 'banner', label: 'Banner (96px height, full width)' },
  { value: 'leaderboard', label: 'Leaderboard (128px height, full width)' },
];

export function SponsoredAdForm({ ad }: SponsoredAdFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(ad?.imageUrl || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('imageUrl', imageUrl);

    try {
      const result = ad 
        ? await updateSponsoredAd(ad.id, formData)
        : await createSponsoredAd(formData);

      if (result.success) {
        router.push('/admin/sponsored');
        router.refresh();
      } else {
        setError(result.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (date?: string) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Ad Title *
          </label>
          <input
            type="text"
            name="title"
            defaultValue={ad?.title}
            required
            className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="Enter ad title"
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Ad Image *
          </label>
          <ImageUpload
            name="imageUrl"
            initialUrl={imageUrl}
            onImageChange={setImageUrl}
            label="Upload ad image"
          />
        </div>

        {/* Link URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Click URL (optional)
          </label>
          <input
            type="url"
            name="linkUrl"
            defaultValue={ad?.linkUrl}
            className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="https://example.com"
          />
          <p className="mt-1 text-xs text-slate-500">Where users go when they click the ad</p>
        </div>

        {/* Placement */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Placement *
          </label>
          <select
            name="placement"
            defaultValue={ad?.placement || 'home-sidebar'}
            required
            className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            {placements.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Size *
          </label>
          <select
            name="size"
            defaultValue={ad?.size || 'medium'}
            required
            className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            {sizes.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Start Date (optional)
          </label>
          <input
            type="datetime-local"
            name="startDate"
            defaultValue={formatDateForInput(ad?.startDate)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            End Date (optional)
          </label>
          <input
            type="datetime-local"
            name="endDate"
            defaultValue={formatDateForInput(ad?.endDate)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* Active Status */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={ad?.isActive !== false}
              className="w-5 h-5 rounded border-slate-300 dark:border-zinc-700 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Active (show this ad on the website)
            </span>
          </label>
        </div>
      </div>

      {/* Preview */}
      {imageUrl && (
        <div className="border border-slate-200 dark:border-zinc-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Preview</h3>
          <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg overflow-hidden max-w-md">
            <img src={imageUrl} alt="Ad preview" className="w-full h-auto" />
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading || !imageUrl}
          className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : ad ? 'Update Ad' : 'Create Ad'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
