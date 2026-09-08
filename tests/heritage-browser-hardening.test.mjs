import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readTemplate = () => readFile("src/components/templates/contemporary-restaurant.tsx", "utf8");
const readStyles = () => readFile("src/theme-heritage.css", "utf8");

test("Heritage is now the Taste Canva-derived composition", async () => {
  const source = await readTemplate();
  assert.match(source, /taste-menu-shell/);
  assert.match(source, /taste-nav/);
  assert.match(source, /taste-hero/);
  assert.match(source, /taste-category-rail/);
  assert.match(source, /taste-featured/);
  assert.match(source, /taste-menu-grid/);
  assert.match(source, /taste-offer/);
  assert.match(source, /taste-info-grid/);
  assert.match(source, /taste-allergy/);
});

test("Taste keeps Menu V3 ordering and product-options behavior", async () => {
  const source = await readTemplate();
  assert.match(source, /submitPublicOrder\(\{ data:/);
  assert.match(source, /productOptions/);
  assert.match(source, /modifierOptionIds/);
  assert.match(source, /variantId/);
  assert.match(source, /taste-dialog-submit/);
  assert.match(source, /taste-cart-dialog/);
});

test("Taste has no quick-add control on product cards", async () => {
  const source = await readTemplate();
  assert.doesNotMatch(source, /getQuickAddDecision/);
  assert.doesNotMatch(source, /quickAddKey/);
});

test("Taste keeps the exact Canva visual anchors", async () => {
  const styles = await readStyles();
  assert.match(styles, /#344331/);
  assert.match(styles, /#f6f0e5/);
  assert.match(styles, /#b78a42/);
  assert.match(styles, /taste-hero-content/);
  assert.match(styles, /taste-featured-card/);
  assert.match(styles, /taste-offer-grid/);
  assert.match(styles, /taste-info-grid/);
  assert.match(styles, /taste-allergy/);
});

test("Taste price presentation is isolated and never positioned over product text", async () => {
  const source = await readTemplate();
  const styles = await readStyles();
  assert.match(source, /className="taste-price"/);
  assert.match(styles, /taste-price\{[^}]*white-space:nowrap/);
  assert.doesNotMatch(styles, /taste-price\{[^}]*position:absolute/);
});

test("Legacy Heritage hardening layers are no longer referenced", async () => {
  const root = await readFile("src/routes/__root.tsx", "utf8");
  assert.doesNotMatch(root, /theme-heritage-hardening/);
  assert.doesNotMatch(root, /theme-heritage-cascade/);
});
