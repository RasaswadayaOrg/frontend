"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Bell, User, Menu, LogIn, Loader2, X, LayoutDashboard, ShoppingBag, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useRef } from "react";
import { getSearchSuggestions, type SearchSuggestionsResult } from "@/app/actions/search";
import { ImageWithFallback } from "./ImageWithFallback";

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const { user, openAuthModal } = useAuth();
  const { itemCount } = useCart();
  
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestionsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (term.trim().length >= 2) {
        setIsLoading(true);
        const results = await getSearchSuggestions(term);
        setSuggestions(results);
        setIsLoading(false);
        setShowSuggestions(true);
      } else {
        setSuggestions(null);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [term]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams(); 
    
    if (term) {
      params.set('q', term);
      replace(`/search?${params.toString()}`);
    } else {
      replace('/');
    }
  }

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setTerm(""); 
  }

  const hasSuggestions = suggestions && (
    suggestions.events.length > 0 || 
    suggestions.artists.length > 0 || 
    suggestions.products.length > 0 || 
    suggestions.academies.length > 0
  );

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

          <div className="hidden md:flex flex-1 justify-center px-12">
            <div ref={searchRef} className="relative w-full max-w-xl">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-500" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onFocus={() => term.length >= 2 && setShowSuggestions(true)}
                  className="pl-10 pr-10 py-2 text-sm bg-white text-brand-950 placeholder:text-brand-400 border-none rounded-full focus:ring-2 focus:ring-brand-300 w-full shadow-sm transition-all"
                />
                {isLoading && (
                  <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-brand-400 animate-spin" />
                )}
                {!isLoading && term && (
                  <button 
                    type="button"
                    onClick={() => { setTerm(""); setSuggestions(null); }}
                    className="absolute right-3 top-2.5 text-brand-400 hover:text-brand-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-slate-100 dark:border-zinc-800 overflow-hidden max-h-[80vh] overflow-y-auto">
                  {hasSuggestions ? (
                    <div className="py-2">
                      {suggestions?.events.length > 0 && (
                        <div className="px-2 py-2">
                          <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase mb-2">Events</h3>
                          {suggestions.events.map(item => (
                            <Link 
                              key={item.id} 
                              href={item.url}
                              onClick={handleSuggestionClick}
                              className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg group"
                            >
                              <div className="relative w-10 h-10 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                                <ImageWithFallback src={item.image || ""} alt={item.title} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">{item.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      {suggestions?.artists.length > 0 && (
                        <div className="px-2 py-2 border-t border-slate-100 dark:border-zinc-800">
                          <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Artists</h3>
                          {suggestions.artists.map(item => (
                            <Link 
                              key={item.id} 
                              href={item.url}
                              onClick={handleSuggestionClick}
                              className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg group"
                            >
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                                <ImageWithFallback src={item.image || ""} alt={item.title} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">{item.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {suggestions?.products.length > 0 && (
                        <div className="px-2 py-2 border-t border-slate-100 dark:border-zinc-800">
                          <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Products</h3>
                          {suggestions.products.map(item => (
                            <Link 
                              key={item.id} 
                              href={item.url}
                              onClick={handleSuggestionClick}
                              className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg group"
                            >
                              <div className="relative w-10 h-10 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                                <ImageWithFallback src={item.image || ""} alt={item.title} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">{item.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {suggestions?.academies.length > 0 && (
                        <div className="px-2 py-2 border-t border-slate-100 dark:border-zinc-800">
                           <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Academies</h3>
                           {suggestions.academies.map(item => (
                            <Link 
                              key={item.id} 
                              href={item.url}
                              onClick={handleSuggestionClick}
                              className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg group"
                            >
                              <div className="relative w-10 h-10 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                                <ImageWithFallback src={item.image || ""} alt={item.title} fill className="object-cover" />
                              </div>
                               <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">{item.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      <Link 
                        href={`/search?q=${term}`}
                        onClick={handleSuggestionClick}
                        className="block px-4 py-3 text-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 border-t border-slate-100 dark:border-zinc-800 transition-colors"
                      >
                        View all results for &quot;{term}&quot;
                      </Link>
                    </div>
                  ) : !isLoading ? (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No results found
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            {user ? (
              <>
                {(user.role === 'artist' || user.role === 'ARTIST') && (
                  <Link 
                    href="/artist-dashboard" 
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-800/50 hover:bg-brand-800 rounded-full transition-colors text-brand-100 text-xs font-medium mr-2 border border-brand-500/30"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Switch to Artist Mode
                  </Link>
                )}
                {(user.role === 'organizer' || user.role === 'ORGANIZER') && (
                  <Link 
                    href="/organizer-dashboard" 
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-800/50 hover:bg-brand-800 rounded-full transition-colors text-brand-100 text-xs font-medium mr-2 border border-brand-500/30"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Switch to Organizer Mode
                  </Link>
                )}
                <Link href="/cart" className="relative p-2 hover:bg-brand-500 rounded-full transition-colors flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 -mr-1 -mt-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link href="/orders" className="p-2 hover:bg-brand-500 rounded-full transition-colors flex items-center justify-center" aria-label="My Orders">
                  <Package className="w-5 h-5 text-white" />
                </Link>
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
          <Link href="/songs" className="hover:text-white/80 transition-colors">Songs</Link>
          <Link href="/events" className="hover:text-white/80 transition-colors">Events</Link>
          <Link href="/artists" className="hover:text-white/80 transition-colors">Artists</Link>
          <Link href="/academies" className="hover:text-white/80 transition-colors">Academies</Link>
          <Link href="/marketplace" className="hover:text-white/80 transition-colors">Marketplace</Link>
          <Link href="/about" className="hover:text-white/80 transition-colors">About</Link>
{/*           
          {user && (user.role === 'ARTIST' || user.role === 'artist') && (
            <Link 
              href="/artist-dashboard" 
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border border-white/20 flex items-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Artist Dashboard
            </Link>
          )}
          
           {user && (user.role === 'ORGANIZER' || user.role === 'organizer') && (
            <Link 
              href="/organizer-dashboard" 
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border border-white/20 flex items-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Organizer Dashboard
            </Link>
          )} */}
        </div>
      </nav>
    </header>
  );
}
