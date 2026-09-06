export * from "./types.ts";
export * from "./registry.ts";

import { DEFAULT_THEME_KEY, getTheme, normalizeThemeKey } from "./registry.ts";
import type { ThemeKey } from "./types.ts";

export type ThemeResolution = {
  key: ThemeKey;
  source: "preview" | "saved" | "default";
};

export function resolveTheme(options: {
  previewTheme?: unknown;
  savedTheme?: unknown;
  allowPreview?: boolean;
}): ThemeResolution {
  const preview = normalizeThemeKey(options.previewTheme);
  const saved = normalizeThemeKey(options.savedTheme);
  if (options.allowPreview && preview) return { key: preview, source: "preview" };
  if (saved) return { key: saved, source: "saved" };
  return { key: DEFAULT_THEME_KEY, source: "default" };
}

export function resolveThemeDefinition(options: Parameters<typeof resolveTheme>[0]) {
  return getTheme(resolveTheme(options).key);
}
