"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { BookingRequestModal } from "@/components/organizer-dashboard/BookingRequestModal";
import { Loader2 } from "lucide-react";

interface ArtistActionsProps {
  artistId: string;
  artistName: string;
  artistProfession?: string | null;
  initialIsFollowing?: boolean;
  initialFollowerCount?: number;
}

export function ArtistActions({ artistId, artistName, artistProfession, initialIsFollowing = false, initialFollowerCount }: ArtistActionsProps) {
  const { user, openAuthModal } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState<number | undefined>(initialFollowerCount);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [message, setMessage] = useState<{ type: "info" | "error"; text: string } | null>(null);

  // Check follow status client-side when user is logged in
  useEffect(() => {
    if (!user) return;

    const checkFollowStatus = async () => {
      setChecking(true);
      try {
        const res = await apiFetch<any>(`/artists/${artistId}`);
        if (res.ok) {
          setIsFollowing(res.data?.isFollowing || false);
        }
      } catch (err) {
        console.error("Failed to check follow status:", err);
      } finally {
        setChecking(false);
      }
    };

    checkFollowStatus();
  }, [user, artistId]);

  const handleFollow = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await apiFetch(`/artists/${artistId}/follow`, { method });

      if (res.ok) {
        const nowFollowing = !isFollowing;
        setIsFollowing(nowFollowing);
        setFollowerCount((c) => c !== undefined ? c + (nowFollowing ? 1 : -1) : undefined);
        window.dispatchEvent(new CustomEvent("artistFollowChanged", { detail: { artistId, delta: nowFollowing ? 1 : -1 } }));
      } else {
        setMessage({ type: "error", text: res.error || "Could not update follow status." });
      }
    } catch (err) {
      console.error("Follow/unfollow error:", err);
      setMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    const role = user.role?.toUpperCase();
    if (role !== "ORGANIZER" && role !== "ADMIN") {
      setMessage({ type: "info", text: "Create an organiser account to book artists." });
      return;
    }

    setMessage(null);
    setShowBookingModal(true);
  };

  return (
    <>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <button
          onClick={handleFollow}
          disabled={loading || checking}
          className={`px-6 py-2.5 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
            isFollowing
              ? "border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800"
              : "bg-brand-600 text-white hover:bg-brand-700"
          }`}
        >
          {(loading || checking) && <Loader2 className="w-4 h-4 animate-spin" />}
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
        <button
          onClick={handleContact}
          className="px-6 py-2.5 border border-slate-200 dark:border-zinc-700 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Contact
        </button>
      </div>

      {message && (
        <p className={`mt-2 text-sm ${message.type === "error" ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-zinc-400"}`}>
          {message.text}
        </p>
      )}

      <BookingRequestModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        artist={{ id: artistId, name: artistName, role: artistProfession || "Artist" }}
      />
    </>
  );
}
