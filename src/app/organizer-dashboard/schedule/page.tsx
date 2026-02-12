"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, MapPin, Users, CalendarDays } from "lucide-react";

export default function OrganizerSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const myEvents = [
    { id: 1, date: new Date(2026, 1, 28), title: "Summer Jazz Festival", venue: "Viharamahadevi Park", time: "4:00 PM", artists: 12, color: "bg-brand-600" },
    { id: 2, date: new Date(2026, 2, 10), title: "Art & Fusion Night", venue: "Lionel Wendt", time: "7:00 PM", artists: 4, color: "bg-violet-600" },
  ];

  const getEventsForDay = (date: Date) => myEvents.filter((e) => isSameDay(e.date, date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Schedule</h1>
          <p className="text-sm text-neutral-500 mt-1">Your event timeline at a glance.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-sm min-w-[130px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-neutral-100 dark:border-neutral-800/60">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {/* Padding for first day offset */}
            {Array.from({ length: getDay(startOfMonth(currentDate)) }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square border-r border-b border-neutral-50 dark:border-neutral-800/40 bg-neutral-50/30 dark:bg-zinc-900/50" />
            ))}

            {days.map((day, i) => {
              const dailyEvents = getEventsForDay(day);
              const today = isToday(day);
              return (
                <div
                  key={i}
                  className={`aspect-square border-r border-b border-neutral-50 dark:border-neutral-800/40 p-1.5 sm:p-2 relative group hover:bg-brand-50/30 dark:hover:bg-brand-900/5 transition-colors duration-200 ${
                    today ? "bg-brand-50/40 dark:bg-brand-900/10" : ""
                  }`}
                >
                  <span
                    className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      today
                        ? "bg-brand-600 text-white font-bold"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  <div className="mt-0.5 space-y-0.5">
                    {dailyEvents.map((e) => (
                      <div
                        key={e.id}
                        className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 ${e.color} text-white rounded-md truncate font-medium cursor-pointer hover:opacity-90 transition-opacity`}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Upcoming</h3>
          </div>

          {myEvents.map((e) => (
            <div
              key={e.id}
              className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${e.color}`} />
                <span className="text-[11px] font-semibold text-brand-600">{format(e.date, "MMM dd, yyyy")}</span>
              </div>
              <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-2">{e.title}</h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                  <Clock className="w-3 h-3" /> {e.time}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                  <MapPin className="w-3 h-3" /> {e.venue}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                  <Users className="w-3 h-3" /> {e.artists} Artists
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-xs font-semibold text-brand-600 hover:text-brand-700 border border-brand-100 dark:border-brand-900/30 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all duration-200">
                Manage Event
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
