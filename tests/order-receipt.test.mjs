import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migration = await readFile("migrations/20260925150000_order_receipt_vat_number.sql", "utf8");
const receipt = await readFile("src/components/order-receipt.tsx", "utf8");
const domain = await readFile("src/lib/menu/order-receipt.ts", "utf8");
const pub = await readFile("src/lib/menu/order-public.ts", "utf8");
const orders = await readFile("src/lib/menu/orders.ts", "utf8");
const studio = await readFile("src/routes/studio/orders.tsx", "utf8");
const publicMenu = await readFile("src/components/public-menu.tsx", "utf8");
const taste = await readFile("src/components/templates/taste.tsx", "utf8");
const signal = await readFile("src/components/templates/signal-table.tsx", "utf8");
const brand = await readFile("src/routes/studio/brand.tsx", "utf8");
const owner = await readFile("src/lib/menu/owner.ts", "utf8");
const types = await readFile("src/lib/menu/types.ts", "utf8");
const map = await readFile("src/lib/menu/map.ts", "utf8");

test("receipt uses existing order snapshots", () => {
  assert.match(domain, /order\.items\.map/);
  assert.match(domain, /lineTotal/);
  assert.match(pub, /from order_items oi where oi\.order_id = o\.id/);
  assert.doesNotMatch(migration, /create table.*receipt/i);
  assert.doesNotMatch(migration, /subscription_invoices/);
});
test("staff receipt keeps tenant and branch authorization", () => {
  assert.match(orders, /getClientTenantIds/);
  assert.match(orders, /tenant_members/);
  assert.match(domain, /getStaffOrderReceipt/);
  assert.match(domain, /has_branch_access/);
  assert.match(domain, /branch_id is not null/);
  assert.match(studio, /OrderReceiptButton/);
});
test("guest receipt is session-bound and non-enumerable", () => {
  assert.match(pub, /ANONYMOUS_SESSION_COOKIE/);
  assert.match(pub, /o\.anonymous_session_id = \$\{cookie\}/);
  assert.match(pub, /const anonymousSessionId = anonymousSession\.id/);
  assert.match(pub, /s\.id = o\.anonymous_session_id/);
  assert.match(pub, /s\.expires_at > now\(\)/);
  assert.match(publicMenu, /id: result\.data\.orderId/);
  assert.match(taste, /orderId=\{success\.id\}/);
  assert.match(signal, /orderId=\{success\.id\}/);
});
test("VAT is optional metadata and receipt is explicitly informal", () => {
  assert.match(migration, /vat_registration_number text not null default ''/);
  assert.match(types, /vatRegistrationNumber\?: string/);
  assert.match(map, /vatRegistrationNumber/);
  assert.match(owner, /vatRegistrationNumber/);
  assert.match(brand, /VAT registration number \(optional\)/);
  assert.match(receipt, /ZATCA-compliant tax invoice/);
  assert.doesNotMatch(receipt, /receipt\.customerName/);
  assert.doesNotMatch(receipt, /item\.note/);
  assert.match(receipt, /order-receipt-portal/);
  assert.match(receipt, /createPortal/);
  assert.match(receipt, /document\.title = `Receipt-\$\{data\.orderNumber\}`/);
  assert.match(receipt, /calendar: "gregory"/);
  assert.match(receipt, /previewOpen/);
  assert.match(receipt, /Receipt preview/);
  assert.match(receipt, /aria-labelledby="order-receipt-preview-title"/);
  assert.match(receipt, /printReceiptData/);
  assert.match(receipt, /@page \{ size: auto; margin: 8mm; \}/);
  assert.doesNotMatch(receipt, /does not confirm payment/);
  assert.doesNotMatch(pub, /payment|paid|charge|webhook/i);
});
test("print output is isolated and excludes staff-only content", () => {
  assert.match(receipt, /body\.printing-order-receipt > \*:not\(\.order-receipt-portal\)/);
  assert.match(receipt, /width: 80mm/);
  assert.match(receipt, /page-break-inside: avoid/);
  assert.match(receipt, /Receipt-\$\{data\.orderNumber\}/);
  assert.doesNotMatch(receipt, /Customer.*receipt\.customerName|receipt\.customerName.*Customer/);
});

test("staff and guest surfaces share one receipt renderer and preview flow", () => {
  assert.match(studio, /OrderReceiptButton/);
  assert.match(publicMenu, /OrderReceiptButton/);
  assert.match(taste, /OrderReceiptButton/);
  assert.match(signal, /OrderReceiptButton/);
  assert.equal((receipt.match(/function ReceiptView\(/g) ?? []).length, 1);
  assert.equal((receipt.match(/function printReceiptData\(/g) ?? []).length, 1);
});
