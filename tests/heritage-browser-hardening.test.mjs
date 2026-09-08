import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Taste replacement keeps the canonical Heritage theme slot", async () => {
  const registry = await readFile("src/lib/theme/registry.ts", "utf8");
  assert.match(registry, /key:\s*"heritage"[\s\S]*name:\s*\{ ar:\s*"مذاق", en:\s*"Taste" \}/);
  assert.doesNotMatch(registry, /name:\s*\{ ar:\s*"أصالة", en:\s*"Heritage" \}/);
});

test("Taste replacement uses a clean hero and image-led menu surface", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /min-height:\s*clamp\(25rem,76vw,39rem\)/);
  assert.match(styles, /header>div\.first-child::after|header>div:first-child::after/);
  assert.match(styles, /aspect-ratio:4\/3/);
  assert.match(styles, /object-fit:cover/);
  assert.match(styles, /background:#f7f5f1/);
});

test("Taste replacement keeps product identity, description and price readable", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /main ul>li>button>:last-child>:first-child[\s\S]*overflow-wrap:anywhere/);
  assert.match(styles, /main ul>li>button>:last-child>:nth-child\(2\)[\s\S]*line-height:1\.55/);
  assert.match(styles, /main ul>li>button>:last-child>:last-child[\s\S]*direction:ltr/);
  assert.match(styles, /unicode-bidi:isolate/);
});

test("Taste replacement preserves responsive menu geometry", async () => {
  const styles = await readFile("src/theme-heritage.css", "utf8");
  assert.match(styles, /@media \(min-width:768px\)[\s\S]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(styles, /@media \(min-width:1100px\)[\s\S]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(styles, /@media \(max-width:430px\)[\s\S]*grid-template-columns:1fr/);
});

test("Taste replacement keeps customer actions data-driven", async () => {
  const source = await readFile("src/components/public-action-links.tsx", "utf8");
  const actions = await readFile("src/lib/menu/public-actions.ts", "utf8");
  assert.match(source, /getPublicActions\(tenant, branch, lang\)/);
  assert.match(source, /data-action-key=\{action\.key\}/);
  assert.match(actions, /whatsapp \? \{ key: "whatsapp"/);
  assert.match(actions, /maps \? \{ key: "location"/);
  assert.match(actions, /phone \? \{ key: "phone"/);
  assert.match(actions, /instagram \? \{ key: "instagram"/);
});

test("Taste replacement removes retired Heritage-only cascade imports", async () => {
  const root = await readFile("src/routes/__root.tsx", "utf8");
  assert.doesNotMatch(root, /theme-heritage-hardening\.css/);
  assert.doesNotMatch(root, /theme-heritage-cascade\.css/);
  assert.match(root, /theme-heritage\.css/);
});
