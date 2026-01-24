"use client";

import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";
import { AuthFlow } from "./AuthFlow";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
      >
        <button
            onClick={closeAuthModal}
            className="absolute top-6 right-6 z-10 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
            <X size={20} />
        </button>
        <AuthFlow isModal onClose={closeAuthModal} onComplete={closeAuthModal} />
      </div>
    </div>
  );
}
