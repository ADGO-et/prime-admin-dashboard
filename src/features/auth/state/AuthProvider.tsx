import { createContext, useState, useEffect, type ReactNode } from "react";
import { login as apiLogin, fetchMe } from "../api/auth-api";
import { getSession, logout as clearAuth } from "./session";
import type { AdminUser } from "../types/admin-user";

export interface AuthContextValue {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const u = await apiLogin(email, password);
    setUser(u);
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout: handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
