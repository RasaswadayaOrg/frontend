"use client";

import {
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Calendar,
  Eye,
  Ticket,
} from "lucide-react";

export function TrendAnalytics() {
  const topGenres = [
    { name: "Traditional Fusion", percentage: 35, growth: "+12%" },
    { name: "Live Jazz", percentage: 25, growth: "+8%" },
    { name: "Classical Dance", percentage: 20, growth: "+5%" },
    { name: "Acoustic Pop", percentage: 15, growth: "-2%" },
  ];

  const popularVenues = [
    { name: "Barefoot Garden Cafe", events: 24 },
    { name: "Lionel Wendt Theatre", events: 18 },
    { name: "Nelum Pokuna", events: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-brand-500 to-fuchsia-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                +24%
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight mb-0.5">1,240</div>
            <div className="text-brand-100 text-sm font-medium">Profile Views</div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl p-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mb-0.5">8</div>
          <div className="text-sm text-neutral-500 font-medium">Upcoming Gigs</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl p-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <Ticket className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mb-0.5">23</div>
          <div className="text-sm text-neutral-500 font-medium">Total Bookings</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Trends */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/60">
            <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              Trending Genres
            </h3>
          </div>
          <div className="p-6 space-y-5">
            {topGenres.map((genre, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{genre.name}</span>
                  <span
                    className={`text-xs font-semibold ${
                      genre.growth.startsWith("+")
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {genre.growth}
                  </span>
                </div>
                <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-700"
                    style={{ width: `${genre.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/60">
            <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-brand-600" />
              Market Insights
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div className="p-4 bg-brand-50 dark:bg-brand-900/10 rounded-xl border border-brand-100/80 dark:border-brand-800/30">
              <div className="flex items-start gap-3">
                <ArrowUpRight className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">
                    Surge in Corporate Events
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    Organizers are looking for instrumental jazz bands for corporate functions in March.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Active Venues
              </h4>
              <div className="space-y-2.5">
                {popularVenues.map((venue, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-800/30 transition-colors duration-200"
                  >
                    <span className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      {venue.name}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500">
                      {venue.events} events
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
