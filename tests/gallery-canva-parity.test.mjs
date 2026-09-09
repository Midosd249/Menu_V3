import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = fs.readFileSync("src/routes/__root.tsx", "utf8");
const template = fs.readFileSync("src/components/templates/bakery-dessert.tsx", "utf8");
const parity = fs.readFileSync("src/theme-gallery-canva-parity.css", "utf8");

test("Gallery keeps the final parity stylesheet", () => {
  assert.match(root, /galleryCanvaParityCss/);
  assert.match(root, /gallery-canva-parity\.css/);
});

test("Gallery has one public-menu renderer and no duplicate static hero", () => {
  assert.match(template, /PublicMenuView/);
  assert.match(template, /gallery-public-frame/);
  assert.doesNotMatch(template, /gallery-canva-hero/);
  assert.doesNotMatch(template, /tenant\.coverUrl/);
});

test("Gallery preview is constrained to the viewport", () => {
  assert.match(template, /maxWidth: "100%"/);
  assert.match(template, /overflow-x-clip/);
});

test("Gallery parity remains scoped to Gallery", () => {
  assert.match(parity, /html\[data-menu-theme="gallery"\]/);
  assert.match(parity, /\.menu-public-shell main ul/);
  assert.match(parity, /\.menu-public-shell.*\.fixed/);
  assert.doesNotMatch(parity, /html:not\(\[data-menu-theme="gallery"\]\)/);
});

test("Gallery keeps the Canva visual tokens", () => {
  for (const token of ["#17140f", "#f7f0e4", "#ef5b3d", "#d5f05c", "#f6bc45"]) {
    assert.match(parity, new RegExp(token.replace("#", "\\#")));
  }
});

test("Gallery preserves Quick Add and product-options hooks", () => {
  assert.match(parity, /public-menu-quick-add/);
  assert.match(parity, /public-menu-options-action/);
});
