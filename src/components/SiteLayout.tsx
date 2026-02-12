"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingChatBot } from "./FloatingChatBot";
import AuthModal from "./AuthModal";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isArtistDashboard = pathname?.startsWith("/artist-dashboard");
  const isOrganizerDashboard = pathname?.startsWith("/organizer-dashboard");

  if (isAdmin || isArtistDashboard || isOrganizerDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingChatBot />
      <AuthModal />
    </>
  );
}
