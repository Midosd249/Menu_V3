import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const refinement = fs.readFileSync("src/quick-add-compact-refinement.css", "utf8");
const publicMenu = fs.readFileSync("src/components/public-menu.tsx", "utf8");
const contemporary = fs.readFileSync("src/components/templates/contemporary-restaurant.tsx", "utf8");

test("Quick Add is retired from the shared public-menu surface", () => {
  assert.match(refinement, /\.public-menu-quick-add\s*\{[\s\S]*display:\s*none\s*!important;/);
  const sharedBlock = refinement.match(/\.public-menu-quick-add\s*\{([\s\S]*?)\}/)?.[1] ?? "";
  assert.doesNotMatch(sharedBlock, /position:\s*absolute/);
  assert.doesNotMatch(sharedBlock, /background:\s*var\(--menu-accent/);
  assert.doesNotMatch(sharedBlock, /border-radius:\s*999/);
});

test("retirement is global while Taste keeps its explicitly local Quick Add", () => {
  assert.match(refinement, /\.public-menu-quick-add\s*\{[\s\S]*display:\s*none\s*!important;/);
  assert.match(refinement, /html\[data-menu-theme="heritage"\] \.taste-page \.taste-product > button\.absolute/);
  assert.doesNotMatch(refinement, /html\[data-menu-theme="(?:essential|editorial|noir|gallery)"\][^\n]*\.public-menu-quick-add/);
});

test("existing public renderers no longer receive a visible shared Quick Add presentation layer", () => {
  assert.match(publicMenu, /public-menu-quick-add/);
  assert.match(contemporary, /public-menu-quick-add/);
  assert.match(refinement, /display:\s*none\s*!important/);
});

test("retirement does not alter the product details/options flow", () => {
  assert.match(publicMenu, /function ProductSheet/);
  assert.match(publicMenu, /أضف للطلب/);
});
