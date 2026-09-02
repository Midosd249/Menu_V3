import { useCallback, useEffect, useState } from "react";
import { authClient, authEnabled } from "./client";

export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  isDevFallback: boolean;
};

export const DEV_USER: AppUser = {
  id: "dev-user",
  displayName: "Dev User",
  primaryEmail: "dev@example.com",
  profileImageUrl: null,
  isDevFallback: true,
};

export type CurrentUserState = {
  user: AppUser | null;
  isPending: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const SESSION_TTL_MS = 15_000;
const SESSION_TIMEOUT_MS = 8_000;

let cachedSession: { user: AppUser | null; at: number } | null = null;
let sessionRequest: Promise<AppUser | null> | null = null;

function toAppUser(user: { id: string; name?: string | null; email?: string | null; image?: string | null }): AppUser {
  return {
    id: user.id,
    displayName: user.name ?? null,
    primaryEmail: user.email ?? null,
    profileImageUrl: user.image ?? null,
    isDevFallback: false,
  };
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("انتهت مهلة الاتصال. حاول مرة أخرى.")), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function refreshCurrentUser(force = false): Promise<AppUser | null> {
  if (!authEnabled) return DEV_USER;
  const now = Date.now();
  if (!force && cachedSession && now - cachedSession.at < SESSION_TTL_MS) return cachedSession.user;
  if (sessionRequest) return sessionRequest;

  sessionRequest = withTimeout(authClient.getSession(), SESSION_TIMEOUT_MS)
    .then((result) => {
      if (result.error) throw new Error(result.error.message || "تعذر التحقق من الجلسة");
      const user = result.data?.user ? toAppUser(result.data.user) : null;
      cachedSession = { user, at: Date.now() };
      return user;
    })
    .finally(() => {
      sessionRequest = null;
    });

  return sessionRequest;
}

export function useCurrentUserState(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>(() => ({
    user: authEnabled ? cachedSession?.user ?? null : DEV_USER,
    isPending: authEnabled && !cachedSession,
    error: null,
    refresh: async () => undefined,
  }));

  const refresh = useCallback(async () => {
    if (!authEnabled) {
      setState((prev) => ({ ...prev, user: DEV_USER, isPending: false, error: null }));
      return;
    }
    try {
      const user = await refreshCurrentUser(true);
      setState((prev) => ({ ...prev, user, isPending: false, error: null }));
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        user: cachedSession?.user ?? null,
        isPending: false,
        error: err instanceof Error ? err.message : "تعذر التحقق من الجلسة",
      }));
    }
  }, []);

  useEffect(() => {
    if (!authEnabled) return;
    let alive = true;
    void refreshCurrentUser()
      .then((user) => {
        if (alive) setState((prev) => ({ ...prev, user, isPending: false, error: null }));
      })
      .catch((err: unknown) => {
        if (alive) {
          setState((prev) => ({
            ...prev,
            user: cachedSession?.user ?? null,
            isPending: false,
            error: err instanceof Error ? err.message : "تعذر التحقق من الجلسة",
          }));
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  return { ...state, refresh };
}

export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}
