"use server";

import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function createEvent(data: {
  title: string;
  description: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  location: string;
  venue: string;
  city: string;
  category: string;
  capacity?: number;
  ticketLink?: string;
  imageUrl?: string;
  artistIds?: string[];
}) {
  const session = await getSession();
  if (!session?.token) {
    throw new Error("Unauthorized — please log in");
  }

  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      eventDate: new Date(data.eventDate).toISOString(),
      startTime: data.startTime || null,
      endTime: data.endTime || null,
      location: data.location,
      venue: data.venue,
      city: data.city,
      category: data.category,
      capacity: data.capacity || null,
      ticketLink: data.ticketLink || null,
      imageUrl: data.imageUrl || null,
      artistIds: data.artistIds || [],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("Create event error:", err);
    throw new Error(err.message || "Failed to create event");
  }

  const result = await response.json();

  revalidatePath("/organizer-dashboard/events");
  revalidatePath("/events");

  return { success: true, data: result.data };
}

export async function getOrganizerEvents() {
  const session = await getSession();
  if (!session?.token) {
    return { success: false, data: [], error: "Unauthorized" };
  }

  try {
    const response = await fetch(`${API_URL}/events/organizer/me`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, data: [], error: "Failed to fetch events" };
    }

    const result = await response.json();

    return { success: true, data: result.data || [] };
  } catch (error: any) {
    console.error("Fetch organizer events error:", error);
    return { success: false, data: [], error: error.message };
  }
}

export async function deleteEvent(eventId: string) {
  const session = await getSession();
  if (!session?.token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete event");
  }

  revalidatePath("/organizer-dashboard/events");
  revalidatePath("/events");

  return { success: true };
}

export async function getArtistsForTagging(search?: string) {
  try {
    const params = new URLSearchParams({ limit: "50" });
    if (search) params.set("search", search);

    const response = await fetch(`${API_URL}/artists?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, data: [] };
    }

    const result = await response.json();
    return { success: true, data: result.data || [] };
  } catch (error: any) {
    console.error("Fetch artists for tagging error:", error);
    return { success: false, data: [] };
  }
}
