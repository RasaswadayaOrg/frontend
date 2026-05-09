import { NextResponse } from "next/server";
import { getArtists, getEvents, getAcademies, getProducts } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json({ artists: [], events: [], academies: [], products: [] });
  }

  const [artists, events, academies, products] = await Promise.all([
    getArtists(4, 1, q, "").catch(() => []),
    getEvents(4, 1, undefined, q, "").catch(() => []),
    getAcademies(4, 1, q, "").catch(() => []),
    getProducts(4, 1, q, "").catch(() => []),
  ]);

  // Trim to only fields the UI needs
  const slim = (arr: any[], fields: string[]) =>
    (arr || []).map((item: any) => {
      const o: Record<string, any> = {};
      fields.forEach((f) => { o[f] = item[f] ?? null; });
      return o;
    });

  return NextResponse.json({
    artists:   slim(artists,   ["id", "name", "profession", "genre", "photoUrl"]),
    events:    slim(events,    ["id", "title", "category", "imageUrl", "eventDate", "location"]),
    academies: slim(academies, ["id", "name", "type", "imageUrl", "location"]),
    products:  slim(products,  ["id", "name", "category", "imageUrl", "price"]),
  });
}
