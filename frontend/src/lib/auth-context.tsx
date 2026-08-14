"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch, getStoredUsername, getTokens, login as apiLogin, registerUser, logout as apiLogout } from "./api";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (fields: {
    username: string;
    password: string;
    bio?: string;
    avatar?: File | null;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const username = getStoredUsername();
    const tokens = getTokens();
    if (!username || !tokens) {
      setUser(null);
      return;
    }
    try {
      const fetched = await apiFetch<User>(`/users/${username}/`);
      setUser(fetched);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      await apiLogin(username, password);
      await refreshUser();
    },
    [refreshUser]
  );

  const register = useCallback(
    async (fields: {
      username: string;
      password: string;
      bio?: string;
      avatar?: File | null;
    }) => {
      await registerUser(fields);
      await refreshUser();
    },
    [refreshUser]
  );

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
