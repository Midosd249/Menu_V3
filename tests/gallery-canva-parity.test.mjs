import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = fs.readFileSync("src/routes/__root.tsx", "utf8");
const template = fs.readFileSync("src/components/templates/bakery-dessert.tsx", "utf8");
const parity = fs.readFileSync("src/theme-gallery-canva-parity.css", "utf8");

test("Gallery loads the final Mazaq parity layer", () => {
  assert.match(root, /galleryCanvaParityCss/);
  assert.match(root, /gallery-canva-parity\.css/);
  assert.match(template, /gallery-hero/);
  assert.match(template, /tenant\.coverUrl/);
});

test("Gallery parity keeps the approved visual contract scoped to Gallery", () => {
  assert.match(parity, /html\[data-menu-theme="gallery"\]/);
  assert.match(parity, /--gallery-canva-bg:#241b14/);
  assert.match(parity, /\.gallery-brand-header/);
  assert.match(parity, /\.menu-public-shell main ul/);
  assert.match(parity, /\.menu-public-shell.*\.fixed/);
  assert.doesNotMatch(parity, /html:not\(\[data-menu-theme="gallery"\]\)/);
});
