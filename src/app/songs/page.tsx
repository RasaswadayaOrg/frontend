"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { Music } from "lucide-react";
import { SongCard } from "@/components/songs/SongCard";
import { SongDetailModal } from "@/components/songs/SongDetailModal";
import { useSearchParams } from "next/navigation";
import { DesignStyles } from "@/components/hp2/design";
import { HP2Nav, DEFAULT_NAV_LINKS } from "@/components/hp2/Nav";
import { HP2Footer } from "@/components/hp2/Footer";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("rasas_token") : null;
  return token ? { Authorization: "Bearer " + token } : {};
}

function buildHref(base: string, params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const k of Object.keys(params)) { const v = params[k]; if (v) sp.set(k, v); }
  const qs = sp.toString();
  return qs ? base + "?" + qs : base;
}

function SongsContent() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const artistId = searchParams.get("artistId") || "";

  const [songs, setSongs] = useState<Song[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchSongs(); }, [page, artistId]);

  const fetchSongs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "12" });
      if (artistId) params.append("artistId", artistId);
      const response = await fetch(API_BASE_URL + "/v1/songs?" + params, {
        credentials: "include",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch songs");
      const data: SongsResponse = await response.json();
      setSongs(data.songs);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load songs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeUpdate = (songId: string, isLiked: boolean, likesCount: number) => {
    setSongs((prev) => prev.map((s) => s.id === songId ? { ...s, isLiked, likesCount } : s));
    if (selectedSong?.id === songId) setSelectedSong((prev) => prev ? { ...prev, isLiked, likesCount } : null);
  };

  return (
    <section style={{ minHeight: "calc(100vh - 80px)", paddingBottom: 80 }}>
      <header className="hp2-cover" style={{ minHeight: 240, padding: "96px 0 32px" }}>
        <div className="hp2-cover__media hp2-cover__media--pink" aria-hidden />
        <div className="hp2-container">
          <div className="hp2-cover__inner">
            <p className="hp2-cover__kicker">Songs · Music</p>
            <h1 className="hp2-cover__title">Sounds of <em>Sri Lanka.</em></h1>
            <p className="hp2-cover__lede">Stream, like and share original tracks.</p>
          </div>
        </div>
      </header>

      <div className="hp2-container" style={{ paddingTop: 24 }}>

        {/* Loading */}
        {isLoading && (
          <div className="hp2-loading">
            <div className="hp2-spinner hp2-spinner--lg" />
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="hp2-alert hp2-alert--error" style={{ marginBottom: 24 }}>
            <Music size={16} />
            {error}
            <button onClick={fetchSongs} style={{ marginLeft: "auto", textDecoration: "underline", background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 13 }}>
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="hp2-song-grid">
              {songs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onClick={() => setSelectedSong(song)}
                  onLikeUpdate={handleLikeUpdate}
                />
              ))}
            </div>

            {songs.length === 0 && (
              <div className="hp2-empty">
                <div style={{ marginBottom: 12, color: "#9B95B5" }}><Music size={32} /></div>
                <p className="hp2-empty__title">No songs yet</p>
                <p className="hp2-empty__lede">Check back soon for new music from artists.</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav className="hp2-pager" aria-label="Pagination">
                <Link
                  href={buildHref("/songs", { artistId, page: page > 1 ? String(page - 1) : undefined })}
                  className={"hp2-pager__btn" + (page <= 1 ? " hp2-pager__btn--disabled" : "")}
                >← Prev</Link>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === pagination.totalPages || Math.abs(n - page) <= 2)
                  .reduce<(number | "…")[]>((acc, n) => {
                    if (acc.length > 0 && typeof acc[acc.length - 1] === "number" && n - (acc[acc.length - 1] as number) > 1) acc.push("…");
                    acc.push(n); return acc;
                  }, [])
                  .map((n, i) => n === "…"
                    ? <span key={"e" + i} className="hp2-pager__btn hp2-pager__btn--disabled">…</span>
                    : <Link key={n} href={buildHref("/songs", { artistId, page: n === 1 ? undefined : String(n) })}
                        className={"hp2-pager__btn" + (n === page ? " is-active" : "")}
                        aria-current={n === page ? "page" : undefined}>{n}</Link>
                  )}
                <Link
                  href={buildHref("/songs", { artistId, page: page < pagination.totalPages ? String(page + 1) : undefined })}
                  className={"hp2-pager__btn" + (page >= pagination.totalPages ? " hp2-pager__btn--disabled" : "")}
                >Next →</Link>
              </nav>
            )}
          </>
        )}
      </div>

      {selectedSong && (
        <SongDetailModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
          onLikeUpdate={handleLikeUpdate}
        />
      )}
    </section>
  );
}

export default function SongsPage() {
  return (
    <main className="hp2">
      <DesignStyles />
      <HP2Nav links={DEFAULT_NAV_LINKS} activePath="/songs" />
      <Suspense fallback={<div className="hp2-loading"><div className="hp2-spinner hp2-spinner--lg" /></div>}>
        <SongsContent />
      </Suspense>
      <HP2Footer />
    </main>
  );
}
