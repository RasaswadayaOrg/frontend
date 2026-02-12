"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function OrganizerReportsPage() {
  const stats = [
    { label: "Ticket Revenue", value: "LKR 1.24M", change: "+12.5%", positive: true, icon: DollarSign, accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Total Attendance", value: "3,450", change: "+8.2%", positive: true, icon: Users, accent: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    { label: "Completion Rate", value: "98%", change: "-2.1%", positive: false, icon: Calendar, accent: "text-violet-600 bg-violet-50 dark:bg-violet-900/20" },
    { label: "Artist Payouts", value: "LKR 450k", change: "+5.4%", positive: true, icon: ArrowUpRight, accent: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
  ];

  const topEvents = [
    { name: "Global Rhythms 2025", revenue: "LKR 450,000", tickets: 1200, status: "Sold Out" },
    { name: "Acoustic Lounge", revenue: "LKR 120,000", tickets: 350, status: "Active" },
    { name: "Soul Sessions", revenue: "LKR 85,000", tickets: 200, status: "Active" },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const values = [40, 65, 45, 80, 55, 90];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Reports</h1>
          <p className="text-sm text-neutral-500 mt-1">Analyze your performance and revenue metrics.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 active:scale-[0.98]">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.accent}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${stat.positive ? "text-emerald-600" : "text-rose-500"}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">{stat.value}</div>
            <div className="text-[11px] text-neutral-500 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/60">
            <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              Revenue Trend
            </h3>
            <select className="bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium py-1.5 px-3 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="px-6 py-6">
            <div className="h-52 flex items-end justify-between gap-2">
              {values.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative group w-full flex justify-center">
                    <div
                      className="w-full max-w-[36px] bg-brand-100 dark:bg-brand-900/20 rounded-lg overflow-hidden transition-all duration-500"
                      style={{ height: `${h * 2}px` }}
                    >
                      <div
                        className="absolute bottom-0 w-full bg-brand-500 rounded-lg transition-all duration-700"
                        style={{ height: "65%" }}
                      />
                    </div>
                    <div className="absolute -top-8 bg-neutral-900 dark:bg-white text-white dark:text-black text-[10px] py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                      LKR {(h * 1000).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-[10px] font-medium text-neutral-400">{months[i]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/60">
            <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              Top Events
            </h3>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {topEvents.map((event, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50/80 dark:hover:bg-zinc-800/30 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-600">#{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{event.name}</h4>
                  <p className="text-[11px] text-neutral-500">{event.tickets.toLocaleString()} tickets</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-neutral-900 dark:text-white">{event.revenue}</div>
                  <div className={`text-[10px] font-semibold ${event.status === "Sold Out" ? "text-emerald-600" : "text-blue-600"}`}>
                    {event.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800/60">
            <button className="w-full py-2 text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
              View All Analytics →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
