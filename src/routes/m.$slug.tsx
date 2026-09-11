import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MenuThemeController } from "@/components/menu-theme-controller";
import { GuestMenuAssistant } from "@/components/guest-menu-assistant";
import { PublicMenuView } from "@/components/public-menu";
import { TasteTemplate } from "@/components/templates/taste";
import { ContemporaryRestaurantTemplate } from "@/components/templates/contemporary-restaurant";
import { SpecialtyCafeTemplate } from "@/components/templates/specialty-cafe";
import { BakeryDessertTemplate } from "@/components/templates/bakery-dessert";
import { FastCasualTemplate } from "@/components/templates/fast-casual";
import { FineDiningHospitalityTemplate } from "@/components/templates/fine-dining-hospitality";
import { SmallMenuTemplate } from "@/components/templates/small-menu";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { getPublicMenu } from "@/lib/menu/public";
import { getNotFoundMenuSeo, getPublicMenuSeo, resolvePublicMenuLocale } from "@/lib/menu/seo";
import { getTheme, getThemeFamily, normalizeThemeKey } from "@/lib/theme";
import type { Lang, PublicMenu } from "@/lib/menu/types";
import type { ThemeKey } from "@/lib/theme";

const publicMenuSearchSchema = z.object({ branch: z.string().max(63).optional(), lang: z.enum(["ar", "en"]).optional(), theme: z.string().max(40).optional() });
type PublicMenuRouteData = { menu: PublicMenu; locale: Lang; localeAvailable: boolean; previewTheme?: ThemeKey };

export function createThemeBootstrapScript(theme: ThemeKey, preview = false): string {
  const colors = getTheme(theme).tokens.colors;
  return `(function(){try{var r=document.documentElement,c=${JSON.stringify(colors)};r.dataset.menuTheme=${JSON.stringify(theme)};r.dataset.menuThemeMode=${JSON.stringify(preview ? "preview" : "published")};r.style.setProperty("--menu-background",c.background);r.style.setProperty("--menu-foreground",c.foreground);r.style.setProperty("--menu-surface",c.surface);r.style.setProperty("--menu-surface-muted",c.surfaceMuted);r.style.setProperty("--menu-border",c.border);r.style.setProperty("--menu-primary",c.primary);r.style.setProperty("--menu-primary-foreground",c.primaryForeground);r.style.setProperty("--menu-accent",c.accent);r.style.setProperty("--menu-accent-foreground",c.accentForeground);r.style.setProperty("--menu-muted",c.muted);r.style.setProperty("--menu-muted-foreground",c.mutedForeground);r.style.colorScheme=${JSON.stringify(theme === "noir" ? "dark" : "light")};}catch(e){}})();`;
}

export const Route = createFileRoute("/m/$slug")({
  validateSearch: publicMenuSearchSchema,
  loaderDeps: ({ search }) => ({ branch: search.branch, lang: search.lang, theme: search.theme }),
  loader: async ({ params, deps }) => {
    const result = await getPublicMenu({ data: { slug: params.slug, branch: deps.branch } });
    if (!result.ok) return result;
    const requestedLocale = deps.lang ?? "ar";
    const locale = resolvePublicMenuLocale(result.data, requestedLocale);
    const previewTheme = deps.theme ? normalizeThemeKey(deps.theme) ?? undefined : undefined;
    return { ok: true as const, data: { menu: result.data, locale, localeAvailable: locale === requestedLocale, previewTheme } };
  },
  head: ({ loaderData, params }) => {
    const pathname = `/m/${encodeURIComponent(params.slug)}`;
    if (loaderData?.ok) {
      const { menu, locale, localeAvailable, previewTheme } = loaderData.data as PublicMenuRouteData;
      const seo = getPublicMenuSeo(menu, pathname, locale);
      const activeTheme = previewTheme ?? menu.tenant.themeKey;
      return { meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { name: "robots", content: previewTheme ? "noindex, nofollow" : localeAvailable ? "index, follow" : "noindex, follow" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "منيو" },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
        { property: "og:url", content: seo.canonical },
        { property: "og:locale", content: locale === "ar" ? "ar_SA" : "en_US" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(seo.image ? [{ property: "og:image", content: seo.image }, { name: "twitter:image", content: seo.image }] : []),
      ], links: [{ rel: "canonical", href: seo.canonical }, ...seo.alternates.map((alternate) => ({ rel: "alternate", hreflang: alternate.hreflang, href: alternate.href }))], scripts: [{ children: createThemeBootstrapScript(activeTheme, Boolean(previewTheme)) }, { type: "application/ld+json", children: JSON.stringify(seo.schema) }] };
    }
    const fallback = getNotFoundMenuSeo(pathname);
    return { meta: [{ title: "المنيو غير موجود" }, { name: "robots", content: fallback.robots }], links: [{ rel: "canonical", href: fallback.canonical }] };
  },
  component: PublicMenuPage,
});

