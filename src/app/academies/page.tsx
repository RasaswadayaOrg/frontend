import Link from "next/link";
import { MapPin, School } from "lucide-react";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import { getAcademies, getAcademiesCount } from "../../lib/db";
import { buildSlug } from "../../lib/slug";
import { HP2Frame } from "../../components/hp2/Frame";
import { Reveal } from "../../components/hp2/Reveal";
import { LiveSearchBar } from "../../components/hp2/LiveSearchBar";

export const dynamic = "force-dynamic";

const TYPES = [
  { id: "",           label: "All" },
  { id: "Music",      label: "Music" },
  { id: "Dance",      label: "Dance" },
  { id: "Theatre",    label: "Theatre" },
  { id: "Art",        label: "Art" },
  { id: "Percussion", label: "Percussion" },
  { id: "Vocals",     label: "Vocals" },
];

function buildHref(base: string, params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const k of Object.keys(params)) { const v = params[k]; if (v) sp.set(k, v); }
  const qs = sp.toString();
  return qs ? base + "?" + qs : base;
}

export default async function AcademiesPage(props: {
  searchParams: Promise<{ page?: string; search?: string; type?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page   = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const type   = searchParams.type || "";
  const limit  = 9;

  const [academies, total] = await Promise.all([
    getAcademies(limit, page, search, type),
    getAcademiesCount(search, type),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <HP2Frame activePath="/academies">
      {/* Cover hero */}
      <header className="hp2-cover">
        <div className="hp2-cover__media hp2-cover__media--green" aria-hidden />
        <div className="hp2-container">
          <Reveal>
            <div className="hp2-cover__inner">
              <p className="hp2-cover__kicker">Academies · Learn</p>
              <h1 className="hp2-cover__title">Where <em>tradition</em> is taught.</h1>
              <p className="hp2-cover__lede">Find masters of dance, music, percussion and theatre.</p>
            </div>
          </Reveal>
        </div>
      </header>

      <section style={{ padding: "36px 0 80px" }}>
        <div className="hp2-container">

          <Reveal delay={80} zIndex={10}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
              <LiveSearchBar action="/academies" defaultValue={search} placeholder="Search academies, disciplines, locations…" type="academies" hiddenFields={type ? { type } : {}} />
              <div className="hp2-chips" role="tablist" aria-label="Filter by discipline">
                {TYPES.map((t) => (
                  <Link
                    key={t.id || "all"}
                    href={buildHref("/academies", { search, type: t.id || undefined })}
                    className={"hp2-chip" + (type === t.id ? " is-active" : "")}
                    role="tab"
                    aria-selected={type === t.id}
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          <p className="hp2-section__kicker" style={{ marginBottom: 20 }}>
            {total > 0
              ? "Showing " + ((page - 1) * limit + 1) + "–" + Math.min(page * limit, total) + " of " + total
              : "No academies match"}
          </p>

          {academies.length === 0 ? (
            <div className="hp2-empty">
              <p className="hp2-empty__title">No academies found</p>
              <p className="hp2-empty__lede">Try a different filter or check back soon.</p>
            </div>
          ) : (
            <div className="hp2-card-grid">
              {academies.map((ac: any, i: number) => (
                <Reveal key={ac.id} delay={i * 55}>
                  <Link href={"/academies/" + buildSlug(ac.id, ac.name)} className="hp2-card">
                    <div className="hp2-card__img">
                      <ImageWithFallback
                        src={ac.imageUrl || "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800"}
                        alt={ac.name}
                        fill
                        className="object-cover"
                      />
                      <span className="hp2-card__cat">
                        <School size={10} style={{ display: "inline", marginRight: 4 }} />
                        {ac.type || "Academy"}
                      </span>
                    </div>
                    <div className="hp2-card__body">
                      <h3 className="hp2-card__title">{ac.name}</h3>
                      {ac.description && (
                        <p style={{ fontSize: 13, color: "#9B95B5", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {ac.description}
                        </p>
                      )}
                      <div className="hp2-card__meta">
                        {(ac.city || ac.location) && (
                          <span className="hp2-card__meta-item">
                            <MapPin size={12} strokeWidth={1.5} />
                            {ac.city || ac.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="hp2-pager" aria-label="Pagination">
              <Link
                href={buildHref("/academies", { search, type, page: page > 1 ? String(page - 1) : undefined })}
                className={"hp2-pager__btn" + (page <= 1 ? " hp2-pager__btn--disabled" : "")}
              >← Prev</Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                .reduce<(number | "…")[]>((acc, n) => {
                  if (acc.length > 0 && typeof acc[acc.length - 1] === "number" && n - (acc[acc.length - 1] as number) > 1) acc.push("…");
                  acc.push(n); return acc;
                }, [])
                .map((n, i) => n === "…"
                  ? <span key={"e" + i} className="hp2-pager__btn hp2-pager__btn--disabled">…</span>
                  : <Link key={n} href={buildHref("/academies", { search, type, page: n === 1 ? undefined : String(n) })}
                      className={"hp2-pager__btn" + (n === page ? " is-active" : "")}
                      aria-current={n === page ? "page" : undefined}>{n}</Link>
                )}
              <Link
                href={buildHref("/academies", { search, type, page: page < totalPages ? String(page + 1) : undefined })}
                className={"hp2-pager__btn" + (page >= totalPages ? " hp2-pager__btn--disabled" : "")}
              >Next →</Link>
            </nav>
          )}
        </div>
      </section>
    </HP2Frame>
  );
}
