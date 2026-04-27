"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: "customer" | "provider" | "admin";
  city?: string;
  photo?: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.verifyOTP(phone, otp);
      if (response.access_token && response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.access_token);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Login failed:", error);
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}