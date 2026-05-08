"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

/**
 * Reveal — fades + lifts children into view when they enter the viewport.
 * Honors prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  zIndex,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  zIndex?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 700ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms, transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
        ...(zIndex !== undefined ? { position: "relative" as const, zIndex } : {}),
      }}
    >
      {children}
    </div>
  );
}
