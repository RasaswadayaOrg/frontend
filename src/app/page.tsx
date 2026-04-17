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
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { HeroSlider } from "../components/HeroSlider";
import { AdPlaceholder } from "../components/AdPlaceholder";
import { getEvents, getArtists, getStores, getProducts, getTrendingEvents, getMyReminders, getRecommendations, getActiveAdsForPlacement } from "../lib/db";
import { SidebarStats } from "../components/SidebarStats";
import { getSession } from "../lib/auth";

// Mock Types
type Event = any;
type Artist = any;

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await getSession();
  const isLoggedIn = !!session?.token;
  const reminders = isLoggedIn ? await getMyReminders(session.token) : [];
  
  // Fetch real data from the database
  const [events, artists, stores, products, trendingEvents, sidebarAds, bannerAds, seasonalAds] = await Promise.all([
    getEvents(6),
    getArtists(4),
    getStores(4),
    getProducts(4),
    getTrendingEvents(6),
    getActiveAdsForPlacement('home-sidebar'),
    getActiveAdsForPlacement('home-banner'),
    getActiveAdsForPlacement('home-seasonal'),
  ]);

  // Fetch AI Recommendations
  const recommendationsResult = isLoggedIn ? await getRecommendations(session.token) : { data: [] };
  const recommendations = recommendationsResult?.data || [];
  const recommendedEvents = recommendations.filter((r: any) => r.type === 'event').map((r: any) => ({ ...r.item, aiScore: r.score }));
  const recommendedArtists = recommendations.filter((r: any) => r.type === 'artist').map((r: any) => ({ ...r.item, aiScore: r.score }));

  // Select a featured artist for the AI recommendation (use the 4th one or fallback to 1st)
  const featuredArtist = artists.length > 0 ? (artists[3] || artists[0]) : null;

  // Setup AI override vars
  const aiEvent1 = recommendedEvents.length > 0 ? recommendedEvents[0] : (events.length > 0 ? events[0] : null);
  const aiEvent2 = recommendedEvents.length > 1 ? recommendedEvents[1] : (events.length > 1 ? events[1] : null);
  const aiArtist = recommendedArtists.length > 0 ? recommendedArtists[0] : featuredArtist;

  const categories = [
    { name: "Music", icon: Music, href: "/events?category=music", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" },
    { name: "Dance", icon: Theater, href: "/events?category=dance", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" },
    { name: "Theater", icon: Mic2, href: "/events?category=theater", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400" },
    { name: "Arts", icon: Palette, href: "/products", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" },
    { name: "Crafts", icon: Shapes, href: "/marketplace", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" },
  ];

  return (
    <div className="home-container space-y-12 pb-12">
      
      {/* 1) Hero Section with Sidebar Ad */}
      <section className="container mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Slider (resized) */}
          <div className="lg:col-span-9">
            <HeroSlider events={trendingEvents} />
          </div>
          
          {/* Right Sidebar Ad */}
          <div className="hidden lg:block lg:col-span-3">
             <div className="flex flex-col" style={{ height: '500px' }}>
               <SidebarStats 
                 reminders={reminders} 
                 trendingEvents={trendingEvents} 
                 isLoggedIn={isLoggedIn}
                 city={session?.user?.city} // Might be undefined
               />
               <div className="mt-2 flex-1 min-h-0">
                  <AdPlaceholder size="medium" label="Sponsorship" placement="home-sidebar" ad={sidebarAds[0] || null} className="!h-full" />
               </div>
             </div>
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
            <AdPlaceholder size="leaderboard" label="Sponsored Banner" placement="home-banner" ad={bannerAds[0] || null} />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
              {/* Card 1: Primary AI Recommendation (Featured Event) */}
              {aiEvent1 && (
               <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group flex flex-col hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] ring-1 ring-white/5">
                 {/* Tech Header */}
                 <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 opacity-70"></div>
                 
                 {/* Image Section - Tech Frame */}
                 <div className="relative h-60 w-full overflow-hidden border-b border-white/5">
                    <Link href={`/events/${aiEvent1.id}`} className="block w-full h-full">
                        <ImageWithFallback 
                            src={aiEvent1.imageUrl || "https://images.unsplash.com/photo-1540039155732-68096f21bb46?q=80&w=800"}
                            alt={aiEvent1.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 blur-[2px] group-hover:blur-0"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    </Link>
                    
                    {/* Floating Tech Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                      <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur border border-cyan-500/30 rounded text-xs font-bold text-cyan-400 uppercase tracking-wider shadow-lg flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                         #1 Pick for You
                      </span>
                   </div>

                   {/* AI Match Overlay */}
                   <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform pointer-events-none">
                      <div className="relative w-12 h-12 flex items-center justify-center bg-slate-950/90 backdrop-blur rounded-full border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                         <span className="text-sm font-black text-white">{aiEvent1.aiScore || '98'}%</span>
                         <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-800" />
                            <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="144" strokeDashoffset={144 - (144 * (aiEvent1.aiScore || 98) / 100)} className="text-blue-500 transition-all duration-1000 group-hover:text-cyan-400" />
                         </svg>
                      </div>
                   </div>

                   {/* Title Hover State */}
                   <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                      <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg group-hover:text-blue-400 transition-colors line-clamp-2">{aiEvent1.title}</h3>
                   </div>
                 </div>

                 {/* Content Section */}
                 <div className="p-6 flex flex-col flex-grow bg-slate-950/50">
                    <div className="flex items-center gap-4 mb-5 text-sm font-medium text-slate-300">
                      <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded">
                         <Calendar className="w-3.5 h-3.5 text-blue-400" />
                         {new Date(aiEvent1.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded">
                         <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                         {aiEvent1.venue || 'Colosseum'}
                      </div>
                    </div>

                    <div className="bg-blue-950/20 rounded-xl p-4 border border-blue-500/10 mb-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full mix-blend-screen"></div>
                       <p className="text-sm text-slate-300 relative z-10 leading-relaxed line-clamp-3">
                          {aiEvent1.description || "The Rasaswadaya neural network has detected a profound resonance between your taste profile and this event's energy signature. A highly recommended cultural convergence. Don't miss this."}
                       </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                       <Link href={`/events/${aiEvent1.id}`} className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 relative z-20">
                          Explore Event <ArrowRight className="w-4 h-4" />
                       </Link>
                       <Link href={`/events/${aiEvent1.id}`} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2 group/btn relative z-20">
                          Secure Spot
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                 </div>
               </div>
              )}

              {/* Card 2: Secondary Event */}
              {aiEvent2 && (
              <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group flex flex-col hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.15)] ring-1 ring-white/5">
                 {/* Tech Header */}
                 <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 opacity-70"></div>
                 
                 {/* Image Section - Split Layout */}
                 <Link href={`/events/${aiEvent2.id}`} className="relative h-44 w-full overflow-hidden border-b border-white/5 block">
                    <ImageWithFallback 
                        src={aiEvent2.imageUrl || "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800"}
                        alt={aiEvent2.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-slate-950/80 backdrop-blur border border-white/10 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        {aiEvent2.category || 'Event'}
                      </span>
                   </div>

                   {/* Date Pill */}
                   <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/90 backdrop-blur border border-white/10 rounded-full text-xs font-medium text-slate-300">
                         <Calendar className="w-3 h-3 text-purple-400" />
                         {new Date(aiEvent2.eventDate).toLocaleDateString()}
                      </div>
                   </div>
                 </Link>
                 
                 {/* Content Panel */}
                 <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                    <Link href={`/events/${aiEvent2.id}`}>
                       <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">{aiEvent2.title}</h3>
                    </Link>
                    
                    {/* AI Tech Box */}
                    <div className="bg-slate-950 rounded-lg p-3.5 border border-white/5 mb-4 group-hover:border-purple-500/20 transition-colors">
                       <div className="flex items-start gap-2.5">
                         <div className="w-4 h-4 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <MessageSquare className="w-2.5 h-2.5 text-purple-400" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Recommendation</p>
                            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                               {aiEvent2.description || 'Recommended based on your cultural profile.'}
                            </p>
                         </div>
                       </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                       <Link href={`/events/${aiEvent2.id}`} className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                          Details <ArrowRight className="w-3 h-3" />
                       </Link>
                       <Link href={`/events/${aiEvent2.id}`} className="text-xs bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-md font-bold hover:bg-white hover:text-slate-950 transition-all relative z-20">
                         Book Now
                       </Link>
                    </div>
                 </div>
              </div>
              )}

              {/* Card 3: Personalized Artist Pick */}
              {aiArtist && (
               <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all group flex flex-col hover:shadow-[0_0_20px_-5px_rgba(236,72,153,0.15)] ring-1 ring-white/5">
                 <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 opacity-70"></div>
                 
                 <div className="relative h-44 w-full overflow-hidden border-b border-white/5">
                    <Link href={`/artists/${aiArtist.id}`} className="block w-full h-full">
                        <ImageWithFallback 
                            src={aiArtist.photoUrl || "https://images.unsplash.com/photo-1549834125-906c85a44004?q=80&w=800"}
                            alt={aiArtist.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
                    </Link>
                    
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <span className="px-2 py-1 bg-slate-950/80 backdrop-blur border border-white/10 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                        Artist Match
                      </span>
                    </div>
                 </div>

                 <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                    <Link href={`/artists/${aiArtist.id}`}>
                       <h3 className="text-lg font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">{aiArtist.name}</h3>
                    </Link>
                    
                    <div className="bg-slate-950 rounded-lg p-3.5 border border-white/5 mb-4 group-hover:border-pink-500/20 transition-colors">
                       <div className="flex items-start gap-2.5">
                         <div className="w-4 h-4 rounded bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Heart className="w-2.5 h-2.5 text-pink-400" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Trending + Taste</p>
                            <p className="text-xs text-slate-300 leading-relaxed">
                               Based on your recent activity, we think you'll love this artist!
                            </p>
                         </div>
                       </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                       <span className="text-xs font-medium text-pink-400/80 flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                         Rising Star
                       </span>
                       <Link href={`/artists/${aiArtist.id}`} className="text-xs bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-md font-bold hover:bg-white hover:text-slate-950 transition-all relative z-20">
                         Profile
                       </Link>
                    </div>
                 </div>
               </div>
              )}

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
            <AdPlaceholder size="medium" label="Sponsor" placement="home-sidebar" ad={sidebarAds[1] || null} />
          </div>
        </div>
      </section>

      {/* Ad Section: Mid-Page Break */}
      <section className="container mx-auto px-4 py-4">
         <AdPlaceholder size="leaderboard" label="Seasonal Promotion" placement="home-seasonal" ad={seasonalAds[0] || null} className="bg-gradient-to-r from-violet-50 to-brand-50 dark:from-violet-950/30 dark:to-brand-950/30" />
      </section>

      {/* 4) Market / Products Section */}
      <section className="py-12">
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
