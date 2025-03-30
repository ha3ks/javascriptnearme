import { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to login");
  }

  return response.json();
}

export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: "user" | "event_coordinator"
): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, firstName, lastName, role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to register");
  }

  return response.json();
}
