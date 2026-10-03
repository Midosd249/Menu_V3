import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

const root = fs.readFileSync("src/routes/__root.tsx", "utf8");
const controller = fs.readFileSync("src/components/menu-theme-controller.tsx", "utf8");
const runtime = fs.readFileSync("src/lib/theme/runtime-styles.ts", "utf8");
const premium = fs.readFileSync("src/theme-premium.css", "utf8");
const publicRoute = fs.readFileSync("src/routes/m.$slug.tsx", "utf8");
const branchRoute = fs.readFileSync("src/routes/m.$slug.$branch.tsx", "utf8");

const themes = ["essential", "editorial", "noir", "heritage", "gallery"];

test("theme CSS is not eagerly linked from the root document", () => {
  assert.doesNotMatch(root, /theme-(premium|essential|noir|heritage|gallery|refinements|refinements-v2|noir-hardening|gallery-hardening|public-quality-recovery|price-consistency|gallery-canva-parity|w16-mobile-qr-hardening|final-visual-hardening|qr-final-fixes|signal-table)\.css/);
  assert.doesNotMatch(root, /quick-add-compact-refinement\.css/);
});

test("runtime stylesheet registry covers every canonical theme", () => {
  for (const theme of themes) assert.match(runtime, new RegExp(`  ${theme}:\\s*\\[`));
  assert.match(runtime, /SHARED_PUBLIC_STYLESHEETS/);
  assert.match(runtime, /syncThemeStylesheets/);
  assert.match(controller, /syncThemeStylesheets\(key\)/);
});

test("public menu SSR links only the active theme stylesheet set", () => {
  assert.match(publicRoute, /getThemeStylesheets\(activeTheme\)/);
  assert.match(branchRoute, /getThemeStylesheets\(activeTheme\)/);
});

test("shared runtime CSS no longer contains inactive theme selectors", () => {
  assert.doesNotMatch(premium, /data-menu-theme=/);
});

test("all five theme keys remain explicit and no inactive stylesheet is hard-coded into the controller", () => {
  for (const theme of themes) assert.match(runtime, new RegExp(theme));
  assert.doesNotMatch(controller, /theme-(?:premium|essential|noir|heritage|gallery)\.css/);
});
