import { SellerSidebar } from "@/components/seller-dashboard/SellerSidebar";
import { SellerMobileNav } from "@/components/seller-dashboard/SellerMobileNav";
import { SellerHeader } from "@/components/seller-dashboard/SellerHeader";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50/80 dark:bg-zinc-950">
      <SellerHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-10 pb-20 md:pb-0">
          <SellerSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </main>
      <SellerMobileNav />
    </div>
  );
}
