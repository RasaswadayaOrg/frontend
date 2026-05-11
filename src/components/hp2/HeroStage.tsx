"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { toArtistSlug } from "../../lib/slugs";
import { buildSlug } from "../../lib/slug";
import { NavCta } from "./NavCta";

export type HeroFrame = {
  id: string;
  href: string;
  category: string;
  role: string;
  tone: string;
  imageUrl?: string;
};

type SuggestResult = {
  artists:   { id: string; name?: string; profession?: string; genre?: string; photoUrl?: string }[];
  events:    { id: string; title: string; category?: string; imageUrl?: string; location?: string }[];
  academies: { id: string; name?: string; type?: string; imageUrl?: string; location?: string }[];
  products:  { id: string; name: string; category?: string; imageUrl?: string; price?: number }[];
};

// All CSS as plain string — no styled-jsx, no template literals.
// dangerouslySetInnerHTML gives identical output on server + client → no hydration mismatch.
const STAGE_CSS =
  ".stage { position: relative; width: 100%; min-height: 100vh;" +
  " padding: 24px 24px 40px; background: #07060a; overflow: hidden; isolation: isolate; }" +
  "@media (max-width: 720px) { .stage { padding: 16px 16px 32px; } }" +

  // Nav — starts hidden above viewport; slides down + fades in when carousel reveals
  ".stage__nav { position: relative; z-index: 10; display: flex; align-items: center;" +
  " justify-content: space-between; gap: 16px; margin-bottom: 24px;" +
  " opacity: 0; transform: translateY(-20px);" +
  " transition: opacity 700ms ease 160ms, transform 700ms cubic-bezier(.2,.7,.2,1) 160ms; }" +
  ".stage__nav.is-revealed { opacity: 1; transform: translateY(0); }" +
  "@media (prefers-reduced-motion: reduce) { .stage__nav { transition: opacity 200ms ease; } }" +
  ".stage__brand { display: flex; align-items: center; flex-shrink: 0; }" +
  ".stage__brand-img { height: 44px; width: auto; display: block; }" +
  "@media (min-width: 720px) { .stage__brand-img { height: 56px; } }" +
  ".stage__pills { display: flex; gap: 6px; padding: 6px; border-radius: 999px;" +
  " background: rgba(20,18,28,0.55); backdrop-filter: blur(20px) saturate(140%);" +
  " -webkit-backdrop-filter: blur(20px) saturate(140%);" +
  " box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset; }" +
  "@media (max-width: 720px) { .stage__pills { display: none; } }" +

  // Hide the right-side CTA on mobile (drawer already has its own CTA)
  ".stage__nav-cta-wrap { display: inline-flex; align-items: center; }" +
  "@media (max-width: 720px) { .stage__nav-cta-wrap { display: none; } }" +

  // Mobile menu button — appears when pills hide
  ".stage__menu-btn { display: none; width: 42px; height: 42px; border-radius: 999px;" +
  " align-items: center; justify-content: center; flex-shrink: 0;" +
  " background: rgba(20,18,28,0.55); backdrop-filter: blur(20px) saturate(140%);" +
  " -webkit-backdrop-filter: blur(20px) saturate(140%);" +
  " box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset;" +
  " color: #f5f3fa; border: 0; cursor: pointer;" +
  " transition: background .25s ease, color .25s ease; }" +
  ".stage__menu-btn:hover { background: rgba(167,139,250,0.22); color: #c4b5fd; }" +
  "@media (max-width: 720px) { .stage__menu-btn { display: inline-flex; } }" +

  // Mobile drawer (HeroStage)
  ".stage__drawer { position: fixed; inset: 0; z-index: 120; pointer-events: none;" +
  " visibility: hidden; transition: visibility 0s linear .3s; }" +
  ".stage__drawer.is-open { pointer-events: auto; visibility: visible; transition: visibility 0s linear 0s; }" +
  ".stage__drawer-bg { position: absolute; inset: 0; background: rgba(7,6,10,0.75);" +
  " backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);" +
  " opacity: 0; transition: opacity .3s ease; }" +
  ".stage__drawer.is-open .stage__drawer-bg { opacity: 1; }" +
  ".stage__drawer-panel { position: absolute; top: 0; right: 0; bottom: 0;" +
  " width: min(360px, 86%); background: #15121d;" +
  " border-left: 1px solid rgba(196,181,253,0.10);" +
  " padding: 20px 22px 32px; transform: translateX(100%);" +
  " transition: transform .35s cubic-bezier(.2,.7,.2,1);" +
  " display: flex; flex-direction: column; }" +
  ".stage__drawer.is-open .stage__drawer-panel { transform: translateX(0); }" +
  ".stage__drawer-head { display: flex; justify-content: flex-end; margin-bottom: 20px; }" +
  ".stage__drawer-close { width: 38px; height: 38px; border-radius: 10px;" +
  " background: #1e1a2b; border: 1px solid rgba(196,181,253,0.10);" +
  " color: #f5f3fa; cursor: pointer;" +
  " display: inline-flex; align-items: center; justify-content: center; }" +
  ".stage__drawer-links { display: flex; flex-direction: column; gap: 4px; }" +
  ".stage__drawer-link { display: block; padding: 16px 16px; border-radius: 12px;" +
  " font-family: var(--font-outfit); font-size: 17px; font-weight: 500;" +
  " letter-spacing: -0.01em; color: #f5f3fa; text-decoration: none;" +
  " transition: background .2s ease; }" +
  ".stage__drawer-link:hover, .stage__drawer-link:focus-visible { background: #1e1a2b; outline: none; }" +
  ".stage__drawer-cta { margin-top: 24px; display: inline-flex; align-items: center;" +
  " justify-content: center; gap: 6px; height: 46px;" +
  " border-radius: 999px; background: #fff; color: #1a1530;" +
  " font-size: 15px; font-weight: 600; text-decoration: none;" +
  " transition: background .25s ease; }" +
  ".stage__drawer-cta:hover { background: #ede9fe; }" +
  ".stage__drawer-search { margin-top: 14px; display: flex; align-items: center;" +
  " gap: 8px; height: 46px; padding: 0 14px; border-radius: 999px;" +
  " background: #1e1a2b; border: 1px solid rgba(196,181,253,0.10);" +
  " color: #c4b5fd; }" +
  ".stage__drawer-search:focus-within { border-color: rgba(167,139,250,0.45); background: #25212f; }" +
  ".stage__drawer-search input { flex: 1; min-width: 0; background: transparent; border: 0; outline: none;" +
  " color: #f5f3fa; font-size: 14px; font-family: inherit; }" +
  ".stage__drawer-search input::placeholder { color: rgba(155,149,181,0.7); }" +
  ".stage__pill { display: inline-flex; align-items: center; height: 36px; padding: 0 18px;" +
  " border-radius: 999px; color: #f5f3fa; font-size: 14px; font-weight: 500;" +
  " letter-spacing: -0.005em; text-decoration: none;" +
  " transition: background 0.3s ease, color 0.3s ease; }" +
  ".stage__pill:hover { background: rgba(167,139,250,0.14); }" +
  ".stage__pill--solid { background: #fff; color: #1a1530; height: 40px; padding: 0 22px; }" +
  ".stage__pill--solid:hover { background: #ede9fe; }" +

  // Scene
  ".stage__scene { position: relative; width: 100%; height: calc(100vh - 120px);" +
  " min-height: 420px; max-height: 880px;" +
  " perspective: 1600px; perspective-origin: 50% 50%; }" +
  "@media (min-width: 720px) { .stage__scene { min-height: 540px; } }" +
  ".stage__deck { position: absolute; inset: 0; transform-style: preserve-3d; }" +

  // Cards
  ".stage__card { position: absolute; inset: 0; margin: auto;" +
  " width: min(620px, calc(100% - 24px)); height: min(620px, calc(100% - 40px));" +
  " border-radius: 28px; overflow: hidden; background: #15121d; text-decoration: none;" +
  " box-shadow: 0 60px 120px -40px rgba(0,0,0,0.65)," +
  "   0 0 0 1px rgba(255,255,255,0.04) inset;" +
  " transform-origin: center center;" +
  " transition: transform 720ms cubic-bezier(.25,.46,.45,.94)," +
  "   opacity 480ms cubic-bezier(.25,.46,.45,.94)," +
  "   filter 480ms cubic-bezier(.25,.46,.45,.94);" +
  " will-change: transform, opacity; backface-visibility: hidden; }" +
  "@media (max-width: 720px) { .stage__card { width: calc(100% - 24px); height: min(80vw, 540px); } }" +
  ".stage__art { position: absolute; inset: 0;" +
  " animation: stage-kenburns 18s ease-in-out infinite alternate; }" +
  "@keyframes stage-kenburns {" +
  " from { transform: scale(1.08) translate(1.5%, 1%); }" +
  " to   { transform: scale(1.00) translate(0,0); } }" +
  "@media (prefers-reduced-motion: reduce) {" +
  " .stage__art { animation: none; }" +
  " .stage__card { transition: opacity 400ms ease; } }" +
  ".stage__shade { position: absolute; inset: 0; pointer-events: none;" +
  " background: radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.35) 100%)," +
  "   linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 35%," +
  "   transparent 65%, rgba(0,0,0,0.45) 100%); }" +

  // Meta chip
  ".stage__meta { position: absolute; left: 24px; bottom: 24px; z-index: 3;" +
  " display: flex; flex-direction: column; gap: 4px; padding: 14px 18px 12px;" +
  " border-radius: 16px; background: rgba(20,18,28,0.6);" +
  " backdrop-filter: blur(20px) saturate(140%); -webkit-backdrop-filter: blur(20px) saturate(140%);" +
  " box-shadow: 0 0 0 1px rgba(255,255,255,0.07) inset;" +
  " color: #f5f3fa; max-width: 280px;" +
  " animation: stage-chipIn 800ms cubic-bezier(.2,.7,.2,1) both; }" +
  "@keyframes stage-chipIn {" +
  " from { opacity: 0; transform: translateY(10px); }" +
  " to   { opacity: 1; transform: translateY(0); } }" +
  ".stage__meta-cat { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;" +
  " color: #c4b5fd; font-weight: 600; }" +
  ".stage__meta-role { font-size: 15px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.3; }" +

  // Dots
  ".stage__dots { position: absolute; left: 50%; bottom: -14px; transform: translateX(-50%);" +
  " display: flex; gap: 8px; z-index: 5;" +
  " animation: stage-dotsIn 700ms ease-out both; }" +
  "@keyframes stage-dotsIn {" +
  " from { opacity: 0; transform: translate(-50%, 8px); }" +
  " to   { opacity: 1; transform: translate(-50%, 0); } }" +
  ".stage__dot { width: 22px; height: 3px; border-radius: 2px;" +
  " background: rgba(196,181,253,0.22); border: 0; padding: 0; cursor: pointer;" +
  " transition: background .35s ease, width .45s ease; }" +
  ".stage__dot.is-active { background: #c4b5fd; width: 40px; }" +

  // Side nav arrows (desktop only)
  ".stage__nav-arrow { position: absolute; top: 50%; transform: translateY(-50%);" +
  " width: 48px; height: 48px; border-radius: 999px;" +
  " display: inline-flex; align-items: center; justify-content: center;" +
  " background: rgba(20,18,28,0.55); backdrop-filter: blur(20px) saturate(140%);" +
  " -webkit-backdrop-filter: blur(20px) saturate(140%);" +
  " box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.35);" +
  " color: #f5f3fa; border: 0; cursor: pointer; z-index: 6; opacity: 0;" +
  " transition: opacity .35s ease 200ms, background .25s ease, transform .25s ease, color .25s ease; }" +
  ".stage__nav-arrow.is-revealed { opacity: 1; }" +
  ".stage__nav-arrow:hover { background: rgba(167,139,250,0.22); color: #c4b5fd; }" +
  ".stage__nav-arrow:active { transform: translateY(-50%) scale(0.94); }" +
  ".stage__nav-arrow--prev { left: 18px; }" +
  ".stage__nav-arrow--next { right: 18px; }" +
  ".stage__nav-arrow svg { width: 22px; height: 22px; }" +
  "@media (max-width: 720px) { .stage__nav-arrow { display: none; } }" +

  // Divider inside pills bar
  ".stage__pills-sep { width: 1px; height: 18px; background: rgba(167,139,250,0.25); margin: 0 4px; flex-shrink: 0; }" +

  // Pills bar — fixed intrinsic width; position:relative for dropdown + inner absolute layers
  ".stage__pills { position: relative !important; overflow: visible !important;" +
  " align-items: center !important; }" +
  "@media (min-width: 721px) { .stage__pills { display: flex !important; } }" +

  // Links group — fills bar normally; fades + shrinks out when searching
  ".stage__pills-links { display: flex; align-items: center; gap: 2px; flex-shrink: 0;" +
  " transition: opacity .25s ease, transform .25s ease;" +
  " opacity: 1; transform: scale(1); pointer-events: auto; }" +
  ".stage__pills.is-searching .stage__pills-links { opacity: 0; transform: scale(0.94); pointer-events: none; }" +

  // Inline search group — absolutely fills same bar space; fades in when searching
  ".stage__pills-input { position: absolute; inset: 5px; display: flex; align-items: center; gap: 8px;" +
  " padding: 0 6px 0 12px;" +
  " opacity: 0; transform: scale(0.96); pointer-events: none;" +
  " transition: opacity .25s ease, transform .25s ease; }" +
  ".stage__pills.is-searching .stage__pills-input { opacity: 1; transform: scale(1); pointer-events: auto; }" +
  ".stage__pills-input-icon { color: #c4b5fd; display: flex; flex-shrink: 0; }" +
  ".stage__pills-input input { flex: 1; min-width: 0; background: transparent; border: none; outline: none;" +
  " color: #f5f3fa; font-size: 14px; font-family: inherit; caret-color: #c4b5fd; letter-spacing: -0.01em; }" +
  ".stage__pills-input input::placeholder { color: rgba(155,149,181,0.65); }" +
  ".stage__pills-close { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 7px;" +
  " background: rgba(30,18,50,0.8); border: 1px solid rgba(139,92,246,0.22); color: #9B95B5; cursor: pointer; flex-shrink: 0; }" +
  ".stage__pills-close:hover { color: #f5f3fa; }" +

  // Search icon ghost button (end of links group)
  ".stage__search-btn { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 999px;" +
  " background: transparent; border: none; color: rgba(196,181,253,0.80); cursor: pointer;" +
  " transition: background .2s ease, color .15s ease; flex-shrink: 0; }" +
  ".stage__search-btn:hover { background: rgba(139,92,246,0.22); color: #c4b5fd; }" +

  // Suggest dropdown — anchors to .stage__pills (position:relative)
  ".stage__suggest { position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%); width: clamp(280px, 44vw, 580px);" +
  " background: #15121D; border: 1px solid rgba(139,92,246,0.22); border-radius: 16px;" +
  " box-shadow: 0 20px 56px rgba(0,0,0,0.6); overflow: hidden; z-index: 200;" +
  " animation: stageFadeUp .16s ease; }" +
  "@keyframes stageFadeUp { from { opacity:0; transform:translateX(-50%) translateY(6px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }" +
  ".stage__suggest-cat { padding: 10px 14px 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #9B95B5; }" +
  ".stage__suggest-item { display: flex; align-items: center; gap: 10px; padding: 8px 14px; text-decoration: none; transition: background .12s ease; }" +
  ".stage__suggest-item:hover { background: #1E1A2B; }" +
  ".stage__suggest-thumb { width: 34px; height: 34px; border-radius: 8px; object-fit: cover; background: #1E1A2B; flex-shrink: 0; }" +
  ".stage__suggest-name { display: block; font-size: 13px; font-weight: 500; color: #F5F3FA; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px; }" +
  ".stage__suggest-sub { display: block; font-size: 11px; color: #9B95B5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }" +
  ".stage__suggest-footer { padding: 10px 14px; border-top: 1px solid rgba(196,181,253,0.10); display: flex; justify-content: space-between; }" +
  ".stage__suggest-all { font-size: 12px; font-weight: 500; color: #C4B5FD; text-decoration: none; }" +
  ".stage__suggest-all:hover { text-decoration: underline; }" +
  ".stage__suggest-empty { padding: 20px 16px; font-size: 13px; color: #9B95B5; text-align: center; }" +
  ".stage__suggest-loading { padding: 18px; display: flex; gap: 8px; justify-content: center; }" +
  ".stage__suggest-dot { width: 6px; height: 6px; border-radius: 50%; background: #C4B5FD; opacity: 0.4; animation: stagePulse 1.2s ease infinite; }" +
  ".stage__suggest-dot:nth-child(2) { animation-delay: .2s; } .stage__suggest-dot:nth-child(3) { animation-delay: .4s; }" +
  "@keyframes stagePulse { 0%,100% { opacity:.3; transform:scale(.9); } 50% { opacity:1; transform:scale(1.1); } }";

