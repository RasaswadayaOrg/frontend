import Link from "next/link";
import { DesignStyles } from "../../../components/hp2/design";
import { ArrowLeft, Mail } from "lucide-react";

export const metadata = { title: "Forgot Password | Rasaswadaya" };

export default function ForgotPasswordPage() {
  return (
    <>
      <DesignStyles />
      <div className="hp2">
        <div className="hp2-auth-wrap">
          <div className="hp2-auth-card" style={{ color: "#F5F3FA" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(196,181,253,0.10)", display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                href="/auth?tab=signin"
                aria-label="Back to sign in"
                style={{
                  width: 36, height: 36,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 10,
                  border: "1px solid rgba(196,181,253,0.10)",
                  background: "#1E1A2B",
                  color: "#9B95B5",
                  textDecoration: "none",
                }}
              >
                <ArrowLeft size={16} />
              </Link>
              <h1 style={{ fontFamily: "var(--font-outfit)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
                Reset password
              </h1>
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                display: "flex", gap: 12,
                padding: "14px 16px",
                background: "#1E1A2B",
                border: "1px solid rgba(196,181,253,0.10)",
                borderRadius: 14,
              }}>
                <Mail size={18} style={{ color: "#C4B5FD", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 14, color: "#F5F3FA", margin: 0, fontWeight: 600 }}>
                    Coming soon
                  </p>
                  <p style={{ fontSize: 13, color: "#9B95B5", margin: "6px 0 0", lineHeight: 1.55 }}>
                    Password recovery via email isn't enabled yet. Please contact support, or sign in with Google instead.
                  </p>
                </div>
              </div>

              <Link
                href="/auth?tab=signin"
                className="hp2-btn hp2-btn--primary"
                style={{ width: "100%", textDecoration: "none" }}
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
