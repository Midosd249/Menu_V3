import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, Copy, Eye, FileText, MessageCircle, Printer, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { getOwnerAnalytics, getMyStudio } from "@/lib/menu/owner";
import { buildMenuReport, reportToText, type MenuReport } from "@/lib/menu/reports";
import { generateWhatsAppReportMessage } from "@/lib/menu/ai-whatsapp";
import type { OwnerAnalytics, StudioSnapshot } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/reports")({ component: ReportsPage });

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; report: MenuReport };
type WaState = { status: "idle" | "loading" | "ready" | "error"; message?: string };

function ReportsPage() {
  const { lang } = useLang();
  const [days, setDays] = useState<7 | 30>(7);
  const [state, setState] = useState<State>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const [waState, setWaState] = useState<WaState>({ status: "idle" });

  const load = () => {
    setRefreshing(true);
    Promise.all([getOwnerAnalytics({ data: { days } }), getMyStudio()])
      .then(([analytics, studio]) => {
        if (!analytics.ok) return setState({ status: "error", message: analytics.error });
        if (!studio.ok || !studio.data || !("tenant" in studio.data) || !studio.data.tenant) return setState({ status: "error", message: lang === "ar" ? "تعذر تحميل بيانات المنشأة" : "Unable to load business data" });
        setState({ status: "ready", report: buildMenuReport(studio.data as StudioSnapshot, analytics.data as OwnerAnalytics) });
        setWaState({ status: "idle" });
      })
      .catch((error: unknown) => setState({ status: "error", message: error instanceof Error ? error.message : (lang === "ar" ? "تعذر إنشاء التقرير" : "Unable to create report") }))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => { load(); }, [days]);

  const text = useMemo(() => state.status === "ready" ? reportToText(state.report, lang) : "", [state, lang]);
  const print = () => window.print();
  const shareWhatsApp = async () => {
    if (state.status !== "ready") return;
    setWaState({ status: "loading" });
    const result = await generateWhatsAppReportMessage({ data: { reportText: text, lang } });
    if (!result.ok) return setWaState({ status: "error", message: result.error });
    try { await navigator.clipboard?.writeText(result.data.message); } catch { /* clipboard is optional */ }
    window.open(`https://wa.me/?text=${encodeURIComponent(result.data.message)}`, "_blank", "noopener,noreferrer");
    setWaState({ status: "ready", message: result.data.message });
  };

  return <div className="mx-auto grid w-full max-w-6xl gap-6 pb-8 print:block print:max-w-none print:pb-0">
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between print:hidden">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-accent"><Sparkles className="size-4" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-[.18em]">{lang === "ar" ? "من التحليلات" : "From Analytics"}</span></div>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{lang === "ar" ? "التقرير الاحترافي" : "Professional report"}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{lang === "ar" ? "ملخص واضح لصحة القائمة، البيانات المسجلة، وأهم الخطوات العملية — جاهز للمراجعة والطباعة والمشاركة." : "A clear summary of menu health, observed data, and priority actions — ready to review, print, and share."}</p>
      </div>
      <div className="flex shrink-0 gap-2" role="group" aria-label={lang === "ar" ? "الفترة" : "Report period"}>
        <Button type="button" size="sm" variant={days === 7 ? "solid" : "outline"} onClick={() => setDays(7)}>7 {lang === "ar" ? "أيام" : "days"}</Button>
        <Button type="button" size="sm" variant={days === 30 ? "solid" : "outline"} onClick={() => setDays(30)}>30 {lang === "ar" ? "يومًا" : "days"}</Button>
      </div>
    </header>

    {state.status === "loading" ? <LoadingState /> : null}
    {state.status === "error" ? <ErrorState message={state.message} /> : null}
    {state.status === "ready" ? <ReportContent report={state.report} lang={lang} text={text} onPrint={print} onWhatsApp={shareWhatsApp} onRefresh={load} refreshing={refreshing} waState={waState} /> : null}
  </div>;
}

