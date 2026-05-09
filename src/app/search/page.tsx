import Link from "next/link";
import { Calendar, MapPin, Search, Music, School, ShoppingBag, Users } from "lucide-react";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import { getArtists, getEvents, getProducts, getAcademies } from "../../lib/db";
import { buildSlug } from "../../lib/slug";
import { HP2Frame } from "../../components/hp2/Frame";
import { Reveal } from "../../components/hp2/Reveal";

export const dynamic = "force-dynamic";

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await props.searchParams;
  const query = (q || "").trim();

  const LIMIT = 6;

  const [artists, events, products, academies] = query
    ? await Promise.all([
        getArtists(LIMIT, 1, query, ""),
        getEvents(LIMIT, 1, undefined, query, ""),
        getProducts(LIMIT, 1, query, ""),
        getAcademies(LIMIT, 1, query, ""),
      ])
    : [[], [], [], []];

  const total = artists.length + events.length + products.length + academies.length;

  return (
    <HP2Frame activePath="/search">
      {/* Cover hero */}
      <header className="hp2-cover" style={{ minHeight: 260, padding: "96px 0 36px" }}>
        <div className="hp2-cover__media hp2-cover__media--blue" aria-hidden />
        <div className="hp2-container">
          <Reveal>
            <div className="hp2-cover__inner">
              <p className="hp2-cover__kicker">Universal search</p>
              <h1 className="hp2-cover__title">
                {query ? <>Results for <em>&ldquo;{query}&rdquo;</em></> : <>Find <em>anything</em>.</>}
              </h1>
              {query && (
                <p className="hp2-cover__lede">
                  {total > 0
                    ? total + " result" + (total === 1 ? "" : "s") + " across all categories."
                    : "No results — try a different term."}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </header>

      <section style={{ padding: "24px 0 80px" }}>
        <div className="hp2-container">

          <Reveal delay={60}>
            <form action="/search" method="get" className="hp2-search" role="search" style={{ maxWidth: 680, marginBottom: 64 }}>
              <span className="hp2-search__icon"><Search size={18} strokeWidth={1.5} /></span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search artists, events, crafts, academies…"
                className="hp2-input"
                aria-label="Search everything"
                autoFocus={!query}
                style={{ height: 54, fontSize: 16 }}
              />
            </form>
          </Reveal>

          {!query && (
            <Reveal delay={80}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {[
                  { href: "/artists",     icon: Users,      label: "Browse Artists",   sub: "Dancers, musicians, performers" },
                  { href: "/events",      icon: Calendar,   label: "Upcoming Events",  sub: "Concerts, festivals, shows" },
                  { href: "/marketplace", icon: ShoppingBag,label: "Marketplace",      sub: "Instruments, crafts, attire" },
                  { href: "/academies",   icon: School,     label: "Academies",        sub: "Schools, gurus, lessons" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "#15121D", border: "1px solid rgba(196,181,253,0.10)", borderRadius: 16, textDecoration: "none", transition: "border-color .2s ease" }}
                    className="hp2-card"
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(167,139,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA", flexShrink: 0 }}>
                      <item.icon size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: "#F5F3FA", marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: "#9B95B5" }}>{item.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          {query && total === 0 && (
            <div className="hp2-empty">
              <p className="hp2-empty__title">Nothing found for &ldquo;{query}&rdquo;</p>
              <p className="hp2-empty__lede">Try simpler terms or browse a category from the nav.</p>
            </div>
          )}

          {/* Artists */}
          {artists.length > 0 && (
            <div className="hp2-results-section">
              <div className="hp2-results-section__head">
                <p className="hp2-section__kicker" style={{ marginBottom: 0 }}>
                  <Users size={12} style={{ display: "inline", marginRight: 6 }} />Artists
                </p>
                <Link href={"/artists?search=" + encodeURIComponent(query)} className="hp2-link">All artists →</Link>
              </div>
              <div className="hp2-artist-grid">
                {artists.map((a: any) => (
                  <Link key={a.id} href={"/artists/" + String(a.id)} className="hp2-artist">
                    <div className="hp2-artist__photo">
                      <ImageWithFallback
                        src={a.profileImageUrl || a.imageUrl || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400"}
                        alt={a.name || a.fullName || "Artist"}
                        fill className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="hp2-artist__name">{a.name || a.fullName}</p>
                      {(a.genre || a.specialty) && <p className="hp2-artist__genre">{a.genre || a.specialty}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {events.length > 0 && (
            <div className="hp2-results-section">
              <div className="hp2-results-section__head">
                <p className="hp2-section__kicker" style={{ marginBottom: 0 }}>
                  <Calendar size={12} style={{ display: "inline", marginRight: 6 }} />Events
                </p>
                <Link href={"/events?search=" + encodeURIComponent(query)} className="hp2-link">All events →</Link>
              </div>
              <div className="hp2-card-grid">
                {events.map((ev: any) => {
                  const dt = ev.eventDate ? new Date(ev.eventDate) : null;
                  return (
                    <Link key={ev.id} href={"/events/" + buildSlug(ev.id, ev.title)} className="hp2-card">
                      <div className="hp2-card__img">
                        <ImageWithFallback
                          src={ev.imageUrl || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600"}
                          alt={ev.title} fill className="object-cover"
                        />
                        {ev.category && <span className="hp2-card__cat">{ev.category}</span>}
                      </div>
                      <div className="hp2-card__body">
                        <h3 className="hp2-card__title">{ev.title}</h3>
                        <div className="hp2-card__meta">
                          {dt && <span className="hp2-card__meta-item"><Calendar size={11} strokeWidth={1.5} />{dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>}
                          {ev.location && <span className="hp2-card__meta-item"><MapPin size={11} strokeWidth={1.5} />{ev.location}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products */}
          {products.length > 0 && (
            <div className="hp2-results-section">
              <div className="hp2-results-section__head">
                <p className="hp2-section__kicker" style={{ marginBottom: 0 }}>
                  <ShoppingBag size={12} style={{ display: "inline", marginRight: 6 }} />Marketplace
                </p>
                <Link href={"/marketplace?search=" + encodeURIComponent(query)} className="hp2-link">All products →</Link>
              </div>
              <div className="hp2-card-grid hp2-card-grid--4">
                {products.map((p: any) => (
                  <Link key={p.id} href={"/products/" + buildSlug(p.id, p.name)} className="hp2-card">
                    <div className="hp2-card__img">
                      <ImageWithFallback
                        src={p.imageUrl || "https://images.unsplash.com/photo-1524117074681-31bd4de22ad3?w=400"}
                        alt={p.name} fill className="object-cover"
                      />
                      {p.category && <span className="hp2-card__cat">{p.category}</span>}
                    </div>
                    <div className="hp2-card__body">
                      <h3 className="hp2-card__title">{p.name}</h3>
                      <p className="hp2-card__price">Rs.&nbsp;{Number(p.price).toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Academies */}
          {academies.length > 0 && (
            <div className="hp2-results-section">
              <div className="hp2-results-section__head">
                <p className="hp2-section__kicker" style={{ marginBottom: 0 }}>
                  <School size={12} style={{ display: "inline", marginRight: 6 }} />Academies
                </p>
                <Link href={"/academies?search=" + encodeURIComponent(query)} className="hp2-link">All academies →</Link>
              </div>
              <div className="hp2-card-grid">
                {academies.map((ac: any) => (
                  <Link key={ac.id} href={"/academies/" + buildSlug(ac.id, ac.name)} className="hp2-card">
                    <div className="hp2-card__img">
                      <ImageWithFallback
                        src={ac.imageUrl || "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600"}
                        alt={ac.name} fill className="object-cover"
                      />
                      {ac.type && <span className="hp2-card__cat">{ac.type}</span>}
                    </div>
                    <div className="hp2-card__body">
                      <h3 className="hp2-card__title">{ac.name}</h3>
                      {ac.city && <span className="hp2-card__meta-item"><MapPin size={11} strokeWidth={1.5} />{ac.city}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </HP2Frame>
  );
}