const MENU_TIMEOUT_MS = 10_000;
const MENU_RETRY_LIMIT = 2;
const MENU_RETRY_DELAY_MS = 350;
const MENU_CACHE_PREFIX = "menu-v3:public:";
function readCachedMenu(key: string): PublicMenu | null { if (typeof window === "undefined") return null; try { const raw = window.sessionStorage.getItem(`${MENU_CACHE_PREFIX}${key}`); if (!raw) return null; const parsed = JSON.parse(raw) as { menu?: PublicMenu; at?: number }; if (!parsed.menu || !parsed.at || Date.now() - parsed.at > 5 * 60_000) return null; return parsed.menu; } catch { return null; } }
function writeCachedMenu(key: string, menu: PublicMenu): void { if (typeof window === "undefined") return; try { window.sessionStorage.setItem(`${MENU_CACHE_PREFIX}${key}`, JSON.stringify({ menu, at: Date.now() })); } catch { /* Optional cache. */ } }
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> { let timer: ReturnType<typeof setTimeout> | undefined; try { return await Promise.race([promise, new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error("menu-timeout")), ms); })]); } finally { if (timer) clearTimeout(timer); } }
function sleep(ms: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, ms)); }
function failureMessage(locale: Lang, kind: "timeout" | "unavailable" | "unknown"): string {
  if (locale === "en") {
    if (kind === "timeout") return "The menu is taking longer than expected. Please try again.";
    if (kind === "unavailable") return "The menu is temporarily unavailable. Please try again.";
    return "The menu could not be loaded. Please try again.";
  }
  if (kind === "timeout") return "استغرق تحميل المنيو وقتًا أطول من المتوقع. حاول مرة أخرى.";
  if (kind === "unavailable") return "المنيو غير متاحة مؤقتًا. حاول مرة أخرى.";
  return "تعذر تحميل المنيو. حاول مرة أخرى.";
}
async function loadMenuWithRetry(slug: string, branch: string | undefined, locale: Lang) {
  let lastKind: "timeout" | "unavailable" | "unknown" = "unknown";
  for (let attempt = 1; attempt <= MENU_RETRY_LIMIT; attempt += 1) {
    try {
      const result = await withTimeout(getPublicMenu({ data: { slug, branch } }), MENU_TIMEOUT_MS);
      if (result.ok) return result;
      if (result.code === "not_found" || result.code === "invalid") return result;
      lastKind = "unavailable";
    } catch (error) {
      lastKind = error instanceof Error && error.message === "menu-timeout" ? "timeout" : "unknown";
    }
    if (attempt < MENU_RETRY_LIMIT) await sleep(MENU_RETRY_DELAY_MS * attempt);
  }
  return { ok: false as const, code: "unavailable" as const, error: failureMessage(locale, lastKind) };
}
function PublicMenuPage() { const { slug } = Route.useParams(); const { branch, lang, theme } = Route.useSearch(); const loaderData = Route.useLoaderData(); const menuData = loaderData?.ok ? loaderData.data as PublicMenuRouteData : undefined; return <MenuLoader slug={slug} branch={branch} locale={menuData?.locale ?? lang ?? "ar"} initialMenu={menuData?.menu} previewTheme={menuData?.previewTheme ?? (theme ? normalizeThemeKey(theme) ?? undefined : undefined)} />; }
export function MenuLoader({ slug, branch, locale, initialMenu, previewTheme }: { slug: string; branch?: string; locale: Lang; initialMenu?: PublicMenu; previewTheme?: ThemeKey }) {
  const cacheKey = `${slug}:${branch ?? "default"}`; const cached = readCachedMenu(cacheKey); const [state, setState] = useState<{ status: "loading" } | { status: "error"; message: string; retry: () => void } | { status: "ok"; menu: PublicMenu }>(initialMenu ? { status: "ok", menu: initialMenu } : cached ? { status: "ok", menu: cached } : { status: "loading" }); const { setLang } = useLang();
  useEffect(() => { setLang(locale); }, [locale, setLang]);
  function load() { const instant = readCachedMenu(cacheKey); if (instant) setState({ status: "ok", menu: instant }); else setState((previous) => previous.status === "ok" ? previous : { status: "loading" }); loadMenuWithRetry(slug, branch, locale).then((result) => { if (!result.ok) { if (!instant) setState({ status: "error", message: result.error, retry: load }); return; } writeCachedMenu(cacheKey, result.data); setState({ status: "ok", menu: result.data }); }).catch(() => { if (!instant) setState({ status: "error", message: failureMessage(locale, "unknown"), retry: load }); }); }
  useEffect(() => {
    if (initialMenu) { writeCachedMenu(cacheKey, initialMenu); return; }
    load(); // eslint-disable-line react-hooks/exhaustive-deps
  }, [slug, branch, initialMenu, locale]);
  if (state.status === "loading") return <LoadingState label={locale === "en" ? "Loading menu…" : "جارٍ تحميل المنيو…"} />;
  if (state.status === "error") return <ErrorState message={state.message} onRetry={state.retry} />;
  const activeTheme = previewTheme ?? state.menu.tenant.themeKey;
  const family = getThemeFamily(activeTheme);
  const themedMenu = { ...state.menu, tenant: { ...state.menu.tenant, themeKey: activeTheme } };
  return <><MenuThemeController theme={activeTheme} preview={Boolean(previewTheme)} />{activeTheme === "heritage" ? <TasteTemplate menu={themedMenu} preview={Boolean(previewTheme)} /> : family === "specialty-cafe" ? <SpecialtyCafeTemplate menu={themedMenu} /> : family === "bakery-dessert" ? <BakeryDessertTemplate menu={themedMenu} /> : family === "fast-casual" ? <FastCasualTemplate menu={themedMenu} /> : family === "fine-dining-hospitality" ? <FineDiningHospitalityTemplate menu={themedMenu} /> : family === "small-menu" ? <SmallMenuTemplate menu={themedMenu} /> : family === "contemporary-restaurant" ? <ContemporaryRestaurantTemplate menu={themedMenu} /> : <PublicMenuView menu={themedMenu} preview={Boolean(previewTheme)} />}{!previewTheme && <GuestMenuAssistant menu={themedMenu} />}</>;
}