function ReportContent({ report, lang, text, onPrint, onWhatsApp, onRefresh, refreshing, waState }: { report: MenuReport; lang: "ar" | "en"; text: string; onPrint: () => void; onWhatsApp: () => void; onRefresh: () => void; refreshing: boolean; waState: WaState }) {
  const ar = lang === "ar";
  const name = ar ? report.tenantNameAr : report.tenantNameEn || report.tenantNameAr;
  const topActions = report.advisor.actions.slice(0, 3);
  const insights = report.verifiedInsights.slice(0, 4);
  return <div className="grid gap-5 print:block">
    <section className="relative overflow-hidden rounded-[2rem] border border-line bg-ink p-6 text-paper shadow-sm sm:p-8 print:mb-6 print:break-inside-avoid print:border-black print:bg-white print:text-black print:shadow-none">
      <div className="pointer-events-none absolute -end-20 -top-20 size-56 rounded-full border border-paper/10 print:hidden" />
      <div className="pointer-events-none absolute -end-8 -top-8 size-32 rounded-full border border-paper/10 print:hidden" />
      <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-paper/65 print:text-black/55"><FileText className="size-4" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-[.16em]">{ar ? "Menu V3 · تقرير تنفيذي" : "Menu V3 · Executive report"}</span></div>
          <p className="mt-5 truncate text-sm text-paper/65 print:text-black/55">{name}</p>
          <h2 className="mt-2 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl">{ar ? "صورة واضحة عن حالة قائمتك" : "A clear view of your menu"}</h2>
          <p className="mt-3 text-sm text-paper/65 print:text-black/55">{ar ? `آخر ${report.rangeDays} أيام · تم إنشاء التقرير في ${formatDate(report.generatedAt, lang)}` : `Last ${report.rangeDays} days · Generated ${formatDate(report.generatedAt, lang)}`}</p>
        </div>
        <ScoreRing score={report.health.score} label={ar ? "صحة القائمة" : "Menu health"} />
      </div>
    </section>

    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 print:mb-5 print:grid-cols-4 print:break-inside-avoid">
      <Metric label={ar ? "الزيارات" : "Visits"} value={report.analytics.visits} icon="eye" />
      <Metric label={ar ? "مشاهدات المنتجات" : "Product views"} value={report.analytics.productViews} />
      <Metric label={ar ? "مسح QR" : "QR scans"} value={report.analytics.qrScans} />
      <Metric label={ar ? "نقرات واتساب" : "WhatsApp clicks"} value={report.analytics.whatsappClicks} />
    </section>

    <section className="grid gap-4 rounded-[1.5rem] border border-line bg-paper p-5 sm:p-6 print:mb-5 print:break-inside-avoid">
      <SectionHeading eyebrow={ar ? "صحة القائمة" : "Menu health"} title={ar ? "أين تقف القائمة الآن؟" : "Where the menu stands"} description={ar ? "تفصيل مباشر للنتيجة بدل رقم معزول." : "A transparent breakdown instead of an isolated score."} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <HealthCard label={ar ? "المحتوى" : "Content"} score={report.health.contentScore} />
        <HealthCard label={ar ? "العرض البصري" : "Presentation"} score={report.health.presentationScore} />
        <HealthCard label={ar ? "التشغيل" : "Operations"} score={report.health.operationsScore} />
      </div>
    </section>

    <section className="grid gap-4 rounded-[1.5rem] border border-line bg-paper p-5 sm:p-6 print:mb-5 print:break-inside-avoid">
      <SectionHeading eyebrow={ar ? "البيانات المسجلة" : "Observed data"} title={ar ? "ما الذي حدث فعليًا؟" : "What actually happened?"} description={ar ? "أرقام مصدرها أحداث التحليلات الحالية، دون إضافة مؤشرات غير موجودة." : "Metrics from the current analytics events, without introducing unsupported metrics."} />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-2 rounded-2xl bg-sand/35 p-4">
          <DetailRow label={ar ? "الجلسات الفريدة" : "Unique sessions"} value={report.analytics.uniqueSessions} />
          <DetailRow label={ar ? "مشاهدات المنتجات" : "Product views"} value={report.analytics.productViews} />
          <DetailRow label={ar ? "مسح QR" : "QR scans"} value={report.analytics.qrScans} />
          <DetailRow label={ar ? "نقرات واتساب" : "WhatsApp clicks"} value={report.analytics.whatsappClicks} />
        </div>
        <div className="grid gap-2 rounded-2xl bg-sand/35 p-4">
          <DetailRow label={ar ? "الأصناف المتاحة" : "Available products"} value={`${report.availableProducts}/${report.totalProducts}`} />
          <DetailRow label={ar ? "التصنيفات" : "Categories"} value={report.categories} />
          <DetailRow label={ar ? "الأصناف غير المتاحة" : "Unavailable products"} value={report.unavailableProducts} />
          <DetailRow label={ar ? "جاهزية المحتوى" : "Content readiness"} value={`${report.readiness}/100`} />
        </div>
      </div>
    </section>

    <section className="grid gap-4 rounded-[1.5rem] border border-line bg-paper p-5 sm:p-6 print:mb-5 print:break-inside-avoid">
      <SectionHeading eyebrow={ar ? "فحص المحتوى" : "Content check"} title={ar ? "ما الذي يحتاج تحسينًا؟" : "What needs improvement?"} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Finding label={ar ? "صور ناقصة" : "Missing images"} value={report.missingImages} />
        <Finding label={ar ? "وصف عربي ناقص" : "Missing Arabic descriptions"} value={report.missingDescriptions} />
        <Finding label={ar ? "محتوى إنجليزي ناقص" : "Missing English content"} value={report.missingEnglish} />
        <Finding label={ar ? "أصناف غير متاحة" : "Unavailable products"} value={report.unavailableProducts} />
      </div>
      <div className="grid gap-2 text-xs leading-5 text-muted sm:grid-cols-3">
        {report.readinessBasis.map((item) => <p key={item} className="rounded-xl border border-line bg-sand/20 p-3">{item}</p>)}
      </div>
    </section>

    <section className="grid gap-4 rounded-[1.5rem] border border-line bg-sand/20 p-5 sm:p-6 print:mb-5 print:break-inside-avoid">
      <SectionHeading eyebrow={ar ? "Verified insights" : "Verified insights"} title={ar ? "ماذا تقول البيانات؟" : "What the data says"} description={ar ? "كل إشارة مرتبطة ببيانات مرصودة، وليست توقعًا أو وعدًا." : "Each signal is tied to observed data, not a prediction or promise."} />
      {insights.length ? <div className="grid gap-3 md:grid-cols-2">{insights.map((item) => <InsightCard key={item.key} item={item} lang={lang} />)}</div> : <EmptyMessage text={ar ? "لا توجد إشارات كافية في الفترة المحددة." : "There are not enough observed signals for this period."} />}
    </section>

    <section className="grid gap-4 rounded-[1.5rem] border border-line bg-paper p-5 sm:p-6 print:break-inside-avoid">
      <SectionHeading eyebrow={ar ? "الأولوية التالية" : "Next priorities"} title={ar ? "ما الذي يستحق التنفيذ أولًا؟" : "What should happen first?"} description={ar ? "إجراءات عملية مرتبطة ببيانات القائمة الحالية." : "Practical actions connected to the current menu data."} />
      {topActions.length ? <div className="grid gap-3 md:grid-cols-3">{topActions.map((item, index) => <ActionCard key={item.key} item={item} index={index} lang={lang} />)}</div> : <EmptyMessage text={ar ? "لا توجد إجراءات ذات أولوية حاليًا." : "There are no priority actions right now."} />}
    </section>

    <section className="grid gap-4 rounded-[1.5rem] border border-line bg-paper p-5 sm:p-6 print:hidden">
      <SectionHeading eyebrow={ar ? "التسليم" : "Delivery"} title={ar ? "شارك التقرير بالطريقة المناسبة" : "Deliver the report your way"} description={ar ? "الطباعة تحفظ نسخة مرتبة، وواتساب ينشئ رسالة مختصرة من نفس التقرير." : "Print keeps a structured copy; WhatsApp creates a concise message from the same report."} />
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onWhatsApp} disabled={waState.status === "loading"}><MessageCircle className="size-4" aria-hidden="true" />{waState.status === "loading" ? (ar ? "جاري إنشاء الرسالة…" : "Generating…") : (ar ? "مشاركة عبر واتساب" : "Share via WhatsApp")}</Button>
        <Button type="button" variant="outline" onClick={onPrint}><Printer className="size-4" aria-hidden="true" />{ar ? "طباعة / حفظ PDF" : "Print / Save PDF"}</Button>
        <Button type="button" variant="ghost" onClick={onRefresh} disabled={refreshing}><RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />{ar ? "تحديث البيانات" : "Refresh data"}</Button>
      </div>
      {waState.status === "ready" && waState.message ? <div className="grid gap-2 rounded-2xl bg-sand/40 p-4"><div className="flex items-center gap-2 text-sm font-medium"><Check className="size-4 text-good" aria-hidden="true" />{ar ? "تم إنشاء الرسالة وفتح واتساب" : "Message generated and WhatsApp opened"}</div><p className="whitespace-pre-wrap text-sm leading-6 text-muted">{waState.message}</p><button type="button" className="inline-flex w-fit items-center gap-2 text-xs font-medium" onClick={() => navigator.clipboard?.writeText(waState.message || "")}><Copy className="size-3.5" aria-hidden="true" />{ar ? "نسخ الرسالة" : "Copy message"}</button></div> : null}
      {waState.status === "error" ? <p className="rounded-xl border border-line p-3 text-sm text-muted">{waState.message}</p> : null}
    </section>

    <details className="rounded-2xl border border-line p-4 print:hidden"><summary className="cursor-pointer text-sm font-medium">{ar ? "عرض النص الكامل للتقرير" : "View full report text"}</summary><pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap text-xs leading-6 text-muted">{text}</pre></details>
    <footer className="grid gap-2 text-center text-xs leading-5 text-muted print:mt-6 print:text-black/60">
      <p>{ar ? "التقرير مبني على البيانات المسجلة والمتاحة في الحساب فقط. لا يمثل وعدًا بنتيجة تجارية ولا يُعد شهادة امتثال قانونية." : "This report uses only recorded data available to the account. It does not promise a business outcome and is not a legal compliance certificate."}</p>
      <p>{ar ? "Menu V3 · تقرير احترافي" : "Menu V3 · Professional report"}</p>
    </footer>
  </div>;
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  return <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-paper/10 bg-paper/10 px-4 py-3 print:border-black/15 print:bg-transparent">
    <div className="grid size-20 place-items-center rounded-full border-[5px] border-paper/25 print:border-black/20"><div className="text-center"><div className="font-display text-3xl font-semibold tabular">{score}</div><div className="text-[10px] text-paper/55 print:text-black/50">/100</div></div></div>
    <span className="max-w-24 text-xs font-medium leading-5 text-paper/70 print:text-black/60">{label}</span>
  </div>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{eyebrow}</p><h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">{title}</h2>{description ? <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">{description}</p> : null}</div>;
}

