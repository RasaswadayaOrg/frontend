"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { RoleSwitcher } from "@/components/RoleSwitcher";

/**
 * Renders the nav call-to-action.
 * - Logged out: shows the provided label/href (e.g. "Sign Up" → /auth?tab=signup).
 * - Logged in: shows the user's avatar + first name, linking to /profile.
 *   If the user has been approved for any elevated roles (ARTIST / ORGANIZER /
 *   STORE_OWNER), a dropdown role switcher is rendered to the left so they
 *   can pick which dashboard to enter.
 */

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

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <RoleSwitcher variant="pill" />

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
