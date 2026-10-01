import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const ordersRoute = await readFile(new URL("../src/routes/studio/orders.tsx", import.meta.url), "utf8");
const contact = await import("../src/lib/menu/order-contact.ts");

const baseOrder = {
  id: "order-1", orderNumber: 42, tenantId: "demo-nafas", restaurantName: "نَفَس", branchName: "فرع العليا", status: "new", source: "web",
  customerName: "أحمد العتيبي", customerPhone: "0551234567", customerEmail: "", notes: "بدون سكر", currency: "SAR", subtotal: 48, total: 50,
  itemCount: 2, items: [], createdAt: "2026-09-15T17:00:00.000Z", updatedAt: "2026-09-15T17:00:00.000Z",
};

test("W9 Orders consumes shared locale state and translates status/UI copy", () => {
  assert.match(ordersRoute, /useLang\(\)/);
  assert.match(ordersRoute, /STATUS/);
  assert.doesNotMatch(ordersRoute, /const labels: Record<OrderStatus, string> =/);
  assert.match(ordersRoute, /lang === "ar"/);
});

test("W9 order contact normalizes Saudi local phones and preserves explicit international numbers", () => {
  assert.deepEqual(contact.buildOrderContact("0551234567"), { digits: "966551234567", tel: "tel:+966551234567", whatsapp: "https://wa.me/966551234567" });
  assert.deepEqual(contact.buildOrderContact("+971 50 123 4567"), { digits: "971501234567", tel: "tel:+971501234567", whatsapp: "https://wa.me/971501234567" });
  assert.equal(contact.buildOrderContact("5512345678"), null);
  assert.equal(contact.buildOrderContact(""), null);
});

test("W9 WhatsApp is editable click-to-chat content using only real order fields", () => {
  const ar = contact.buildOrderWhatsAppMessage(baseOrder, "ar");
  const en = contact.buildOrderWhatsAppMessage(baseOrder, "en");
  assert.equal(ar, "مرحباً أحمد العتيبي، معك نَفَس بخصوص طلبك #42. حالة الطلب الحالية: جديد.");
  assert.equal(en, "Hello أحمد العتيبي, this is نَفَس regarding order #42. Current status: New.");
  const url = contact.buildOrderWhatsAppUrl(baseOrder, "en");
  assert.match(url ?? "", /^https:\/\/wa\.me\/966551234567\?text=/);
  assert.ok(url.includes(encodeURIComponent(en)));
});

test("W9 contact actions are unavailable without a safely normalizable phone", () => {
  const noPhone = { ...baseOrder, customerPhone: "" };
  const ambiguous = { ...baseOrder, customerPhone: "5512345678" };
  assert.equal(contact.buildOrderContact(noPhone.customerPhone), null);
  assert.equal(contact.buildOrderWhatsAppUrl(noPhone, "ar"), null);
  assert.equal(contact.buildOrderContact(ambiguous.customerPhone), null);
  assert.equal(contact.buildOrderWhatsAppUrl(ambiguous, "ar"), null);
});

test("W9 Order Detail uses existing fields and omits unsupported operational claims", () => {
  for (const token of ["customerName", "customerPhone", "branchName", "source", "createdAt", "notes", "subtotal", "total", "items", "selectedOptions"]) assert.match(ordersRoute, new RegExp(token));
  for (const forbidden of ["deliveryDriver", "paymentMethod", "callHistory", "messageHistory"]) assert.doesNotMatch(ordersRoute, new RegExp(`\\b${forbidden}\\b`));
  assert.match(ordersRoute, /updateOrderStatus/);
  assert.match(ordersRoute, /NEXT/);
});

test("W9 Orders preserves selected order context in URL search state", () => {
  assert.match(ordersRoute, /location\.searchStr/);
  assert.match(ordersRoute, /new URLSearchParams\(searchStr\)/);
  assert.match(ordersRoute, /order:order\.id/);
  assert.match(ordersRoute, /delete current\.order/);
});


const orderSource = await readFile(new URL("../src/lib/menu/orders.ts", import.meta.url), "utf8");
const schemaMigration = await readFile(new URL("../migrations/20261001195000_order_preparation_time.sql", import.meta.url), "utf8");
const { validatePreparationDurationMinutes, PREPARATION_DURATION_PRESETS } = await import("../src/lib/menu/order-preparation.ts");

test("W9 preparation duration accepts one to 120 whole minutes and all quick presets", () => {
  assert.deepEqual(PREPARATION_DURATION_PRESETS, [3, 5, 10, 15, 20, 30]);
  for (const minutes of [1, 3, 5, 10, 15, 20, 30, 120]) {
    assert.deepEqual(validatePreparationDurationMinutes(minutes), { ok: true, data: minutes });
  }
});

