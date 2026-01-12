import { EventActions } from "../../../components/EventActions";
import Link from "next/link";
import { MapPin, Calendar, Clock, Share2, Heart, Phone, Mail, ArrowLeft } from "lucide-react";

export default function EventDetailsPage({ params }: { params: { slug: string } }) {
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
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              Event Cover Image
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white/90 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Music
              </span>
              <span className="bg-brand-500/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">
                Colombo
              </span>
            </div>
          </div>

          {/* Title & Metadata */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Classical Sitar Recital by Pradeep Ratnayake
            </h1>
            <div className="flex flex-wrap gap-6 text-slate-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                <span className="font-medium">Friday, Dec 20, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                <span className="font-medium">7:00 PM - 9:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                <span className="font-medium">Lionel Wendt Theatre, Colombo 7</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-slate dark:prose-invert max-w-none font-ui">
            <h3 className="text-xl font-bold mb-3">About the Event</h3>
            <p>
              Join us for an enchanting evening of classical sitar music featuring the renowned maestro Pradeep Ratnayake. 
              Experience a fusion of traditional ragas and contemporary compositions that transcend cultural boundaries.
            </p>
            <p>
              The concert will feature special guest performances by leading percussionists from Sri Lanka and India. 
              Don't miss this unique opportunity to witness a musical dialogue between cultures.
            </p>
            <h3 className="text-xl font-bold mb-3 mt-6">Lineup</h3>
            <ul>
              <li>Pradeep Ratnayake - Sitar</li>
              <li>Rakitha Wickramaratne - Percussion</li>
              <li>Special Guest - Tabla</li>
            </ul>
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
                <span className="font-medium text-sm">Dec 20, 2025</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-500 text-sm">Time</span>
                <span className="font-medium text-sm">7:00 PM</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-500 text-sm">Venue</span>
                <a href="#" className="font-medium text-sm text-brand-600 hover:underline">View on Map</a>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-500 text-sm">Price</span>
                <span className="font-medium text-sm">LKR 2,500 - 5,000</span>
              </div>
            </div>

            <EventActions />
          </div>

          {/* Organizer Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-4">Organizer</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-200 dark:bg-zinc-800 rounded-full"></div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Pradeep Nj</h4>
                <p className="text-xs text-slate-500">Verified Organizer</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 dark:bg-zinc-800 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
                <Phone className="w-3 h-3" /> Call
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 dark:bg-zinc-800 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
                <Mail className="w-3 h-3" /> Email
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </div>
  );
}
