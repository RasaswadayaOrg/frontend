"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Bell, User, Menu, MapPin, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Header() {
  const pathname = usePathname();
  const { user, openAuthModal, logout } = useAuth();
  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Tier 1: Utility Bar */}
      <div className="w-full bg-brand-600 border-b border-brand-500/20 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm font-ui">
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Rasaswadaya" 
                width={32} 
                height={32} 
                className="w-8 h-8 brightness-0 invert"
              />
              <span className="font-bold text-2xl tracking-tight text-white font-sinhala">රසාස්වාදය</span>
            </Link>
          </div>

          {isHomePage ? (
            <div className="hidden md:flex flex-1 justify-center px-12">
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-500" />
                <input 
                  type="text" 
                  placeholder="Search events, artists..." 
                  className="pl-10 pr-4 py-2 text-sm bg-white text-brand-950 placeholder:text-brand-400 border-none rounded-full focus:ring-2 focus:ring-brand-300 w-full shadow-sm transition-all"
                />
              </div>
            </div>
          ) : (
             <div className="hidden md:flex flex-1" />
          )}
          
          <div className="flex items-center gap-4 shrink-0">
            {user ? (
              <>
                <button className="p-2 hover:bg-brand-500 rounded-full transition-colors">
                  <Bell className="w-5 h-5 text-white" />
                </button>
                <Link href="/profile" className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-brand-700/50 hover:bg-brand-500 rounded-full transition-colors">
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white font-medium text-xs hidden sm:block">{user.name.split(' ')[0]}</span>
                </Link>
              </>
            ) : (
              <button 
                onClick={openAuthModal}
                className="flex items-center gap-2 px-4 py-1.5 bg-white text-brand-700 hover:bg-brand-50 rounded-full font-medium transition-colors text-xs"
              >
                <LogIn className="w-4 h-4" />
                Sign Up / Login
              </button>
            )}
            <button className="md:hidden p-2 hover:bg-brand-500 rounded-full transition-colors">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Primary Nav */}
      <nav className="w-full bg-brand-700 text-white shadow-lg shadow-brand-900/20 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-8 font-ui font-medium text-sm">
          <Link href="/events" className="hover:text-white/80 transition-colors">Events</Link>
          <Link href="/artists" className="hover:text-white/80 transition-colors">Artists</Link>
          <Link href="/academies" className="hover:text-white/80 transition-colors">Academies</Link>
          <Link href="/marketplace" className="hover:text-white/80 transition-colors">Marketplace</Link>
          <Link href="/about" className="hover:text-white/80 transition-colors">About</Link>
        </div>
      </nav>
    </header>
  );
}
