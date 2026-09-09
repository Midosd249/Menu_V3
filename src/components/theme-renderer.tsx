import { PublicMenuView } from "@/components/public-menu";
import { TasteTemplate } from "@/components/templates/taste";
import { ContemporaryRestaurantTemplate } from "@/components/templates/contemporary-restaurant";
import { BakeryDessertTemplate } from "@/components/templates/bakery-dessert";
import { FineDiningHospitalityTemplate } from "@/components/templates/fine-dining-hospitality";
import { SmallMenuTemplate } from "@/components/templates/small-menu";
import { getThemeFamily } from "@/lib/theme";
import type { PublicMenu } from "@/lib/menu/types";
import type { ThemeKey } from "@/lib/theme";

type Props = {
  menu: PublicMenu;
  preview?: boolean;
};

/**
 * Canonical public theme renderer.
 *
 * Keep preview and published-menu theme selection on the same renderer map so
 * a theme can never look correct in production but fall back to another
 * presentation in the theme gallery.
 */
export function ThemeRenderer({ menu, preview = false }: Props) {
  const theme = menu.tenant.themeKey as ThemeKey;
  const family = getThemeFamily(theme);

  if (theme === "heritage") return <TasteTemplate menu={menu} preview={preview} />;
  if (family === "contemporary-restaurant") return <ContemporaryRestaurantTemplate menu={menu} preview={preview} />;
  if (family === "bakery-dessert") return <BakeryDessertTemplate menu={menu} />;
  if (family === "fine-dining-hospitality") return <FineDiningHospitalityTemplate menu={menu} preview={preview} />;
  if (family === "small-menu") return <SmallMenuTemplate menu={menu} preview={preview} />;

  return <PublicMenuView menu={menu} preview={preview} />;
}
