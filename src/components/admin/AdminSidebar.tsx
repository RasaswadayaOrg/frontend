"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Mic2, 
  School, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  Image as ImageIcon,
  UserCheck,
  FileText
} from "lucide-react";
import { adminLogout } from "@/app/actions/adminAuth";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Artists", href: "/admin/artists", icon: Mic2 },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Organizers", href: "/admin/organizers", icon: UserCheck },
  { name: "Academies", href: "/admin/academies", icon: School },
  { name: "Marketplace", href: "/admin/marketplace", icon: ShoppingBag },
  { name: "Sponsored Ads", href: "/admin/sponsored", icon: ImageIcon },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 md:hidden bg-white dark:bg-zinc-800 rounded-md shadow-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transform transition-transform duration-200 ease-in-out md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-200 dark:border-zinc-800">
            <Link href="/admin" className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Rasaswadaya" 
                width={32} 
                height={32} 
                className="w-8 h-8 dark:brightness-0 dark:invert"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none tracking-tight text-slate-900 dark:text-white font-sinhala">රසාස්වාදය</span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              // Special handling for Dashboard to prevent it from matching sub-routes
              const isActive = item.href === "/admin" 
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");
                
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" 
                      : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
             <div className="flex items-center gap-3 px-3 py-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs">
                    SA
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Super Admin</p>
                    <p className="text-xs text-slate-500">admin@rasas.lk</p>
                </div>
             </div>
            <button
              onClick={() => {
                localStorage.removeItem('admin_token');
                adminLogout();
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
