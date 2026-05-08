"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Ticket,
  TrendingUp,
  User,
  Newspaper,
  Settings,
  Music,
} from "lucide-react";

export function ArtistSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Feed", href: "/artist-dashboard/feed", icon: Newspaper },
    { name: "Calendar", href: "/artist-dashboard/calendar", icon: Calendar },
    { name: "Bookings", href: "/artist-dashboard/bookings", icon: Ticket },
    { name: "Trends", href: "/artist-dashboard/trends", icon: TrendingUp },
    { name: "Profile", href: "/artist-dashboard/profile", icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col sticky top-24 w-56 h-fit">
      {/* Main Navigation */}
      <nav className="space-y-1">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
          Artist Tools
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 shadow-sm shadow-brand-100/50 dark:shadow-none"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] transition-colors duration-200 ${
                  isActive
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                }`}
              />
              {link.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="mt-8">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
          Settings
        </p>
        <Link
          href="/artist-dashboard/settings"
          className="group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200 rounded-xl transition-all duration-200"
        >
          <Settings className="w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors duration-200" />
          Account
        </Link>
      </div>

      {/* Tip */}
      <div className="mt-8 p-4 bg-gradient-to-br from-brand-50 to-fuchsia-50/50 dark:from-brand-900/20 dark:to-fuchsia-900/10 rounded-2xl border border-brand-100/80 dark:border-brand-800/30">
        <div className="flex items-center gap-2 mb-2">
          <Music className="w-4 h-4 text-brand-600" />
          <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300">Tip</span>
        </div>
        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Keep your calendar updated so organizers can see your availability.
        </p>
      </div>
    </aside>
  );
}
