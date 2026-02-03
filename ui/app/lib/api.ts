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

/** Query params for GET /api/deals/ (filter, search, pagination). */
export interface DealsListParams {
  page?: number;
  search?: string;
  status?: string;
  sector?: string;
  company?: string;
  stage?: string;
  category?: string;
  ordering?: string;
}

/** Build query string for deals list. Omits empty/undefined values. */
export function buildDealsQuery(params: DealsListParams): string {
  const q = new URLSearchParams();
  if (params.page != null && params.page > 0) q.set("page", String(params.page));
  if (params.search?.trim()) q.set("search", params.search.trim());
  if (params.status?.trim()) q.set("status", params.status.trim());
  if (params.sector?.trim()) q.set("sector", params.sector.trim());
  if (params.company?.trim()) q.set("company", params.company.trim());
  if (params.stage?.trim()) q.set("stage", params.stage.trim());
  if (params.category?.trim()) q.set("category", params.category.trim());
  if (params.ordering?.trim()) q.set("ordering", params.ordering.trim());
  const s = q.toString();
  return s ? `?${s}` : "";
}
