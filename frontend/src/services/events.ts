import { Event } from "@/types";

export async function createEvent(eventData: Omit<Event, "_id">, token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create event");
    }

    return await response.json();
  } catch (err: any) {
    throw err;
  }
}

export async function getEvent(eventId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch event");
    }

    return await response.json();
  } catch (err: any) {
    throw err;
  }
}

export async function registerForEvent(eventId: string, token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/register`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to register for event");
    }

    return await response.json();
  } catch (err: any) {
    throw err;
  }
}

export async function updateEvent(
  eventId: string,
  eventData: Partial<Event>,
  token: string
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update event");
    }

    return await response.json();
  } catch (err: any) {
    throw err;
  }
}

export async function deleteEvent(eventId: string, token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete event");
    }

    return true;
  } catch (err: any) {
    throw err;
  }
}
