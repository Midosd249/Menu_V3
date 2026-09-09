import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const renderer = fs.readFileSync("src/components/theme-renderer.tsx", "utf8");
const preview = fs.readFileSync("src/routes/themes/preview.tsx", "utf8");
const registry = fs.readFileSync("src/lib/theme/registry.ts", "utf8");

const canonicalThemes = ["essential", "editorial", "noir", "heritage", "gallery"];

test("all five canonical themes remain registered", () => {
  for (const theme of canonicalThemes) assert.match(registry, new RegExp(`key: "${theme}"`));
});

test("public theme renderer covers every canonical family", () => {
  for (const marker of [
    "theme === \"heritage\"",
    "family === \"contemporary-restaurant\"",
    "family === \"bakery-dessert\"",
    "family === \"fine-dining-hospitality\"",
    "family === \"small-menu\"",
    "<PublicMenuView",
  ]) assert.match(renderer, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("theme preview uses the same canonical renderer", () => {
  assert.match(preview, /ThemeRenderer/);
  assert.doesNotMatch(preview, /getThemeFamily\(/);
  assert.doesNotMatch(preview, /ContemporaryRestaurantTemplate/);
  assert.doesNotMatch(preview, /TasteTemplate/);
  assert.doesNotMatch(preview, /PublicMenuView/);
});
