"use client";

import {
  Check,
  X,
  Clock,
  MapPin,
  Calendar,
  MessageCircle,
  DollarSign,
} from "lucide-react";
import { ImageWithFallback } from "../ImageWithFallback";

export function BookingRequestList() {
  const requests = [
    {
      id: 1,
      organizer: "Colombo Jazz Festival",
      organizerAvatar: "/api/avatar?name=CJF",
      event: "Sunset Jazz Sessions",
      date: "Feb 28, 2026",
      time: "18:00 – 20:00",
      fee: "LKR 75,000",
      status: "pending",
      venue: "Galle Face Hotel",
      description:
        "We are organizing a sunset session at the terrace. We need a soulful performance for 2 hours.",
    },
    {
      id: 2,
      organizer: "Private Client",
      organizerAvatar: "/api/avatar?name=PC",
      event: "Wedding Reception",
      date: "Mar 15, 2026",
      time: "11:00 – 14:00",
      fee: "LKR 45,000",
      status: "pending",
      venue: "Shangri-La Colombo",
      description:
        "Looking for a vocalist to perform during the lunch reception.",
    },
  ];

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 hover:border-violet-200 dark:hover:border-violet-800/40 transition-all duration-300 hover:shadow-md overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Main content */}
            <div className="flex-1 p-6">
              {/* Organizer row */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={req.organizerAvatar}
                    alt={req.organizer}
                    width={44}
                    height={44}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-white truncate">
                      {req.organizer}
                    </h3>
                    <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Sent a booking request
                  </p>
                </div>
              </div>

              {/* Event title */}
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5">
                {req.event}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-5">
                {req.description}
              </p>

              {/* Details */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <Calendar className="w-3.5 h-3.5 text-violet-500" />
                  {req.date}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-violet-500" />
                  {req.time}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <MapPin className="w-3.5 h-3.5 text-violet-500" />
                  {req.venue}
                </div>
              </div>
            </div>

            {/* Actions panel */}
            <div className="p-6 bg-neutral-50/80 dark:bg-zinc-800/20 border-t lg:border-t-0 lg:border-l border-neutral-100 dark:border-neutral-800/60 flex flex-col justify-between items-center min-w-[200px]">
              <div className="text-center mb-5">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Proposed Fee
                </div>
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {req.fee}
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  After platform fees
                </div>
              </div>

              <div className="w-full space-y-2">
                <button className="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 active:scale-[0.98]">
                  <Check className="w-4 h-4" /> Accept Gig
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" /> Chat
                  </button>
                  <button className="px-3 py-2.5 border border-rose-200 dark:border-rose-900/30 text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
