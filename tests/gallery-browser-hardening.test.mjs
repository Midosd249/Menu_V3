import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Gallery keeps the Canva reference shell without duplicating the live public menu", async () => {
  const template = await readFile("src/components/templates/bakery-dessert.tsx", "utf8");
  const styles = await readFile("src/theme-gallery-canva-parity.css", "utf8");

  assert.match(template, /gallery-public-frame/);
  assert.match(template, /gallery-canva-reference/);
  assert.match(template, /gallery-canva-menu/);
  assert.match(template, /PublicMenuView/);
  assert.match(styles, /--gallery-ink:#17140f/);
  assert.match(styles, /--gallery-cream:#f7f0e4/);
  assert.match(styles, /--gallery-lime:#d5f05c/);
  assert.match(styles, /gallery-canva-hero::after/);
});

test("Gallery keeps all shared ordering behavior behind the visual shell", async () => {
  const template = await readFile("src/components/templates/bakery-dessert.tsx", "utf8");

  assert.match(template, /PublicMenuView menu=\{menu\}/);
  assert.match(template, /id="menu"/);
  assert.doesNotMatch(template, /ArrowDown/);
});

test("Gallery uses Canva mobile-first one-column cards and responsive grids", async () => {
  const styles = await readFile("src/theme-gallery-canva-parity.css", "utf8");

  assert.match(styles, /main ul\{display:grid;grid-template-columns:1fr/);
  assert.match(styles, /@media\(min-width:640px\).*grid-template-columns:repeat\(2/);
  assert.match(styles, /@media\(min-width:1024px\).*grid-template-columns:repeat\(3/);
  assert.match(styles, /aspect-ratio:16\/10/);
});

test("Gallery keeps explicit Quick Add/options selectors isolated from its card shell", async () => {
  const styles = await readFile("src/theme-gallery-canva-parity.css", "utf8");

  assert.match(styles, /public-menu-quick-add/);
  assert.match(styles, /public-menu-options-action/);
  assert.match(styles, /:not\(\.public-menu-quick-add\):not\(\.public-menu-options-action\)/);
});

test("Gallery parity stylesheet is loaded after base Gallery layers", async () => {
  const source = await readFile("src/routes/__root.tsx", "utf8");

  assert.match(source, /import galleryThemeCss from "\.\.\/theme-gallery\.css\?url"/);
  assert.match(source, /import galleryHardeningCss from "\.\.\/theme-gallery-hardening\.css\?url"/);
  assert.match(source, /import galleryCanvaParityCss from "\.\.\/theme-gallery-canva-parity\.css\?url"/);
  assert.match(source, /href: galleryCanvaParityCss/);
});

test("Gallery preserves RTL/LTR and reduced-motion safeguards", async () => {
  const styles = await readFile("src/theme-gallery-canva-parity.css", "utf8");

  assert.match(styles, /html\[dir="rtl"\]\[data-menu-theme="gallery"\]/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
});
