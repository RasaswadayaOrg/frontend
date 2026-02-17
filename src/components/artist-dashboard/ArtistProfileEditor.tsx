"use client";

import { useAuth } from "@/context/AuthContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { FacebookConnect } from "./FacebookConnect";
import { useState, useEffect } from "react";
import {
  Camera,
  MapPin,
  Globe,
  Instagram,
  Youtube,
  Link as LinkIcon,
  Save,
} from "lucide-react";

export function ArtistProfileEditor() {
  const { user } = useAuth();
  const [artist, setArtist] = useState<any>(null);

  useEffect(() => {
    // Only fetch if we have a user and don't have artist data yet
    if (user && !artist) {
      const fetchArtist = async () => {
         try {
             const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
             const token = localStorage.getItem('rasas_token');
             
             if (!token) {
               console.log("No token found, skipping artist fetch");
               return;
             }

             const res = await fetch(`${API_URL}/artists/me`, {
                 headers: {
                     'Authorization': `Bearer ${token}`
                 }
             });
             
             if (res.ok) {
                 const data = await res.json();
                 setArtist(data);
             } else {
                 console.log("Artist profile not found for user, status:", res.status);
             }
         } catch (e) {
             console.error("Failed to fetch artist profile:", e);
         }
      };
      fetchArtist();
    }
  }, [user, artist]);

  const inputClass =
    "w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-300 dark:focus:border-violet-700 transition-colors";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
      {/* Cover */}
      <div className="h-44 bg-gradient-to-r from-violet-500 to-fuchsia-500 relative">
        <button className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors">
          <Camera className="w-3.5 h-3.5" /> Change Cover
        </button>
      </div>

      <div className="px-6 sm:px-8 pb-8">
        {/* Avatar & Save */}
        <div className="relative -mt-14 mb-6 flex justify-between items-end">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl border-4 border-white dark:border-zinc-900 overflow-hidden bg-neutral-200 shadow-lg">
              <ImageWithFallback
                src={user?.avatarUrl || "/api/avatar"}
                alt="Avatar"
                width={112}
                height={112}
                className="object-cover h-full w-full"
              />
            </div>
            <button className="absolute bottom-1 right-1 bg-white dark:bg-zinc-800 p-1.5 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 transition-colors">
              <Camera className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-200/40 dark:hover:shadow-none active:scale-[0.98]">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                defaultValue={user?.name || "Your Name"}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Professional Title
              </label>
              <input
                type="text"
                placeholder="e.g. Classical Violinist"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Bio
              </label>
              <textarea
                rows={4}
                placeholder="Tell organizers about your style and experience…"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold mb-3.5 text-neutral-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-violet-500" /> Location &
                Availability
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                    City
                  </label>
                  <input type="text" placeholder="Colombo" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                    Travel Range
                  </label>
                  <select className={inputClass}>
                    <option>Within City</option>
                    <option>Island-wide</option>
                    <option>International</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold mb-3.5 text-neutral-900 dark:text-white flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-violet-500" /> Social Links
              </h3>
              <div className="space-y-2.5">
                <div className="relative">
                  <Instagram className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Instagram username"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Youtube className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="YouTube channel URL"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Portfolio website"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Facebook Integration - always visible */}
        <FacebookConnect 
          artistId={artist?.id || null} 
          isConnected={!!artist?.fbPageId} 
        />
      </div>
    </div>
  );
}
