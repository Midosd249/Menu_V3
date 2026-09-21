import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const css = fs.readFileSync(new URL("src/motion.css", root), "utf8");
const rootRoute = fs.readFileSync(new URL("src/routes/__root.tsx", root), "utf8");
const publicMenu = fs.readFileSync(new URL("src/components/public-menu.tsx", root), "utf8");

test("motion system centralizes durations, easing, distances, and scale", () => {
  for (const token of [
    "--motion-duration-instant",
    "--motion-duration-fast",
    "--motion-duration-standard",
    "--motion-duration-emphasis",
    "--motion-duration-slow",
    "--motion-ease-standard",
    "--motion-ease-emphasis",
    "--motion-ease-exit",
    "--motion-distance-sm",
    "--motion-distance-md",
    "--motion-distance-lg",
    "--motion-scale-enter",
  ]) assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")));
});

test("motion system is loaded before protected themes", () => {
  assert.match(rootRoute, /motionCss/);
  assert.match(rootRoute, /href: motionCss/);
  assert.ok(rootRoute.indexOf("href: motionCss") < rootRoute.indexOf("href: themeCss"));
});

test("interactive motion avoids layout properties and supports reduced motion", () => {
  assert.match(css, /transition:\s*transform/);
  assert.match(css, /opacity/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(css, /transition:[^;]*(?:width|height|top|left|margin|padding)/i);
});

test("public menu has dialog targets for deterministic entrance choreography", () => {
  assert.equal(publicMenu.includes('aria-labelledby={titleId}'), true);
  assert.equal(publicMenu.includes('aria-labelledby="cart-title"'), true);
  assert.equal(css.includes('[aria-labelledby="product-details-title"]'), true);
  assert.equal(css.includes('[aria-labelledby="cart-title"]'), true);
});

test("reduced motion preserves state changes without press scaling", () => {
  const reducedMotionBlock = css.match(/@media \(prefers-reduced-motion: reduce\)[\s\S]*$/)?.[0] ?? "";
  assert.match(reducedMotionBlock, /animation-duration:\s*1ms/);
  assert.match(reducedMotionBlock, /transition-duration:\s*1ms/);
  assert.match(reducedMotionBlock, /transform:\s*none/);
});
