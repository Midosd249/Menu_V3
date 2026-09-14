import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const disclosure = await readFile("src/components/menu-nutrition-disclosure.tsx", "utf8");
const overlay = await readFile("src/components/menu-nutrition-overlay.tsx", "utf8");
const renderer = await readFile("src/components/theme-renderer.tsx", "utf8");
const publicMenu = await readFile("src/components/public-menu.tsx", "utf8");
const taste = await readFile("src/components/templates/taste.tsx", "utf8");
const contemporary = await readFile("src/components/templates/contemporary-restaurant.tsx", "utf8");
const coverMigration = await readFile("migrations/20260914090000_sura_table_cover.sql", "utf8");
const cover = await readFile("public/menu-covers/sura-table.svg", "utf8");

test("shared nutrition disclosure exposes the agreed fields and SFDA-aligned indicators", () => {
  assert.ok(disclosure.includes("product.calories != null"));
  assert.ok(disclosure.includes("product.sodiumMg != null"));
  assert.ok(disclosure.includes("product.caffeineMg != null"));
  assert.ok(disclosure.includes("hasHighSalt(product)"));
  assert.ok(disclosure.includes("SaltIcon"));
  assert.ok(disclosure.includes("Footprints"));
  assert.ok(disclosure.includes("WALKING_WEIGHT_KG = 70"));
  assert.ok(disclosure.includes("WALKING_EFFORT = 3.3"));
  assert.ok(disclosure.includes("60 * calories"));
  assert.ok(disclosure.includes("400 mg"));
});

test("nutrition fields share the same presentation contract as allergens", () => {
  assert.ok(disclosure.includes('const itemClass = "menu-nutrition-item rounded-xl px-3 py-2 text-xs leading-5"'));
  assert.ok(disclosure.includes('className={itemClass + " bg-sand text-ink"}'));
  assert.ok(disclosure.includes('className={itemClass + " flex items-center gap-2 bg-sand text-ink"}'));
  assert.ok(disclosure.includes('className={itemClass + " flex items-start gap-2 bg-bad/10 font-semibold text-bad"}'));
  assert.ok(disclosure.includes('className={itemClass + " flex items-start gap-2 bg-sand text-muted"}'));
});

test("nutrition overlay targets product identity instead of dialog heading", () => {
  assert.ok(overlay.includes("productNameInDialog"));
  assert.ok(overlay.includes("[aria-label],h1,h2,h3,h4"));
  assert.ok(overlay.includes("dialog.querySelectorAll<HTMLElement>(\"p,li,span\")"));
  assert.ok(!overlay.includes("dialog.querySelectorAll<HTMLElement>(\"p,div\")"));
  assert.ok(overlay.includes("data-menu-nutrition=\"true\""));
  assert.ok(overlay.includes("data-menu-nutrition-host"));
  assert.ok(overlay.includes("data-menu-nutrition-hidden"));
  assert.ok(overlay.includes("hideNativeNutrition"));
  assert.ok(overlay.includes("MenuNutritionDisclosure"));
});

test("canonical renderer mounts the nutrition integration for every theme family", () => {
  assert.ok(renderer.includes("<MenuNutritionOverlay products={menu.products} lang={lang} />"));
});

test("custom theme dialogs and the native public renderer are covered", () => {
  assert.ok(taste.includes('role="dialog"'));
  assert.ok(contemporary.includes('role="dialog"'));
  assert.ok(publicMenu.includes("product.calories != null"));
  assert.ok(publicMenu.includes("product.sodiumMg != null"));
});

test("Sura Table cover is original local artwork and scoped to the golden demo tenant", () => {
  assert.ok(coverMigration.includes("cover_url = '/menu-covers/sura-table.svg'"));
  assert.ok(coverMigration.includes("slug = 'sura-table'"));
  assert.ok(cover.includes("<svg "));
  assert.ok(cover.includes("مائدة سُرى"));
});
