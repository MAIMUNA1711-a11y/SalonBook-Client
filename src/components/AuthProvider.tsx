"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { api, clearToken } from "@/lib/api";
import type { Me } from "@/lib/types";

interface Ctx {
  user: Me | null;     // profile from our API (role, isBlocked, phone)
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}
const AuthCtx = createContext<Ctx>({ user: null, loading: true, refresh: async () => {}, logout: async () => {} });
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [user, setUser] = useState<Me | null>(null);
  // which session user id the `user` state belongs to (undefined = nothing loaded yet)
  const [loadedFor, setLoadedFor] = useState<string | null | undefined>(undefined);
  const [reloadKey, setReloadKey] = useState(0);
  const sessionUserId = session?.user?.id ?? null;

  useEffect(() => {
    if (isPending) return;
    let cancelled = false;
    (async () => {
      if (!sessionUserId) {
        if (!cancelled) { setUser(null); setLoadedFor(null); }
        return;
      }
      clearToken();
      try {
        const me = await api<Me>("/users/me");
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      }
      if (!cancelled) setLoadedFor(sessionUserId);
    })();
    return () => { cancelled = true; };
  }, [isPending, sessionUserId, reloadKey]);

  const refresh = useCallback(async () => {
    await refetch();
    setReloadKey((k) => k + 1);
  }, [refetch]);

  const logout = useCallback(async () => {
    clearToken();
    await authClient.signOut();
    setUser(null);
  }, []);

  // Stay in "loading" until our profile matches the current session.
  // This prevents redirecting to Sign In before /users/me has finished.
  const loading = isPending || loadedFor !== sessionUserId;

  return <AuthCtx.Provider value={{ user, loading, refresh, logout }}>{children}</AuthCtx.Provider>;
}