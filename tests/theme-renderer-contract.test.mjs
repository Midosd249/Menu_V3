import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const renderer = fs.readFileSync("src/components/theme-renderer.tsx", "utf8");
const loader = fs.readFileSync("src/components/theme-template-loader.tsx", "utf8");
const preview = fs.readFileSync("src/routes/themes/preview.tsx", "utf8");
const registry = fs.readFileSync("src/lib/theme/registry.ts", "utf8");

const canonicalThemes = ["essential", "editorial", "noir", "heritage", "gallery"];

test("all five canonical themes remain registered", () => {
  for (const theme of canonicalThemes) assert.match(registry, new RegExp(`key: "${theme}"`));
});

test("public theme renderer lazy-loads theme implementations", () => {
  for (const theme of ["taste", "signal-table", "bakery-dessert", "fine-dining-hospitality", "small-menu"]) {
    assert.match(loader, new RegExp(`import\\(["']@/components/templates/${theme}["']\\)`));
  }
  assert.doesNotMatch(renderer, /from ["']@\/components\/templates\//);
  assert.match(loader, /lazy\(/);
  assert.match(renderer, /Suspense/);
});

test("public route does not statically import theme implementations", () => {
  const route = fs.readFileSync("src/routes/m.$slug.tsx", "utf8");
  assert.doesNotMatch(route, /from ["']@\/components\/templates\//);
  assert.match(route, /getLazyThemeTemplate/);
});

test("canonical themes map to the intended lazy templates", () => {
  const loader = fs.readFileSync("src/components/theme-template-loader.tsx", "utf8");
  for (const [theme, template] of [
    ["essential", "SmallMenuTemplate"],
    ["editorial", "SignalTableTemplate"],
    ["noir", "FineDiningHospitalityTemplate"],
    ["heritage", "TasteTemplate"],
    ["gallery", "BakeryDessertTemplate"],
  ]) {
    assert.match(loader, new RegExp(theme + ": " + template));
  }
  assert.match(renderer, /getLazyThemeTemplate/);
  assert.match(renderer, /Suspense/);
});

test("theme preview uses the same canonical renderer", () => {
  assert.match(preview, /ThemeRenderer/);
  assert.doesNotMatch(preview, /getThemeFamily\(/);
  assert.doesNotMatch(preview, /ContemporaryRestaurantTemplate/);
  assert.doesNotMatch(preview, /TasteTemplate/);
  assert.doesNotMatch(preview, /PublicMenuView/);
});

const demo = fs.readFileSync("src/lib/menu/demo.ts", "utf8");
const themesIndex = fs.readFileSync("src/routes/themes/index.tsx", "utf8");

test("anonymous theme previews use stable local demo data and a branded logo", () => {
  assert.match(preview, /DEMO_MENU/);
  assert.match(demo, /logoUrl: "\/demo\/nafas-logo\.svg"/);
  assert.match(demo, /productOptions:/);
  assert.match(demo, /hours:/);
  assert.match(demo, /whatsapp:/);
});

test("theme gallery exposes the real guest route and on-demand QR", () => {
  assert.match(themesIndex, /\/m\/nafas\?theme=/);
  assert.match(themesIndex, /qrcode/);
  assert.match(themesIndex, /Guest-flow QR|QR لتجربة الضيف/);
});
