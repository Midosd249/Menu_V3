import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const template = await readFile("src/components/templates/bakery-dessert.tsx", "utf8");
const galleryCss = await readFile("src/theme-gallery.css", "utf8");
const hardeningCss = await readFile("src/theme-gallery-hardening.css", "utf8");

const combinedCss = `${galleryCss}\n${hardeningCss}`;

test("Gallery hero is explicitly kept in normal document flow", () => {
  assert.match(template, /\.gallery-canva-reference \\.menu-public-shell > header \{/);
  assert.match(template, /position: relative !important;/);
  assert.match(template, /background-attachment: scroll !important;/);
  assert.match(template, /transform: none !important;/);
  assert.match(template, /min-height: clamp\(17rem, 48svh, 23rem\)/);
  assert.doesNotMatch(template, /position:\s*(fixed|sticky)\s*!important/);
});

test("Gallery stylesheet does not pin the public hero", () => {
  assert.match(combinedCss, /data-menu-theme=\\"gallery\\"/);
  assert.doesNotMatch(combinedCss, /data-menu-theme=\\"gallery\\"[^}]*position:\s*(fixed|sticky)/s);
  assert.doesNotMatch(combinedCss, /data-menu-theme=\\"gallery\\"[^}]*background-attachment:\s*fixed/s);
});

test("Gallery hero fix stays scoped and preserves the shared public renderer", () => {
  assert.match(template, /<PublicMenuView menu=\{menu\} \/>/);
  assert.match(template, /gallery-canva-reference/);
  assert.doesNotMatch(template, /TasteTemplate/);
  assert.doesNotMatch(template, /ThemeRenderer/);
});
