"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const events = [
    { date: new Date(2026, 1, 15), title: "Live at Barefoot", type: "gig", time: "19:00" },
    { date: new Date(2026, 1, 20), title: "Wedding Performance", type: "private", time: "14:00" },
    { date: new Date(2026, 1, 25), title: "Studio Session", type: "recording", time: "10:00" },
  ];

  const unavailability = [new Date(2026, 1, 16), new Date(2026, 1, 28)];

  const getDayEvents = (date: Date) => events.filter((e) => isSameDay(e.date, date));
  const isUnavailable = (date: Date) => unavailability.some((d) => isSameDay(d, date));

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Calendar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/60">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-1 bg-neutral-100 dark:bg-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 border-b border-neutral-100 dark:border-neutral-800/60">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {Array.from({ length: getDay(startOfMonth(currentDate)) }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square border-r border-b border-neutral-50 dark:border-neutral-800/40 bg-neutral-50/30 dark:bg-zinc-900/50" />
          ))}

          {days.map((day, i) => {
            const dayEvents = getDayEvents(day);
            const busy = isUnavailable(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const today = isToday(day);

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square border-r border-b border-neutral-50 dark:border-neutral-800/40 p-1.5 flex flex-col items-start gap-0.5 relative transition-colors duration-200 ${
                  isSelected ? "bg-violet-50/60 dark:bg-violet-900/10" : "hover:bg-neutral-50/80 dark:hover:bg-zinc-800/30"
                } ${!isCurrentMonth ? "opacity-30" : ""} ${busy ? "bg-neutral-100/50 dark:bg-zinc-800/20" : ""}`}
              >
                <span
                  className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    today
                      ? "bg-violet-600 text-white font-bold"
                      : isSelected
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold"
                      : "text-neutral-500"
                  }`}
                >
                  {format(day, "d")}
                </span>
                <div className="flex flex-col gap-0.5 w-full mt-auto">
                  {dayEvents.map((_, j) => (
                    <div key={j} className="h-1 w-full rounded-full bg-violet-500" />
                  ))}
                  {busy && <div className="h-1 w-full rounded-full bg-rose-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="w-full xl:w-80">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden h-full">
          <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/60">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-500" />
              {selectedDate ? format(selectedDate, "EEEE, MMMM do") : "Select a date"}
            </h3>
          </div>

          {selectedDate && (
            <div className="p-5 space-y-5">
              {/* Availability toggle */}
              <div className="p-4 bg-neutral-50 dark:bg-zinc-800/30 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Availability</span>
                  {isUnavailable(selectedDate) ? (
                    <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full">
                      Blocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                      Open
                    </span>
                  )}
                </div>
                <button
                  className={`w-full py-2 text-xs font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] ${
                    isUnavailable(selectedDate)
                      ? "bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
                      : "bg-rose-50 dark:bg-rose-900/10 text-rose-600 border border-rose-200 dark:border-rose-800/30 hover:bg-rose-100"
                  }`}
                >
                  {isUnavailable(selectedDate) ? "Mark Available" : "Block Date"}
                </button>
              </div>

              {/* Schedule */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 pb-2 mb-3 border-b border-neutral-100 dark:border-neutral-800/60">
                  Schedule
                </h4>

                {getDayEvents(selectedDate).length === 0 ? (
                  <p className="text-sm text-neutral-400 italic">No events scheduled.</p>
                ) : (
                  <div className="space-y-2.5">
                    {getDayEvents(selectedDate).map((evt, i) => (
                      <div
                        key={i}
                        className="flex gap-3 items-start p-3 rounded-xl bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100/80 dark:border-violet-800/30"
                      >
                        <div className="text-center min-w-[44px] bg-white dark:bg-zinc-800 rounded-lg p-1.5 shadow-sm border border-neutral-100 dark:border-neutral-800">
                          <div className="text-[10px] font-bold text-neutral-500">{evt.time}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-neutral-900 dark:text-white">{evt.title}</div>
                          <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                            <MapPin className="w-3 h-3" /> Venue
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
