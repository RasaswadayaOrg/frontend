import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await decrypt(sessionCookie);
    const token = session?.token;

    if (!token) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/v1/role-requests/my-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Get my applications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
