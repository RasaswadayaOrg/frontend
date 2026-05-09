"use client";

import { useEffect, useState } from "react";

export default function FacebookCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting to Facebook...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const errorParam = params.get("error");

    if (errorParam) {
      setStatus("error");
      setMessage(params.get("error_description") || "Facebook authorization was denied.");
      // Notify parent window
      if (window.opener) {
        window.opener.postMessage({ type: "FB_AUTH_ERROR", error: errorParam }, window.location.origin);
        setTimeout(() => window.close(), 2000);
      }
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("No authorization code received.");
      return;
    }

    // Exchange code for token via our backend
    const exchangeCode = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

        const res = await fetch(`${API_URL}/artists/facebook/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to exchange token");
        }

        const data = await res.json();

        // Send pages data back to the opener window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "FB_AUTH_SUCCESS",
              pages: data.pages,
              userAccessToken: data.userAccessToken,
            },
            window.location.origin
          );
        }

        setStatus("success");
        setMessage("Connected! You can close this window.");
        setTimeout(() => window.close(), 1500);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Something went wrong.");
        if (window.opener) {
          window.opener.postMessage(
            { type: "FB_AUTH_ERROR", error: err.message },
            window.location.origin
          );
        }
      }
    };

    exchangeCode();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-zinc-950">
      <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-zinc-800 max-w-sm w-full">
        {status === "loading" && (
          <>
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
