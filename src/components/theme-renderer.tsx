import { PublicMenuView } from "@/components/public-menu";
import { GuestMenuAssistant } from "@/components/guest-menu-assistant";
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

  let content;
  if (theme === "heritage") content = <TasteTemplate menu={menu} preview={preview} />;
  else if (family === "contemporary-restaurant") content = <ContemporaryRestaurantTemplate menu={menu} preview={preview} />;
  else if (family === "bakery-dessert") content = <BakeryDessertTemplate menu={menu} />;
  else if (family === "fine-dining-hospitality") content = <FineDiningHospitalityTemplate menu={menu} preview={preview} />;
  else if (family === "small-menu") content = <SmallMenuTemplate menu={menu} preview={preview} />;
  else content = <PublicMenuView menu={menu} preview={preview} />;

  return (
    <>
      {content}
      {!preview && <GuestMenuAssistant menu={menu} />}
    </>
  );
}
