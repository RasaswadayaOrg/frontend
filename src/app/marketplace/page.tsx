import Link from "next/link";
import { MessageCircle, ShoppingBag, Star } from "lucide-react";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import { getProducts, getProductsCount, getCategories } from "../../lib/db";
import { buildSlug } from "../../lib/slug";
import { AddToCartButton } from "../../components/AddToCartButton";
import { HP2Frame } from "../../components/hp2/Frame";
import { Reveal } from "../../components/hp2/Reveal";
import { LiveSearchBar } from "../../components/hp2/LiveSearchBar";

export const dynamic = "force-dynamic";

function buildHref(base: string, params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const k of Object.keys(params)) { const v = params[k]; if (v) sp.set(k, v); }
  const qs = sp.toString();
  return qs ? base + "?" + qs : base;
}

export default async function MarketplacePage(props: {
  searchParams: Promise<{ page?: string; search?: string; category?: string; listing?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page     = Number(searchParams.page) || 1;
  const search   = searchParams.search || "";
  const category = searchParams.category || "";
  const listing  = searchParams.listing || ""; // "" | "rent" | "sale"
  const limit    = 12;

  const [products, total, categories] = await Promise.all([
    getProducts(limit, page, search, category, listing),
    getProductsCount(search, category, listing),
    getCategories(),
  ]);

  const visibleProducts = products;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const cats = [
    { value: "", label: "All" },
    ...((categories as any[]) || []).map((c: any) => ({ value: c.name as string, label: c.name as string })),
  ];

  return (
    <HP2Frame activePath="/marketplace">
      {/* Compact page header */}
      <header style={{ background: "#07060A", borderBottom: "1px solid rgba(196,181,253,0.08)", padding: "56px 0 28px" }}>
        <div className="hp2-container">
          <p className="hp2-section__kicker" style={{ marginBottom: 6 }}>Marketplace</p>
          <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(24px,4vw,38px)", fontWeight: 600, letterSpacing: "-0.025em", color: "#F5F3FA", margin: 0 }}>Instruments &amp; <em>more.</em></h1>
        </div>
      </header>

      <section style={{ padding: "28px 0 80px" }}>
        <div className="hp2-container">

          <Reveal delay={80} zIndex={10}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
              <LiveSearchBar action="/marketplace" defaultValue={search} placeholder="Search instruments, accessories, equipment…" type="products" hiddenFields={{ ...(category ? { category } : {}), ...(listing ? { listing } : {}) }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <div className="hp2-chips" role="tablist" aria-label="Filter by category">
                  {cats.map((c) => (
                    <Link
                      key={c.value || "all"}
                      href={buildHref("/marketplace", { search, category: c.value || undefined, listing: listing || undefined })}
                      className={"hp2-chip" + (category === c.value ? " is-active" : "")}
                      role="tab"
                      aria-selected={category === c.value}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
                <div className="hp2-chips" role="tablist" aria-label="Filter by listing type" style={{ borderLeft: "1px solid #2A1F4E", paddingLeft: 8 }}>
                  {[
                    { val: "",     label: "All Listings" },
                    { val: "sale", label: "For Sale" },
                    { val: "rent", label: "For Rent" },
                  ].map(({ val, label }) => (
                    <Link
                      key={val || "all-l"}
                      href={buildHref("/marketplace", { search, category: category || undefined, listing: val || undefined })}
                      className={"hp2-chip" + (listing === val ? " is-active" : "")}
                      role="tab"
                      aria-selected={listing === val}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <p className="hp2-section__kicker" style={{ marginBottom: 20 }}>
            {total > 0
              ? "Showing " + ((page - 1) * limit + 1) + "–" + Math.min(page * limit, total) + " of " + total + (listing === "rent" ? " · For Rent" : listing === "sale" ? " · For Sale" : "")
              : "No products match"}
          </p>

          {visibleProducts.length === 0 ? (
            <div className="hp2-empty">
              <div style={{ marginBottom: 16 }}><ShoppingBag size={32} style={{ color: "#9B95B5", margin: "0 auto" }} /></div>
              <p className="hp2-empty__title">No products found</p>
              <p className="hp2-empty__lede">Try a different search or browse all categories.</p>
            </div>
          ) : (
            <div className="hp2-card-grid hp2-card-grid--4">
              {visibleProducts.map((p: any, i: number) => {
                const isRent = p.listingType === 'rent';
                return (
                <Reveal key={p.id} delay={i * 45}>
                  <div className="hp2-card">
                    <Link href={"/products/" + buildSlug(p.id, p.name)} className="hp2-card__img" aria-label={p.name}>
                      <ImageWithFallback
                        src={p.imageUrl || "https://images.unsplash.com/photo-1524117074681-31bd4de22ad3?q=80&w=600"}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                      <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {p.category && <span className="hp2-card__cat" style={{ position: "static" }}>{p.category}</span>}
                        {isRent && <span className="hp2-card__cat" style={{ position: "static", background: "#7C3AED", color: "#fff" }}>FOR RENT</span>}
                      </div>
                    </Link>
                    <div className="hp2-card__body">
                      <Link href={"/products/" + buildSlug(p.id, p.name)}>
                        <h3 className="hp2-card__title">{p.name}</h3>
                      </Link>
                      {p.store?.name && (
                        <p style={{ fontSize: 12, color: "#9B95B5" }}>by {p.store.name}</p>
                      )}
                      {p.rating != null && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#F0A6F8" }}>
                          <Star size={11} fill="currentColor" />
                          {Number(p.rating).toFixed(1)}
                        </span>
                      )}
                      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 12 }}>
                        <span className="hp2-card__price">
                          {isRent && <span style={{ fontSize: 10, opacity: 0.7, display: "block", lineHeight: 1.2 }}>from</span>}
                          Rs.&nbsp;{Number(p.price).toLocaleString()}
                          {isRent && <span style={{ fontSize: 10, opacity: 0.7 }}>&nbsp;/ day</span>}
                        </span>
                        {isRent ? (
                          <Link
                            href={p.store?.id ? "/marketplace/stores/" + buildSlug(p.store.id, p.store.name) : "/marketplace"}
                            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, padding: "5px 10px", borderRadius: 6, background: "#3B1F7A", color: "#C4B5FD", whiteSpace: "nowrap", textDecoration: "none" }}
                          >
                            <MessageCircle size={11} /> Enquire
                          </Link>
                        ) : (
                          <AddToCartButton product={p} />
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="hp2-pager" aria-label="Pagination">
              <Link
                href={buildHref("/marketplace", { search, category, page: page > 1 ? String(page - 1) : undefined })}
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
                  : <Link key={n} href={buildHref("/marketplace", { search, category, page: n === 1 ? undefined : String(n) })}
                      className={"hp2-pager__btn" + (n === page ? " is-active" : "")}
                      aria-current={n === page ? "page" : undefined}>{n}</Link>
                )}
              <Link
                href={buildHref("/marketplace", { search, category, page: page < totalPages ? String(page + 1) : undefined })}
                className={"hp2-pager__btn" + (page >= totalPages ? " hp2-pager__btn--disabled" : "")}
              >Next →</Link>
            </nav>
          )}
        </div>
      </section>
    </HP2Frame>
  );
}
