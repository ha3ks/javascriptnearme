"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate it
    const token = localStorage.getItem("token");
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function validateToken(token: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (err) {
      console.error("Error validating token:", err);
      // In development, set mock user data
      if (process.env.NODE_ENV === "development") {
        setUser({
          _id: "mock-user-id",
          email: "dev@example.com",
          firstName: "Dev",
          lastName: "User",
          role: "event_coordinator",
        });
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function login(token: string) {
    localStorage.setItem("token", token);
    validateToken(token);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
