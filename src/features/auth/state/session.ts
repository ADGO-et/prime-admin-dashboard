import type { AdminUser } from "../types/admin-user";

const AUTH_TOKEN_KEY = "pc_admin_token";
const AUTH_USER_KEY = "pc_admin_user";

export function getToken(): string | null {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function getSession(): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: AdminUser) {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
}

export function logout() {
  clearSession();
}
