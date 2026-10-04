import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const refinement = fs.readFileSync("src/quick-add-compact-refinement.css", "utf8");
const runtimeStyles = fs.readFileSync("src/lib/theme/runtime-styles.ts", "utf8");

test("External Quick Add and options actions are fully retired", () => {
  assert.match(refinement, /\.public-menu-quick-add\s*,\s*\.public-menu-options-action[\s\S]*display:\s*none\s*!important/);
  assert.match(refinement, /html\[data-menu-theme="heritage"\] \.taste-page \.taste-product > button\.absolute\s*\{[\s\S]*display:\s*none\s*!important/);
});

test("The retirement layer is loaded last for every canonical public theme", () => {
  for (const theme of ["essential", "editorial", "noir", "heritage", "gallery"]) {
    assert.match(runtimeStyles, new RegExp(theme + ":\\s*\\[[\\s\\S]*?quickAddCompactRefinementCss"));
  }
});
