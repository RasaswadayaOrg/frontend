"use client";

import { X, Send, Clock, MessageSquare, CalendarIcon, MapPin } from "lucide-react";
import { useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: any;
}

export function BookingRequestModal({ isOpen, onClose, artist }: BookingModalProps) {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    time: "",
    venue: "",
    description: ""
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!formData.eventName || !formData.date || !formData.time || !formData.venue) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSending(true);
      setError(null);
      
      const token = localStorage.getItem("rasas_token") || sessionStorage.getItem("rasas_token");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/v1/booking-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          artistId: artist?.id
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send booking request');
      }

      setSending(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800/60 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">Booking Request</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        {/* Artist Info */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-brand-700 dark:text-brand-300">
                {artist?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-neutral-900 dark:text-white truncate">{artist?.name}</h4>
              <p className="text-xs text-brand-600 font-medium">{artist?.role}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-5 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">Event Name <span className="text-red-500">*</span></label>
            <input 
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData({...formData, eventName: e.target.value})}
              placeholder="E.g., Summer Jazz Festival 2026"
              className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                <CalendarIcon className="w-3 h-3 inline mr-1" />Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                <Clock className="w-3 h-3 inline mr-1" />Time <span className="text-red-500">*</span>
              </label>
              <input 
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">
              <MapPin className="w-3 h-3 inline mr-1" />Venue <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
              placeholder="Event Location or Venue Name"
              className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">
              <MessageSquare className="w-3 h-3 inline mr-1" />Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Share event requirements or details…"
              className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 dark:bg-zinc-800/30 border-t border-neutral-100 dark:border-neutral-800/60 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-200/40 dark:hover:shadow-none active:scale-[0.98]"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {sending ? "Sending…" : "Send Offer"}
          </button>
        </div>
      </div>
    </div>
  );
}
