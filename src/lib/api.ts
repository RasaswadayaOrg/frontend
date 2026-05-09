/**
 * Small wrapper around fetch for calls to our Express backend.
 * - Reads the JWT from localStorage (set on login)
 * - Auto-serializes JSON bodies
 * - Returns `{ ok, data, error, status }` so callers don't need try/catch
 *
 * Safe to use from client components only (reads localStorage).
 */

import { getAuthToken } from "@/lib/token-storage";

const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "/api"
    : process.env.NEXT_PUBLIC_API_URL || "/api";

export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number; data?: any };

interface ApiOptions extends RequestInit {
  /** Skip attaching the Authorization header even if a token is present */
  anonymous?: boolean;
  /** If set, uses this token instead of reading from localStorage */
  token?: string | null;
  /** JSON-serializable body; overrides `body` if set */
  json?: unknown;
}

function getStoredToken(): string | null {
  return getAuthToken();
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResult<T>> {
  const { anonymous, token: explicitToken, json, headers, ...rest } = options;

  const token = anonymous ? null : explicitToken ?? getStoredToken();

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  let body = rest.body;
  if (json !== undefined) {
    body = JSON.stringify(json);
    finalHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      ...rest,
      headers: finalHeaders,
      body,
    });

    const text = await res.text();
    const payload = text ? safeJson(text) : null;

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error:
          (typeof payload?.error === "string" ? payload.error : payload?.error?.message) ||
          payload?.message ||
          `Request failed with ${res.status}`,
        data: payload,
      };
    }

    return { ok: true, status: res.status, data: (payload?.data ?? payload) as T };
  } catch (error: any) {
    const isConnRefused =
      error?.cause?.code === "ECONNREFUSED" ||
      (error?.message ?? "").includes("ECONNREFUSED");
    return {
      ok: false,
      status: 0,
      error: isConnRefused
        ? "Backend is not reachable. Start the API server."
        : error?.message || "Network error",
    };
  }
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const API_BASE_URL = API_URL;
