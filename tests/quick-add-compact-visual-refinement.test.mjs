import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const refinement = fs.readFileSync("src/quick-add-compact-refinement.css", "utf8");
const publicMenu = fs.readFileSync("src/components/public-menu.tsx", "utf8");
const contemporary = fs.readFileSync("src/components/templates/contemporary-restaurant.tsx", "utf8");

test("Quick Add is retired from the shared public-menu surface", () => {
  assert.match(refinement, /\.public-menu-quick-add\s*\{[\s\S]*display:\s*none\s*!important;/);
  assert.doesNotMatch(refinement, /position:\s*absolute/);
  assert.doesNotMatch(refinement, /background:\s*var\(--menu-accent/);
  assert.doesNotMatch(refinement, /border-radius:\s*999/);
});

test("retirement applies explicitly to every active public theme", () => {
  for (const theme of ["essential", "editorial", "noir", "heritage", "gallery"]) {
    assert.match(refinement, new RegExp(`html\\[data-menu-theme=\\"${theme}\\"\\] \\.public-menu-quick-add`));
  }
});

test("existing public renderers no longer receive a visible Quick Add presentation layer", () => {
  assert.match(publicMenu, /public-menu-quick-add/);
  assert.match(contemporary, /public-menu-quick-add/);
  assert.match(refinement, /display:\s*none\s*!important/);
});

test("retirement does not alter the product details/options flow", () => {
  assert.match(publicMenu, /function ProductSheet/);
  assert.match(publicMenu, /أضف للطلب/);
});
