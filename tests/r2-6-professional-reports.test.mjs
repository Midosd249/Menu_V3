import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

const report = fs.readFileSync("src/lib/menu/reports.ts", "utf8");
const route = fs.readFileSync("src/routes/studio/reports.tsx", "utf8");

test("R2.6 report contains a complete verified executive structure", () => {
  assert.match(report, /buildMenuReport/);
  assert.match(report, /verifiedInsights/);
  assert.match(report, /readinessBasis/);
  assert.match(report, /buildMenuIntelligence/);
  assert.match(report, /buildMenuGrowthAdvisor/);
  assert.match(report, /OwnerAnalytics/);
  assert.match(route, /Professional report|التقرير الاحترافي/);
  assert.match(route, /Observed data|البيانات المسجلة/);
  assert.match(route, /Verified insights|ماذا تقول البيانات/);
  assert.match(route, /Next priorities|الأولوية التالية/);
});

test("R2.6 preserves Arabic/English, 7/30-day periods, and safe owner-initiated delivery", () => {
  assert.match(route, /setDays\(7\)/);
  assert.match(route, /setDays\(30\)/);
  assert.match(route, /Print \/ Save PDF|طباعة \/ حفظ PDF/);
  assert.match(route, /Share via WhatsApp|مشاركة عبر واتساب/);
  assert.match(route, /navigator\.clipboard/);
  assert.match(route, /wa\.me\/\?text=/);
  assert.doesNotMatch(route, /mailto:|smtp|resend|supabase|api[_-]?key/i);
});

test("R2.6 does not introduce unsupported commercial analytics claims", () => {
  assert.doesNotMatch(report, /revenue|profitability|salesTotal|customer satisfaction|statistical significance|conversionRate/i);
  assert.doesNotMatch(report, /الإيرادات|الربحية|رضا العملاء|دلالة إحصائية/);
  assert.match(report, /لا يمثل وعدًا بنتيجة تجارية|does not promise a business outcome/);
});

test("R2.6 print contract keeps interactive delivery controls out of printed output", () => {
  assert.match(route, /print:hidden/);
  assert.match(route, /print:break-inside-avoid/);
  assert.match(route, /print:block/);
  assert.doesNotMatch(route, /fixed.*z-|z-index-\[\d{4,}\]/);
});
