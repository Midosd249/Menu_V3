import assert from "node:assert/strict";
import test from "node:test";
import { canUseTheme, getTheme, getThemeFamily, isPremiumTheme, isThemeKey, MENU_THEMES, normalizeThemeKey } from "./registry.ts";
import { TEMPLATE_FAMILIES } from "./types.ts";

test("the catalog contains exactly five themes", () => {
  const families = new Set<string>(TEMPLATE_FAMILIES);
  assert.equal(MENU_THEMES.length, 5);
  assert.deepEqual(MENU_THEMES.map((theme) => theme.key), ["essential", "editorial", "noir", "heritage", "gallery"]);
  for (const theme of MENU_THEMES) {
    assert.ok(families.has(theme.family));
    assert.equal(getThemeFamily(theme.key), theme.family);
    assert.ok(theme.promise.ar.length > 0);
    assert.ok(theme.promise.en.length > 0);
  }
});

test("all five themes are free", () => {
  assert.equal(MENU_THEMES.filter((theme) => theme.tier === "free").length, 5);
  assert.equal(MENU_THEMES.filter((theme) => theme.tier === "premium").length, 0);
  for (const theme of MENU_THEMES) assert.equal(isPremiumTheme(theme.key), false);
});

test("legacy theme keys normalize to the new five-theme catalog", () => {
  assert.equal(normalizeThemeKey("minimal"), "essential");
  assert.equal(normalizeThemeKey("fast-casual"), "essential");
  assert.equal(normalizeThemeKey("coffee"), "gallery");
  assert.equal(normalizeThemeKey("dark-dining"), "noir");
  assert.equal(normalizeThemeKey("immersive"), "noir");
  assert.equal(normalizeThemeKey("unknown-theme"), null);
  assert.equal(isThemeKey("dark-dining"), true);
  assert.equal(getTheme("editorial").key, "editorial");
});

test("all themes are selectable on the free plan", () => {
  for (const theme of MENU_THEMES) {
    assert.equal(canUseTheme(theme.key, "free"), true);
    assert.equal(canUseTheme(theme.key, null), true);
  }
});
