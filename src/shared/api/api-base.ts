/** In dev, use same-origin requests so Vite proxies /api to the backend. */
export const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "" : "https://dev-api.primecapitalsc.com");

export async function parseJsonResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

  const text = await res.text();
  if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
    throw new Error(
      "Backend API is unavailable or outdated. Start (or restart) prime-capital-backend on port 5000, then try again."
    );
  }

  throw new Error(text.slice(0, 200) || `Unexpected response (${res.status})`);
}
