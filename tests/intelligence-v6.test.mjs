import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const shell = await readFile("src/components/studio-shell.tsx", "utf8");
const notifications = await readFile("src/lib/menu/order-notifications.ts", "utf8");
const whatsapp = await readFile("src/lib/menu/ai-whatsapp.ts", "utf8");
const reports = await readFile("src/routes/studio/reports.tsx", "utf8");
const packageJson = await readFile("package.json", "utf8");

for (const [name, source] of [["shell", shell], ["notifications", notifications], ["whatsapp", whatsapp], ["reports", reports]]) {
  test(`${name} does not contain the retired Saudi readiness feature`, () => {
    assert.doesNotMatch(source, /saudi-readiness|Saudi Menu Readiness|جاهزية القائمة السعودية/);
  });
}

test("owner order notifications use authenticated tenant-scoped server data", () => {
  assert.match(notifications, /authMiddleware/);
  assert.match(notifications, /context\.userId/);
  assert.match(notifications, /tenant_members/);
  assert.match(notifications, /orders/);
  assert.match(notifications, /status = 'new'/);
  assert.match(shell, /getOrderNotificationSummary/);
  assert.match(shell, /20_000/);
});

test("notification UI routes the owner to the canonical orders surface", () => {
  assert.match(shell, /to="\/studio\/orders"/);
  assert.match(shell, /Review order|مراجعة الطلب/);
  assert.match(shell, /Order notifications|تنبيهات الطلبات/);
});

test("WhatsApp report generation is review-first and uses the existing Mercury provider", () => {
  assert.match(whatsapp, /INCEPTION_API_KEY/);
  assert.match(whatsapp, /api\.inceptionlabs\.ai\/v1\/chat\/completions/);
  assert.match(whatsapp, /reportText/);
  assert.match(whatsapp, /Never invent revenue/);
  assert.match(whatsapp, /generateWhatsAppReportMessage/);
  assert.match(reports, /generateWhatsAppReportMessage/);
  assert.match(reports, /wa\.me\/\?text=/);
});

test("reports are focused on print/PDF and WhatsApp instead of a standalone navigation product", () => {
  assert.match(reports, /Print \/ Save PDF|طباعة \/ حفظ PDF/);
  assert.match(reports, /Generate WhatsApp message|إنشاء رسالة واتساب/);
  assert.doesNotMatch(shell, /to: "\/studio\/reports"/);
});

test("the quality suite no longer references the retired V4 regression", () => {
  assert.doesNotMatch(packageJson, /menu-intelligence-v4\.test\.mjs/);
  assert.doesNotMatch(packageJson, /saudi-readiness\.test\.ts/);
});
