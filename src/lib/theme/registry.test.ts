import assert from "node:assert/strict";
import test from "node:test";
import { getTheme, getThemeFamily, isThemeKey, MENU_THEMES } from "./registry.ts";
import { TEMPLATE_FAMILIES } from "./types.ts";

test("all registered themes belong to a supported template family", () => {
  const families = new Set<string>(TEMPLATE_FAMILIES);

  assert.equal(MENU_THEMES.length, 8);
  for (const theme of MENU_THEMES) {
    assert.ok(families.has(theme.family));
    assert.equal(getThemeFamily(theme.key), theme.family);
  }
});

test("specialty cafe themes resolve to the dedicated family", () => {
  assert.equal(getThemeFamily("coffee"), "specialty-cafe");
});

test("theme resolution remains backward compatible", () => {
  assert.equal(isThemeKey("editorial"), true);
  assert.equal(isThemeKey("unknown-theme"), false);
  assert.equal(getTheme("editorial").key, "editorial");
});
