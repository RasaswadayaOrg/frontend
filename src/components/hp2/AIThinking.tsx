"use client";

import { useEffect, useRef, useState } from "react";

// Futuristic "generating recommendations" overlay for the AI section.
// Plays a short thinking sequence when scrolled into view, then reveals
// the underlying cards with a staggered fade-in. Server and client render
// the same initial DOM (overlay visible) → no hydration mismatch.
const AI_CLR  = "#C4B5FD";
const ACCENT  = "#A78BFA";
const PINK    = "#F0A6F8";  // soft magenta-pink
const HOT     = "#FF7AC6";  // hot pink accent
const SURF    = "#15121D";
const SURF2   = "#1E1A2B";
const LINE    = "rgba(196,181,253,0.10)";
const TEXT    = "#F5F3FA";
const MUTED   = "#9B95B5";

const AI_THINK_CSS =
  ".ai-think { position: relative; }" +

  // Cards beneath are hidden until reveal
  ".ai-think .hp2-ai__cards { opacity: 0; transform: translateY(12px);" +
  " transition: opacity 700ms cubic-bezier(.2,.7,.2,1), transform 700ms cubic-bezier(.2,.7,.2,1); }" +
  ".ai-think.is-revealed .hp2-ai__cards { opacity: 1; transform: translateY(0); }" +

  // Stagger each card on reveal
  ".ai-think .hp2-ai__cards .hp2-ai-card { opacity: 0; transform: translateY(10px);" +
  " transition: opacity 700ms cubic-bezier(.2,.7,.2,1), transform 700ms cubic-bezier(.2,.7,.2,1); }" +
  ".ai-think.is-revealed .hp2-ai__cards .hp2-ai-card:nth-child(1) { opacity: 1; transform: none; transition-delay: 80ms; }" +
  ".ai-think.is-revealed .hp2-ai__cards .hp2-ai-card:nth-child(2) { opacity: 1; transform: none; transition-delay: 200ms; }" +
  ".ai-think.is-revealed .hp2-ai__cards .hp2-ai-card:nth-child(3) { opacity: 1; transform: none; transition-delay: 320ms; }" +

  // Overlay
  ".ai-think__overlay { position: absolute; inset: 0; display: flex; flex-direction: column;" +
  " align-items: center; justify-content: center; gap: 28px;" +
  " border: 1px solid " + LINE + "; border-radius: 20px;" +
  " background:" +
  " radial-gradient(60% 50% at 20% 10%, " + HOT + "22 0%, transparent 60%)," +
  " radial-gradient(55% 45% at 85% 90%, " + PINK + "22 0%, transparent 60%)," +
  " radial-gradient(70% 60% at 50% 50%, " + ACCENT + "18 0%, transparent 70%)," +
  " linear-gradient(135deg, " + SURF + " 0%, " + SURF2 + " 100%);" +
  " overflow: hidden; z-index: 4;" +
  " transition: opacity 800ms cubic-bezier(.4,0,.2,1), transform 800ms cubic-bezier(.4,0,.2,1)," +
  " visibility 0s linear 800ms; }" +
  ".ai-think.is-revealed .ai-think__overlay { opacity: 0; transform: scale(1.03); visibility: hidden; }" +

  // Animated colour-shift aurora behind everything
  ".ai-think__aurora { position: absolute; inset: -20%; pointer-events: none; opacity: 0.55;" +
  " background:" +
  " radial-gradient(40% 35% at 30% 30%, " + HOT + "66 0%, transparent 60%)," +
  " radial-gradient(45% 40% at 70% 70%, " + ACCENT + "66 0%, transparent 60%)," +
  " radial-gradient(35% 30% at 60% 20%, " + PINK + "55 0%, transparent 60%);" +
  " filter: blur(40px); animation: ai-aurora 9s ease-in-out infinite alternate; }" +
  "@keyframes ai-aurora {" +
  " 0%   { transform: translate3d(-3%, -2%, 0) rotate(-4deg); }" +
  " 50%  { transform: translate3d(2%, 3%, 0) rotate(3deg); }" +
  " 100% { transform: translate3d(-2%, 2%, 0) rotate(-2deg); } }" +

  // Subtle grid backdrop in overlay
  ".ai-think__grid { position: absolute; inset: 0; pointer-events: none; opacity: 0.4;" +
  " background-image:" +
  " linear-gradient(" + PINK + "14 1px, transparent 1px)," +
  " linear-gradient(90deg, " + AI_CLR + "14 1px, transparent 1px);" +
  " background-size: 36px 36px;" +
  " mask-image: radial-gradient(60% 60% at 50% 50%, #000 30%, transparent 80%);" +
  " -webkit-mask-image: radial-gradient(60% 60% at 50% 50%, #000 30%, transparent 80%); }" +

  // Vertical scan line that sweeps across overlay
  ".ai-think__scan { position: absolute; left: 0; right: 0; height: 2px;" +
  " background: linear-gradient(90deg, transparent 0%, " + HOT + "55 25%, " + PINK + " 50%, " + AI_CLR + "55 75%, transparent 100%);" +
  " filter: blur(0.5px); box-shadow: 0 0 12px " + HOT + "55;" +
  " animation: ai-scan 2.6s ease-in-out infinite; pointer-events: none; }" +
  "@keyframes ai-scan {" +
  " 0%   { top: 12%; opacity: 0; }" +
  " 15%  { opacity: 0.9; }" +
  " 85%  { opacity: 0.9; }" +
  " 100% { top: 88%; opacity: 0; } }" +

  // Core orb — pink → violet gradient with halo
  ".ai-think__core { position: relative; width: 112px; height: 112px;" +
  " display: flex; align-items: center; justify-content: center;" +
  " filter: drop-shadow(0 0 24px " + HOT + "60) drop-shadow(0 0 40px " + ACCENT + "40); }" +
  ".ai-think__orb { position: absolute; inset: 22px; border-radius: 50%;" +
  " background: radial-gradient(circle at 35% 30%, #fff 0%, " + PINK + " 25%, " + HOT + " 50%, " + ACCENT + " 78%, transparent 95%);" +
  " filter: blur(2px); animation: ai-orb 2.6s ease-in-out infinite; }" +
  "@keyframes ai-orb {" +
  " 0%, 100% { transform: scale(1);    opacity: 0.9; }" +
  " 50%      { transform: scale(1.14); opacity: 1; } }" +
  ".ai-think__ring { position: absolute; inset: 0; border-radius: 50%;" +
  " border: 1px solid " + AI_CLR + "30;" +
  " border-top-color: " + HOT + "; border-right-color: " + PINK + ";" +
  " animation: ai-spin 1.8s linear infinite; }" +
  ".ai-think__ring--slow { inset: -12px; border: 1px dashed " + ACCENT + "40;" +
  " animation: ai-spin 6s linear infinite reverse; }" +
  "@keyframes ai-spin { to { transform: rotate(360deg); } }" +

  // Status text — 6 lines @ 1s each = 6s loop
  ".ai-think__label { font-family: var(--font-outfit), system-ui, sans-serif;" +
  " font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase;" +
  " background: linear-gradient(90deg, " + PINK + ", " + HOT + ", " + AI_CLR + ");" +
  " -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;" +
  " font-weight: 700; display: inline-flex; align-items: center; gap: 10px; }" +
  ".ai-think__dot { width: 6px; height: 6px; border-radius: 50%; background: " + HOT + ";" +
  " box-shadow: 0 0 10px " + HOT + ", 0 0 20px " + PINK + "80;" +
  " animation: ai-pulse 1.4s ease-in-out infinite; -webkit-text-fill-color: initial; }" +
  "@keyframes ai-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }" +

  ".ai-think__status { position: relative; height: 22px; min-width: 320px;" +
  " font-family: var(--font-outfit), system-ui, sans-serif;" +
  " font-size: 14px; letter-spacing: -0.005em; color: " + TEXT + "; text-align: center; }" +
  ".ai-think__line { position: absolute; left: 0; right: 0; opacity: 0;" +
  " animation: ai-line 12s ease-in-out infinite; }" +
  ".ai-think__line:nth-child(1) { animation-delay: 0s; }" +
  ".ai-think__line:nth-child(2) { animation-delay: 2s; }" +
  ".ai-think__line:nth-child(3) { animation-delay: 4s; }" +
  ".ai-think__line:nth-child(4) { animation-delay: 6s; }" +
  ".ai-think__line:nth-child(5) { animation-delay: 8s; }" +
  ".ai-think__line:nth-child(6) { animation-delay: 10s; }" +
  "@keyframes ai-line {" +
  " 0%   { opacity: 0; transform: translateY(6px); }" +
  " 4%   { opacity: 1; transform: translateY(0); }" +
  " 14%  { opacity: 1; transform: translateY(0); }" +
  " 18%  { opacity: 0; transform: translateY(-6px); }" +
  " 100% { opacity: 0; transform: translateY(-6px); } }" +

  ".ai-think__caret { display: inline-block; width: 8px; height: 14px; margin-left: 4px;" +
  " vertical-align: -2px; background: linear-gradient(180deg, " + PINK + ", " + HOT + ");" +
  " box-shadow: 0 0 6px " + HOT + "80; animation: ai-blink 0.9s steps(2) infinite; }" +
  "@keyframes ai-blink { 50% { opacity: 0; } }" +

  // Progress bar — pink/violet shimmer
  ".ai-think__bar { position: relative; width: 280px; max-width: 60%; height: 2px;" +
  " border-radius: 2px; background: " + PINK + "14; overflow: hidden;" +
  " box-shadow: 0 0 12px " + HOT + "30; }" +
  ".ai-think__bar::after { content: \"\"; position: absolute; top: 0; bottom: 0; width: 40%;" +
  " background: linear-gradient(90deg, transparent 0%, " + HOT + " 30%, " + PINK + " 50%, " + AI_CLR + " 70%, transparent 100%);" +
  " animation: ai-bar 1.6s ease-in-out infinite; }" +
  "@keyframes ai-bar {" +
  " 0%   { left: -40%; }" +
  " 100% { left: 100%; } }" +

  ".ai-think__meta { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;" +
  " color: " + MUTED + "; font-weight: 500; }" +
  ".ai-think__meta b { color: " + PINK + "; font-weight: 600; }" +

  // Reduced motion: skip the show entirely
  "@media (prefers-reduced-motion: reduce) {" +
  " .ai-think__overlay { display: none; }" +
  " .ai-think .hp2-ai__cards { opacity: 1; transform: none; }" +
  " .ai-think .hp2-ai__cards .hp2-ai-card { opacity: 1; transform: none; } }";

