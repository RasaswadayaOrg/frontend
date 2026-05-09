import Link from "next/link";
import { Plus, MapPin, Calendar, Users, Eye, Edit3, Trash2 } from "lucide-react";
import { getOrganizerEvents } from "@/app/actions/event";
import { buildSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const result = await getOrganizerEvents();
  const events = result.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">My Events</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {events.length > 0
              ? `You have ${events.length} event${events.length !== 1 ? "s" : ""}.`
              : "Create your first event to get started."}
          </p>
        </div>
        <Link
          href="/organizer-dashboard/events/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-200/40 dark:hover:shadow-none active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">No events yet</h3>
          <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
            Create your first cultural event and it will appear here and on the public events page for users to discover.
          </p>
          <Link
            href="/organizer-dashboard/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" /> Create Event
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event: any) => {
            const eventDate = event.eventDate ? new Date(event.eventDate) : null;
            const isPast = eventDate ? eventDate < new Date() : false;
            const isUpcoming = eventDate ? eventDate >= new Date() : true;

            return (
              <div
                key={event.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-sm group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/30 dark:to-brand-900/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {event.title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isPast
                              ? "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPast ? "bg-neutral-400" : "bg-emerald-500"
                            }`}
                          />
                          {isPast ? "Past" : "Active"}
                        </span>
                        {event.category && (
                          <span className="text-[10px] font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-full">
                            {event.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1.5">
                        {eventDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {eventDate.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        {event.startTime && (
                          <span className="text-neutral-400">
                            {event.startTime}
                            {event.endTime ? ` - ${event.endTime}` : ""}
                          </span>
                        )}
                        {(event.location || event.venue) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.venue || event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 ml-16 sm:ml-0">
                    {/* Capacity */}
                    {event.capacity && (
                      <div className="text-right min-w-[80px]">
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <Users className="w-3 h-3" />
                          <span>{event.capacity} capacity</span>
                        </div>
                      </div>
                    )}

                    {/* City */}
                    {event.city && (
                      <div className="text-right min-w-[70px]">
                        <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          {event.city}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Link
                        href={`/events/${buildSlug(event.id, event.title)}`}
                        className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="View public page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
