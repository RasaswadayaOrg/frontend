"use client";

import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AuthFlow } from "./AuthFlow";
import { DesignStyles } from "./hp2/design";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthModalOpen) return;

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = modalRef.current;
    const focusable = Array.from(modal?.querySelectorAll<HTMLElement>(focusableSelector) || []);
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAuthModal();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeAuthModal, isAuthModalOpen]);

  // Suppress modal on the dedicated /auth route to avoid double UI.
  if (pathname && pathname.startsWith("/auth")) return null;
  if (!isAuthModalOpen) return null;

  return (
    <>
      <DesignStyles />
      <div
        className="hp2"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          onClick={closeAuthModal}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
        />
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 440,
            background: "#15121D",
            border: "1px solid rgba(196,181,253,0.10)",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6)",
          }}
        >
          <h2 id="auth-modal-title" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}>
            Sign in or create an account
          </h2>
          <button
            onClick={closeAuthModal}
            aria-label="Close dialog"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              width: 36,
              height: 36,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "#9B95B5",
              cursor: "pointer",
              borderRadius: 10,
            }}
          >
            <X size={18} aria-hidden="true" />
          </button>
          <AuthFlow isModal onClose={closeAuthModal} onComplete={closeAuthModal} />
        </div>
      </div>
    </>
  );
}
