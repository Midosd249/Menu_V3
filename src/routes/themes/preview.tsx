import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MenuThemeController } from "@/components/menu-theme-controller";
import { PublicMenuView } from "@/components/public-menu";
import { ContemporaryRestaurantTemplate } from "@/components/templates/contemporary-restaurant";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { getPublicMenu } from "@/lib/menu/public";
import { getThemeFamily, isThemeKey, type ThemeKey } from "@/lib/theme";
import type { PublicMenu } from "@/lib/menu/types";

export const Route = createFileRoute("/themes/preview")({ component: ThemePreviewPage });

function readPreviewTheme(): ThemeKey | undefined {
  if (typeof window === "undefined") return undefined;
  const value = new URLSearchParams(window.location.search).get("theme")?.toLowerCase();
  return isThemeKey(value) ? value : undefined;
}

function ThemePreviewPage() {
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
  const previewMenu = effectiveTheme === state.menu.tenant.themeKey ? state.menu : { ...state.menu, tenant: { ...state.menu.tenant, themeKey: effectiveTheme } };
  return (
    <>
      <MenuThemeController theme={effectiveTheme} preview />
      {getThemeFamily(effectiveTheme) === "contemporary-restaurant" ? (
        <ContemporaryRestaurantTemplate menu={previewMenu} preview />
      ) : (
        <PublicMenuView menu={previewMenu} preview />
      )}
    </>
  );
}
