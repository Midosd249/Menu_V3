import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpLeft, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { getOwnerAnalytics } from "@/lib/menu/owner";
import { useStudio } from "@/lib/menu/studio";
import { buildMenuGrowthEngine, type MenuGrowthEngine } from "@/lib/menu/growth-engine";
import type { OwnerAnalytics } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/growth")({ component: GrowthPage });

type LoadState = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: OwnerAnalytics };

function GrowthPage() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback((refresh = false) => {
    if (refresh) setRefreshing(true); else setState({ status: "loading" });
    getOwnerAnalytics({ data: { days: 7 } })
      .then((result) => setState(result.ok ? { status: "ready", data: result.data } : { status: "error", message: result.error }))
      .catch((error: unknown) => setState({ status: "error", message: error instanceof Error ? error.message : "تعذر تحميل بيانات النمو" }))
      .finally(() => setRefreshing(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const engine = useMemo<MenuGrowthEngine | null>(() => state.status === "ready" ? buildMenuGrowthEngine(snapshot, state.data) : null, [snapshot, state]);
  const isAr = lang === "ar";

  if (state.status === "loading" || !engine) return <div className="mx-auto max-w-6xl"><LoadingState /></div>;
  if (state.status === "error") return <div className="mx-auto max-w-6xl"><ErrorState message={state.message} /></div>;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 pb-8">
      <header className="rounded-3xl border border-line bg-ink p-6 text-paper md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-paper/70"><Sparkles className="size-4" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-[.18em]">{isAr ? "محرك نمو القائمة" : "Menu growth engine"}</span></div>
          <Button type="button" variant="outline" onClick={() => load(true)} disabled={refreshing} className="border-paper/20 bg-paper/10 text-paper hover:bg-paper/15 hover:text-paper"><RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />{isAr ? "تحديث" : "Refresh"}</Button>
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">{isAr ? "لاحظ → نفّذ → قِس → تعلّم" : "Observe → Act → Measure → Learn"}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-paper/70">{isAr ? "طبقة واحدة تجمع صحة القائمة، الأدلة السلوكية، الإجراءات المقترحة، وتجارب النمو. مصدر الحقيقة هو بيانات Menu V3؛ لا يتم تغيير القائمة تلقائيًا." : "One surface connecting menu health, behavioral evidence, recommended actions, and growth experiments. Menu V3 data remains the source of truth; nothing changes automatically."}</p>
      </header>

      <section className="grid gap-3 md:grid-cols-3" aria-label={isAr ? "حلقة النمو" : "Growth loop"}>
        <Stage active={engine.loop.currentStage === "observe"} number="01" title={isAr ? "راقب" : "Observe"} text={isAr ? "اجمع إشارات حقيقية قبل الاستنتاج." : "Collect real signals before inferring."} />
        <Stage active={engine.loop.currentStage === "act"} number="02" title={isAr ? "نفّذ" : "Act"} text={isAr ? "اختر إجراءً واضحًا وراجعه قبل التطبيق." : "Choose a clear action and review it before applying."} />
        <Stage active={engine.loop.currentStage === "measure"} number="03" title={isAr ? "قِس" : "Measure"} text={isAr ? "أعد قراءة الدليل بعد التغيير." : "Re-read evidence after the change."} />
      </section>

      <section className="rounded-3xl border border-line bg-paper p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{isAr ? "الخطوة التالية" : "Next step"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{isAr ? engine.loop.nextAr : engine.loop.nextEn}</h2></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${engine.loop.evidence === "verified" ? "bg-good/10 text-good" : "bg-sand text-muted"}`}>{engine.loop.evidence === "verified" ? (isAr ? "دليل موثق" : "Verified evidence") : (isAr ? "دليل غير كافٍ" : "Insufficient evidence")}</span></div>
      </section>

      <section className="grid gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{isAr ? "R8.1 + R8.2" : "R8.1 + R8.2"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{isAr ? "إجراءات مبنية على الأدلة" : "Evidence-based actions"}</h2><p className="mt-1 text-sm text-muted">{isAr ? "كل توصية تربط بين الدليل والتفسير والخطوة التالية. التنفيذ يبقى بيد صاحب المطعم." : "Every recommendation connects evidence, interpretation, and a next action. Execution remains with the restaurant owner."}</p></div>
        {engine.recommendations.map((item) => <article key={item.key} className="grid gap-4 rounded-2xl border border-line bg-paper p-5 md:grid-cols-[1fr_auto] md:items-center"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{isAr ? item.titleAr : item.titleEn}</h3><span className="rounded-full bg-sand px-2.5 py-1 text-xs text-muted">{item.priority}</span></div><p className="mt-2 text-sm text-muted"><strong>{isAr ? "الدليل:" : "Evidence:"}</strong> {isAr ? item.evidenceAr : item.evidenceEn}</p><p className="mt-1 text-sm text-muted"><strong>{isAr ? "التوصية:" : "Recommendation:"}</strong> {isAr ? item.recommendationAr : item.recommendationEn}</p></div><Button asChild size="sm"><Link to={item.href}>{isAr ? "مراجعة" : "Review"}<ArrowUpLeft className="size-4" aria-hidden="true" /></Link></Button></article>)}
        {engine.recommendations.length === 0 ? <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-5 text-sm"><CheckCircle2 className="size-5 text-good" aria-hidden="true" />{isAr ? "لا توجد توصيات أعلى أولوية من الأدلة الحالية." : "No higher-priority recommendations are supported by current evidence."}</div> : null}
      </section>

      <section className="grid gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{isAr ? "R8.3" : "R8.3"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{isAr ? "مختبر تجارب النمو" : "Growth experiment lab"}</h2><p className="mt-1 text-sm text-muted">{isAr ? "لا يتم تشغيل أي تجربة تلقائيًا. هذه مساحة لاختيار فرضية واحدة، تثبيت baseline، وتعريف metric وguardrail قبل التفعيل." : "Experiments never activate automatically. Choose one hypothesis, establish a baseline, and define a metric and guardrail before activation."}</p></div>
        {engine.experiments.map((item) => <article key={item.key} className="rounded-2xl border border-line bg-paper p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-xl font-semibold">{isAr ? item.titleAr : item.titleEn}</h3><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "active" ? "bg-good/10 text-good" : item.status === "ready" ? "bg-accent/10 text-accent" : "bg-sand text-muted"}`}>{item.status === "active" ? (isAr ? "نشطة" : "Active") : item.status === "ready" ? (isAr ? "جاهزة للتصميم" : "Ready to design") : (isAr ? "تنتظر الدليل" : "Needs evidence")}</span></div><p className="mt-3 text-sm leading-6 text-muted">{isAr ? item.hypothesisAr : item.hypothesisEn}</p><div className="mt-4 grid gap-3 md:grid-cols-2"><Metric label={isAr ? "المقياس الأساسي" : "Primary metric"} value={isAr ? item.primaryMetricAr : item.primaryMetricEn} /><Metric label={isAr ? "مقياس الحماية" : "Guardrail"} value={isAr ? item.guardrailAr : item.guardrailEn} /></div><p className="mt-4 rounded-xl bg-sand/50 p-3 text-xs leading-5 text-muted">{isAr ? item.eligibilityAr : item.eligibilityEn}</p></article>)}
      </section>
    </div>
  );
}

function Stage({ active, number, title, text }: { active: boolean; number: string; title: string; text: string }) { return <article className={`rounded-2xl border p-5 ${active ? "border-accent bg-paper" : "border-line bg-paper/60"}`}><span className="text-xs font-semibold tracking-[.16em] text-muted">{number}</span><h2 className="mt-2 font-display text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-muted">{text}</p></article>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-line p-4"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-1 text-sm leading-5">{value}</p></div>; }
