import { ArrowUpLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MenuThemeController } from "@/components/menu-theme-controller";
import { PublicMenuView } from "@/components/public-menu";
import { TasteTemplate } from "@/components/templates/taste";
import { ContemporaryRestaurantTemplate } from "@/components/templates/contemporary-restaurant";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { getPublicMenu } from "@/lib/menu/public";
import { getTheme, getThemeFamily, isThemeKey, type ThemeKey } from "@/lib/theme";
import type { PublicMenu } from "@/lib/menu/types";

export const Route = createFileRoute("/themes/preview")({ component: ThemePreviewPage });

function readPreviewTheme(): ThemeKey | undefined {
  if (typeof window === "undefined") return undefined;
  const value = new URLSearchParams(window.location.search).get("theme")?.toLowerCase();
  return isThemeKey(value) ? value : undefined;
}

function ThemePreviewPage() {
  const { lang } = useLang();
  const [theme, setTheme] = useState<ThemeKey | undefined>(() => readPreviewTheme());
  const [state, setState] = useState<{ status: "loading" } | { status: "error"; message: string } | { status: "ok"; menu: PublicMenu }>({ status: "loading" });
  useEffect(() => {
    setTheme(readPreviewTheme());
    getPublicMenu({ data: { slug: "nafas" } }).then((result) => {
      if (!result.ok) setState({ status: "error", message: result.error }); else setState({ status: "ok", menu: result.data });
    }).catch((err: unknown) => setState({ status: "error", message: err instanceof Error ? err.message : "تعذر تحميل المعاينة" }));
  }, []);
  if (state.status === "loading") return <LoadingState />;
  if (state.status === "error") return <ErrorState message={state.message} />;
  const effectiveTheme = theme ?? state.menu.tenant.themeKey;
  const definition = getTheme(effectiveTheme);
  const previewMenu = effectiveTheme === state.menu.tenant.themeKey ? state.menu : { ...state.menu, tenant: { ...state.menu.tenant, themeKey: effectiveTheme } };
  const ar = lang === "ar";
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[80] flex items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 py-3 text-ink shadow-sm backdrop-blur-md" dir={ar ? "rtl" : "ltr"}>
        <Link to="/themes" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm">← {ar ? "مقارنة التصاميم" : "Compare themes"}</Link>
        <div className="hidden text-center sm:block"><strong className="block text-sm">{ar ? definition.name.ar : definition.name.en}</strong><span className="text-[11px] text-muted">{ar ? definition.promise.ar : definition.promise.en}</span></div>
        <a href={`/?theme=${encodeURIComponent(effectiveTheme)}#request-service`} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-ink px-3 text-sm font-medium text-paper">{ar ? "استخدم هذا التصميم" : "Use this theme"}<ArrowUpLeft className="size-4" /></a>
      </div>
      <div className="pt-16"><MenuThemeController theme={effectiveTheme} preview />{effectiveTheme === "heritage" ? <TasteTemplate menu={previewMenu} preview /> : getThemeFamily(effectiveTheme) === "contemporary-restaurant" ? <ContemporaryRestaurantTemplate menu={previewMenu} preview /> : <PublicMenuView menu={previewMenu} preview />}</div>
    </>
  );
}
