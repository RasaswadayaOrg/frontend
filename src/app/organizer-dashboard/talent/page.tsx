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
} from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useState } from "react";
import { BookingRequestModal } from "@/components/organizer-dashboard/BookingRequestModal";
import { format, addDays, isSameDay } from "date-fns";

export default function TalentHuntPage() {
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const genres = [
    "All",
    "Vocalist",
    "Sitar Player",
    "Jazz Band",
    "Kandyan Dancer",
    "Traditional Drummers",
    "Rock Singer",
    "Violinist",
  ];

  const artists = [
    { name: "Yohani De Silva", role: "Vocalist", rating: 4.9, location: "Colombo", price: "LKR 75k/event", genre: "Vocalist", availableDates: [addDays(new Date(), 2), addDays(new Date(), 5)] },
    { name: "Ravi Shankar", role: "Sitar Player", rating: 4.9, location: "Colombo", price: "LKR 25k/hr", genre: "Sitar Player", availableDates: [addDays(new Date(), 1), addDays(new Date(), 3)] },
    { name: "Bathiya N Santhush", role: "Pop Duo", rating: 4.8, location: "Colombo", price: "LKR 150k/event", genre: "Vocalist", availableDates: [addDays(new Date(), 4), addDays(new Date(), 7)] },
    { name: "Amara Perera", role: "Kandyan Dancer", rating: 4.8, location: "Kandy", price: "LKR 15k/hr", genre: "Kandyan Dancer", availableDates: [addDays(new Date(), 1), addDays(new Date(), 2)] },
    { name: "The Jazz Cats", role: "Jazz Band", rating: 5.0, location: "Negombo", price: "LKR 50k/hr", genre: "Jazz Band", availableDates: [addDays(new Date(), 3), addDays(new Date(), 6)] },
    { name: "Saman & Sons", role: "Traditional Drummers", rating: 4.7, location: "Galle", price: "LKR 20k/hr", genre: "Traditional Drummers", availableDates: [addDays(new Date(), 2), addDays(new Date(), 8)] },
  ];

  const filteredArtists = artists.filter((artist) => {
    const matchesGenre = selectedGenre === "All" || artist.genre === selectedGenre;
    const matchesSearch =
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || artist.availableDates.some((d) => isSameDay(d, selectedDate));
    return matchesGenre && matchesSearch && matchesDate;
  });

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
            {filteredArtists.length} <span className="font-normal text-neutral-500">artists match</span>
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
                    className="w-full pl-10 pr-3 py-2 bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
                    onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
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

              {/* Genre Filter */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-2">Category</label>
                <div className="space-y-0.5">
                  {genres.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                        selectedGenre === g
                          ? "bg-brand-600 text-white shadow-sm"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
            />
          </div>

          {/* Date Quick Picks */}
          {!selectedDate && (
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60">
              <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Quick Date Pick
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((offset) => {
                  const date = addDays(new Date(), offset);
                  const count = artists.filter((a) => a.availableDates.some((d) => isSameDay(d, date))).length;
                  return (
                    <button
                      key={offset}
                      onClick={() => setSelectedDate(date)}
                      className="flex-shrink-0 w-16 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 text-center hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="text-[10px] uppercase font-semibold text-neutral-400">{format(date, "eee")}</div>
                      <div className="text-base font-bold text-neutral-900 dark:text-white my-0.5">{format(date, "d")}</div>
                      <div
                        className={`text-[9px] font-semibold px-1 py-0.5 rounded ${
                          count > 0 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-neutral-50 text-neutral-400 dark:bg-neutral-800"
                        }`}
                      >
                        {count} free
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Artist Cards */}
          {filteredArtists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredArtists.map((artist, i) => (
                <div
                  key={i}
                  className="group bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Top row: avatar + price */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <ImageWithFallback src={`/api/avatar?name=${artist.name}`} alt={artist.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="bg-brand-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm">
                          {artist.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">{artist.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight mb-0.5">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-brand-600 font-medium mb-3">{artist.role}</p>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg text-[11px] font-medium text-neutral-500">
                        <MapPin className="w-3 h-3 text-brand-500" />
                        {artist.location}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg text-[11px] font-medium text-neutral-500">
                        <Music className="w-3 h-3 text-brand-500" />
                        {artist.genre}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-5 pt-1 flex gap-2">
                    <button className="flex-1 py-2.5 text-xs font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setSelectedArtist(artist);
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
                <Users className="w-5 h-5 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">No artists found</h3>
              <p className="text-sm text-neutral-500 mb-4">Try adjusting your filters or date.</p>
              <button
                onClick={() => { setSelectedGenre("All"); setSelectedDate(null); setSearchQuery(""); }}
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
