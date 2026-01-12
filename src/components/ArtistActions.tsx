"use client";

import { useAuth } from "@/context/AuthContext";

export function ArtistActions() {
  const { user, openAuthModal } = useAuth();

  const handleAction = (action: string) => {
    if (!user) {
      openAuthModal();
      return;
    }
    console.log(`Artist action: ${action}`);
  };

  return (
    <div className="flex gap-3">
      <button 
        onClick={() => handleAction("Follow")}
        className="px-6 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors"
      >
        Follow
      </button>
      <button 
        onClick={() => handleAction("Contact")}
        className="px-6 py-2.5 border border-slate-200 dark:border-zinc-700 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
      >
        Contact
      </button>
    </div>
  );
}
