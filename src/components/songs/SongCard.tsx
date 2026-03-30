"use client";

import { useState } from "react";
import { Heart, MessageCircle, Play } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Artist {
  id: string;
  name: string;
  photoUrl: string | null;
  genre: string | null;
}

interface Song {
  id: string;
  title: string | null;
  content: string | null;
  imageUrl: string;
  videoUrl: string | null;
  publishedAt: string;
  artist: Artist;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

interface SongCardProps {
  song: Song;
  onClick: () => void;
  onLikeUpdate: (songId: string, isLiked: boolean, likesCount: number) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function SongCard({ song, onClick, onLikeUpdate }: SongCardProps) {
  const { user, openAuthModal } = useAuth();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      openAuthModal();
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const endpoint = song.isLiked 
        ? `${API_BASE_URL}/v1/songs/${song.id}/like`
        : `${API_BASE_URL}/v1/songs/${song.id}/like`;
      
      const token = localStorage.getItem("rasas_token");
      const response = await fetch(endpoint, {
        method: song.isLiked ? "DELETE" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        onLikeUpdate(song.id, data.liked, data.likesCount);
      }
    } catch (error) {
      console.error("Error liking song:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const hasVideo = !!song.videoUrl;

  return (
    <div
      onClick={onClick}
      className="group rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all cursor-pointer"
    >
      {/* Image Container */}
      <div className="aspect-square bg-slate-200 dark:bg-zinc-800 relative overflow-hidden">
        <img
          src={song.imageUrl}
          alt={song.title || "Song"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/400x400?text=No+Image";
          }}
        />
        
        {/* Play Icon Overlay for videos */}
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-brand-600 ml-1" fill="currentColor" />
            </div>
          </div>
        )}
        
        {/* Genre Badge */}
        {song.artist.genre && (
          <span className="absolute top-3 left-3 bg-brand-600/90 text-white px-2 py-1 rounded-md text-xs font-medium">
            {song.artist.genre}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-1 text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 transition-colors">
          {song.title || "Untitled"}
        </h3>

        {/* Artist */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-700 overflow-hidden">
            {song.artist.photoUrl ? (
              <img
                src={song.artist.photoUrl}
                alt={song.artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <span className="text-xs">{song.artist.name.charAt(0)}</span>
              </div>
            )}
          </div>
          <span className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-1">
            {song.artist.name}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                song.isLiked
                  ? "text-red-500"
                  : "text-slate-500 dark:text-zinc-400 hover:text-red-500"
              }`}
            >
              <Heart 
                className={`w-5 h-5 ${isLiking ? "animate-pulse" : ""}`}
                fill={song.isLiked ? "currentColor" : "none"}
              />
              <span>{song.likesCount}</span>
            </button>

            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-zinc-400">
              <MessageCircle className="w-5 h-5" />
              <span>{song.commentsCount}</span>
            </div>
          </div>

          <span className="text-xs text-slate-400 dark:text-zinc-500">
            {new Date(song.publishedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
