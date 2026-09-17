import assert from "node:assert/strict";
import test from "node:test";
import { buildInvoiceWhatsAppMessage, buildInvoiceWhatsAppUrl, type SubscriptionInvoice } from "./billing.ts";

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
  amountSar: 149,
  currency: "SAR",
  periodStart: "2026-09-01T00:00:00.000Z",
  periodEnd: "2026-10-01T00:00:00.000Z",
  status: "issued",
  issuedAt: "2026-09-17T00:00:00.000Z",
};

test("PH-05 invoice WhatsApp message is explicit about issued status", () => {
  const message = buildInvoiceWhatsAppMessage(invoice, "ar");
  assert.match(message, /INV-20260917-ABC123/);
  assert.match(message, /149\.00 SAR/);
  assert.match(message, /لا تمثل هذه الرسالة إثبات دفع/);
});

test("PH-05 invoice WhatsApp URL uses click-to-chat only", () => {
  const url = buildInvoiceWhatsAppUrl(invoice, "en");
  assert.ok(url.startsWith("https://wa.me/?text="));
  assert.equal(url.includes(invoice.tenantId), false);
  assert.match(url, /Menu%20V3/);
});
