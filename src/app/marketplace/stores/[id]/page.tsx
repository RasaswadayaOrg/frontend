import { getStore, getStoreProducts, getStoreProductsCount } from "../../../../lib/db";
import { extractId, buildSlug } from "../../../../lib/slug";
import { ImageWithFallback } from "../../../../components/ImageWithFallback";
import { AddToCartButton } from "../../../../components/AddToCartButton";
import { Pagination } from "../../../../components/Pagination";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, Package, ArrowLeft, CheckCircle2, Phone, MessageSquare, ShieldCheck } from "lucide-react";
import { HP2Frame } from "../../../../components/hp2/Frame";
import { Reveal } from "../../../../components/hp2/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const store = await getStore(extractId(params.id));
  if (!store) return { title: "Store Not Found" };
  return {
    title: `${store.name} | Rasas Marketplace`,
    description: store.description,
  };
}

export default async function StorePage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const storeId = extractId(params.id);
  const page = Number(searchParams.page) || 1;
  const limit = 12;

  const [store, products, totalProducts] = await Promise.all([
    getStore(storeId),
    getStoreProducts(storeId, limit, page),
    getStoreProductsCount(storeId),
  ]);

  if (!store) return notFound();

  const totalPages = Math.ceil(totalProducts / limit);
  const initial = store.name?.charAt(0)?.toUpperCase() || "S";

  return (
    <HP2Frame activePath="/marketplace">

      {/* ── Seller profile hero ───────────────────────────── */}
      <header className="sp-hero">
        <div className="sp-hero__blur" aria-hidden />

        <div className="hp2-container sp-hero__inner">
          <Reveal>
            <Link href="/marketplace" className="sp-back">
              <ArrowLeft size={13} /> Marketplace
            </Link>

            <div className="sp-identity">
              {/* Avatar */}
              <div className="sp-avatar" aria-hidden>
                {store.imageUrl
                  ? <ImageWithFallback src={store.imageUrl} alt={store.name} fill className="object-cover" priority />
                  : <span className="sp-avatar__init">{initial}</span>
                }
              </div>

              {/* Name + badges */}
              <div className="sp-identity__body">
                <div className="sp-badges">
                  <span className="sp-badge sp-badge--verified">
                    <CheckCircle2 size={11} /> Verified Seller
                  </span>
                  {store.location && (
                    <span className="sp-badge">
                      <MapPin size={11} /> {store.location}
                    </span>
                  )}
                </div>
                <h1 className="sp-name">{store.name}</h1>
                {store.description && (
                  <p className="sp-desc">{store.description}</p>
                )}
                {/* Contact row */}
                {store.phone && (() => {
                  const digits = store.phone.replace(/\D/g, '');
                  const waNumber = digits.startsWith('0') ? '94' + digits.slice(1) : digits;
                  return (
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                      <a
                        href={`tel:${store.phone.replace(/\s/g, '')}`}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, background: "rgba(196,181,253,0.08)", border: "1px solid rgba(196,181,253,0.18)", color: "#C4B5FD", fontSize: 13, fontWeight: 500, textDecoration: "none" }}
                      >
                        <Phone size={13} />
                        {store.phone}
                      </a>
                      <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 16px", borderRadius: 999, background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.30)", color: "#25D366", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Stats row */}
            <div className="sp-stats">
              <div className="sp-stat">
                <span className="sp-stat__val">{totalProducts}</span>
                <span className="sp-stat__lbl">Listings</span>
              </div>
              {store.rating != null && (
                <div className="sp-stat">
                  <span className="sp-stat__val" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Star size={15} style={{ color: "#FFD86B", fill: "#FFD86B", flexShrink: 0 }} />
                    {Number(store.rating).toFixed(1)}
                  </span>
                  <span className="sp-stat__lbl">
                    {store.reviewCount != null ? `${store.reviewCount} reviews` : "Rating"}
                  </span>
                </div>
              )}
              <div className="sp-stat">
                <span className="sp-stat__val" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <ShieldCheck size={15} style={{ color: "#A78BFA", flexShrink: 0 }} /> Secure
                </span>
                <span className="sp-stat__lbl">PayHere &amp; COD</span>
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── Products section ─────────────────────────────── */}
      <section className="sp-products">
        <div className="hp2-container">
          <Reveal>
            <div className="sp-products__head">
              <div>
                <p className="hp2-section__kicker" style={{ margin: "0 0 4px" }}>Storefront</p>
                <h2 className="sp-products__title">
                  All listings
                </h2>
              </div>
              {totalProducts > 0 && (
                <span className="sp-products__count">
                  <Package size={13} />
                  {(page - 1) * limit + 1}–{Math.min(page * limit, totalProducts)} of {totalProducts}
                </span>
              )}
            </div>
          </Reveal>

          {products.length === 0 ? (
            <div className="hp2-empty" style={{ marginTop: 32 }}>
              <p className="hp2-empty__title">No listings yet</p>
              <p className="hp2-empty__lede">This seller hasn&rsquo;t listed any items yet. Check back soon.</p>
            </div>
          ) : (
            <div className="hp2-card-grid hp2-card-grid--4" style={{ marginTop: 28 }}>
              {products.map((product: any, i: number) => (
                <Reveal key={product.id} delay={i * 40}>
                  <div className="hp2-card">
                    <Link
                      href={`/products/${buildSlug(product.id, product.name)}`}
                      className="hp2-card__img"
                      aria-label={product.name}
                    >
                      <ImageWithFallback
                        src={product.imageUrl || "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {product.listingType === 'rent' && (
                          <span className="sp-stock-badge" style={{ position: "static", background: "rgba(124,58,237,0.9)", color: "#fff" }}>FOR RENT</span>
                        )}
                      </div>
                      {product.listingType !== 'rent' && product.stock != null && product.stock < 5 && product.stock > 0 && (
                        <span className="sp-stock-badge">Only {product.stock} left</span>
                      )}
                      {product.listingType !== 'rent' && product.stock === 0 && (
                        <span className="sp-stock-badge sp-stock-badge--out">Out of stock</span>
                      )}
                    </Link>
                    <div className="hp2-card__body">
                      <Link href={`/products/${buildSlug(product.id, product.name)}`}>
                        <h3 className="hp2-card__title">{product.name}</h3>
                      </Link>
                      {product.category && (
                        <p style={{ fontSize: 11, color: "#9B95B5", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                          {product.category}
                        </p>
                      )}
                      {product.rating != null && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#FFD86B", marginBottom: 4 }}>
                          <Star size={11} fill="currentColor" />
                          {Number(product.rating).toFixed(1)}
                        </span>
                      )}
                      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 10 }}>
                        <span className="hp2-card__price">
                          {product.listingType === 'rent' && <span style={{ fontSize: 10, opacity: 0.7, display: "block", lineHeight: 1.2 }}>from</span>}
                          Rs.&nbsp;{Number(product.price).toLocaleString()}
                          {product.listingType === 'rent' && <span style={{ fontSize: 10, opacity: 0.7 }}>&nbsp;/ day</span>}
                        </span>
                        {product.listingType === 'rent' ? (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, padding: "5px 10px", borderRadius: 6, background: "#3B1F7A", color: "#C4B5FD", whiteSpace: "nowrap" }}>
                            <MessageCircle size={11} /> Enquire
                          </span>
                        ) : (
                          <AddToCartButton product={{ ...product, store: { id: storeId, name: store.name } }} />
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/marketplace/stores/${buildSlug(storeId, store.name)}`}
          />
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────── */}
      {totalProducts > 0 && (
        <section style={{ padding: "0 0 80px" }}>
          <div className="hp2-container">
            <div className="sp-cta">
              <div>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 18, fontWeight: 500, color: "#F5F3FA", margin: "0 0 6px" }}>
                  Have a question for this seller?
                </p>
                <p style={{ fontSize: 14, color: "#9B95B5", margin: 0 }}>
                  Add any item to your cart and use the Chat button to message the seller directly.
                </p>
              </div>
              <Link href="/marketplace" className="hp2-btn hp2-btn--ghost hp2-btn--sm" style={{ flexShrink: 0 }}>
                <MessageSquare size={14} /> Browse More Stores
              </Link>
            </div>
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Seller Profile Hero ── */
        .sp-hero {
          position: relative; overflow: hidden;
          background: #07060A;
          border-bottom: 1px solid rgba(196,181,253,0.08);
          padding: 0;
        }
        .sp-hero__blur {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 20% 0%, rgba(167,139,250,0.14) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 100%, rgba(109,40,217,0.10) 0%, transparent 55%);
          pointer-events: none;
        }
        .sp-hero__inner {
          position: relative; z-index: 2;
          padding-top: 88px; padding-bottom: 36px;
        }

        .sp-back {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 13px; color: #9B95B5; text-decoration: none;
          padding: 7px 14px; border-radius: 999px;
          border: 1px solid rgba(196,181,253,0.14);
          background: rgba(21,18,29,0.5);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          transition: color .18s, border-color .18s;
          margin-bottom: 32px;
        }
        .sp-back:hover { color: #F5F3FA; border-color: rgba(196,181,253,0.28); }

        .sp-identity {
          display: flex; align-items: flex-start; gap: 20px;
          margin-bottom: 28px;
        }
        @media (min-width: 600px) {
          .sp-identity { gap: 28px; }
        }

        .sp-avatar {
          position: relative; flex-shrink: 0;
          width: 88px; height: 88px; border-radius: 20px;
          overflow: hidden; background: #1E1A2B;
          border: 2px solid rgba(167,139,250,0.24);
          box-shadow: 0 12px 32px -8px rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
        }
        @media (min-width: 600px) {
          .sp-avatar { width: 108px; height: 108px; border-radius: 24px; }
        }
        .sp-avatar__init {
          font-family: var(--font-outfit);
          font-size: 36px; font-weight: 600; color: #A78BFA;
          line-height: 1; user-select: none;
        }

        .sp-identity__body { flex: 1; min-width: 0; padding-top: 6px; }

        .sp-badges { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 10px; }
        .sp-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600;
          padding: 5px 11px; border-radius: 6px;
          background: rgba(21,18,29,0.6); color: #C4B5FD;
          border: 1px solid rgba(196,181,253,0.14);
        }
        .sp-badge--verified { background: rgba(167,139,250,0.12); color: #A78BFA; border-color: rgba(167,139,250,0.28); }

        .sp-name {
          font-family: var(--font-outfit);
          font-size: clamp(24px, 4vw, 40px);
          font-weight: 600; letter-spacing: -0.025em; line-height: 1.1;
          color: #F5F3FA; margin: 0 0 10px;
        }
        .sp-desc {
          font-size: 14px; line-height: 1.65; color: #9B95B5;
          max-width: 540px; margin: 0;
        }

        /* Stats row */
        .sp-stats {
          display: flex; flex-wrap: wrap; gap: 0;
          background: rgba(21,18,29,0.55);
          border: 1px solid rgba(196,181,253,0.10);
          border-radius: 14px; overflow: hidden;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          max-width: 520px;
        }
        .sp-stat {
          flex: 1; min-width: 100px;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 14px 20px;
          border-right: 1px solid rgba(196,181,253,0.08);
        }
        .sp-stat:last-child { border-right: none; }
        .sp-stat__val {
          font-family: var(--font-outfit);
          font-size: 20px; font-weight: 600; color: #F5F3FA; line-height: 1;
        }
        .sp-stat__lbl {
          font-size: 11px; color: #9B95B5; text-transform: uppercase;
          letter-spacing: 0.10em; font-weight: 500; white-space: nowrap;
        }

        /* Products section */
        .sp-products { padding: 44px 0 32px; }
        .sp-products__head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
        }
        .sp-products__title {
          font-family: var(--font-outfit);
          font-size: clamp(20px, 2.8vw, 30px);
          font-weight: 500; letter-spacing: -0.02em; color: #F5F3FA; margin: 0;
        }
        .sp-products__count {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: #9B95B5;
        }

        /* Stock badge overlay on card image */
        .sp-stock-badge {
          position: absolute; bottom: 8px; left: 8px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.05em;
          padding: 4px 10px; border-radius: 6px;
          background: rgba(251,191,36,0.9); color: #0a0a0b;
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
        }
        .sp-stock-badge--out { background: rgba(248,113,113,0.9); color: #fff; }

        /* Contact CTA bar */
        .sp-cta {
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; flex-wrap: wrap;
          padding: 20px 28px; border-radius: 16px;
          background: rgba(21,18,29,0.55);
          border: 1px solid rgba(196,181,253,0.10);
        }
      ` }} />
    </HP2Frame>
  );
}
