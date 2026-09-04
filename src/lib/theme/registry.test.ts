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

test("one theme is free and four themes are premium", () => {
  assert.equal(MENU_THEMES.filter((theme) => theme.tier === "free").length, 1);
  assert.equal(MENU_THEMES.filter((theme) => theme.tier === "premium").length, 4);
  assert.equal(isPremiumTheme("essential"), false);
  assert.equal(isPremiumTheme("editorial"), true);
  assert.equal(isPremiumTheme("noir"), true);
  assert.equal(isPremiumTheme("heritage"), true);
  assert.equal(isPremiumTheme("gallery"), true);
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

test("premium themes require a non-free plan while Essential remains available", () => {
  assert.equal(canUseTheme("essential", "free"), true);
  assert.equal(canUseTheme("editorial", "free"), false);
  assert.equal(canUseTheme("noir", "starter"), true);
  assert.equal(canUseTheme("heritage", "pro"), true);
  assert.equal(canUseTheme("gallery", null), false);
});
