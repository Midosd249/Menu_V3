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
const expectedThemes = ["essential", "editorial", "noir", "heritage", "gallery"];

test("homepage exposes canonical pricing and direct self-serve signup", () => {
  assert.match(home, /COMMERCIAL_PLANS\.map/);
  assert.match(home, /id="pricing"/);
  assert.match(home, /mode: "signup"/);
  assert.match(home, /ابدأ مجانًا|Start free/);
  assert.doesNotMatch(home, /submitLead\(|selectedPlan|referenceId/);
  for (const plan of expectedPlans) assert.match(catalog, new RegExp(`code: "${plan}"`));
  assert.match(catalog, /monthlyPriceSar: 0/);
  assert.match(catalog, /monthlyPriceSar: 49/);
  assert.match(catalog, /monthlyPriceSar: 149/);
  assert.match(catalog, /annualPriceSar: 490/);
  assert.match(catalog, /annualPriceSar: 1490/);
});

test("homepage exposes all protected themes without a premium gate", () => {
  assert.match(home, /MENU_THEMES\.map/);
  assert.match(themes, /MENU_THEMES\.map/);
  assert.match(themes, /without an artificial gate|دون بوابة اصطناعية/);
  for (const theme of expectedThemes) assert.match(registry, new RegExp(`key: "${theme}"`));
});

test("theme preview remains connected to the canonical Menu V3 renderer", () => {
  assert.match(preview, /MenuThemeController/);
  assert.match(preview, /ThemeRenderer/);
  assert.match(preview, /getTheme/);
  assert.match(preview, /isThemeKey/);
  assert.doesNotMatch(preview, /theme-preview\.html/);
});

test("new-customer request flow is retired in favor of direct signup", () => {
  assert.doesNotMatch(home, /submitLead\(/);
  assert.doesNotMatch(home, /businessName|contactPhone|NEW CUSTOMER REQUEST|طلب عميل جديد/);
  assert.match(home, /mode: "signup"/);
});
