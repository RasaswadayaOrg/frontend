import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { encrypt } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const TAG = "[auth/callback]";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errCode = searchParams.get("error") || searchParams.get("error_code");
  const errDesc = searchParams.get("error_description");

  console.log(TAG, "hit", { hasCode: !!code, errCode, origin });

  const failure = (reason: string) => {
    console.error(TAG, "FAILURE:", reason);
    return NextResponse.redirect(
      `${origin}/auth?tab=signin&error=${encodeURIComponent(reason)}`
    );
  };

  if (errCode) return failure(errDesc || errCode);
  if (!code) return failure("No authorization code returned from Google.");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return failure("Supabase is not configured on the server.");
  }

  // Single response — every cookie gets attached to this; we rewrite Location
  // at the very end so the cookies persist across the redirect.
  const response = NextResponse.redirect(`${origin}/`);

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set({ name, value, ...options });
        });
      },
    },
  });

  // 1. PKCE exchange
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data?.session) {
    console.error(TAG, "exchangeCodeForSession failed:", error);
    return failure(error?.message || "Could not complete Google sign-in.");
  }
  console.log(TAG, "session OK, supabase uid:", data.session.user.id);

  // 2. Sync with our backend (inline fetch — no server action, to keep all
  //    cookie writes on this single response).
  let backendUser: any = null;
  let backendToken: string | null = null;
  try {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token || "",
      }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(TAG, "backend /auth/google not ok:", res.status, json);
      return failure(json?.message || `Backend error (${res.status})`);
    }
    backendUser = json?.data?.user;
    backendToken = json?.data?.token;
    if (!backendUser || !backendToken) {
      console.error(TAG, "backend response missing user/token:", json);
      return failure("Backend returned an incomplete response.");
    }
  } catch (e: any) {
    console.error(TAG, "backend fetch threw:", e);
    return failure(`Could not reach backend: ${e?.message || e}`);
  }
  console.log(TAG, "backend sync OK, user:", backendUser.email);

  // 3. Set the long-lived encrypted httpOnly session cookie (same shape that
  //    handleGoogleAuth used to write).
  try {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({
      user: {
        id: backendUser.id,
        email: backendUser.email,
        role: backendUser.role,
        fullName: backendUser.fullName,
      },
      token: backendToken,
      expires,
    });
    response.cookies.set("session", session, {
      expires,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  } catch (e: any) {
    console.error(TAG, "encrypt(session) failed:", e);
    return failure("Could not encode session.");
  }

  // 4. A short-lived, NON-httpOnly cookie that AuthContext reads on the next
  //    page load to populate localStorage. This avoids the handoff page
  //    entirely. Cleared by AuthContext after one read.
  const clientUser = {
    id: backendUser.id,
    name: backendUser.fullName || backendUser.email,
    email: backendUser.email,
    avatarUrl: backendUser.avatarUrl,
    role: backendUser.role,
    city: backendUser.city,
    supabaseUid: data.session.user.id,
    token: backendToken,
  };
  response.cookies.set("rasas_oauth_bootstrap", JSON.stringify(clientUser), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 120,
  });

  // 5. Decide where to land.
  const dest = backendUser.city ? "/" : "/auth/complete-profile";
  console.log(TAG, "redirecting to", dest);
  response.headers.set("location", `${origin}${dest}`);
  return response;
}
