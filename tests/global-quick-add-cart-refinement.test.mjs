import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const publicMenu = fs.readFileSync("src/components/public-menu.tsx", "utf8");
const contemporary = fs.readFileSync("src/components/templates/contemporary-restaurant.tsx", "utf8");
const signal = fs.readFileSync("src/components/templates/signal-table.tsx", "utf8");
const quickAdd = fs.readFileSync("src/lib/menu/quick-add.ts", "utf8");
const retirement = fs.readFileSync("src/quick-add-compact-refinement.css", "utf8");
const runtimeStyles = fs.readFileSync("src/lib/theme/runtime-styles.ts", "utf8");
const themeRecovery = fs.readFileSync("src/theme-public-quality-recovery.css", "utf8");

test("External product actions are retired without removing existing cart/order infrastructure", () => {
  assert.match(publicMenu, /setCartOpen\(true\)/);
  assert.match(publicMenu, /public-menu-bottom-bar/);
  assert.match(contemporary, /setCartOpen\(true\)/);
  assert.match(signal, /setCartOpen\(true\)/);
  assert.match(retirement, /\.public-menu-quick-add\s*,\s*\.public-menu-options-action[\s\S]*display:\s*none\s*!important/);
  assert.match(retirement, /html\[data-menu-theme="heritage"\] \.taste-page \.taste-product > button\.absolute\s*\{[\s\S]*display:\s*none\s*!important/);
});

test("External product actions are retired in every canonical theme stylesheet stack", () => {
  for (const theme of ["essential", "editorial", "noir", "heritage", "gallery"]) {
    assert.match(runtimeStyles, new RegExp(theme + ":\\s*\\[[\\s\\S]*?quickAddCompactRefinementCss"));
  }
});

test("Legacy Quick Add eligibility logic remains isolated and cannot render a visible external action", () => {
  assert.match(quickAdd, /product\.isAvailable/);
  assert.match(quickAdd, /Number\.isFinite\(product\.price\)/);
  assert.match(quickAdd, /requires-options/);
  assert.match(retirement, /\.public-menu-quick-add/);
  assert.match(retirement, /\.public-menu-options-action/);
});

test("Theme recovery keeps only the persistent cart safe-area contract", () => {
  assert.match(themeRecovery, /\.public-menu-bottom-bar/);
  assert.match(themeRecovery, /env\(safe-area-inset-bottom\)/);
});
