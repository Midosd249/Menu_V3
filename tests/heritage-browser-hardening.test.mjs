import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Taste removes legacy decorative menu numbers", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /data-menu-theme=\\"heritage\\"[\\s\\S]*display:none!important/);
});

test("Taste uses the supplied olive, cream and gold palette", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /--taste-green:#344331/);
  assert.match(styles, /--taste-gold:#b78a42/);
  assert.match(styles, /--taste-cream:#f6f0e5/);
  assert.match(styles, /--taste-line:#e6dac7/);
});

test("Taste hero is image-led and full bleed", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /header\{position:relative!important;min-height:27rem/);
  assert.match(styles, /header>div:first-child img[\s\S]*object-fit:cover!important/);
  assert.match(styles, /header>div.relative[\s\S]*min-height:27rem/);
});

test("Taste product cards remove the legacy white frame", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /editorial-product-card[\s\S]*border:0!important/);
  assert.match(styles, /editorial-product-card[\s\S]*background:transparent!important/);
  assert.match(styles, /editorial-product-card[\s\S]*border-bottom:1px solid var\(--taste-line\)!important/);
});

test("Taste product hierarchy keeps description visible and price below it", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /editorial-product-name[\s\S]*grid-row:1!important/);
  assert.match(styles, /editorial-product-description[\s\S]*grid-row:2!important/);
  assert.match(styles, /editorial-product-description[\s\S]*-webkit-line-clamp:unset!important/);
  assert.match(styles, /editorial-product-price[\s\S]*grid-row:3!important/);
  assert.match(styles, /editorial-product-price[\s\S]*direction:ltr!important/);
  assert.match(styles, /editorial-product-price[\s\S]*unicode-bidi:isolate!important/);
});

test("Taste removes duplicate quick-add/options presentation", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /public-menu-quick-add[\s\S]*display:none!important/);
  assert.match(styles, /public-menu-options-action[\s\S]*display:none!important/);
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
  assert.match(styles, /@media \(max-width:520px\)[\s\S]*editorial-product-card[\s\S]*grid-template-columns:minmax\(5\.8rem,30%\)/);
  assert.match(styles, /@media \(max-width:520px\)[\s\S]*editorial-product-description[\s\S]*font-size:\.75rem/);
});
