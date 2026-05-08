"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Heart, Loader2, Share2, Ticket } from "lucide-react";

interface EventActionsProps {
  eventId: string;
  eventTitle: string;
  ticketLink?: string | null;
  initialIsInterested?: boolean;
  initialInterestCount?: number;
}

export function EventActions({
  eventId,
  eventTitle,
  ticketLink,
  initialIsInterested = false,
  initialInterestCount = 0,
}: EventActionsProps) {
  const { user, openAuthModal } = useAuth();
  const [isInterested, setIsInterested] = useState(initialIsInterested);
  const [interestCount, setInterestCount] = useState(initialInterestCount);
  const [isSavingInterest, setIsSavingInterest] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [authNudge, setAuthNudge] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsInterested(initialIsInterested);
      setInterestCount(initialInterestCount);
      return;
    }

    let isMounted = true;
    apiFetch<any>(`/events/${eventId}`).then((res) => {
      if (!isMounted || !res.ok || !res.data) return;
      setIsInterested(Boolean(res.data.isInterested));
      setInterestCount(Number(res.data.interestCount || 0));
    });

    return () => {
      isMounted = false;
    };
  }, [eventId, initialInterestCount, initialIsInterested, user]);

  // Auto-dismiss feedback messages
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(t);
  }, [message]);

  // Auto-dismiss auth nudge
  useEffect(() => {
    if (!authNudge) return;
    const t = setTimeout(() => setAuthNudge(null), 5000);
    return () => clearTimeout(t);
  }, [authNudge]);

  const requireAuth = (nudgeText: string) => {
    if (user) return true;
    setAuthNudge(nudgeText);
    return false;
  };

  const openModal = () => {
    const returnUrl = typeof window !== "undefined" ? window.location.href : undefined;
    openAuthModal(returnUrl);
  };

  const handleGetTickets = () => {
    if (!requireAuth("You’ll need an account to get tickets.")) return;

    if (ticketLink) {
      window.open(ticketLink, "_blank", "noopener,noreferrer");
      return;
    }

    void handleInterest(true);
  };

  const handleInterest = async (forceInterested = false) => {
    if (!requireAuth("Sign in to save events you’re interested in.")) return;

    const prevInterested = isInterested;
    const nextInterested = forceInterested ? true : !isInterested;
    if (prevInterested === nextInterested) return;

    // Optimistic update — instant visual feedback
    setIsInterested(nextInterested);
    setInterestCount((c) => Math.max(0, c + (nextInterested ? 1 : -1)));
    setIsSavingInterest(true);
    setMessage(null);

    try {
      const res = await apiFetch(`/events/${eventId}/interest`, {
        method: nextInterested ? "POST" : "DELETE",
      });

      if (!res.ok) {
        throw new Error(res.error || "Could not update your interest. Please try again.");
      }

      setMessage({
        type: "success",
        text: nextInterested
          ? "Saved. We'll keep this event on your radar."
          : "Removed from your saved events.",
      });
    } catch (error: any) {
      // Roll back optimistic update
      setIsInterested(prevInterested);
      setInterestCount((c) => Math.max(0, c + (nextInterested ? -1 : 1)));
      setMessage({ type: "error", text: error?.message || "Connection error. Please try again." });
    } finally {
      setIsSavingInterest(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: eventTitle, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setMessage({ type: "success", text: "Event link copied to clipboard." });
      }
    } catch {
      setMessage({ type: "error", text: "Could not share this event right now." });
    }
  };

  return (
    <div className="hp2-event-actions">
      {authNudge && (
        <div className="hp2-event-actions__nudge">
          <span>{authNudge}</span>
          <button onClick={openModal} className="hp2-event-actions__nudge-cta">Sign in →</button>
        </div>
      )}
      <button
        onClick={handleGetTickets}
        disabled={isSavingInterest}
        className="hp2-event-actions__primary"
      >
        {isSavingInterest && !ticketLink ? <Loader2 className="w-5 h-5 animate-spin" /> : <Ticket className="w-5 h-5" />}
        {ticketLink ? "Get Tickets" : isInterested ? "Interested" : "Buy tickets"}
      </button>
      <div className="hp2-event-actions__row">
        <button
          onClick={() => handleInterest()}
          disabled={isSavingInterest}
          aria-pressed={isInterested}
          className={`hp2-event-actions__ghost${isInterested ? " is-active" : ""}`}
        >
          {isSavingInterest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-4 h-4 ${isInterested ? "fill-current" : ""}`} />}
          {isInterested ? "Interested" : "Save"}
        </button>
        <button
          onClick={handleShare}
          title="Copy event link to clipboard"
          className="hp2-event-actions__ghost"
        >
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
      {message && (
        <div
          role="status"
          className={`hp2-event-actions__msg hp2-event-actions__msg--${message.type}`}
        >
          {message.text}
        </div>
      )}
      <style jsx>{`
        .hp2-event-actions__nudge {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 11px 14px; border-radius: 12px;
          background: rgba(167,139,250,0.10);
          border: 1px solid rgba(167,139,250,0.30);
          font-size: 13px; color: #C4B5FD; line-height: 1.4;
          animation: nudge-in .25s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes nudge-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hp2-event-actions__nudge-cta {
          flex-shrink: 0; cursor: pointer; border: none; background: none; padding: 0;
          font-size: 13px; font-weight: 600; color: #A78BFA;
          text-decoration: underline; text-underline-offset: 3px;
        }
        .hp2-event-actions__nudge-cta:hover { color: #C4B5FD; }
        .hp2-event-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .hp2-event-actions__primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px 22px;
          font-family: var(--font-outfit, inherit);
          font-size: 15px; font-weight: 600; letter-spacing: -0.005em;
          color: #F5F3FA; border: 1px solid rgba(196,181,253,0.30);
          border-radius: 14px; cursor: pointer;
          background: linear-gradient(110deg, #7C3AED 0%, #A78BFA 50%, #6366F1 100%);
          box-shadow:
            0 0 24px rgba(167,139,250,0.40),
            0 0 8px rgba(167,139,250,0.25),
            0 8px 24px rgba(124,58,237,0.30);
          transition: transform .25s cubic-bezier(0.22,1,0.36,1), box-shadow .25s ease, opacity .2s ease;
        }
        .hp2-event-actions__primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 0 32px rgba(167,139,250,0.55),
            0 0 12px rgba(167,139,250,0.35),
            0 12px 32px rgba(124,58,237,0.40);
        }
        .hp2-event-actions__primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .hp2-event-actions__row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 6px; }
        .hp2-event-actions__ghost {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px 14px; font-size: 13px; font-weight: 500; letter-spacing: -0.005em;
          color: #F5F3FA; cursor: pointer;
          background: rgba(21,18,29,0.55);
          border: 1px solid rgba(196,181,253,0.14);
          border-radius: 12px;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          transition: background .2s ease, border-color .2s ease, color .2s ease;
        }
        .hp2-event-actions__ghost:hover:not(:disabled) {
          background: rgba(30,26,43,0.85);
          border-color: rgba(196,181,253,0.28);
        }
        .hp2-event-actions__ghost.is-active {
          color: #C4B5FD;
          border-color: rgba(167,139,250,0.45);
          background: rgba(167,139,250,0.10);
        }
        .hp2-event-actions__ghost:disabled { opacity: 0.6; cursor: not-allowed; }
        .hp2-event-actions__msg {
          padding: 9px 12px; border-radius: 10px; font-size: 12.5px;
          border: 1px solid transparent;
        }
        .hp2-event-actions__msg--success {
          color: #C4B5FD; background: rgba(167,139,250,0.10); border-color: rgba(167,139,250,0.28);
        }
        .hp2-event-actions__msg--error {
          color: #FCA5A5; background: rgba(239,68,68,0.10); border-color: rgba(239,68,68,0.28);
        }
      `}</style>
    </div>
  );
}
