import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Taste template remains the Heritage public renderer", async () => {
  const route = await readFile("src/routes/m.$slug.tsx", "utf8");
  const preview = await readFile("src/routes/themes/preview.tsx", "utf8");
  const studio = await readFile("src/routes/studio/preview.tsx", "utf8");
  const renderer = await readFile("src/components/theme-renderer.tsx", "utf8");
  assert.match(route, /activeTheme === "heritage" \? <TasteTemplate/);
  assert.match(preview, /ThemeRenderer/);
  assert.match(studio, /<ThemeRenderer\s/);
  assert.doesNotMatch(studio, /<TasteTemplate\s/);
  assert.match(renderer, /theme === "heritage"\) return <TasteTemplate/);
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

test("Taste quick add stays conservative and uses the shared eligibility rule", async () => {
  const source = await readFile("src/components/templates/taste.tsx", "utf8");
  const quickAdd = await readFile("src/lib/menu/quick-add.ts", "utf8");
  assert.match(source, /getQuickAddDecision/);
  assert.match(source, /quickAddKey/);
  assert.match(source, /addSimpleProduct/);
  assert.match(source, /getQuickAddDecision\(product, menu\.productOptions\?\.\[product\.id\]\) === "eligible"/);
  assert.match(quickAdd, /requires-options/);
  assert.match(quickAdd, /return "eligible"/);
});

test("Taste product options support an optional item-specific note and public order validation", async () => {
  const source = await readFile("src/components/templates/taste.tsx", "utf8");
  const order = await readFile("src/lib/menu/order-public.ts", "utf8");
  const orders = await readFile("src/lib/menu/orders.ts", "utf8");
  const studio = await readFile("src/routes/studio/orders.tsx", "utf8");
  assert.match(source, /taste-item-note/);
  assert.match(source, /ملاحظة للصنف \(اختياري\)/);
  assert.match(source, /note: item\.note \|\| undefined/);
  assert.match(order, /note: z\.string\(\)\.trim\(\)\.max\(500\)/);
  assert.match(order, /type: "note"/);
  assert.match(orders, /type: "variant" \| "modifier" \| "note"/);
  assert.match(studio, /ملاحظة الصنف/);
});

test("Taste removes card chrome and clipping from the product list", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /\.taste-product-main[\s\S]*border: 0/);
  assert.match(styles, /\.taste-product-copy > p[\s\S]*overflow: visible/);
  assert.match(styles, /\.taste-product-price[\s\S]*white-space: nowrap/);
  assert.match(styles, /\.taste-floating-cart/);
});
