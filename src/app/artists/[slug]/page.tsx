import { ArtistActions } from "../../../components/ArtistActions";
import { ArtistPerformancesList } from "../../../components/ArtistPerformancesList";
import Link from "next/link";
import { MapPin, Users, Calendar, ShoppingBag, Play, Music, ArrowLeft } from "lucide-react";
import { getArtist } from "../../../lib/db";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import { notFound } from "next/navigation";

export default async function ArtistProfilePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const artist = await getArtist(params.slug);

  if (!artist) {
    notFound();
  }

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
          <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-200 dark:bg-zinc-800 rounded-full flex-shrink-0 relative overflow-hidden border-4 border-slate-100 dark:border-zinc-700">
             <ImageWithFallback
                src={artist.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"}
                alt={artist.name}
                fill
                className="object-cover"
                unoptimized={artist.photoUrl?.includes('wikimedia.org')}
              />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{artist.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {artist.location || "Sri Lanka"}</span>
                  <span className="flex items-center gap-1"><Music className="w-4 h-4" /> {artist.profession || artist.genre || "Artist"}</span>
                </div>
              </div>
              <ArtistActions />
            </div>
            
            <p className="text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {artist.bio || "No biography available."}
            </p>

            <div className="flex gap-8 mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
              <div className="text-center">
                <span className="block text-xl font-bold text-slate-900 dark:text-white">{artist.followerCount || 0}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-slate-900 dark:text-white">{artist.performances?.length || 0}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Events</span>
              </div>
              {/* Products count is not yet available in API, hardcoded/hidden or mocked */}
              {/* 
              <div className="text-center">
                <span className="block text-xl font-bold text-slate-900 dark:text-white">0</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Products</span>
              </div>
              */}
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
            <ArtistPerformancesList events={artist.performances?.map((p: any) => p.event) || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
