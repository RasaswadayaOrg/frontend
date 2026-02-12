import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get("session")?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const session = await decrypt(sessionCookie);
    const token = session?.token;

    if (!token) {
      return NextResponse.json(
        { error: "No token found in session" },
        { status: 401 }
      );
    }

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get token" },
      { status: 500 }
    );
  }
}
