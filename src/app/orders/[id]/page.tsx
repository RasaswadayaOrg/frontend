"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Package, MapPin, Calendar, Check, Clock, Truck, XCircle,
  CreditCard, ShieldCheck, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DesignStyles } from "@/components/hp2/design";
import { HP2Nav, DEFAULT_NAV_LINKS } from "@/components/hp2/Nav";
import { HP2Footer } from "@/components/hp2/Footer";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; imageUrl: string | null; store?: { id: string; name: string } | null };
}

interface Order {
  id: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  currency?: string;
  shippingAddress: string | null;
  paymentMethod?: string | null;
  paidAt?: string | null;
  createdAt: string;
  items: OrderItem[];
}

interface Payment {
  status: string;
  statusMessage?: string | null;
  method?: string | null;
  amount?: number;
  currency?: string;
  payherePaymentId?: string | null;
}

const TIMELINE: Array<{ key: Order["status"]; label: string; desc: string; icon: typeof Clock }> = [
  { key: "PENDING",   label: "Order placed",       desc: "We received your order",          icon: Clock },
  { key: "PAID",      label: "Payment confirmed",   desc: "Payment has been verified",        icon: CreditCard },
  { key: "SHIPPED",   label: "Shipped",             desc: "Your items are on the way",        icon: Truck },
  { key: "DELIVERED", label: "Delivered",           desc: "Order has been delivered",          icon: CheckCircle2 },
];

const STATUS_TONES: Record<string, { fg: string; bg: string; border: string; glow: string }> = {
  PENDING:   { fg: "#FBBF24", bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.25)",   glow: "rgba(251,191,36,0.15)" },
  PAID:      { fg: "#60A5FA", bg: "rgba(96,165,250,0.10)",  border: "rgba(96,165,250,0.25)",   glow: "rgba(96,165,250,0.15)" },
  SHIPPED:   { fg: "#A78BFA", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.25)",  glow: "rgba(167,139,250,0.15)" },
  DELIVERED: { fg: "#34D399", bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.25)",   glow: "rgba(52,211,153,0.15)" },
  CANCELLED: { fg: "#F472B6", bg: "rgba(244,114,182,0.10)", border: "rgba(244,114,182,0.25)",  glow: "rgba(244,114,182,0.15)" },
};

