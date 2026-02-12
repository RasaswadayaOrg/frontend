"use client";

import Link from "next/link";
import { Plus, Search, MoreVertical, MapPin, Calendar, Users, Eye, Edit3 } from "lucide-react";
import { useState } from "react";

export default function EventsPage() {
  const [filter, setFilter] = useState("All");

  const events = [
    { id: 1, title: "Summer Jazz Festival 2026", date: "Feb 28, 2026", location: "Viharamahadevi Park", sales: "LKR 125,000", sold: 240, capacity: 500, status: "Active" },
    { id: 2, title: "Traditional Dance Workshop", date: "Mar 05, 2026", location: "Lionel Wendt", sales: "LKR 45,000", sold: 30, capacity: 50, status: "Active" },
    { id: 3, title: "Electronic Fusion Night", date: "Mar 12, 2026", location: "Warehouse Project", sales: "LKR 0", sold: 0, capacity: 200, status: "Recruiting", accepted: 0, requested: 3 },
    { id: 4, title: "Soul Sessions Phase 1", date: "Apr 20, 2026", location: "Mount Lavinia Hotel", sales: "LKR 0", sold: 0, capacity: 100, status: "Draft" },
  ];

  const statusConfig: Record<string, { dot: string; bg: string }> = {
    Active: { dot: "bg-emerald-500", bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400" },
    Draft: { dot: "bg-neutral-400", bg: "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400" },
    Recruiting: { dot: "bg-amber-500 animate-pulse", bg: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">My Events</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your upcoming and past events.</p>
        </div>
        <Link
          href="/organizer-dashboard/events/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-200/40 dark:hover:shadow-none active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 p-1 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl">
          {["All", "Active", "Recruiting", "Draft"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                filter === f
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Events Cards */}
      <div className="space-y-3">
        {events
          .filter((e) => filter === "All" || e.status === filter)
          .map((event) => {
            const config = statusConfig[event.status] || statusConfig.Draft;
            const percentage = event.capacity > 0 ? Math.round((event.sold / event.capacity) * 100) : 0;
            return (
              <div
                key={event.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-sm group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/30 dark:to-brand-900/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{event.title}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.bg}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          {event.status}
                          {event.status === "Recruiting" && ` (${event.accepted}/${event.requested})`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1.5">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0 ml-16 sm:ml-0">
                    {/* Ticket progress */}
                    <div className="min-w-[100px]">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-neutral-500 flex items-center gap-1"><Users className="w-3 h-3" /> {event.sold}/{event.capacity}</span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">{percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="text-right min-w-[90px]">
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">{event.sales}</div>
                      <div className="text-[10px] text-neutral-400 font-medium">revenue</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
