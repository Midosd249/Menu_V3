import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpLeft, BarChart3, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { getOwnerAnalytics } from "@/lib/menu/owner";
import { useStudio } from "@/lib/menu/studio";
import { buildMenuGrowthAdvisor, type MenuGrowthAdvisor } from "@/lib/menu/growth-advisor";
import { buildMenuIntelligence, type MenuIntelligence } from "@/lib/menu/intelligence";
import type { OwnerAnalytics } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/intelligence")({ component: IntelligencePage });

type LoadState = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: OwnerAnalytics };

function IntelligencePage() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const [analytics, setAnalytics] = useState<LoadState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const load = () => {
    setRefreshing(true);
    getOwnerAnalytics({ data: { days: 7 } })
      .then((result) => setAnalytics(result.ok ? { status: "ready", data: result.data } : { status: "error", message: result.error }))
      .catch((error: unknown) => setAnalytics({ status: "error", message: error instanceof Error ? error.message : "تعذر تحميل الذكاء" }))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => { load(); }, []);

  const intelligence = useMemo<MenuIntelligence | null>(() => {
    if (analytics.status !== "ready") return null;
    return buildMenuIntelligence(snapshot, analytics.data);
  }, [analytics, snapshot]);
  const advisor = useMemo<MenuGrowthAdvisor | null>(() => {
    if (analytics.status !== "ready") return null;
    return buildMenuGrowthAdvisor(snapshot, analytics.data);
  }, [analytics, snapshot]);

  if (analytics.status === "error") return <div className="mx-auto max-w-5xl"><ErrorState message={analytics.message} /></div>;
  if (!intelligence || !advisor) return <div className="mx-auto grid max-w-5xl gap-4"><div className="h-40 animate-pulse rounded-3xl border border-line bg-sand/30" /><div className="h-60 animate-pulse rounded-3xl border border-line bg-sand/30" /></div>;

  const title = lang === "ar" ? "ذكاء القائمة" : "Menu Intelligence";
  const headline = lang === "ar" ? intelligence.headlineAr : intelligence.headlineEn;
  const briefing = lang === "ar" ? intelligence.briefingAr : intelligence.briefingEn;
  const issues = intelligence.issues;
  const high = issues.filter((item) => item.severity === "high").length;
  const medium = issues.filter((item) => item.severity === "medium").length;

  return <div className="mx-auto grid max-w-5xl gap-5">
    <section className="overflow-hidden rounded-3xl border border-line bg-ink p-6 text-paper md:p-8">
      <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div><div className="flex items-center gap-2 text-paper/70"><Sparkles className="size-4" /><span className="text-xs font-semibold uppercase tracking-[.18em]">{title}</span></div><h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold md:text-4xl">{headline}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-paper/70">{lang === "ar" ? "فحص عملي للقائمة يعتمد على بياناتك الحالية. لا يتم احتساب مبيعات أو تحويلات غير موجودة في البيانات." : "A practical menu check based on your current data. It never invents sales or conversion metrics."}</p></div>
        <div className="grid size-28 place-items-center rounded-full border border-paper/20 bg-paper/10"><div className="text-center"><div className="font-display text-4xl font-semibold tabular">{intelligence.score}</div><div className="text-xs text-paper/60">/ 100</div></div></div>
      </div>
    </section>

    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <ScoreCard label={lang === "ar" ? "المحتوى" : "Content"} value={intelligence.contentScore} />
      <ScoreCard label={lang === "ar" ? "العرض" : "Presentation"} value={intelligence.presentationScore} />
      <ScoreCard label={lang === "ar" ? "التشغيل" : "Operations"} value={intelligence.operationsScore} />
      <ScoreCard label={lang === "ar" ? "الملاحظات" : "Issues"} value={issues.length} suffix={lang === "ar" ? "ملاحظة" : "issues"} />
    </section>

    <section className="grid gap-4 md:grid-cols-[1.15fr_.85fr]">
      <article className="grid gap-5 rounded-3xl border border-line bg-sand/20 p-6">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "ملخصك" : "Your briefing"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? "ماذا يحتاج انتباهك؟" : "What needs your attention?"}</h2></div><button type="button" onClick={load} disabled={refreshing} className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-paper" aria-label={lang === "ar" ? "تحديث" : "Refresh"}><RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} /></button></div>
        <ul className="grid gap-3">{briefing.map((item, index) => <li key={`${item}-${index}`} className="flex gap-3 rounded-2xl border border-line bg-paper p-4 text-sm leading-6"><CheckCircle2 className="mt-1 size-4 shrink-0 text-good" /><span>{item}</span></li>)}</ul>
      </article>

      <article className="grid content-start gap-4 rounded-3xl border border-line bg-paper p-6">
        <div className="flex items-center gap-2"><BarChart3 className="size-5" /><h2 className="font-display text-2xl font-semibold">{lang === "ar" ? "إشارة الأداء" : "Performance signal"}</h2></div>
        {intelligence.leadingProduct ? <div className="rounded-2xl bg-sand/40 p-4"><p className="text-xs text-muted">{lang === "ar" ? "الأكثر مشاهدة خلال 7 أيام" : "Most viewed in 7 days"}</p><p className="mt-2 font-semibold">{lang === "ar" ? intelligence.leadingProduct.nameAr : intelligence.leadingProduct.nameEn || intelligence.leadingProduct.nameAr}</p><p className="mt-1 text-2xl font-display tabular">{intelligence.leadingProduct.count}</p></div> : <p className="rounded-2xl bg-sand/40 p-4 text-sm leading-6 text-muted">{lang === "ar" ? "لا توجد بيانات كافية بعد. سيظهر هذا القسم تلقائيًا عندما تبدأ زيارات القائمة." : "Not enough data yet. This section becomes useful once guests visit the menu."}</p>}
        {intelligence.leadingCategory ? <p className="text-sm text-muted">{lang === "ar" ? `التصنيف الأكثر مشاهدة: ${intelligence.leadingCategory.nameAr}` : `Top category: ${intelligence.leadingCategory.nameEn || intelligence.leadingCategory.nameAr}`}</p> : null}
        <p className="text-xs leading-5 text-muted">{lang === "ar" ? "هذه إشارة اتجاهية وليست وعدًا بالمبيعات أو التحويل." : "This is a directional signal, not a sales or conversion claim."}</p>
      </article>
    </section>

    <section className="grid gap-4 rounded-3xl border border-line bg-sand/10 p-6">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "إشارات موثقة" : "Verified signals"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? "ماذا تقول البيانات؟" : "What the data says"}</h2><p className="mt-1 text-sm text-muted">{lang === "ar" ? "كل إشارة أدناه مرتبطة ببيانات فعلية؛ التفسير لا يتحول إلى حقيقة بديلة." : "Each signal below is grounded in observed data; interpretation never replaces the underlying facts."}</p></div>
      {advisor.insights.length === 0 ? <div className="rounded-2xl border border-line bg-paper p-5 text-sm text-muted">{lang === "ar" ? "لا توجد إشارة تحليلية إضافية قابلة للاعتماد الآن." : "There is no additional verified analytics signal yet."}</div> : <div className="grid gap-3 md:grid-cols-2">{advisor.insights.map((insight) => <article key={insight.key} className="grid gap-3 rounded-2xl border border-line bg-paper p-5"><div className="flex items-start justify-between gap-3"><div><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${insight.priority === "high" ? "bg-warn/15 text-warn" : insight.priority === "medium" ? "bg-accent/10 text-accent" : "bg-sand text-muted"}`}>{insight.priority === "high" ? (lang === "ar" ? "أولوية عالية" : "High priority") : insight.priority === "medium" ? (lang === "ar" ? "أولوية متوسطة" : "Medium priority") : (lang === "ar" ? "متابعة" : "Monitor")}</span><h3 className="mt-2 font-medium">{lang === "ar" ? insight.titleAr : insight.titleEn}</h3></div><BarChart3 className="size-4 shrink-0 text-muted" aria-hidden="true" /></div><p className="text-sm leading-6"><strong>{lang === "ar" ? "الدليل: " : "Evidence: "}</strong>{lang === "ar" ? insight.evidenceAr : insight.evidenceEn}</p><p className="text-sm leading-6 text-muted">{lang === "ar" ? insight.interpretationAr : insight.interpretationEn}</p><div className="rounded-xl bg-sand/40 p-3 text-sm"><strong>{lang === "ar" ? "الخطوة المقترحة: " : "Recommended: "}</strong>{lang === "ar" ? insight.recommendationAr : insight.recommendationEn}</div></article>)}</div>}
    </section>

    <section className="grid gap-4 rounded-3xl border border-line bg-paper p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "الأولوية التالية" : "Next priority"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? "خطوات النمو المقترحة" : "Recommended growth actions"}</h2><p className="mt-1 text-sm text-muted">{lang === "ar" ? advisor.summaryAr : advisor.summaryEn}</p></div><Sparkles className="size-5 text-accent" aria-hidden="true" /></div>
      {advisor.actions.length === 0 ? <div className="flex items-center gap-3 rounded-2xl border border-line bg-sand/20 p-5 text-sm"><CheckCircle2 className="size-5 text-good" /><span>{lang === "ar" ? "لا توجد خطوة واضحة أعلى أولوية الآن." : "There is no clear higher-priority action right now."}</span></div> : <div className="grid gap-3 md:grid-cols-2">{advisor.actions.map((action, index) => <article key={action.key} className="grid gap-4 rounded-2xl border border-line bg-sand/20 p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">{index + 1}</span><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${action.priority === "high" ? "bg-warn/15 text-warn" : action.priority === "medium" ? "bg-accent/10 text-accent" : "bg-sand text-muted"}`}>{action.priority === "high" ? (lang === "ar" ? "عالية" : "High") : action.priority === "medium" ? (lang === "ar" ? "متوسطة" : "Medium") : (lang === "ar" ? "منخفضة" : "Low")}</span></div><ArrowUpLeft className="size-4 text-muted" aria-hidden="true" /></div><div><h3 className="font-medium">{lang === "ar" ? action.titleAr : action.titleEn}</h3><p className="mt-1 text-sm leading-6 text-muted">{lang === "ar" ? action.reasonAr : action.reasonEn}</p></div><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium text-muted">{lang === "ar" ? action.metricAr : action.metricEn}</span><Button asChild size="sm"><Link to={action.href}>{lang === "ar" ? "تنفيذ" : "Open"}</Link></Button></div></article>)}</div>}
    </section>

    <section className="grid gap-4 rounded-3xl border border-line p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "مركز الإصلاح" : "Fix center"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? "أهم ما يمكنك تحسينه الآن" : "What you can improve now"}</h2><p className="mt-1 text-sm text-muted">{high} {lang === "ar" ? "عالية" : "high"} · {medium} {lang === "ar" ? "متوسطة" : "medium"}</p></div><Button asChild variant="outline"><Link to="/studio/menu">{lang === "ar" ? "فتح محرر القائمة" : "Open menu editor"}<ArrowUpLeft className="size-4" /></Link></Button></div>
      {issues.length === 0 ? <div className="flex items-center gap-3 rounded-2xl border border-line bg-sand/20 p-5 text-sm"><CheckCircle2 className="size-5 text-good" /><span>{lang === "ar" ? "ممتاز — لا توجد ملاحظات تحتاج إجراءً حاليًا." : "Great — there are no actionable issues right now."}</span></div> : <div className="grid gap-3">{issues.map((issue) => <div key={issue.key} className="grid gap-4 rounded-2xl border border-line p-4 md:grid-cols-[auto_1fr_auto] md:items-center"><span className={`inline-flex h-8 w-fit items-center gap-1 rounded-full px-2.5 text-xs font-medium ${issue.severity === "high" ? "bg-warn/15 text-warn" : issue.severity === "medium" ? "bg-accent/10 text-accent" : "bg-sand text-muted"}`}><AlertTriangle className="size-3.5" />{issue.severity === "high" ? (lang === "ar" ? "عالية" : "High") : issue.severity === "medium" ? (lang === "ar" ? "متوسطة" : "Medium") : (lang === "ar" ? "منخفضة" : "Low")}</span><div><h3 className="font-medium">{lang === "ar" ? issue.titleAr : issue.titleEn}</h3><p className="mt-1 text-sm leading-6 text-muted">{lang === "ar" ? issue.detailAr : issue.detailEn}</p></div><Button asChild size="sm"><Link to={issue.href}>{lang === "ar" ? "مراجعة" : "Review"}</Link></Button></div>)}</div>}
    </section>

    <p className="text-center text-xs leading-5 text-muted">{lang === "ar" ? "تم بناء هذا التقييم من بيانات القائمة والتحليلات المتاحة فقط. لا يتم اختلاق بيانات غير موجودة." : "This assessment uses only available menu and analytics data. It never fabricates unavailable metrics."}</p>
  </div>;
}

function ScoreCard({ label, value, suffix }: { label: string; value: number; suffix?: string }) { return <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">{label}</p><p className="mt-2 font-display text-2xl tabular">{value}{suffix ? <span className="ms-1 text-xs font-sans text-muted">{suffix}</span> : null}</p></div>; }
