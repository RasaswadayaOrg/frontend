'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    // Call backend API to authenticate admin
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const cookieStore = await cookies();
      // Session cookie (role info, for server-side route guards)
      cookieStore.set("admin_session", JSON.stringify({
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
      // Token cookie (for server actions that proxy to the backend)
      cookieStore.set("admin_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      
      // Return token to be stored in localStorage by client
      return { success: true, token: data.token };
    }

    return { success: false, message: data.error || "Invalid credentials" };
  } catch (error) {
    console.error('Admin login error:', error);
    return { success: false, message: "Login failed. Please try again." };
  }
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");
  
  if (!adminSession) return false;
  
  try {
    const session = JSON.parse(adminSession.value);
    return session.role === "ADMIN";
  } catch {
    return false;
  }
}
