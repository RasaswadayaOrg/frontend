"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Loader2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { DesignStyles } from "@/components/hp2/design";
import { HP2Nav, DEFAULT_NAV_LINKS } from "@/components/hp2/Nav";
import { HP2Footer } from "@/components/hp2/Footer";

type PollState = "checking" | "paid" | "pending" | "failed" | "missing";

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderId = params.get("order");

  const [state, setState] = useState<PollState>("checking");
  const [order, setOrder] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [polls, setPolls] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const cleared = useRef(false);
  const fallbackTriggered = useRef(false);

  // Apply a response payload (from poll or verify) and return whether the
  // flow is now in a terminal state (paid / failed) so callers can stop.
  const applyResult = (payload: any): boolean => {
    const o = payload?.order ?? payload?.data?.order;
    const p = payload?.payment ?? payload?.data?.payment;
    setOrder(o); setPayment(p);
    if (o?.status === "PAID") {
      setState("paid");
      if (!cleared.current) { cleared.current = true; clearCart().catch(() => {}); }
      return true;
    }
    if (p?.status === "FAILED" || p?.status === "CANCELLED") {
      setState("failed");
      return true;
    }
    setState("pending");
    return false;
  };

  // Manual / automatic fallback: ask the backend to query PayHere directly.
  // Works even when the IPN webhook can't reach us (typical in local dev).
  const verifyNow = async () => {
    if (!orderId || verifying) return;
    setVerifying(true);
    setVerifyError(null);
    try {
      const res = await apiFetch<any>(`/payments/payhere/verify/${orderId}`, { method: "POST" });
      if (!res.ok) {
        setVerifyError(res.error || "Couldn't reach PayHere. Please try again.");
      } else {
        applyResult(res.data);
      }
    } catch {
      setVerifyError("Couldn't reach PayHere. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (!orderId) { setState("missing"); return; }
    let alive = true;

    const tick = async () => {
      const res = await apiFetch<any>(`/payments/order/${orderId}`);
      if (!alive) return;
      if (!res.ok) { setState("failed"); return; }
      const done = applyResult(res.data);
      if (done) return;
      setPolls((n) => {
        const next = n + 1;
        // After ~10s of polling with no IPN update, fall back to the Retrieval
        // API once. This handles the localhost-no-webhook case automatically.
        if (next === 4 && !fallbackTriggered.current) {
          fallbackTriggered.current = true;
          verifyNow();
        }
        return next;
      });
    };

    tick();
    const id = setInterval(tick, 2500);
    return () => { alive = false; clearInterval(id); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, clearCart]);

  return (
    <main className="hp2">
      <DesignStyles />
      <HP2Nav links={DEFAULT_NAV_LINKS} activePath="/checkout" />
      <section style={{ padding: "120px 0 80px", minHeight: "70vh" }}>
        <div className="hp2-container" style={{ maxWidth: 640 }}>
          <div className="hp2-surf" style={{ padding: 0, overflow: "hidden" }}>
            <div className="hp2-surf__body" style={{ padding: 36, textAlign: "center" }}>
              {state === "checking" && (
                <Status icon={<Loader2 size={32} className="hp2-spin" />} tone="violet" title="Confirming your payment…" desc="Please don't close this tab." />
              )}
              {state === "pending" && (
                <Status
                  icon={<Loader2 size={32} className="hp2-spin" />}
                  tone="violet"
                  title="Awaiting payment confirmation"
                  desc={polls > 12
                    ? "PayHere is taking longer than usual. Your order will update automatically once payment is received."
                    : "Verifying with PayHere…"}
                />
              )}
              {state === "paid" && (
                <Status
                  icon={<Check size={32} />}
                  tone="green"
                  title="Payment successful"
                  desc={`Order #${(order?.id || "").slice(0, 8).toUpperCase()} is confirmed. ${payment?.method ? "Paid via " + payment.method + "." : ""}`}
                />
              )}
              {state === "failed" && (
                <Status icon={<AlertTriangle size={32} />} tone="red" title="Payment could not be confirmed" desc={payment?.statusMessage || "Please try again or contact support."} />
              )}
              {state === "missing" && (
                <Status icon={<AlertTriangle size={32} />} tone="red" title="Missing order reference" desc="No order id was provided in the URL." />
              )}

              <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {state === "paid" && (
                  <button onClick={() => router.push(`/orders/${order?.id}`)} className="hp2-btn hp2-btn--primary" style={{ height: 44, padding: "0 22px" }}>
                    Track order <ArrowRight size={14} style={{ marginLeft: 8 }} />
                  </button>
                )}
                {state === "pending" && (
                  <button
                    type="button"
                    onClick={verifyNow}
                    disabled={verifying}
                    className="hp2-btn hp2-btn--primary"
                    style={{ height: 44, padding: "0 22px", display: "inline-flex", alignItems: "center", gap: 8, opacity: verifying ? 0.6 : 1 }}
                  >
                    {verifying ? <Loader2 size={14} className="hp2-spin" /> : <ShieldCheck size={14} />}
                    {verifying ? "Checking PayHere…" : "Verify now"}
                  </button>
                )}
                {state === "failed" && (
                  <Link href="/checkout" className="hp2-btn hp2-btn--primary" style={{ height: 44, padding: "0 22px", display: "inline-flex", alignItems: "center" }}>Retry payment</Link>
                )}
                <Link href="/orders" className="hp2-btn hp2-btn--ghost" style={{ height: 44, padding: "0 22px", display: "inline-flex", alignItems: "center" }}>My orders</Link>
              </div>

              {verifyError && state === "pending" && (
                <p style={{ marginTop: 16, fontSize: 12, color: "#F472B6" }}>{verifyError}</p>
              )}

              {state === "paid" && (
                <p style={{ marginTop: 22, fontSize: 11, color: "#9B95B5", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <ShieldCheck size={12} /> Secured by PayHere
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <HP2Footer />
      <style>{`.hp2-spin{animation:hp2-spin 1s linear infinite;}@keyframes hp2-spin{to{transform:rotate(360deg)}}`}</style>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function Status({ icon, tone, title, desc }: { icon: React.ReactNode; tone: "green" | "violet" | "red"; title: string; desc: string }) {
  const map = {
    green:  { bg: "rgba(52,211,153,0.12)",  fg: "#34d399" },
    violet: { bg: "rgba(167,139,250,0.12)", fg: "#A78BFA" },
    red:    { bg: "rgba(244,114,128,0.12)", fg: "#F472B6" },
  } as const;
  const c = map[tone];
  return (
    <>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: c.bg, color: c.fg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
        {icon}
      </div>
      <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 24, fontWeight: 600, color: "#F5F3FA", marginBottom: 8 }}>{title}</h1>
      <p style={{ fontSize: 14, color: "#9B95B5", maxWidth: 460, margin: "0 auto" }}>{desc}</p>
    </>
  );
}
