import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const shell = await readFile("src/components/studio-shell.tsx", "utf8");
const notifications = await readFile("src/lib/menu/order-notifications.ts", "utf8");
const whatsapp = await readFile("src/lib/menu/ai-whatsapp.ts", "utf8");
const aiCore = await readFile("src/lib/menu/ai-core.ts", "utf8");
const providers = await readFile("src/lib/menu/ai-providers.ts", "utf8");
const reports = await readFile("src/routes/studio/reports.tsx", "utf8");
const menu = await readFile("src/routes/studio/menu.tsx", "utf8");
const menuAi = await readFile("src/lib/menu/ai.ts", "utf8");
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
  assert.match(notifications, /tenantId: z\.string/);
  assert.match(notifications, /o\.tenant_id = \$\{data\.tenantId\}/);
  assert.match(notifications, /orders/);
  assert.match(notifications, /status = 'new'/);
  assert.match(shell, /getOrderNotificationSummary\(\{ data: \{ tenantId: tenant\.id \} \}\)/);
  assert.match(shell, /20_000/);
});

test("notification activity identifies the business and branch", () => {
  assert.match(notifications, /restaurantName/);
  assert.match(notifications, /branchName/);
  assert.match(shell, /نشاط الطلبات|Order activity/);
  assert.match(shell, /latestNewOrder\.restaurantName/);
  assert.match(shell, /latestNewOrder\.branchName/);
  assert.match(shell, /orderAlert\.restaurantName/);
  assert.match(shell, /orderAlert\.branchName/);
});

test("notification UI routes the owner to the canonical orders surface", () => {
  assert.match(shell, /to="\/studio\/orders"/);
  assert.match(shell, /Review order|مراجعة الطلب/);
  assert.match(shell, /Order activity and notifications|نشاط وتنبيهات الطلبات/);
});

test("WhatsApp report generation is review-first and uses the shared AI boundary", () => {
  assert.match(whatsapp, /generateStructuredAi/);
  assert.match(whatsapp, /reportText/);
  assert.match(whatsapp, /Never invent revenue/);
  assert.match(whatsapp, /generateWhatsAppReportMessage/);
  assert.match(aiCore, /callStructuredProvider/);
  assert.match(providers, /INCEPTION_API_KEY/);
  assert.match(providers, /api\.inceptionlabs\.ai\/v1/);
  assert.match(providers, /fetch\(`\$\{baseUrl\}\/chat\/completions`/);
  assert.match(reports, /generateWhatsAppReportMessage/);
  assert.match(reports, /wa\.me\/\?text=/);
});

test("reports are focused on print/PDF and WhatsApp instead of a standalone navigation product", () => {
  assert.match(reports, /Print \/ Save PDF|طباعة \/ حفظ PDF/);
  assert.match(reports, /Generate WhatsApp message|إنشاء رسالة واتساب/);
  assert.doesNotMatch(shell, /to: "\/studio\/reports"/);
});

test("AI product price extraction is review-first and wired into Add Product", () => {
  assert.match(menuAi, /operationSchema = z\.enum\(\["description", "english", "category", "tags", "allergens", "price"\]\)/);
  assert.match(menuAi, /menu_price/);
  assert.match(menuAi, /Do not invent or estimate a price/);
  assert.match(menuAi, /price: number \| null/);
  assert.match(menu, /type AiOperation = .*"price"/);
  assert.match(menu, /استخراج الاسم والسعر|Extract name & price/);
  assert.match(menu, /كبسة دجاج 20/);
  assert.match(menu, /applyAiPrice/);
  assert.match(menu, /تطبيق على المسودة|Apply to draft/);
  assert.match(menu, /price: aiPrice\.price/);
  assert.match(menu, /nameAr: aiPrice\.cleanedNameAr/);
});

test("the quality suite no longer references the retired V4 regression", () => {
  assert.doesNotMatch(packageJson, /menu-intelligence-v4\.test\.mjs/);
  assert.doesNotMatch(packageJson, /saudi-readiness\.test\.ts/);
});
