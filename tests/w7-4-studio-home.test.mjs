import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page = fs.readFileSync("src/components/studio-home.tsx", "utf8");
const route = fs.readFileSync("src/routes/studio/index.tsx", "utf8");

test("W7.4 Studio Home uses the existing Studio route and real data sources", () => {
  assert.match(route, /createFileRoute\("\/studio\/"\)/);
  assert.match(route, /StudioHome/);
  assert.match(page, /useStudio/);
  assert.match(page, /getOwnerAnalytics/);
  assert.match(page, /getOrdersDashboard/);
  assert.match(page, /buildMenuGrowthAdvisor/);
});

test("W7.4 Home exposes honest operational states", () => {
  assert.match(page, /Loading performance signals|جاري تحميل مؤشرات الأداء/);
  assert.match(page, /Performance unavailable|تعذر تحميل الأداء/);
  assert.match(page, /No recorded orders|لا توجد طلبات مسجلة/);
  assert.match(page, /Nothing needs attention right now|لا توجد نقاط تحتاج انتباهًا الآن/);
  assert.match(page, /No growth signal yet|لا توجد إشارة نمو كافية بعد/);
});

test("W7.4 Home does not introduce fabricated business metrics", () => {
  for (const forbidden of ["99,999", "12,450", "SAR 25,000", "conversion rate", "fake orders", "sample revenue"]) {
    assert.doesNotMatch(page.toLowerCase(), new RegExp(forbidden.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(page, /Math\.random\(|faker|mock.*order|sample.*order/i);
});

test("W7.4 Home remains permission-aware and route-safe", () => {
  assert.match(page, /canWriteSettings/);
  assert.match(page, /hrefAllowed/);
  assert.match(page, /\/studio\/growth/);
  assert.match(page, /\/studio\/orders/);
});

test("W7.4 Home is Arabic-first and responsive by construction", () => {
  assert.match(page, /ar-SA/);
  assert.match(page, /sm:grid-cols|lg:grid-cols/);
  assert.match(page, /focus-visible:ring-2/);
  assert.match(page, /aria-labelledby/);
  assert.match(page, /role=\"progressbar\"/);
});
