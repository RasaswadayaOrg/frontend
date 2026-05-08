"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { DesignStyles } from "@/components/hp2/design";
import { HP2Nav, DEFAULT_NAV_LINKS } from "@/components/hp2/Nav";
import { HP2Footer } from "@/components/hp2/Footer";

interface Application {
  id: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  bio: string | null;
  portfolioUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG = {
  PENDING:  { icon: Clock,         label: "Under Review",  badgeClass: "hp2-badge--pending",   color: "#fbbf24" },
  APPROVED: { icon: CheckCircle,   label: "Approved",      badgeClass: "hp2-badge--approved",  color: "#34d399" },
  REJECTED: { icon: XCircle,       label: "Not Approved",  badgeClass: "hp2-badge--rejected",  color: "#f87171" },
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/my-applications")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setApplications(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="hp2">
      <DesignStyles />
      <HP2Nav links={DEFAULT_NAV_LINKS} activePath="/my-applications" />
      <section style={{ paddingBottom: 80 }}>
        <header className="hp2-cover" style={{ minHeight: 220, padding: "88px 0 28px" }}>
          <div className="hp2-cover__media hp2-cover__media--violet" aria-hidden />
          <div className="hp2-container">
            <div className="hp2-cover__inner">
              <p className="hp2-cover__kicker">Your applications</p>
              <h1 className="hp2-cover__title">Role <em>requests.</em></h1>
              <p className="hp2-cover__lede">Track Artist, Organizer, Seller &amp; Teacher applications.</p>
            </div>
          </div>
        </header>

        <div className="hp2-container" style={{ paddingTop: 32 }}>

          {loading && <div className="hp2-loading"><div className="hp2-spinner hp2-spinner--lg" /></div>}

          {!loading && applications.length === 0 && (
            <div className="hp2-empty">
              <div style={{ marginBottom: 16, color: "#9B95B5" }}><AlertCircle size={32} /></div>
              <p className="hp2-empty__title">No applications yet</p>
              <p className="hp2-empty__lede">Apply for a role to start contributing as an artist, organiser, or seller.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
                <Link href="/role-application/artist" className="hp2-btn hp2-btn--accent">Apply as Artist</Link>
                <Link href="/role-application/organizer" className="hp2-btn hp2-btn--ghost">Apply as Organizer</Link>
              </div>
            </div>
          )}

          {!loading && applications.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {applications.map((app) => {
                const cfg = STATUS_CONFIG[app.status] || { icon: AlertCircle, label: app.status, badgeClass: "hp2-badge--processing", color: "#9B95B5" };
                const Icon = cfg.icon;
                return (
                  <div key={app.id} className="hp2-surf">
                    <div className="hp2-surf__head" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-outfit)", fontSize: 18, fontWeight: 500, color: "#F5F3FA", marginBottom: 4 }}>
                          {app.role} Application
                        </p>
                        <p style={{ fontSize: 12, color: "#9B95B5" }}>
                          Submitted {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <Icon size={16} style={{ color: cfg.color }} />
                        <span className={"hp2-badge " + cfg.badgeClass}>{cfg.label}</span>
                      </div>
                    </div>

                    <div className="hp2-surf__body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div className="hp2-alert hp2-alert--info" style={{ fontSize: 13 }}>
                        <Icon size={14} style={{ color: cfg.color, flexShrink: 0 }} />
                        {app.status === "PENDING"
                          ? "Your application is under review by our team. We&rsquo;ll notify you once a decision is made."
                          : app.status === "APPROVED"
                          ? "Congratulations! Your application has been approved."
                          : "Your application was not approved at this time."}
                      </div>

                      {app.bio && (
                        <div>
                          <p style={{ fontSize: 11, color: "#9B95B5", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Your Bio</p>
                          <p style={{ fontSize: 14, color: "#F5F3FA", lineHeight: 1.6 }}>{app.bio}</p>
                        </div>
                      )}

                      {app.notes && (
                        <div style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.18)" }}>
                          <p style={{ fontSize: 11, color: "#C4B5FD", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Admin Notes</p>
                          <p style={{ fontSize: 13, color: "#F5F3FA" }}>{app.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div style={{ textAlign: "center", paddingTop: 8 }}>
                <Link href="/role-application/artist" className="hp2-btn hp2-btn--ghost hp2-btn--sm">Submit another application</Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <HP2Footer />
    </main>
  );
}
