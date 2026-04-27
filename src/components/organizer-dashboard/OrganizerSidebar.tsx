"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Megaphone,
  Sparkles,
} from "lucide-react";

export function OrganizerSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/organizer-dashboard", icon: LayoutDashboard },
    { name: "My Events", href: "/organizer-dashboard/events", icon: Megaphone },
    { name: "Talent Hunt", href: "/organizer-dashboard/talent", icon: Users },
    { name: "Schedule", href: "/organizer-dashboard/schedule", icon: Calendar },
    { name: "Reports", href: "/organizer-dashboard/reports", icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex flex-col sticky top-24 w-56 h-fit">
      {/* Main Navigation */}
      <nav className="space-y-1">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
          Management
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/organizer-dashboard" && pathname.startsWith(link.href));
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
          href="/organizer-dashboard/settings"
          className="group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200 rounded-xl transition-all duration-200"
        >
          <Settings className="w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors duration-200" />
          Organization
        </Link>
      </div>

      {/* Quick Tip */}
      <div className="mt-8 p-4 bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-900/5 rounded-2xl border border-brand-100/80 dark:border-brand-800/30">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300">Pro Tip</span>
        </div>
        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Use the Talent Hunt to find available artists before creating your event.
        </p>
      </div>
    </aside>
  );
}
