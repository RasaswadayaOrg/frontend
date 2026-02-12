"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Megaphone,
  BarChart3,
} from "lucide-react";

export function OrganizerMobileNav() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/organizer-dashboard", icon: LayoutDashboard },
    { name: "Events", href: "/organizer-dashboard/events", icon: Megaphone },
    { name: "Talent", href: "/organizer-dashboard/talent", icon: Users },
    { name: "Schedule", href: "/organizer-dashboard/schedule", icon: Calendar },
    { name: "Stats", href: "/organizer-dashboard/reports", icon: BarChart3 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-neutral-200/60 dark:border-neutral-800/60 pb-safe">
      <nav className="flex items-center justify-around h-16 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/organizer-dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "" : ""}`} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-600 dark:bg-brand-400" />
                )}
              </div>
              <span className={`text-[10px] leading-tight ${isActive ? "font-semibold" : "font-medium"}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
