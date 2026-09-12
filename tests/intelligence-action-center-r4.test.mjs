import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("src/routes/studio/intelligence-actions.tsx", "utf8");


test("R4 action center stays grounded in the verified advisor", () => {
  assert.match(page, /buildMenuGrowthAdvisor/);
  assert.match(page, /getOwnerAnalytics/);
  assert.match(page, /days: 7/);
  assert.match(page, /advisor\.actions/);
  assert.match(page, /advisor\.summaryAr/);
  assert.match(page, /advisor\.summaryEn/);
});

test("R4 action center provides an explicit refresh flow", () => {
  assert.match(page, /Refresh actions/);
  assert.match(page, /load\(true\)/);
  assert.match(page, /refreshing/);
  assert.match(page, /animate-spin/);
});

test("R4 action center exposes priority counts without inventing business metrics", () => {
  assert.match(page, /highCount/);
  assert.match(page, /mediumCount/);
  assert.match(page, /All actions|كل الإجراءات/);
  assert.match(page, /High priority|أولوية عالية/);
  assert.match(page, /Medium priority|أولوية متوسطة/);
  assert.doesNotMatch(page, /revenue|conversionRate|salesTotal|profitability/i);
});

test("R4 action center remains owner-controlled and read-only", () => {
  assert.match(page, /لا يتم تنفيذ أي تغيير تلقائيًا/);
  assert.match(page, /Nothing is changed automatically/);
  assert.doesNotMatch(page, /supabase|\.insert\(|\.update\(|\.delete\(/i);
});
