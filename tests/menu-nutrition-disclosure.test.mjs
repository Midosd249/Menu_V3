import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const overlay = await readFile("src/components/menu-nutrition-overlay.tsx", "utf8");
const renderer = await readFile("src/components/theme-renderer.tsx", "utf8");
const coverMigration = await readFile("migrations/20260914090000_sura_table_cover.sql", "utf8");
const cover = await readFile("public/menu-covers/sura-table.svg", "utf8");

test("nutrition disclosure exposes calories, sodium, caffeine and high-salt warning icons", () => {
  assert.match(overlay, /product\.calories != null/);
  assert.match(overlay, /product\.sodiumMg != null/);
  assert.match(overlay, /product\.caffeineMg != null/);
  assert.match(overlay, /product\.sodiumMg >= 2000/);
  assert.match(overlay, /Footprints/);
  assert.match(overlay, /Salt/);
});

test("nutrition disclosure is mounted by the canonical renderer for every theme family", () => {
  assert.match(renderer, /<MenuNutritionOverlay products=\{menu\.products\} lang=\{lang\} \/>/);
});

test("Sura Table cover is original local artwork and scoped to the golden demo tenant", () => {
  assert.match(coverMigration, /cover_url = '\/menu-covers\/sura-table\.svg'/);
  assert.match(coverMigration, /slug = 'sura-table'/);
  assert.match(cover, /<svg /);
  assert.match(cover, /مائدة سُرى/);
});
