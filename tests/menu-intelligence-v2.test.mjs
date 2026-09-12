import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

const source = fs.readFileSync("src/lib/menu/intelligence.ts", "utf8");
const health = fs.readFileSync("src/lib/menu/health.ts", "utf8");
const types = fs.readFileSync("src/lib/menu/types.ts", "utf8");
const problems = fs.readFileSync("src/lib/menu/problem-detection.ts", "utf8");
const actions = fs.readFileSync("src/lib/menu/action-plan.ts", "utf8");
const route = fs.readFileSync("src/routes/studio/intelligence.tsx", "utf8");
const shell = fs.readFileSync("src/components/studio-shell.tsx", "utf8");
const overview = fs.readFileSync("src/routes/studio/index.tsx", "utf8");

test("Menu Health defines an explainable deterministic contract", () => {
  assert.match(types, /HealthDimension/);
  for (const key of ["publishing", "content", "translation", "visual", "organization", "commercial", "availability"]) assert.ok(health.includes(`dim("${key}"`));
  assert.match(health, /Number\.isFinite\(p\.price\)/);
  assert.doesNotMatch(health, /price.*===.*0|price.*<=.*0/);
});

test("Problem Detection derives findings from canonical health and menu data", () => {
  assert.match(problems, /health\.attention/);
  assert.match(problems, /duplicateNames/);
  assert.match(problems, /description-ar/);
  assert.match(problems, /category/);
  assert.match(problems, /currency/);
  assert.doesNotMatch(problems, /revenue|conversionRate|salesTotal/i);
});

test("Priority layer groups detected problems into bounded actions", () => {
  assert.match(actions, /buildMenuActionPlan/);
  assert.match(actions, /slice\(0, 6\)/);
  assert.match(actions, /high: 0/);
  assert.match(source, /detectMenuProblems/);
  assert.match(source, /buildMenuActionPlan/);
});

test("Menu Intelligence keeps the canonical health score", () => {
  assert.match(source, /snapshot\.health/);
  assert.match(source, /health\.score/);
  assert.doesNotMatch(source, /contentScore \* 0\.4/);
  assert.doesNotMatch(source, /function percentage/);
});

test("Existing owner intelligence UX remains grounded", () => {
  assert.match(route, /What needs your attention|ماذا يحتاج انتباهك/);
  assert.match(route, /Recommended growth actions|خطوات النمو المقترحة/);
  assert.match(route, /Open menu editor|فتح محرر القائمة/);
  assert.match(route, /not a sales or conversion claim|available analytics events/);
});

test("Studio navigation remains available", () => {
  assert.match(shell, /\/studio\/intelligence/);
  assert.match(shell, /Menu Intelligence/);
  assert.match(shell, /ذكاء القائمة/);
  assert.match(shell, /MOBILE_PRIMARY/);
  assert.match(overview, /\/studio\/intelligence/);
});
