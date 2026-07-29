import { API_URL, parseJsonResponse } from "@/shared/api/api-base";
import { saveSession, clearSession, getToken } from "../state/session";
import type { AdminUser } from "../types/admin-user";

export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = (await parseJsonResponse(res)) as {
    error?: string;
    token?: string;
    user?: AdminUser;
  };

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }
  if (!data.token || !data.user) {
    throw new Error("Invalid login response from server");
  }

  saveSession(data.token, data.user);
  return data.user;
}

export async function fetchMe(): Promise<AdminUser | null> {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    clearSession();
    return null;
  }

  const data = (await parseJsonResponse(res)) as { user?: AdminUser };
  if (!data.user) return null;

  saveSession(token, data.user);
  return data.user;
}
