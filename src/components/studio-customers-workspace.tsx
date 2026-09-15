import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { HeartHandshake, Megaphone, MessageSquareText, RefreshCw, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, InsightCard, LoadingState, MetricRow, PageHeader, PermissionDeniedState, SectionHeader, StatusBadge } from "@/components/internal-design-system";
import { useLang } from "@/lib/lang";
import { useStudio } from "@/lib/menu/studio";
import { getGuestRelationshipOverview, type GuestRelationshipOverview } from "@/lib/menu/guest-relationships";

type LoadState =
  | { status: "loading" }
  | { status: "error"; code: string; message: string }
  | { status: "ready"; data: GuestRelationshipOverview };

export function StudioCustomersWorkspace() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const isAr = lang === "ar";

  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setState({ status: "loading" });

    const result = await getGuestRelationshipOverview({ data: {} });
    if (result.ok) {
      setState({ status: "ready", data: result.data });
    } else {
      setState({ status: "error", code: result.code, message: result.error });
    }
    setRefreshing(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const number = useMemo(
    () => (value: number) => Number(value).toLocaleString(isAr ? "ar-SA" : "en-US"),
    [isAr],
  );

  const money = useMemo(
    () => (value: number) => `${Number(value).toLocaleString(isAr ? "ar-SA" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${snapshot.tenant.currency || "SAR"}`,
    [isAr, snapshot.tenant.currency],
  );

  if (state.status === "loading") {
    return <div className="mx-auto w-full max-w-6xl"><LoadingState label={isAr ? "جارٍ تحميل بيانات العملاء…" : "Loading customer data…"} /></div>;
  }

  if (state.status === "error" && state.code === "forbidden") {
    return <div className="mx-auto w-full max-w-6xl"><PermissionDeniedState title={isAr ? "بيانات العملاء محمية بالصلاحيات" : "Customer data is permission-protected"} message={state.message} /></div>;
  }

  if (state.status === "error") {
    return <div className="mx-auto w-full max-w-6xl"><ErrorState title={isAr ? "تعذر تحميل مساحة العملاء" : "Customers Workspace could not load"} message={state.message} action={<Button type="button" variant="outline" onClick={() => void load(true)} disabled={refreshing}>{isAr ? "إعادة المحاولة" : "Retry"}</Button>} /></div>;
  }

  const d = state.data;
  const hasGuestData = d.profiles > 0;
  const hasFeedback = d.feedbackCount > 0;
  const hasLoyalty = d.loyaltyMembers > 0 || d.loyaltyPoints > 0;
  const hasCampaignDrafts = d.campaignDrafts > 0;

  const metrics = [
    { label: isAr ? "الضيوف المعروفون" : "Known guests", value: number(d.profiles), detail: isAr ? "ملفات ضيوف مشتقة من الطلبات الفعلية." : "Guest profiles derived from real orders." },
    { label: isAr ? "ضيوف متكررون" : "Repeat guests", value: number(d.repeatGuests), detail: isAr ? "أكثر من طلب واحد ضمن البيانات الحالية." : "More than one recorded order in the current data." },
    { label: isAr ? "نشطون خلال 30 يومًا" : "Active in 30d", value: number(d.activeGuests30d), detail: isAr ? "آخر طلب خلال 30 يومًا." : "Last recorded order within 30 days." },
    { label: isAr ? "منقطعون 60+ يومًا" : "Lapsed 60d+", value: number(d.lapsedGuests60d), detail: isAr ? "آخر طلب أقدم من 60 يومًا." : "Last recorded order is older than 60 days." },
  ];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 pb-8">
      <PageHeader
        eyebrow={isAr ? "مساحة العملاء · R9" : "Customers Workspace · R9"}
        title={isAr ? "العملاء والضيوف" : "Customers & Guests"}
        description={isAr ? "مساحة تشغيلية لفهم الضيوف المعروفين للنظام، إشارات العلاقات المتاحة، وما يمكن استخدامه فعليًا — دون تحويلها إلى CRM وهمي أو تسويق آلي." : "An operational view of known guests, available relationship signals, and supported actions — without inventing CRM or marketing capabilities."}
        actions={<Button type="button" variant="outline" onClick={() => void load(true)} disabled={refreshing} aria-label={isAr ? "تحديث بيانات العملاء" : "Refresh customer data"}><RefreshCw className={refreshing ? "size-4 animate-spin" : "size-4"} />{isAr ? "تحديث" : "Refresh"}</Button>}
      />

      <section aria-labelledby="customers-overview" className="grid gap-3">
        <SectionHeader title={isAr ? "ما البيانات الموجودة؟" : "What customer data exists?"} description={isAr ? "مؤشرات حقيقية من طبقة علاقات الضيوف الحالية، ضمن نطاق المطعم والصلاحيات الحالية." : "Real signals from the existing guest relationship layer, scoped by the current restaurant and permissions."} />
        {hasGuestData ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => <article key={metric.label} className="rounded-lg border border-line bg-paper p-4"><MetricRow label={metric.label} value={metric.value} detail={metric.detail} /></article>)}
          </div>
        ) : (
          <EmptyState
            title={isAr ? "لا توجد بيانات ضيوف حاليًا" : "No guest data currently"}
            body={isAr ? "هذا يعني فقط أنه لا توجد ملفات ضيوف مسجلة في النطاق الحالي. لا يعني ذلك عدم وجود عملاء في المطعم." : "This means there are no guest profiles recorded in the current scope. It does not mean the restaurant has no customers."}
          />
        )}
      </section>

      <section aria-labelledby="customer-signals" className="grid gap-3">
        <SectionHeader title={isAr ? "إشارات تحتاج فهمًا" : "Signals that need interpretation"} description={isAr ? "نعرض ما يسجله المصدر الحالي فقط؛ لا نحول العدد إلى حالة أو توصية غير مدعومة." : "Only recorded source signals are shown; counts are not turned into unsupported status or recommendations."} />
        <div className="grid gap-3 md:grid-cols-2">
          <InsightCard
            title={isAr ? "الملاحظات والتقييمات" : "Feedback & ratings"}
            body={hasFeedback ? (isAr ? `${number(d.feedbackCount)} سجل ملاحظات${d.averageRating == null ? "" : `، ومتوسط التقييم ${d.averageRating.toFixed(1)}/5`}. حالة المراجعة التفصيلية غير متاحة في هذا الملخص.` : `${number(d.feedbackCount)} feedback records${d.averageRating == null ? "" : `, with a ${d.averageRating.toFixed(1)}/5 average`}. Detailed review status is not exposed by this overview.`) : (isAr ? "لا توجد سجلات ملاحظات في النطاق الحالي." : "No feedback records exist in the current scope.")}
            meta={<StatusBadge status={hasFeedback ? "info" : "neutral"}>{hasFeedback ? (isAr ? "بيانات حقيقية" : "Real data") : (isAr ? "لا توجد بيانات" : "No data")}</StatusBadge>}
            tone={hasFeedback ? "info" : "neutral"}
          />
          <InsightCard
            title={isAr ? "الاحتفاظ" : "Retention"}
            body={d.evidence === "verified" ? (isAr ? "حجم بيانات الضيوف الحالي يسمح بقراءة وصفية ضمن النطاق المتاح. لا توجد هنا ادعاءات تنبؤية أو churn score." : "The current guest-data volume supports a descriptive interpretation within scope. No predictive claim or churn score is presented.") : (isAr ? "الأدلة الحالية غير كافية لتفسير قوي للاحتفاظ. لا يتم اختراع معدل احتفاظ أو cohort." : "Current evidence is insufficient for a strong retention interpretation. No retention rate or cohort is invented.")}
            meta={<StatusBadge status={d.evidence === "verified" ? "success" : "warning"}>{d.evidence === "verified" ? (isAr ? "دليل موثوق ضمن النطاق" : "Verified within scope") : (isAr ? "يحتاج مراجعة" : "Needs review")}</StatusBadge>}
            tone={d.evidence === "verified" ? "success" : "warning"}
          />
        </div>
      </section>

      <section aria-labelledby="supported-capabilities" className="grid gap-3">
        <SectionHeader title={isAr ? "ما الذي يدعمه النظام؟" : "What is actually supported?"} description={isAr ? "هذه القدرات موجودة داخل طبقة R9، لكن لا توجد لها مسارات مستقلة في `/studio` حاليًا." : "These R9 capabilities exist in the current relationship layer, but they do not have standalone `/studio` routes today."} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CapabilityCard icon={<HeartHandshake className="size-5" />} title={isAr ? "الولاء" : "Loyalty"} value={hasLoyalty ? `${number(d.loyaltyMembers)} ${isAr ? "عضو" : "members"} · ${number(d.loyaltyPoints)} ${isAr ? "نقطة" : "points"}` : (isAr ? "لا توجد بيانات" : "No data")} />
          <CapabilityCard icon={<Megaphone className="size-5" />} title={isAr ? "الحملات" : "Campaigns"} value={hasCampaignDrafts ? `${number(d.campaignDrafts)} ${isAr ? "مسودة" : "drafts"}` : (isAr ? "لا توجد مسودات" : "No drafts")} />
          <CapabilityCard icon={<MessageSquareText className="size-5" />} title={isAr ? "الملاحظات" : "Feedback"} value={hasFeedback ? `${number(d.feedbackCount)} ${isAr ? "سجل" : "records"}` : (isAr ? "لا توجد بيانات" : "No data")} />
          <CapabilityCard icon={<UsersRound className="size-5" />} title={isAr ? "ملفات الضيوف" : "Guest profiles"} value={hasGuestData ? `${number(d.profiles)} ${isAr ? "ملف" : "profiles"}` : (isAr ? "لا توجد بيانات" : "No data")} />
        </div>
      </section>

      <section aria-labelledby="customer-data-limits" className="grid gap-3 rounded-lg border border-line bg-sand/35 p-4">
        <SectionHeader title={isAr ? "حدود المساحة الحالية" : "Current workspace limits"} />
        <ul className="grid gap-2 text-sm leading-6 text-ink-soft sm:grid-cols-2">
          <li>{isAr ? "بيانات الضيف الفردية والتفاصيل الشخصية: غير معروضة كقائمة/تفاصيل مستقلة في المسار الحالي." : "Individual guest records and personal details are not exposed as a standalone list/detail flow here."}</li>
          <li>{isAr ? "لا توجد شرائح أو cohorts أو قيمة عمرية للعميل أو churn score." : "No segments, cohorts, customer lifetime value, or churn score are presented."}</li>
          <li>{isAr ? "الحملات موجودة كمسودات، ولا يوجد إرسال تلقائي." : "Campaigns are draft records; outbound delivery is not automated."}</li>
          <li>{isAr ? "الولاء والملاحظات موجودان كبيانات محكومة، ولا توجد إجراءات آلية غير مطلوبة." : "Loyalty and feedback are controlled data surfaces; no unsafe automation is added."}</li>
        </ul>
      </section>

      <section className="rounded-lg border border-line bg-paper p-4" aria-label={isAr ? "معلومة قيمة الطلب" : "Observed order value information"}>
        <MetricRow label={isAr ? "متوسط قيمة الطلب المرصودة" : "Observed average order value"} value={money(d.averageOrderValue)} detail={isAr ? "مؤشر فعلي من بيانات ملفات الضيوف؛ لا يمثل قيمة العميل مدى الحياة." : "A real guest-profile signal; it is not customer lifetime value."} />
      </section>

      <p className="text-xs leading-5 text-muted">{isAr ? "بيانات حقيقية · نطاق المطعم والفرع محكوم من الخادم · لا توجد سجلات عملاء وهمية أو نتائج حملات أو تقييمات أو شرائح مولدة." : "Real data · restaurant/branch scope is enforced server-side · no fabricated customer records, campaign results, ratings, or segments."}</p>
    </div>
  );
}

function CapabilityCard({ icon, title, value }: { icon: ReactNode; title: string; value: string }) {
  return <article className="grid gap-3 rounded-lg border border-line bg-paper p-4"><div className="flex items-center gap-2 text-accent" aria-hidden>{icon}<span className="text-sm font-semibold text-ink">{title}</span></div><p className="text-sm leading-6 text-muted">{value}</p><StatusBadge status="neutral">{title}</StatusBadge></article>;
}
