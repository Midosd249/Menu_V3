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
test("staff receipt keeps existing authorization", () => {
  assert.match(orders, /getClientTenantIds/);
  assert.match(orders, /tenant_members/);
  assert.match(studio, /OrderReceiptButton/);
});
test("guest receipt is session-bound and non-enumerable", () => {
  assert.match(pub, /ANONYMOUS_SESSION_COOKIE/);
  assert.match(pub, /o\.anonymous_session_id = \$\{cookie\}/);
  assert.match(pub, /s\.id = o\.anonymous_session_id/);
  assert.match(pub, /s\.expires_at > now\(\)/);
  assert.match(publicMenu, /orderId: result\.data\.orderId/);
  assert.match(taste, /orderId=\{success\.id\}/);
  assert.match(signal, /orderId=\{success\.id\}/);
});
test("VAT is optional metadata and receipt is explicitly informal", () => {
  assert.match(migration, /vat_registration_number text not null default ''/);
  assert.match(types, /vatRegistrationNumber: string/);
  assert.match(map, /vatRegistrationNumber/);
  assert.match(owner, /vatRegistrationNumber/);
  assert.match(brand, /VAT registration number \(optional\)/);
  assert.match(receipt, /Not recorded in order data/);
  assert.match(receipt, /ZATCA-compliant tax invoice/);
  assert.match(receipt, /does not confirm payment/);
  assert.doesNotMatch(pub, /payment|paid|charge|webhook/i);
});
test("staff and guest surfaces expose print receipt", () => {
  assert.match(studio, /OrderReceiptButton/);
  assert.match(publicMenu, /OrderReceiptButton/);
  assert.match(taste, /OrderReceiptButton/);
  assert.match(signal, /OrderReceiptButton/);
});
