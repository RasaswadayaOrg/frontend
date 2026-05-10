"use client";

/**
 * AuthGate — global client-side route guard.
 *
 * Watches the current pathname and, when the user navigates (or pastes a
 * direct URL) to a protected route while logged-out, opens the themed HP2
 * AuthModal with `returnUrl` set to the current path. While the modal is
 * up, it renders a themed "Sign-in required" hold screen so protected
 * content never flashes underneath.
 *
 * Mounted once globally inside the root layout.
 */

import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DesignStyles } from "@/components/hp2/design";

// Routes that require an authenticated user. Match either an exact path,
// or a path prefix (anything starting with `prefix + "/"`).
const PROTECTED_ROUTES: string[] = [
  "/profile",
  "/cart",
  "/checkout",
  "/orders",
  "/my-applications",
  "/role-application",
  "/artist-dashboard",
  "/organizer-dashboard",
  "/seller-dashboard",
  "/admin",
  "/dashboard",
];

function isProtectedPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return PROTECTED_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?"),
  );
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading, isAuthModalOpen, openAuthModal } = useAuth();

  const protectedRoute = useMemo(() => isProtectedPath(pathname), [pathname]);
  const blocked = protectedRoute && !isLoading && !user;

  // Open the auth modal when a logged-out user lands on a protected route
  // (initial load OR client-side navigation). Includes the current path so
  // the user is bounced back after signing in.
  useEffect(() => {
    if (!blocked) return;
    if (isAuthModalOpen) return;
    const returnUrl =
      (pathname || "/") +
      (typeof window !== "undefined" ? window.location.search || "" : "");
    openAuthModal(returnUrl);
  }, [blocked, isAuthModalOpen, openAuthModal, pathname]);

  if (blocked) {
    return <AuthRequiredHold pathname={pathname || "/"} onSignIn={() => openAuthModal(pathname || "/")} />;
  }

  return <>{children}</>;
}

/** Themed full-screen hold rendered while the auth modal is shown. */
function AuthRequiredHold({
  pathname,
  onSignIn,
}: {
  pathname: string;
  onSignIn: () => void;
}) {
  return (
    <main className="hp2" style={{ minHeight: "100vh" }}>
      <DesignStyles />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 20px",
        }}
      >
        <div
          role="status"
          aria-live="polite"
          style={{
            width: "100%",
            maxWidth: 480,
            textAlign: "center",
            background: "rgba(21,18,29,0.72)",
            border: "1px solid rgba(196,181,253,0.14)",
            borderRadius: 24,
            padding: "40px 32px",
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            boxShadow: "0 40px 90px -40px rgba(0,0,0,0.7)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 22px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              background:
                "radial-gradient(circle at 30% 30%, rgba(167,139,250,0.45), rgba(240,166,248,0.25) 60%, transparent 75%)",
              border: "1px solid rgba(196,181,253,0.20)",
              color: "#C4B5FD",
            }}
          >
            <Lock size={26} />
          </div>

          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#A78BFA",
              margin: "0 0 12px",
            }}
          >
            Sign-in required
          </p>
          <h1
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(26px, 4vw, 34px)",
              lineHeight: 1.15,
              color: "#F5F3FA",
              margin: "0 0 12px",
              fontWeight: 600,
            }}
          >
            This page is for members
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ibm-plex)",
              fontSize: 15,
              lineHeight: 1.55,
              color: "#9B95B5",
              margin: "0 0 28px",
            }}
          >
            Sign in or create an account to continue. We&apos;ll bring you straight back to{" "}
            <span style={{ color: "#C4B5FD" }}>{pathname}</span>.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }}>
            <button
              type="button"
              onClick={onSignIn}
              className="hp2-btn hp2-btn--accent"
              style={{ width: "100%", justifyContent: "center", gap: 8 }}
            >
              Sign in to continue <ArrowRight size={16} aria-hidden="true" />
            </button>
            <Link
              href="/"
              className="hp2-btn hp2-btn--ghost"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthGate;
