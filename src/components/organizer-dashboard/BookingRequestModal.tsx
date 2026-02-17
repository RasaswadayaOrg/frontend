"use client";

import { X, Send, DollarSign, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: any;
}

export function BookingRequestModal({ isOpen, onClose, artist }: BookingModalProps) {
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onClose();
    }, 800);
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
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">Select Event</label>
            <select className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors">
              <option>Summer Jazz Festival 2026</option>
              <option>Private Corporate Launch</option>
              <option>Charity Gala Dinner</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                <Clock className="w-3 h-3 inline mr-1" />Duration
              </label>
              <select className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors">
                <option>30 Minutes</option>
                <option>1 Hour</option>
                <option>2 Hours</option>
                <option>Full Event</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">
              <MessageSquare className="w-3 h-3 inline mr-1" />Message (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Share any requirements or details…"
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
