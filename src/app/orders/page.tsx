"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Package, MapPin, Calendar, ChevronDown, ChevronUp,
  ShoppingBag, Clock, CheckCircle2, XCircle, Truck, CreditCard,
} from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { DesignStyles } from "@/components/hp2/design";
import { HP2Nav, DEFAULT_NAV_LINKS } from "@/components/hp2/Nav";
import { HP2Footer } from "@/components/hp2/Footer";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; imageUrl: string; store: { name: string } };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentMethod: string | null;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

// ── Status helpers ─────────────────────────────────────────────────────────────
const STATUS_META: Record<string, { badge: string; label: string; icon: typeof Clock; color: string }> = {
  PENDING:   { badge: "hp2-badge--pending",    label: "Pending",    icon: Clock,         color: "#fbbf24" },
  PAID:      { badge: "hp2-badge--processing", label: "Paid",       icon: CreditCard,    color: "#A78BFA" },
  SHIPPED:   { badge: "hp2-badge--processing", label: "Shipped",    icon: Truck,         color: "#60a5fa" },
  DELIVERED: { badge: "hp2-badge--delivered",  label: "Delivered",  icon: CheckCircle2,  color: "#34d399" },
  CANCELLED: { badge: "hp2-badge--cancelled",  label: "Cancelled",  icon: XCircle,       color: "#f87171" },
};

const ORDER_STEPS = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

function getStepIndex(status: string) {
  return ORDER_STEPS.indexOf(status);
}

