"use client";

import { useAuth } from "@/context/AuthContext";

export function AcademyActions() {
  const { user, openAuthModal } = useAuth();

  const handleEnquire = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    console.log("Enquire clicked");
  };

  return (
    <>
      <button 
        onClick={handleEnquire}
        className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20 active:scale-95"
      >
        Enquire Now
      </button>
      <p className="text-center text-xs text-slate-400 mt-4">
        Response usually within 24 hours
      </p>
    </>
  );
}
