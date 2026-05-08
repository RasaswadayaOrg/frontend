"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowRight } from "lucide-react";
import { DesignStyles } from "@/components/hp2/design";
import { HP2Nav, DEFAULT_NAV_LINKS } from "@/components/hp2/Nav";
import { HP2Footer } from "@/components/hp2/Footer";

export default function CheckoutCancelPage() {
  const params = useSearchParams();
  const orderId = params.get("order");

  return (
    <main className="hp2">
      <DesignStyles />
      <HP2Nav links={DEFAULT_NAV_LINKS} activePath="/checkout" />
      <section style={{ padding: "120px 0 80px", minHeight: "70vh" }}>
        <div className="hp2-container" style={{ maxWidth: 640 }}>
          <div className="hp2-surf">
            <div className="hp2-surf__body" style={{ padding: 36, textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(244,114,128,0.12)", color: "#F472B6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <XCircle size={32} />
              </div>
              <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 24, fontWeight: 600, color: "#F5F3FA", marginBottom: 8 }}>Payment cancelled</h1>
              <p style={{ fontSize: 14, color: "#9B95B5", maxWidth: 460, margin: "0 auto" }}>
                Your order is still in pending state. You can retry the payment, switch to cash on delivery, or cancel the order.
              </p>
              <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/checkout" className="hp2-btn hp2-btn--primary" style={{ height: 44, padding: "0 22px", display: "inline-flex", alignItems: "center" }}>
                  Retry payment <ArrowRight size={14} style={{ marginLeft: 8 }} />
                </Link>
                {orderId && (
                  <Link href={`/orders/${orderId}`} className="hp2-btn hp2-btn--ghost" style={{ height: 44, padding: "0 22px", display: "inline-flex", alignItems: "center" }}>
                    View order
                  </Link>
                )}
                <Link href="/cart" className="hp2-btn hp2-btn--ghost" style={{ height: 44, padding: "0 22px", display: "inline-flex", alignItems: "center" }}>Back to cart</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <HP2Footer />
    </main>
  );
}
