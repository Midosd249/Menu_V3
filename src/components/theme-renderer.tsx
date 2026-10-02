import { Suspense } from "react";
import { MenuNutritionOverlay } from "@/components/menu-nutrition-overlay";
import { GuestMenuAssistant } from "@/components/guest-menu-assistant";
import { getLazyThemeTemplate } from "@/components/theme-template-loader";
import { useLang } from "@/lib/lang";
import type { PublicMenu } from "@/lib/menu/types";
import type { ThemeKey } from "@/lib/theme";

type Props = {
  menu: PublicMenu;
  preview?: boolean;
};

export function ThemeRenderer({ menu, preview = false }: Props) {
  const { lang } = useLang();
  const theme = menu.tenant.themeKey as ThemeKey;
  const ThemeTemplate = getLazyThemeTemplate(theme);

  return (
    <>
      <Suspense fallback={<div className="menu-public-shell min-h-[50dvh]" aria-busy="true" />}>
        <ThemeTemplate menu={menu} preview={preview} />
      </Suspense>
      <MenuNutritionOverlay products={menu.products} lang={lang} />
      {!preview && <GuestMenuAssistant menu={menu} />}
    </>
  );
}
