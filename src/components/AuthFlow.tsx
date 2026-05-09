"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/app/actions/auth";
import { ArrowLeft, Mail, Eye, EyeOff, Lock, User, AlertCircle, Sparkles } from "lucide-react";

interface AuthFlowProps {
  onComplete?: () => void;
  onClose?: () => void;
  isModal?: boolean;
  defaultView?: "signin" | "signup";
  showOptionsFirst?: boolean;
}

type ViewState = "options" | "signin" | "signup";

const COLORS = {
  TEXT: "#F5F3FA",
  MUTED: "#9B95B5",
  LINE: "rgba(196,181,253,0.10)",
  LINE_STRONG: "rgba(196,181,253,0.18)",
  SURF: "#15121D",
  SURF2: "#1E1A2B",
  ACCENT: "#A78BFA",
  AI: "#C4B5FD",
  DANGER: "#FCA5A5",
  DANGER_BG: "rgba(252,165,165,0.08)",
  DANGER_BORDER: "rgba(252,165,165,0.25)",
};

function strengthFor(pw: string): { label: string; pct: number; color: string } {
  if (!pw) return { label: "", pct: 0, color: COLORS.LINE };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong", "Strong"];
  const label = labels[Math.min(score, labels.length - 1)];
  const pct = (score / 5) * 100;
  const color = score <= 1 ? "#FCA5A5" : score === 2 ? "#FCD34D" : score === 3 ? "#A78BFA" : "#86EFAC";
  return { label, pct, color };
}

