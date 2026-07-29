import { getToken, clearSession } from "@/features/auth/state/session";
import { API_URL, parseJsonResponse } from "@/shared/api/api-base";

export async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options?.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearSession();
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please sign in again.");
  }

  if (!res.ok) {
    const err = (await parseJsonResponse(res).catch(() => ({
      error: res.statusText,
    }))) as { error?: string; message?: string };
    throw new Error(err.error || err.message || "Request failed");
  }

  return parseJsonResponse(res) as Promise<T>;
}

export async function httpBlob(path: string): Promise<Blob> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    clearSession();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!res.ok) throw new Error("Failed to load resource");
  return res.blob();
}
