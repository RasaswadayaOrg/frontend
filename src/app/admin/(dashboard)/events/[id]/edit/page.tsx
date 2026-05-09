import { EventForm } from "@/components/admin/EventForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Since this is a server component, we can fetch data directly here
async function getEvent(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
  // Use public endpoint for fetching data to populate the form
  const res = await fetch(`${API_URL}/events/${id}`, { cache: 'no-store' });
  
  if (!res.ok) return null;
  
  const data = await res.json();
  return data.data; // Adjust based on your API response structure
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/events" 
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Event</h1>
          <p className="text-sm text-slate-500">Update event details.</p>
        </div>
      </div>

      <EventForm initialData={event} isEdit={true} />
    </div>
  );
}
