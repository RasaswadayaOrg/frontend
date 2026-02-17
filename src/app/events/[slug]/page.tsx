import { EventActions } from "../../../components/EventActions";
import Link from "next/link";
import { MapPin, Calendar, Clock, ArrowLeft } from "lucide-react";
import { getEvent } from "../../../lib/db";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import { notFound } from "next/navigation";

export default async function EventDetailsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const event = await getEvent(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link 
          href="/events" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>

    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content (8 cols) */}
        <section className="lg:col-span-8 space-y-6">
          {/* Cover Image */}
          <div className="w-full aspect-[16/7] bg-slate-200 dark:bg-zinc-800 rounded-3xl relative overflow-hidden">
             <ImageWithFallback
                src={event.imageUrl || "https://images.unsplash.com/photo-1543946602-a0ce26d9e6e0?q=80&w=800"}
                alt={event.title}
                fill
                className="object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white/90 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {event.category || 'Event'}
              </span>
              <span className="bg-brand-500/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">
                {event.location ? event.location.split(',')[0] : 'Sri Lanka'}
              </span>
            </div>
          </div>

          {/* Title & Metadata */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-slate-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                <span className="font-medium">
                    {new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              {event.startTime && (
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-600" />
                    <span className="font-medium">{event.startTime} {event.endTime ? `- ${event.endTime}` : ''}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                <span className="font-medium">{event.location || 'TBA'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-slate dark:prose-invert max-w-none font-ui">
            <h3 className="text-xl font-bold mb-3">About the Event</h3>
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        </section>

        {/* Side Panel (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Event Info Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Event Details</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-500 text-sm">Date</span>
                <span className="font-medium text-sm">
                    {new Date(event.eventDate).toLocaleDateString()}
                </span>
              </div>
              {event.startTime && (
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                    <span className="text-slate-500 text-sm">Time</span>
                    <span className="font-medium text-sm">{event.startTime}</span>
                  </div>
              )}
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-500 text-sm">Venue</span>
                    <span className="font-medium text-sm text-right max-w-[50%]">{event.location || 'TBA'}</span>
              </div>
            </div>

            <EventActions />
          </div>
        </aside>
      </div>
    </div>
    </div>
  );
}

