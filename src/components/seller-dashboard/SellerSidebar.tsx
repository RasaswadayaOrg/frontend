"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Package,
  ClipboardList,
  Settings,
  ShoppingBag,
} from "lucide-react";

export function SellerSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/seller-dashboard", icon: LayoutDashboard, exact: true },
    { name: "My Store", href: "/seller-dashboard/store", icon: Store },
    { name: "Products", href: "/seller-dashboard/products", icon: Package },
    { name: "Orders", href: "/seller-dashboard/orders", icon: ClipboardList },
  ];

  return (
    <aside className="hidden md:flex flex-col sticky top-24 w-56 h-fit">
      <nav className="space-y-1">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
          Seller Tools
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 shadow-sm shadow-violet-100/50 dark:shadow-none"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] transition-colors duration-200 ${
                  isActive
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                }`}
              />
              {link.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
          Settings
        </p>
        <Link
          href="/profile"
          className="group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200 rounded-xl transition-all duration-200"
        >
          <Settings className="w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors duration-200" />
          Account
        </Link>
      </div>

      <div className="mt-8 p-4 bg-gradient-to-br from-violet-50 to-fuchsia-50/60 dark:from-violet-900/20 dark:to-fuchsia-900/10 rounded-2xl border border-violet-100/80 dark:border-violet-800/30">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="w-4 h-4 text-violet-600" />
          <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300">Tip</span>
        </div>
        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Keep product photos crisp and stock counts up to date to earn buyer trust.
        </p>
      </div>
    </aside>
  );
}
