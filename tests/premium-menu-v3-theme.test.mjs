import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const registryPath = "src/lib/theme/registry.ts";
const typesPath = "src/lib/theme/types.ts";
const cssPath = "src/theme-premium-menu-v3.css";
const briefPath = "docs/template-briefs/premium-menu-v3.md";

test("Premium Menu V3 is a distinct registered theme without changing the existing theme keys", async () => {
  const [types, registry] = await Promise.all([readFile(typesPath, "utf8"), readFile(registryPath, "utf8")]);
  assert.match(types, /"premium-menu-v3"/);
  assert.match(types, /ThemeMotion = .*"premium"/);
  assert.match(registry, /key: "premium-menu-v3"/);
  assert.match(registry, /family: "contemporary-restaurant"/);
  for (const key of ["essential", "editorial", "noir", "heritage", "gallery"]) assert.match(types, new RegExp(`"${key}"`));
});

test("Premium Menu V3 is scoped and owns the warm dark visual system", async () => {
  const styles = await readFile(cssPath, "utf8");
  assert.match(styles, /html\[data-menu-theme="premium-menu-v3"\]/);
  assert.match(styles, /color-scheme:\s*dark/);
  assert.match(styles, /--premium-gold:\s*#d9ae69/);
  assert.match(styles, /safe-area-inset-bottom/);
  assert.match(styles, /aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(styles, /editorial-featured-card\.is-lead/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.doesNotMatch(styles, /animation-timeline:\s*view\(/);
});

test("Premium Menu V3 keeps the existing ordering contract rather than introducing data or dependency changes", async () => {
  const brief = await readFile(briefPath, "utf8");
  assert.match(brief, /No database\/schema\/migration changes/);
  assert.match(brief, /No auth\/authz/);
  assert.match(brief, /No new dependency/);
  assert.match(brief, /Browse.*Product.*Options.*Quantity.*Add to Cart/);
  assert.match(brief, /Arabic-first/);
  assert.match(brief, /Missing\/low-quality images/);
});
