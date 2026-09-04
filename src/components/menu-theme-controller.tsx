import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { DEFAULT_THEME_KEY, getTheme, normalizeThemeKey, type ThemeKey } from "@/lib/theme";

function setThemeTokens(theme: ThemeKey) {
  const root = document.documentElement;
  const definition = getTheme(theme);
  const { tokens, layout, motion } = definition;
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
  root.style.setProperty("--menu-display-font", tokens.typography.displayFont);
  root.style.setProperty("--menu-body-font", tokens.typography.bodyFont);
  root.style.setProperty("--menu-heading-weight", String(tokens.typography.headingWeight));
  root.style.setProperty("--menu-body-weight", String(tokens.typography.bodyWeight));
  root.style.setProperty("--menu-line-height", tokens.typography.lineHeight);
  root.style.setProperty("--menu-letter-spacing", tokens.typography.letterSpacing);
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
  root.dataset.menuLayoutHeader = layout.header;
  root.dataset.menuLayoutGrid = layout.productGrid;
  root.dataset.menuLayoutCard = layout.productCard;
  root.dataset.menuLayoutNav = layout.categoryNav;
  root.dataset.menuMotion = motion;
}

function clearThemeTokens() {
  const root = document.documentElement;
  delete root.dataset.menuTheme;
  delete root.dataset.menuThemeMode;
  delete root.dataset.menuLayoutHeader;
  delete root.dataset.menuLayoutGrid;
  delete root.dataset.menuLayoutCard;
  delete root.dataset.menuLayoutNav;
  delete root.dataset.menuMotion;
  for (const name of [
    "--menu-background", "--menu-foreground", "--menu-surface", "--menu-surface-muted", "--menu-border",
    "--menu-primary", "--menu-primary-foreground", "--menu-accent", "--menu-accent-foreground",
    "--menu-muted", "--menu-muted-foreground", "--menu-display-font", "--menu-body-font",
    "--menu-heading-weight", "--menu-body-weight", "--menu-line-height", "--menu-letter-spacing",
    "--menu-radius-sm", "--menu-radius-md", "--menu-radius-lg", "--menu-radius-xl", "--menu-shadow",
    "--menu-shadow-hover", "--menu-overlay", "--menu-page-space", "--menu-section-space", "--menu-card-space", "--menu-gap",
  ]) root.style.removeProperty(name);
}

export function MenuThemeController({
  theme,
  preview = false,
}: {
  theme?: ThemeKey | null;
  preview?: boolean;
}) {
  const location = useRouterState({ select: (state) => `${state.location.pathname}${state.location.searchStr}` });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const pathname = new URL(location, window.location.origin).pathname;
    const isThemePreviewRoute = pathname === "/themes/preview" || pathname === "/studio/preview";

    // Preview routes own their theme controller. The root controller must not
    // briefly paint Essential before the requested preview theme is applied.
    if (isThemePreviewRoute) return;

    const key = normalizeThemeKey(theme) ?? DEFAULT_THEME_KEY;
    root.dataset.menuTheme = key;
    root.dataset.menuThemeMode = preview ? "preview" : "published";
    setThemeTokens(key);
    return clearThemeTokens;
  }, [theme, preview, location]);

  return null;
}
