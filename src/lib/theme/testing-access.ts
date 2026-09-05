import { canUseTheme } from "./registry.ts";
import type { ThemeKey } from "./types.ts";

export const THEME_TESTING_OVERRIDE_ENV = "MENU_THEME_TESTING_OVERRIDE";
export const THEME_TESTING_OVERRIDE_EXPIRES_ENV = "MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT";

export function isThemeTestingOverrideEnabled(
  env: Record<string, string | undefined> = process.env,
  now = Date.now(),
): boolean {
  if (env[THEME_TESTING_OVERRIDE_ENV]?.trim().toLowerCase() !== "true") return false;
  const expiry = Date.parse(env[THEME_TESTING_OVERRIDE_EXPIRES_ENV]?.trim() ?? "");
  return Number.isFinite(expiry) && expiry > now;
}

export function canUseThemeWithTestingOverride(
  themeKey: ThemeKey,
  planCode: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
  now = Date.now(),
): boolean {
  return isThemeTestingOverrideEnabled(env, now) || canUseTheme(themeKey, planCode);
}
