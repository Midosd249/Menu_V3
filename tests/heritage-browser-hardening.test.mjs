import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Taste uses the supplied olive, cream and gold palette", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /--taste-green:\s*#344331/);
  assert.match(styles, /--taste-gold:\s*#b78a42/);
  assert.match(styles, /--taste-cream:\s*#f6f0e5/);
  assert.match(styles, /--taste-line:\s*#e6dac7/);
});

test("Taste hero is image-led and full bleed", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /\.taste-hero\s*\{[\s\S]*min-height:/);
  assert.match(styles, /\.taste-hero-image\s*\{[\s\S]*object-fit:\s*cover/);
  assert.match(styles, /\.taste-hero-overlay/);
});

test("Taste product rows remove the legacy card frame", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /\.taste-product-main\s*\{[\s\S]*border:\s*0/);
  assert.match(styles, /\.taste-product\s*\{[\s\S]*border-bottom:\s*1px solid var\(--taste-line\)/);
  assert.match(styles, /\.taste-product-image\s*\{[\s\S]*border-radius:\s*\.75rem/);
});

test("Taste product hierarchy keeps description visible and price below it", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /\.taste-product-copy\s*>\s*p[\s\S]*overflow:\s*visible/);
  assert.match(styles, /\.taste-product-copy\s*>\s*p[\s\S]*max-height:\s*none/);
  assert.match(styles, /\.taste-product-price[\s\S]*white-space:\s*nowrap/);
  assert.match(styles, /\.taste-product-price[\s\S]*unicode-bidi:\s*isolate/);
});

test("Taste does not introduce Quick Add or options buttons", async () => {
  const source = await readFile("src/components/templates/taste.tsx", "utf8");
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.doesNotMatch(source, /public-menu-quick-add/);
  assert.doesNotMatch(source, /public-menu-options-action/);
  assert.match(styles, /\.taste-floating-cart/);
});

test("Taste preserves data-driven customer action ownership", async () => {
  const source = await readFile("src/components/public-action-links.tsx", "utf8");
  const actions = await readFile("src/lib/menu/public-actions.ts", "utf8");
  assert.match(source, /getPublicActions\(tenant, branch, lang\)/);
  assert.match(source, /data-action-key=\{action\.key\}/);
  assert.match(actions, /whatsapp \? \{ key: "whatsapp"/);
  assert.match(actions, /maps \? \{ key: "location"/);
  assert.match(actions, /phone \? \{ key: "phone"/);
  assert.match(actions, /instagram \? \{ key: "instagram"/);
});

test("Taste mobile rows preserve compact image-to-copy geometry", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /@media \(max-width: 540px\)[\s\S]*\.taste-product-main[\s\S]*minmax\(5\.8rem, 30%\)/);
  assert.match(styles, /@media \(max-width: 540px\)[\s\S]*\.taste-product-copy\s*>\s*p[\s\S]*font-size:\s*\.76rem/);
});
