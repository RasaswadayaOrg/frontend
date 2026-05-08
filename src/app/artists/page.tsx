import Link from "next/link";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import { getArtists, getArtistsCount } from "../../lib/db";
import { HP2Frame } from "../../components/hp2/Frame";
import { Reveal } from "../../components/hp2/Reveal";
import { LiveSearchBar } from "../../components/hp2/LiveSearchBar";
import { toArtistSlug } from "../../lib/slugs";
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

export default async function ArtistsPage(props: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page     = Number(searchParams.page) || 1;
  const search   = searchParams.search || "";
  const category = searchParams.category || "";
  const limit    = 12;

  const [artists, totalArtists] = await Promise.all([
    getArtists(limit, page, search, category),
    getArtistsCount(search, category),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalArtists / limit));

  return (
    <HP2Frame activePath="/artists">
      {/* Cover hero */}
      <header className="hp2-cover">
        <div className="hp2-cover__media hp2-cover__media--pink" aria-hidden />
        <div className="hp2-container">
          <Reveal>
            <div className="hp2-cover__inner">
              <p className="hp2-cover__kicker">Artists · Directory</p>
              <h1 className="hp2-cover__title">Voices of <em>Sri Lanka.</em></h1>
              <p className="hp2-cover__lede">Verified profiles. Real stories. Browse and book directly.</p>
            </div>
          </Reveal>
        </div>
      </header>

      <section style={{ padding: "36px 0 80px" }}>
        <div className="hp2-container">

          <Reveal delay={80} zIndex={10}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
              <LiveSearchBar action="/artists" defaultValue={search} placeholder="Search by name, instrument, or tradition…" type="artists" hiddenFields={category ? { category } : {}} />

              <div className="hp2-chips" role="tablist" aria-label="Filter by category">
                {CATEGORIES.map((g) => (
                  <Link
                    key={g.id || "all"}
                    href={buildHref("/artists", { search, category: g.id || undefined })}
                    className={"hp2-chip" + (category === g.id ? " is-active" : "")}
                    role="tab"
                    aria-selected={category === g.id}
                  >
                    {g.label}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          <p className="hp2-section__kicker" style={{ marginBottom: 20 }}>
            {totalArtists > 0
              ? "Showing " + ((page - 1) * limit + 1) + "–" + Math.min(page * limit, totalArtists) + " of " + totalArtists
              : "No artists match"}
          </p>

          {artists.length === 0 ? (
            <div className="hp2-empty">
              <p className="hp2-empty__title">No artists found</p>
              <p className="hp2-empty__lede">Try a different search or clear filters.</p>
            </div>
          ) : (
            <div className="hp2-artist-grid">
              {artists.map((a: any, i: number) => (
                <Reveal key={a.id} delay={i * 50}>
                  <Link href={"/artists/" + toArtistSlug(a.name || a.fullName || "", String(a.id))} className="hp2-artist">
                    <div className="hp2-artist__photo">
                      <ImageWithFallback
                        src={a.photoUrl || a.profileImageUrl || a.imageUrl || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600"}
                        alt={a.name || a.fullName || "Artist"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="hp2-artist__name">{a.name || a.fullName || "Unknown artist"}</p>
                      {(a.genre || a.specialty) && (
                        <p className="hp2-artist__genre">{a.genre || a.specialty}</p>
                      )}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="hp2-pager" aria-label="Pagination">
              <Link
                href={buildHref("/artists", { search, category, page: page > 1 ? String(page - 1) : undefined })}
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
                      href={buildHref("/artists", { search, category, page: n === 1 ? undefined : String(n) })}
                      className={"hp2-pager__btn" + (n === page ? " is-active" : "")}
                      aria-current={n === page ? "page" : undefined}
                    >
                      {n}
                    </Link>
                  )
                )}
              <Link
                href={buildHref("/artists", { search, category, page: page < totalPages ? String(page + 1) : undefined })}
                className={"hp2-pager__btn" + (page >= totalPages ? " hp2-pager__btn--disabled" : "")}
                aria-label="Next page"
              >
                Next →
              </Link>
            </nav>
          )}
        </div>
      </section>
    </HP2Frame>
  );
}
