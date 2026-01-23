"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function submitRoleApplication(formData: FormData) {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return { error: "Not authenticated" };

  const { decrypt } = await import("@/lib/auth");
  const session = await decrypt(sessionCookie);
  const token = session?.token;

  if (!token) return { error: "No token found" };

  try {
      const res = await fetch(`${API_URL}/role-applications/apply`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // Let fetch set the boundary
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown server error" }));
        return { error: err.error || "Failed to submit application" };
      }

      return { success: true, data: await res.json() };
  } catch(e) {
      console.error("Submit application error:", e);
      return { error: "Network error occurred" };
  }
}

export async function fetchMyApplications() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return [];

  const { decrypt } = await import("@/lib/auth");
  const session = await decrypt(sessionCookie);
  const token = session?.token;

  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/role-applications/my-applications`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    // API returns array directly
    return Array.isArray(json) ? json : [];
  } catch (e) {
    console.error("Fetch applications error:", e);
    return [];
  }
}
