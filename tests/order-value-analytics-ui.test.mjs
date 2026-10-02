import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const route = readFileSync("src/routes/studio/analytics.tsx", "utf8");
const copy = readFileSync("src/lib/menu/i18n.ts", "utf8");

test("Order Value Analytics UI consumes the server-side order value contract", () => {
  assert.match(route, /getOwnerOrderValueAnalytics/);
  assert.match(route, /period: orderValuePeriod/);
  assert.match(route, /branchId: branchId === "all" \? undefined : branchId/);
});

test("Order Value Analytics UI exposes the approved period selectors", () => {
  assert.match(route, /today/);
  assert.match(route, /week/);
  assert.match(route, /month/);
  assert.match(route, /custom/);
  assert.match(route, /datetime-local/);
});

test("Order Value Analytics UI exposes the approved metrics and transparency notice", () => {
  assert.match(route, /Order Value/);
  assert.match(route, /Order Count/);
  assert.match(route, /Average Order Value/);
  assert.match(route, /dailyTrend/);
  assert.match(route, /Payment settlement, refunds, taxes, and fees are not included/);
});

test("Order Value Analytics copy remains bilingual and uses the approved terminology", () => {
  assert.match(copy, /قيمة الطلبات/);
  assert.match(copy, /Order Value/);
  assert.match(copy, /متوسط قيمة الطلب/);
  assert.match(copy, /Average Order Value/);
  assert.match(copy, /تسوية المدفوعات أو الاستردادات أو الضرائب أو الرسوم/);
});
