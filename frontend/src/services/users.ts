import { User } from "@/types";

export async function getUserProfile(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user profile");
    }

    return await response.json();
  } catch (err: any) {
    if (process.env.NODE_ENV === "development") {
      return {
        _id: "mock-user-id",
        email: "dev@example.com",
        firstName: "Dev",
        lastName: "User",
        role: "event_coordinator",
        eventsCoordinating: [
          {
            _id: "mock-event-1",
            title: "React Workshop",
            date: new Date().toISOString(),
            status: "published",
          },
        ],
        eventsAttending: [
          {
            _id: "mock-event-2",
            title: "TypeScript Fundamentals",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "published",
          },
        ],
      };
    }
    throw err;
  }
}

export async function updateUserProfile(token: string, userData: Partial<User>) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user profile");
    }

    return await response.json();
  } catch (err: any) {
    throw err;
  }
}
