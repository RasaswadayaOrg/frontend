"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Get the JWT token from the session cookie
async function getToken(): Promise<string | null> {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;
  
  try {
    const session = await decrypt(sessionCookie);
    return session?.token || null;
  } catch {
    return null;
  }
}

// Clear server-side httpOnly session cookie. Must be a server action.
export async function logoutUser() {
  try {
    (await cookies()).set("session", "", { expires: new Date(0), path: "/", httpOnly: true });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || "Logout failed" };
  }
}

// Read & clear the one-time OAuth handoff cookie set by /auth/callback/route.ts.
// Returns the user payload + JWT so the client page can persist them in
// localStorage (where AuthContext reads them). The httpOnly `session` cookie
// was already set by handleGoogleAuth during the route handler — we only need
// to mirror the values into client-readable storage.
export async function consumeOAuthHandoff(): Promise<{
  success: boolean;
  user?: { id: string; name: string; email: string; avatarUrl?: string; role?: string; city?: string };
  token?: string;
  error?: string;
}> {
  try {
    const jar = await cookies();
    const raw = jar.get("rasas_oauth_handoff")?.value;
    if (!raw) return { success: false, error: "No handoff data found." };

    // Clear the cookie regardless of outcome so it can't be replayed.
    jar.set("rasas_oauth_handoff", "", { expires: new Date(0), path: "/", httpOnly: true });

    const parsed = JSON.parse(raw) as { user: any; token?: string };
    if (!parsed?.user) return { success: false, error: "Invalid handoff data." };

    return { success: true, user: parsed.user, token: parsed.token };
  } catch (e: any) {
    return { success: false, error: e?.message || "Failed to read handoff" };
  }
}

// Register a new user with email (returns user data without redirect)
export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  city?: string;
}) {
  try {
    const fullName = data.fullName || `${data.firstName} ${data.lastName || ''}`.trim();
    
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        fullName,
        firstName: data.firstName,
        lastName: data.lastName || null,
        phone: data.phone || null,
        city: data.city || null,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || result.message || "Registration failed");
    }

    const { user, token } = result.data;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ 
       user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName }, 
       token,
       expires 
    });

    (await cookies()).set("session", session, { expires, httpOnly: true });

    return { success: true, user, token };
  } catch (error: any) {
    console.error("Register error:", error);
    return { success: false, error: error.message };
  }
}

// Login a user with email (returns user data without redirect, sets session cookie)
export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, error: result.error || result.message || "Invalid credentials" };
    }

    const { user, token } = result.data;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ 
       user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName }, 
       token,
       expires 
    });

    (await cookies()).set("session", session, { expires, httpOnly: true });

    return { success: true, user, token };
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
}

// Save user preferences (city, categories, interests) and update user profile
export async function saveUserPreferences(data: {
  city: string;
  categories: string[];
  interests: string[];
}) {
  const token = await getToken();
  
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const res = await fetch(`${API_URL}/auth/preferences`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to save preferences");
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Save preferences error:", error);
    return { success: false, error: error.message };
  }
}

// Update user profile
export async function updateUserProfile(data: {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  city?: string;
}) {
  const token = await getToken();
  
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update profile");
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message };
  }
}

// Handle Google OAuth callback - sync with backend
export async function handleGoogleAuth(accessToken: string, refreshToken: string) {
  try {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Google authentication failed");
    }

    const { user, token } = data.data;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ 
       user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName }, 
       token,
       expires 
    });

    (await cookies()).set("session", session, { expires, httpOnly: true });

    return { success: true, user, token }; // Return token as well
  } catch (error: any) {
    console.error("Google auth error:", error);
    return { success: false, error: error.message };
  }
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  if (!email || !password || !fullName) {
    throw new Error("Missing required fields");
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "Registration failed");
    }

    const { user, token } = data.data;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ 
       user: { id: user.id, email: user.email, role: user.role }, 
       token,
       expires 
    });

    (await cookies()).set("session", session, { expires, httpOnly: true });

  } catch (error: any) {
    console.error("Signup error:", error);
    throw new Error(error.message || "Action failed");
  }

  redirect("/dashboard");
}

export async function signin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "Invalid credentials");
    }

    const { user, token } = data.data;

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ 
        user: { id: user.id, email: user.email, role: user.role }, 
        token,
        expires 
    });

    (await cookies()).set("session", session, { expires, httpOnly: true });

  } catch (error: any) {
     console.error("Signin error:", error);
     throw new Error(error.message || "Login failed");
  }

  redirect("/dashboard");
}
