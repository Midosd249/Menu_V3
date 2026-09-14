import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpLeft, Eye, RefreshCw, Target } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  ActionCard,
  EmptyState,
  ErrorState,
  InsightCard,
  LoadingState,
  MetricRow,
  PageHeader,
  SectionHeader,
  StatusBadge,
} from "@/components/internal-design-system";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { getOwnerAnalytics } from "@/lib/menu/owner";
import { useStudio } from "@/lib/menu/studio";
import { buildMenuGrowthEngine, type MenuGrowthEngine } from "@/lib/menu/growth-engine";
import { buildMenuGrowthAdvisor, type MenuGrowthAdvisor } from "@/lib/menu/growth-advisor";
import { buildMenuIntelligence, type MenuIntelligence } from "@/lib/menu/intelligence";
import { buildIntelligenceDataQuality, type IntelligenceDataQuality } from "@/lib/menu/intelligence-data-quality";
import type { OwnerAnalytics } from "@/lib/menu/types";

export function StudioGrowthWorkspace() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; analytics: OwnerAnalytics }
  >({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((refresh = false) => {
    if (refresh) setRefreshing(true);
    else setState({ status: "loading" });

    getOwnerAnalytics({ data: { days: 7 } })
      .then((result) => {
        setState(result.ok ? { status: "ready", analytics: result.data } : { status: "error", message: result.error });
      })
      .catch((error: unknown) => {
        setState({ status: "error", message: error instanceof Error ? error.message : "تعذر تحميل بيانات النمو" });
      })
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const engine = useMemo<MenuGrowthEngine | null>(() => {
    if (state.status !== "ready") return null;
    return buildMenuGrowthEngine(snapshot, state.analytics);
  }, [snapshot, state]);

  const intelligence = useMemo<MenuIntelligence | null>(() => {
    if (state.status !== "ready") return null;
    return buildMenuIntelligence(snapshot, state.analytics);
  }, [snapshot, state]);

  const advisor = useMemo<MenuGrowthAdvisor | null>(() => {
    if (state.status !== "ready") return null;
    return buildMenuGrowthAdvisor(snapshot, state.analytics);
  }, [snapshot, state]);

  const evidenceQuality = useMemo<IntelligenceDataQuality | null>(() => {
    if (state.status !== "ready") return null;
    return buildIntelligenceDataQuality(state.analytics, new Date());
  }, [state]);

  const isAr = lang === "ar";

  if (state.status === "loading" || !engine || !intelligence || !advisor || !evidenceQuality) {
    return <LoadingState label={isAr ? "جارٍ تحميل مساحة النمو…" : "Loading Growth Workspace…"} />;
  }

  if (state.status === "error") {
    return <ErrorState title={isAr ? "تعذر تحميل مساحة النمو" : "Growth Workspace unavailable"} message={state.message} action={<Button type="button" variant="outline" onClick={() => load(true)}>{isAr ? "إعادة المحاولة" : "Retry"}</Button>} />;
  }

  const analytics = state.analytics;
  const hasAnalytics = analytics.visits > 0 || analytics.uniqueSessions > 0 || analytics.productViews > 0 || analytics.qrScans > 0 || analytics.whatsappClicks > 0;
  const evidenceLabel = evidenceQuality.status === "fresh"
    ? (isAr ? "البيانات حديثة" : "Fresh evidence")
    : evidenceQuality.status === "stale"
      ? (isAr ? "البيانات قديمة" : "Stale evidence")
      : (isAr ? "بيانات غير كافية" : "Insufficient evidence");
  const evidenceStatus = evidenceQuality.status === "fresh" ? "success" : evidenceQuality.status === "stale" ? "warning" : "neutral";
  const experiment = engine.experiments.find((item) => item.key === "whatsapp-cta-v1");
  const readyExperiments = engine.experiments.filter((item) => item.status === "ready");
  const activeRecommendations = engine.recommendations.slice(0, 3);

  return (
    <div className="mx-auto grid max-w-6xl gap-7 pb-10">
      <PageHeader
        eyebrow={isAr ? "مساحة النمو" : "Growth Workspace"}
        title={isAr ? "من الملاحظة إلى قرار واضح" : "From observation to a clear decision"}
        description={isAr
          ? "مساحة واحدة تجمع الأداء الحقيقي، تفسير الإشارة، الإجراء المسموح، ثم القياس. لا توجد تغييرات تلقائية ولا ادعاءات تتجاوز البيانات."
          : "One workspace for real performance, evidence, supported actions, and measurement. Nothing changes automatically and no claim exceeds the available data."}
        actions={(
          <Button type="button" variant="outline" onClick={() => load(true)} disabled={refreshing} aria-label={isAr ? "تحديث بيانات النمو" : "Refresh growth data"}>
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
            {isAr ? "تحديث" : "Refresh"}
          </Button>
        )}
      />

      <section className="flex flex-col gap-3 rounded-lg border border-line bg-sand/25 p-4 sm:flex-row sm:items-center sm:justify-between" aria-label={isAr ? "سياق مساحة النمو" : "Growth context"}>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">{isAr ? "المنشأة" : "Restaurant"}</p>
          <p className="truncate text-sm font-semibold text-ink">{isAr ? snapshot.tenant.nameAr : snapshot.tenant.nameEn || snapshot.tenant.nameAr}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>{isAr ? "نافذة التحليل" : "Analysis window"}: {analytics.rangeDays} {isAr ? "أيام" : "days"}</span>
          <span aria-hidden="true">•</span>
          <span>{snapshot.branches.length} {isAr ? "فروع ضمن حساب المنشأة" : "branches in the restaurant account"}</span>
          <StatusBadge status={evidenceStatus}>{evidenceLabel}</StatusBadge>
        </div>
      </section>

      <nav aria-label={isAr ? "تنقل مساحة النمو" : "Growth workspace navigation"} className="flex gap-2 overflow-x-auto pb-1">
        <GrowthNavLink to="/studio/growth" active label={isAr ? "نظرة عامة" : "Overview"} />
        <GrowthNavLink to="/studio/intelligence" label={isAr ? "الذكاء" : "Intelligence"} />
        <GrowthNavLink to="/studio/intelligence-actions" label={isAr ? "الإجراءات" : "Actions"} />
        <GrowthNavLink to="/studio/analytics" label={isAr ? "التحليلات" : "Analytics"} />
        <GrowthNavLink to="/studio/reports" label={isAr ? "التقارير" : "Reports"} />
      </nav>

      <section aria-labelledby="growth-observe-heading" className="grid gap-4">
        <SectionHeader
          title={<span id="growth-observe-heading">{isAr ? "1. راقب" : "1. Observe"}</span>}
          description={isAr ? "ما الذي يحدث الآن وفق البيانات المسجلة فعليًا؟" : "What is happening now according to recorded data?"}
          action={<span className="text-xs text-muted">{isAr ? `آخر ${analytics.rangeDays} أيام` : `Last ${analytics.rangeDays} days`}</span>}
        />
        {!hasAnalytics ? (
          <EmptyState
            title={isAr ? "لا توجد بيانات نشاط كافية بعد" : "No activity data yet"}
            body={isAr ? "لا يعني غياب البيانات أن الأداء ضعيف. ستظهر إشارات الأداء هنا بعد تسجيل زيارات أو مشاهدات أو نقرات حقيقية." : "Missing activity data does not mean poor performance. Performance signals will appear after real visits, views, or clicks are recorded."}
            action={<Button asChild variant="outline"><Link to="/studio/analytics">{isAr ? "فتح التحليلات" : "Open analytics"}</Link></Button>}
          />
        ) : (
          <div className="rounded-lg border border-line bg-paper px-4">
            <MetricRow label={isAr ? "الزيارات" : "Visits"} value={analytics.visits} detail={isAr ? "زيارات مسجلة" : "Recorded visits"} />
            <MetricRow label={isAr ? "الجلسات" : "Sessions"} value={analytics.uniqueSessions} detail={isAr ? "جلسات فريدة ضمن مصدر التحليلات الحالي" : "Unique sessions in the current analytics source"} />
            <MetricRow label={isAr ? "مشاهدات المنتجات" : "Product views"} value={analytics.productViews} detail={isAr ? "مشاهدات مسجلة للأصناف" : "Recorded product views"} />
            <MetricRow label={isAr ? "نقرات واتساب" : "WhatsApp clicks"} value={analytics.whatsappClicks} detail={isAr ? "نقرات مسجلة فقط، وليست طلبات أو مبيعات" : "Recorded clicks, not orders or sales"} />
          </div>
        )}
      </section>

      <section aria-labelledby="growth-understand-heading" className="grid gap-4">
        <SectionHeader
          title={<span id="growth-understand-heading">{isAr ? "2. افهم" : "2. Understand"}</span>}
          description={isAr ? "افصل الدليل عن التفسير والتوصية." : "Keep evidence, interpretation, and recommendation distinct."}
          action={<Button asChild variant="outline" size="sm"><Link to="/studio/intelligence">{isAr ? "فتح الذكاء" : "Open intelligence"}<ArrowUpLeft className="size-4" aria-hidden="true" /></Link></Button>}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <InsightCard
            title={isAr ? "حالة صحة القائمة" : "Menu health"}
            body={isAr ? intelligence.headlineAr : intelligence.headlineEn}
            meta={isAr ? `درجة صحة القائمة الحالية: ${intelligence.score}/100 — هذا مؤشر محتوى/تشغيل، وليس نتيجة مالية.` : `Current menu health: ${intelligence.score}/100 — a content/operations signal, not a financial outcome.`}
            tone={intelligence.score >= 80 ? "success" : intelligence.score >= 60 ? "warning" : "danger"}
            action={<Link className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" to="/studio/intelligence">{isAr ? "راجع التفاصيل" : "Review details"}<ArrowUpLeft className="size-4" aria-hidden="true" /></Link>}
          />
          {advisor.insights.length > 0 ? (
            <InsightCard
              title={isAr ? advisor.insights[0].titleAr : advisor.insights[0].titleEn}
              body={isAr ? advisor.insights[0].interpretationAr : advisor.insights[0].interpretationEn}
              meta={<>{isAr ? "الدليل: " : "Evidence: "}{isAr ? advisor.insights[0].evidenceAr : advisor.insights[0].evidenceEn}</>}
              tone={advisor.insights[0].priority === "high" ? "warning" : "info"}
              action={<Link className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" to="/studio/intelligence">{isAr ? "راجع الإشارة" : "Review signal"}<ArrowUpLeft className="size-4" aria-hidden="true" /></Link>}
            />
          ) : (
            <EmptyState title={isAr ? "لا توجد إشارة تحليلية إضافية" : "No additional analytics insight"} body={isAr ? "لا توجد أدلة كافية لإضافة تفسير جديد الآن." : "There is not enough evidence to add another interpretation right now."} />
          )}
        </div>
      </section>

      <section aria-labelledby="growth-act-heading" className="grid gap-4">
        <SectionHeader
          title={<span id="growth-act-heading">{isAr ? "3. نفّذ" : "3. Act"}</span>}
          description={isAr ? "الإجراءات الموجودة فعلًا، مع مراجعة المالك قبل أي تغيير." : "Existing supported actions, with owner review before any change."}
          action={<Button asChild variant="outline" size="sm"><Link to="/studio/intelligence-actions">{isAr ? "مركز الإجراءات" : "Action center"}<ArrowUpLeft className="size-4" aria-hidden="true" /></Link></Button>}
        />
        {activeRecommendations.length === 0 ? (
          <EmptyState title={isAr ? "لا توجد خطوة أعلى أولوية الآن" : "No higher-priority action now"} body={isAr ? "لا نعرض إجراءً لم تدعمه الأدلة الحالية." : "No action is shown unless current evidence supports it."} />
        ) : (
          <div className="grid gap-3">
            {activeRecommendations.map((item) => (
              <ActionCard
                key={item.key}
                title={isAr ? item.titleAr : item.titleEn}
                body={isAr ? `${item.evidenceAr} ${item.recommendationAr}` : `${item.evidenceEn} ${item.recommendationEn}`}
                action={<Button asChild size="sm"><Link to={item.href}>{isAr ? "مراجعة" : "Review"}<ArrowUpLeft className="size-4" aria-hidden="true" /></Link></Button>}
              />
            ))}
          </div>
        )}
        <p className="text-xs leading-5 text-muted">{isAr ? "لا يوجد زر تطبيق تلقائي هنا. التنفيذ يتم داخل الوجهة الحالية وبعد مراجعة المالك." : "There is no automatic apply action here. Execution happens in the existing destination after owner review."}</p>
      </section>

      <section aria-labelledby="growth-measure-heading" className="grid gap-4">
        <SectionHeader
          title={<span id="growth-measure-heading">{isAr ? "4. قِس" : "4. Measure"}</span>}
          description={isAr ? "اعرض النتيجة المسجلة فقط؛ إذا لم توجد نتيجة فلا نخترع أثرًا." : "Show recorded outcomes only; if an outcome does not exist, do not invent impact."}
          action={<Button asChild variant="outline" size="sm"><Link to="/studio/analytics">{isAr ? "فتح القياس" : "Open measurement"}<ArrowUpLeft className="size-4" aria-hidden="true" /></Link></Button>}
        />
        <div className="rounded-lg border border-line bg-paper px-4">
          <MetricRow label={isAr ? "مشاهدات المنتجات لكل جلسة" : "Product views per session"} value={analytics.uniqueSessions > 0 ? (analytics.productViews / analytics.uniqueSessions).toFixed(1) : "—"} detail={isAr ? "نسبة تشغيلية من المصدر الحالي وليست معدل تحويل لمستخدمين فريدين." : "Operational ratio from the current source, not a unique-user conversion rate."} />
          <MetricRow label={isAr ? "مسوح QR" : "QR scans"} value={analytics.qrScans} detail={isAr ? "إشارة توزيع مسجلة" : "Recorded distribution signal"} />
          <MetricRow label={isAr ? "نقرات واتساب" : "WhatsApp clicks"} value={analytics.whatsappClicks} detail={isAr ? "النتيجة المسجلة الحالية" : "Current recorded outcome"} />
        </div>
        {experiment ? (
          <InsightCard
            title={isAr ? experiment.titleAr : experiment.titleEn}
            body={isAr ? experiment.hypothesisAr : experiment.hypothesisEn}
            meta={<>{isAr ? "الحالة: " : "Status: "}{experiment.status === "active" ? (isAr ? "نشطة، والنتيجة غير محسومة بعد" : "Active; outcome not decided yet") : experiment.status === "ready" ? (isAr ? "جاهزة للتصميم، وليست مفعّلة" : "Design-ready; not activated") : (isAr ? "دليل غير كافٍ" : "Insufficient evidence")}</>}
            tone={experiment.status === "active" ? "info" : experiment.status === "ready" ? "success" : "neutral"}
            action={<div className="grid gap-2 text-xs leading-5 text-muted"><span>{isAr ? "المقياس الأساسي: " : "Primary metric: "}{isAr ? experiment.primaryMetricAr : experiment.primaryMetricEn}</span><span>{isAr ? "الحارس: " : "Guardrail: "}{isAr ? experiment.guardrailAr : experiment.guardrailEn}</span><span>{isAr ? experiment.eligibilityAr : experiment.eligibilityEn}</span></div>}
          />
        ) : null}
        {readyExperiments.length > 0 ? <div className="flex items-center gap-2 rounded-lg border border-line bg-sand/20 p-4 text-sm"><Target className="size-5 shrink-0 text-accent" aria-hidden="true" />{isAr ? `${readyExperiments.length} فرصة تجربة جاهزة للتصميم فقط؛ لا توجد آلية تفعيل جديدة في W7.6.` : `${readyExperiments.length} experiment opportunities are design-ready only; W7.6 adds no activation engine.`}</div> : null}
      </section>

      <section className="grid gap-3 rounded-lg border border-line bg-sand/20 p-4">
        <div className="flex items-start gap-3"><Eye className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" /><div><p className="text-sm font-semibold">{isAr ? "حدود الدليل" : "Evidence boundary"}</p><p className="mt-1 text-xs leading-5 text-muted">{isAr ? "هذه المساحة لا تستنتج الإيرادات أو الأرباح أو التحويلات أو العائد أو السببية من أحداث القائمة الحالية. التوصيات إرشادات مرتبطة بمصدرها، والتجارب لا تُحسم دون تعرض حقيقي كافٍ." : "This workspace does not infer revenue, profit, conversion, ROI, or causality from the current menu events. Recommendations remain source-bound guidance, and experiments are not decided without sufficient real exposure."}</p></div></div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/studio/intelligence">{isAr ? "الذكاء" : "Intelligence"}</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/studio/intelligence-actions">{isAr ? "الإجراءات" : "Actions"}</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/studio/analytics">{isAr ? "التحليلات" : "Analytics"}</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/studio/reports">{isAr ? "التقارير" : "Reports"}</Link></Button>
        </div>
      </section>
    </div>
  );
}

function GrowthNavLink({ to, label, active = false }: { to: "/studio/growth" | "/studio/intelligence" | "/studio/intelligence-actions" | "/studio/analytics" | "/studio/reports"; label: string; active?: boolean }) {
  return <Link to={to} aria-current={active ? "page" : undefined} className={`inline-flex min-h-10 shrink-0 items-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-soft hover:bg-sand"}`}>{label}</Link>;
}