function Row({ label, value, tone }: { label: string; value: string; tone?: "green" | "red" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
      <span style={{ color: "#9B95B5" }}>{label}</span>
      <span style={{ color: tone === "green" ? "#34d399" : tone === "red" ? "#f87171" : "#F5F3FA", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { if (!user && !loading) router.push("/"); }, [user, loading, router]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const [orderRes, payRes] = await Promise.all([
        apiFetch<any>(`/orders/${id}`),
        apiFetch<any>(`/payments/order/${id}`),
      ]);
      if (!alive) return;
      if (!orderRes.ok) { setError(orderRes.error || "Order not found"); setLoading(false); return; }
      setOrder(orderRes.data?.data ?? orderRes.data);
      if (payRes.ok) setPayment(payRes.data?.payment ?? payRes.data?.data?.payment ?? null);
      setLoading(false);
    };
    load();

    const interval = setInterval(async () => {
      const r = await apiFetch<any>(`/orders/${id}`);
      if (!alive) return;
      const fresh = r.data?.data ?? r.data;
      if (fresh) setOrder(fresh);
      const pr = await apiFetch<any>(`/payments/order/${id}`);
      if (!alive) return;
      if (pr.ok) setPayment(pr.data?.payment ?? pr.data?.data?.payment ?? null);
    }, 5000);
    return () => { alive = false; clearInterval(interval); };
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Cancel this order? Stock will be restored.")) return;
    setCancelling(true);
    const res = await apiFetch(`/orders/${id}/cancel`, { method: "PUT" });
    if (res.ok) {
      const r = await apiFetch<any>(`/orders/${id}`);
      setOrder(r.data?.data ?? r.data);
    } else {
      alert(res.error || "Failed to cancel order");
    }
    setCancelling(false);
  };

  const handleRetryPayment = async () => {
    const r = await apiFetch<any>(`/payments/payhere/initiate/${id}`, { method: "POST" });
    if (!r.ok || !r.data?.checkoutUrl) {
      alert((!r.ok && r.error) || "Could not start PayHere checkout.");
      return;
    }
    const form = document.createElement("form");
    form.method = "POST"; form.action = r.data.checkoutUrl;
    Object.entries(r.data.fields as Record<string, string>).forEach(([k, v]) => {
      const i = document.createElement("input"); i.type = "hidden"; i.name = k; i.value = v ?? ""; form.appendChild(i);
    });
    document.body.appendChild(form); form.submit();
  };

  const tone = order ? STATUS_TONES[order.status] : STATUS_TONES.PENDING;
  const reachedIdx = order ? TIMELINE.findIndex(t => t.key === order.status) : -1;
  const isCancelled = order?.status === "CANCELLED";
  const shortId = order?.id.slice(-8).toUpperCase() ?? "";

  return (
    <main className="hp2">
      <DesignStyles />
      <HP2Nav links={DEFAULT_NAV_LINKS} activePath="/orders" />

      <section style={{ padding: "100px 0 80px" }}>
        <div className="hp2-container" style={{ maxWidth: 1080 }}>

          {/* Back link */}
          <Link href="/orders" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#C4B5FD", textDecoration: "none", marginBottom: 24, padding: "6px 12px", borderRadius: 999, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.16)", transition: "background 0.2s" }}>
            <ArrowLeft size={12} /> All orders
          </Link>

          {loading ? (
            <div className="hp2-loading"><div className="hp2-spinner hp2-spinner--lg" /></div>
          ) : error || !order ? (
            <div className="hp2-empty">
              <div style={{ marginBottom: 16, color: "#9B95B5" }}><Package size={40} /></div>
              <p className="hp2-empty__title">Order not found</p>
              <p className="hp2-empty__lede">{error || "This order does not exist or you don't have access."}</p>
              <div style={{ marginTop: 24 }}><Link href="/orders" className="hp2-btn hp2-btn--ghost">Back to orders</Link></div>
            </div>
          ) : (
            <>
              {/* ── Page title ── */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 6 }}>
                  <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 600, letterSpacing: "-0.03em", color: "#F5F3FA", margin: 0 }}>
                    Order <span style={{ color: "#C4B5FD" }}>#{shortId}</span>
                  </h1>
                  <span style={{ display: "inline-flex", alignItems: "center", height: 28, padding: "0 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: tone.bg, color: tone.fg, border: `1px solid ${tone.border}`, boxShadow: `0 0 12px ${tone.glow}` }}>
                    {order.status}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#9B95B5", display: "flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={12} /> Placed {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} at {new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }} className="hp2-order-grid">

                {/* ── Main column ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Tracking timeline */}
                  <div style={{ background: "#15121D", border: "1px solid rgba(196,181,253,0.10)", borderRadius: 20, overflow: "hidden" }}>
                    <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(196,181,253,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
                      <Truck size={14} color="#A78BFA" />
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "#F5F3FA" }}>Order tracking</span>
                    </div>
                    <div style={{ padding: "24px" }}>
                      {isCancelled ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderRadius: 14, background: "rgba(244,114,182,0.06)", border: "1px solid rgba(244,114,182,0.18)" }}>
                          <XCircle size={16} color="#F472B6" />
                          <span style={{ fontSize: 14, color: "#F472B6", fontWeight: 500 }}>This order was cancelled.</span>
                        </div>
                      ) : (
                        <ol style={{ display: "flex", flexDirection: "column", gap: 0, listStyle: "none", padding: 0, margin: 0 }}>
                          {TIMELINE.map((step, i) => {
                            const reached = i <= reachedIdx;
                            const active = i === reachedIdx;
                            const isLast = i === TIMELINE.length - 1;
                            return (
                              <li key={step.key} style={{ display: "flex", gap: 16, position: "relative" }}>
                                {/* Connector line */}
                                {!isLast && (
                                  <div style={{ position: "absolute", left: 13, top: 28, width: 2, height: "calc(100% - 4px)", background: reached ? "rgba(167,139,250,0.35)" : "rgba(196,181,253,0.10)", borderRadius: 2, zIndex: 0 }} />
                                )}
                                {/* Circle */}
                                <div style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
                                  <div style={{
                                    width: 28, height: 28, borderRadius: "50%",
                                    background: active ? tone.bg : reached ? "rgba(167,139,250,0.12)" : "rgba(155,149,181,0.07)",
                                    border: active ? `2px solid ${tone.fg}` : reached ? "1.5px solid rgba(167,139,250,0.40)" : "1px solid rgba(196,181,253,0.14)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: active ? `0 0 14px ${tone.glow}` : "none",
                                    transition: "all 0.3s ease",
                                  }}>
                                    {reached
                                      ? <Check size={12} color={active ? tone.fg : "#C4B5FD"} />
                                      : <step.icon size={11} color="#5B5470" />
                                    }
                                  </div>
                                </div>
                                {/* Content */}
                                <div style={{ paddingBottom: isLast ? 0 : 24, paddingTop: 4 }}>
                                  <p style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: reached ? "#F5F3FA" : "#5B5470", marginBottom: 2 }}>{step.label}</p>
                                  <p style={{ fontSize: 12, color: reached ? "#9B95B5" : "#3D3858" }}>{step.desc}</p>
                                  {step.key === "PAID" && order.paidAt && (
                                    <p style={{ fontSize: 11, color: "#60A5FA", marginTop: 4 }}>{new Date(order.paidAt).toLocaleString()}</p>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ol>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ background: "#15121D", border: "1px solid rgba(196,181,253,0.10)", borderRadius: 20, overflow: "hidden" }}>
                    <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(196,181,253,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
                      <Package size={14} color="#A78BFA" />
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "#F5F3FA" }}>Items ({order.items.reduce((a, i) => a + i.quantity, 0)})</span>
                    </div>
                    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                      {order.items.map((it, idx) => (
                        <div key={it.id}>
                          {idx > 0 && <div style={{ height: 1, background: "rgba(196,181,253,0.07)", marginBottom: 16 }} />}
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ width: 64, height: 64, borderRadius: 14, overflow: "hidden", position: "relative", background: "#1E1A2B", flexShrink: 0, border: "1px solid rgba(196,181,253,0.10)" }}>
                              <ImageWithFallback src={it.product.imageUrl || ""} alt={it.product.name} fill style={{ objectFit: "cover" }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 14, fontWeight: 600, color: "#F5F3FA", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>{it.product.name}</p>
                              {it.product.store?.name && <p style={{ fontSize: 12, color: "#9B95B5", marginBottom: 2 }}>by {it.product.store.name}</p>}
                              <p style={{ fontSize: 12, color: "#9B95B5" }}>Qty {it.quantity} × Rs.&nbsp;{Number(it.price).toLocaleString()}</p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F3FA", fontFamily: "var(--font-outfit)" }}>Rs.&nbsp;{(Number(it.price) * it.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping address */}
                  {order.shippingAddress && (
                    <div style={{ background: "#15121D", border: "1px solid rgba(196,181,253,0.10)", borderRadius: 20, overflow: "hidden" }}>
                      <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(196,181,253,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
                        <MapPin size={14} color="#A78BFA" />
                        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "#F5F3FA" }}>Delivery address</span>
                      </div>
                      <div style={{ padding: "20px 24px" }}>
                        <p style={{ fontSize: 14, color: "#C4B5FD", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{order.shippingAddress}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Aside ── */}
                <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Order summary */}
                  <div style={{ background: "#15121D", border: "1px solid rgba(196,181,253,0.10)", borderRadius: 20, overflow: "hidden" }}>
                    <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(196,181,253,0.08)" }}>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "#F5F3FA" }}>Order summary</span>
                    </div>
                    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                      {order.items.map(it => (
                        <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#9B95B5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{it.product.name} ×{it.quantity}</span>
                          <span style={{ color: "#F5F3FA", fontWeight: 500, flexShrink: 0 }}>Rs.&nbsp;{(it.price * it.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div style={{ height: 1, background: "rgba(196,181,253,0.08)", margin: "4px 0" }} />
                      <Row label="Subtotal" value={`Rs. ${Number(order.totalAmount).toLocaleString()}`} />
                      <Row label="Shipping" value="Free" tone="green" />
                      <div style={{ height: 1, background: "rgba(196,181,253,0.10)", margin: "4px 0" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#F5F3FA" }}>Total</span>
                        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 22, fontWeight: 700, color: "#A78BFA" }}>Rs.&nbsp;{Number(order.totalAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment info */}
                  <div style={{ background: "#15121D", border: "1px solid rgba(196,181,253,0.10)", borderRadius: 20, overflow: "hidden" }}>
                    <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(196,181,253,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
                      <CreditCard size={14} color="#A78BFA" />
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "#F5F3FA" }}>Payment</span>
                    </div>
                    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <Row label="Method" value={order.paymentMethod === "payhere" ? "PayHere" : "Cash on Delivery"} />
                      {payment?.method && <Row label="Card / Bank" value={payment.method} />}
                      <Row
                        label="Status"
                        value={payment?.status || (order.status === "PAID" ? "SUCCESS" : order.status)}
                        tone={order.status === "PAID" || payment?.status === "SUCCESS" ? "green" : undefined}
                      />
                      {payment?.payherePaymentId && <Row label="Transaction ID" value={payment.payherePaymentId} />}
                      {payment?.statusMessage && (
                        <div style={{ marginTop: 6, display: "flex", alignItems: "flex-start", gap: 6, padding: "10px 12px", borderRadius: 10, background: "rgba(244,114,182,0.06)", border: "1px solid rgba(244,114,182,0.15)" }}>
                          <AlertTriangle size={12} color="#F472B6" style={{ flexShrink: 0, marginTop: 1 }} />
                          <p style={{ fontSize: 12, color: "#F472B6" }}>{payment.statusMessage}</p>
                        </div>
                      )}
                      <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        <ShieldCheck size={12} color="#34d399" />
                        <p style={{ fontSize: 11, color: "#9B95B5" }}>Secured by PayHere sandbox</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {order.status === "PENDING" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {order.paymentMethod === "payhere" && (
                        <button onClick={handleRetryPayment} className="hp2-btn hp2-btn--accent" style={{ width: "100%", height: 46 }}>
                          Retry payment
                        </button>
                      )}
                      <button onClick={handleCancel} disabled={cancelling} className="hp2-btn hp2-btn--ghost" style={{ width: "100%", height: 46, opacity: cancelling ? 0.6 : 1 }}>
                        {cancelling ? "Cancelling…" : "Cancel order"}
                      </button>
                    </div>
                  )}
                </aside>
              </div>
            </>
          )}
        </div>
      </section>

      <HP2Footer />
      <style>{`
        @media (max-width: 860px) {
          .hp2-order-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
