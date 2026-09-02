import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PublicMenuView } from "@/components/public-menu";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { getPublicMenu } from "@/lib/menu/public";
import type { PublicMenu } from "@/lib/menu/types";

export const Route = createFileRoute("/m/$slug")({ component: PublicMenuPage });

const MENU_TIMEOUT_MS = 10_000;
const MENU_CACHE_PREFIX = "menu-v3:public:";

function readCachedMenu(key: string): PublicMenu | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(`${MENU_CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { menu?: PublicMenu; at?: number };
    if (!parsed.menu || !parsed.at || Date.now() - parsed.at > 5 * 60_000) return null;
    return parsed.menu;
  } catch {
    return null;
  }
}

function writeCachedMenu(key: string, menu: PublicMenu): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      `${MENU_CACHE_PREFIX}${key}`,
      JSON.stringify({ menu, at: Date.now() }),
    );
  } catch {
    /* Storage is an optional performance enhancement. */
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("استغرق تحميل المنيو وقتاً أطول من المتوقع.")), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function PublicMenuPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch() as { branch?: string };
  return <MenuLoader slug={slug} branch={search.branch} />;
}

export function MenuLoader({ slug, branch }: { slug: string; branch?: string }) {
  const cacheKey = `${slug}:${branch ?? "default"}`;
  const cached = readCachedMenu(cacheKey);
  const [state, setState] = useState<
    { status: "loading" } | { status: "error"; message: string; retry: () => void } | { status: "ok"; menu: PublicMenu }
  >(cached ? { status: "ok", menu: cached } : { status: "loading" });

  function load() {
    const instant = readCachedMenu(cacheKey);
    if (instant) setState({ status: "ok", menu: instant });
    else setState({ status: "loading" });

    withTimeout(getPublicMenu({ data: { slug, branch } }), MENU_TIMEOUT_MS)
      .then((result) => {
        if (!result.ok) {
          if (!instant) setState({ status: "error", message: result.error, retry: load });
          return;
        }
        writeCachedMenu(cacheKey, result.data);
        setState({ status: "ok", menu: result.data });
      })
      .catch((err: unknown) => {
        if (!instant) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "تعذر تحميل المنيو",
            retry: load,
          });
        }
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, branch]);

  if (state.status === "loading") return <LoadingState label="جارٍ تحميل المنيو…" />;
  if (state.status === "error") return <ErrorState message={state.message} onRetry={state.retry} />;
  return <PublicMenuView menu={state.menu} />;
}
