"use client";

import { useCart } from "@/context/CartContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ArrowLeft, ArrowRight, CreditCard, Truck, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { DesignStyles } from "@/components/hp2/design";
import { HP2Nav, DEFAULT_NAV_LINKS } from "@/components/hp2/Nav";
import { HP2Footer } from "@/components/hp2/Footer";

type PayMethod = "cod" | "payhere";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, itemCount, totalPrice, clearCart, isLoading } = useCart();
  const router = useRouter();

  const VAT_RATE = 0.18;
  const DELIVERY_FEE = totalPrice >= 10000 ? 0 : 350;
  const vatAmount = Math.round(totalPrice * VAT_RATE);
  const grandTotal = totalPrice + vatAmount + DELIVERY_FEE;

  const [addr, setAddr] = useState({ fullName: "", line1: "", line2: "", city: "", province: "", postalCode: "", contactPhone: "" });
  const [method, setMethod] = useState<PayMethod>("payhere");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (!user) router.push("/cart"); }, [user, router]);
  useEffect(() => {
    if (user?.name) setAddr((p) => ({ ...p, fullName: p.fullName || user.name }));
  }, [user?.name]);
  useEffect(() => { if (!isLoading && itemCount === 0 && !success) router.push("/cart"); }, [isLoading, itemCount, success, router]);

  /** Construct + auto-submit a hidden form to PayHere with the signed fields. */
  function submitToPayHere(checkoutUrl: string, fields: Record<string, string>) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = checkoutUrl;
    form.style.display = "none";
    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = v ?? "";
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addr.fullName.trim() || !addr.line1.trim() || !addr.city.trim() || !addr.contactPhone.trim()) {
      setError("Please fill in your full name, address line 1, city and contact number.");
      return;
    }
    const address = [
      addr.fullName,
      addr.line1,
      addr.line2,
      addr.city,
      addr.province,
      addr.postalCode,
    ].filter(Boolean).join(", ") + ` | ${addr.contactPhone}`;
    setSubmitting(true);
    setError(null);

    // 1) Create the Order (PENDING)
    const createRes = await apiFetch<any>("/orders", {
      method: "POST",
      json: { shippingAddress: address, paymentMethod: method, totalAmount: grandTotal },
    });
    if (!createRes.ok) {
      setError(createRes.error || "Could not create order.");
      setSubmitting(false);
      return;
    }
    const orderId = createRes.data?.id || createRes.data?.data?.id;

    if (method === "cod") {
      setSuccess(true);
      await clearCart();
      setTimeout(() => router.push(orderId ? `/orders/${orderId}` : "/orders"), 2000);
      setSubmitting(false);
      return;
    }

    // 2) PayHere — fetch signed checkout fields and redirect to gateway
    const initRes = await apiFetch<any>(`/payments/payhere/initiate/${orderId}`, {
      method: "POST",
    });
    if (!initRes.ok || !initRes.data?.checkoutUrl) {
      setError((!initRes.ok && initRes.error) || "Could not start PayHere checkout.");
      setSubmitting(false);
      return;
    }

    submitToPayHere(initRes.data.checkoutUrl, initRes.data.fields);
  };

  const body = () => {
    if (!user || isLoading) return <div className="hp2-loading"><div className="hp2-spinner hp2-spinner--lg" /></div>;
    if (itemCount === 0 && !success) return null;

    if (success) return (
      <div className="hp2-empty" style={{ borderColor: "rgba(52,211,153,0.3)", marginTop: 40 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(52,211,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Truck size={28} style={{ color: "#34d399" }} />
        </div>
        <p className="hp2-empty__title" style={{ color: "#34d399" }}>Order placed successfully!</p>
        <p className="hp2-empty__lede">Thank you for your purchase. Redirecting to your order…</p>
      </div>
    );

    return (
      <div className="hp2-two-col">
        <form onSubmit={handlePlaceOrder}>
          <div className="hp2-steps" style={{ marginBottom: 32 }}>
            <div className="hp2-step hp2-step--done">
              <span className="hp2-step__num"><Check size={12} /></span>
              <span className="hp2-step__label">Cart</span>
              <span className="hp2-step__line" />
            </div>
            <div className="hp2-step hp2-step--active">
              <span className="hp2-step__num">2</span>
              <span className="hp2-step__label">Checkout</span>
              <span className="hp2-step__line" />
            </div>
            <div className="hp2-step hp2-step--idle">
              <span className="hp2-step__num">3</span>
              <span className="hp2-step__label">Confirmation</span>
            </div>
          </div>

          <div className="hp2-surf" style={{ marginBottom: 20 }}>
            <div className="hp2-surf__head">
              <p style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 500, color: "#F5F3FA" }}>
                <Truck size={16} style={{ color: "#A78BFA" }} /> Delivery Details
              </p>
            </div>
            <div className="hp2-surf__body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && <div className="hp2-alert hp2-alert--error">{error}</div>}
              <div className="hp2-field">
                <label className="hp2-label" htmlFor="deliveryName">Full Name *</label>
                <input
                  id="deliveryName"
                  type="text"
                  required
                  value={addr.fullName ?? (user?.name || "")}
                  onChange={(e) => setAddr((p) => ({ ...p, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                  className="hp2-input"
                />
              </div>
              <div className="hp2-field">
                <label className="hp2-label" htmlFor="contactPhone">Contact Number *</label>
                <input
                  id="contactPhone"
                  type="tel"
                  required
                  value={addr.contactPhone}
                  onChange={(e) => setAddr((p) => ({ ...p, contactPhone: e.target.value }))}
                  placeholder="+94 77 123 4567"
                  className="hp2-input"
                />
              </div>
              <div className="hp2-field">
                <label className="hp2-label" htmlFor="line1">Address Line 1 *</label>
                <input
                  id="line1"
                  type="text"
                  required
                  value={addr.line1}
                  onChange={(e) => setAddr((p) => ({ ...p, line1: e.target.value }))}
                  placeholder="House No. / Flat, Street name"
                  className="hp2-input"
                />
              </div>
              <div className="hp2-field">
                <label className="hp2-label" htmlFor="line2">Address Line 2</label>
                <input
                  id="line2"
                  type="text"
                  value={addr.line2}
                  onChange={(e) => setAddr((p) => ({ ...p, line2: e.target.value }))}
                  placeholder="Apartment, ward, landmark (optional)"
                  className="hp2-input"
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="hp2-field">
                  <label className="hp2-label" htmlFor="city">City *</label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={addr.city}
                    onChange={(e) => setAddr((p) => ({ ...p, city: e.target.value }))}
                    placeholder="e.g. Colombo"
                    className="hp2-input"
                  />
                </div>
                <div className="hp2-field">
                  <label className="hp2-label" htmlFor="province">Province</label>
                  <input
                    id="province"
                    type="text"
                    value={addr.province}
                    onChange={(e) => setAddr((p) => ({ ...p, province: e.target.value }))}
                    placeholder="e.g. Western"
                    className="hp2-input"
                  />
                </div>
              </div>
              <div className="hp2-field">
                <label className="hp2-label" htmlFor="postalCode">Postal Code</label>
                <input
                  id="postalCode"
                  type="text"
                  value={addr.postalCode}
                  onChange={(e) => setAddr((p) => ({ ...p, postalCode: e.target.value }))}
                  placeholder="e.g. 10100"
                  className="hp2-input"
                  style={{ maxWidth: 160 }}
                />
              </div>
            </div>
          </div>

          <div className="hp2-surf" style={{ marginBottom: 24 }}>
            <div className="hp2-surf__head">
              <p style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 500, color: "#F5F3FA" }}>
                <CreditCard size={16} style={{ color: "#A78BFA" }} /> Payment Method
              </p>
            </div>
            <div className="hp2-surf__body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <PayOption
                value="payhere"
                active={method === "payhere"}
                onSelect={setMethod}
                title="Card / Bank / eZ Cash via PayHere"
                desc="Secure online payment. Visa, Mastercard, Amex and local methods."
                badge={<span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#34d399" }}><ShieldCheck size={12} /> Secured</span>}
              />
              <PayOption
                value="cod"
                active={method === "cod"}
                onSelect={setMethod}
                title="Cash on Delivery"
                desc="Pay with cash when your order arrives at your doorstep."
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="hp2-btn hp2-btn--primary" style={{ width: "100%", height: 52, fontSize: 15 }}>
            {submitting ? (
              <><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(10,10,11,0.3)", borderTopColor: "#0a0a0b", animation: "hp2-spin .8s linear infinite", display: "inline-block", marginRight: 8 }} />Processing…</>
            ) : method === "payhere" ? (
              <>Pay with PayHere — Rs.&nbsp;{grandTotal.toLocaleString()} <ArrowRight size={16} style={{ marginLeft: 8 }} /></>
            ) : (
              <>Place Order — Rs.&nbsp;{grandTotal.toLocaleString()} <ArrowRight size={16} style={{ marginLeft: 8 }} /></>
            )}
          </button>
        </form>

        <aside className="hp2-summary">
          <div className="hp2-surf">
            <div className="hp2-surf__head">
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 500, color: "#F5F3FA" }}>Order Review</p>
            </div>
            <div className="hp2-surf__body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", position: "relative", background: "#1E1A2B", flexShrink: 0 }}>
                      <ImageWithFallback src={item.product?.imageUrl || ""} alt={item.product?.name || ""} fill className="object-cover" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#F5F3FA", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{item.product?.name}</p>
                      <p style={{ fontSize: 11, color: "#9B95B5" }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#F5F3FA", flexShrink: 0 }}>Rs.&nbsp;{(item.product?.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(196,181,253,0.10)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9B95B5" }}>
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                  <span style={{ color: "#F5F3FA" }}>Rs.&nbsp;{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9B95B5" }}>
                  <span>VAT (18%)</span>
                  <span style={{ color: "#F5F3FA" }}>Rs.&nbsp;{vatAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9B95B5" }}>
                  <span>Delivery</span>
                  {DELIVERY_FEE === 0
                    ? <span style={{ color: "#34d399" }}>Free</span>
                    : <span style={{ color: "#F5F3FA" }}>Rs.&nbsp;{DELIVERY_FEE.toLocaleString()}</span>
                  }
                </div>
                {DELIVERY_FEE > 0 && (
                  <p style={{ fontSize: 11, color: "#6B6680", margin: "-4px 0 0" }}>Free delivery on orders over Rs.&nbsp;10,000</p>
                )}
                <div style={{ borderTop: "1px solid rgba(196,181,253,0.10)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: "#F5F3FA" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 22, fontWeight: 600, color: "#A78BFA" }}>Rs.&nbsp;{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    );
  };

  return (
    <main className="hp2">
      <DesignStyles />
      <HP2Nav links={DEFAULT_NAV_LINKS} activePath="/checkout" />
      <section style={{ paddingBottom: 80 }}>
        <header className="hp2-cover" style={{ minHeight: 220, padding: "88px 0 28px" }}>
          <div className="hp2-cover__media hp2-cover__media--blue" aria-hidden />
          <div className="hp2-container">
            <div className="hp2-cover__inner">
              <Link href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#C4B5FD", textDecoration: "none", marginBottom: 12 }}>
                <ArrowLeft size={12} /> Back to cart
              </Link>
              <p className="hp2-cover__kicker">Final step</p>
              <h1 className="hp2-cover__title"><em>Checkout.</em></h1>
            </div>
          </div>
        </header>

        <div className="hp2-container" style={{ paddingTop: 32 }}>
          {body()}
        </div>
      </section>
      <HP2Footer />
    </main>
  );
}

function PayOption({
  value, active, onSelect, title, desc, badge,
}: {
  value: PayMethod;
  active: boolean;
  onSelect: (v: PayMethod) => void;
  title: string;
  desc: string;
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      style={{
        textAlign: "left",
        padding: "14px 18px",
        borderRadius: 14,
        background: active ? "rgba(167,139,250,0.10)" : "rgba(255,255,255,0.02)",
        border: active ? "1px solid rgba(167,139,250,0.45)" : "1px solid rgba(196,181,253,0.10)",
        cursor: "pointer",
        display: "flex",
        gap: 14,
        alignItems: "center",
        transition: "background .2s, border-color .2s",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
          border: active ? "5px solid #A78BFA" : "1.5px solid #4A4459",
        }}
      />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: active ? "#C4B5FD" : "#F5F3FA" }}>
          {title}
          {badge}
        </span>
        <span style={{ display: "block", fontSize: 12, color: "#9B95B5", marginTop: 4 }}>{desc}</span>
      </span>
    </button>
  );
}