function Metric({ label, value, icon }: { label: string; value: number; icon?: "eye" }) {
  return <div className="rounded-2xl border border-line bg-paper p-4 print:border-black/15"><div className="flex items-center justify-between gap-2"><p className="text-xs text-muted">{label}</p>{icon === "eye" ? <Eye className="size-4 text-muted" aria-hidden="true" /> : null}</div><p className="mt-2 font-display text-3xl font-semibold tabular">{value}</p></div>;
}

function HealthCard({ label, score }: { label: string; score: number }) {
  return <div className="rounded-2xl border border-line p-4"><div className="flex items-center justify-between gap-3"><span className="text-sm font-medium">{label}</span><strong className="font-display text-xl tabular">{score}</strong></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full bg-ink" style={{ width: `${score}%` }} /></div></div>;
}

function DetailRow({ label, value }: { label: string; value: number | string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-line/70 py-2 last:border-0"><span className="text-sm text-muted">{label}</span><strong className="tabular text-sm">{value}</strong></div>;
}

function Finding({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-line bg-paper p-4 print:border-black/15"><p className="text-xs leading-5 text-muted">{label}</p><p className="mt-2 font-display text-2xl font-semibold tabular">{value}</p></div>;
}

function InsightCard({ item, lang }: { item: MenuReport["verifiedInsights"][number]; lang: "ar" | "en" }) {
  const ar = lang === "ar";
  return <article className="grid gap-3 rounded-2xl border border-line bg-paper p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-medium leading-6">{ar ? item.titleAr : item.titleEn}</h3><p className="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-accent">{ar ? item.priority === "high" ? "أولوية عالية" : item.priority === "medium" ? "أولوية متوسطة" : "أولوية منخفضة" : `${item.priority} priority`}</p></div><Sparkles className="size-4 shrink-0 text-accent" aria-hidden="true" /></div><p className="text-sm leading-6 text-muted">{ar ? item.evidenceAr : item.evidenceEn}</p><p className="text-sm leading-6">{ar ? item.interpretationAr : item.interpretationEn}</p><div className="rounded-xl bg-sand/45 p-3 text-sm leading-6"><span className="font-medium">{ar ? "الإجراء: " : "Action: "}</span>{ar ? item.recommendationAr : item.recommendationEn}</div></article>;
}

function ActionCard({ item, index, lang }: { item: MenuReport["advisor"]["actions"][number]; index: number; lang: "ar" | "en" }) {
  const ar = lang === "ar";
  return <article className="grid gap-3 rounded-2xl border border-line p-4"><div className="flex items-center justify-between gap-3"><span className="grid size-8 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">{index + 1}</span><span className="text-xs font-semibold uppercase tracking-[.1em] text-accent">{ar ? item.priority === "high" ? "عالي" : item.priority === "medium" ? "متوسط" : "منخفض" : item.priority}</span></div><h3 className="font-medium leading-6">{ar ? item.titleAr : item.titleEn}</h3><p className="text-sm leading-6 text-muted">{ar ? item.reasonAr : item.reasonEn}</p><div className="flex items-center justify-between gap-3 text-xs text-muted"><span>{ar ? item.metricAr : item.metricEn}</span><ArrowUpRight className="size-4" aria-hidden="true" /></div></article>;
}

function EmptyMessage({ text }: { text: string }) { return <p className="rounded-2xl border border-dashed border-line p-5 text-sm leading-6 text-muted">{text}</p>; }

function formatDate(value: string, lang: "ar" | "en") {
  try { return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", { dateStyle: "medium" }).format(new Date(value)); } catch { return value.slice(0, 10); }
}
