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

test("anonymous theme previews use the official Nafas data source", () => {
  assert.match(preview, /DEMO_MENU/);
  assert.match(demo, /const DEMO_TENANT_ID = "demo-nafas"/);
  assert.match(demo, /logoUrl: "\/api\/media\/tenant\/demo-nafas\/logo"/);
  assert.match(demo, /coverUrl: "\/api\/media\/tenant\/demo-nafas\/cover"/);
  assert.match(demo, /themeKey: "heritage"/);
  assert.match(demo, /productOptions:/);
  assert.match(demo, /hours:/);
  assert.match(demo, /whatsapp:/);
});

test("theme gallery exposes the real guest route and on-demand QR", () => {
  assert.match(themesIndex, /\/m\/nafas\?theme=/);
  assert.match(themesIndex, /qrcode/);
  assert.match(themesIndex, /Guest-flow QR|QR لتجربة الضيف/);
});

test("official Nafas demo uses the current Studio product snapshot plus demo-only enrichment", () => {
  const productCount = (demo.match(/id:"demo-p-/g) ?? []).length;
  assert.equal(productCount, 12, `expected the 12 current demo-nafas Studio products, found ${productCount}`);
  for (const id of [
    "demo-p-v60", "demo-p-flatwhite", "demo-p-croissant", "demo-p-date", "demo-p-zaatar",
    "demo-p-arabic", "demo-p-spiced", "demo-p-shakshuka", "demo-p-halloumi", "demo-p-salad",
    "demo-p-kunafa", "demo-p-basbousa",
  ]) assert.match(demo, new RegExp(id));
  assert.match(demo, /https:\/\/images\.unsplash\.com\/photo-1727080409436/);
  assert.match(demo, /https:\/\/as2\.ftcdn\.net\/jpg\/17\/59\/31\/01/);
  assert.match(demo, /allergens:/);
  assert.match(demo, /dietaryLabels:/);
  assert.match(demo, /productOptions:/);
  assert.match(demo, /demo-v60-extra/);
  assert.match(demo, /demo-flatwhite-milk/);
  assert.match(demo, /demo-croissant-extra/);
  assert.match(demo, /demo-shakshuka-extra/);
  assert.match(demo, /productOffers:/);
  assert.match(demo, /خصم للنصف/);
  assert.doesNotMatch(demo, /demo-pistachio/);
  assert.doesNotMatch(demo, /demo-strawberry-matcha/);
  assert.doesNotMatch(demo, /instagram\.com\/nafas\.demo/);
  assert.doesNotMatch(demo, /\+966500000000/);
});
