"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Renders the nav call-to-action.
 * - Logged out: shows the provided label/href (e.g. "Sign Up" → /auth?tab=signup).
 * - Logged in: shows the user's avatar + first name, linking to /profile.
 *   When the user holds an elevated role (ARTIST / ORGANIZER / STORE_OWNER),
 *   a small "mode" pill is rendered to the LEFT of the profile pill that links
 *   to their respective dashboard — e.g. "Artist mode →".
 *
 * `variant` selects which visual class to use so this component visually matches
 * the surrounding nav (the floating HP2Nav vs the Hero stage pill).
 */

const ROLE_DASHBOARDS: Record<string, { href: string; label: string; tone: string }> = {
  ARTIST:      { href: "/artist-dashboard",    label: "Artist mode",    tone: "#A78BFA" },
  ORGANIZER:   { href: "/organizer-dashboard", label: "Organizer mode", tone: "#FBBF24" },
  STORE_OWNER: { href: "/seller-dashboard",    label: "Seller mode",    tone: "#60A5FA" },
};

export function NavCta({
  label,
  href,
  variant = "nav",
}: {
  label: string;
  href: string;
  variant?: "nav" | "stage";
}) {
  const { user, isLoading, refreshUserFromAPI } = useAuth();

  // On mount, silently re-fetch the user's profile from the API so that
  // role changes (e.g. admin approved an artist request) are reflected
  // immediately without requiring a sign-out / sign-in cycle.
  useEffect(() => {
    refreshUserFromAPI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const baseClass = variant === "stage" ? "stage__pill stage__pill--solid" : "hp2-nav__cta";

  // Avoid a flash of "Sign Up" before the auth context hydrates from localStorage.
  if (isLoading) {
    return (
      <span
        className={baseClass}
        style={{ visibility: "hidden" }}
        aria-hidden="true"
      >
        {label}
      </span>
    );
  }

  if (!user) {
    return (
      <Link href={href} className={baseClass}>
        {label}
      </Link>
    );
  }

  const firstName = (user.name || user.email || "").split(" ")[0].split("@")[0] || "You";
  const initial = firstName.charAt(0).toUpperCase();
  const roleKey = (user.role || "").toUpperCase();
  const modePill = ROLE_DASHBOARDS[roleKey];

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {modePill && (
        <Link
          href={modePill.href}
          className="hp2-mode-pill"
          aria-label={"Switch to " + modePill.label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: variant === "stage" ? 36 : 34,
            padding: "0 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            color: modePill.tone,
            background: "rgba(167,139,250,0.10)",
            border: "1px solid " + hexWithAlpha(modePill.tone, 0.32),
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "background .2s ease, border-color .2s ease, transform .2s ease",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: modePill.tone,
              boxShadow: "0 0 8px " + hexWithAlpha(modePill.tone, 0.7),
            }}
          />
          {modePill.label}
          <span aria-hidden="true" style={{ opacity: 0.7, marginLeft: 2 }}>→</span>
        </Link>
      )}

      <Link
        href="/profile"
        className={baseClass}
        style={{
          gap: 8,
          paddingLeft: 6,
          paddingRight: 14,
        }}
        aria-label={"Open profile for " + firstName}
      >
        <span
          aria-hidden="true"
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(196,181,253,0.18)",
            color: "#1B1530",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0.2,
            overflow: "hidden",
            flexShrink: 0,
            border: "1px solid rgba(255,255,255,0.55)",
          }}
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            initial
          )}
        </span>
        <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {firstName}
        </span>
      </Link>
    </span>
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  // Accepts #RRGGBB and returns rgba(r,g,b,a).
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}
