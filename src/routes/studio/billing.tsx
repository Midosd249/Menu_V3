import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flash } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { getBillingSummary, type BillingSummary, type SubscriptionInvoice } from "@/lib/menu/billing";
import { useStudio } from "@/lib/menu/studio";

export const Route = createFileRoute("/studio/billing")({ component: BillingPage });

function BillingPage() {
  const { lang } = useLang();
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [selected, setSelected] = useState<SubscriptionInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const result = await getBillingSummary();
      if (!result.ok) setError(result.error);
      else setBilling(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر تحميل الفوترة" : "Unable to load billing"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);


  const intervalLabel = billing?.billingInterval === "annual"
    ? (lang === "ar" ? "سنوية" : "Annual")
    : (lang === "ar" ? "شهرية" : "Monthly");
  const currentPrice = billing?.billingInterval === "annual" ? billing.annualPriceSar : billing?.monthlyPriceSar;

  if (loading) return <div className="grid min-h-[50vh] place-items-center text-sm text-muted">{lang === "ar" ? "جارٍ تحميل الفوترة…" : "Loading billing…"}</div>;

  return (
    <main className="mx-auto grid max-w-4xl gap-5" dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="grid gap-2 rounded-3xl border border-line bg-paper p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted">Menu V3</p>
            <h1 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? "الفوترة والفواتير" : "Billing & invoices"}</h1>
          </div>
          <Button variant="outline" onClick={() => void load()} disabled={loading}>
            <RefreshCw className="size-4" />
            {lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          {lang === "ar"
            ? "تعرض هذه الصفحة فقط الفواتير التي أصدرها مالك المنصة. يمكنك مراجعة الفاتورة وطباعتها؛ لا يمكن إصدار أو إرسال الفواتير من حساب العميل."
            : "This page only shows invoices issued by the Platform Owner. You can review and print them; customers cannot issue or send invoices."}
        </p>
      </header>

      <Flash error={error} ok={ok} />

      {billing ? (
        <section className="grid gap-4 rounded-3xl border border-line bg-paper p-5 md:p-7">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted">{lang === "ar" ? "الحساب" : "Account"}</p>
              <p className="mt-1 text-lg font-semibold">{billing.tenantName}</p>
              <p className="text-sm text-muted">{billing.ownerName || billing.ownerEmail}</p>
            </div>
            <div className="md:text-end">
              <p className="text-xs text-muted">{lang === "ar" ? "الخطة الحالية" : "Current plan"}</p>
              <p className="mt-1 text-lg font-semibold">{lang === "ar" ? billing.planNameAr : billing.planNameEn}</p>
              <p className="text-sm text-muted" dir="ltr">{currentPrice?.toFixed(2)} SAR / {billing.billingInterval === "annual" ? "year" : "month"} · {intervalLabel} · {billing.status}</p>
            </div>
          </div>

          {billing.trialEndsAt ? <p className="rounded-2xl bg-sand/40 px-4 py-3 text-sm text-muted">{lang === "ar" ? "نهاية التجربة:" : "Trial ends:"} {formatDate(billing.trialEndsAt, lang)}</p> : null}

       </section>
      ) : null}

      <section className="grid gap-3">
        <h2 className="px-1 text-sm font-semibold">{lang === "ar" ? "الفواتير الصادرة" : "Issued invoices"}</h2>
        {billing?.invoices.length ? billing.invoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} lang={lang} onSelect={setSelected} />
        )) : (
          <div className="rounded-3xl border border-dashed border-line p-7 text-sm text-muted">
            {lang === "ar" ? "لا توجد فواتير صادرة بعد." : "No invoices have been issued yet."}
          </div>
        )}
      </section>

      {selected ? <InvoicePrintView invoice={selected} lang={lang} onClose={() => setSelected(null)} /> : null}
    </main>
  );
}

