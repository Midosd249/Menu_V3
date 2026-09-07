import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const publicMenu = fs.readFileSync("src/components/public-menu.tsx", "utf8");
const contemporary = fs.readFileSync("src/components/templates/contemporary-restaurant.tsx", "utf8");
const quickAdd = fs.readFileSync("src/lib/menu/quick-add.ts", "utf8");
const themeRecovery = fs.readFileSync("src/theme-public-quality-recovery.css", "utf8");

test("quick-add eligibility is conservative and availability-aware", () => {
  assert.match(quickAdd, /product\.isAvailable/);
  assert.match(quickAdd, /Number\.isFinite\(product\.price\)/);
  assert.match(quickAdd, /requires-options/);
  assert.match(quickAdd, /variant\.isAvailable/);
  assert.match(quickAdd, /group\.isActive/);
});

test("shared public renderer owns the single quick-add and cart state", () => {
  assert.match(publicMenu, /getQuickAddDecision/);
  assert.match(publicMenu, /quickAddKey/);
  assert.match(publicMenu, /addSimpleProduct/);
  assert.match(publicMenu, /setCartOpen\(true\)/);
  assert.match(publicMenu, /public-menu-bottom-bar/);
  assert.doesNotMatch(publicMenu, /orderingEnabled/);
});

test("eligible products use direct add while configurable products keep options flow", () => {
  assert.match(publicMenu, /decision === "eligible"/);
  assert.match(publicMenu, /decision === "requires-options"/);
  assert.match(publicMenu, /اختر الخيارات/);
  assert.match(contemporary, /decision === "eligible"/);
  assert.match(contemporary, /decision === "requires-options"/);
});

test("cart remains persistent and uses safe mobile touch spacing", () => {
  assert.match(contemporary, /!preview \? <button/);
  assert.match(publicMenu, /min-h-11/);
  assert.match(themeRecovery, /\.public-menu-quick-add/);
  assert.match(themeRecovery, /min-height: 44px/);
  assert.match(themeRecovery, /env\(safe-area-inset-bottom\)/);
});

test("quick-add actions are sibling interactive controls, never nested buttons", () => {
  assert.doesNotMatch(publicMenu, /<button[^>]*>[\s\S]*<button[^>]*className=\"public-menu-quick-add/);
  assert.doesNotMatch(contemporary, /<button[^>]*>[\s\S]*<button[^>]*className=\"public-menu-quick-add/);
});
