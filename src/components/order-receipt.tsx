import { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { useLang } from "@/lib/lang";
import { getPublicOrderReceipt } from "@/lib/menu/order-public";
import type { OrderReceiptData } from "@/lib/menu/order-receipt";
import { cn } from "@/lib/utils";

type Props = { receipt?: OrderReceiptData; orderId?: string; className?: string };

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
    <article className="order-receipt-print mx-auto w-full max-w-[440px] bg-white p-6 text-black" dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="grid gap-3 border-b border-black/15 pb-4 text-center">
        {receipt.restaurantLogoUrl ? <img src={receipt.restaurantLogoUrl} alt="" className="mx-auto size-16 rounded-xl object-cover" /> : null}
        <div>
          <h1 className="text-xl font-bold">{restaurant}</h1>
          <p className="mt-1 text-sm text-black/65">{branch}</p>
        </div>
      </header>
      <section className="grid gap-2 border-b border-black/15 py-4 text-sm">
        <div className="flex justify-between gap-4"><span>{lang === "ar" ? "رقم الطلب" : "Order number"}</span><strong dir="ltr">#{receipt.orderNumber}</strong></div>
        <div className="flex justify-between gap-4"><span>{lang === "ar" ? "التاريخ والوقت" : "Date & time"}</span><span dir="ltr">{date(receipt.createdAt, lang)}</span></div>
        {receipt.customerName ? <div className="flex justify-between gap-4"><span>{lang === "ar" ? "العميل" : "Customer"}</span><span dir="auto">{receipt.customerName}</span></div> : null}
      </section>
      <section className="grid gap-3 py-4">
        {receipt.items.map((item) => (
          <div key={item.id} className="grid gap-1 border-b border-black/10 pb-3 last:border-b-0 last:pb-0">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
              <span dir="ltr">×{item.quantity}</span>
              <span dir="auto">{lang === "ar" ? item.nameAr || item.nameEn : item.nameEn || item.nameAr}</span>
              <span dir="ltr" className="whitespace-nowrap">{money(item.lineTotal, receipt.currency, lang)}</span>
            </div>
            <div className="flex justify-between gap-3 text-xs text-black/60" dir="ltr">
              <span>{money(item.unitPrice, receipt.currency, lang)} × {item.quantity}</span>
              {item.note ? <span dir="auto">{item.note}</span> : null}
            </div>
          </div>
        ))}
      </section>
      <section className="grid gap-2 border-t border-black/20 pt-4 text-sm">
        <div className="flex justify-between gap-4"><span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span><span dir="ltr">{money(receipt.subtotal, receipt.currency, lang)}</span></div>
        {receipt.vatRegistrationNumber ? (
          <div className="grid gap-1">
            <div className="flex justify-between gap-4">
              <span>{lang === "ar" ? "الضريبة / VAT" : "Tax / VAT"}</span>
              <span>{lang === "ar" ? "غير مسجلة في الطلب" : "Not recorded in order data"}</span>
            </div>
            <div className="text-xs text-black/60" dir="ltr">{lang === "ar" ? "رقم التسجيل" : "VAT registration"}: {receipt.vatRegistrationNumber}</div>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-black/20 pt-2 text-base font-bold">
          <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
          <span dir="ltr">{money(receipt.total, receipt.currency, lang)}</span>
        </div>
      </section>
      <footer className="mt-6 border-t border-black/15 pt-4 text-center text-xs leading-5 text-black/60">
        <p>{lang === "ar" ? "إيصال غير رسمي — ليس فاتورة ضريبية متوافقة مع ZATCA" : "Informal receipt — not a ZATCA-compliant tax invoice"}</p>
        <p className="mt-1">{lang === "ar" ? "هذا الإيصال لا يثبت السداد ولا ينفذ أي تحصيل إلكتروني." : "This receipt does not confirm payment or perform electronic collection."}</p>
      </footer>
    </article>
  );
}

export function OrderReceiptButton({ receipt, orderId, className }: Props) {
  const { lang } = useLang();
  const [printable, setPrintable] = useState<OrderReceiptData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const done = () => {
      document.body.classList.remove("printing-order-receipt");
      setPrintable(null);
      setBusy(false);
    };
    window.addEventListener("afterprint", done);
    return () => {
      window.removeEventListener("afterprint", done);
      document.body.classList.remove("printing-order-receipt");
    };
  }, []);

  async function printReceipt() {
    setBusy(true);
    setError("");
    let data = receipt;
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
    document.body.classList.add("printing-order-receipt");
    window.setTimeout(() => window.print(), 40);
  }

  return (
    <>
      <style>{"@media print { body.printing-order-receipt > * { visibility:hidden!important; } body.printing-order-receipt .order-receipt-print { visibility:visible!important; position:fixed!important; inset:0!important; width:100%!important; max-width:none!important; min-height:100vh!important; } body.printing-order-receipt .order-receipt-print * { visibility:visible!important; } }"}</style>
      <button type="button" onClick={() => void printReceipt()} disabled={busy} className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 text-sm font-medium", className)}>
        <Printer className="size-4" aria-hidden="true" />
        {busy ? (lang === "ar" ? "جاري تجهيز الإيصال…" : "Preparing receipt…") : (lang === "ar" ? "طباعة الإيصال" : "Print receipt")}
      </button>
      {error ? <p role="alert" className="text-xs text-danger">{error}</p> : null}
      {printable ? <div className="hidden print:block"><ReceiptView receipt={printable} lang={lang} /></div> : null}
    </>
  );
}
