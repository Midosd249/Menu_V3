import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, MessageCircle, Printer, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { getOwnerAnalytics, getMyStudio } from "@/lib/menu/owner";
import { buildMenuReport, reportToText, type MenuReport } from "@/lib/menu/reports";
import { buildWhatsAppShareUrl, generateWhatsAppReportMessage } from "@/lib/menu/ai-whatsapp";
import type { OwnerAnalytics, StudioSnapshot } from "@/lib/menu/types";

// The share contract intentionally remains WhatsApp click-to-chat: https://wa.me/?text=
// Recipient selection is always left to the owner inside WhatsApp.

export const Route = createFileRoute("/studio/reports")({ component: ReportsPage });

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; report: MenuReport };
type WhatsAppState = { status: "idle" | "loading" | "ready" | "error"; message?: string; copied?: boolean; opened?: boolean };

function ReportsPage() {
  const { lang } = useLang();
  const [days, setDays] = useState<7 | 30>(7);
  const [state, setState] = useState<State>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const [waState, setWaState] = useState<WhatsAppState>({ status: "idle" });

  const load = () => {
    setRefreshing(true);
    Promise.all([getOwnerAnalytics({ data: { days } }), getMyStudio()])
      .then(([analytics, studio]) => {
        if (!analytics.ok) return setState({ status: "error", message: analytics.error });
        if (!studio.ok || !studio.data || !("tenant" in studio.data) || !studio.data.tenant) {
          return setState({ status: "error", message: lang === "ar" ? "تعذر تحميل بيانات المنشأة" : "Unable to load business data" });
        }
        setState({ status: "ready", report: buildMenuReport(studio.data as StudioSnapshot, analytics.data as OwnerAnalytics) });
        setWaState({ status: "idle" });
      })
      .catch((error: unknown) => setState({ status: "error", message: error instanceof Error ? error.message : (lang === "ar" ? "تعذر إنشاء التقرير" : "Unable to create report") }))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => { load(); }, [days]);

  const text = useMemo(() => state.status === "ready" ? reportToText(state.report, lang) : "", [state, lang]);
  const print = () => window.print();

  const copyMessage = async (message: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setWaState((current) => ({ ...current, copied: true }));
      return true;
    } catch {
      return false;
    }
  };

  const shareWhatsApp = async () => {
    if (state.status !== "ready" || waState.status === "loading") return;
    setWaState({ status: "loading" });
    const result = await generateWhatsAppReportMessage({ data: { reportText: text, lang } });
    if (!result.ok) {
      setWaState({ status: "error", message: result.error });
      return;
    }

    const message = result.data.message;
    const shareUrl = buildWhatsAppShareUrl(message);
    const copied = await copyMessage(message);
    let opened = false;
    try {
      const popup = window.open(shareUrl, "_blank", "noopener,noreferrer");
      opened = popup !== null;
    } catch {
      opened = false;
    }
    setWaState({ status: "ready", message, copied, opened });
  };

  return <div className="mx-auto grid max-w-5xl gap-6 pb-10">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:hidden">
      <div>
        <div className="flex items-center gap-2 text-accent"><Sparkles className="size-4" /><span className="text-xs font-semibold uppercase tracking-[.18em]">{lang === "ar" ? "من التحليلات" : "From Analytics"}</span></div>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">{lang === "ar" ? "التقرير الاحترافي" : "Professional report"}</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{lang === "ar" ? "ملخص منظم لحالة القائمة والنشاط المسجل، جاهز للمراجعة والطباعة والمشاركة." : "A structured summary of menu health and recorded activity, ready for review, printing, and sharing."}</p>
      </div>
      <div className="flex gap-2"><Button type="button" size="sm" variant={days === 7 ? "solid" : "outline"} onClick={() => setDays(7)}>7 {lang === "ar" ? "أيام" : "days"}</Button><Button type="button" size="sm" variant={days === 30 ? "solid" : "outline"} onClick={() => setDays(30)}>30 {lang === "ar" ? "يومًا" : "days"}</Button></div>
    </header>

    {state.status === "loading" ? <LoadingState /> : null}
    {state.status === "error" ? <ErrorState message={state.message} /> : null}
    {state.status === "ready" ? <ReportContent report={state.report} lang={lang} text={text} onPrint={print} onWhatsApp={shareWhatsApp} onCopy={copyMessage} onRefresh={load} refreshing={refreshing} waState={waState} /> : null}
  </div>;
}

