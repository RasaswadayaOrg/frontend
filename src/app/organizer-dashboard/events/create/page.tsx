"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Ticket,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Search,
  Check,
  Send,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export default function CreateEventPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "Music & Concerts",
    date: "2026-03-15",
    time: "",
    venue: "",
    description: "",
    capacity: "",
  });

  const [selectedArtists, setSelectedArtists] = useState<number[]>([]);
  const [sentRequests, setSentRequests] = useState<number[]>([]);

  const mockArtists = [
    { id: 1, name: "Yohani De Silva", role: "Vocalist", avatar: "/api/avatar?name=Yohani", rating: 4.9, genre: "Pop", available: true },
    { id: 2, name: "Bathiya N Santhush", role: "Pop Duo", avatar: "/api/avatar?name=BNS", rating: 4.8, genre: "Pop", available: true },
    { id: 3, name: "Chitral Somapala", role: "Rock Singer", avatar: "/api/avatar?name=Chitral", rating: 4.7, genre: "Rock", available: false },
    { id: 4, name: "Umaria Sinhawansa", role: "Vocalist", avatar: "/api/avatar?name=Umaria", rating: 4.9, genre: "Classical/Pop", available: true },
    { id: 5, name: "Daddy", role: "Band", avatar: "/api/avatar?name=Daddy", rating: 4.6, genre: "Rock/Pop", available: true },
    { id: 6, name: "Kasun Kalhara", role: "Composer/Singer", avatar: "/api/avatar?name=Kasun", rating: 4.9, genre: "Classical", available: false },
  ];

  const totalSteps = 4;
  const stepLabels = ["Basic Info", "Find Artists", "Details & Tickets", "Media & Review"];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const toggleArtist = (id: number) => {
    setSelectedArtists((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  };

  const sendInvites = () => {
    setSentRequests((prev) => [...prev, ...selectedArtists]);
    setSelectedArtists([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Event Created! (Frontend Demo)");
  };

  const inputClass =
    "w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors";

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Create Event</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Step {step} of {totalSteps} — {stepLabels[step - 1]}
        </p>

        {/* Progress */}
        <div className="flex gap-2 mt-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 flex flex-col gap-1.5">
              <div className={`h-1 rounded-full transition-all duration-500 ${step >= i ? "bg-brand-600" : "bg-neutral-200 dark:bg-neutral-800"}`} />
              <span className={`text-[10px] font-medium ${step >= i ? "text-brand-600" : "text-neutral-400"}`}>
                {stepLabels[i - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Colombo Jazz Festival 2026"
                  className={inputClass}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Category</label>
                  <select className={inputClass}>
                    <option>Music & Concerts</option>
                    <option>Art Exhibition</option>
                    <option>Dance Performance</option>
                    <option>Theater & Drama</option>
                    <option>Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Venue</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="text" placeholder="Galle Face Hotel, Colombo" className={`${inputClass} pl-10`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="date"
                      className={`${inputClass} pl-10`}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="time"
                      className={`${inputClass} pl-10`}
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Find Artists */}
          {step === 2 && (
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Available Artists for {formData.date}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="text" placeholder="Search by name, genre..." className={`${inputClass} pl-10`} />
                  </div>
                </div>
                {selectedArtists.length > 0 && (
                  <button
                    type="button"
                    onClick={sendInvites}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-brand-200/40 dark:shadow-none whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" /> Invite {selectedArtists.length}
                  </button>
                )}
              </div>

              <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
                {mockArtists.map((artist) => {
                  const isSelected = selectedArtists.includes(artist.id);
                  const isSent = sentRequests.includes(artist.id);
                  return (
                    <div
                      key={artist.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-brand-300 bg-brand-50/50 dark:bg-brand-900/10 dark:border-brand-700"
                          : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700"
                      } ${!artist.available ? "opacity-40 cursor-not-allowed" : ""}`}
                      onClick={() => artist.available && !isSent && toggleArtist(artist.id)}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800 shadow-sm">
                          <ImageWithFallback src={artist.avatar} alt={artist.name} width={40} height={40} className="object-cover" />
                        </div>
                        {artist.available && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold truncate">{artist.name}</h4>
                          {isSent && (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">
                              INVITED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500">{artist.role} · {artist.genre}</p>
                      </div>
                      {artist.available ? (
                        isSent ? (
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              isSelected ? "bg-brand-600 border-brand-600 text-white" : "border-neutral-300 dark:border-neutral-600"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        )
                      ) : (
                        <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded flex-shrink-0">
                          BUSY
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                <p className="text-xs text-neutral-500 leading-relaxed">
                  <span className="font-semibold text-brand-600">Tip:</span> Invited artists will tentatively block this date. The event is created as a draft until artists accept.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Details & Tickets */}
          {step === 3 && (
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Description</label>
                <textarea
                  rows={5}
                  placeholder="Describe your event…"
                  className={`${inputClass} resize-none`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Capacity</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="number"
                      placeholder="Max attendees"
                      className={`${inputClass} pl-10`}
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Media & Review */}
          {step === 4 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-10 text-center hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer group">
                <div className="w-14 h-14 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6 text-neutral-400 group-hover:text-brand-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-base mb-1">Upload Event Poster</h3>
                <p className="text-neutral-500 text-xs mb-5">1200×630 recommended · PNG, JPG</p>
                <button
                  type="button"
                  className="px-5 py-2 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Browse Files
                </button>
              </div>

              <div className="flex items-start gap-4 p-5 bg-brand-50 dark:bg-brand-900/10 rounded-2xl border border-brand-100/80 dark:border-brand-800/30">
                <div className="p-2 bg-brand-600 rounded-lg flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white text-sm">
                    {sentRequests.length > 0 ? "Create as Draft" : "Publish Event"}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    {sentRequests.length > 0
                      ? `Draft until ${sentRequests.length} invited artist(s) accept.`
                      : "Your event goes live immediately."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 sm:px-8 py-5 bg-neutral-50/80 dark:bg-zinc-800/20 border-t border-neutral-100 dark:border-neutral-800/60 flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <Link
                href="/organizer-dashboard/events"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Cancel
              </Link>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-[0.98]"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-all duration-200 hover:shadow-lg hover:shadow-brand-200/40 dark:hover:shadow-none active:scale-[0.98]"
              >
                {sentRequests.length > 0 ? "Create Draft" : "Publish Event"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
