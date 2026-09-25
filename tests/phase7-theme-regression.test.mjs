import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

const templateQa = fs.readFileSync("scripts/template-qa.mjs", "utf8");
const qualityWorkflow = fs.readFileSync(".github/workflows/quality.yml", "utf8");
const baseline = JSON.parse(fs.readFileSync("docs/performance/baselines/2026-09-22-phase6-golden-performance.json", "utf8"));

const themes = ["essential", "editorial", "noir", "heritage", "gallery"];
const widths = [320, 375, 390, 430];

test("Phase 7 protects all five themes in both directions", () => {
  for (const theme of themes) assert.match(templateQa, new RegExp("\"" + theme + "\""));
  assert.match(templateQa, /const languages = \["ar", "en"\]/);
  assert.match(templateQa, /targetUrl\.searchParams\.set\("lang", language\)/);
  assert.match(templateQa, /targetUrl\.searchParams\.set\("theme", theme\)/);
});

test("Phase 7 responsive matrix retains the required mobile widths", () => {
  for (const width of widths) assert.match(templateQa, new RegExp("width: " + width + ","));
});

test("Phase 7 keeps the existing golden fixture evidence as the performance reference", () => {
  assert.equal(baseline.fixture, "golden-public-menu-30");
  assert.equal(baseline.fixtureShape.productCount, 30);
  assert.equal(baseline.fixtureShape.imageBearingProductCount, 30);
  assert.equal(baseline.fixtureShape.featuredProductCount, 30);
  assert.equal(baseline.viewport.width, 390);
  assert.equal(baseline.viewport.height, 844);
  assert.equal(baseline.canonicalMode, "current");
  assert.match(qualityWorkflow, /Golden performance fixture — 30 products/);
  assert.match(qualityWorkflow, /Browser template QA — all themes/);
});

test("Phase 7 does not introduce a numeric performance budget", () => {
  assert.match(qualityWorkflow, /npm run performance:golden/);
  assert.doesNotMatch(templateQa, /LCP.*(?:<|<=|budget|threshold)/i);
});


test("Phase 7 waits for preview hydration before evaluating rendered theme gates", () => {
  assert.ok(templateQa.includes("await page.waitForFunction("));
  assert.ok(templateQa.includes('document.documentElement.dataset.menuTheme || document.querySelector("h1, h2, h3, h4, h5, h6")'));
  assert.ok(templateQa.includes("{ timeout: 10000 }"));
});