function ReportContent({ report, lang, text, onPrint, onWhatsApp, onCopy, onRefresh, refreshing, waState }: { report: MenuReport; lang: "ar" | "en"; text: string; onPrint: () => void; onWhatsApp: () => void; onCopy: (message: string) => Promise<boolean>; onRefresh: () => void; refreshing: boolean; waState: WhatsAppState }) {
  const name = lang === "ar" ? report.tenantNameAr : report.tenantNameEn || report.tenantNameAr;
  const insights = report.advisor.insights.slice(0, 4);
  const actions = report.advisor.actions.slice(0, 6);
  const handleCopy = async () => {
    if (!waState.message) return;
    await onCopy(waState.message);
  };
  return <>
    <section className="overflow-hidden rounded-3xl border border-line bg-ink p-6 text-paper shadow-sm md:p-8 print:border-black print:bg-white print:text-black">
      <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0"><p className="text-sm text-paper/70 print:text-black/60">{name}</p><h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold leading-tight">{lang === "ar" ? report.health.headlineAr : report.health.headlineEn}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-paper/70 print:text-black/60">{lang === "ar" ? `ملخص آخر ${report.rangeDays} أيام · تم الإنشاء ${formatDate(report.generatedAt, lang)}` : `Last ${report.rangeDays} days · generated ${formatDate(report.generatedAt, lang)}`}</p></div>
        <div className="flex shrink-0 items-center gap-4"><div className="grid size-28 place-items-center rounded-full border border-paper/20 bg-paper/10 print:border-black/20 print:bg-transparent"><div className="text-center"><div className="font-display text-4xl font-semibold tabular">{report.health.score}</div><div className="text-xs text-paper/60 print:text-black/50">/ 100</div></div></div></div>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3"><Score label={lang === "ar" ? "المحتوى" : "Content"} value={report.health.contentScore} /><Score label={lang === "ar" ? "العرض" : "Presentation"} value={report.health.presentationScore} /><Score label={lang === "ar" ? "التشغيل" : "Operations"} value={report.health.operationsScore} /></div>
    </section>

    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Metric label={lang === "ar" ? "الزيارات" : "Visits"} value={report.analytics.visits} />
      <Metric label={lang === "ar" ? "الجلسات" : "Sessions"} value={report.analytics.uniqueSessions} />
      <Metric label={lang === "ar" ? "مشاهدات المنتجات" : "Product views"} value={report.analytics.productViews} />
      <Metric label={lang === "ar" ? "نقرات واتساب" : "WhatsApp clicks"} value={report.analytics.whatsappClicks} />
    </section>

    <section className="grid gap-4 rounded-3xl border border-line bg-paper p-6 print:break-inside-avoid">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "حالة المحتوى" : "Content status"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? `جاهزية ${report.readiness}/100` : `${report.readiness}/100 readiness`}</h2></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Finding label={lang === "ar" ? "صور ناقصة" : "Missing images"} value={report.missingImages} /><Finding label={lang === "ar" ? "وصف عربي ناقص" : "Missing Arabic descriptions"} value={report.missingDescriptions} /><Finding label={lang === "ar" ? "محتوى إنجليزي ناقص" : "Missing English content"} value={report.missingEnglish} /><Finding label={lang === "ar" ? "أصناف غير متاحة" : "Unavailable products"} value={report.unavailableProducts} /><Finding label={lang === "ar" ? "بلا تصنيف" : "Uncategorized"} value={report.uncategorizedProducts} /></div>
    </section>

    <section className="grid gap-4 rounded-3xl border border-line p-6 print:break-inside-avoid">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "إشارات البيانات" : "Data signals"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? "ما الذي تخبرنا به البيانات؟" : "What the data is telling you"}</h2><p className="mt-1 text-sm leading-6 text-muted">{lang === "ar" ? "هذه الإشارات تصف النشاط المسجل فقط ولا تستنتج مبيعات أو أرباحًا غير موجودة في البيانات." : "These signals describe recorded activity only and do not infer sales or profit that is not present in the data."}</p></div>
      {insights.length ? <div className="grid gap-3 md:grid-cols-2">{insights.map((item) => <article key={item.key} className="min-w-0 rounded-2xl border border-line bg-sand/20 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-medium leading-6">{lang === "ar" ? item.titleAr : item.titleEn}</h3><Priority priority={item.priority} lang={lang} /></div><p className="mt-2 text-sm leading-6 text-muted"><strong className="font-medium text-ink">{lang === "ar" ? "الدليل: " : "Evidence: "}</strong>{lang === "ar" ? item.evidenceAr : item.evidenceEn}</p><p className="mt-1 text-sm leading-6 text-muted">{lang === "ar" ? item.interpretationAr : item.interpretationEn}</p></article>)}</div> : <Empty text={lang === "ar" ? "لا توجد إشارات تحليلية كافية في الفترة المحددة." : "There are not enough analytical signals in the selected period."} />}
    </section>

    <section className="grid gap-4 rounded-3xl border border-line bg-sand/20 p-6 print:break-inside-avoid">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "خطة العمل" : "Action plan"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? "ما الخطوة التالية؟" : "What should happen next?"}</h2></div>
      {actions.length ? <div className="grid gap-3">{actions.map((item, index) => <article key={item.key} className="flex min-w-0 gap-3 rounded-2xl border border-line bg-paper p-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-medium leading-6">{lang === "ar" ? item.titleAr : item.titleEn}</h3><Priority priority={item.priority} lang={lang} /></div><p className="mt-1 text-sm leading-6 text-muted">{lang === "ar" ? item.reasonAr : item.reasonEn}</p><p className="mt-2 text-xs font-medium text-accent">{lang === "ar" ? item.metricAr : item.metricEn}</p></div></article>)}</div> : <Empty text={lang === "ar" ? "لا توجد توصيات قابلة للتنفيذ حاليًا." : "There are no actionable recommendations right now."} />}
    </section>

    <section className="grid gap-4 rounded-3xl border border-line bg-paper p-5 print:hidden">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "المشاركة" : "Sharing"}</p><h2 className="mt-1 font-semibold">{lang === "ar" ? "واتساب — راجع ثم شارك" : "WhatsApp — review, then share"}</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{lang === "ar" ? "أنشئ رسالة مختصرة مبنية على التقرير نفسه. ستظهر الرسالة للمراجعة أولًا، ويمكنك نسخها أو فتح واتساب واختيار المستلم بنفسك." : "Create a concise message from the same report. Review it first, then copy it or open WhatsApp and choose the recipient yourself."}</p></div>
      <div className="flex flex-wrap gap-2"><Button type="button" onClick={onWhatsApp} disabled={waState.status === "loading"}><MessageCircle className="size-4" />{waState.status === "loading" ? (lang === "ar" ? "جاري إنشاء الرسالة…" : "Generating…") : (lang === "ar" ? "إنشاء رسالة واتساب" : "Generate WhatsApp message")}</Button><Button type="button" variant="outline" onClick={onPrint}><Printer className="size-4" />{lang === "ar" ? "طباعة / حفظ PDF" : "Print / Save PDF"}</Button><Button type="button" variant="ghost" onClick={onRefresh} disabled={refreshing}><RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />{lang === "ar" ? "تحديث" : "Refresh"}</Button></div>
      {waState.status === "ready" && waState.message ? <div className="grid gap-3 rounded-2xl border border-line bg-sand/40 p-4"><div className="flex flex-wrap items-center gap-2"><div className="flex items-center gap-2 text-sm font-medium"><Check className="size-4 text-good" />{waState.opened ? (lang === "ar" ? "تم فتح واتساب" : "WhatsApp opened") : (lang === "ar" ? "الرسالة جاهزة" : "Message ready")}</div>{waState.copied ? <span className="text-xs text-muted">{lang === "ar" ? "· تم نسخ الرسالة" : "· Message copied"}</span> : null}</div><p className="max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-paper p-3 text-sm leading-6 text-muted">{waState.message}</p><div className="flex flex-wrap gap-2"><Button type="button" size="sm" variant="outline" onClick={handleCopy}><Copy className="size-4" />{waState.copied ? (lang === "ar" ? "تم النسخ" : "Copied") : (lang === "ar" ? "نسخ الرسالة" : "Copy message")}</Button><Button type="button" size="sm" onClick={onWhatsApp}><MessageCircle className="size-4" />{lang === "ar" ? "فتح واتساب مجددًا" : "Open WhatsApp again"}</Button></div></div> : null}
      {waState.status === "error" ? <p className="rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm leading-6 text-danger">{waState.message}</p> : null}
    </section>
  </>;
}

function Score({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl border border-paper/10 bg-paper/10 p-3 print:border-black/10 print:bg-transparent"><div className="flex items-center justify-between gap-3 text-xs text-paper/70 print:text-black/60"><span>{label}</span><span className="font-semibold tabular">{value}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper/10 print:bg-black/10"><div className="h-full rounded-full bg-paper print:bg-black" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div></div>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-display text-2xl font-semibold tabular">{value}</p></div>; }
function Finding({ label, value }: { label: string; value: number }) { return <div className="min-w-0 rounded-2xl border border-line p-3"><p className="text-xs leading-5 text-muted">{label}</p><p className="mt-1 font-display text-xl font-semibold tabular">{value}</p></div>; }
function Priority({ priority, lang }: { priority: "high" | "medium" | "low"; lang: "ar" | "en" }) { const label = priority === "high" ? (lang === "ar" ? "أولوية عالية" : "High") : priority === "medium" ? (lang === "ar" ? "متوسطة" : "Medium") : (lang === "ar" ? "منخفضة" : "Low"); return <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">{label}</span>; }
function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">{text}</div>; }
function formatDate(value: string, lang: "ar" | "en") { try { return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-SA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); } catch { return value; } }
