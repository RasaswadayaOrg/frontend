"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, Bell, Search, Command } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useState } from "react";

export function ArtistHeader() {
  const { user } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/artist-dashboard" className="flex items-center gap-2.5 flex-shrink-0 group">
          <Image
            src="/logo.png"
            alt="Rasaswadaya"
            width={32}
            height={32}
            className="w-8 h-8 dark:invert transition-transform duration-300 group-hover:scale-105"
          />
          <div className="hidden md:flex flex-col">
            <span className="font-bold text-base tracking-tight font-sinhala leading-none">
              රසාස්වාදය
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400 mt-0.5">
              Artist Studio
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className={`relative w-full transition-all duration-300 ${searchFocused ? "scale-[1.02]" : ""}`}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search your content…"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-16 py-2 text-sm bg-neutral-100/80 dark:bg-zinc-800/80 border border-transparent focus:border-violet-200 dark:focus:border-violet-800 rounded-xl outline-none transition-all duration-300 placeholder:text-neutral-400"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 bg-white dark:bg-zinc-700 border border-neutral-200 dark:border-neutral-600 rounded-md shadow-sm">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </Link>

          <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-700 mx-1 hidden sm:block" />

          <button className="relative p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
          </button>

          <Link
            href="/artist-dashboard/profile"
            className="flex items-center gap-2.5 ml-1 pl-1 pr-2 py-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 p-[2px] shadow-sm">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900">
                <ImageWithFallback
                  src={user?.avatarUrl || "/api/avatar"}
                  alt="Me"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <span className="hidden md:block text-xs font-semibold text-neutral-700 dark:text-neutral-200">
              {user?.name?.split(" ")[0] || "Artist"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
