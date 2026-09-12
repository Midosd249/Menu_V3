import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { getOwnerAnalytics } from "@/lib/menu/owner";
import { useStudio } from "@/lib/menu/studio";
import { buildMenuGrowthAdvisor, type MenuGrowthAdvisor } from "@/lib/menu/growth-advisor";
import type { OwnerAnalytics } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/intelligence-actions")({ component: IntelligenceActionsPage });

type LoadState = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: OwnerAnalytics };

function IntelligenceActionsPage() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    getOwnerAnalytics({ data: { days: 7 } })
      .then((result) => setState(result.ok ? { status: "ready", data: result.data } : { status: "error", message: result.error }))
      .catch((error: unknown) => setState({ status: "error", message: error instanceof Error ? error.message : "تعذر تحميل الإجراءات" }));
  }, []);

  const advisor = useMemo<MenuGrowthAdvisor | null>(() => {
    if (state.status !== "ready") return null;
    return buildMenuGrowthAdvisor(snapshot, state.data);
  }, [snapshot, state]);

  if (state.status === "loading" || !advisor) return <div className="mx-auto max-w-5xl"><LoadingState /></div>;
  if (state.status === "error") return <div className="mx-auto max-w-5xl"><ErrorState message={state.message} /></div>;

  const isAr = lang === "ar";
  const actions = advisor.actions;

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <header className="rounded-3xl border border-line bg-ink p-6 text-paper md:p-8">
        <div className="flex items-center gap-2 text-paper/70"><Sparkles className="size-4" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-[.18em]">{isAr ? "مركز الإجراءات" : "Action center"}</span></div>
        <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{isAr ? "من الإشارة إلى خطوة واضحة" : "From signal to a clear next step"}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-paper/70">{isAr ? "الإجراءات أدناه مشتقة من بيانات القائمة والتحليلات الموثقة. لا يتم تنفيذ أي تغيير تلقائيًا." : "These actions are derived from verified menu and analytics data. Nothing is changed automatically."}</p>
      </header>

      <section className="grid gap-4 rounded-3xl border border-line bg-paper p-6">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{isAr ? "الأولوية الآن" : "Current priorities"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{isAr ? "ما الذي يمكنك تنفيذه؟" : "What can you act on?"}</h2></div><span className="rounded-full bg-sand px-3 py-1 text-xs font-medium">{actions.length} {isAr ? "إجراءات" : "actions"}</span></div>
        {actions.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-sand/20 p-5 text-sm"><CheckCircle2 className="size-5 shrink-0 text-good" /><span>{isAr ? "لا توجد إجراءات موثقة أعلى أولوية الآن." : "There are no higher-priority verified actions right now."}</span></div>
        ) : (
          <div className="grid gap-3">
            {actions.map((action, index) => (
              <article key={action.key} className="grid gap-4 rounded-2xl border border-line bg-sand/20 p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                <span className="grid size-9 place-items-center rounded-full bg-ink text-sm font-semibold text-paper">{index + 1}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{isAr ? action.titleAr : action.titleEn}</h3><span className="rounded-full bg-paper px-2.5 py-1 text-xs text-muted">{action.priority === "high" ? (isAr ? "عالية" : "High") : action.priority === "medium" ? (isAr ? "متوسطة" : "Medium") : (isAr ? "متابعة" : "Monitor")}</span></div>
                  <p className="mt-1 text-sm leading-6 text-muted">{isAr ? action.reasonAr : action.reasonEn}</p>
                  <p className="mt-2 text-xs font-medium text-muted">{isAr ? action.metricAr : action.metricEn}</p>
                </div>
                <Button asChild size="sm"><Link to={action.href}>{isAr ? "فتح الإجراء" : "Open action"}<ArrowUpLeft className="size-4" aria-hidden="true" /></Link></Button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-line bg-sand/10 p-6 text-sm leading-6 text-muted">
        {isAr ? "هذه الصفحة تنظم الإجراءات المقترحة فقط. مصدر الحقيقة هو بيانات Menu V3 الحالية، وصاحب المطعم هو من يراجع ويقرر التنفيذ." : "This page only organizes recommended actions. Menu V3's current data remains the source of truth, and the owner reviews and decides what to execute."}
      </section>
    </div>
  );
}
