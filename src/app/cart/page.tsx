"use client";

import { useCart } from "@/context/CartContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { HP2Nav, DEFAULT_NAV_LINKS } from "@/components/hp2/Nav";
import { HP2Footer } from "@/components/hp2/Footer";
import { DesignStyles } from "@/components/hp2/design";

export default function CartPage() {
  const { user } = useAuth();
  const { items, itemCount, totalPrice, updateQuantity, removeItem, isLoading, fetchCart } = useCart();
  const router = useRouter();
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null); // product id pending removal

  useEffect(() => { if (user) fetchCart(); }, [user]);

  const inner = () => {
    if (!user) return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", textAlign: "center", gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(167,139,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShoppingBag size={28} style={{ color: "#A78BFA" }} />
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 22, fontWeight: 500, color: "#F5F3FA", marginBottom: 8 }}>Sign in to view your cart</p>
          <p style={{ fontSize: 14, color: "#9B95B5", marginBottom: 24 }}>Your saved items will appear here once you&rsquo;re logged in.</p>
          <Link href="/auth?tab=login" className="hp2-btn hp2-btn--primary">Sign in</Link>
        </div>
      </div>
    );

    if (isLoading && itemCount === 0) return (
      <div className="hp2-loading"><div className="hp2-spinner hp2-spinner--lg" /></div>
    );

    if (itemCount === 0) return (
      <div className="hp2-empty" style={{ marginTop: 40 }}>
        <div style={{ marginBottom: 16, color: "#9B95B5" }}><ShoppingBag size={36} /></div>
        <p className="hp2-empty__title">Your cart is empty</p>
        <p className="hp2-empty__lede">Explore instruments, accessories and cultural items in the marketplace.</p>
        <div style={{ marginTop: 24 }}><Link href="/marketplace" className="hp2-btn hp2-btn--accent">Explore Marketplace <ArrowRight size={14} style={{ display: "inline", marginLeft: 6 }} /></Link></div>
      </div>
    );

    return (
      <div className="hp2-two-col">
        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} className="hp2-surf" style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px" }}>
              <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", position: "relative", background: "#1E1A2B", flexShrink: 0 }}>
                <ImageWithFallback src={item.product?.imageUrl || ""} alt={item.product?.name || "Product"} fill className="object-cover" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: "#F5F3FA", marginBottom: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {item.product?.name}
                </p>
                <p style={{ fontSize: 12, color: "#9B95B5", marginBottom: 6 }}>{item.product?.store?.name}</p>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 600, color: "#F5F3FA" }}>
                  Rs.&nbsp;{(item.product?.price || 0).toLocaleString()}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
                <div className="hp2-qty">
                  <button type="button" className="hp2-qty__btn"
                    onClick={() => item.quantity === 1 ? setConfirmRemove(item.product.id) : updateQuantity(item.product.id, item.quantity - 1)}
                    aria-label={item.quantity === 1 ? "Remove" : "Decrease"}
                    style={item.quantity === 1 ? { color: "#f87171" } : undefined}>
                    <Minus size={14} />
                  </button>
                  <span className="hp2-qty__val">{item.quantity}</span>
                  <button type="button" className="hp2-qty__btn" disabled={item.quantity >= item.product.stock} onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label="Increase">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="hp2-summary">
          <div className="hp2-surf">
            <div className="hp2-surf__head">
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 500, color: "#F5F3FA" }}>Order Summary</p>
            </div>
            <div className="hp2-surf__body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9B95B5" }}>
                <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                <span style={{ color: "#F5F3FA", fontWeight: 500 }}>Rs.&nbsp;{totalPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9B95B5" }}>
                <span>Shipping</span><span>Calculated at checkout</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(196,181,253,0.10)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: "#F5F3FA" }}>Total</span>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 22, fontWeight: 600, color: "#A78BFA" }}>
                  Rs.&nbsp;{totalPrice.toLocaleString()}
                </span>
              </div>
              <button type="button" onClick={() => router.push("/checkout")}
                className="hp2-btn hp2-btn--accent" style={{ width: "100%" }}>
                Proceed to Checkout <ArrowRight size={14} style={{ display: "inline", marginLeft: 6 }} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    );
  };

  return (
    <main className="hp2">
      <DesignStyles />

      {/* Remove confirmation modal */}
      {confirmRemove && (() => {
        const prod = items.find(i => i.product.id === confirmRemove)?.product;
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(7,6,10,0.72)", backdropFilter: "blur(6px)" }}
            onClick={() => setConfirmRemove(null)}>
            <div className="hp2-surf" style={{ maxWidth: 320, width: "90%", padding: "20px 20px 18px", borderRadius: 16, border: "1px solid rgba(196,181,253,0.12)" }}
              onClick={e => e.stopPropagation()}>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "#F5F3FA", margin: "0 0 18px" }}>
                Remove &ldquo;{prod?.name}&rdquo;?
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className="hp2-btn hp2-btn--ghost" style={{ flex: 1, fontSize: 13 }}
                  onClick={() => setConfirmRemove(null)}>
                  Cancel
                </button>
                <button type="button" className="hp2-btn" style={{ flex: 1, fontSize: 13, background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.22)" }}
                  onClick={() => { removeItem(confirmRemove); setConfirmRemove(null); }}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <HP2Nav links={DEFAULT_NAV_LINKS} activePath="/cart" />
      <section style={{ paddingBottom: 80 }}>
        <header className="hp2-cover" style={{ minHeight: 220, padding: "88px 0 28px" }}>
          <div className="hp2-cover__media hp2-cover__media--violet" aria-hidden />
          <div className="hp2-container">
            <div className="hp2-cover__inner">
              <p className="hp2-cover__kicker">Your selection</p>
              <h1 className="hp2-cover__title">Shopping <em>cart.</em></h1>
            </div>
          </div>
        </header>

        <div className="hp2-container" style={{ paddingTop: 32 }}>
          {inner()}
        </div>
      </section>

      <HP2Footer />
    </main>
  );
}
