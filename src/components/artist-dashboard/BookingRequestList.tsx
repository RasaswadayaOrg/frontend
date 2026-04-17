"use client";

import {
  Check,
  X,
  Clock,
  MapPin,
  Calendar,
  Phone,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "../ImageWithFallback";
import { useEffect, useState } from "react";

export function BookingRequestList() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("rasas_token") || sessionStorage.getItem("rasas_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/v1/booking-requests/artist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRequests(data.data || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load booking requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem("rasas_token") || sessionStorage.getItem("rasas_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/v1/booking-requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      // refresh list
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Error updating booking status");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  if (requests.length === 0) {
    return <div className="py-20 text-center text-neutral-500">No booking requests found.</div>;
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 hover:border-violet-200 dark:hover:border-violet-800/40 transition-all duration-300 hover:shadow-md overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Main content */}
            <div className="flex-1 p-5 md:p-7">
              {/* Organizer row with Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <ImageWithFallback
                      src={req.organizer?.avatarUrl || `/api/avatar?name=${req.organizer?.fullName}`}
                      alt={req.organizer?.fullName || "Organizer"}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-neutral-900 dark:text-white truncate text-[15px]">
                        {req.organizer?.fullName || "A Organizer"}
                      </h3>
                      {req.status === 'PENDING' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold tracking-tight">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 font-medium">
                      Sent a booking request
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${
                    req.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}>
                    {req.status}
                  </span>
                </div>
              </div>

              {/* Event title */}
              <div className="space-y-2 mb-6">
                <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">
                  {req.eventName}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {req.description}
                </p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50/50 dark:bg-zinc-800/30 border border-neutral-100 dark:border-neutral-800/40">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase leading-none mb-1">Date</p>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">{new Date(req.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50/50 dark:bg-zinc-800/30 border border-neutral-100 dark:border-neutral-800/40">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase leading-none mb-1">Time</p>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">{req.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50/50 dark:bg-zinc-800/30 border border-neutral-100 dark:border-neutral-800/40">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase leading-none mb-1">Venue</p>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">{req.venue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions panel */}
            <div className="p-5 lg:p-6 bg-neutral-50/50 dark:bg-zinc-800/20 border-t lg:border-t-0 lg:border-l border-neutral-100 dark:border-neutral-800/60 flex items-center justify-center min-w-[240px]">
              <div className="w-full flex flex-col gap-3">
                {req.status === 'PENDING' ? (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                      disabled={actionLoading === req.id}
                      className="w-full py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl text-[13px] font-bold flex items-center justify-center gap-2.5 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 active:scale-[0.98] shadow-sm disabled:opacity-50"
                    >
                      {actionLoading === req.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />} 
                      <span>Accept Gig</span>
                    </button>
                    
                    <button 
                      onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                      disabled={actionLoading === req.id}
                      className="w-full py-3 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2.5 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {actionLoading === req.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                      <span>Decline</span>
                    </button>
                  </>
                ) : (
                   <div className="w-full py-3 text-center text-sm font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700/50">
                      Offer {req.status}
                   </div>
                )}

                <div className="pt-2 mt-2 border-t border-neutral-200/50 dark:border-neutral-800/50">
                  <button className="w-full py-3 bg-white dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2.5 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-all shadow-sm text-neutral-600 dark:text-neutral-300">
                    <Phone className="w-4 h-4 text-violet-500" /> 
                    <span>Call Organizer</span>
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
