"use client";

import {
  Users,
  Search,
  MapPin,
  Star,
  Music,
  Filter,
  Calendar as CalendarIcon,
  X,
  Target,
  Loader2,
  CheckCircle2,
  CalendarX2,
} from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useState, useEffect, useCallback, useRef } from "react";
import { BookingRequestModal } from "@/components/organizer-dashboard/BookingRequestModal";
import { format, addDays, isSameDay } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface Artist {
  id: string;
  name: string;
  profession: string;
  genre: string;
  bio?: string;
  photoUrl?: string;
  location?: string;
  followerCount: number;
  busyDates: string[];
}

export default function TalentHuntPage() {
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [professions, setProfessions] = useState<string[]>([]);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem("rasas_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch all artists once to extract distinct professions + for quick date free counts
  const fetchProfessions = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/artists/talent-hunt?limit=50`, {
        headers: { ...getAuthHeader() },
      });
      if (res.ok) {
        const data = await res.json();
        const all: Artist[] = data.data || [];
        setAllArtists(all);
        const uniqueProfs = Array.from(new Set(all.map((a) => a.profession).filter(Boolean)));
        uniqueProfs.sort();
        setProfessions(uniqueProfs);
      }
    } catch (e) {
      console.error("Failed to fetch professions", e);
    }
  }, []);

  // Fetch artists with filters
  const fetchArtists = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      if (selectedProfession !== "All") {
        params.set("profession", selectedProfession);
      }
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }
      if (selectedDate) {
        params.set("date", format(selectedDate, "yyyy-MM-dd"));
      }

      const res = await fetch(`${API_URL}/artists/talent-hunt?${params.toString()}`, {
        headers: { ...getAuthHeader() },
      });

      if (res.ok) {
        const data = await res.json();
        setArtists(data.data || []);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (e) {
      console.error("Failed to fetch artists", e);
    } finally {
      setLoading(false);
    }
  }, [selectedProfession, searchQuery, selectedDate]);

  useEffect(() => {
    fetchProfessions();
  }, [fetchProfessions]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(value);
    }, 400);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // Count free artists per day for quick date pick (using allArtists with busyDates)
  const getFreeCountForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return allArtists.filter((a) => !a.busyDates?.includes(dateStr)).length;
  };

  // Check if an artist is free on the selected date
  const isArtistFreeOnDate = (artist: Artist, date: Date | null) => {
    if (!date) return true;
    const dateStr = format(date, "yyyy-MM-dd");
    return !artist.busyDates?.includes(dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Talent Hunt</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Discover and book verified artists for your next event.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-brand-50 dark:bg-brand-900/10 border border-brand-100/80 dark:border-brand-800/30 rounded-xl">
          <Target className="w-4 h-4 text-brand-600" />
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            {totalCount} <span className="font-normal text-neutral-500">artists match</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-brand-600" /> Filters
              </h3>

              {/* Date Filter */}
              <div className="mb-5">
                <label className="block text-[11px] font-medium text-neutral-500 mb-2">Event Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="date"
                    value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                    className="w-full pl-10 pr-3 py-2 bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
                    onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value + "T00:00:00") : null)}
                  />
                </div>
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="mt-2 text-[11px] font-medium text-rose-500 flex items-center gap-1 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" /> Clear date
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-2">Category</label>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setSelectedProfession("All")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                      selectedProfession === "All"
                        ? "bg-brand-600 text-white shadow-sm"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    }`}
                  >
                    All
                  </button>
                  {professions.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedProfession(p)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                        selectedProfession === p
                          ? "bg-brand-600 text-white shadow-sm"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-100/60 dark:border-brand-800/30 p-4 rounded-2xl">
              <h4 className="text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">💡 Pro Tip</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Use the Talent Hunt to find available artists before creating your event.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search artists by name, skill, or instrument..."
              defaultValue={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
            />
          </div>

          {/* Quick Date Pick */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60">
            <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              Quick Date Pick
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((offset) => {
                const date = addDays(new Date(), offset);
                const freeCount = getFreeCountForDate(date);
                const isActive = selectedDate && isSameDay(date, selectedDate);
                return (
                  <button
                    key={offset}
                    onClick={() => setSelectedDate(isActive ? null : date)}
                    className={`flex-shrink-0 w-16 p-2.5 rounded-xl border text-center transition-all duration-200 hover:shadow-sm ${
                      isActive
                        ? "border-brand-400 dark:border-brand-600 bg-brand-50 dark:bg-brand-900/20 shadow-sm"
                        : "border-neutral-100 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700"
                    }`}
                  >
                    <div className="text-[10px] uppercase font-semibold text-neutral-400">{format(date, "eee")}</div>
                    <div className={`text-base font-bold my-0.5 ${isActive ? "text-brand-600" : "text-neutral-900 dark:text-white"}`}>
                      {format(date, "d")}
                    </div>
                    <div
                      className={`text-[9px] font-semibold px-1 py-0.5 rounded ${
                        freeCount > 0
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                          : "bg-neutral-50 text-neutral-400 dark:bg-neutral-800"
                      }`}
                    >
                      {freeCount} free
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active date filter indicator */}
          {selectedDate && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-50 dark:bg-brand-900/10 border border-brand-100/60 dark:border-brand-800/30 rounded-xl">
              <CalendarIcon className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Showing artists <span className="font-bold text-brand-600">free</span> on{" "}
                <span className="font-semibold">{format(selectedDate, "EEEE, MMM d, yyyy")}</span>
              </span>
              <button
                onClick={() => setSelectedDate(null)}
                className="ml-auto text-[11px] font-medium text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            </div>
          )}

          {/* Artist Cards */}
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600 mb-3" />
              <p className="text-sm text-neutral-500">Loading artists...</p>
            </div>
          ) : artists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {artists.map((artist) => (
                <div
                  key={artist.id}
                  className="group bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Top row: avatar + rating */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative w-14 h-14 rounded-2xl bg-brand-600 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300 flex items-center justify-center">
                        {artist.photoUrl ? (
                          <ImageWithFallback src={artist.photoUrl} alt={artist.name} fill className="object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-white">{getInitials(artist.name)}</span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {artist.followerCount > 0 ? Math.min(5, 4 + artist.followerCount * 0.01).toFixed(1) : "New"}
                          </span>
                        </div>
                        {/* Availability badge */}
                        {selectedDate && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Free
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight mb-0.5">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-brand-600 font-medium mb-3">{artist.profession}</p>

                    <div className="flex flex-wrap gap-2">
                      {artist.location && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg text-[11px] font-medium text-neutral-500">
                          <MapPin className="w-3 h-3 text-brand-500" />
                          {artist.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg text-[11px] font-medium text-neutral-500">
                        <Music className="w-3 h-3 text-brand-500" />
                        {artist.profession}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-5 pt-1 flex gap-2">
                    <button
                      onClick={() => window.open(`/artists/${artist.id}`, "_blank")}
                      className="flex-1 py-2.5 text-xs font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setSelectedArtist({ ...artist, role: artist.profession });
                        setIsModalOpen(true);
                      }}
                      className="flex-[2] py-2.5 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 active:scale-[0.98]"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                {selectedDate ? (
                  <CalendarX2 className="w-5 h-5 text-neutral-400" />
                ) : (
                  <Users className="w-5 h-5 text-neutral-400" />
                )}
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
                {selectedDate ? "No artists free on this date" : "No artists found"}
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                {selectedDate
                  ? "All artists have events scheduled. Try a different date."
                  : "Try adjusting your filters or search."}
              </p>
              <button
                onClick={() => { setSelectedProfession("All"); setSelectedDate(null); setSearchQuery(""); }}
                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      <BookingRequestModal
        isOpen={isModalOpen}
        artist={selectedArtist || {}}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
