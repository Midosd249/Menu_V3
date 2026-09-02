export * from "./types";
export * from "./registry";

import { DEFAULT_THEME_KEY, getTheme, isThemeKey, type ThemeKey } from "./registry";

export type ThemeResolution = {
  key: ThemeKey;
  source: "preview" | "saved" | "default";
};

export function resolveTheme(options: {
  previewTheme?: unknown;
  savedTheme?: unknown;
  allowPreview?: boolean;
}): ThemeResolution {
  if (options.allowPreview && isThemeKey(options.previewTheme)) {
    return { key: options.previewTheme, source: "preview" };
  }
  if (isThemeKey(options.savedTheme)) {
    return { key: options.savedTheme, source: "saved" };
  }
  return { key: DEFAULT_THEME_KEY, source: "default" };
}

export function resolveThemeDefinition(options: Parameters<typeof resolveTheme>[0]) {
  return getTheme(resolveTheme(options).key);
}
