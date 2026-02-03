/**
 * Backend API base URL. Read from ui/.env as VITE_API_URL.
 * Copy ui/.env.example to ui/.env and set VITE_API_URL (e.g. http://localhost:8000 or http://172.17.0.1:8000 in Docker).
 */
export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
