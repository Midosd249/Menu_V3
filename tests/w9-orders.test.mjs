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
  for (const forbidden of ["deliveryDriver", "eta", "tracking", "tip", "discount", "paymentMethod", "paid", "callHistory", "messageHistory"]) assert.doesNotMatch(ordersRoute, new RegExp(`\\b${forbidden}\\b`));
  assert.match(ordersRoute, /updateOrderStatus/);
  assert.match(ordersRoute, /NEXT/);
});

test("W9 Orders preserves selected order context in URL search state", () => {
  assert.match(ordersRoute, /location\.searchStr/);
  assert.match(ordersRoute, /new URLSearchParams\(searchStr\)/);
  assert.match(ordersRoute, /order:order\.id/);
  assert.match(ordersRoute, /delete current\.order/);
});
