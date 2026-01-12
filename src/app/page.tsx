import { ImageWithFallback } from "../components/ImageWithFallback";
import Link from "next/link";
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ShoppingBag, 
  Music, 
  Theater, 
  Palette, 
  Mic2, 
  Shapes,
  Info,
  Bot,
  Heart,
  MessageSquare
} from "lucide-react";
import { HeroSlider } from "../components/HeroSlider";
import { AdPlaceholder } from "../components/AdPlaceholder";
import { getEvents, getArtists, getStores, getProducts, getTrendingEvents, getMyReminders } from "../lib/db";
import { SidebarStats } from "../components/SidebarStats";
import { getSession } from "../lib/auth";

// Mock Types
type Event = any;
type Artist = any;

export default async function Home() {
  const session = await getSession();
  const isLoggedIn = !!session?.token;
  const reminders = isLoggedIn ? await getMyReminders(session.token) : [];
  
  // Fetch real data from the database
  const [events, artists, stores, products, trendingEvents] = await Promise.all([
    getEvents(6),
    getArtists(4),
    getStores(4),
    getProducts(4),
    getTrendingEvents(3),
  ]);

  const categories = [
    { name: "Music", icon: Music, href: "/events?category=music", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" },
    { name: "Dance", icon: Theater, href: "/events?category=dance", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" },
    { name: "Theater", icon: Mic2, href: "/events?category=theater", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400" },
    { name: "Arts", icon: Palette, href: "/products", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" },
    { name: "Crafts", icon: Shapes, href: "/marketplace", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" },
  ];

  return (
    <div className="space-y-12 pb-12">
      
      {/* 1) Hero Section with Sidebar Ad */}
      <section className="container mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Slider (resized) */}
          <div className="lg:col-span-9">
            <HeroSlider events={trendingEvents} />
          </div>
          
          {/* Right Sidebar Ad */}
          <div className="hidden lg:block lg:col-span-3">
             <SidebarStats 
               reminders={reminders} 
               trendingEvents={trendingEvents} 
               isLoggedIn={isLoggedIn}
               city={session?.user?.city} // Might be undefined
             />
          </div>
        </div>
      </section>

      {/* 2) Categories - Browse Options */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={cat.href}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all hover:scale-105 hover:shadow-lg cursor-pointer ${cat.color} bg-opacity-50`}
            >
              <cat.icon className="w-8 h-8 mb-2" />
              <span className="font-semibold">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad Section: Top Banner */}
      <section className="container mx-auto px-4">
         <div className="w-full">
            <AdPlaceholder size="leaderboard" label="Sponsored Banner" />
         </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="container mx-auto px-4">
        {/* Darker, deeper gradient background */}
        <div className="relative rounded-3xl overflow-hidden bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 p-[1px]">
          {/* Animated decorative blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-[23px] p-6 md:p-8">
            
            {/* Header with more detail */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
                     <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    Your Personal Culture Guide
                    <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-bold text-indigo-300 uppercase tracking-wider border border-white/5">Beta v0.9</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-slate-400 text-sm">Analyzing your preferences...</p>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <p className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 98% Accuracy Match
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                 <div className="px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center min-w-[100px]">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Top Genre</span>
                    <span className="text-sm font-semibold text-indigo-300">Traditional</span>
                 </div>
                 <div className="px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center min-w-[100px]">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Favorite Era</span>
                    <span className="text-sm font-semibold text-purple-300">Kandy</span>
                 </div>
                 <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-xs font-medium text-white transition-colors">
                    Update Preferences
                 </button>
              </div>
            </div>

            {/* Detailed AI Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Main Event Match */}
              <Link href="/events/recommended-1" className="col-span-1 lg:col-span-1 bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                
                {/* Image Section */}
                <div className="relative h-48 w-full group-hover:h-44 transition-all duration-300">
                   <ImageWithFallback 
                     src="https://images.unsplash.com/photo-1543946602-a0ce26d9e6e0?q=80&w=800"
                     alt="Classical Event"
                     fill
                     className="object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                   <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <span className="px-2 py-1 bg-purple-500/90 backdrop-blur rounded text-[10px] font-bold text-white uppercase tracking-wider">Top Pick</span>
                      <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs font-medium text-white">
                         <Calendar className="w-3 h-3 text-indigo-400" />
                         Next Weekend
                      </div>
                   </div>
                </div>

                {/* Content */}
                <div className="p-5">
                   <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Sitar & Tabla Fusion Night</h3>
                   
                   {/* AI Reasoning */}
                   <div className="bg-indigo-950/30 rounded-lg p-3 mb-4 border border-indigo-500/10">
                      <div className="flex items-start gap-2">
                        <Bot className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-indigo-200 leading-relaxed">
                          <span className="font-semibold text-indigo-300">Why this matches:</span> You recently viewed "Classical Ragas" and this event features the same lead Sitarist, <strong>Mahesh Denipitiya</strong>.
                        </p>
                      </div>
                   </div>

                   <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-3">
                      <span>Colombo 07</span>
                      <span className="flex items-center gap-1 hover:text-white transition-colors">
                        View Details <ArrowRight className="w-3 h-3" />
                      </span>
                   </div>
                </div>
              </Link>

              {/* Card 3: Cultural Masterclass */}
              <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                 
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                       <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/10">
                          <MessageSquare className="w-5 h-5" />
                       </div>
                       <span className="bg-purple-950/50 text-purple-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">Masterclass</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">Learn the 'Kohomba Kankariya'</h3>
                    <p className="text-sm text-indigo-200 mb-6 leading-relaxed">
                       A rare opportunity to learn the ritualistic history from Guru <strong className="text-white">Piyasara Shilpadipathi</strong>.
                    </p>

                    <div className="space-y-3 mb-6">
                       <div className="flex items-center gap-3 text-xs text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                          <span>2 Days Immersive Workshop</span>
                       </div>
                       <div className="flex items-center gap-3 text-xs text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                          <span>Located at Chitrasena Kalayathanaya</span>
                       </div>
                    </div>
                 </div>

                 <button className="relative z-10 w-full py-3 bg-white text-indigo-950 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                    Reserve Your Seat
                 </button>
              </div>

              {/* Card 4: Personalized Artist Pick */}
               <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="bg-indigo-950/50 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/20">Artist Match</span>
                    <Bot className="w-4 h-4 text-indigo-500" />
                 </div>

                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform duration-500">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1549834125-906c85a44004?q=80&w=800"
                      alt="Artist"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                         <h3 className="text-white font-bold text-lg">Nadeeka Guruge</h3>
                         <p className="text-xs text-slate-300">Modern Folk Fusion</p>
                    </div>
                  </div>

                  <div className="bg-indigo-950/20 rounded-lg p-3 border border-indigo-500/10">
                     <p className="text-xs text-indigo-200 leading-relaxed">
                        <span className="font-semibold text-indigo-400">Trending + Your Taste:</span> Since you enjoyed "Traditional Folk", you might love his fusion of folk melodies with modern composition.
                     </p>
                  </div>
                    
                    <Link href="/artists/1" className="mt-4 flex items-center justify-between text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-all">
                        View Profile
                        <ArrowRight className="w-4 h-4" />
                    </Link>
               </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3) Curated / Insights Section - "Discover" */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Highlight: Featured Event */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-500" />
                Featured Events
              </h2>
              <Link href="/events" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View Calendar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.slice(0, 5).map((event: Event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-brand-500/5 transition-all flex flex-col h-full"
                >
                  <div className="relative h-48 bg-slate-100 dark:bg-zinc-800">
                    <ImageWithFallback 
                      src={event.imageUrl || "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                      {event.ticketPrice > 0 ? `Rs. ${event.ticketPrice}` : 'Free'}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs font-medium text-brand-600 mb-2">
                       <span className="bg-brand-50 dark:bg-brand-950/50 px-2 py-1 rounded-md uppercase tracking-wider">
                         {event.category || 'Event'}
                       </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-brand-600 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="mt-auto space-y-2 text-sm text-slate-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar: Cultural Insights & Trending */}
          <div className="space-y-8">
            
            {/* Cultural Insight Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/30">
              <div className="flex items-center gap-2 mb-4 text-amber-800 dark:text-amber-500">
                <Info className="w-5 h-5" />
                <h3 className="font-bold">Did You Know?</h3>
              </div>
              <p className="text-sm text-slate-700 dark:text-zinc-300 mb-4 leading-relaxed">
                The <strong>Kandyan Dance</strong> (Udarata Natum) originates from the central hill country of Sri Lanka. Originally performed by dancers who were identified as a separate caste, it is now a national icon.
              </p>
              <Link href="/about" className="text-xs font-bold text-amber-700 hover:underline">
                Learn more about our heritage →
              </Link>
            </div>

            {/* Trending / Top Artists */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
              <h3 className="font-bold text-lg mb-4">Trending Artists</h3>
              <div className="space-y-4">
                {artists.slice(0, 3).map((artist: Artist, i: number) => (
                  <Link key={artist.id} href={`/artists/${artist.id}`} className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                      <ImageWithFallback 
                        src={artist.photoUrl} 
                        alt={artist.name}
                        fill
                        className="object-cover"
                        unoptimized={artist.photoUrl?.includes('wikimedia.org')}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm group-hover:text-brand-600 transition-colors">{artist.name}</h4>
                      <p className="text-xs text-slate-500">{artist.genre}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/artists" className="block w-full mt-4 text-xs font-medium text-center text-slate-500 hover:text-brand-600 transition-colors">
                View all artists
              </Link>
            </div>

            {/* Ad Space */}
            <AdPlaceholder size="medium" label="Sponsor" />
          </div>
        </div>
      </section>

      {/* Ad Section: Mid-Page Break */}
      <section className="container mx-auto px-4 py-4">
         <AdPlaceholder size="leaderboard" label="Seasonal Promotion" className="bg-gradient-to-r from-violet-50 to-brand-50 dark:from-violet-950/30 dark:to-brand-950/30" />
      </section>

      {/* 4) Market / Products Section */}
      <section className="bg-slate-50 dark:bg-zinc-900/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Marketplace Highlights</h2>
              <p className="text-sm text-slate-500">Support local artisans and creators</p>
            </div>
            <Link href="/marketplace" className="px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
              Shop All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product: any) => (
              <Link 
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-square relative bg-slate-200 dark:bg-zinc-800">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500" // Fallback placeholder logic
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded">
                    {product.storeName}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h4>
                  <p className="text-lg font-bold text-brand-600">Rs. {product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5) Call to Action - Join Community */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-violet-600 p-8 md:p-12 text-center text-white relative overflow-hidden">
           {/* Abstract shapes */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
           
           <div className="relative z-10 max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold mb-4">Join the Rasasvada Community</h2>
             <p className="text-brand-100 mb-8 text-lg">
               Connect with artists, discover exclusive events, and support the Sri Lankan arts community directly.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link href="/signup" className="px-8 py-3 bg-white text-brand-700 font-bold rounded-full hover:bg-brand-50 transition-colors w-full sm:w-auto">
                 Get Started
               </Link>
               <Link href="/about" className="px-8 py-3 bg-brand-700/50 text-white font-medium rounded-full hover:bg-brand-700/70 backdrop-blur transition-colors w-full sm:w-auto">
                 Learn More
               </Link>
             </div>
           </div>
        </div>
      </section>

    </div>
  );
}
