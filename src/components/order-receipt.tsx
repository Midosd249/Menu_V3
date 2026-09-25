import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Printer } from "lucide-react";
import { useLang } from "@/lib/lang";
import { getPublicOrderReceipt } from "@/lib/menu/order-public";
import { getStaffOrderReceipt } from "@/lib/menu/order-receipt";
import type { OrderReceiptData } from "@/lib/menu/order-receipt";
import { cn } from "@/lib/utils";

type Props = { receipt?: OrderReceiptData; orderId?: string; staffOrderId?: string; className?: string };

function money(value: number, currency: string, lang: "ar" | "en") {
  try {
    return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-SA", {
      style: "currency",
      currency,
      currencyDisplay: "code",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2) + " " + currency;
  }
}

function date(value: string, lang: "ar" | "en") {
  try {
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-SA", {
      calendar: "gregory",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function ReceiptView({ receipt, lang }: { receipt: OrderReceiptData; lang: "ar" | "en" }) {
  const restaurant = lang === "ar" ? receipt.restaurantNameAr || receipt.restaurantNameEn : receipt.restaurantNameEn || receipt.restaurantNameAr;
  const branch = lang === "ar" ? receipt.branchNameAr || receipt.branchNameEn : receipt.branchNameEn || receipt.branchNameAr;

  return (
    <article className="order-receipt-print mx-auto w-full max-w-[440px] overflow-hidden rounded-2xl border border-black/10 bg-white p-6 text-black shadow-xl" dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="grid gap-3 border-b border-black/15 pb-4 text-center">
        {receipt.restaurantLogoUrl ? <img src={receipt.restaurantLogoUrl} alt="" className="mx-auto size-16 rounded-xl object-cover" /> : null}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
            {lang === "ar" ? "إيصال" : "Receipt"}
          </p>
          <h1 className="mt-1 text-xl font-bold">{restaurant}</h1>
          <p className="mt-1 text-sm text-black/65">{branch}</p>
        </div>
      </header>
      <section className="grid gap-2 border-b border-black/15 py-4 text-sm">
        <div className="flex justify-between gap-4"><span>{lang === "ar" ? "رقم الطلب" : "Order number"}</span><strong dir="ltr">#{receipt.orderNumber}</strong></div>
        <div className="flex justify-between gap-4"><span>{lang === "ar" ? "التاريخ والوقت" : "Date & time"}</span><span dir="ltr">{date(receipt.createdAt, lang)}</span></div>
      </section>
      <section className="grid gap-2 py-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-2 border-b border-black/15 pb-2 text-[10px] font-semibold uppercase tracking-wide text-black/55" dir={lang === "ar" ? "rtl" : "ltr"}>
          <span>{lang === "ar" ? "الصنف" : "Item"}</span>
          <span>{lang === "ar" ? "الكمية" : "Qty"}</span>
          <span>{lang === "ar" ? "سعر الوحدة" : "Unit"}</span>
          <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
        </div>
        {receipt.items.map((item) => (
          <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-start gap-2 border-b border-black/10 py-2 last:border-b-0" dir={lang === "ar" ? "rtl" : "ltr"}>
            <span className="min-w-0 break-words text-xs font-medium" dir="auto">{lang === "ar" ? item.nameAr || item.nameEn : item.nameEn || item.nameAr}</span>
            <span className="text-xs tabular-nums" dir="ltr">{item.quantity}</span>
            <span className="whitespace-nowrap text-xs tabular-nums" dir="ltr">{money(item.unitPrice, receipt.currency, lang)}</span>
            <span className="whitespace-nowrap text-xs font-semibold tabular-nums" dir="ltr">{money(item.lineTotal, receipt.currency, lang)}</span>
          </div>
        ))}
      </section>
      <section className="grid gap-2 border-t border-black/20 pt-4 text-sm">
        <div className="flex justify-between gap-4"><span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span><span dir="ltr">{money(receipt.subtotal, receipt.currency, lang)}</span></div>
        {receipt.vatRegistrationNumber ? (
          <div className="flex justify-between gap-4">
            <span>{lang === "ar" ? "رقم تسجيل VAT" : "VAT registration"}</span>
            <span dir="ltr">{receipt.vatRegistrationNumber}</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-black/20 pt-2 text-base font-bold">
          <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
          <span dir="ltr">{money(receipt.total, receipt.currency, lang)}</span>
        </div>
      </section>
      <footer className="mt-6 border-t border-black/15 pt-4 text-center text-xs leading-5 text-black/60">
        <p>{lang === "ar" ? "إيصال غير رسمي — ليس فاتورة ضريبية متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA)." : "Informal receipt — not a ZATCA-compliant tax invoice."}</p>
      </footer>
    </article>
  );
}

export function OrderReceiptButton({ receipt, orderId, staffOrderId, className }: Props) {
  const { lang } = useLang();
  const [printable, setPrintable] = useState<OrderReceiptData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const previousTitleRef = useRef<string | null>(null);

  useEffect(() => {
    const done = () => {
      document.body.classList.remove("printing-order-receipt");
      if (previousTitleRef.current !== null) {
        document.title = previousTitleRef.current;
        previousTitleRef.current = null;
      }
      setBusy(false);
    };
    window.addEventListener("afterprint", done);
    return () => {
      window.removeEventListener("afterprint", done);
      document.body.classList.remove("printing-order-receipt");
      if (previousTitleRef.current !== null) {
        document.title = previousTitleRef.current;
        previousTitleRef.current = null;
      }
      setPreviewOpen(false);
      setPrintable(null);
      setBusy(false);
    };
  }, []);

  async function printReceipt() {
    setBusy(true);
    setError("");
    let data = receipt;
    if (!data && staffOrderId) {
      const result = await getStaffOrderReceipt({ data: { orderId: staffOrderId } });
      if (!result.ok) {
        setError(result.error);
        setBusy(false);
        return;
      }
      data = result.data;
    }
    if (!data && orderId) {
      const result = await getPublicOrderReceipt({ data: { orderId } });
      if (!result.ok) {
        setError(result.error);
        setBusy(false);
        return;
      }
      data = result.data;
    }
    if (!data) {
      setError(lang === "ar" ? "تعذر تحميل الإيصال." : "Unable to load the receipt.");
      setBusy(false);
      return;
    }
    setPrintable(data);
    setPreviewOpen(true);
    setBusy(false);
  }

  function printReceiptData(data: OrderReceiptData) {
    if (typeof document === "undefined") return;
    setBusy(true);
    previousTitleRef.current = document.title;
    document.title = `Receipt-${data.orderNumber}`;
    document.body.classList.add("printing-order-receipt");
    window.setTimeout(() => window.print(), 40);
  }

  function closePreview() {
    if (busy) return;
    setPreviewOpen(false);
    setPrintable(null);
  }

  return (
    <>
      <style>{`
        .order-receipt-portal { display: none; }
        .order-receipt-preview { display: grid; }
        @media print {
          @page { size: auto; margin: 8mm; }
          body.printing-order-receipt > *:not(.order-receipt-portal) { display: none !important; }
          body.printing-order-receipt { margin: 0 !important; background: #fff !important; }
          body.printing-order-receipt .order-receipt-portal {
            display: block !important;
            position: static !important;
            width: 100% !important;
            min-height: 0 !important;
          }
          body.printing-order-receipt .order-receipt-print {
            width: 80mm !important;
            max-width: 80mm !important;
            min-height: 0 !important;
            margin: 0 auto !important;
            padding: 4mm !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          body.printing-order-receipt .order-receipt-print section,
          body.printing-order-receipt .order-receipt-print footer {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
      <button type="button" onClick={() => void printReceipt()} disabled={busy} className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 text-sm font-medium", className)}>
        <Printer className="size-4" aria-hidden="true" />
        {busy ? (lang === "ar" ? "جاري تجهيز الإيصال…" : "Preparing receipt…") : (lang === "ar" ? "طباعة الإيصال" : "Print receipt")}
      </button>
      {error ? <p role="alert" className="text-xs text-danger">{error}</p> : null}
      {printable && typeof document !== "undefined"
        ? createPortal(
            <>
              <div className="order-receipt-portal">
                <ReceiptView receipt={printable} lang={lang} />
              </div>
              {previewOpen ? (
                <div
                  className="order-receipt-preview fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4"
                  role="presentation"
                  onMouseDown={(event) => {
                    if (event.target === event.currentTarget) closePreview();
                  }}
                >
                  <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="order-receipt-preview-title"
                    className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-paper shadow-2xl"
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-5">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                          {lang === "ar" ? "إيصال الطلب" : "Order receipt"}
                        </p>
                        <h2 id="order-receipt-preview-title" className="mt-1 truncate text-base font-semibold">
                          {lang === "ar" ? "معاينة الإيصال" : "Receipt preview"}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={closePreview}
                        disabled={busy}
                        className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-muted transition hover:bg-sand/40 disabled:opacity-50"
                        aria-label={lang === "ar" ? "إغلاق معاينة الإيصال" : "Close receipt preview"}
                      >
                        ×
                      </button>
                    </header>
                    <div className="min-h-0 overflow-y-auto bg-sand/20 p-4 md:p-6">
                      <ReceiptView receipt={printable} lang={lang} />
                    </div>
                    <footer className="grid grid-cols-2 gap-2 border-t border-line bg-paper p-4">
                      <button
                        type="button"
                        onClick={() => printReceiptData(printable)}
                        disabled={busy}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-50"
                      >
                        <Printer className="size-4" aria-hidden="true" />
                        {busy ? (lang === "ar" ? "جاري الطباعة…" : "Printing…") : (lang === "ar" ? "طباعة الإيصال" : "Print receipt")}
                      </button>
                      <button
                        type="button"
                        onClick={closePreview}
                        disabled={busy}
                        className="min-h-11 rounded-xl border border-line bg-paper px-4 text-sm font-medium disabled:opacity-50"
                      >
                        {lang === "ar" ? "إغلاق" : "Close"}
                      </button>
                    </footer>
                  </section>
                </div>
              ) : null}
            </>,
            document.body,
          )
        : null}
    </>
  );
}
