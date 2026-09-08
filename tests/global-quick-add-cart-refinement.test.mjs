import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const publicMenu = fs.readFileSync("src/components/public-menu.tsx", "utf8");
const contemporary = fs.readFileSync("src/components/templates/contemporary-restaurant.tsx", "utf8");
const quickAdd = fs.readFileSync("src/lib/menu/quick-add.ts", "utf8");
const retirement = fs.readFileSync("src/quick-add-compact-refinement.css", "utf8");
const themeRecovery = fs.readFileSync("src/theme-public-quality-recovery.css", "utf8");

test("Quick Add is retired without removing existing cart/order infrastructure", () => {
  assert.match(publicMenu, /setCartOpen\(true\)/);
  assert.match(publicMenu, /public-menu-bottom-bar/);
  assert.match(contemporary, /setCartOpen\(true\)/);
  assert.match(retirement, /display:\s*none\s*!important/);
});

test("legacy Quick Add eligibility logic remains isolated and cannot render the retired control", () => {
  assert.match(quickAdd, /product\.isAvailable/);
  assert.match(quickAdd, /Number\.isFinite\(product\.price\)/);
  assert.match(quickAdd, /requires-options/);
  assert.match(retirement, /\.public-menu-quick-add/);
});

test("theme recovery layer retains only the persistent cart safe-area contract", () => {
  assert.match(themeRecovery, /\.public-menu-bottom-bar/);
  assert.match(themeRecovery, /env\(safe-area-inset-bottom\)/);
});

test("retired Quick Add cannot become visible through theme-specific selectors", () => {
  for (const theme of ["essential", "editorial", "noir", "heritage", "gallery"]) {
    assert.match(retirement, new RegExp(`html\\[data-menu-theme=\\"${theme}\\"\\] \\.public-menu-quick-add`));
  }
});
