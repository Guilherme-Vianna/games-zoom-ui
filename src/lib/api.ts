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

  const url = `${baseUrl()}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: opts.cache ?? "no-store",
      ...(opts.revalidate !== undefined ? { next: { revalidate: opts.revalidate } } : {}),
    });
  } catch (err) {
    console.error(`[api] ${method} ${url} — falha de rede`, err);
    throw new ApiError(
      `Nao consegui alcancar a API (${baseUrl()}). Verifique API_BASE_URL.`,
      0,
    );
  }

  const raw = await res.text();
  let data: unknown = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    console.error(
      `[api] ${method} ${url} -> ${res.status}`,
      raw.slice(0, 300).replace(/\s+/g, " "),
    );
    throw toApiError(res.status, data);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>("GET", path, undefined, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("POST", path, body, opts),
  del: <T>(path: string, opts?: RequestOptions) => request<T>("DELETE", path, undefined, opts),
};
