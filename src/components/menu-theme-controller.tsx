import { useEffect } from "react";
import { DEFAULT_THEME_KEY, getTheme, isThemeKey, type ThemeKey } from "@/lib/theme";

function setThemeTokens(theme: ThemeKey) {
  const root = document.documentElement;
  const { tokens } = getTheme(theme);
  root.style.setProperty("--menu-background", tokens.colors.background);
  root.style.setProperty("--menu-foreground", tokens.colors.foreground);
  root.style.setProperty("--menu-surface", tokens.colors.surface);
  root.style.setProperty("--menu-surface-muted", tokens.colors.surfaceMuted);
  root.style.setProperty("--menu-border", tokens.colors.border);
  root.style.setProperty("--menu-primary", tokens.colors.primary);
  root.style.setProperty("--menu-primary-foreground", tokens.colors.primaryForeground);
  root.style.setProperty("--menu-accent", tokens.colors.accent);
  root.style.setProperty("--menu-accent-foreground", tokens.colors.accentForeground);
  root.style.setProperty("--menu-muted", tokens.colors.muted);
  root.style.setProperty("--menu-muted-foreground", tokens.colors.mutedForeground);
  root.style.setProperty("--menu-radius-sm", tokens.shape.radiusSm);
  root.style.setProperty("--menu-radius-md", tokens.shape.radiusMd);
  root.style.setProperty("--menu-radius-lg", tokens.shape.radiusLg);
  root.style.setProperty("--menu-radius-xl", tokens.shape.radiusXl);
  root.style.setProperty("--menu-shadow", tokens.effects.shadow);
  root.style.setProperty("--menu-shadow-hover", tokens.effects.shadowHover);
  root.style.setProperty("--menu-overlay", tokens.effects.overlay);
  root.style.setProperty("--menu-page-space", tokens.spacing.page);
  root.style.setProperty("--menu-section-space", tokens.spacing.section);
  root.style.setProperty("--menu-card-space", tokens.spacing.card);
  root.style.setProperty("--menu-gap", tokens.spacing.gap);
}

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
    setThemeTokens(key);
    return () => {
      delete document.documentElement.dataset.menuTheme;
      delete document.documentElement.dataset.menuThemeMode;
      for (const name of [
        "--menu-background", "--menu-foreground", "--menu-surface", "--menu-surface-muted", "--menu-border",
        "--menu-primary", "--menu-primary-foreground", "--menu-accent", "--menu-accent-foreground",
        "--menu-muted", "--menu-muted-foreground", "--menu-radius-sm", "--menu-radius-md", "--menu-radius-lg",
        "--menu-radius-xl", "--menu-shadow", "--menu-shadow-hover", "--menu-overlay", "--menu-page-space",
        "--menu-section-space", "--menu-card-space", "--menu-gap",
      ]) root.style.removeProperty(name);
    };
  }, [theme, preview]);

  return null;
}