export function HeroStage({
  frames,
  navLinks,
  ctaLabel,
  ctaHref,
}: {
  frames: HeroFrame[];
  navLinks: { label: string; href: string }[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const [active, setActive]     = useState(0);
  const [revealed, setRevealed]   = useState(false);
  const [paused, setPaused]     = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState<SuggestResult | null>(null);
  const [loading, setLoading]     = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const inputRef    = useRef<HTMLInputElement>(null);
  const searchbarRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Zoom-out reveal: fill viewport on land, then pull back to show 3-card carousel.
  useEffect(() => {
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setRevealed(true); return; }
    // Kick off the zoom-out on the next frame so the entrance animates
    // immediately instead of holding a frozen close-up.
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-advance once revealed.
  useEffect(() => {
    if (!revealed || paused || frames.length <= 1) return;
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setActive((i) => (i + 1) % frames.length), 6000);
    return () => clearInterval(t);
  }, [revealed, paused, frames.length]);

  // Search: open
  const openSearch = () => {
    setSearching(true);
    setQuery("");
    setResults(null);
    setTimeout(() => inputRef.current?.focus(), 40);
  };
  const closeSearch = () => {
    setSearching(false);
    setQuery("");
    setResults(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };
  const commitSearch = (q: string) => {
    const t = q.trim();
    if (!t) return;
    closeSearch();
    router.push("/search?q=" + encodeURIComponent(t));
  };

  // Search: debounced fetch
  useEffect(() => {
    if (!searching) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (q.length < 2) { setResults(null); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/search-suggest?q=" + encodeURIComponent(q));
        setResults(await res.json());
      } catch { setResults(null); }
      finally { setLoading(false); }
    }, 260);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, searching]);

  // Search: click-outside to close
  useEffect(() => {
    if (!searching) return;
    const h = (e: MouseEvent) => {
      if (searchbarRef.current && !searchbarRef.current.contains(e.target as Node)) closeSearch();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [searching]);

  const showDrop = searching && query.trim().length >= 2;
  const total = results
    ? results.artists.length + results.events.length + results.academies.length + results.products.length
    : 0;

  const n = frames.length;

  function styleFor(i: number): {
    transform: string; opacity: number; zIndex: number; pointerEvents: "auto" | "none"; borderRadius?: string; filter?: string;
  } {
    if (!revealed) {
      const center = i === active;
      return {
        transform:     "translate3d(0,0,0) rotateY(0deg) scale(" + (center ? 1.28 : 0.6) + ")",
        opacity:       center ? 1 : 0,
        zIndex:        center ? 3 : 0,
        pointerEvents: center ? "auto" : "none",
        borderRadius:  center ? "8px" : undefined,
      };
    }
    let offset = i - active;
    if (offset >  n / 2) offset -= n;
    if (offset < -n / 2) offset += n;

    if (offset === 0)
      return { transform: "translate3d(0,0,0) rotateY(0deg) scale(1)",                       opacity: 1, zIndex: 3, pointerEvents: "auto" };
    if (offset === -1)
      return { transform: "translate3d(-78%,0,-120px) rotateY(22deg) scale(0.86)",            opacity: 1, zIndex: 2, pointerEvents: "auto", filter: "brightness(0.45) blur(0.4px)" };
    if (offset === 1)
      return { transform: "translate3d(78%,0,-120px) rotateY(-22deg) scale(0.86)",            opacity: 1, zIndex: 2, pointerEvents: "auto", filter: "brightness(0.45) blur(0.4px)" };
    const dir = offset < 0 ? -1 : 1;
    return {
      transform:     "translate3d(" + (dir * 140) + "%,0,-240px) rotateY(" + (-dir * 28) + "deg) scale(0.7)",
      opacity:       0,
      zIndex:        1,
      pointerEvents: "none",
    };
  }

  return (
    <section
      className="stage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Inject stage styles — same string on server and client → no hydration diff */}
      <style dangerouslySetInnerHTML={{ __html: STAGE_CSS }} />

      {/* Floating top nav — fades in from top once carousel zoom-out completes */}
      <header className={"stage__nav" + (revealed ? " is-revealed" : "")} style={{ position: "relative" }}>
        <Link href="/" className="stage__brand" aria-label="Rasaswadaya home">
          <img src="/logo.svg" alt="Rasaswadaya" className="stage__brand-img" />
        </Link>
        {/* Pills nav — search expands inline within the same bar */}
        <nav
          ref={searchbarRef}
          className={"stage__pills" + (searching ? " is-searching" : "")}
          aria-label="Primary"
          role="search"
        >
          {/* Links group: shrinks when searching */}
          <div className="stage__pills-links">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="stage__pill">
                {l.label}
              </Link>
            ))}
            <span className="stage__pills-sep" aria-hidden />
            <button
              type="button"
              className="stage__search-btn"
              aria-label="Open search"
              onClick={openSearch}
            >
              <Search size={15} strokeWidth={1.5} />
            </button>
          </div>

          {/* Inline input group: expands when searching */}
          <div className="stage__pills-input">
            <span className="stage__pills-input-icon" aria-hidden><Search size={14} strokeWidth={1.5} /></span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitSearch(query);
                if (e.key === "Escape") closeSearch();
              }}
              placeholder="Search artists, events, songs…"
              aria-label="Search"
              autoComplete="off"
            />
            <button type="button" className="stage__pills-close" onClick={closeSearch} aria-label="Close search">
              <X size={11} />
            </button>
          </div>

          {/* Suggest dropdown anchored to the pills bar */}
          {showDrop && (
            <div className="stage__suggest">
              {loading && (
                <div className="stage__suggest-loading">
                  <span className="stage__suggest-dot" /><span className="stage__suggest-dot" /><span className="stage__suggest-dot" />
                </div>
              )}
              {!loading && results && total === 0 && <p className="stage__suggest-empty">No results for &ldquo;{query}&rdquo;</p>}
              {!loading && results && results.artists.length > 0 && (
                <><p className="stage__suggest-cat">Artists</p>
                {results.artists.map((a) => (
                  <Link key={a.id} href={"/artists/" + toArtistSlug(a.name || "", a.id)} className="stage__suggest-item" onClick={closeSearch}>
                    {a.photoUrl ? <img src={a.photoUrl} alt="" className="stage__suggest-thumb" /> : <span className="stage__suggest-thumb" />}
                    <span><span className="stage__suggest-name">{a.name}</span>{a.profession && <span className="stage__suggest-sub">{a.profession}</span>}</span>
                  </Link>
                ))}</>
              )}
              {!loading && results && results.events.length > 0 && (
                <><p className="stage__suggest-cat">Events</p>
                {results.events.map((e) => (
                  <Link key={e.id} href={"/events/" + buildSlug(e.id, e.title)} className="stage__suggest-item" onClick={closeSearch}>
                    {e.imageUrl ? <img src={e.imageUrl} alt="" className="stage__suggest-thumb" /> : <span className="stage__suggest-thumb" />}
                    <span><span className="stage__suggest-name">{e.title}</span>{e.location && <span className="stage__suggest-sub">{e.location}</span>}</span>
                  </Link>
                ))}</>
              )}
              {!loading && results && results.academies.length > 0 && (
                <><p className="stage__suggest-cat">Academies</p>
                {results.academies.map((a) => (
                  <Link key={a.id} href={"/academies/" + buildSlug(a.id, a.name)} className="stage__suggest-item" onClick={closeSearch}>
                    {a.imageUrl ? <img src={a.imageUrl} alt="" className="stage__suggest-thumb" /> : <span className="stage__suggest-thumb" />}
                    <span><span className="stage__suggest-name">{a.name}</span>{a.location && <span className="stage__suggest-sub">{a.location}</span>}</span>
                  </Link>
                ))}</>
              )}
              {!loading && results && results.products.length > 0 && (
                <><p className="stage__suggest-cat">Marketplace</p>
                {results.products.map((p) => (
                  <Link key={p.id} href={"/marketplace/" + p.id} className="stage__suggest-item" onClick={closeSearch}>
                    {p.imageUrl ? <img src={p.imageUrl} alt="" className="stage__suggest-thumb" /> : <span className="stage__suggest-thumb" />}
                    <span><span className="stage__suggest-name">{p.name}</span>{p.price != null && <span className="stage__suggest-sub">Rs {p.price.toLocaleString()}</span>}</span>
                  </Link>
                ))}</>
              )}
              {!loading && results && total > 0 && (
                <div className="stage__suggest-footer">
                  <Link href={"/search?q=" + encodeURIComponent(query)} className="stage__suggest-all" onClick={closeSearch}>See all results</Link>
                  <span style={{ fontSize: 11, color: "#9B95B5" }}>{total} found</span>
                </div>
              )}
            </div>
          )}
        </nav>

        <span className="stage__nav-cta-wrap">
          <NavCta label={ctaLabel} href={ctaHref} variant="stage" />
        </span>

        <button
          type="button"
          className="stage__menu-btn"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      <div className={"stage__drawer" + (menuOpen ? " is-open" : "")} aria-hidden={!menuOpen}>
        <div className="stage__drawer-bg" onClick={() => setMenuOpen(false)} />
        <aside className="stage__drawer-panel" role="dialog" aria-label="Menu">
          <div className="stage__drawer-head">
            <button
              type="button"
              className="stage__drawer-close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <nav className="stage__drawer-links" aria-label="Mobile navigation">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="stage__drawer-link"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <form
            className="stage__drawer-search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement)?.value?.trim();
              if (!q) return;
              setMenuOpen(false);
              router.push("/search?q=" + encodeURIComponent(q));
            }}
            role="search"
          >
            <Search size={15} strokeWidth={1.5} aria-hidden />
            <input
              type="search"
              name="q"
              placeholder="Search artists, events, songs…"
              aria-label="Search"
              autoComplete="off"
            />
          </form>
          <Link
            href={ctaHref}
            className="stage__drawer-cta"
            onClick={() => setMenuOpen(false)}
          >
            {ctaLabel}
          </Link>
        </aside>
      </div>

      {/* Carousel scene */}
      <div className="stage__scene">
        <div className="stage__deck">
          {frames.map((f, i) => {
            const s = styleFor(i);
            return (
              <Link
                key={f.id}
                href={f.href}
                className="stage__card"
                style={{
                  transform:    s.transform,
                  opacity:      s.opacity,
                  zIndex:       s.zIndex,
                  pointerEvents: s.pointerEvents,
                  borderRadius: s.borderRadius,
                  filter:       s.filter,
                }}
                aria-hidden={s.opacity === 0}
                tabIndex={s.opacity === 0 ? -1 : 0}
              >
                {f.imageUrl ? (
                  <div className="stage__art" aria-hidden>
                    <img
                      src={f.imageUrl}
                      alt=""
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                    />
                  </div>
                ) : (
                  <div className="stage__art" style={{ background: f.tone }} aria-hidden />
                )}
                <div className="stage__shade" aria-hidden />


              </Link>
            );
          })}
        </div>

        {revealed && (
          <div className="stage__dots" role="tablist" aria-label="Hero frames">
            {frames.map((f, i) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={i === active}
                aria-label={"Frame " + (i + 1)}
                className={"stage__dot" + (i === active ? " is-active" : "")}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        )}

        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous frame"
              className={"stage__nav-arrow stage__nav-arrow--prev" + (revealed ? " is-revealed" : "")}
              onClick={() => setActive((i) => (i - 1 + n) % n)}
            >
              <ChevronLeft strokeWidth={2.25} />
            </button>
            <button
              type="button"
              aria-label="Next frame"
              className={"stage__nav-arrow stage__nav-arrow--next" + (revealed ? " is-revealed" : "")}
              onClick={() => setActive((i) => (i + 1) % n)}
            >
              <ChevronRight strokeWidth={2.25} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
