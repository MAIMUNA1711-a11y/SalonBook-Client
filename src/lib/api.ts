

import { authClient } from "./auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

let cached: { token: string; at: number } | null = null;
export const clearToken = () => (cached = null);

async function getToken(force = false): Promise<string | null> {
  if (!force && cached && Date.now() - cached.at < 5 * 60 * 1000) return cached.token;
  const res = await authClient.token();
  const token = res.data?.token ?? null;
  cached = token ? { token, at: Date.now() } : null;
  return token;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Opts = { method?: string; body?: unknown; auth?: boolean };

export async function api<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const { method = "GET", body, auth = true } = opts;

  const run = async (forceToken: boolean) => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) {
      const token = await getToken(forceToken);
      if (!token) throw new ApiError("Please sign in to continue", 401);
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let res: Response;
  try {
    res = await run(false);
    if (res.status === 401 && auth) res = await run(true); // token may have expired: retry once
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("Cannot reach the server. Please check your connection.", 0);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(json?.message || "Something went wrong", res.status);
  return (json?.data ?? json) as T;
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  let res: Response;
  try {
    res = await fetch(`${API_URL}/upload`, { method: "POST", body: form });
  } catch {
    throw new ApiError("Image upload failed. Check your connection.", 0);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(json?.message || "Image upload failed", res.status);
  return json.data.url as string;
}