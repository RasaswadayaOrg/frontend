"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function submitRoleApplication(formData: FormData) {
  try {
    const sessionCookie = (await cookies()).get("session")?.value;
    if (!sessionCookie) return { success: false, error: "Not authenticated" };

    // Decrypt session to get JWT token
    const { decrypt } = await import("@/lib/auth");
    const session = await decrypt(sessionCookie);
    const token = session?.token;

    if (!token) return { success: false, error: "Invalid session" };

    const res = await fetch(`${API_URL}/role-applications/apply`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
         // Note: When sending FormData with fetch, do NOT set Content-Type header manually.
         // The browser/fetch will set it with the correct boundary.
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, error: errorData.error || "Failed to submit application" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("Submit application error:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}
