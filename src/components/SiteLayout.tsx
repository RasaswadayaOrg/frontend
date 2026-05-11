"use client";

// Every route in the app now has its own navigation and footer:
//   - Public pages  → HP2Frame (HP2Nav + HP2Footer)
//   - Homepage      → HeroStage (floating overlay nav)
//   - Dashboards    → per-dashboard Header components
//   - Admin         → AdminSidebar
//   - Auth / 404    → HP2Frame or self-contained
//
// SiteLayout's old Header/Footer branch is no longer used and has been
// removed to prevent it appearing on 404 and other unmatched routes.

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
