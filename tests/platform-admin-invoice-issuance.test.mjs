import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync("migrations/20260925130000_platform_admin_invoice_issuance.sql", "utf8");
const billing = readFileSync("src/lib/menu/billing.ts", "utf8");
const platformBilling = readFileSync("src/lib/menu/platform-billing.ts", "utf8");
const adminUi = readFileSync("src/routes/admin/users.tsx", "utf8");
const tenantUi = readFileSync("src/routes/studio/billing.tsx", "utf8");

test("platform invoice migration adds notes and a cache=1 sequential generator without payment logic", () => {
  assert.match(migration, /ADD COLUMN IF NOT EXISTS notes TEXT/);
  assert.match(migration, /CREATE SEQUENCE IF NOT EXISTS menu_v3\.subscription_invoice_number_seq/);
  assert.match(migration, /CACHE 1/);
  assert.doesNotMatch(migration, /payment|webhook|gateway|charge/i);
});

test("invoice issuance is platform-admin authorized and tenant billing has no issuance function", () => {
  assert.match(platformBilling, /export const issuePlatformInvoice/);
  assert.match(platformBilling, /requirePlatformAdmin\(userId\)/);
  assert.match(platformBilling, /created_by_user_id/);
  assert.match(platformBilling, /nextval\('menu_v3\.subscription_invoice_number_seq'\)/);
  assert.doesNotMatch(billing, /export const issueSubscriptionInvoice/);
});

test("tenant invoice history is restricted to invoices issued by a Platform Admin", () => {
  assert.match(billing, /menu_v3\.is_platform_admin\(i\.created_by_user_id\) = true/);
  assert.doesNotMatch(tenantUi, /Issue invoice|إصدار فاتورة|issueSubscriptionInvoice|buildInvoiceWhatsAppUrl/);
});

test("Platform Admin UI provides issue, invoice history, print, and WhatsApp actions", () => {
  assert.match(adminUi, /issuePlatformInvoice/);
  assert.match(adminUi, /getPlatformInvoices/);
  assert.match(adminUi, /Amount \(SAR\)|المبلغ \(SAR\)/);
  assert.match(adminUi, /Period start|بداية الفترة/);
  assert.match(adminUi, /Period end|نهاية الفترة/);
  assert.match(adminUi, /Notes|ملاحظات/);
  assert.match(adminUi, /buildInvoiceWhatsAppUrl/);
  assert.match(adminUi, /View \/ print|عرض \/ طباعة/);
});
