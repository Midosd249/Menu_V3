import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MenuThemeController } from "@/components/menu-theme-controller";
import { PublicMenuView } from "@/components/public-menu";
import { ContemporaryRestaurantTemplate } from "@/components/templates/contemporary-restaurant";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { getPublicMenu } from "@/lib/menu/public";
import { getPublicMenuSeo, resolvePublicMenuLocale } from "@/lib/menu/seo";
import { getThemeFamily } from "@/lib/theme";
import type { Lang, PublicMenu } from "@/lib/menu/types";

const publicMenuSearchSchema = z.object({
  branch: z.string().max(63).optional(),
  lang: z.enum(["ar", "en"]).optional(),
});

type PublicMenuRouteData = {
  menu: PublicMenu;
  locale: Lang;
  localeAvailable: boolean;
};

export const Route = createFileRoute("/m/$slug")({
  validateSearch: publicMenuSearchSchema,
  loaderDeps: ({ search }) => ({ branch: search.branch, lang: search.lang }),
  loader: async ({ params, deps }) => {
    const result = await getPublicMenu({ data: { slug: params.slug, branch: deps.branch } });
    if (!result.ok) return result;
    const requestedLocale = deps.lang ?? "ar";
    const locale = resolvePublicMenuLocale(result.data, requestedLocale);
    return {
      ok: true as const,
      data: {
        menu: result.data,
        locale,
        localeAvailable: locale === requestedLocale,
      },
    };
  },
  head: ({ loaderData, params, matches }) => {
    const pathname = `/m/${encodeURIComponent(params.slug)}`;
    const hasBranchChild = matches.some((match) => String(match.routeId) === "/m/$slug/$branch");
    if (loaderData?.ok) {
      const { menu, locale, localeAvailable } = loaderData.data as PublicMenuRouteData;
      const seo = getPublicMenuSeo(menu, pathname, locale);
      return {
        meta: [
          { title: seo.title },
          { name: "description", content: seo.description },
          { name: "robots", content: localeAvailable ? "index, follow" : "noindex, follow" },
          { property: "og:type", content: "website" },
          { property: "og:title", content: seo.title },
          { property: "og:description", content: seo.description },
          { property: "og:locale", content: locale === "ar" ? "ar_SA" : "en_US" },
          ...(seo.image ? [{ property: "og:image", content: seo.image }] : []),
        ],
        links: hasBranchChild
          ? []
          : [
              { rel: "canonical", href: seo.canonical },
              ...seo.alternates.map((alternate) => ({ rel: "alternate", hreflang: alternate.hreflang, href: alternate.href })),
            ],
        scripts: hasBranchChild ? [] : [{ type: "application/ld+json", children: JSON.stringify(seo.schema) }],
      };
    }
    return {
      meta: [{ title: "المنيو غير موجود" }, { name: "robots", content: "noindex, nofollow" }],
      links: hasBranchChild ? [] : [{ rel: "canonical", href: pathname }],
    };
  },
  component: PublicMenuPage,
});

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
  } catch { return null; }
}

function writeCachedMenu(key: string, menu: PublicMenu): void {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(`${MENU_CACHE_PREFIX}${key}`, JSON.stringify({ menu, at: Date.now() })); } catch { /* Optional cache. */ }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error("استغرق تحميل المنيو وقتاً أطول من المتوقع.")), ms); })]);
  } finally { if (timer) clearTimeout(timer); }
}

function PublicMenuPage() {
  const { slug } = Route.useParams();
  const { branch, lang } = Route.useSearch();
  const loaderData = Route.useLoaderData();
  const menuData = loaderData?.ok ? loaderData.data as PublicMenuRouteData : undefined;
  return <MenuLoader slug={slug} branch={branch} locale={menuData?.locale ?? lang ?? "ar"} initialMenu={menuData?.menu} />;
}

export function MenuLoader({ slug, branch, locale, initialMenu }: { slug: string; branch?: string; locale: Lang; initialMenu?: PublicMenu }) {
  const cacheKey = `${slug}:${branch ?? "default"}`;
  const cached = readCachedMenu(cacheKey);
  const [state, setState] = useState<{ status: "loading" } | { status: "error"; message: string; retry: () => void } | { status: "ok"; menu: PublicMenu }>(initialMenu ? { status: "ok", menu: initialMenu } : cached ? { status: "ok", menu: cached } : { status: "loading" });

  useEffect(() => {
    const stored = window.localStorage.getItem("menu-lang");
    if (stored !== locale) {
      try { window.localStorage.setItem("menu-lang", locale); } catch { /* ignore */ }
    }
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  function load() {
    const instant = readCachedMenu(cacheKey);
    if (instant) setState({ status: "ok", menu: instant });
    else setState((previous) => previous.status === "ok" ? previous : { status: "loading" });
    withTimeout(getPublicMenu({ data: { slug, branch } }), MENU_TIMEOUT_MS).then((result) => {
      if (!result.ok) { if (!instant) setState({ status: "error", message: result.error, retry: load }); return; }
      writeCachedMenu(cacheKey, result.data); setState({ status: "ok", menu: result.data });
    }).catch((err: unknown) => { if (!instant) setState({ status: "error", message: err instanceof Error ? err.message : "تعذر تحميل المنيو", retry: load }); });
  }

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, branch]);

  if (state.status === "loading") return <LoadingState label="جارٍ تحميل المنيو…" />;
  if (state.status === "error") return <ErrorState message={state.message} onRetry={state.retry} />;
  const family = getThemeFamily(state.menu.tenant.themeKey);
  return <div className="menu-public-shell"><MenuThemeController theme={state.menu.tenant.themeKey} />{family === "contemporary-restaurant" ? <ContemporaryRestaurantTemplate menu={state.menu} /> : <PublicMenuView menu={state.menu} />}</div>;
}
