"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check for token in localStorage on mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Decode token to get userId (optional, depending on JWT payload)
      const decoded = JSON.parse(atob(storedToken.split(".")[1]));
      setUserId(decoded.id);
    }
  }, []);

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem("token", token);
    const decoded = JSON.parse(atob(token.split(".")[1]));
    setUserId(decoded.id);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};