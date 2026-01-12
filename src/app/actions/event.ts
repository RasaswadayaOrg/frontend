"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function createEvent(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== "ORGANIZER") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;
  const location = formData.get("location") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!title || !description || !dateStr || !location) {
    throw new Error("Missing required fields");
  }

  try {
    const eventData = {
        title,
        description,
        eventDate: dateStr,
        location,
        imageUrl,
        city: location.split(',')[0].trim(), 
        venue: location,
        startTime: "18:00", 
        endTime: "21:00",
        category: "General",
        ticketLink: "",
        price: 0,
        capacity: 100
    };
  
    const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}` 
        },
        body: JSON.stringify(eventData)
    });
  
    if (!response.ok) {
          const err = await response.json();
          console.error("Create event error:", err);
          throw new Error(err.message || "Failed to create event");
    }
  } catch(e: any) {
    console.error("Create event failed", e);
    throw new Error(e.message || "Failed to create event");
  }

  redirect("/dashboard/organizer");
}
