import Link from "next/link";
import { ImageWithFallback } from "../components/ImageWithFallback";
import {
  getEvents,
  getArtists,
  getProducts,
  getTrendingEvents,
  getRecommendations,
} from "../lib/db";
import { getSession } from "../lib/auth";
import { buildSlug } from "../lib/slug";
import { Music, PersonStanding, Clapperboard, Theater, MapPin, Calendar } from "lucide-react";
import { HeroStage, type HeroFrame } from "../components/hp2/HeroStage";
import { toArtistSlug } from "../lib/slugs";
import { Marquee } from "../components/hp2/Marquee";
import { Reveal } from "../components/hp2/Reveal";
import { AIThinking } from "../components/hp2/AIThinking";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// homepage-2 — full UX content parity with original homepage
// Design language: Dieter Rams 10 principles + Apple HIG + lifeatspotify.com
// Structure:
//   1. Cinematic hero stage (full-bleed)
//   2. Tagline introduction band
//   3. Category browser
//   4. AI Suggestions Engine (conditional on auth)
//   5. Featured Events + cultural sidebar
//   6. Artist marquee
//   7. Latest events list
//   8. Marketplace
//   9. CTA
// ─────────────────────────────────────────────────────────────────────────────

// Violet-tinted dark palette — never light.
const BG     = "#07060A";                       // near-black with cool violet undertone
const SURF   = "#15121D";                       // raised surface
const SURF2  = "#1E1A2B";                       // higher surface
const LINE   = "rgba(196,181,253,0.10)";        // hairline (violet tint)
const TEXT   = "#F5F3FA";                       // off-white, slightly cool
const MUTED  = "#9B95B5";                       // muted lavender-grey
const ACCENT = "#A78BFA";                       // primary violet (accent)
const AI_CLR = "#C4B5FD";                       // soft lavender for AI accents

function tintFor(seed: string, base: number): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  // Bias every gradient toward the violet/indigo region (250–310°).
  const hue  = 250 + (Math.abs(h) % 60);
  const hue2 = (hue + 30) % 360;
  return (
    "linear-gradient(135deg, hsl(" + hue + " 38% " + (base + 10) + "%)," +
    " hsl(" + hue2 + " 32% " + (base - 4) + "%))"
  );
}

function cinemaTone(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 33 + seed.charCodeAt(i)) | 0;
  }
  // Cinematic violet→indigo→magenta range (240–310°).
  const hue  = 240 + (Math.abs(h) % 70);
  const hue2 = (hue + 35) % 360;
  return (
    "radial-gradient(120% 80% at 30% 20%, hsl(" + hue + " 70% 48% / 0.95) 0%, transparent 55%)," +
    "radial-gradient(100% 80% at 80% 80%, hsl(" + hue2 + " 65% 24% / 0.95) 0%, transparent 60%)," +
    "linear-gradient(135deg, hsl(" + hue + " 45% 18%) 0%, hsl(" + hue2 + " 38% 9%) 100%)"
  );
}

const CATEGORIES = [
  { name: "Music",  href: "/events?category=music",  Icon: Music          },
  { name: "Dance",  href: "/events?category=dance",  Icon: PersonStanding },
  { name: "Film",   href: "/events?category=film",   Icon: Clapperboard   },
  { name: "Drama",  href: "/events?category=drama",  Icon: Theater        },
];

