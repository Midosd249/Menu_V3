import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Gallery first-screen brand hierarchy is explicit and bounded", async () => {
  const template = await readFile("src/components/templates/bakery-dessert.tsx", "utf8");
  const styles = await readFile("src/theme-gallery-hardening.css", "utf8");

  assert.match(template, /gallery-public-frame/);
  assert.match(template, /gallery-brand-header/);
  assert.match(template, /gallery-brand-logo/);
  assert.match(template, /gallery-brand-name/);
  assert.match(styles, /gallery-brand-logo[\s\S]*width:\s*clamp\(3\.75rem,\s*15vw,\s*4\.5rem\)/);
  assert.match(styles, /gallery-brand-name[\s\S]*white-space:\s*normal/);
  assert.match(styles, /gallery-brand-name[\s\S]*overflow-wrap:\s*anywhere/);
});

test("Gallery preserves RTL/LTR and safe first-screen spacing", async () => {
  const styles = await readFile("src/theme-gallery-hardening.css", "utf8");

  assert.match(styles, /html\[dir="rtl"\]\[data-menu-theme="gallery"\]/);
  assert.match(styles, /html\[dir="ltr"\]\[data-menu-theme="gallery"\]/);
  assert.match(styles, /gallery-public-frame > div:last-child[\s\S]*padding-top:\s*0/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});

test("Gallery featured section presents one image-led item at a time", async () => {
  const styles = await readFile("src/theme-gallery-hardening.css", "utf8");

  assert.match(styles, /featured presentation: one image-led item at a time/);
  assert.match(styles, /first-child:has\(> h2\.text-sm\) > div \{[\s\S]*display:\s*block/);
  assert.match(styles, /button:not\(:first-child\)\s*\{\s*display:\s*none/);
  assert.match(styles, /button > :first-child\s*\{\s*aspect-ratio:\s*4\s*\/\s*3/);
});

test("Gallery removes boxed card chrome while retaining image shape", async () => {
  const styles = await readFile("src/theme-price-consistency.css", "utf8");

  assert.match(styles, /data-menu-theme="gallery"[\s\S]*main ul > li > button[\s\S]*border:\s*0\s*!important/);
  assert.match(styles, /data-menu-theme="gallery"[\s\S]*main ul > li > button[\s\S]*background:\s*transparent\s*!important/);
  assert.match(styles, /data-menu-theme="gallery"[\s\S]*main ul > li > button[\s\S]*box-shadow:\s*none\s*!important/);
  assert.match(styles, /data-menu-theme="gallery"[\s\S]*main ul > li > button > :first-child[\s\S]*border-radius:\s*1rem\s*!important/);
});

test("Gallery hardening is loaded after the base Gallery stylesheet", async () => {
  const source = await readFile("src/routes/__root.tsx", "utf8");

  assert.match(source, /import galleryThemeCss from "\.\.\/theme-gallery\.css\?url"/);
  assert.match(source, /import galleryHardeningCss from "\.\.\/theme-gallery-hardening\.css\?url"/);
  assert.match(source, /href: galleryThemeCss \},\s*\{ rel: "stylesheet", href: galleryHardeningCss \}/);
});

test("Public menu root does not overwrite route-selected theme during hydration", async () => {
  const source = await readFile("src/routes/__root.tsx", "utf8");

  assert.doesNotMatch(source, /<MenuThemeController\s*\/>/);
  assert.doesNotMatch(source, /import \{ MenuThemeController \}/);
});
