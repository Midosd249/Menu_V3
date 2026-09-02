import { useEffect } from "react";
import { DEFAULT_THEME_KEY, isThemeKey, type ThemeKey } from "@/lib/theme";

export function MenuThemeController({
  theme,
  preview = false,
}: {
  theme?: ThemeKey | null;
  preview?: boolean;
}) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const key = isThemeKey(theme) ? theme : DEFAULT_THEME_KEY;
    document.documentElement.dataset.menuTheme = key;
    document.documentElement.dataset.menuThemeMode = preview ? "preview" : "published";
    return () => {
      delete document.documentElement.dataset.menuTheme;
      delete document.documentElement.dataset.menuThemeMode;
    };
  }, [theme, preview]);

  return null;
}
