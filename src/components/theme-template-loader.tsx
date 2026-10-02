import { lazy, type ComponentType } from "react";
import type { PublicMenu } from "@/lib/menu/types";
import type { ThemeKey } from "@/lib/theme";

export type ThemeTemplateProps = {
  menu: PublicMenu;
  preview?: boolean;
};

const TasteTemplate = lazy(() =>
  import("@/components/templates/taste").then(({ TasteTemplate }) => ({ default: TasteTemplate })),
);
const SignalTableTemplate = lazy(() =>
  import("@/components/templates/signal-table").then(({ SignalTableTemplate }) => ({ default: SignalTableTemplate })),
);
const BakeryDessertTemplate = lazy(() =>
  import("@/components/templates/bakery-dessert").then(({ BakeryDessertTemplate }) => ({
    default: ({ menu }: ThemeTemplateProps) => <BakeryDessertTemplate menu={menu} />,
  })),
);
const FineDiningHospitalityTemplate = lazy(() =>
  import("@/components/templates/fine-dining-hospitality").then(({ FineDiningHospitalityTemplate }) => ({
    default: FineDiningHospitalityTemplate,
  })),
);
const SmallMenuTemplate = lazy(() =>
  import("@/components/templates/small-menu").then(({ SmallMenuTemplate }) => ({ default: SmallMenuTemplate })),
);

const THEME_TEMPLATES: Record<ThemeKey, ComponentType<ThemeTemplateProps>> = {
  essential: SmallMenuTemplate,
  editorial: SignalTableTemplate,
  noir: FineDiningHospitalityTemplate,
  heritage: TasteTemplate,
  gallery: BakeryDessertTemplate,
};

export function getLazyThemeTemplate(theme: ThemeKey): ComponentType<ThemeTemplateProps> {
  return THEME_TEMPLATES[theme];
}
