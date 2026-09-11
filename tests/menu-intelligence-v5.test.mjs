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

test("V6 report keeps safe print and WhatsApp export without a new provider dependency", () => {
  assert.match(route, /Print \/ Save PDF|طباعة \/ حفظ PDF/);
  assert.match(route, /Generate WhatsApp message|إنشاء رسالة واتساب/);
  assert.match(route, /wa\.me\/\?text=/);
  assert.doesNotMatch(route, /mailto:|navigator\.share|fetch\(|supabase|resend|smtp|api[_-]?key/i);
});

test("V6 keeps reports out of Studio navigation while retaining the route for the analytics workflow", () => {
  assert.doesNotMatch(shell, /\/studio\/reports/);
  assert.doesNotMatch(shell, /FileText/);
  assert.match(shell, /\/studio\/analytics/);
});
