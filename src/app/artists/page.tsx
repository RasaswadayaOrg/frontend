import { ImageWithFallback } from "../../components/ImageWithFallback";
import Link from "next/link";
import { Music, Search, Filter, ArrowLeft } from "lucide-react";
import { getArtists, getArtistsCount } from "../../lib/db";
import { Pagination } from "../../components/Pagination";

export default async function ArtistsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = 8; // Adjust limit for meaningful pagination
  const [artists, totalArtists] = await Promise.all([
      getArtists(limit, page),
      getArtistsCount()
  ]);
  
  const totalPages = Math.ceil(totalArtists / limit);

  // Group artists by genre (Note: This only groups from the current page, ideally we fetch genres separately)
  const genres = [...new Set(artists.map((a: any) => a.genre).filter(Boolean))] as string[];

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
            Artists & Performers
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">
            Discover talented Sri Lankan artists, musicians, and performers
          </p>
        </div>
        
        {/* Search */}
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search artists..."
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Genre Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <button className="flex-shrink-0 px-4 py-2 rounded-full bg-brand-600 text-white text-sm font-medium">
          All Artists
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            className="flex-shrink-0 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.map((artist: { id: string; name: string; bio: string; photoUrl: string | null; genre: string; userId: string | null }) => (
          <Link
            key={artist.id}
            href={`/artists/${artist.id}`}
            className="group rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all text-center p-6"
          >
            <div className="w-24 h-24 mx-auto bg-slate-200 dark:bg-zinc-800 rounded-full mb-4 relative overflow-hidden ring-4 ring-slate-100 dark:ring-zinc-800 group-hover:ring-brand-100 dark:group-hover:ring-brand-900 transition-all">
              <ImageWithFallback
                src={artist.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"}
                alt={artist.name}
                fill
                className="object-cover"
                unoptimized={artist.photoUrl?.includes('wikimedia.org')}
              />
            </div>
            
            <h3 className="font-bold text-lg mb-1 group-hover:text-brand-600 transition-colors">
              {artist.name}
            </h3>
            
            <div className="flex items-center justify-center gap-1 text-sm text-slate-500 dark:text-zinc-400 mb-3">
              <Music className="w-4 h-4" />
              <span>{artist.genre}</span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mb-4">
              {artist.bio}
            </p>
            
            <button className="w-full text-sm font-medium bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white px-4 py-2 rounded-full hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
              View Profile
            </button>
          </Link>
        ))}
      </div>

      {artists.length === 0 && (
        <div className="text-center py-16">
          <Music className="w-12 h-12 mx-auto text-slate-300 dark:text-zinc-600 mb-4" />
          <p className="text-slate-500 dark:text-zinc-400">No artists found</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/artists" />
    </div>
  );
}
