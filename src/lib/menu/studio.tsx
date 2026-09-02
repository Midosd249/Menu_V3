import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { refreshCurrentUser, useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyStudio } from "./owner";
import type { FnErr, FnResult, StudioSnapshot } from "./types";
import { LoadingState, ErrorState } from "@/components/state-panel";

type StudioCtx = {
  snapshot: StudioSnapshot;
  reload: () => Promise<void>;
  setSnapshot: (next: StudioSnapshot) => void;
};

const Ctx = createContext<StudioCtx | null>(null);

export function useStudio() {
  const value = useContext(Ctx);
  if (!value) throw new Error("Studio context missing");
  return value;
}

export function useStudioFlash() {
  const { setSnapshot } = useStudio();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const run = useCallback(
    async (fn: () => Promise<FnResult<StudioSnapshot>>): Promise<boolean> => {
      setBusy(true);
      setError("");
      setOk(false);
      try {
        const result = await fn();
        if (!result.ok) {
          setError(result.error);
          return false;
        }
        setSnapshot(result.data);
        setOk(true);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "تعذر الحفظ");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [setSnapshot],
  );

  return { busy, error, ok, setError, setOk, run };
}

export function StudioGate({ children }: { children: ReactNode }) {
  const { user, isPending, error: sessionError } = useCurrentUserState();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; error: FnErr }
    | { status: "empty" }
    | { status: "ok"; snapshot: StudioSnapshot }
  >({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const result = await getMyStudio();
      if (!result.ok) {
        setState({ status: "error", error: result });
        return;
      }
      if (!("tenant" in result.data) || result.data.tenant == null) {
        setState({ status: "empty" });
        return;
      }
      setState({ status: "ok", snapshot: result.data as StudioSnapshot });
    } catch (err) {
      setState({
        status: "error",
        error: {
          ok: false,
          code: "unavailable",
          error: err instanceof Error ? err.message : "تعذر تحميل الاستوديو",
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void load();
  }, [user, load]);

  if (isPending) return <LoadingState label="جارٍ التحقق من الجلسة…" />;
  if (sessionError && !user) {
    return <ErrorState message={sessionError} onRetry={() => void refreshCurrentUser(true)} />;
  }
  if (!user) return <RedirectToSignIn />;
  if (state.status === "loading") return <LoadingState label="جارٍ تحميل لوحة الإدارة…" />;
  if (state.status === "error") {
    return <ErrorState message={state.error.error} onRetry={() => void load()} />;
  }
  if (state.status === "empty") {
    if (path.startsWith("/onboarding")) return <>{children}</>;
    return <Navigate to="/onboarding" />;
  }
  return (
    <Ctx.Provider
      value={{
        snapshot: state.snapshot,
        reload: load,
        setSnapshot: (next) => setState({ status: "ok", snapshot: next }),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
