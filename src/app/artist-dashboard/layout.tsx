import { ArtistSidebar } from "@/components/artist-dashboard/ArtistSidebar";
import { ArtistMobileNav } from "@/components/artist-dashboard/ArtistMobileNav";
import { ArtistHeader } from "@/components/artist-dashboard/ArtistHeader";

export default function ArtistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50/80 dark:bg-zinc-950">
      <ArtistHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-10 pb-20 md:pb-0">
          <ArtistSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </main>
      <ArtistMobileNav />
    </div>
  );
}
