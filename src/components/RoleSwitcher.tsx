"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAuthToken } from "@/lib/token-storage";

type RoleKey = "ARTIST" | "ORGANIZER" | "STORE_OWNER";

const ROLE_META: Record<RoleKey, { label: string; dashboard: string; tone: string }> = {
  ARTIST:      { label: "Artist Mode",      dashboard: "/artist-dashboard",    tone: "#A78BFA" },
  ORGANIZER:   { label: "Organizer Mode",   dashboard: "/organizer-dashboard", tone: "#FBBF24" },
  STORE_OWNER: { label: "Store Owner Mode", dashboard: "/seller-dashboard",    tone: "#60A5FA" },
};

const ELEVATED: RoleKey[] = ["ARTIST", "ORGANIZER", "STORE_OWNER"];

export function RoleSwitcher({ variant = "header" }: { variant?: "header" | "pill" }) {
  const router = useRouter();
  const { user, refreshUserFromAPI } = useAuth();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!user) return null;

  const currentRole = (user.role || "").toUpperCase() as RoleKey;
  const approvedRaw = (user.approvedRoles || []).map((r) => r.toUpperCase());
  const approvedRoles: RoleKey[] = ELEVATED.filter((r) =>
    approvedRaw.includes(r) || r === currentRole
  );

  if (approvedRoles.length === 0) return null;

  const currentMeta = ROLE_META[currentRole as RoleKey];
  const displayLabel = currentMeta?.label || "Switch Mode";

  const handleSwitch = async (target: RoleKey) => {
    if (target === currentRole) {
      setOpen(false);
      router.push(ROLE_META[target].dashboard);
      return;
    }
    setSwitching(true);
    try {
      const token = getAuthToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
      const res = await fetch(API_URL + "/auth/switch-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}),
        },
        body: JSON.stringify({ role: target }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("Failed to switch role:", err);
        setSwitching(false);
        return;
      }
      await refreshUserFromAPI();
      setOpen(false);
      setSwitching(false);
      router.push(ROLE_META[target].dashboard);
    } catch (err) {
      console.error("Failed to switch role:", err);
      setSwitching(false);
    }
  };

  const isPill = variant === "pill";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={
          isPill
            ? "hp2-mode-pill"
            : "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-brand-800/50 hover:bg-brand-800 rounded-full transition-colors text-brand-100 text-xs font-medium mr-2 border border-brand-500/30"
        }
        style={
          isPill
            ? {
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 34,
                padding: "0 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "-0.005em",
                color: currentMeta?.tone || "#A78BFA",
                background: "rgba(167,139,250,0.10)",
                border: "1px solid " + hexWithAlpha(currentMeta?.tone || "#A78BFA", 0.32),
                whiteSpace: "nowrap",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }
            : undefined
        }
      >
        {isPill ? (
          <>
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: currentMeta?.tone || "#A78BFA",
                boxShadow: "0 0 8px " + hexWithAlpha(currentMeta?.tone || "#A78BFA", 0.7),
                flexShrink: 0,
              }}
            />
            <span className="hidden sm:inline">{displayLabel}</span>
            <ChevronDown size={12} style={{ opacity: 0.75, marginLeft: 2 }} />
          </>
        ) : (
          <>
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{displayLabel}</span>
            <ChevronDown className="w-3 h-3 opacity-75" />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-[min(15rem,calc(100vw-2rem))] rounded-xl bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50"
        >
          <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
            Switch role
          </div>
          {approvedRoles.map((r) => {
            const meta = ROLE_META[r];
            const isCurrent = r === currentRole;
            return (
              <button
                key={r}
                type="button"
                role="menuitem"
                disabled={switching}
                onClick={() => handleSwitch(r)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                <span
                  aria-hidden="true"
                  className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: meta.tone, boxShadow: "0 0 6px " + hexWithAlpha(meta.tone, 0.6) }}
                />
                <span className="flex-1">{meta.label}</span>
                {switching && r !== currentRole ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                ) : isCurrent ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}
