import { useEffect, useState } from "react";
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

/** Resolve the current session once and share the result between route guards. */
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

/**
 * Fast session state for route guards. A recently verified session is rendered
 * immediately while a background refresh keeps it fresh. Failed session checks
 * become a visible error instead of an infinite spinner.
 */
export function useCurrentUserState(): CurrentUserState {
  if (!authEnabled) return { user: DEV_USER, isPending: false, error: null };

  const initial = cachedSession?.user ?? null;
  const [state, setState] = useState<CurrentUserState>({
    user: initial,
    isPending: !cachedSession,
    error: null,
  });

  useEffect(() => {
    let alive = true;
    void refreshCurrentUser()
      .then((user) => {
        if (alive) setState({ user, isPending: false, error: null });
      })
      .catch((err: unknown) => {
        if (alive) {
          setState({
            user: cachedSession?.user ?? null,
            isPending: false,
            error: err instanceof Error ? err.message : "تعذر التحقق من الجلسة",
          });
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}
