"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ArtistActionsProps {
  artistId: string;
  initialIsFollowing?: boolean;
}

export function ArtistActions({ artistId, initialIsFollowing = false }: ArtistActionsProps) {
  const { user, openAuthModal } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  // Check follow status client-side when user is logged in
  useEffect(() => {
    if (!user) return;

    const checkFollowStatus = async () => {
      setChecking(true);
      try {
        const token = localStorage.getItem("rasas_token");
        const res = await fetch(`${API_URL}/artists/${artistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setIsFollowing(data.data?.isFollowing || false);
        }
      } catch (err) {
        console.error("Failed to check follow status:", err);
      } finally {
        setChecking(false);
      }
    };

    checkFollowStatus();
  }, [user, artistId, API_URL]);

  const handleFollow = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("rasas_token");
      const method = isFollowing ? "DELETE" : "POST";

      const res = await fetch(`${API_URL}/artists/${artistId}/follow`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
      } else {
        const data = await res.json();
        console.error("Follow/unfollow failed:", data.error || data.message);
      }
    } catch (err) {
      console.error("Follow/unfollow error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    console.log(`Contact artist: ${artistId}`);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleFollow}
        disabled={loading || checking}
        className={`px-6 py-2.5 font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 ${
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
  );
}