test("W9 preparation duration rejects zero, negative, decimal, non-numeric, and out-of-range inputs", () => {
  for (const value of [0, -1, 120.5, 5.5, "5", "abc", null, undefined, NaN, Infinity, -Infinity, 121]) {
    assert.equal(validatePreparationDurationMinutes(value).ok, false, String(value));
  }
});

test("W9 confirmation remains authenticated and derives tenant/branch scope from the order row", () => {
  assert.match(orderSource, /\.middleware\(\[authMiddleware\]\)/);
  assert.match(orderSource, /select tenant_id, branch_id, status/);
  assert.match(orderSource, /authorizeMutation\(context\.userId, "orders\.write"/);
  assert.match(orderSource, /tenantId: currentRows\[0\]\.tenant_id/);
  assert.match(orderSource, /branchId: currentRows\[0\]\.branch_id/);
  assert.doesNotMatch(orderSource, /tenantId: data\./);
  assert.doesNotMatch(orderSource, /branchId: data\./);
});

test("W9 confirmation persists status, duration, server ETA, and the existing audit event atomically under row lock", () => {
  assert.match(orderSource, /with locked as \(\s*select status as from_status, clock_timestamp\(\) as confirmation_timestamp/);
  assert.match(orderSource, /for update/);
  assert.match(orderSource, /preparation_duration_minutes = case/);
  assert.match(orderSource, /estimated_ready_at = case/);
  assert.match(orderSource, /confirmation_timestamp \+ \(\$\{duration\} \* interval '1 minute'\)/);
  assert.match(orderSource, /insert into order_status_events/);
  assert.match(orderSource, /from updated/);
});

test("W9 confirmation does not use order creation time or automatically mark the order ready", () => {
  assert.match(orderSource, /clock_timestamp\(\) as confirmation_timestamp/);
  assert.doesNotMatch(orderSource, /estimated_ready_at\\s*=\\s*[^;]*created_at/);
  assert.doesNotMatch(orderSource, /status\s*=\s*'ready'.*estimated_ready_at/s);
  assert.doesNotMatch(orderSource, /auto.*ready/i);
});

test("W9 migration is nullable, additive, and has no index, trigger, or backfill", () => {
  assert.match(schemaMigration, /add column if not exists preparation_duration_minutes integer/);
  assert.match(schemaMigration, /add column if not exists estimated_ready_at timestamptz/);
  assert.doesNotMatch(schemaMigration, /not null/i);
  assert.doesNotMatch(schemaMigration, /create index/i);
  assert.doesNotMatch(schemaMigration, /create trigger/i);
  assert.doesNotMatch(schemaMigration, /update orders/i);
});

test("W9 Orders displays preparation duration and estimated ready time in Arabic and English", () => {
  assert.match(ordersRoute, /مدة التحضير/);
  assert.match(ordersRoute, /Preparation time/);
  assert.match(ordersRoute, /الوقت المتوقع للجهوزية/);
  assert.match(ordersRoute, /Estimated ready/);
  assert.match(ordersRoute, /dir="ltr"/);
  assert.match(ordersRoute, /date\(order\.estimatedReadyAt,lang\)/);
});

test("W9 mobile confirmation picker keeps presets separate from whole-minute custom input", () => {
  assert.match(ordersRoute, /grid-cols-2 gap-2 sm:grid-cols-3/);
  assert.match(ordersRoute, /PREPARATION_DURATION_PRESETS\.map/);
  assert.match(ordersRoute, /type="number"/);
  assert.match(ordersRoute, /min=\{CUSTOM_PREPARATION_DURATION_MINUTES\.min\}/);
  assert.match(ordersRoute, /max=\{CUSTOM_PREPARATION_DURATION_MINUTES\.max\}/);
  assert.match(ordersRoute, /step=\{1\}/);
  assert.match(ordersRoute, /aria-pressed/);
});


test("W9 tenant isolation remains enforced for order access", () => {
  assert.match(orderSource, /o\.tenant_id in \(select t\.id from tenants t where t\.owner_user_id = \$\{userId\}\)/);
  assert.match(orderSource, /tm\.tenant_id = o\.tenant_id/);
});

test("W9 concurrent confirmations keep compare-and-set locking and prevent a second update", () => {
  assert.match(orderSource, /for update/);
  assert.match(orderSource, /o\.status = locked\.from_status/);
  assert.match(orderSource, /\$\{isNewConfirmation\} or locked\.from_status <> 'new'/);
  assert.match(orderSource, /if \(!rows\[0\]\) return \{ ok: false, code: "conflict"/);
});

test("W9 legacy orders with null preparation data remain representable", () => {
  assert.match(orderSource, /preparationDurationMinutes: row\.preparation_duration_minutes == null \? null/);
  assert.match(orderSource, /estimatedReadyAt: row\.estimated_ready_at == null \? null/);
  assert.match(ordersRoute, /order\.preparationDurationMinutes == null/);
  assert.match(ordersRoute, /order\.estimatedReadyAt \?/);
});
