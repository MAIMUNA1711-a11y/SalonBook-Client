"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useFetch<T>(path: string | null, opts: { auth?: boolean } = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!path);
  const auth = opts.auth ?? true;

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true); setError(null);
    try { setData(await api<T>(path, { auth })); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  }, [path, auth]);

  useEffect(() => { load(); }, [load]);
  return { data, error, loading, reload: load, setData };
}
