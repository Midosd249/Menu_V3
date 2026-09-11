import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowUpLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { buildSaudiMenuReadiness } from "@/lib/menu/saudi-readiness";
import { useStudio } from "@/lib/menu/studio";

export const Route = createFileRoute("/studio/saudi-readiness")({ component: SaudiReadinessPage });

function SaudiReadinessPage() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const readiness = buildSaudiMenuReadiness(snapshot);
  const ar = lang === "ar";

  return <div className="mx-auto grid max-w-5xl gap-5">
    <section className="overflow-hidden rounded-3xl border border-line bg-ink p-6 text-paper md:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="flex items-center gap-2 text-paper/70"><ShieldCheck className="size-4" /><span className="text-xs font-semibold uppercase tracking-[.18em]">{ar ? "جاهزية القائمة السعودية" : "Saudi Menu Readiness"}</span></div>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold md:text-4xl">{ar ? "اجعل معلومات قائمتك أوضح وأقرب للمتطلبات المحلية." : "Make your menu information clearer and closer to local requirements."}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-paper/70">{ar ? "فحص معلوماتي مبني على الحقول الموجودة فعليًا في Menu V3. هذه الأداة لا تمنح شهادة امتثال قانوني ولا تفترض بيانات غير مسجلة." : "An informational check based on fields that actually exist in Menu V3. It is not a legal compliance certification and never assumes unrecorded data."}</p>
        </div>
        <div className="grid size-28 place-items-center rounded-full border border-paper/20 bg-paper/10"><div className="text-center"><div className="font-display text-4xl font-semibold tabular">{readiness.score}</div><div className="text-xs text-paper/60">/ 100</div></div></div>
      </div>
    </section>

    <section className="grid gap-4 rounded-3xl border border-line bg-paper p-6">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{ar ? "الحالة" : "Status"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{ar ? readiness.summaryAr : readiness.summaryEn}</h2></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Metric label={ar ? "الأصناف" : "Products"} value={readiness.counts.products} />
        <Metric label={ar ? "السعرات" : "Calories"} value={`${readiness.counts.caloriesReady}/${readiness.counts.products}`} />
        <Metric label={ar ? "الحساسية" : "Allergens"} value={`${readiness.counts.allergensDeclared}/${readiness.counts.products}`} />
        <Metric label={ar ? "العربي" : "Arabic"} value={`${readiness.counts.arabicReady}/${readiness.counts.products}`} />
        <Metric label={ar ? "الإنجليزي" : "English"} value={`${readiness.counts.englishReady}/${readiness.counts.products}`} />
      </div>
    </section>

    <section className="grid gap-4 rounded-3xl border border-line bg-sand/20 p-6">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{ar ? "مراجعة منظمة" : "Structured review"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{ar ? "ما الذي يحتاج انتباهك؟" : "What needs attention?"}</h2></div>
      <div className="grid gap-3">{readiness.issues.map((issue) => <article key={issue.key} className="grid gap-4 rounded-2xl border border-line bg-paper p-4 md:grid-cols-[auto_1fr_auto] md:items-center"><span className={`inline-flex h-8 w-fit items-center gap-1 rounded-full px-2.5 text-xs font-medium ${issue.severity === "high" ? "bg-warn/15 text-warn" : issue.severity === "medium" ? "bg-accent/10 text-accent" : "bg-sand text-muted"}`}><AlertTriangle className="size-3.5" />{issue.status === "not_supported" ? (ar ? "غير ممثل بعد" : "Not modeled") : issue.severity === "high" ? (ar ? "عالية" : "High") : issue.severity === "medium" ? (ar ? "متوسطة" : "Medium") : (ar ? "معلومة" : "Info")}</span><div><h3 className="font-medium">{ar ? issue.titleAr : issue.titleEn}</h3><p className="mt-1 text-sm leading-6 text-muted">{ar ? issue.detailAr : issue.detailEn}</p></div>{issue.status === "not_supported" ? <span className="text-xs text-muted">{ar ? "نحتاج حقولًا مخصصة قبل التقييم" : "Dedicated fields are needed before evaluation"}</span> : <Button asChild size="sm"><Link to={issue.href}>{ar ? "مراجعة" : "Review"}<ArrowUpLeft className="size-4" /></Link></Button>}</article>)}</div>
    </section>

    <section className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-5 text-sm leading-6"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-good" /><p>{ar ? "مرجع التقييم: متطلبات منشورة من الهيئة العامة للغذاء والدواء. استخدم هذه الصفحة كأداة جاهزية داخلية، وليس كبديل عن مراجعة اللوائح أو التحقق من المنشأة." : "Reference basis: requirements published by the Saudi Food and Drug Authority. Use this as an internal readiness tool, not as a substitute for reviewing the regulations or obtaining professional confirmation."}</p></section>

    <div className="flex justify-center"><Button asChild variant="outline"><Link to="/studio/intelligence">{ar ? "العودة إلى ذكاء القائمة" : "Back to Menu Intelligence"}</Link></Button></div>
  </div>;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-line bg-sand/30 p-4"><p className="text-xs text-muted">{label}</p><p className="mt-2 font-display text-xl tabular">{value}</p></div>;
}
