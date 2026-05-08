import Link from "next/link";
import { HP2Frame } from "../components/hp2/Frame";

export default function NotFound() {
  return (
    <HP2Frame>
      <section style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px" }}>
        <div style={{ maxWidth: 540 }}>
          <p style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(96px, 20vw, 200px)",
            fontWeight: 800,
            lineHeight: 0.85,
            letterSpacing: "-0.06em",
            background: "linear-gradient(135deg, #A78BFA, #F0A6F8 60%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 24,
            display: "block",
            userSelect: "none",
          }}>404</p>

          <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(22px,4vw,36px)", fontWeight: 500, letterSpacing: "-0.03em", color: "#F5F3FA", marginBottom: 14 }}>
            Page not found.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#9B95B5", marginBottom: 36 }}>
            The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
            Head back to discover artists, events, and culture.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/"        className="hp2-btn hp2-btn--primary">Go Home</Link>
            <Link href="/events"  className="hp2-btn hp2-btn--ghost">Browse Events</Link>
            <Link href="/artists" className="hp2-btn hp2-btn--ghost">Explore Artists</Link>
          </div>
        </div>
      </section>
    </HP2Frame>
  );
}
