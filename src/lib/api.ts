import "server-only";
import { ApiError, toApiError } from "@/lib/api-error";

export { ApiError, toApiError };

function baseUrl(): string {
  const url = process.env.API_BASE_URL;
  if (!url) throw new Error("API_BASE_URL nao configurada");
  return url.replace(/\/$/, "");
}

type RequestOptions = {
  token?: string | null;
  cache?: RequestCache;
  revalidate?: number;
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: opts.cache ?? "no-store",
    ...(opts.revalidate !== undefined ? { next: { revalidate: opts.revalidate } } : {}),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw toApiError(res.status, data);
  return data as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>("GET", path, undefined, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("POST", path, body, opts),
  del: <T>(path: string, opts?: RequestOptions) => request<T>("DELETE", path, undefined, opts),
};
