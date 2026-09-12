import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const intelligence = fs.readFileSync("src/routes/studio/intelligence.tsx", "utf8");
const advisor = fs.readFileSync("src/lib/menu/growth-advisor.ts", "utf8");
const builder = fs.readFileSync("src/lib/menu/intelligence.ts", "utf8");

test("R4 surfaces verified analytics evidence without inventing business metrics", () => {
  assert.match(intelligence, /إشارات موثقة|Verified signals/);
  assert.match(intelligence, /الدليل:|Evidence:/);
  assert.match(intelligence, /الخطوة المقترحة:|Recommended:/);
  assert.match(intelligence, /advisor\.insights/);
  assert.doesNotMatch(intelligence, /revenue|conversionRate|salesTotal|profitability/i);
});

test("R4 keeps owner intelligence grounded in deterministic advisor outputs", () => {
  assert.match(builder, /buildMenuGrowthAdvisor/);
  assert.match(advisor, /VerifiedAnalyticsInsight/);
  assert.match(advisor, /evidenceAr|evidenceEn/);
  assert.match(advisor, /recommendationAr|recommendationEn/);
});

test("R4 does not turn verified insights into autonomous mutations", () => {
  assert.doesNotMatch(intelligence, /supabase|\.insert\(|\.update\(|\.delete\(|fetch\(/i);
});
