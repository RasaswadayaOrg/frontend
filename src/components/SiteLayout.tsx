"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingChatBot } from "./FloatingChatBot";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // usePathname() can return null on the initial client render before the
  // Next.js router fully initialises. window.location.pathname is always
  // available synchronously on the client and matches the server's routing
  // decision — using it as a fallback prevents a hydration DOM mismatch.
  const effectivePath =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");

  // Routes that bring their own full chrome (nav + footer) via HP2Frame
  // or via a self-contained layout. SiteLayout should NOT add Header/Footer
  // for these — it would double up.
  const HP2_REDESIGNED = [
    "/events",
    "/artists",
    "/academies",
    "/marketplace",
    "/products",
    "/about",
    "/search",
    "/auth",
    "/songs",
    "/cart",
    "/checkout",
    "/orders",
    "/profile",
    "/my-applications",
  ];
  const isHP2Redesigned =
    effectivePath === "/" ||
    HP2_REDESIGNED.some((p) => effectivePath === p || effectivePath.startsWith(p + "/") || effectivePath.startsWith(p + "?"));

  const isAdmin              = effectivePath.startsWith("/admin");
  const isArtistDashboard    = effectivePath.startsWith("/artist-dashboard");
  const isOrganizerDashboard = effectivePath.startsWith("/organizer-dashboard");
  const isSellerDashboard    = effectivePath.startsWith("/seller-dashboard");

  if (isHP2Redesigned || isAdmin || isArtistDashboard || isOrganizerDashboard || isSellerDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingChatBot />
    </>
  );
}
