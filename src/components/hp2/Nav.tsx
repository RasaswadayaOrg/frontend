"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavCta } from "./NavCta";

export type NavLink = { label: string; href: string };

// Floating sticky nav for all non-home pages.
export function HP2Nav({
  links,
  ctaLabel = "Sign Up",
  ctaHref = "/auth?tab=signup",
  activePath,
}: {
  links: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  activePath?: string;
}) {
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (!activePath) return false;
    if (href === "/") return activePath === "/";
    return activePath === href || activePath.startsWith(href + "/") || activePath.startsWith(href + "?");
  };

  return (
    <>
      <div className="hp2-nav-wrap">
        <header className="hp2-nav" aria-label="Primary">
          <Link href="/" className="hp2-nav__brand" aria-label="Rasaswadaya home">
            <img src="/logo.svg" alt="Rasaswadaya" className="hp2-nav__brand-img" />
          </Link>

          <nav className="hp2-nav__pills">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={"hp2-nav__pill" + (isActive(l.href) ? " is-active" : "")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <NavCta label={ctaLabel} href={ctaHref} variant="nav" />

          <button
            type="button"
            className="hp2-nav__menu-btn"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </button>
        </header>
      </div>

      {/* Mobile drawer */}
      <div className={"hp2-drawer" + (open ? " is-open" : "")} aria-hidden={!open}>
        <div className="hp2-drawer__bg" onClick={() => setOpen(false)} />
        <aside className="hp2-drawer__panel" role="dialog" aria-label="Menu">
          <div className="hp2-drawer__head">
            <button
              type="button"
              className="hp2-drawer__close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <nav className="hp2-drawer__links">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={"hp2-drawer__link" + (isActive(l.href) ? " is-active" : "")}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href={ctaHref}
            className="hp2-btn hp2-btn--primary hp2-drawer__cta"
            onClick={() => setOpen(false)}
          >
            {ctaLabel}
          </Link>
        </aside>
      </div>
    </>
  );
}

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Artists",     href: "/artists" },
  { label: "Events",      href: "/events" },
  { label: "Academies",   href: "/academies" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "About",       href: "/about" },
];
