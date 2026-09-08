import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Taste template is the Heritage public renderer", async () => {
  const route = await readFile("src/routes/m.$slug.tsx", "utf8");
  const preview = await readFile("src/routes/themes/preview.tsx", "utf8");
  const studio = await readFile("src/routes/studio/preview.tsx", "utf8");
  assert.match(route, /activeTheme === "heritage" \? <TasteTemplate/);
  assert.match(preview, /effectiveTheme === "heritage" \? <TasteTemplate/);
  assert.match(studio, /activeTheme === "heritage" \? <TasteTemplate/);
});

test("Taste template preserves the supplied menu information architecture", async () => {
  const source = await readFile("src/components/templates/taste.tsx", "utf8");
  for (const marker of ["taste-nav", "taste-hero", "taste-search", "taste-category-scroll", "taste-featured-grid", "taste-product-list", "taste-offer", "taste-info-grid", "taste-actions-section", "taste-footer", "taste-floating-cart", "taste-dialog"]) {
    assert.match(source, new RegExp(marker));
  }
  assert.match(source, /submitPublicOrder/);
  assert.match(source, /recordPublicEvent/);
  assert.match(source, /productOptions/);
});

test("Taste removes card chrome and clipping from the product list", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /\.taste-product-main[\s\S]*border: 0/);
  assert.match(styles, /\.taste-product-copy > p[\s\S]*overflow: visible/);
  assert.match(styles, /\.taste-product-price[\s\S]*white-space: nowrap/);
  assert.match(styles, /\.taste-floating-cart/);
});
