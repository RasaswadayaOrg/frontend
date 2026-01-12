"use client";

import { useAuth } from "@/context/AuthContext";
import { Heart, Share2, Ticket } from "lucide-react";

export function EventActions() {
  const { user, openAuthModal } = useAuth();

  const handleGetTickets = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    // Proceed to checkout logic
    console.log("Proceeding to ticket selection...");
  };

  const handleInterest = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    // Toggle interest logic
    console.log("Toggled interest");
  };

  return (
    <div className="space-y-3">
      <button 
        onClick={handleGetTickets}
        className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
      >
        <Ticket className="w-5 h-5" />
        Get Tickets
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleInterest}
          className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <Heart className="w-4 h-4" /> Interested
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
}
