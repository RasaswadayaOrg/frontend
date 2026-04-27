"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Calendar,
  Ticket,
  DollarSign,
  ArrowUpRight,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function OrganizerDashboardPage() {
  const { user } = useAuth();

  const stats = [
    { name: "Ticket Sales", value: "LKR 450k", change: "+12%", icon: DollarSign, accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
    { name: "Active Events", value: "3", change: "0", icon: Ticket, accent: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    { name: "Total Attendees", value: "1,240", change: "+18%", icon: Users, accent: "text-violet-600 bg-violet-50 dark:bg-violet-900/20" },
    { name: "Pending Bookings", value: "5", change: "+2", icon: Calendar, accent: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
  ];

  const recentEvents = [
    { title: "Summer Jazz Festival", date: "Feb 28, 2026", tickets: 240, revenue: "LKR 125,000" },
    { title: "Art & Fusion Night", date: "Mar 10, 2026", tickets: 85, revenue: "LKR 68,000" },
    { title: "Traditional Dance Night", date: "Mar 15, 2026", tickets: 120, revenue: "LKR 95,000" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Organizer"}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Here's what's happening with your events today.
          </p>
        </div>
        <Link
          href="/organizer-dashboard/events/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-200/40 dark:hover:shadow-none active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {stat.change !== "0" && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1 font-medium">{stat.name}</div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/60">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Recent Events</h3>
            <Link
              href="/organizer-dashboard/events"
              className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {recentEvents.map((event, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50/80 dark:hover:bg-zinc-800/30 transition-colors duration-200"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/30 dark:to-brand-900/10 flex items-center justify-center flex-shrink-0">
                    <Ticket className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {event.date}
                      </span>
                      <span>{event.tickets} tickets</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-sm font-bold text-emerald-600">{event.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <Link
                href="/organizer-dashboard/talent"
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <Users className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Find Artists</p>
                    <p className="text-[11px] text-neutral-500">Browse available talent</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
              </Link>
              <Link
                href="/organizer-dashboard/events/create"
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <Plus className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">New Event</p>
                    <p className="text-[11px] text-neutral-500">Start planning today</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
              </Link>
              <Link
                href="/organizer-dashboard/reports"
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">View Reports</p>
                    <p className="text-[11px] text-neutral-500">Revenue & analytics</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
