"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Music, Heart, MessageCircle, User2 } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { SongCard } from "@/components/songs/SongCard";
import { SongDetailModal } from "@/components/songs/SongDetailModal";
import { FilterList } from "@/components/FilterList";
import { useSearchParams } from "next/navigation";

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

interface SongsResponse {
  songs: Song[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("rasas_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function SongsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const artistId = searchParams.get("artistId") || "";
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSongs();
  }, [page, artistId]);

  const fetchSongs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      });
      if (artistId) {
        params.append("artistId", artistId);
      }
      
      const response = await fetch(`${API_BASE_URL}/v1/songs?${params}`, {
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch songs");
      }
      
      const data: SongsResponse = await response.json();
      setSongs(data.songs);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Failed to load songs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongClick = (song: Song) => {
    setSelectedSong(song);
  };

  const handleCloseModal = () => {
    setSelectedSong(null);
  };

  const handleLikeUpdate = (songId: string, isLiked: boolean, likesCount: number) => {
    setSongs(prev => prev.map(song => 
      song.id === songId 
        ? { ...song, isLiked, likesCount }
        : song
    ));
    if (selectedSong?.id === songId) {
      setSelectedSong(prev => prev ? { ...prev, isLiked, likesCount } : null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Music className="w-8 h-8 text-brand-600" />
            Songs & Music
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">
            Discover music from talented Sri Lankan artists. Like, comment, and follow your favorites!
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchSongs}
            className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Songs Grid */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onClick={() => handleSongClick(song)}
                onLikeUpdate={handleLikeUpdate}
              />
            ))}
          </div>

          {songs.length === 0 && (
            <div className="text-center py-16">
              <Music className="w-16 h-16 mx-auto text-slate-300 dark:text-zinc-600 mb-4" />
              <p className="text-slate-500 dark:text-zinc-400">No songs found</p>
              <p className="text-sm text-slate-400 dark:text-zinc-500 mt-2">
                Check back later for new music from artists!
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination 
              currentPage={pagination.page} 
              totalPages={pagination.totalPages} 
              baseUrl="/songs" 
            />
          )}
        </>
      )}

      {/* Song Detail Modal */}
      {selectedSong && (
        <SongDetailModal
          song={selectedSong}
          onClose={handleCloseModal}
          onLikeUpdate={handleLikeUpdate}
        />
      )}
    </div>
  );
}
