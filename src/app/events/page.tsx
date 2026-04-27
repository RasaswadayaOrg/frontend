import { ImageWithFallback } from "../../components/ImageWithFallback";
import Link from "next/link";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { getEvents, getEventsCount } from "../../lib/db";
import { Pagination } from "../../components/Pagination";
import { FilterList } from "../../components/FilterList";

export default async function EventsPage(props: { searchParams: Promise<{ page?: string; search?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const category = searchParams.category || "";
  const limit = 8;

  const [events, totalEvents] = await Promise.all([
      getEvents(limit, page, undefined, search, category),
      getEventsCount(search, category)
  ]);
  const totalPages = Math.ceil(totalEvents / limit);

  const categories = [
    { id: 'Music', name: 'Music' },
    { id: 'Dance', name: 'Dance' },
    { id: 'Drama', name: 'Drama' },
  ];

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Cultural Events & Festivals
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">
            Discover cultural events, festivals, and performances across Sri Lanka
          </p>
        </div>
        

      </div>

      <FilterList 
        filters={categories}
        paramName="category"
        allLabel="All Events"
      />

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const eventDate = event.eventDate ? new Date(event.eventDate) : new Date();
          const isPast = eventDate < new Date();
          
          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[16/9] bg-slate-200 dark:bg-zinc-800 relative">
                <ImageWithFallback
                  src={event.imageUrl || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {isPast ? (
                  <span className="absolute top-3 left-3 bg-slate-900/80 text-white px-2 py-1 rounded-md text-xs font-bold">
                    PAST EVENT
                  </span>
                ) : (
                  <span className="absolute top-3 left-3 bg-brand-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                    UPCOMING
                  </span>
                )}
                
                {/* Date Badge */}
                <div className="absolute bottom-3 left-3 bg-white dark:bg-zinc-900 rounded-lg p-2 text-center min-w-[60px] shadow-lg">
                  <div className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                    {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {eventDate.getDate()}
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                  {event.title}
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-zinc-400 mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {eventDate.toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 dark:text-zinc-400">No events found</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/events" />
    </div>
  );
}
