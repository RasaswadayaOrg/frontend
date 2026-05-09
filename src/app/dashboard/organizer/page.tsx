import { getSession } from "@/lib/auth";
// import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { buildSlug } from "@/lib/slug";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default async function OrganizerDashboard() {
  const session = await getSession();
  if (!session || session.user.role !== "ORGANIZER") {
    redirect("/dashboard");
  }

  let events: any[] = [];
  try {
      const res = await fetch(`${API_URL}/events?limit=100`, {
          cache: 'no-store'
      });
      if(res.ok) {
          const json = await res.json();
          // Filter client side as a fallback if API doesn't support filtering by organizer
          // but assuming we fetch all public events for now OR I update backend.
          // Since I can't pass organizerId to public /events unless I implemented it,
          // I will filter here.
          events = (json.data || []).filter((e: any) => e.organizerId === session.user.id);
      }
  } catch(e) {
      console.error("Failed to fetch events", e);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Events</h1>
        <Link
          href="/dashboard/organizer/create"
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
          <Calendar className="w-12 h-12 mx-auto text-slate-300 dark:text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No events yet</h3>
          <p className="text-slate-500 dark:text-zinc-400 mb-4">Create your first event to get started</p>
          <Link
            href="/dashboard/organizer/create"
            className="text-brand-600 hover:underline font-medium"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${buildSlug(event.id, event.title)}`}>
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden hover:border-brand-500 transition-colors group">
                <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-zinc-800">
                  <img
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1543946602-a0ce26d9e6e0'}
                    alt={event.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">{event.title}</h3>
                  <div className="flex items-center text-slate-500 dark:text-zinc-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.eventDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
