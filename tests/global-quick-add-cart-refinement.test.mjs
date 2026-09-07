import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const publicMenu = fs.readFileSync("src/components/public-menu.tsx", "utf8");
const contemporary = fs.readFileSync("src/components/templates/contemporary-restaurant.tsx", "utf8");
const quickAdd = fs.readFileSync("src/lib/menu/quick-add.ts", "utf8");
const styles = fs.readFileSync("src/styles.css", "utf8");

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

test("cart remains persistent and has safe mobile spacing", () => {
  assert.match(contemporary, /!preview \? <button/);
  assert.match(styles, /\.public-menu-bottom-bar/);
  assert.match(styles, /env\(safe-area-inset-bottom\)/);
  assert.match(styles, /min-height: 44px/);
});

test("quick-add actions are separate interactive controls", () => {
  assert.doesNotMatch(publicMenu, /<button[^>]*>[\s\S]*<button[^>]*className=\"public-menu-quick-add/);
  assert.doesNotMatch(contemporary, /<button[^>]*>[\s\S]*<button[^>]*className=\"public-menu-quick-add/);
});
