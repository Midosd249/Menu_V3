import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

const intelligence = fs.readFileSync("src/routes/studio/intelligence.tsx", "utf8");
const health = fs.readFileSync("src/lib/menu/health.ts", "utf8");
const problemDetection = fs.readFileSync("src/lib/menu/problem-detection.ts", "utf8");
const actionPlan = fs.readFileSync("src/lib/menu/action-plan.ts", "utf8");
const shell = fs.readFileSync("src/components/studio-shell.tsx", "utf8");
const overview = fs.readFileSync("src/routes/studio/index.tsx", "utf8");

test("R2.4 owner intelligence presents the canonical health model", () => {
  assert.match(intelligence, /intelligence\.score/);
  assert.match(intelligence, /intelligence\.contentScore/);
  assert.match(intelligence, /intelligence\.presentationScore/);
  assert.match(intelligence, /intelligence\.operationsScore/);
  assert.match(intelligence, /Problem center/);
  assert.match(intelligence, /Priority & fixes/);
  assert.match(intelligence, /Open menu editor/);
});

test("R2.4 owner intelligence remains bilingual and grounded", () => {
  assert.match(intelligence, /lang === "ar"/);
  assert.match(intelligence, /lang === "ar" \? "ذكاء القائمة"/);
  assert.match(intelligence, /available analytics events/);
  assert.doesNotMatch(intelligence, /revenue|conversionRate|profitability/i);
});

test("R2.4 keeps deterministic health, findings, and actions separate", () => {
  assert.match(health, /export function computeHealth/);
  assert.match(problemDetection, /export function detectMenuProblems/);
  assert.match(actionPlan, /export function buildMenuActionPlan/);
  assert.match(intelligence, /detectMenuProblems\(snapshot\)/);
  assert.match(intelligence, /buildMenuActionPlan\(problems\)/);
});

test("R2.4 has a discoverable Studio entry point", () => {
  assert.match(shell, /\/studio\/intelligence/);
  assert.match(shell, /Menu Intelligence/);
  assert.match(shell, /ذكاء القائمة/);
  assert.match(overview, /\/studio\/intelligence/);
});

test("R2.4 preserves existing menu-first repair paths", () => {
  assert.match(intelligence, /href/);
  assert.match(intelligence, /\/studio\/menu/);
  assert.match(actionPlan, /\/studio\/menu/);
  assert.doesNotMatch(intelligence, /window\.fetch|fetch\(/);
});
