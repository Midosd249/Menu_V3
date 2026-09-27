import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildInvoiceWhatsAppMessage, buildInvoiceWhatsAppUrl, type SubscriptionInvoice } from "./billing-whatsapp.ts";

const billingRoute = readFileSync("src/routes/studio/billing.tsx", "utf8");

const invoice: SubscriptionInvoice = {
  id: "invoice-1",
  invoiceNumber: "INV-20260917-ABC123",
  tenantId: "tenant-1",
  tenantName: "مطعم مذاق",
  ownerName: "Owner",
  ownerEmail: "owner@example.com",
  planCode: "pro",
  planNameAr: "احترافي",
  planNameEn: "Pro",
  amountSar: 1490,
  currency: "SAR",
  billingInterval: "annual",
  periodStart: "2026-09-01T00:00:00.000Z",
  periodEnd: "2027-09-01T00:00:00.000Z",
  status: "issued",
  issuedAt: "2026-09-17T00:00:00.000Z",
  notes: "Thank you for your continued partnership.",
};

test("PH-06 annual invoice WhatsApp message is explicit about issued status and interval", () => {
  const message = buildInvoiceWhatsAppMessage(invoice, "ar");
  assert.match(message, /INV-20260917-ABC123/);
  assert.match(message, /1490\.00 SAR/);
  assert.match(message, /سنوية/);
  assert.match(message, /لا تمثل هذه الرسالة إثبات دفع/);
  assert.match(message, /ملاحظات: Thank you for your continued partnership\./);
});

test("Billing upgrade CTA reuses the existing WhatsApp helper and carries tenant/plan context", () => {
  assert.match(billingRoute, /buildWhatsAppShareUrl/);
  assert.match(billingRoute, /billing\.tenantName/);
  assert.match(billingRoute, /desiredPlan/);
  assert.match(billingRoute, /Requested plan|الخطة المطلوبة/);
  assert.match(billingRoute, /PLATFORM_ADMIN_WHATSAPP_RECIPIENT = "966549598318"/);
});

test("Billing upgrade CTA uses the fixed platform-admin WhatsApp recipient", () => {
  assert.match(billingRoute, /buildWhatsAppShareUrl[\\s\\S]*PLATFORM_ADMIN_WHATSAPP_RECIPIENT/);
});

test("PH-05 invoice WhatsApp URL remains click-to-chat only", () => {
  const url = buildInvoiceWhatsAppUrl(invoice, "en");
  assert.ok(url.startsWith("https://wa.me/?text="));
  assert.equal(url.includes(invoice.tenantId), false);
  assert.match(url, /Menu%20V3/);
});