function InvoiceCard({ invoice, lang, onSelect }: { invoice: SubscriptionInvoice; lang: "ar" | "en"; onSelect: (invoice: SubscriptionInvoice) => void }) {
  const interval = invoice.billingInterval === "annual" ? (lang === "ar" ? "سنوية" : "Annual") : (lang === "ar" ? "شهرية" : "Monthly");
  return (
    <article className="grid gap-3 rounded-3xl border border-line bg-paper p-4 md:grid-cols-[1fr_auto] md:items-center md:p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <strong dir="ltr">{invoice.invoiceNumber}</strong>
          <span className="rounded-full bg-sand px-2 py-1 text-[11px]">{lang === "ar" ? invoice.planNameAr : invoice.planNameEn}</span>
          <span className="rounded-full bg-sand px-2 py-1 text-[11px]">{interval}</span>
          <span className="rounded-full bg-sand px-2 py-1 text-[11px]">{lang === "ar" ? "صادرة" : "Issued"}</span>
        </div>
        <p className="mt-1 text-sm text-muted">{formatDate(invoice.periodStart, lang)} → {formatDate(invoice.periodEnd, lang)}</p>
        <p className="mt-1 text-sm font-semibold" dir="ltr">{invoice.amountSar.toFixed(2)} {invoice.currency}</p>
        {invoice.notes ? <p className="mt-1 text-xs text-muted">{invoice.notes}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => onSelect(invoice)}><Printer className="size-4" />{lang === "ar" ? "عرض / طباعة" : "View / print"}</Button>
      </div>
    </article>
  );
}

function InvoicePrintView({ invoice, lang, onClose }: { invoice: SubscriptionInvoice; lang: "ar" | "en"; onClose: () => void }) {
  const interval = invoice.billingInterval === "annual" ? (lang === "ar" ? "سنوية" : "Annual") : (lang === "ar" ? "شهرية" : "Monthly");
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={lang === "ar" ? "الفاتورة" : "Invoice"}>
      <div className="mx-auto my-6 max-w-2xl rounded-3xl bg-paper p-6 shadow-xl md:p-8" id="ph05-invoice-print">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="text-xs text-muted">Menu V3</p>
            <h2 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? "فاتورة اشتراك" : "Subscription invoice"}</h2>
          </div>
          <strong dir="ltr">{invoice.invoiceNumber}</strong>
        </div>
        <div className="grid gap-5 py-6 text-sm">
          <div className="grid gap-1"><span className="text-muted">{lang === "ar" ? "العميل" : "Customer"}</span><strong>{invoice.tenantName}</strong><span className="text-muted">{invoice.ownerEmail}</span></div>
          <div className="grid gap-1"><span className="text-muted">{lang === "ar" ? "الخطة" : "Plan"}</span><strong>{lang === "ar" ? invoice.planNameAr : invoice.planNameEn}</strong></div>
          <div className="grid gap-1"><span className="text-muted">{lang === "ar" ? "دورة الفوترة" : "Billing interval"}</span><strong>{interval}</strong></div>
          <div className="grid gap-1"><span className="text-muted">{lang === "ar" ? "فترة الاشتراك" : "Billing period"}</span><strong>{formatDate(invoice.periodStart, lang)} → {formatDate(invoice.periodEnd, lang)}</strong></div>
          <div className="flex items-center justify-between rounded-2xl bg-sand/40 p-4"><span>{lang === "ar" ? "الإجمالي" : "Total"}</span><strong dir="ltr">{invoice.amountSar.toFixed(2)} {invoice.currency}</strong></div>
          <p className="text-xs leading-5 text-muted">{lang === "ar" ? "هذه فاتورة اشتراك صادرة من مالك المنصة. لا تمثل إثبات دفع ولا تنفذ تحصيلاً إلكترونياً." : "This is a subscription invoice issued by the Platform Owner. It is not proof of payment and does not perform electronic collection."}</p>
          {invoice.notes ? <div className="grid gap-1"><span className="text-muted">{lang === "ar" ? "ملاحظات" : "Notes"}</span><strong className="whitespace-pre-wrap">{invoice.notes}</strong></div> : null}
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button onClick={() => window.print()}><Printer className="size-4" />{lang === "ar" ? "طباعة" : "Print"}</Button>
          <Button variant="outline" asChild><a href={buildInvoiceWhatsAppUrl(invoice, lang)} target="_blank" rel="noreferrer"><MessageCircle className="size-4" />WhatsApp</a></Button>
          <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إغلاق" : "Close"}</Button>
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string, lang: "ar" | "en") {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", { dateStyle: "medium", timeZone: "Asia/Riyadh" }).format(new Date(value));
}
