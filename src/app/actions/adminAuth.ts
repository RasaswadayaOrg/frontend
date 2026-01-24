'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === "admin" && password === "admin") {
    // Set cookie
    (await cookies()).set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return { success: true };
  }

  return { success: false, message: "Invalid credentials" };
}

export async function adminLogout() {
  (await cookies()).delete("admin_session");
  redirect("/admin/login");
}

export async function verifyAdmin() {
  const cookieStore = await cookies();
  return cookieStore.has("admin_session");
}