export function AIThinking({
  children,
  minHeight,
}: {
  children: React.ReactNode;
  minHeight?: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    let revealTimer: ReturnType<typeof setTimeout> | null = null;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            // Hold the "thinking" state long enough to feel intentional
            // (~5s = roughly one full status-line rotation cycle).
            revealTimer = setTimeout(() => setRevealed(true), 5200);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => {
      obs.disconnect();
      if (revealTimer) clearTimeout(revealTimer);
    };
  }, []);

  const cls = "ai-think" + (revealed ? " is-revealed" : "");

  return (
    <div
      ref={ref}
      className={cls}
      style={{ minHeight: typeof minHeight === "number" ? minHeight + "px" : undefined }}
    >
      <style dangerouslySetInnerHTML={{ __html: AI_THINK_CSS }} />

      {children}

      <div className="ai-think__overlay" aria-hidden={revealed}>
        <div className="ai-think__aurora" />
        <div className="ai-think__grid" />
        <div className="ai-think__scan" />

        <span className="ai-think__label">
          <span className="ai-think__dot" />
          Rasa AI · Generating
        </span>

        <div className="ai-think__core">
          <div className="ai-think__ring ai-think__ring--slow" />
          <div className="ai-think__ring" />
          <div className="ai-think__orb" />
        </div>

        <div className="ai-think__status" role="status" aria-live="polite">
          <span className="ai-think__line">Loading your cultural taste graph<span className="ai-think__caret" /></span>
          <span className="ai-think__line">Cross-referencing 1,200+ events<span className="ai-think__caret" /></span>
          <span className="ai-think__line">Mapping artist affinities<span className="ai-think__caret" /></span>
          <span className="ai-think__line">Weighing rasa &amp; tradition signals<span className="ai-think__caret" /></span>
          <span className="ai-think__line">Computing top matches<span className="ai-think__caret" /></span>
          <span className="ai-think__line">Curating your picks<span className="ai-think__caret" /></span>
        </div>

        <div className="ai-think__bar" />

        <span className="ai-think__meta">Personalising · <b>GNN v2.1</b></span>
      </div>
    </div>
  );
}
