export type BillingInterval = "monthly" | "annual";

export type SubscriptionInvoice = {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  ownerName: string;
  ownerEmail: string;
  planCode: string;
  planNameAr: string;
  planNameEn: string;
  amountSar: number;
  currency: "SAR";
  billingInterval: BillingInterval;
  periodStart: string;
  periodEnd: string;
  status: "issued" | "void";
  issuedAt: string;
  notes: string;
};

export function buildInvoiceWhatsAppMessage(invoice: SubscriptionInvoice, lang: "ar" | "en"): string {
  const period = `${formatInvoiceDate(invoice.periodStart, lang)} → ${formatInvoiceDate(invoice.periodEnd, lang)}`;
  const interval = invoice.billingInterval === "annual"
    ? (lang === "ar" ? "سنوية" : "Annual")
    : (lang === "ar" ? "شهرية" : "Monthly");
  if (lang === "ar") {
    return [
      "فاتورة اشتراك Menu V3",
      `رقم الفاتورة: ${invoice.invoiceNumber}`,
      `العميل: ${invoice.tenantName}`,
      `الخطة: ${invoice.planNameAr}`,
      `الفوترة: ${interval}`,
      `الفترة: ${period}`,
      `المبلغ: ${invoice.amountSar.toFixed(2)} ${invoice.currency}`,
      ...(invoice.notes ? [`ملاحظات: ${invoice.notes}`] : []),
      "الحالة: صادرة — لا تمثل هذه الرسالة إثبات دفع أو تحصيلاً إلكترونياً.",
    ].join("\n");
  }
  return [
    "Menu V3 Subscription Invoice",
    `Invoice: ${invoice.invoiceNumber}`,
    `Customer: ${invoice.tenantName}`,
    `Plan: ${invoice.planNameEn}`,
    `Billing: ${interval}`,
    `Period: ${period}`,
    `Amount: ${invoice.amountSar.toFixed(2)} ${invoice.currency}`,
    ...(invoice.notes ? [`Notes: ${invoice.notes}`] : []),
    "Status: Issued — this message is not proof of payment or electronic collection.",
  ].join("\n");
}

export function buildInvoiceWhatsAppUrl(invoice: SubscriptionInvoice, lang: "ar" | "en"): string {
  return `https://wa.me/?text=${encodeURIComponent(buildInvoiceWhatsAppMessage(invoice, lang))}`;
}

function formatInvoiceDate(value: string, lang: "ar" | "en"): string {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", { dateStyle: "medium", timeZone: "Asia/Riyadh" }).format(new Date(value));
}
