import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const overview = await readFile("src/routes/studio/index.tsx", "utf8");
const guests = await readFile("src/routes/studio/guests.tsx", "utf8");

const protectedStudioRoutes = [
  "/studio/menu",
  "/studio/import",
  "/studio/options",
  "/studio/design",
  "/studio/brand",
  "/studio/preview",
  "/studio/qr",
  "/studio/branches",
  "/studio/intelligence",
  "/studio/intelligence-actions",
  "/studio/analytics",
  "/studio/reports",
  "/studio/growth",
  "/studio/guests",
  "/studio/orders",
  "/studio/team",
  "/studio/settings",
];

test("Studio overview exposes every completed owner-facing capability", () => {
  for (const route of protectedStudioRoutes) assert.match(overview, new RegExp(route.replaceAll("/", "\\/")));
  assert.match(overview, /All Studio capabilities/);
  assert.match(overview, /كل قدرات الاستوديو/);
  assert.match(overview, /Guest relationships/);
  assert.match(overview, /علاقات الضيوف/);
});

test("R9 guest relationship surface is bilingual, including loyalty", () => {
  for (const text of ["برنامج الولاء", "التقييمات والملاحظات", "الحملات", "الاحتفاظ", "إدارة الضيوف والاحتفاظ"]) {
    assert.match(guests, new RegExp(text));
  }
  for (const text of ["Loyalty", "Feedback / Reviews", "Campaigns", "Retention", "Guest CRM & Retention"]) {
    assert.match(guests, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(guests, /useLang/);
  assert.match(guests, /lang === "ar"/);
});

test("R9 surface remains explicitly non-autonomous", () => {
  assert.match(guests, /لا يتم إرسال رسائل أو منح مكافآت|no automatic message/);
  assert.match(guests, /owner-controlled|تحكم كامل للمالك/);
});
