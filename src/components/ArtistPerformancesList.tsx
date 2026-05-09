"use client";

import Link from "next/link";
import { ImageWithFallback } from "./ImageWithFallback";
import { buildSlug } from "../lib/slug";

interface Performance {
    id: string;
    title: string;
    eventDate: string | Date;
    imageUrl?: string;
}

export function ArtistPerformancesList({ events = [] }: { events?: Performance[] }) {
  if (events.length === 0) {
      return <p className="text-slate-500">No upcoming performances.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {events.map((performance) => (
      <div key={performance.id} className="flex gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800">
        <div className="w-24 h-24 bg-slate-200 dark:bg-zinc-800 rounded-lg flex-shrink-0 relative overflow-hidden">
             <ImageWithFallback 
                src={performance.imageUrl || 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800'} 
                alt={performance.title}
                fill
                className="object-cover"
             />
        </div>
        <div>
          <h4 className="font-bold text-lg mb-1">{performance.title}</h4>
          <p className="text-sm text-slate-500 mb-2">
            {new Date(performance.eventDate).toLocaleDateString()}
          </p>
          <Link 
            href={`/events/${buildSlug(performance.id, performance.title)}`}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Get Tickets
          </Link>
        </div>
      </div>
    ))}
  </div>
  );
}
