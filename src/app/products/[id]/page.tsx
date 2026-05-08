import { getProduct } from "../../../lib/db";
import { extractId, buildSlug } from "../../../lib/slug";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ArrowLeft, MessageCircle } from "lucide-react";
import { ProductPurchasePanel } from "@/components/products/ProductPurchasePanel";
import { HP2Frame } from "../../../components/hp2/Frame";
import { Reveal } from "../../../components/hp2/Reveal";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await getProduct(extractId(params.id));
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Rasas Marketplace`,
    description: product.description,
  };
}

export default async function ProductDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await getProduct(extractId(params.id));

  if (!product) return notFound();

  const reviews = Array.isArray((product as any).reviews) ? (product as any).reviews : [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount
    ? reviews.reduce((sum: number, r: any) => sum + Number(r?.rating || 0), 0) / reviewCount
    : 0;
  const roundedRating = Math.round(avgRating);

  return (
    <HP2Frame activePath="/marketplace">
      <section style={{ padding: "80px 0 100px" }}>
        <div className="hp2-container">

          {/* Back link */}
          <Reveal>
            <div style={{ marginBottom: 36 }}>
              <Link href="/marketplace" className="hp2-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <ArrowLeft size={14} />
                Back to Marketplace
              </Link>
            </div>
          </Reveal>

          {/* Main product grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
            <style>{`@media(min-width:900px){.prod-grid{grid-template-columns:1fr 1fr !important;}}`}</style>
            <div className="prod-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>

              {/* Left: Image */}
              <Reveal delay={40} zIndex={1}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    borderRadius: 20,
                    overflow: "hidden",
                    background: "#1E1A2B",
                    border: "1px solid rgba(196,181,253,0.10)",
                  }}>
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Thumbs row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{
                        position: "relative",
                        aspectRatio: "1/1",
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "#1E1A2B",
                        border: "1px solid rgba(196,181,253,0.10)",
                        cursor: "pointer",
                      }}>
                        <ImageWithFallback
                          src={product.imageUrl}
                          alt={product.name + " " + i}
                          fill
                          className="object-cover"
                          style={{ opacity: 0.7 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Right: Details */}
              <Reveal delay={80} zIndex={10}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                  {/* Name + rating */}
                  <div>
                    {product.category && (
                      <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9B95B5", fontWeight: 600, marginBottom: 10 }}>{product.category}</p>
                    )}
                    <h1 style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: "clamp(24px, 3.5vw, 38px)",
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      color: "#F5F3FA",
                      margin: "0 0 12px",
                    }}>{product.name}</h1>

                    {/* Stars */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", gap: 2 }}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={14}
                            style={{ color: idx < roundedRating ? "#C4B5FD" : "rgba(196,181,253,0.20)", fill: idx < roundedRating ? "#C4B5FD" : "none" }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: 12, color: "#9B95B5" }}>
                        {reviewCount > 0 ? avgRating.toFixed(1) + " (" + reviewCount + " review" + (reviewCount > 1 ? "s" : "") + ")" : "No reviews yet"}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    {product.listingType === 'rent' && (
                      <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7C3AED", fontWeight: 600, marginBottom: 4 }}>For Rent</p>
                    )}
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: "clamp(28px, 3vw, 40px)",
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      color: "#F5F3FA",
                    }}>
                      LKR {(product.price || 0).toLocaleString()}
                      {product.listingType === 'rent' && <span style={{ fontSize: 16, fontWeight: 400, color: "#9B95B5", marginLeft: 6 }}>/ day</span>}
                    </span>
                  </div>

                  {/* Store pill */}
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    background: "#15121D",
                    border: "1px solid rgba(196,181,253,0.10)",
                    borderRadius: 12,
                    alignSelf: "flex-start",
                  }}>
                    <div style={{
                      position: "relative",
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      overflow: "hidden",
                      background: "#1E1A2B",
                      flexShrink: 0,
                    }}>
                      <ImageWithFallback
                        src={product.store?.imageUrl || "https://placehold.co/80x80?text=" + (product.storeName || "S").charAt(0)}
                        alt={product.storeName || "Store"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: "#9B95B5", margin: 0 }}>Sold by</p>
                      <Link href={"/marketplace/stores/" + buildSlug(product.storeId, product.storeName)} style={{ fontSize: 13, fontWeight: 600, color: "#C4B5FD", textDecoration: "none" }}>
                        {product.storeName || "Unknown Store"}
                      </Link>
                    </div>
                  </div>

                  {/* Purchase panel */}
                  {product.listingType === 'rent' ? (
                    <div style={{ paddingTop: 20, borderTop: "1px solid rgba(196,181,253,0.10)", display: "flex", flexDirection: "column", gap: 12 }}>
                      <p style={{ fontSize: 13, color: "#9B95B5", margin: 0, lineHeight: 1.6 }}>
                        This item is available for rent. Contact the seller to discuss availability, deposit, and rental duration.
                      </p>
                      <Link
                        href={product.storeId ? "/marketplace/stores/" + buildSlug(product.storeId, product.storeName) : "/marketplace"}
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 12, background: "#7C3AED", color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none", alignSelf: "flex-start" }}
                      >
                        <MessageCircle size={15} /> Enquire to Rent
                      </Link>
                    </div>
                  ) : (
                    <ProductPurchasePanel
                      product={{
                        id: product.id,
                        name: product.name,
                        imageUrl: product.imageUrl,
                        price: product.price || 0,
                        stock: product.stock || 999,
                        storeId: product.storeId,
                        storeName: product.storeName || "Unknown Store",
                      }}
                    />
                  )}

                  {/* Description */}
                  {product.description && (
                    <div style={{
                      paddingTop: 20,
                      borderTop: "1px solid rgba(196,181,253,0.10)",
                    }}>
                      <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9B95B5", fontWeight: 600, marginBottom: 10 }}>Description</p>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: "#9B95B5", margin: 0 }}>
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>

          {/* Reviews */}
          <Reveal delay={120}>
            <div style={{
              marginTop: 64,
              paddingTop: 40,
              borderTop: "1px solid rgba(196,181,253,0.10)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <h2 style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  color: "#F5F3FA",
                  margin: 0,
                }}>Customer Reviews</h2>
                {reviewCount > 0 && (
                  <span style={{ fontSize: 13, color: "#9B95B5" }}>{avgRating.toFixed(1)} / 5 from {reviewCount} review{reviewCount > 1 ? "s" : ""}</span>
                )}
              </div>

              {reviewCount === 0 ? (
                <div className="hp2-empty" style={{ padding: "40px 0" }}>
                  <p className="hp2-empty__title">No reviews yet</p>
                  <p className="hp2-empty__lede">Be the first to share your feedback on this product.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
                  {reviews.slice(0, 5).map((review: any, index: number) => {
                    const name = review?.user?.name || review?.userName || review?.author || "Verified Customer";
                    const rating = Number(review?.rating || 0);
                    const date = review?.createdAt ? new Date(review.createdAt) : null;
                    return (
                      <div key={review?.id || index} style={{
                        background: "#15121D",
                        border: "1px solid rgba(196,181,253,0.10)",
                        borderRadius: 16,
                        padding: "18px 20px",
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#F5F3FA", margin: "0 0 6px" }}>{name}</p>
                            <div style={{ display: "flex", gap: 2 }}>
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star key={idx} size={12} style={{ color: idx < rating ? "#C4B5FD" : "rgba(196,181,253,0.20)", fill: idx < rating ? "#C4B5FD" : "none" }} />
                              ))}
                            </div>
                          </div>
                          {date && !Number.isNaN(date.getTime()) && (
                            <span style={{ fontSize: 11, color: "#9B95B5" }}>{date.toLocaleDateString()}</span>
                          )}
                        </div>
                        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#9B95B5", margin: 0 }}>
                          {review?.comment || review?.text || "Customer shared a star rating without written feedback."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>

        </div>
      </section>
    </HP2Frame>
  );
}

