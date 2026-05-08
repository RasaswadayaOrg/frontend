import { DesignStyles } from "./design";
import { HP2Nav, DEFAULT_NAV_LINKS, type NavLink } from "./Nav";
import { HP2Footer } from "./Footer";

// Full-page wrapper for HP2-redesigned pages. Includes:
//   • Design-system styles
//   • Floating top nav (sticky)
//   • Page content
//   • Site footer
//
// Use on every redesigned page except the homepage (which has its own
// HeroStage with built-in nav).
export function HP2Frame({
  children,
  navLinks = DEFAULT_NAV_LINKS,
  activePath,
  ctaLabel,
  ctaHref,
}: {
  children: React.ReactNode;
  navLinks?: NavLink[];
  activePath?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <main className="hp2">
      <DesignStyles />
      <HP2Nav links={navLinks} activePath={activePath} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      {children}
      <HP2Footer />
    </main>
  );
}
