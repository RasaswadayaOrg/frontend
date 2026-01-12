import { ArtistActions } from "../../../components/ArtistActions";
import { ArtistPerformancesList } from "../../../components/ArtistPerformancesList";
import Link from "next/link";
import { MapPin, Users, Calendar, ShoppingBag, Play, Music, ArrowLeft } from "lucide-react";

export default function ArtistProfilePage({ params }: { params: { slug: string } }) {
  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link 
          href="/artists" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Artists
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-200 dark:bg-zinc-800 rounded-full flex-shrink-0"></div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Kasun Kalhara</h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Colombo</span>
                  <span className="flex items-center gap-1"><Music className="w-4 h-4" /> Musician / Vocalist</span>
                </div>
              </div>
              <ArtistActions />
            </div>
            
            <p className="text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Kasun Kalhara is a Sri Lankan singer, musician and music director. He is known for his unique style of music which is a fusion of Indian classical music and Western music.
            </p>

            <div className="flex gap-8 mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
              <div className="text-center">
                <span className="block text-xl font-bold text-slate-900 dark:text-white">12.5k</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-slate-900 dark:text-white">48</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Events</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-slate-900 dark:text-white">15</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className="border-b border-slate-200 dark:border-zinc-800 mb-6">
            <nav className="flex gap-8">
              {['Performances', 'Content', 'Store', 'About'].map((tab, i) => (
                <button 
                  key={tab}
                  className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                    i === 0 
                      ? 'border-brand-600 text-brand-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content (Placeholder for Performances) */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Upcoming Performances</h3>
            <ArtistPerformancesList />
          </div>
        </div>
      </div>
    </div>
  );
}
