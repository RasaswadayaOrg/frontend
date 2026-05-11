import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import { getEvents, getEventsCount } from "../../lib/db";
import { buildSlug } from "../../lib/slug";
import { HP2Frame } from "../../components/hp2/Frame";
import { Reveal } from "../../components/hp2/Reveal";
import { LiveSearchBar } from "../../components/hp2/LiveSearchBar";
import { CULTURAL_CATEGORIES } from "../../lib/cultural-preferences";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { id: "", label: "All" },
  ...CULTURAL_CATEGORIES.map((c) => ({ id: c.id, label: c.shortName })),
];

function buildHref(base: string, params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const k of Object.keys(params)) {
    const v = params[k];
    if (v) sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? base + "?" + qs : base;
}

export default async function EventsPage(props: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page     = Number(searchParams.page) || 1;
  const search   = searchParams.search || "";
  const category = searchParams.category || "";
  const limit    = 9;

  const [events, totalEvents] = await Promise.all([
    getEvents(limit, page, undefined, search, category),
    getEventsCount(search, category),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalEvents / limit));
  const now = Date.now();

  return (
    <HP2Frame activePath="/events">
      {/* Cover hero */}
      <header className="hp2-cover">
        <div className="hp2-cover__media hp2-cover__media--violet" aria-hidden />
        <div className="hp2-container">
          <Reveal>
            <div className="hp2-cover__inner">
              <p className="hp2-cover__kicker">Events · Sri Lanka</p>
              <h1 className="hp2-cover__title">Cultural events <em>tonight.</em></h1>
              <p className="hp2-cover__lede">Concerts, festivals and recitals — curated, live.</p>
            </div>
          </Reveal>
        </div>
      </header>

      <section style={{ padding: "36px 0 80px" }}>
        <div className="hp2-container">

          {/* Filter row */}
          <Reveal delay={80} zIndex={10}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
              <LiveSearchBar action="/events" defaultValue={search} placeholder="Search events, artists, venues…" type="events" hiddenFields={category ? { category } : {}} />

              <div className="hp2-chips" role="tablist" aria-label="Filter by category">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.id || "all"}
                    href={buildHref("/events", { search, category: c.id || undefined })}
                    className={"hp2-chip" + (category === c.id ? " is-active" : "")}
                    role="tab"
                    aria-selected={category === c.id}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Results meta */}
          <p className="hp2-section__kicker" style={{ marginBottom: 20 }}>
            {totalEvents > 0
              ? "Showing " + ((page - 1) * limit + 1) + "–" + Math.min(page * limit, totalEvents) + " of " + totalEvents
              : "No events match"}
          </p>

          {events.length === 0 ? (
            <div className="hp2-empty">
              <p className="hp2-empty__title">No events found</p>
              <p className="hp2-empty__lede">Try adjusting your filters or check back soon.</p>
            </div>
          ) : (
            <div className="hp2-evcard-grid">
              {events.map((ev: any, i: number) => {
                const dt = ev.eventDate ? new Date(ev.eventDate) : null;
                const isPast = dt ? dt.getTime() < now : false;
                const monthShort = dt ? dt.toLocaleDateString("en-GB", { month: "short" }).toUpperCase() : "";
                const dayNum = dt ? dt.getDate() : "";
                const weekday = dt ? dt.toLocaleDateString("en-GB", { weekday: "short" }) : "";
                return (
                  <Reveal key={ev.id} delay={i * 60}>
                    <Link href={"/events/" + buildSlug(ev.id, ev.title)} className="hp2-evcard">
                      <div className="hp2-evcard__img">
                        <ImageWithFallback
                          src={ev.imageUrl || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800"}
                          alt={ev.title}
                          fill
                          className="object-cover"
                        />
                        <span className={"hp2-evcard__cat" + (isPast ? " is-past" : "")}>
                          {isPast ? "Past" : (ev.category || "Event")}
                        </span>
                        {dt && (
                          <span className="hp2-evcard__date" aria-label={dt.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}>
                            <span className="hp2-evcard__date-month">{monthShort}</span>
                            <span className="hp2-evcard__date-day">{dayNum}</span>
                          </span>
                        )}
                      </div>
                      <div className="hp2-evcard__body">
                        <h3 className="hp2-evcard__title">{ev.title}</h3>
                        <div className="hp2-evcard__meta">
                          {weekday && (
                            <span className="hp2-evcard__meta-item">
                              <Calendar size={13} strokeWidth={1.6} />
                              {weekday}{ev.startTime ? " · " + ev.startTime : ""}
                            </span>
                          )}
                          {ev.location && (
                            <span className="hp2-evcard__meta-item">
                              <MapPin size={13} strokeWidth={1.6} />
                              <span className="hp2-evcard__loc">{ev.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="hp2-pager" aria-label="Pagination">
              <Link
                href={buildHref("/events", { search, category, page: page > 1 ? String(page - 1) : undefined })}
                className={"hp2-pager__btn" + (page <= 1 ? " hp2-pager__btn--disabled" : "")}
                aria-label="Previous page"
              >
                ← Prev
              </Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                .reduce<(number | "…")[]>((acc, n) => {
                  if (acc.length > 0 && typeof acc[acc.length - 1] === "number" && n - (acc[acc.length - 1] as number) > 1) {
                    acc.push("…");
                  }
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === "…" ? (
                    <span key={"e" + i} className="hp2-pager__btn hp2-pager__btn--disabled">…</span>
                  ) : (
                    <Link
                      key={n}
                      href={buildHref("/events", { search, category, page: n === 1 ? undefined : String(n) })}
                      className={"hp2-pager__btn" + (n === page ? " is-active" : "")}
                      aria-current={n === page ? "page" : undefined}
                    >
                      {n}
                    </Link>
                  )
                )}
              <Link
                href={buildHref("/events", { search, category, page: page < totalPages ? String(page + 1) : undefined })}
                className={"hp2-pager__btn" + (page >= totalPages ? " hp2-pager__btn--disabled" : "")}
                aria-label="Next page"
              >
                Next →
              </Link>
            </nav>
          )}
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hp2-evcard-grid {
              display: grid; grid-template-columns: 1fr; gap: 18px;
            }
            @media (min-width: 600px) { .hp2-evcard-grid { grid-template-columns: repeat(2, 1fr); gap: 22px; } }
            @media (min-width: 1000px) { .hp2-evcard-grid { grid-template-columns: repeat(3, 1fr); gap: 26px; } }

            .hp2-evcard {
              display: flex; flex-direction: column;
              border-radius: 18px; overflow: hidden; text-decoration: none;
              background: rgba(21,18,29,0.65);
              border: 1px solid rgba(196,181,253,0.10);
              backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
              transition: transform .35s cubic-bezier(0.22,1,0.36,1),
                          border-color .25s ease,
                          box-shadow .35s ease;
            }
            .hp2-evcard:hover {
              transform: translateY(-4px);
              border-color: rgba(196,181,253,0.28);
              box-shadow: 0 24px 50px -24px rgba(167,139,250,0.35);
            }

            .hp2-evcard__img {
              position: relative; aspect-ratio: 1 / 1; overflow: hidden;
              background: #1E1A2B;
            }
            .hp2-evcard__img img { transition: transform .6s cubic-bezier(0.22,1,0.36,1); }
            .hp2-evcard:hover .hp2-evcard__img img { transform: scale(1.05); }

            /* Category chip — top-left */
            .hp2-evcard__cat {
              position: absolute; top: 12px; left: 12px; z-index: 2;
              font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700;
              padding: 5px 10px; border-radius: 6px;
              background: rgba(11,11,12,0.78); color: #F5F3FA;
              backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
              border: 1px solid rgba(196,181,253,0.16);
            }
            .hp2-evcard__cat.is-past {
              background: rgba(11,11,12,0.85); color: #9B95B5;
              border-color: rgba(196,181,253,0.10);
            }

            /* Date badge — top-right, stacked Jun / 26 */
            .hp2-evcard__date {
              position: absolute; top: 12px; right: 12px; z-index: 2;
              display: flex; flex-direction: column; align-items: center;
              min-width: 52px; padding: 6px 8px 8px;
              border-radius: 12px; line-height: 1;
              background: rgba(255,255,255,0.96); color: #15121D;
              border: 1px solid rgba(196,181,253,0.40);
              box-shadow: 0 8px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(167,139,250,0.20) inset;
              backdrop-filter: blur(8px);
            }
            .hp2-evcard__date-month {
              font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
              color: #7C3AED; margin-bottom: 3px;
            }
            .hp2-evcard__date-day {
              font-family: var(--font-outfit, inherit);
              font-size: 22px; font-weight: 600; letter-spacing: -0.02em;
              color: #15121D;
            }

            .hp2-evcard__body {
              padding: 18px 20px 20px;
              display: flex; flex-direction: column; gap: 12px;
              flex: 1;
            }
            .hp2-evcard__title {
              font-family: var(--font-outfit, inherit);
              font-size: 17px; font-weight: 600; letter-spacing: -0.012em;
              color: #F5F3FA; line-height: 1.32;
              display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
              margin: 0;
              transition: color .2s ease;
            }
            .hp2-evcard:hover .hp2-evcard__title { color: #C4B5FD; }

            .hp2-evcard__meta {
              display: flex; flex-direction: column; gap: 7px;
              margin-top: auto;
              padding-top: 4px;
              border-top: 1px solid rgba(196,181,253,0.08);
            }
            .hp2-evcard__meta-item {
              display: flex; align-items: center; gap: 8px;
              font-size: 13px; color: #C4B0DA; line-height: 1.3;
              padding-top: 8px;
            }
            .hp2-evcard__meta-item:first-child { padding-top: 8px; }
            .hp2-evcard__meta-item svg { color: #A78BFA; flex-shrink: 0; }
            .hp2-evcard__loc {
              white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
              min-width: 0;
            }
          `,
        }}
      />
    </HP2Frame>
  );
}