export default async function HomeTwo() {
  const session    = await getSession();
  const isLoggedIn = !!session?.token;
  const token      = (session?.token as string) || "";

  const [events, trending, artists, products, recResult] = await Promise.all([
    getEvents(6),
    getTrendingEvents(6),
    getArtists(8),
    getProducts(4),
    isLoggedIn ? getRecommendations(token) : Promise.resolve({ data: [] }),
  ]);

  const recs              = recResult?.data || [];
  // Scores from AI model are 0–1 decimals; convert to whole-number percent for display
  const toPercent = (s: number | undefined) => s != null ? Math.round(s * 100) : null;
  const recEvents         = recs.filter((r: any) => r.type === "event").map((r: any) => ({ ...r.item, aiScore: toPercent(r.score), aiReason: r.reason }));
  const recArtists        = recs.filter((r: any) => r.type === "artist").map((r: any) => ({ ...r.item, aiScore: toPercent(r.score), aiReason: r.reason }));
  const featuredArtist    = artists.length > 0 ? (artists[3] || artists[0]) : null;
  const aiEvent1          = recEvents.length  > 0 ? recEvents[0]  : (events.length  > 0 ? events[0]  : null);
  const aiEvent2          = recEvents.length  > 1 ? recEvents[1]  : (events.length  > 1 ? events[1]  : null);
  const aiArtist          = recArtists.length > 0 ? recArtists[0] : featuredArtist;
  // Top match % for the header — only set if real AI results came back
  const topMatchPct       = recEvents[0]?.aiScore ?? recArtists[0]?.aiScore ?? null;

  // Concert image lookup — maps "e-{eventId}" to public image path
  const CONCERT_IMG: Record<string, string> = {
    "e-evt-extra-shots-2026":    "/assets/concerts/extra-shots-concert.webp",
    "e-evt-jothi-unplugged-2026": "/assets/concerts/jothi-unplugged-concert.webp",
    "e-evt-legends-2026":        "/assets/concerts/legends-concert.webp",
    "e-evt-vibe-district-2026":  "/assets/concerts/vibe-district-concert.webp",
  };

  // Hero frames — events only
  type RF = { id: string; href: string; category: string; role: string; imageUrl?: string };
  const heroSrc: RF[] = [
    ...trending.map((e: any) => ({
      id:       "e-" + String(e.id),
      href:     "/events/" + buildSlug(e.id, e.title),
      category: (e.category || "Event").toUpperCase(),
      role:     e.title,
      imageUrl:  e.imageUrl,
    })),
  ];
  const fallbackFrames: RF[] = Array.from({ length: 4 }, (_, i) => ({
    id: "ph-" + i, href: "/events", category: "COMING SOON", role: "Stories from the island",
  }));
  const frames: HeroFrame[] = (heroSrc.length >= 4 ? heroSrc : [...heroSrc, ...fallbackFrames])
    .slice(0, 6)
    .map((f) => ({ ...f, tone: cinemaTone(f.id), imageUrl: f.imageUrl || CONCERT_IMG[f.id] }));

  // ── CSS ─────────────────────────────────────────────────────────────────
  const css = (
    ".hp2 { font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, system-ui, sans-serif; letter-spacing: -0.005em; position: relative; isolation: isolate; }" +

    /* ── AMBIENT VIOLET WASH · two drifting hotspots ── */
    ".hp2::before, .hp2::after { content: ''; position: fixed; z-index: -1; pointer-events: none; border-radius: 50%; filter: blur(80px); will-change: transform, opacity; }" +
    ".hp2::before { top: -20vh; left: -15vw; width: 80vw; height: 80vh;" +
    " background: radial-gradient(circle, hsla(258, 75%, 32%, 0.65) 0%, hsla(258, 60%, 22%, 0.35) 35%, transparent 70%);" +
    " animation: hp2-drift-a 28s ease-in-out infinite alternate; }" +
    ".hp2::after { bottom: -25vh; right: -20vw; width: 70vw; height: 70vh;" +
    " background: radial-gradient(circle, hsla(290, 55%, 28%, 0.45) 0%, hsla(290, 50%, 20%, 0.20) 40%, transparent 70%);" +
    " animation: hp2-drift-b 36s ease-in-out infinite alternate; }" +
    "@keyframes hp2-drift-a {" +
    "  0%   { transform: translate3d(0,0,0)       scale(1);    filter: blur(80px) hue-rotate(0deg);  }" +
    "  50%  { transform: translate3d(8%,6%,0)     scale(1.12); filter: blur(90px) hue-rotate(15deg); }" +
    "  100% { transform: translate3d(-4%,10%,0)   scale(1.05); filter: blur(85px) hue-rotate(-10deg); }" +
    "}" +
    "@keyframes hp2-drift-b {" +
    "  0%   { transform: translate3d(0,0,0)       scale(1);    filter: blur(80px) hue-rotate(0deg);  }" +
    "  50%  { transform: translate3d(-10%,-8%,0)  scale(1.18); filter: blur(95px) hue-rotate(-12deg); }" +
    "  100% { transform: translate3d(6%,-4%,0)    scale(1.08); filter: blur(85px) hue-rotate(8deg);  }" +
    "}" +
    "@media (prefers-reduced-motion: reduce) { .hp2::before, .hp2::after { animation: none; } }" +

    ".hp2-container { max-width: 1280px; margin: 0 auto; padding: 0 20px; }" +
    "@media (min-width: 640px) { .hp2-container { padding: 0 28px; } }" +
    "@media (min-width: 768px) { .hp2-container { padding: 0 48px; } }" +

    /* ── INTRO BAND ── */
    ".hp2-intro { padding: 64px 0 56px; }" +
    "@media (min-width: 768px) { .hp2-intro { padding: 100px 0 88px; } }" +
    ".hp2-intro__layout { display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }" +
    "@media (min-width: 900px) { .hp2-intro__layout { gap: 64px; flex-wrap: nowrap; } }" +
    ".hp2-intro__content { flex: 1 1 0; min-width: 0; }" +
    ".hp2-intro__map { flex: 0 0 auto; width: clamp(200px, 22vw, 320px); display: flex; align-items: center; justify-content: center; opacity: 0; animation: hp2-map-in 1.2s ease forwards 0.4s; }" +
    "@media (max-width: 640px) { .hp2-intro__map { display: none; } }" +
    "@keyframes hp2-map-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }" +
    ".hp2-intro__map svg { width: 100%; height: auto; filter: drop-shadow(0 0 28px rgba(167,139,250,0.45)) drop-shadow(0 0 8px rgba(196,181,253,0.25)); }" +
    ".hp2-intro__title { font-family: var(--font-outfit); font-size: clamp(36px, 8vw, 104px); line-height: 1; letter-spacing: -0.04em; font-weight: 600; margin: 18px 0 22px; max-width: 14ch; }" +
    "@media (min-width: 768px) { .hp2-intro__title { margin: 22px 0 28px; } }" +
    ".hp2-intro__title em { font-style: normal; color: " + ACCENT + "; }" +
    ".hp2-intro__lede { color: " + MUTED + "; font-size: clamp(17px, 1.4vw, 20px); line-height: 1.55; max-width: 560px; margin-bottom: 36px; }" +

    /* ── BUTTONS ── */
    ".hp2-cta-row { display: flex; gap: 14px; flex-wrap: wrap; }" +
    ".hp2-cta-row--center { justify-content: center; }" +
    ".hp2-btn { display: inline-flex; align-items: center; justify-content: center; height: 48px; padding: 0 22px; border-radius: 999px; font-size: 15px; font-weight: 500; letter-spacing: -0.005em; transition: transform .25s ease, background .25s ease, color .25s ease, border-color .25s ease; }" +
    ".hp2-btn--primary { background: " + TEXT + "; color: #0a0a0b; }" +
    ".hp2-btn--primary:hover { transform: translateY(-1px); background: #fff; }" +
    ".hp2-btn--ghost { color: " + TEXT + "; border: 1px solid " + LINE + "; background: transparent; }" +
    ".hp2-btn--ghost:hover { border-color: rgba(255,255,255,0.3); }" +
    ".hp2-btn--ai { position: relative; background: linear-gradient(110deg, #7C3AED, #A78BFA, #6366F1); color: #fff; font-weight: 600; box-shadow: 0 0 18px rgba(167,139,250,0.45), 0 0 6px rgba(167,139,250,0.25); border: 1px solid rgba(196,181,253,0.3); overflow: hidden; text-decoration: none; cursor: pointer; }" +
    ".hp2-btn--ai::before { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg, #A78BFA, #C4B5FD, #818CF8); opacity: 0; transition: opacity .3s; }" +
    ".hp2-btn--ai:hover::before { opacity: 1; }" +
    ".hp2-btn--ai:hover { transform: translateY(-1px); box-shadow: 0 0 28px rgba(167,139,250,0.65), 0 0 10px rgba(167,139,250,0.35); }" +
    ".hp2-btn--ai span { position: relative; z-index: 1; }" +

    /* ── CATEGORY STRIP ── */
    ".hp2-cats-section { padding: 0 0 80px; border-top: 1px solid " + LINE + "; padding-top: 56px; }" +
    ".hp2-cats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }" +
    "@media (min-width: 640px) { .hp2-cats { grid-template-columns: repeat(3, 1fr); } }" +
    "@media (min-width: 900px) { .hp2-cats { grid-template-columns: repeat(5, 1fr); gap: 16px; } }" +
    ".hp2-cat { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 28px 16px; border-radius: 20px; background: " + SURF + "; border: 1px solid " + LINE + "; color: " + MUTED + "; transition: transform .3s ease, color .25s ease, border-color .25s ease, background .25s ease; text-decoration: none; }" +
    ".hp2-cat:hover { transform: translateY(-4px); color: " + TEXT + "; border-color: rgba(255,255,255,0.18); background: " + SURF2 + "; }" +
    ".hp2-cat__name { font-size: 14px; font-weight: 500; letter-spacing: -0.005em; }" +

    /* ── AI SECTION ── */
    ".hp2-ai { border-top: 1px solid " + LINE + "; margin-bottom: 0; }" +
    ".hp2-ai--guest { padding: 80px 0 96px; text-align: center; }" +
    ".hp2-ai__badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 999px; border: 1px solid " + AI_CLR + "40; color: " + AI_CLR + "; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; margin-bottom: 24px; }" +
    ".hp2-ai__pulse { width: 6px; height: 6px; border-radius: 50%; background: " + AI_CLR + "; animation: aipulse 2s ease-in-out infinite; }" +
    "@keyframes aipulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }" +
    ".hp2-ai__guest-title { font-family: var(--font-outfit); font-size: clamp(36px, 6vw, 80px); font-weight: 700; line-height: 1; letter-spacing: -0.04em; margin: 0 auto 20px; max-width: 18ch; }" +
    ".hp2-ai__guest-title span { color: " + MUTED + "; }" +
    ".hp2-ai__guest-lede { color: " + MUTED + "; font-size: 18px; max-width: 540px; margin: 0 auto 36px; line-height: 1.6; }" +
    ".hp2-ai--loggedin { padding: 64px 0 80px; }" +
    ".hp2-ai__header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid " + LINE + "; flex-wrap: wrap; }" +
    "@media (min-width: 768px) { .hp2-ai__header { margin-bottom: 40px; padding-bottom: 32px; } }" +
    ".hp2-ai__title { font-family: var(--font-outfit); font-size: clamp(30px, 6.5vw, 72px); font-weight: 700; letter-spacing: -0.04em; line-height: 1.02; margin: 8px 0 12px; }" +
    ".hp2-grad { background: linear-gradient(110deg, #C4B5FD 0%, #A78BFA 35%, #818CF8 70%, #C084FC 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }" +
    ".hp2-ai__sub { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: " + MUTED + "; }" +
    ".hp2-ai__sub span { color: " + TEXT + "; }" +
    ".hp2-ai__cards { display: grid; grid-template-columns: 1fr; gap: 0; border: 1px solid " + LINE + "; border-radius: 20px; overflow: hidden; background: " + SURF + "; }" +
    "@media (min-width: 900px) { .hp2-ai__cards { grid-template-columns: repeat(3, 1fr); } }" +
    ".hp2-ai-card { display: flex; flex-direction: column; padding: 24px; border-bottom: 1px solid " + LINE + "; transition: background .25s ease; text-decoration: none; }" +
    ".hp2-ai-card:last-child { border-bottom: none; }" +
    "@media (min-width: 900px) { .hp2-ai-card { border-bottom: none; border-right: 1px solid " + LINE + "; } .hp2-ai-card:last-child { border-right: none; } }" +
    ".hp2-ai-card:hover { background: " + SURF2 + "; }" +
    ".hp2-ai-card__img { position: relative; aspect-ratio: 1/1; overflow: hidden; border-radius: 12px; background: " + SURF2 + "; margin-bottom: 16px; }" +
    ".hp2-ai-card__badge { position: absolute; top: 10px; left: 10px; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; padding: 4px 10px; border-radius: 6px; }" +
    ".hp2-ai-card__badge--ai { background: " + AI_CLR + "; color: #fff; }" +
    ".hp2-ai-card__badge--cat { background: rgba(20,20,22,0.8); color: " + TEXT + "; border: 1px solid " + LINE + "; }" +
    ".hp2-ai-card__badge--artist { background: rgba(20,20,22,0.8); color: " + AI_CLR + "; border: 1px solid " + AI_CLR + "40; }" +
    ".hp2-ai-card__meta-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }" +
    ".hp2-ai-card__date { font-size: 11px; letter-spacing: 0.14em; color: " + MUTED + "; font-weight: 500; }" +
    ".hp2-ai-card__score { font-family: var(--font-outfit); font-size: 22px; font-weight: 600; color: " + AI_CLR + "; }" +
    ".hp2-ai-card__title { font-family: var(--font-outfit); font-size: 20px; font-weight: 600; letter-spacing: -0.015em; color: " + TEXT + "; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }" +
    ".hp2-ai-card__desc { font-size: 13px; color: " + MUTED + "; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 16px; flex: 1; }" +
    ".hp2-ai-card__cta { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: " + MUTED + "; margin-top: auto; padding-top: 16px; border-top: 1px solid " + LINE + "; transition: color .2s ease; }" +
    ".hp2-ai-card:hover .hp2-ai-card__cta { color: " + TEXT + "; }" +

    /* ── SECTIONS ── */
    ".hp2-section { padding: 56px 0; border-top: 1px solid " + LINE + "; }" +
    "@media (min-width: 768px) { .hp2-section { padding: 88px 0; } }" +
    ".hp2-section--tight { padding: 88px 0 64px; }" +
    ".hp2-section__kicker { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: " + MUTED + "; margin: 0 0 16px; font-weight: 500; }" +
    ".hp2-section__title { font-family: var(--font-outfit); font-size: clamp(28px, 6vw, 64px); line-height: 1.04; letter-spacing: -0.035em; font-weight: 500; margin: 0 0 32px; max-width: 16ch; }" +
    "@media (min-width: 768px) { .hp2-section__title { margin: 0 0 48px; } }" +
    ".hp2-section__title--sm { font-size: clamp(26px, 3.2vw, 44px); margin-bottom: 0; max-width: none; }" +
    ".hp2-row-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }" +
    ".hp2-link { font-size: 14px; color: " + MUTED + "; transition: color .2s ease; text-decoration: none; }" +
    ".hp2-link:hover { color: " + TEXT + "; }" +

    /* ── FEATURED EVENTS + SIDEBAR ── */
    ".hp2-discover { display: grid; grid-template-columns: 1fr; gap: 32px; }" +
    "@media (min-width: 1024px) { .hp2-discover { grid-template-columns: 1fr 320px; gap: 48px; } }" +
    ".hp2-events-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }" +
    "@media (min-width: 600px) { .hp2-events-grid { grid-template-columns: repeat(2, 1fr); } }" +
    ".hp2-event-card { display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; background: " + SURF + "; border: 1px solid " + LINE + "; text-decoration: none; transition: transform .3s ease, border-color .3s ease; }" +
    ".hp2-event-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.16); }" +
    ".hp2-event-card__img { position: relative; aspect-ratio: 1/1; overflow: hidden; background: " + SURF2 + "; }" +
    ".hp2-event-card__cat { position: absolute; top: 10px; left: 10px; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; padding: 4px 10px; border-radius: 6px; background: rgba(11,11,12,0.75); color: " + TEXT + "; backdrop-filter: blur(8px); }" +
    ".hp2-event-card__body { padding: 16px 18px 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; }" +
    ".hp2-event-card__title { font-family: var(--font-outfit); font-size: 17px; font-weight: 500; letter-spacing: -0.01em; color: " + TEXT + "; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }" +
    ".hp2-event-card:hover .hp2-event-card__title { color: " + ACCENT + "; }" +
    ".hp2-event-card__meta { display: flex; flex-direction: column; gap: 4px; margin-top: auto; }" +
    ".hp2-event-card__meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: " + MUTED + "; }" +

    /* ── SIDEBAR ── */
    ".hp2-sidebar { display: flex; flex-direction: column; gap: 24px; }" +
    ".hp2-cultural { padding: 24px; border-radius: 16px; background: linear-gradient(135deg, hsl(265 40% 22%) 0%, hsl(285 32% 14%) 100%); border: 1px solid hsl(265 40% 35% / 0.4); }" +
    ".hp2-cultural__label { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: hsl(265 75% 78%); font-weight: 600; margin-bottom: 12px; }" +
    ".hp2-cultural__text { font-size: 14px; color: hsl(265 18% 82%); line-height: 1.65; margin-bottom: 16px; }" +
    ".hp2-cultural__text strong { color: hsl(265 75% 82%); }" +
    ".hp2-cultural__link { font-size: 12px; font-weight: 600; color: hsl(265 70% 75%); text-decoration: none; transition: color .2s; }" +
    ".hp2-cultural__link:hover { color: hsl(265 80% 82%); }" +
    ".hp2-artists-sidebar { padding: 24px; border-radius: 16px; background: " + SURF + "; border: 1px solid " + LINE + "; }" +
    ".hp2-artist-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid " + LINE + "; text-decoration: none; transition: opacity .2s; }" +
    ".hp2-artist-row:last-of-type { border-bottom: none; }" +
    ".hp2-artist-row:hover { opacity: 0.8; }" +
    ".hp2-artist-row__avatar { position: relative; width: 44px; height: 44px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: " + SURF2 + "; }" +
    ".hp2-artist-row__name { font-size: 14px; font-weight: 500; color: " + TEXT + "; }" +
    ".hp2-artist-row__genre { font-size: 12px; color: " + MUTED + "; margin-top: 2px; }" +

    /* ── PILLARS ── */
    ".hp2-pillars { display: grid; grid-template-columns: 1fr; gap: 0; border-top: 1px solid " + LINE + "; }" +
    "@media (min-width: 768px) { .hp2-pillars { grid-template-columns: repeat(3, 1fr); } }" +
    ".hp2-pillar { padding: 40px 32px 40px 0; border-bottom: 1px solid " + LINE + "; }" +
    "@media (min-width: 768px) { .hp2-pillar { padding: 48px 32px 48px 0; border-bottom: none; border-right: 1px solid " + LINE + "; } .hp2-pillar:last-child { border-right: none; padding-right: 0; } .hp2-pillar:not(:first-child) { padding-left: 32px; } }" +
    ".hp2-pillar__num { font-family: var(--font-outfit); font-size: 12px; letter-spacing: 0.16em; color: " + ACCENT + "; }" +
    ".hp2-pillar__title { font-family: var(--font-outfit); font-size: 28px; font-weight: 500; letter-spacing: -0.02em; margin: 14px 0 12px; color: " + TEXT + "; }" +
    ".hp2-pillar__body { color: " + MUTED + "; font-size: 15px; line-height: 1.6; }" +
    ".hp2-pillar__cta { display: inline-flex; align-items: center; gap: 6px; margin-top: 24px; font-size: 13px; font-weight: 500; color: " + ACCENT + "; letter-spacing: 0.02em; text-decoration: none; border-bottom: 1px solid transparent; transition: border-color .2s, opacity .2s; }" +
    ".hp2-pillar__cta:hover { border-color: " + ACCENT + "; opacity: .8; }" +

    /* ── ARTIST MARQUEE ── */
    ".hp2-marquee-wrap { margin-top: 40px; }" +
    ".hp2-art-card { display: flex; flex-direction: column; width: 220px; gap: 12px; text-decoration: none; }" +
    ".hp2-art-card__art { position: relative; width: 100%; aspect-ratio: 1/1; border-radius: 14px; box-shadow: 0 0 0 1px " + LINE + " inset; transition: transform .4s ease; overflow: hidden; }" +
    ".hp2-art-card:hover .hp2-art-card__art { transform: translateY(-3px); }" +
    ".hp2-art-card__name { font-size: 14px; font-weight: 500; letter-spacing: -0.01em; color: " + TEXT + "; }" +
    ".hp2-art-card__genre { font-size: 12px; color: " + MUTED + "; }" +

    /* ── EVENT LIST ── */
    ".hp2-list { list-style: none; padding: 0; margin: 0; border-top: 1px solid " + LINE + "; }" +
    ".hp2-list__row { display: grid; grid-template-columns: 140px 1fr auto auto; align-items: center; gap: 24px; padding: 26px 0; border-bottom: 1px solid " + LINE + "; text-decoration: none; transition: padding-left .25s ease; }" +
    ".hp2-list__row:hover { padding-left: 10px; }" +
    "@media (max-width: 720px) { .hp2-list__row { grid-template-columns: 1fr auto; grid-template-areas: 'cat cta' 'title title' 'city city'; gap: 4px; padding: 20px 0; } .hp2-list__cat { grid-area: cat; } .hp2-list__title { grid-area: title; font-size: 20px; } .hp2-list__city { grid-area: city; } .hp2-list__cta { grid-area: cta; } }" +
    ".hp2-list__cat { font-size: 11px; letter-spacing: 0.18em; color: " + MUTED + "; font-weight: 500; }" +
    ".hp2-list__title { font-family: var(--font-outfit); font-size: 22px; font-weight: 500; letter-spacing: -0.015em; color: " + TEXT + "; }" +
    ".hp2-list__city { font-size: 14px; color: " + MUTED + "; }" +
    ".hp2-list__cta { font-size: 13px; color: " + TEXT + "; opacity: 0.55; transition: opacity .25s ease, color .25s ease; }" +
    ".hp2-list__row:hover .hp2-list__cta { opacity: 1; color: " + ACCENT + "; }" +

    /* ── FEATURED EVENT PANEL ── */
    ".hp2-feat-panel { display: grid; grid-template-columns: 1fr; }" +
    "@media (min-width: 860px) { .hp2-feat-panel { grid-template-columns: 1fr 380px; } }" +
    ".hp2-feat-hero { display: block; text-decoration: none; border-bottom: 1px solid rgba(196,181,253,0.10); }" +
    "@media (min-width: 860px) { .hp2-feat-hero { border-bottom: none; border-right: 1px solid rgba(196,181,253,0.10); } }" +
    ".hp2-feat-hero:hover .hp2-feat-hero__img img { transform: scale(1.04); }" +
    ".hp2-feat-hero__img { position: relative; aspect-ratio: 16/9; overflow: hidden; background: " + SURF2 + "; }" +
    ".hp2-feat-hero__img img { transition: transform .6s cubic-bezier(.2,.7,.2,1); }" +
    ".hp2-feat-row { display: flex; gap: 14px; align-items: flex-start; text-decoration: none; transition: background .2s ease; }" +
    ".hp2-feat-row:hover { background: #1E1A2B; }" +

    /* ── MARKETPLACE ── */
    ".hp2-market { border-top: 1px solid " + LINE + "; }" +
    ".hp2-market__inner { padding: 72px 0 88px; }" +
    ".hp2-market-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }" +
    "@media (min-width: 420px) { .hp2-market-grid { grid-template-columns: repeat(2, 1fr); } }" +
    "@media (min-width: 720px) { .hp2-market-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }" +
    "@media (min-width: 1080px) { .hp2-market-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; } }" +
    ".hp2-product { position: relative; display: flex; flex-direction: column; text-decoration: none; background: " + SURF + "; border-radius: 14px; overflow: hidden; border: 1px solid " + LINE + "; transition: border-color .2s, transform .2s; }" +
    ".hp2-product:hover { border-color: rgba(167,139,250,0.35); transform: translateY(-2px); }" +
    ".hp2-product__art { aspect-ratio: 1/1; position: relative; overflow: hidden; background: " + SURF2 + "; }" +
    ".hp2-product__art img { transition: transform .6s cubic-bezier(.2,.7,.2,1); }" +
    ".hp2-product:hover .hp2-product__art img { transform: scale(1.06); }" +
    ".hp2-product__badge { position: absolute; top: 10px; left: 10px; z-index: 2; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 9px; border-radius: 999px; background: rgba(7,6,10,0.78); backdrop-filter: blur(8px); color: " + AI_CLR + "; border: 1px solid rgba(196,181,253,0.18); }" +
    ".hp2-product__heart { position: absolute; top: 10px; right: 10px; z-index: 2; width: 30px; height: 30px; border-radius: 50%; background: rgba(7,6,10,0.78); backdrop-filter: blur(8px); border: 1px solid rgba(196,181,253,0.14); display: flex; align-items: center; justify-content: center; color: " + MUTED + "; opacity: 0; transform: translateY(-4px); transition: opacity .2s, transform .2s, color .15s; cursor: pointer; }" +
    ".hp2-product:hover .hp2-product__heart { opacity: 1; transform: translateY(0); }" +
    ".hp2-product__heart:hover { color: #FCA5A5; border-color: rgba(252,165,165,0.4); }" +
    ".hp2-product__quick { position: absolute; left: 12px; right: 12px; bottom: 12px; z-index: 2; height: 38px; border-radius: 10px; background: " + ACCENT + "; color: #0B0B0E; font-size: 13px; font-weight: 600; letter-spacing: -0.01em; display: flex; align-items: center; justify-content: center; gap: 6px; opacity: 0; transform: translateY(8px); transition: opacity .2s, transform .2s; }" +
    ".hp2-product:hover .hp2-product__quick { opacity: 1; transform: translateY(0); }" +
    ".hp2-product__info { padding: 14px 14px 16px; display: flex; flex-direction: column; gap: 6px; }" +
    ".hp2-product__store { font-size: 11px; color: " + MUTED + "; letter-spacing: 0.04em; text-transform: uppercase; }" +
    ".hp2-product__name { font-size: 14px; font-weight: 500; letter-spacing: -0.01em; color: " + TEXT + "; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 38px; }" +
    ".hp2-product__price-row { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; gap: 10px; }" +
    ".hp2-product__price { font-size: 15px; font-weight: 600; color: " + TEXT + "; letter-spacing: -0.01em; }" +
    ".hp2-product__price-cur { font-size: 11px; color: " + MUTED + "; font-weight: 500; margin-right: 2px; }" +
    ".hp2-product__rating { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: " + MUTED + "; }" +
    ".hp2-market__filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 24px 0 28px; }" +
    ".hp2-market__chip { font-size: 12px; font-weight: 500; padding: 7px 14px; border-radius: 999px; background: " + SURF + "; color: " + MUTED + "; border: 1px solid " + LINE + "; text-decoration: none; transition: color .15s, border-color .15s, background .15s; cursor: pointer; }" +
    ".hp2-market__chip:hover { color: " + TEXT + "; border-color: rgba(196,181,253,0.25); }" +
    ".hp2-market__chip--active { background: rgba(167,139,250,0.12); color: " + AI_CLR + "; border-color: rgba(167,139,250,0.35); }" +

    /* ── CTA ── */
    ".hp2-cta { border-top: 1px solid " + LINE + "; padding: 120px 0 140px; }" +
    ".hp2-cta__inner { text-align: center; max-width: 720px; margin: 0 auto; }" +
    ".hp2-cta__title { font-family: var(--font-outfit); font-size: clamp(40px, 7vw, 88px); line-height: 1; letter-spacing: -0.04em; font-weight: 600; margin: 0 0 20px; color: " + TEXT + "; }" +
    ".hp2-cta__title span { background: linear-gradient(110deg, #C4B5FD 0%, #A78BFA 40%, #818CF8 75%, #C084FC 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 0 18px rgba(167,139,250,0.55)); }" +
    ".hp2-cta__lede { color: " + MUTED + "; font-size: 18px; margin: 0 auto 36px; max-width: 480px; line-height: 1.6; }" +

    /* ── AD SLOTS ── */
    /* Wrapper gives every ad slot the same horizontal container as sections */
    /* and symmetrical 40px top/bottom breathing room */
    ".hp2-ad-slot { padding: 40px 0; }" +
    ".hp2-ad { position: relative; display: flex; align-items: center; justify-content: center;" +
    " border-radius: 12px; overflow: hidden;" +
    " border: 1px dashed rgba(167,139,250,0.15);" +
    " background: rgba(21,18,29,0.45); }" +
    ".hp2-ad__inner { display: flex; flex-direction: column; align-items: center;" +
    " justify-content: center; gap: 4px; width: 100%; height: 100%; }" +
    ".hp2-ad__label { font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;" +
    " color: rgba(167,139,250,0.28); font-weight: 600; position: absolute; top: 9px; left: 13px; }" +
    ".hp2-ad__placeholder { font-size: 12px; color: rgba(167,139,250,0.25); letter-spacing: -0.01em; }" +
    ".hp2-ad__dims { font-size: 10px; color: rgba(155,149,181,0.22); }" +
    /* Leaderboard 728x90 */
    ".hp2-ad--leaderboard { width: 100%; height: 90px; }" +
    "@media (max-width: 768px) { .hp2-ad--leaderboard { height: 56px; } }" +
    /* Sidebar rect — fills sidebar card naturally */
    ".hp2-ad--rect { width: 100%; height: 180px; border-radius: 16px; }" +
    /* Billboard 970x100 */
    ".hp2-ad--billboard { width: 100%; height: 90px; }" +
    "@media (max-width: 768px) { .hp2-ad--billboard { height: 60px; } }" +

    /* ── FOOTER ── */
    ".hp2-footer { border-top: 1px solid " + LINE + "; background: " + SURF + "; }" +
    ".hp2-footer__top { padding: 72px 0 56px; display: grid; grid-template-columns: 1fr; gap: 48px; }" +
    "@media (min-width: 768px) { .hp2-footer__top { grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; } }" +
    ".hp2-footer__brand-logo { height: 48px; width: auto; display: block; margin-bottom: 20px; }" +
    ".hp2-footer__tagline { font-size: 14px; color: " + MUTED + "; line-height: 1.65; max-width: 280px; margin-bottom: 28px; }" +
    ".hp2-footer__social { display: flex; gap: 10px; }" +
    ".hp2-footer__social-link { display: flex; align-items: center; justify-content: center;" +
    " width: 36px; height: 36px; border-radius: 50%; border: 1px solid " + LINE + ";" +
    " color: " + MUTED + "; font-size: 13px; font-weight: 600; text-decoration: none;" +
    " transition: border-color .25s ease, color .25s ease, background .25s ease; }" +
    ".hp2-footer__social-link:hover { border-color: " + ACCENT + "; color: " + ACCENT + "; background: rgba(167,139,250,0.08); }" +
    ".hp2-footer__col-title { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;" +
    " color: " + TEXT + "; font-weight: 600; margin-bottom: 20px; }" +
    ".hp2-footer__links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }" +
    ".hp2-footer__link { font-size: 14px; color: " + MUTED + "; text-decoration: none;" +
    " transition: color .2s ease; }" +
    ".hp2-footer__link:hover { color: " + TEXT + "; }" +
    ".hp2-footer__bottom { padding: 24px 0; border-top: 1px solid " + LINE + ";" +
    " display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }" +
    ".hp2-footer__legal { font-size: 13px; color: " + MUTED + "; }" +
    ".hp2-footer__legal a { color: " + MUTED + "; text-decoration: none; transition: color .2s; }" +
    ".hp2-footer__legal a:hover { color: " + TEXT + "; }" +
    ".hp2-footer__locale { display: flex; align-items: center; gap: 6px; font-size: 13px; color: " + MUTED + "; }"
  );

  return (
    <main style={{ background: BG, color: TEXT }} className="hp2">

      {/* ── 1. CINEMATIC HERO ── */}
      <HeroStage
        frames={frames}
        navLinks={[
          { label: "Artists",     href: "/artists" },
          { label: "Events",      href: "/events" },
          { label: "Academies",   href: "/academies" },
          { label: "Marketplace", href: "/marketplace" },
          { label: "About",       href: "/about" },
        ]}
        ctaLabel="Sign Up"
        ctaHref="/auth?tab=signup"
      />

      {/* ── 2. TAGLINE BAND ── */}
      <section className="hp2-intro">
        <div className="hp2-container">
          <div className="hp2-intro__layout">
            <Reveal>
              <div className="hp2-intro__content">
                <p className="hp2-section__kicker">Rasaswadaya · Sri Lanka</p>
                <h2 className="hp2-intro__title">
                  Where the island&apos;s<br />
                  <em>artistry</em> meets you.
                </h2>
                <p className="hp2-intro__lede">
                  A single place to discover Sri Lankan music, dance, theatre and film —
                  and the people who dedicate their lives to making it.
                </p>
                <div className="hp2-cta-row">
                  <Link href="/artists" className="hp2-btn hp2-btn--primary">Meet the artists</Link>
                  <Link href="/about"   className="hp2-btn hp2-btn--ghost">Our story →</Link>
                </div>
              </div>
            </Reveal>
            <div className="hp2-intro__map" aria-hidden>
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <path fill="url(#sl-grad)" d="M187.737 20.081c-2.019.404-45.235 14.136-45.235 14.136l85.22 27.06s-37.965-41.6-39.985-41.196zm23.281 41.64c-14.49-.219-26.62 2.57-39.84 6.018l-17.77 63.004c-4.761 33.46-10.786 66.5-28.273 95.719 10.939 80.264 13.738 164.088 40.389 237.478 31.632 35.377 68.531 36.233 109.855 8.078 87.857-9.33 112.196-73.646 111.47-147.011L326.266 183.65l-93.7-119.548c-7.886-1.562-14.961-2.282-21.548-2.381z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. AI SUGGESTIONS ENGINE ── */}
      <section className="hp2-ai">
        {!isLoggedIn ? (
          <div className="hp2-ai--guest">
            <div className="hp2-container">
              <Reveal>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span className="hp2-ai__badge">
                    <span className="hp2-ai__pulse" />
                    AI-Powered Suggestions
                  </span>
                  <h2 className="hp2-ai__guest-title">
                    Discover Sri Lankan Arts<br />
                    <span className="hp2-grad">Made for You.</span>
                  </h2>
                  <p className="hp2-ai__guest-lede">
                    Sign up and tell us what you love. We&apos;ll find artists and events
                    that match your taste in seconds.
                  </p>
                  <div className="hp2-cta-row hp2-cta-row--center">
                    <Link href="/auth?tab=signup" className="hp2-btn hp2-btn--ai"><span>Get Personal Picks</span></Link>
                    <Link href="/events"          className="hp2-btn hp2-btn--ghost">Browse Trending</Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        ) : (
          <div className="hp2-ai--loggedin">
            <div className="hp2-container">
              <div className="hp2-ai__header">
                <div>
                  <span className="hp2-ai__badge">
                    <span className="hp2-ai__pulse" />
                    Suggestions Engine Active
                  </span>
                  <h2 className="hp2-ai__title"><span className="hp2-grad">Made for You.</span></h2>
                  <p className="hp2-ai__sub">
                    <span style={{ color: AI_CLR }}>Personalised</span>
                  </p>
                </div>
                <Link href="/profile" className="hp2-btn hp2-btn--ghost">Set Preferences</Link>
              </div>

              <AIThinking minHeight={420}>
              <div className="hp2-ai__cards">
                {aiEvent1 && (
                  <Link href={"/events/" + buildSlug(aiEvent1.id, aiEvent1.title)} className="hp2-ai-card">
                    <div className="hp2-ai-card__img">
                      <ImageWithFallback
                        src={aiEvent1.imageUrl || "https://images.unsplash.com/photo-1540039155732-68096f21bb46?q=80&w=800"}
                        alt={aiEvent1.title}
                        fill
                        className="object-cover"
                      />
                      <span className="hp2-ai-card__badge hp2-ai-card__badge--ai">Top Match</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <div className="hp2-ai-card__meta-row">
                        <span className="hp2-ai-card__date">
                          {new Date(aiEvent1.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="hp2-ai-card__title">{aiEvent1.title}</h3>
                      <p className="hp2-ai-card__desc">{aiEvent1.description || "Recommended from cultural overlap"}</p>
                      <span className="hp2-ai-card__cta">View Details →</span>
                    </div>
                  </Link>
                )}
                {aiEvent2 && (
                  <Link href={"/events/" + buildSlug(aiEvent2.id, aiEvent2.title)} className="hp2-ai-card">
                    <div className="hp2-ai-card__img">
                      <ImageWithFallback
                        src={aiEvent2.imageUrl || "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800"}
                        alt={aiEvent2.title}
                        fill
                        className="object-cover"
                      />
                      <span className="hp2-ai-card__badge hp2-ai-card__badge--cat">{aiEvent2.category || "Event"}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <div className="hp2-ai-card__meta-row">
                        <span className="hp2-ai-card__date">
                          {new Date(aiEvent2.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="hp2-ai-card__title">{aiEvent2.title}</h3>
                      <p className="hp2-ai-card__desc">{aiEvent2.description || "Suggested for you"}</p>
                      <span className="hp2-ai-card__cta">Book Now →</span>
                    </div>
                  </Link>
                )}
                {aiArtist && (
                  <Link href={"/artists/" + toArtistSlug(aiArtist.name || "", aiArtist.id)} className="hp2-ai-card">
                    <div className="hp2-ai-card__img">
                      <ImageWithFallback
                        src={aiArtist.photoUrl || "https://images.unsplash.com/photo-1549834125-906c85a44004?q=80&w=800"}
                        alt={aiArtist.name}
                        fill
                        className="object-cover"
                      />
                      <span className="hp2-ai-card__badge hp2-ai-card__badge--artist">♥ Artist Match</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <div className="hp2-ai-card__meta-row">
                        <span className="hp2-ai-card__date" style={{ color: AI_CLR }}>Trending Choice</span>
                      </div>
                      <h3 className="hp2-ai-card__title">{aiArtist.name}</h3>
                      <p className="hp2-ai-card__desc">{aiArtist.aiReason || "Matched from your preferences."}</p>
                      <span className="hp2-ai-card__cta">View Profile →</span>
                    </div>
                  </Link>
                )}
              </div>
              </AIThinking>
            </div>
          </div>
        )}
      </section>

      {/* ── 5. ARTIST MARQUEE ── */}
      <section className="hp2-section hp2-section--tight">
        <div className="hp2-container">
          <Reveal>
            <div className="hp2-row-head">
              <div>
                <p className="hp2-section__kicker">Voices of the island</p>
                <h2 className="hp2-section__title hp2-section__title--sm">Artists in residence</h2>
              </div>
              <Link href="/artists" className="hp2-link">All artists →</Link>
            </div>
          </Reveal>
        </div>
        <div className="hp2-marquee-wrap">
          <Marquee duration={60} gap={20}>
            {[...artists.filter((a: any) => !!a.photoUrl), ...artists.filter((a: any) => !!a.photoUrl)].slice(0, 16).map((a: any, i: number) => (
              <Link key={String(a.id) + "-" + i} href={"/artists/" + toArtistSlug(a.name || "", a.id)} className="hp2-art-card">
                <div className="hp2-art-card__art" style={{ background: tintFor("a-" + String(a.id), 30) }}>
                  {a.photoUrl && (
                    <ImageWithFallback src={a.photoUrl} alt={a.name} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <p className="hp2-art-card__name">{a.name}</p>
                  <p className="hp2-art-card__genre">{a.genre || "Artist"}</p>
                </div>
              </Link>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ── 6. FEATURED EVENTS ── */}
      <section className="hp2-section">
        <div className="hp2-container">
          <Reveal>
            {events.length > 0 && (
              <div className="hp2-feat-panel" style={{
                background: "#15121D",
                border: "1px solid rgba(196,181,253,0.10)",
                borderRadius: 24,
                overflow: "hidden",
              }}>
                {/* ── Left: hero event ── */}
                <Link
                  href={"/events/" + buildSlug(events[0].id, events[0].title)}
                  className="hp2-feat-hero"
                >
                  {/* Image */}
                  <div className="hp2-feat-hero__img">
                    <ImageWithFallback
                      src={events[0].imageUrl || "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=1200"}
                      alt={events[0].title}
                      fill
                      className="object-cover"
                      style={{ transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }}
                    />
                    <span style={{
                      position: "absolute", top: 14, left: 14,
                      fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                      fontWeight: 700, padding: "5px 12px", borderRadius: 6,
                      background: "rgba(11,11,12,0.78)", color: "#F5F3FA",
                      backdropFilter: "blur(8px)",
                    }}>{events[0].category || "Event"}</span>
                  </div>
                  {/* Body */}
                  <div style={{ padding: "20px 24px 24px" }}>
                    <h3 style={{
                      fontFamily: "var(--font-outfit)", fontSize: "clamp(18px, 2vw, 24px)",
                      fontWeight: 600, letterSpacing: "-0.025em", color: "#F5F3FA",
                      margin: "0 0 10px", lineHeight: 1.25,
                    }}>{events[0].title}</h3>
                    {events[0].description && (
                      <p style={{
                        fontSize: 14, color: "#9B95B5", lineHeight: 1.55, margin: "0 0 14px",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>{events[0].description}</p>
                    )}
                    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9B95B5" }}>
                        <Calendar size={13} strokeWidth={1.5} />
                        {new Date(events[0].eventDate).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" })}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9B95B5" }}>
                        <MapPin size={13} strokeWidth={1.5} />
                        {events[0].location || "Sri Lanka"}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* ── Right panel: header + stacked rows ── */}
                <div>
                  {/* Panel header */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px 16px",
                    borderBottom: "1px solid rgba(196,181,253,0.10)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 3, height: 20, borderRadius: 2, background: "#A78BFA", flexShrink: 0 }} />
                      <span style={{
                        fontFamily: "var(--font-outfit)", fontSize: 17, fontWeight: 600,
                        letterSpacing: "-0.015em", color: "#F5F3FA",
                      }}>On the horizon</span>
                    </div>
                    <Link href="/events" className="hp2-link" style={{ fontSize: 13 }}>View all →</Link>
                  </div>

                  {/* Stacked event rows */}
                  {events.slice(1, 4).map((ev: any, i: number) => (
                    <Link
                      key={ev.id}
                      href={"/events/" + buildSlug(ev.id, ev.title)}
                      className="hp2-feat-row"
                      style={{
                        padding: "16px 24px",
                        borderBottom: i < 2 ? "1px solid rgba(196,181,253,0.07)" : "none",
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{
                        position: "relative", width: 80, height: 56,
                        borderRadius: 10, overflow: "hidden", flexShrink: 0,
                        background: "#1E1A2B",
                      }}>
                        <ImageWithFallback
                          src={ev.imageUrl || "https://images.unsplash.com/photo-1540039155732-68096f21bb46?w=300"}
                          alt={ev.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500,
                          letterSpacing: "-0.01em", color: "#F5F3FA",
                          margin: "0 0 5px", lineHeight: 1.3,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{ev.title}</p>
                        <p style={{ fontSize: 12, color: "#9B95B5", margin: 0, lineHeight: 1.4 }}>
                          {ev.category || "Event"} · {new Date(ev.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {ev.location || "Sri Lanka"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── 9. MARKETPLACE ── */}
      <section className="hp2-section">
        <div className="hp2-container">
          <Reveal>
            <div className="hp2-row-head">
              <div>
                <p className="hp2-section__kicker">Shop · Direct from makers</p>
                <h2 className="hp2-section__title hp2-section__title--sm">The marketplace</h2>
              </div>
              <Link href="/marketplace" className="hp2-link">View all →</Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="hp2-market__filters">
              <Link href="/marketplace" className="hp2-market__chip hp2-market__chip--active">All items</Link>
              <Link href="/marketplace?listing=sale" className="hp2-market__chip">For sale</Link>
              <Link href="/marketplace?listing=rent" className="hp2-market__chip">For rent</Link>
            </div>
          </Reveal>
          <div className="hp2-market-grid">
            {products.slice(0, 4).map((p: any, i: number) => (
              <Reveal key={p.id} delay={i * 60}>
                <Link href={"/products/" + buildSlug(p.id, p.name)} className="hp2-product">
                  <div className="hp2-product__art">
                    {p.createdAt && (Date.now() - new Date(p.createdAt).getTime() < 14 * 86400_000) && (
                      <span className="hp2-product__badge">New</span>
                    )}
                    {p.category && (
                      <span className="hp2-product__badge" style={{ left: "auto", right: 10 }}>{p.category}</span>
                    )}
                    <span className="hp2-product__heart" aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>
                    </span>
                    <ImageWithFallback
                      src={p.imageUrl || "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600"}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                    <span className="hp2-product__quick">Quick view →</span>
                  </div>
                  <div className="hp2-product__info">
                    <span className="hp2-product__store">{p.storeName || "Independent maker"}</span>
                    <p className="hp2-product__name">{p.name}</p>
                    <div className="hp2-product__price-row">
                      <span className="hp2-product__price">
                        {p.price != null && Number(p.price) > 0 ? (
                          <><span className="hp2-product__price-cur">Rs.</span>{Number(p.price).toLocaleString()}</>
                        ) : (
                          <span style={{ color: MUTED, fontWeight: 500 }}>Enquire</span>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. CTA ── */}
      <section className="hp2-cta">
        <div className="hp2-container">
          <Reveal>
            <div className="hp2-cta__inner">
              {isLoggedIn ? (
                <>
                  <h2 className="hp2-cta__title">
                    What&apos;s next?{" "}
                    <span>Explore.</span>
                  </h2>
                  <p className="hp2-cta__lede">
                    Your AI recommendations are live. Discover artists, book events, and shop from local makers.
                  </p>
                  <div className="hp2-cta-row hp2-cta-row--center">
                    <Link href="/events"      className="hp2-btn hp2-btn--primary">Browse events</Link>
                    <Link href="/artists"     className="hp2-btn hp2-btn--ghost">Discover artists →</Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="hp2-cta__title">
                    Sound good?<br />
                    <span>Come in.</span>
                  </h2>
                  <p className="hp2-cta__lede">
                    One account. Personal recommendations from our AI engine.
                    No spam, no dark patterns.
                  </p>
                  <div className="hp2-cta-row hp2-cta-row--center">
                    <Link href="/auth?tab=signup" className="hp2-btn hp2-btn--primary">Create your account</Link>
                    <Link href="/about"           className="hp2-btn hp2-btn--ghost">How it works →</Link>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 11. FOOTER ── */}
      <footer className="hp2-footer">
        <div className="hp2-container">
          <div className="hp2-footer__top">

            {/* Brand column */}
            <div>
              <img src="/logo.svg" alt="Rasaswadaya" className="hp2-footer__brand-logo" />
              <p className="hp2-footer__tagline">
                Sri Lanka&apos;s home for music, dance, theatre,
                visual arts and craft. Discover, support, celebrate.
              </p>
              <div className="hp2-footer__social">
                <Link href="https://instagram.com" className="hp2-footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">Ig</Link>
                <Link href="https://facebook.com"  className="hp2-footer__social-link" aria-label="Facebook"  target="_blank" rel="noopener noreferrer">Fb</Link>
                <Link href="https://youtube.com"   className="hp2-footer__social-link" aria-label="YouTube"   target="_blank" rel="noopener noreferrer">Yt</Link>
                <Link href="https://twitter.com"   className="hp2-footer__social-link" aria-label="X / Twitter" target="_blank" rel="noopener noreferrer">X</Link>
              </div>
            </div>

            {/* Discover */}
            <div>
              <p className="hp2-footer__col-title">Discover</p>
              <ul className="hp2-footer__links">
                <li><Link href="/events"                    className="hp2-footer__link">All Events</Link></li>
                <li><Link href="/events?category=music"     className="hp2-footer__link">Music</Link></li>
                <li><Link href="/events?category=dance"     className="hp2-footer__link">Dance</Link></li>
                <li><Link href="/events?category=theater"   className="hp2-footer__link">Theatre</Link></li>
                <li><Link href="/events?category=visual"    className="hp2-footer__link">Visual Arts</Link></li>
                <li><Link href="/artists"                   className="hp2-footer__link">Artists</Link></li>
              </ul>
            </div>

            {/* Platform */}
            <div>
              <p className="hp2-footer__col-title">Platform</p>
              <ul className="hp2-footer__links">
                <li><Link href="/marketplace"               className="hp2-footer__link">Marketplace</Link></li>
                <li><Link href="/profile"                   className="hp2-footer__link">My Profile</Link></li>
                <li><Link href="/auth?tab=signup"           className="hp2-footer__link">Create Account</Link></li>
                <li><Link href="/auth?tab=login"            className="hp2-footer__link">Sign In</Link></li>
                <li><Link href="/dashboard"                 className="hp2-footer__link">Artist Dashboard</Link></li>
                <li><Link href="/admin"                     className="hp2-footer__link">Admin</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="hp2-footer__col-title">Company</p>
              <ul className="hp2-footer__links">
                <li><Link href="/about"                     className="hp2-footer__link">About Us</Link></li>
                <li><Link href="/about#mission"             className="hp2-footer__link">Our Mission</Link></li>
                <li><Link href="/about#team"                className="hp2-footer__link">The Team</Link></li>
                <li><Link href="/contact"                   className="hp2-footer__link">Contact</Link></li>
                <li><Link href="/blog"                      className="hp2-footer__link">Blog</Link></li>
                <li><Link href="/press"                     className="hp2-footer__link">Press Kit</Link></li>
              </ul>
            </div>

          </div>{/* /top */}

          <div className="hp2-footer__bottom">
            <p className="hp2-footer__legal">
              &copy; {new Date().getFullYear()} Rasaswadaya. All rights reserved.
            </p>
            <p className="hp2-footer__legal">
              <Link href="/privacy">Privacy Policy</Link>
              {" · "}
              <Link href="/terms">Terms of Use</Link>
              {" · "}
              <Link href="/cookies">Cookie Settings</Link>
            </p>
            <p className="hp2-footer__locale">🇱🇰 Sri Lanka · English</p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: css }} />
    </main>
  );
}