export function AuthFlow({ onComplete, onClose, isModal = false, defaultView = "signin", showOptionsFirst }: AuthFlowProps) {
  const router = useRouter();
  const search = useSearchParams();
  const { loginWithGoogle, loginWithEmail, loginAfterSignup } = useAuth();
  const startsWithOptions = showOptionsFirst ?? isModal;
  const [view, setView] = useState<ViewState>(startsWithOptions ? "options" : defaultView);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Surface ?error= from /auth/callback
  useEffect(() => {
    const errParam = search?.get("error");
    if (errParam === "auth_failed") setError("Google sign-in failed. Please try again.");
    else if (errParam === "sync_failed") setError("Could not sync your account. Please try again.");
    else if (errParam === "unexpected") setError("Something went wrong. Please try again.");
  }, [search]);

  // Sync URL ?tab= with current view (page only, not modal).
  useEffect(() => {
    if (isModal) return;
    if (view === "options") return;
    const current = search?.get("tab");
    if (current === view) return;
    const params = new URLSearchParams(search?.toString() || "");
    params.set("tab", view);
    router.replace("/auth?" + params.toString(), { scroll: false });
  }, [view, isModal, router, search]);

  const nextHref = useMemo(() => {
    const raw = search?.get("next");
    if (!raw) return "/";
    if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
    return raw;
  }, [search]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await loginWithGoogle();
    } catch (e) {
      console.error("Google sign-in failed:", e);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginWithEmail(formData.email, formData.password);
      if (result.success) {
        onComplete?.();
        onClose?.();
        if (!isModal) {
          router.push(nextHref);
        } else {
          const returnUrl = typeof window !== "undefined" ? sessionStorage.getItem("rasas_return_url") : null;
          if (returnUrl) {
            sessionStorage.removeItem("rasas_return_url");
            router.push(returnUrl);
          }
        }
        router.refresh();
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err: any) {
      console.error("Sign in failed:", err);
      setError(err?.message || "Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: (formData.firstName + " " + formData.lastName).trim(),
      });

      if (result.success && result.user && result.token) {
        loginAfterSignup(result.user, result.token);
        onComplete?.();
        onClose?.();
        // returnUrl stays in sessionStorage — complete-profile page will consume it
        router.push("/auth/complete-profile");
        router.refresh();
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Sign up failed:", err);
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  const errorBanner = error ? (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: "flex",
        gap: 10,
        padding: "12px 14px",
        background: COLORS.DANGER_BG,
        border: "1px solid " + COLORS.DANGER_BORDER,
        borderRadius: 14,
        color: COLORS.DANGER,
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{error}</span>
    </div>
  ) : null;

  // Google button + "or" divider, used at the top of signin/signup forms.
  // Backend `/auth/google` upserts the user, so this single button works for
  // both creating an account and signing in (Facebook-style).
  const googleSection = (label: string) => (
    <>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="hp2-btn hp2-btn--ghost"
        style={{
          width: "100%",
          gap: 10,
          opacity: isLoading ? 0.6 : 1,
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? (
          <span
            style={{
              width: 16,
              height: 16,
              border: "2px solid " + COLORS.LINE,
              borderTopColor: COLORS.AI,
              borderRadius: "50%",
              animation: "hp2spin .7s linear infinite",
            }}
          />
        ) : (
          <GoogleIcon />
        )}
        {isLoading ? "Connecting…" : label}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
        <div style={{ flex: 1, height: 1, background: COLORS.LINE }} />
        <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: COLORS.MUTED, fontWeight: 600 }}>or</span>
        <div style={{ flex: 1, height: 1, background: COLORS.LINE }} />
      </div>
    </>
  );

  const headerBar = (title: string, subtitle: string | null, canBack: boolean) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "20px 24px",
        borderBottom: "1px solid " + COLORS.LINE,
      }}
    >
      {canBack ? (
        <button
          type="button"
          aria-label="Back"
          onClick={() => setView("options")}
          style={{
            width: 36,
            height: 36,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            border: "1px solid " + COLORS.LINE,
            background: COLORS.SURF2,
            color: COLORS.MUTED,
            cursor: "pointer",
            transition: "color .2s, border-color .2s",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={16} />
        </button>
      ) : null}
      <div>
        <h2
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: COLORS.TEXT,
            margin: 0,
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p style={{ fontSize: 12, color: COLORS.MUTED, margin: "4px 0 0", lineHeight: 1.5 }}>{subtitle}</p>
        ) : null}
      </div>
    </div>
  );

  const inputWrap = (icon: React.ReactNode, input: React.ReactNode, trailing?: React.ReactNode) => (
    <div style={{ position: "relative" }}>
      {icon ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            color: COLORS.MUTED,
            display: "flex",
          }}
        >
          {icon}
        </div>
      ) : null}
      {input}
      {trailing ? (
        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
          }}
        >
          {trailing}
        </div>
      ) : null}
    </div>
  );

  const inputBaseStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    paddingLeft: 44,
    paddingRight: 16,
    borderRadius: 14,
    background: COLORS.SURF2,
    border: "1px solid " + COLORS.LINE,
    color: COLORS.TEXT,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color .2s, background .2s",
  };

  const eyeBtn = (
    <button
      type="button"
      aria-label={showPassword ? "Hide password" : "Show password"}
      onClick={() => setShowPassword((v) => !v)}
      style={{
        background: "transparent",
        border: "none",
        color: COLORS.MUTED,
        padding: 6,
        display: "inline-flex",
        cursor: "pointer",
      }}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  // ---------- SIGN IN ----------
  if (view === "signin") {
    return (
      <div style={{ width: "100%", color: COLORS.TEXT }}>
        {headerBar("Welcome back", "Sign in to your Rasaswadaya account.", startsWithOptions)}
        <form onSubmit={handleEmailSignIn} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {errorBanner}

          {googleSection("Continue with Google")}

          <div className="hp2-field">
            <label className="hp2-label" htmlFor="signin-email">Email</label>
            {inputWrap(
              <Mail size={16} />,
              <input
                id="signin-email"
                type="email"
                required
                placeholder="you@example.com"
                style={inputBaseStyle}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="email"
              />
            )}
          </div>

          <div className="hp2-field">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label className="hp2-label" htmlFor="signin-password">Password</label>
              <Link
                href="/auth/forgot"
                style={{ fontSize: 12, color: COLORS.AI, textDecoration: "none", fontWeight: 500 }}
              >
                Forgot password?
              </Link>
            </div>
            {inputWrap(
              <Lock size={16} />,
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                style={{ ...inputBaseStyle, paddingRight: 48 }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="current-password"
              />,
              eyeBtn
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="hp2-btn hp2-btn--primary"
            style={{ width: "100%", marginTop: 4, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(0,0,0,0.2)",
                    borderTopColor: "#0a0a0b",
                    borderRadius: "50%",
                    animation: "hp2spin .7s linear infinite",
                    marginRight: 8,
                  }}
                />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: COLORS.MUTED, margin: "4px 0 0" }}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setView("signup")}
              style={{ background: "none", border: "none", color: COLORS.AI, fontWeight: 600, cursor: "pointer", padding: 0 }}
            >
              Create one
            </button>
          </p>
        </form>
        <style>{"@keyframes hp2spin{to{transform:rotate(360deg)}}"}</style>
      </div>
    );
  }

  // ---------- SIGN UP ----------
  if (view === "signup") {
    const strength = strengthFor(formData.password);
    const mismatch =
      formData.passwordConfirm.length > 0 && formData.password !== formData.passwordConfirm;

    return (
      <div style={{ width: "100%", color: COLORS.TEXT }}>
        {headerBar("Create account", "It only takes a minute.", startsWithOptions)}
        <form onSubmit={handleEmailSignUp} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {errorBanner}

          {googleSection("Sign up with Google")}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="hp2-field">
              <label className="hp2-label" htmlFor="signup-fname">First name</label>
              {inputWrap(
                <User size={16} />,
                <input
                  id="signup-fname"
                  type="text"
                  required
                  placeholder="John"
                  style={inputBaseStyle}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  autoComplete="given-name"
                />
              )}
            </div>
            <div className="hp2-field">
              <label className="hp2-label" htmlFor="signup-lname">Last name</label>
              {inputWrap(
                <User size={16} />,
                <input
                  id="signup-lname"
                  type="text"
                  placeholder="Doe"
                  style={inputBaseStyle}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  autoComplete="family-name"
                />
              )}
            </div>
          </div>

          <div className="hp2-field">
            <label className="hp2-label" htmlFor="signup-email">Email</label>
            {inputWrap(
              <Mail size={16} />,
              <input
                id="signup-email"
                type="email"
                required
                placeholder="you@example.com"
                style={inputBaseStyle}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="email"
              />
            )}
          </div>

          <div className="hp2-field">
            <label className="hp2-label" htmlFor="signup-password">Password</label>
            {inputWrap(
              <Lock size={16} />,
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="Min 6 characters"
                style={{ ...inputBaseStyle, paddingRight: 48 }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="new-password"
              />,
              eyeBtn
            )}
            {formData.password ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 999, background: COLORS.LINE, overflow: "hidden" }}>
                  <div
                    style={{
                      width: strength.pct + "%",
                      height: "100%",
                      background: strength.color,
                      transition: "width .25s ease, background .25s ease",
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: strength.color, fontWeight: 600, minWidth: 56, textAlign: "right" }}>
                  {strength.label}
                </span>
              </div>
            ) : null}
          </div>

          <div className="hp2-field">
            <label className="hp2-label" htmlFor="signup-password-confirm">Confirm password</label>
            {inputWrap(
              <Lock size={16} />,
              <input
                id="signup-password-confirm"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Re-enter password"
                style={{
                  ...inputBaseStyle,
                  paddingRight: 16,
                  borderColor: mismatch ? COLORS.DANGER_BORDER : COLORS.LINE,
                }}
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                autoComplete="new-password"
              />
            )}
            {mismatch ? (
              <span style={{ fontSize: 12, color: COLORS.DANGER, marginTop: 4 }}>Passwords don't match.</span>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="hp2-btn hp2-btn--accent"
            style={{ width: "100%", marginTop: 4, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(0,0,0,0.2)",
                    borderTopColor: "#0a0a0b",
                    borderRadius: "50%",
                    animation: "hp2spin .7s linear infinite",
                    marginRight: 8,
                  }}
                />
                Creating account…
              </>
            ) : (
              <>
                <Sparkles size={16} style={{ marginRight: 8 }} />
                Create Account
              </>
            )}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: COLORS.MUTED, margin: "4px 0 0" }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setView("signin")}
              style={{ background: "none", border: "none", color: COLORS.AI, fontWeight: 600, cursor: "pointer", padding: 0 }}
            >
              Sign in
            </button>
          </p>
        </form>
        <style>{"@keyframes hp2spin{to{transform:rotate(360deg)}}"}</style>
      </div>
    );
  }

  // ---------- OPTIONS (default for modal) ----------
  return (
    <div style={{ width: "100%", color: COLORS.TEXT }}>
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid " + COLORS.LINE }}>
        <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: COLORS.MUTED, fontWeight: 600, margin: 0 }}>
          Welcome
        </p>
        <h2
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            color: COLORS.TEXT,
            margin: "8px 0 0",
          }}
        >
          Step into Rasaswadaya
        </h2>
        <p style={{ fontSize: 13, color: COLORS.MUTED, margin: "8px 0 0", lineHeight: 1.55 }}>
          Discover events, follow artists, and explore Sri Lankan arts &amp; culture.
        </p>
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        {errorBanner}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="hp2-btn hp2-btn--ghost"
          style={{ width: "100%", gap: 10, opacity: isLoading ? 0.6 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          {isLoading ? (
            <span
              style={{
                width: 16,
                height: 16,
                border: "2px solid " + COLORS.LINE,
                borderTopColor: COLORS.AI,
                borderRadius: "50%",
                animation: "hp2spin .7s linear infinite",
              }}
            />
          ) : (
            <GoogleIcon />
          )}
          {isLoading ? "Connecting…" : "Continue with Google"}
        </button>

        <div style={{ position: "relative", margin: "6px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: COLORS.LINE }} />
          <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: COLORS.MUTED, fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: COLORS.LINE }} />
        </div>

        <button
          onClick={() => setView("signin")}
          className="hp2-btn hp2-btn--primary"
          style={{ width: "100%", gap: 8 }}
        >
          <Mail size={16} />
          Sign in with Email
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: COLORS.MUTED, margin: "8px 0 0" }}>
          New to Rasas?{" "}
          <button
            type="button"
            onClick={() => setView("signup")}
            style={{ background: "none", border: "none", color: COLORS.AI, fontWeight: 600, cursor: "pointer", padding: 0 }}
          >
            Create an account
          </button>
        </p>

        <p style={{ textAlign: "center", fontSize: 11, color: COLORS.MUTED, margin: "12px 0 0", lineHeight: 1.5 }}>
          By continuing, you agree to our{" "}
          <Link href="/terms" style={{ color: COLORS.MUTED, textDecoration: "underline" }}>Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" style={{ color: COLORS.MUTED, textDecoration: "underline" }}>Privacy Policy</Link>.
        </p>
      </div>
      <style>{"@keyframes hp2spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}
