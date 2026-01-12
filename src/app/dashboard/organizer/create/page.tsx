
import { createEvent } from "@/app/actions/event";

export default function CreateEventPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Create New Event</h1>
      
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
        <form action={createEvent} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Event Title</label>
            <input
              name="title"
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              placeholder="e.g. Summer Music Festival"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              placeholder="Describe your event..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Date</label>
              <input
                name="date"
                type="datetime-local"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Location</label>
              <input
                name="location"
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                placeholder="e.g. Colombo, Sri Lanka"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Image URL</label>
            <input
              name="imageUrl"
              type="url"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              placeholder="https://..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
