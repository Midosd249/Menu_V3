import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const css = fs.readFileSync(new URL("src/accessibility.css", root), "utf8");
const publicMenu = fs.readFileSync(new URL("src/components/public-menu.tsx", root), "utf8");
const rootRoute = fs.readFileSync(new URL("src/routes/__root.tsx", root), "utf8");
const langToggle = fs.readFileSync(new URL("src/components/lang-toggle.tsx", root), "utf8");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");

test("shared accessibility layer is loaded before protected themes", () => {
  assert.match(rootRoute, /accessibilityCss/);
  assert.ok(rootRoute.indexOf("href: accessibilityCss") < rootRoute.indexOf("href: themeCss"));
});

test("focus visibility accounts for fixed and sticky interface chrome", () => {
  assert.match(css, /scroll-margin-block:\s*7rem/);
  assert.match(css, /scroll-padding-block:\s*7rem/);
  assert.match(publicMenu, /fixed inset-x-3 bottom-3/);
  assert.match(publicMenu, /sticky top-0/);
});

test("modal dialogs expose names and contain keyboard focus", () => {
  assert.match(publicMenu, /role=\"dialog\" aria-modal=\"true\"/);
  assert.match(publicMenu, /querySelectorAll<HTMLElement>\("a\[href\],button/);
  assert.match(publicMenu, /event\.key === \"Escape\"/);
  assert.match(publicMenu, /event\.shiftKey/);
  assert.match(publicMenu, /aria-labelledby=\{titleId\}/);
  assert.match(publicMenu, /aria-labelledby=\"cart-title\"/);
});

test("public order form controls have programmatic labels and autocomplete hints", () => {
  for (const id of ["order-name", "order-phone", "order-email", "order-notes"]) {
    assert.match(publicMenu, new RegExp(`htmlFor=\\\"${escapeRegex(id)}\\\"`));
    assert.match(publicMenu, new RegExp(`id=\\\"${escapeRegex(id)}\\\"`));
  }
  assert.match(publicMenu, /autoComplete=\"name\"/);
  assert.match(publicMenu, /autoComplete=\"tel\"/);
  assert.match(publicMenu, /autoComplete=\"email\"/);
});

test("dynamic status and validation feedback are exposed to assistive technology", () => {
  assert.match(publicMenu, /role=\"alert\" aria-live=\"assertive\"/);
  assert.match(publicMenu, /aria-live=\"polite\"/);
  assert.match(publicMenu, /role=\"alertdialog\"/);
});

test("mixed-direction content uses semantic bidi isolation", () => {
  assert.match(publicMenu, /<bdi dir=\"ltr\" className=\"[^\"]*bidi-isolate/);
  assert.match(publicMenu, /dir=\"auto\"/);
  assert.match(css, /\.bidi-isolate\s*\{\s*unicode-bidi:\s*isolate/);
  assert.match(langToggle, /aria-label=/);
});

test("interactive public-menu controls meet the repository target-size baseline", () => {
  for (const token of ["size-10", "size-11", "min-h-10", "min-h-11", "min-h-12"]) {
    assert.match(publicMenu, new RegExp(escapeRegex(token)));
  }
});

test("accessibility layer preserves forced-colors and reduced-motion compatibility", () => {
  assert.match(css, /@media \(forced-colors:\s*active\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
});