function StatusStepper({ status }: { status: string }) {
  const current = getStepIndex(status);
  const isCancelled = status === "CANCELLED";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%", marginTop: 4 }}>
      {ORDER_STEPS.map((step, i) => {
        const meta = STATUS_META[step];
        const done = !isCancelled && i <= current;
        const active = !isCancelled && i === current;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: "none" }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? (active ? meta.color : "rgba(52,211,153,0.15)") : "rgba(155,149,181,0.10)",
                border: `2px solid ${done ? (active ? meta.color : "#34d399") : "rgba(155,149,181,0.20)"}`,
                transition: "all 0.3s ease",
                boxShadow: active ? `0 0 12px ${meta.color}55` : "none",
              }}>
                <meta.icon size={13} color={done ? (active ? "#0a0a0b" : "#34d399") : "#9B95B5"} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: done ? (active ? meta.color : "#34d399") : "#9B95B5", whiteSpace: "nowrap" }}>
                {meta.label}
              </span>
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: "0 4px", marginBottom: 22, background: !isCancelled && i < current ? "#34d399" : "rgba(155,149,181,0.15)", borderRadius: 2, transition: "background 0.3s ease" }} />
            )}
          </div>
        );
      })}
      {isCancelled && (
        <div style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <XCircle size={14} color="#f87171" />
          <span style={{ fontSize: 10, fontWeight: 700, color: "#f87171", letterSpacing: "0.1em", textTransform: "uppercase" }}>Cancelled</span>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[order.status] || STATUS_META.PENDING;
  const totalQty = order.items.reduce((a, i) => a + i.quantity, 0);
  const shortId = order.id.slice(-8).toUpperCase();

  return (
    <div style={{
      background: "#15121D",
      border: "1px solid rgba(196,181,253,0.10)",
      borderRadius: 20,
      overflow: "hidden",
      transition: "border-color 0.25s ease, box-shadow 0.25s ease",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(167,139,250,0.22)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px -8px rgba(167,139,250,0.12)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,181,253,0.10)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      {/* ── Top bar: accent stripe by status ── */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${meta.color}88 0%, ${meta.color}22 100%)` }} />

      {/* ── Header ── */}
      <div style={{ padding: "20px 24px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        {/* Left: ID + date + method */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 10, color: "#9B95B5", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>Order</p>
            <p style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#C4B5FD", letterSpacing: "0.08em" }}>#{shortId}</p>
          </div>
          <div style={{ width: 1, height: 32, background: "rgba(196,181,253,0.12)" }} />
          <div>
            <p style={{ fontSize: 10, color: "#9B95B5", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>Placed</p>
            <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 500, color: "#F5F3FA" }}>
              <Calendar size={11} style={{ color: "#A78BFA" }} />
              {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <div style={{ width: 1, height: 32, background: "rgba(196,181,253,0.12)" }} />
          <div>
            <p style={{ fontSize: 10, color: "#9B95B5", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>Total</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F3FA", fontFamily: "var(--font-outfit)" }}>Rs.&nbsp;{order.totalAmount.toLocaleString()}</p>
          </div>
          <div style={{ width: 1, height: 32, background: "rgba(196,181,253,0.12)" }} />
          <div>
            <p style={{ fontSize: 10, color: "#9B95B5", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>Items</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#F5F3FA" }}>{totalQty} item{totalQty !== 1 ? "s" : ""}</p>
          </div>
          {order.paymentMethod && (
            <>
              <div style={{ width: 1, height: 32, background: "rgba(196,181,253,0.12)" }} />
              <div>
                <p style={{ fontSize: 10, color: "#9B95B5", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>Payment</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: order.paymentMethod === "payhere" ? "#A78BFA" : "#9B95B5", textTransform: "capitalize" }}>
                  {order.paymentMethod === "payhere" ? "PayHere" : "Cash on Delivery"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right: status badge + expand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={"hp2-badge " + meta.badge}>{meta.label}</span>
          <button
            onClick={() => setExpanded(v => !v)}
            aria-label={expanded ? "Collapse order" : "Expand order"}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 10, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.16)", color: "#9B95B5", cursor: "pointer", transition: "background 0.2s ease, color 0.2s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(167,139,250,0.16)"; (e.currentTarget as HTMLElement).style.color = "#F5F3FA"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(167,139,250,0.08)"; (e.currentTarget as HTMLElement).style.color = "#9B95B5"; }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* ── Status stepper ── */}
      <div style={{ padding: "0 24px 20px" }}>
        <StatusStepper status={order.status} />
      </div>

      {/* ── Expandable body ── */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(196,181,253,0.08)" }}>
          {/* Delivery address */}
          <div style={{ padding: "20px 24px 0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px", borderRadius: 14, background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.10)" }}>
              <MapPin size={14} style={{ color: "#A78BFA", flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#C4B5FD", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Delivery Address</p>
                <p style={{ fontSize: 13, color: "#9B95B5", lineHeight: 1.55 }}>{order.shippingAddress || "—"}</p>
              </div>
            </div>
          </div>

          {/* Item list */}
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {order.items.map((item, idx) => (
              <div key={item.id}>
                {idx > 0 && <div style={{ height: 1, background: "rgba(196,181,253,0.07)", marginBottom: 14 }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden", position: "relative", background: "#1E1A2B", flexShrink: 0, border: "1px solid rgba(196,181,253,0.10)" }}>
                    <ImageWithFallback src={item.product?.imageUrl || ""} alt={item.product?.name || ""} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#F5F3FA", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product?.name}</p>
                    <p style={{ fontSize: 12, color: "#9B95B5" }}>{item.product?.store?.name}</p>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#F5F3FA", fontFamily: "var(--font-outfit)" }}>Rs.&nbsp;{(item.price * item.quantity).toLocaleString()}</p>
                    <p style={{ fontSize: 11, color: "#9B95B5", marginTop: 2 }}>Rs.&nbsp;{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer: total + link */}
          <div style={{ padding: "14px 24px 20px", borderTop: "1px solid rgba(196,181,253,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#9B95B5" }}>Order total</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#F5F3FA", fontFamily: "var(--font-outfit)" }}>Rs.&nbsp;{order.totalAmount.toLocaleString()}</span>
            </div>
            <Link href={`/orders/${order.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 16px", borderRadius: 999, background: "rgba(167,139,250,0.10)", border: "1px solid rgba(167,139,250,0.22)", color: "#C4B5FD", fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "background 0.2s ease" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(167,139,250,0.18)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(167,139,250,0.10)"}
            >
              View full details →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push("/"); return; }
    const load = async () => {
      setIsLoading(true);
      const res = await apiFetch<any>("/orders");
      if (!res.ok) { setError(res.error || "Failed to load orders"); setIsLoading(false); return; }
      const raw = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      const mapped = raw.map((o: any) => ({
        ...o,
        totalAmount: Number(o.totalAmount ?? (o.items || []).reduce((s: number, it: any) => s + Number(it.price || 0) * Number(it.quantity || 0), 0)),
        items: (o.items || []).map((it: any) => ({
          ...it,
          price: Number(it.price ?? 0),
          product: { ...it.product, store: it.product?.store || { name: "Unknown Store" } },
        })),
      }));
      setOrders(mapped);
      setIsLoading(false);
    };
    load();
  }, [user, router]);

  const FILTER_OPTS = ["ALL", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
  const filtered = filter === "ALL" ? orders : orders.filter(o => o.status === filter);

  // Summary stats
  const totalSpent = orders.reduce((s, o) => s + o.totalAmount, 0);
  const activeOrders = orders.filter(o => !["DELIVERED", "CANCELLED"].includes(o.status)).length;

  return (
    <main className="hp2">
      <DesignStyles />
      <HP2Nav links={DEFAULT_NAV_LINKS} activePath="/orders" />

      {/* ── Cover ── */}
      <header className="hp2-cover" style={{ minHeight: 260, padding: "100px 0 36px" }}>
        <div className="hp2-cover__media hp2-cover__media--green" aria-hidden />
        <div className="hp2-container">
          <div className="hp2-cover__inner">
            <p className="hp2-cover__kicker">
              <ShoppingBag size={12} style={{ display: "inline", marginRight: 6 }} />
              Purchase history
            </p>
            <h1 className="hp2-cover__title" style={{ fontFamily: "var(--font-outfit)" }}>
              My <em>orders.</em>
            </h1>
            <p className="hp2-cover__lede">Track every purchase, follow your deliveries.</p>
          </div>
        </div>
      </header>

      <div className="hp2-container" style={{ paddingTop: 0, paddingBottom: 80 }}>

        {/* ── Stats row ── */}
        {!isLoading && orders.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32, marginTop: -10 }}>
            {[
              { label: "Total orders",    value: orders.length,          icon: Package,   color: "#A78BFA" },
              { label: "Active orders",   value: activeOrders,           icon: Truck,     color: "#60a5fa" },
              { label: "Total spent",     value: `Rs. ${totalSpent.toLocaleString()}`, icon: CreditCard, color: "#34d399" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "#15121D", border: "1px solid rgba(196,181,253,0.10)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${stat.color}15`, border: `1px solid ${stat.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <stat.icon size={16} color={stat.color} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#9B95B5", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>{stat.label}</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#F5F3FA", fontFamily: "var(--font-outfit)" }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter chips ── */}
        {!isLoading && orders.length > 0 && (
          <div className="hp2-chips" style={{ marginBottom: 24 }}>
            {FILTER_OPTS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={"hp2-chip" + (filter === f ? " is-active" : "")}
                style={{ cursor: "pointer", border: "none" }}
              >
                {f === "ALL" ? "All orders" : f.charAt(0) + f.slice(1).toLowerCase()}
                {f !== "ALL" && <span style={{ marginLeft: 6, opacity: 0.7 }}>({orders.filter(o => o.status === f).length})</span>}
              </button>
            ))}
          </div>
        )}

        {/* ── States ── */}
        {isLoading && <div className="hp2-loading"><div className="hp2-spinner hp2-spinner--lg" /></div>}
        {error && <div className="hp2-alert hp2-alert--error" style={{ marginBottom: 24 }}>{error}</div>}

        {!isLoading && orders.length === 0 && !error && (
          <div className="hp2-empty" style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 16, color: "#9B95B5" }}><Package size={40} /></div>
            <p className="hp2-empty__title">No orders yet</p>
            <p className="hp2-empty__lede">Your completed purchases will appear here.</p>
            <div style={{ marginTop: 24 }}>
              <Link href="/marketplace" className="hp2-btn hp2-btn--accent">Browse Marketplace</Link>
            </div>
          </div>
        )}

        {!isLoading && filtered.length === 0 && orders.length > 0 && (
          <div className="hp2-empty" style={{ marginTop: 8 }}>
            <p className="hp2-empty__title">No {filter.toLowerCase()} orders</p>
            <p className="hp2-empty__lede">Try a different filter.</p>
          </div>
        )}

        {/* ── Order list ── */}
        {!isLoading && filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>

      <HP2Footer />
    </main>
  );
}
