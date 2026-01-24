"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X } from "lucide-react";
import Link from "next/link";
import { createEvent, updateEvent } from "@/app/actions/admin";
import { ImageUpload } from "./ImageUpload";

interface EventFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function EventForm({ initialData, isEdit = false }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    try {
      const result = isEdit && initialData?.id
        ? await updateEvent(initialData.id, formData)
        : await createEvent(formData);

      if (result.success) {
        router.push("/admin/events");
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
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Event Details</h3>
            
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={initialData?.title}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. Classical Music Festival"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select
                id="category"
                name="category"
                required
                defaultValue={initialData?.category || ""}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              >
                <option value="" disabled>Select category</option>
                <option value="Music">Music</option>
                <option value="Dance">Dance</option>
                <option value="Theatre">Theatre</option>
                <option value="Art">Art/Exhibition</option>
                <option value="Workshop">Workshop</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="eventDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">Event Date & Time</label>
              <input
                type="datetime-local"
                id="eventDate"
                name="eventDate"
                required
                defaultValue={initialData?.eventDate ? new Date(initialData.eventDate).toISOString().slice(0, 16) : ""}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                defaultValue={initialData?.description}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="Describe your event..."
              />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Location & Venue</h3>
            
            <div className="space-y-2">
              <label htmlFor="venue" className="text-sm font-medium text-slate-700 dark:text-slate-300">Venue Name</label>
              <input
                type="text"
                id="venue"
                name="venue"
                required
                defaultValue={initialData?.venue}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. Nelum Pokuna"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-slate-700 dark:text-slate-300">Address/Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  defaultValue={initialData?.location}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="Street address"
                />
              </div>

               <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  defaultValue={initialData?.city}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="e.g. Colombo"
                />
              </div>
            </div>
             <div className="space-y-2">
              <label htmlFor="capacity" className="text-sm font-medium text-slate-700 dark:text-slate-300">Capacity (Optional)</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                defaultValue={initialData?.capacity}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="e.g. 500"
              />
            </div>
          </div>
        </div>

        {/* Media & Links */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Media & Links</h3>
            
            <ImageUpload
              name="imageUrl"
              label="Event Cover Image"
              initialUrl={initialData?.imageUrl}
              aspectRatio="banner"
            />

            <div className="space-y-2">
              <label htmlFor="ticketLink" className="text-sm font-medium text-slate-700 dark:text-slate-300">Ticket Link (Optional)</label>
              <input
                type="url"
                id="ticketLink"
                name="ticketLink"
                defaultValue={initialData?.ticketLink}
                className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="https://tickets.lk/..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <Link 
          href="/admin/events" 
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
              Save Event
            </>
          )}
        </button>
      </div>
    </form>
  );
}
