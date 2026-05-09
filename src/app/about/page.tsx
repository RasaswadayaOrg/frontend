import Link from "next/link";
import { Globe, Heart, Users, Sparkles, Mic, Music, BookOpen, Trophy } from "lucide-react";
import { HP2Frame } from "../../components/hp2/Frame";
import { Reveal } from "../../components/hp2/Reveal";

export const metadata = {
  title: "About · Rasaswadaya",
  description: "Learn about our mission to preserve and promote Sri Lankan arts and culture.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Cultural Respect",
    text: "We honour every art form — from Kandyan classical to contemporary — as equally valid expressions of identity.",
  },
  {
    icon: Users,
    title: "Community First",
    text: "Every feature is built around practitioners, learners, and audiences, not algorithms.",
  },
  {
    icon: Globe,
    title: "Radical Openness",
    text: "Knowledge of Sri Lankan heritage belongs to everyone. We share freely and openly.",
  },
  {
    icon: Sparkles,
    title: "Joyful Craft",
    text: "Beautiful, responsive, accessible design — because arts deserves a stage worth standing on.",
  },
];

const STATS = [
  { num: "800+",  label: "Artists listed" },
  { num: "2,400+", label: "Events hosted" },
  { num: "18",   label: "Disciplines covered" },
  { num: "25",   label: "Districts reached" },
];

const TEAM = [
  { name: "Sithara Jayawardena", role: "Founder & Vision", icon: Mic },
  { name: "Ravindu Perera",     role: "Technology & AI",   icon: Sparkles },
  { name: "Amali Gunaratne",    role: "Cultural Research", icon: BookOpen },
  { name: "Pradeep Silva",      role: "Community Growth",  icon: Trophy },
];

export default function AboutPage() {
  return (
    <HP2Frame activePath="/about">
      {/* Cover hero */}
      <header className="hp2-cover">
        <div className="hp2-cover__media hp2-cover__media--violet" aria-hidden />
        <div className="hp2-container">
          <Reveal>
            <div className="hp2-cover__inner">
              <p className="hp2-cover__kicker">About · Rasaswadaya</p>
              <h1 className="hp2-cover__title">For the artists, <em>by those who care.</em></h1>
              <p className="hp2-cover__lede">A platform built to make Sri Lanka&rsquo;s arts visible.</p>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Stats */}
      <section style={{ padding: "36px 0 0" }}>
        <div className="hp2-container">
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 80 }}>
              {STATS.map((s) => (
                <div key={s.label} className="hp2-stat">
                  <span className="hp2-stat__num">{s.num}</span>
                  <span className="hp2-stat__label">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="hp2-section" id="mission">
        <div className="hp2-container">
          <Reveal>
            <p className="hp2-section__kicker">Why we exist</p>
            <h2 className="hp2-section__title">
              Visibility for<br />every practitioner.
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
              {(["Sri Lanka has an almost incomprehensible richness of intangible cultural heritage — Kandyan dance that dates back six centuries, drumming traditions handed person-to-person for generations, theatre forms known only to small communities. Yet most of these artists have no digital presence, no ticketing infrastructure, no marketplace.",
                "We are building the connective tissue: a platform where artists can be discovered, events can be found by the right audience, teachers can attract students, and crafts can reach buyers who understand their significance.",
                "We are not just a directory. We are an ongoing conversation between tradition and the present — powered by AI recommendations, genuine curation, and a deep commitment to the human beings behind every performance."
              ]).map((para, i) => (
                <p key={i} style={{ fontSize: 17, lineHeight: 1.7, color: i === 0 ? "#F5F3FA" : "#9B95B5", maxWidth: 720 }}>
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="hp2-section" id="values">
        <div className="hp2-container">
          <Reveal>
            <p className="hp2-section__kicker">What we stand for</p>
            <h2 className="hp2-section__title">Our values.</h2>
          </Reveal>
          <Reveal delay={60}>
            <div className="hp2-values-grid">
              {VALUES.map((v) => (
                <div key={v.title} className="hp2-value-card">
                  <div className="hp2-value-card__icon">
                    <v.icon size={18} strokeWidth={1.5} />
                  </div>
                  <p className="hp2-value-card__title">{v.title}</p>
                  <p className="hp2-value-card__text">{v.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="hp2-section" id="team">
        <div className="hp2-container">
          <Reveal>
            <p className="hp2-section__kicker">The people</p>
            <h2 className="hp2-section__title">Meet the team.</h2>
          </Reveal>
          <Reveal delay={60}>
            <div className="hp2-artist-grid">
              {TEAM.map((m, i) => (
                <div key={m.name} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{
                    aspectRatio: "1/1", borderRadius: 18, background: "#1E1A2B",
                    border: "1px solid rgba(196,181,253,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#A78BFA",
                  }}>
                    <m.icon size={36} strokeWidth={1} />
                  </div>
                  <div>
                    <p className="hp2-artist__name">{m.name}</p>
                    <p className="hp2-artist__genre">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="hp2-section">
        <div className="hp2-container" style={{ textAlign: "center" }}>
          <Reveal>
            <p className="hp2-page-head__kicker">Get involved</p>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(32px,5vw,64px)", fontWeight: 500, letterSpacing: "-0.03em", marginBottom: 20 }}>
              Join the ecosystem.
            </h2>
            <p style={{ color: "#9B95B5", fontSize: 16, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 32px" }}>
              Whether you&apos;re an artist, organiser, student, or lover of culture —
              there is a place for you here.
            </p>
            <div className="hp2-cta-row hp2-cta-row--center">
              <Link href="/auth?tab=signup" className="hp2-btn hp2-btn--primary">Create account</Link>
              <Link href="/artists"         className="hp2-btn hp2-btn--ghost">Explore artists</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </HP2Frame>
  );
}
