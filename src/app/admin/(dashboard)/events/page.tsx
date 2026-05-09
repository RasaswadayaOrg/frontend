import { getEvents, getEventsCount } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { Plus, Pencil, Search } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { DeleteEventButton } from "@/app/admin/(dashboard)/events/DeleteEventButton";
import { FeaturedToggle } from "@/app/admin/(dashboard)/events/FeaturedToggle";

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const events = await getEvents(50, 1); // Fetch up to 50 events (backend max limit)
  const totalCount = await getEventsCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Events Management</h1>
           <p className="text-sm text-slate-500">{totalCount} total events in the system.</p>
        </div>
        <Link href="/admin/events/new" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
         <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
         </div>
         
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 font-medium">
               <tr>
                 <th className="px-6 py-4">Event Details</th>
                 <th className="px-6 py-4">Featured</th>
                 <th className="px-6 py-4">Category</th>
                 <th className="px-6 py-4">Date</th>
                 <th className="px-6 py-4">Location</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
               {events.map((event: any) => (
                 <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                   <td className="px-6 py-4 max-w-xs">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-200 dark:bg-zinc-800 rounded-md relative overflow-hidden flex-shrink-0">
                           <ImageWithFallback 
                              src={event.imageUrl || `https://placehold.co/400x400?text=${event.title?.charAt(0) || 'E'}`}
                              alt={event.title} 
                              fill 
                              className="object-cover" 
                            />
                       </div>
                       <div className="min-w-0">
                         <p className="font-medium text-slate-900 dark:text-white truncate">{event.title}</p>
                         <p className="text-xs text-slate-500 truncate">{event.venue || event.location}</p>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <FeaturedToggle 
                        eventId={event.id} 
                        isFeatured={event.isFeatured} 
                        eventTitle={event.title} 
                     />
                   </td>
                   <td className="px-6 py-4">
                     {event.category ? (
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400">
                         {event.category}
                       </span>
                     ) : (
                       <span className="text-slate-400 italic">Uncategorized</span>
                     )}
                   </td>
                   <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                     {event.eventDate ? format(new Date(event.eventDate), "MMM d, yyyy") : "TBD"}
                   </td>
                   <td className="px-6 py-4 text-slate-500">
                     {event.city || event.location || "—"}
                   </td>
                   <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                       <Link href={`/admin/events/${event.id}/edit`} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                         <Pencil className="w-4 h-4" />
                       </Link>
                       <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                     </div>
                   </td>
                 </tr>
               ))}
               {events.length === 0 && (
                 <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                     No events found. Create one to get started.
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}
