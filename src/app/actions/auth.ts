"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
      throw new Error(result.message || "Registration failed");
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
      throw new Error(data.message || "Registration failed");
    }

    const { user, token } = data;
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
      throw new Error(data.message || "Invalid credentials");
    }

    const { user, token } = data;

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
