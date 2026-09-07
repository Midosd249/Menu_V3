import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const home = read("src/routes/index.tsx");
const themes = read("src/routes/themes/index.tsx");
const preview = read("src/routes/themes/preview.tsx");
const catalog = read("src/lib/menu/commercial-catalog.ts");
const registry = read("src/lib/theme/registry.ts");

const expectedPlans = ["free", "starter", "pro"];
const expectedThemes = ["essential", "editorial", "noir", "heritage", "gallery", "premium-menu-v3"];

test("homepage exposes canonical pricing and plan selection", () => {
  assert.match(home, /COMMERCIAL_PLANS\.map/);
  assert.match(home, /id="pricing"/);
  assert.match(home, /Choose this plan|اختيار هذه الباقة/);
  assert.match(home, /LeadForm selectedPlan/);
  assert.match(home, /Selected plan:/);
  for (const plan of expectedPlans) assert.match(catalog, new RegExp(`code: "${plan}"`));
  assert.match(catalog, /monthlyPriceSar: 0/);
  assert.match(catalog, /monthlyPriceSar: 99/);
  assert.match(catalog, /monthlyPriceSar: 199/);
});

test("homepage exposes all registered themes without changing the existing plan gate", () => {
  assert.match(home, /MENU_THEMES\.map/);
  assert.match(themes, /MENU_THEMES\.map/);
  assert.match(themes, /without an artificial gate|دون بوابة اصطناعية/);
  for (const theme of expectedThemes) assert.match(registry, new RegExp(`key: "${theme}"`));
});

test("theme preview remains connected to the real Menu V3 renderer", () => {
  assert.match(preview, /MenuThemeController/);
  assert.match(preview, /PublicMenuView/);
  assert.match(preview, /ContemporaryRestaurantTemplate/);
  assert.match(preview, /isThemeKey/);
  assert.match(preview, /getThemeFamily/);
  assert.doesNotMatch(preview, /theme-preview\.html/);
});

test("new-customer request flow remains on the existing lead contract", () => {
  assert.match(home, /submitLead\(/);
  assert.match(home, /businessName/);
  assert.match(home, /contactPhone/);
  assert.match(home, /New customer request|طلب عميل جديد/);
  assert.match(home, /referenceId/);
});
