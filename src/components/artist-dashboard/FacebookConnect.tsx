"use client";

import { useState, useEffect, useCallback } from "react";
import { Facebook, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

interface FacebookPage {
  id: string;
  name: string;
  accessToken: string;
  category?: string;
}

interface FacebookConnectProps {
  artistId: string | null;
  isConnected?: boolean;
}

export function FacebookConnect({ artistId, isConnected = false }: FacebookConnectProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [showPagePicker, setShowPagePicker] = useState(false);
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  // Listen for the OAuth popup callback message
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "FB_AUTH_SUCCESS") {
        setLoading(false);
        const receivedPages: FacebookPage[] = event.data.pages || [];
        if (receivedPages.length === 0) {
          setError("No Facebook Pages found on your account. You need a Facebook Page to connect.");
          return;
        }
        setPages(receivedPages);
        setShowPagePicker(true);
      }

      if (event.data.type === "FB_AUTH_ERROR") {
        setLoading(false);
        setError(event.data.error || "Facebook authorization failed.");
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Step 1: Open Facebook OAuth popup
  const handleConnect = async () => {
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("rasas_token");
      const res = await fetch(`${API_URL}/artists/facebook/auth-url`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to start Facebook login");
      }

      const { authUrl } = await res.json();

      // Open popup centered on screen
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        "facebook-auth",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
      );

      if (!popup) {
        setLoading(false);
        setError("Popup was blocked. Please allow popups for this site and try again.");
        return;
      }

      // Monitor if user closes the popup without finishing
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
          setLoading(false);
        }
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  // Step 2: Save the selected page to the artist profile
  const handleSelectPage = async (page: FacebookPage) => {
    setSelectedPage(page);
    setSaving(true);
    setError("");

    let currentArtistId = artistId;

    if (!currentArtistId) {
      try {
        const token = localStorage.getItem("rasas_token");
        const res = await fetch(`${API_URL}/artists/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          currentArtistId = data.id;
        }
      } catch {}
    }

    if (!currentArtistId) {
      setSaving(false);
      setError("Artist profile not found. Please set up your artist profile first.");
      return;
    }

    try {
      const token = localStorage.getItem("rasas_token");
      const res = await fetch(`${API_URL}/artists/${currentArtistId}/facebook/select-page`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pageId: page.id,
          pageAccessToken: page.accessToken,
          pageName: page.name,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to connect page");
      }

      setSuccess(true);
      setShowPagePicker(false);
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-6">
      <h3 className="text-sm font-semibold mb-3 text-neutral-900 dark:text-white flex items-center gap-2">
        <Facebook className="w-4 h-4 text-blue-600" /> Facebook Integration
      </h3>

      <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {isConnected ? "Connected to Facebook Page" : "Connect Your Facebook Page"}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
              {isConnected
                ? "Posts from your Facebook Page are automatically synced."
                : "Authorize with Facebook to auto-sync your page posts."}
            </p>
          </div>

          {success ? (
            <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
              <CheckCircle2 className="w-5 h-5" /> Connected!
            </div>
          ) : isConnected ? (
            <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
              <CheckCircle2 className="w-5 h-5" /> Connected
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Facebook className="w-4 h-4" />
              )}
              {loading ? "Connecting..." : "Connect with Facebook"}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Page Picker Modal */}
      {showPagePicker && pages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-bold mb-2 text-neutral-900 dark:text-white">
              Select a Facebook Page
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Choose which page to sync posts from:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handleSelectPage(page)}
                  disabled={saving}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left
                    ${
                      selectedPage?.id === page.id && saving
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-neutral-200 dark:border-zinc-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                    }
                    disabled:opacity-60`}
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {page.name}
                    </p>
                    {page.category && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">{page.category}</p>
                    )}
                  </div>
                  {selectedPage?.id === page.id && saving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  ) : (
                    <ExternalLink className="w-4 h-4 text-neutral-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => {
                  setShowPagePicker(false);
                  setPages([]);
                }}
                disabled={saving}
                className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
