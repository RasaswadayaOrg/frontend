import { getArtists, getEvents, getProducts, getAcademies } from "../../lib/db";
import Link from "next/link";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import { Calendar, MapPin } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Search for events, artists, products, and more</h1>
        <p className="text-slate-500">Please enter a search term in the search bar above.</p>
      </div>
    );
  }

  // Fetch results in parallel
  const [events, artists, products, academies] = await Promise.all([
    getEvents(4, 1, undefined, query),
    getArtists(4, 1, query),
    getProducts(4, 1, query),
    getAcademies(4, 1, query),
  ]);

  const hasResults =
    events.length > 0 ||
    artists.length > 0 ||
    products.length > 0 ||
    academies.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Search Results for &quot;{query}&quot;
      </h1>

      {!hasResults && (
        <div className="text-center py-12 bg-slate-50 dark:bg-zinc-800/50 rounded-lg">
          <p className="text-slate-500 dark:text-zinc-400">No results found matching your query.</p>
        </div>
      )}

      {/* Events Section */}
      {events.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Events</h2>
            <Link href={`/events?search=${query}`} className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
              View All Events &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event: any) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group block bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-zinc-800">
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-zinc-800">
                  <ImageWithFallback
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-brand-700 dark:text-brand-400 shadow-sm">
                    {event.category}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 shrink-0 text-brand-500" />
                       <span className="truncate">
                         {new Date(event.eventDate).toLocaleDateString(undefined, {
                           month: 'short', day: 'numeric', year: 'numeric'
                         })}
                       </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0 text-brand-500" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Artists Section */}
      {artists.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Artists</h2>
            <Link href={`/artists?search=${query}`} className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
              View All Artists &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artists.map((artist: any) => (
              <Link key={artist.id} href={`/artists/${artist.slug}`} className="group block bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center border border-slate-100 dark:border-zinc-800">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-slate-50 dark:border-zinc-800 shadow-inner">
                  <ImageWithFallback
                    src={artist.imageUrl || "/placeholder-artist.jpg"}
                    alt={artist.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {artist.name}
                </h3>
                <p className="text-brand-600 dark:text-brand-400 font-medium text-sm mb-2">{artist.category}</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {artist.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* MarketPlace Section */}
      {products.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Products</h2>
             <Link href={`/marketplace?search=${query}`} className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
              View All Products &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group block bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-zinc-800">
                <div className="aspect-square relative bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {product.name}
                  </h3>
                   <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-zinc-500 truncate">{product.storeName}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

        {/* Academies Section */}
        {academies.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Academies</h2>
             <Link href={`/academies?search=${query}`} className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
              View All Academies &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {academies.map((academy: any) => (
              <Link key={academy.id} href={`/academies/${academy.id}`} className="group block bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-zinc-800">
                <div className="aspect-[16/9] relative overflow-hidden bg-slate-100 dark:bg-zinc-800">
                  <ImageWithFallback
                    src={academy.imageUrl || "/placeholder-academy.jpg"}
                    alt={academy.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                     <h3 className="font-bold text-white text-lg line-clamp-1">{academy.name}</h3>
                  </div>
                </div>
                 <div className="p-4 space-y-2">
                    <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2">{academy.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500">
                        <MapPin className="w-3 h-3" />
                        <span>{academy.location}</span>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
