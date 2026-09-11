import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const report = fs.readFileSync("src/lib/menu/reports.ts", "utf8");
const route = fs.readFileSync("src/routes/studio/reports.tsx", "utf8");
const shell = fs.readFileSync("src/components/studio-shell.tsx", "utf8");

test("V5 report builder is deterministic and uses canonical intelligence inputs", () => {
  assert.match(report, /buildMenuReport/);
  assert.match(report, /buildMenuIntelligence/);
  assert.match(report, /buildMenuGrowthAdvisor/);
  assert.match(report, /getOwnerAnalytics|OwnerAnalytics/);
  assert.doesNotMatch(report, /revenue|conversionRate|salesTotal/i);
});

test("V5 report exposes safe export paths without a new provider dependency", () => {
  assert.match(route, /Print \/ Save PDF|طباعة \/ حفظ PDF/);
  assert.match(route, /mailto:/);
  assert.match(route, /navigator\.share/);
  assert.doesNotMatch(route, /fetch\(|supabase|resend|smtp|api[_-]?key/i);
});

test("V5 report is reachable from desktop and mobile Studio navigation", () => {
  assert.match(shell, /\/studio\/reports/);
  assert.match(shell, /FileText/);
});
