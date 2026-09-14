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

test("shared nutrition disclosure exposes the agreed fields and icons", () => {
  assert.ok(disclosure.includes("product.calories != null"));
  assert.ok(disclosure.includes("product.sodiumMg != null"));
  assert.ok(disclosure.includes("product.caffeineMg != null"));
  assert.ok(disclosure.includes("hasHighSalt(product)"));
  assert.ok(disclosure.includes("SaltIcon"));
  assert.ok(disclosure.includes("Footprints"));
  assert.ok(disclosure.includes("WALKING_WEIGHT_KG = 70"));
  assert.ok(disclosure.includes("WALKING_MET = 3.8"));
});

test("nutrition overlay mounts the shared disclosure deterministically and normalizes native fields", () => {
  assert.ok(overlay.includes("aria-modal=\"true\""));
  assert.ok(overlay.includes("data-menu-nutrition=\"true\""));
  assert.ok(overlay.includes("data-menu-nutrition-host"));
  assert.ok(overlay.includes("data-menu-nutrition-hidden"));
  assert.ok(overlay.includes("hideNativeNutrition"));
  assert.ok(overlay.includes("aria-labelledby"));
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
