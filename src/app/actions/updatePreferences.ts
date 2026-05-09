"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function updateUserPreferences({ categories, interests, city }: { categories: string[]; interests: string[]; city?: string }) {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;

  // Decrypt session to get JWT token
  const { decrypt } = await import("@/lib/auth");
  const session = await decrypt(sessionCookie);
  const token = session?.token;

  if (!token) return null;

  const res = await fetch(`${API_URL}/auth/preferences`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categories, interests, ...(city ? { city } : {}) }),
  });

  if (!res.ok) return null;
  const result = await res.json();
  return result.data;
}
