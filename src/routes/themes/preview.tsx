import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MenuThemeController } from "@/components/menu-theme-controller";
import { PublicMenuView } from "@/components/public-menu";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { getPublicMenu } from "@/lib/menu/public";
import { isThemeKey, type ThemeKey } from "@/lib/theme";
import type { PublicMenu } from "@/lib/menu/types";

export const Route = createFileRoute("/themes/preview")({ component: ThemePreviewPage });

function ThemePreviewPage() {
  const [theme, setTheme] = useState<ThemeKey | undefined>();
  const [state, setState] = useState<
    { status: "loading" } | { status: "error"; message: string } | { status: "ok"; menu: PublicMenu }
  >({ status: "loading" });

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("theme")?.toLowerCase();
    setTheme(isThemeKey(value) ? value : undefined);
    getPublicMenu({ data: { slug: "nafas" } })
      .then((result) => {
        if (!result.ok) setState({ status: "error", message: result.error });
        else setState({ status: "ok", menu: result.data });
      })
      .catch((err: unknown) =>
        setState({ status: "error", message: err instanceof Error ? err.message : "تعذر تحميل المعاينة" }),
      );
  }, []);

  if (state.status === "loading") return <LoadingState />;
  if (state.status === "error") return <ErrorState message={state.message} />;

  return (
    <div className="menu-public-shell">
      <MenuThemeController theme={theme ?? state.menu.tenant.themeKey} preview />
      <PublicMenuView menu={state.menu} preview />
    </div>
  );
}
