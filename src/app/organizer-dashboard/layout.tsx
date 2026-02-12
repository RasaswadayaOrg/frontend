import { OrganizerSidebar } from "@/components/organizer-dashboard/OrganizerSidebar";
import { OrganizerMobileNav } from "@/components/organizer-dashboard/OrganizerMobileNav";
import { OrganizerHeader } from "@/components/organizer-dashboard/OrganizerHeader";

export default function OrganizerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50/80 dark:bg-zinc-950">
      <OrganizerHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-10 pb-20 md:pb-0">
          <OrganizerSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </main>
      <OrganizerMobileNav />
    </div>
  );
}
