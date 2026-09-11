import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, Mail, Printer, RefreshCw, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { getOwnerAnalytics, getMyStudio } from "@/lib/menu/owner";
import { buildMenuReport, reportToText, type MenuReport } from "@/lib/menu/reports";
import type { OwnerAnalytics, StudioSnapshot } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/reports")({ component: ReportsPage });

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; report: MenuReport };

function ReportsPage() {
  const { lang } = useLang();
  const [days, setDays] = useState<7 | 30>(7);
  const [state, setState] = useState<State>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const load = () => {
    setRefreshing(true);
    Promise.all([getOwnerAnalytics({ data: { days } }), getMyStudio()])
      .then(([analytics, studio]) => {
        if (!analytics.ok) return setState({ status: "error", message: analytics.error });
        if (!studio.ok || !studio.data || !("tenant" in studio.data) || !studio.data.tenant) return setState({ status: "error", message: lang === "ar" ? "تعذر تحميل بيانات المنشأة" : "Unable to load business data" });
        setState({ status: "ready", report: buildMenuReport(studio.data as StudioSnapshot, analytics.data as OwnerAnalytics) });
      })
      .catch((error: unknown) => setState({ status: "error", message: error instanceof Error ? error.message : (lang === "ar" ? "تعذر إنشاء التقرير" : "Unable to create report") }))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => { load(); }, [days]);

  const text = useMemo(() => state.status === "ready" ? reportToText(state.report, lang) : "", [state, lang]);
  const email = () => {
    const subject = encodeURIComponent(lang === "ar" ? `تقرير Menu V3 — ${state.status === "ready" ? state.report.tenantNameAr : ""}` : `Menu V3 Report — ${state.status === "ready" ? state.report.tenantNameEn || state.report.tenantNameAr : ""}`);
    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(text)}`;
  };
  const print = () => window.print();
  const share = async () => {
    if (typeof navigator.share !== "function") return;
    await navigator.share({ title: lang === "ar" ? "تقرير Menu V3" : "Menu V3 Report", text });
  };

  return <div className="mx-auto grid max-w-5xl gap-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:hidden">
      <div><div className="flex items-center gap-2 text-accent"><Sparkles className="size-4" /><span className="text-xs font-semibold uppercase tracking-[.18em]">{lang === "ar" ? "تقارير Menu V3" : "Menu V3 Reports"}</span></div><h1 className="mt-2 font-display text-3xl font-semibold">{lang === "ar" ? "التقرير الذكي" : "Smart report"}</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{lang === "ar" ? "ملخص عملي من بيانات القائمة والتحليلات المتاحة، جاهز للطباعة أو الحفظ كـ PDF أو الإرسال عبر بريدك." : "A practical summary from available menu and analytics data, ready to print, save as PDF, or send from your email client."}</p></div>
      <div className="flex gap-2"><Button type="button" size="sm" variant={days === 7 ? "solid" : "outline"} onClick={() => setDays(7)}>7 {lang === "ar" ? "أيام" : "days"}</Button><Button type="button" size="sm" variant={days === 30 ? "solid" : "outline"} onClick={() => setDays(30)}>30 {lang === "ar" ? "يومًا" : "days"}</Button></div>
    </header>

    {state.status === "loading" ? <LoadingState /> : null}
    {state.status === "error" ? <ErrorState message={state.message} /> : null}
    {state.status === "ready" ? <ReportContent report={state.report} lang={lang} text={text} onPrint={print} onEmail={email} onShare={share} onRefresh={load} refreshing={refreshing} /> : null}
  </div>;
}

function ReportContent({ report, lang, text, onPrint, onEmail, onShare, onRefresh, refreshing }: { report: MenuReport; lang: "ar" | "en"; text: string; onPrint: () => void; onEmail: () => void; onShare: () => void; onRefresh: () => void; refreshing: boolean }) {
  const name = lang === "ar" ? report.tenantNameAr : report.tenantNameEn || report.tenantNameAr;
  const top = report.advisor.actions.slice(0, 3);
  return <>
    <section className="overflow-hidden rounded-3xl border border-line bg-ink p-6 text-paper md:p-8 print:border-black print:bg-white print:text-black">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><p className="text-sm text-paper/70 print:text-black/60">{name}</p><h2 className="mt-2 font-display text-3xl font-semibold">{lang === "ar" ? "ملخص حالة القائمة" : "Menu health summary"}</h2><p className="mt-2 text-sm text-paper/70 print:text-black/60">{lang === "ar" ? `آخر ${report.rangeDays} أيام` : `Last ${report.rangeDays} days`}</p></div><div className="grid size-28 place-items-center rounded-full border border-paper/20 bg-paper/10 print:border-black/20 print:bg-transparent"><div className="text-center"><div className="font-display text-4xl font-semibold tabular">{report.health.score}</div><div className="text-xs text-paper/60 print:text-black/50">/ 100</div></div></div></div>
    </section>

    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Metric label={lang === "ar" ? "الزيارات" : "Visits"} value={report.analytics.visits} />
      <Metric label={lang === "ar" ? "مشاهدات المنتجات" : "Product views"} value={report.analytics.productViews} />
      <Metric label={lang === "ar" ? "مسح QR" : "QR scans"} value={report.analytics.qrScans} />
      <Metric label={lang === "ar" ? "نقرات واتساب" : "WhatsApp clicks"} value={report.analytics.whatsappClicks} />
    </section>

    <section className="grid gap-3 rounded-3xl border border-line p-6">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "جاهزية المحتوى" : "Content readiness"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{report.readiness}/100</h2></div>
      <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Finding label={lang === "ar" ? "صور ناقصة" : "Missing images"} value={report.missingImages} />
        <Finding label={lang === "ar" ? "وصف عربي ناقص" : "Missing Arabic descriptions"} value={report.missingDescriptions} />
        <Finding label={lang === "ar" ? "إنجليزية ناقصة" : "Missing English content"} value={report.missingEnglish} />
        <Finding label={lang === "ar" ? "أصناف غير متاحة" : "Unavailable products"} value={report.unavailableProducts} />
      </div>
    </section>

    <section className="grid gap-4 rounded-3xl border border-line bg-sand/20 p-6">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "أهم 3 توصيات" : "Top 3 recommendations"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? "ما الذي يستحق اهتمامك؟" : "What deserves attention?"}</h2></div>
      {top.length ? <div className="grid gap-3">{top.map((item, index) => <article key={item.key} className="rounded-2xl border border-line bg-paper p-4"><div className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">{index + 1}</span><div><h3 className="font-medium">{lang === "ar" ? item.titleAr : item.titleEn}</h3><p className="mt-1 text-sm leading-6 text-muted">{lang === "ar" ? item.reasonAr : item.reasonEn}</p></div></div></article>)}</div> : <p className="text-sm text-muted">{lang === "ar" ? "لا توجد توصيات قابلة للتنفيذ حاليًا." : "There are no actionable recommendations right now."}</p>}
    </section>

    <section className="flex flex-wrap gap-2 print:hidden">
      <Button type="button" onClick={onPrint}><Printer className="size-4" />{lang === "ar" ? "طباعة / حفظ PDF" : "Print / Save PDF"}</Button>
      <Button type="button" variant="outline" onClick={onEmail}><Mail className="size-4" />{lang === "ar" ? "إرسال بالبريد" : "Email"}</Button>
      {typeof navigator !== "undefined" && typeof navigator.share === "function" ? <Button type="button" variant="outline" onClick={onShare}><Share2 className="size-4" />{lang === "ar" ? "مشاركة" : "Share"}</Button> : null}
      <Button type="button" variant="ghost" onClick={onRefresh} disabled={refreshing}><RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />{lang === "ar" ? "تحديث" : "Refresh"}</Button>
    </section>

    <details className="rounded-2xl border border-line p-4 print:hidden"><summary className="cursor-pointer text-sm font-medium">{lang === "ar" ? "عرض نص التقرير" : "View report text"}</summary><pre className="mt-4 whitespace-pre-wrap text-xs leading-6 text-muted">{text}</pre></details>
    <p className="text-center text-xs leading-5 text-muted print:text-black/60">{lang === "ar" ? "التقرير مبني على بيانات الحساب المتاحة فقط. لا يتضمن وعودًا بالمبيعات أو التحويل، ولا يمثل شهادة امتثال قانونية." : "This report uses only available account data. It makes no sales or conversion promises and is not a legal compliance certificate."}</p>
  </>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">{label}</p><p className="mt-2 font-display text-2xl font-semibold tabular">{value}</p></div>; }
function Finding({ label, value }: { label: string; value: number }) { return <div className="rounded-xl bg-paper p-3"><span className="text-muted">{label}</span><strong className="ms-2 tabular">{value}</strong></div>; }
