
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getSessionKey() {
  const sessionSecret = process.env.SESSION_SECRET;

  if (!sessionSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set in production.");
    }

    return new TextEncoder().encode(["rasaswadaya", process.cwd(), process.env.NODE_ENV || "development"].join(":"));
  }

  return new TextEncoder().encode(sessionSecret);
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSessionKey());
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, getSessionKey(), {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: FormData) {
  // Verify credentials (this logic will be in the API route or Server Action)
  // This function is just for setting the cookie
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
