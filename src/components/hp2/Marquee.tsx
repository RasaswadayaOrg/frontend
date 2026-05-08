"use client";

import { ReactNode } from "react";

const MARQUEE_CSS =
  ".marquee { width: 100%; overflow: hidden;" +
  " mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);" +
  " -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent); }" +
  ".marquee__track { display: flex; width: max-content;" +
  " animation: mq-scroll linear infinite; will-change: transform; }" +
  ".marquee:hover .marquee__track { animation-play-state: paused; }" +
  ".marquee__group { display: flex; flex-shrink: 0; }" +
  "@keyframes mq-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }" +
  "@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }";

export function Marquee({
  children,
  duration = 50,
  gap = 24,
}: {
  children: ReactNode;
  duration?: number;
  gap?: number;
}) {
  return (
    <div className="marquee" aria-hidden={false}>
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />
      <div
        className="marquee__track"
        style={{ animationDuration: String(duration) + "s", gap: String(gap) + "px" }}
      >
        <div className="marquee__group" style={{ gap: String(gap) + "px" }}>
          {children}
        </div>
        <div className="marquee__group" style={{ gap: String(gap) + "px" }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
