import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { buildGrowthMetrics } from "@/lib/menu/growth";
import { getMyStudio, getOwnerAnalytics } from "@/lib/menu/owner";
import type { OwnerAnalytics, StudioSnapshot } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const { lang } = useLang();
  const [days, setDays] = useState<7 | 30>(7);
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ok"; data: OwnerAnalytics; studio: StudioSnapshot }
  >({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    Promise.all([getOwnerAnalytics({ data: { days } }), getMyStudio()])
      .then(([analyticsResult, studioResult]) => {
        if (!analyticsResult.ok) {
          setState({ status: "error", message: analyticsResult.error });
          return;
        }
        if (!studioResult.ok || !studioResult.data || !("tenant" in studioResult.data) || !studioResult.data.tenant) {
          setState({ status: "error", message: "تعذر تحميل بيانات المطعم" });
          return;
        }
        setState({ status: "ok", data: analyticsResult.data, studio: studioResult.data });
      })
      .catch((err: unknown) => setState({ status: "error", message: err instanceof Error ? err.message : t(copy.state.error, lang) }));
  }, [days, lang]);

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t(copy.analytics.title, lang)}</h1>
          <p className="mt-1 text-sm text-muted">{lang === "ar" ? "من أرقام المنيو إلى قرارات نمو قابلة للتنفيذ." : "Turn menu signals into actionable growth decisions."}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant={days === 7 ? "solid" : "outline"} onClick={() => setDays(7)}>{t(copy.analytics.days7, lang)}</Button>
          <Button type="button" size="sm" variant={days === 30 ? "solid" : "outline"} onClick={() => setDays(30)}>{t(copy.analytics.days30, lang)}</Button>
        </div>
      </div>
      {state.status === "loading" ? <LoadingState /> : null}
      {state.status === "error" ? <ErrorState message={state.message} /> : null}
      {state.status === "ok" ? <AnalyticsContent analytics={state.data} studio={state.studio} lang={lang} /> : null}
    </div>
  );
}

function AnalyticsContent({ analytics, studio, lang }: { analytics: OwnerAnalytics; studio: StudioSnapshot; lang: "ar" | "en" }) {
  const hasData = analytics.visits > 0 || analytics.productViews > 0 || analytics.qrScans > 0;
  return (
    <>
      {!hasData ? (
        <>
          <p className="rounded-xl border border-line px-4 py-10 text-center text-sm text-muted">{t(copy.state.noDataYet, lang)}</p>
          <VisibilityReadiness studio={studio} analytics={analytics} lang={lang} />
        </>
      ) : null}
      {hasData ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={t(copy.analytics.visits, lang)} value={analytics.visits} />
            <Stat label={t(copy.analytics.sessions, lang)} value={analytics.uniqueSessions} />
            <Stat label={t(copy.analytics.views, lang)} value={analytics.productViews} />
            <Stat label={t(copy.analytics.qr, lang)} value={analytics.qrScans} />
          </section>
          <GrowthFunnel analytics={analytics} lang={lang} />
          <GrowthStory analytics={analytics} lang={lang} />
          <VisibilityReadiness studio={studio} analytics={analytics} lang={lang} />
          <ExperimentationBoard analytics={analytics} lang={lang} />
          <section className="grid gap-3 rounded-xl border border-line p-5 sm:grid-cols-2">
            <Stat label={t(copy.analytics.wa, lang)} value={analytics.whatsappClicks} />
            <div><p className="text-xs text-muted">{t(copy.analytics.language, lang)}</p><p className="mt-1 text-sm">عربي {analytics.langAr} · EN {analytics.langEn}</p></div>
          </section>
          {analytics.series.length ? <section className="rounded-xl border border-line p-5"><h2 className="mb-3 font-medium">{t(copy.analytics.visits, lang)}</h2><SimpleBars points={analytics.series.map((p) => ({ label: p.day.slice(5), value: p.visits + p.views }))} /></section> : null}
          <Rank title={t(copy.analytics.topItems, lang)} rows={analytics.topProducts} lang={lang} />
          <Rank title={t(copy.analytics.byCategory, lang)} rows={analytics.byCategory} lang={lang} />
        </>
      ) : null}
    </>
  );
}

function GrowthFunnel({ analytics, lang }: { analytics: OwnerAnalytics; lang: "ar" | "en" }) {
  const metrics = buildGrowthMetrics(analytics);
  const opportunity = {
    ar: {
      baseline: "اجمع أولاً عينة كافية قبل الحكم على الأداء.",
      discovery: "الفرصة الحالية في الاكتشاف: حسّن الوصول إلى المنيو ووضوح نقاط الدخول.",
      conversion: "الفرصة الحالية في التحويل: اجعل الإجراء المباشر مثل واتساب أو الطلب أوضح.",
      content: "الفرصة الحالية في المحتوى: حسّن اكتمال الأصناف والتصنيفات قبل اختبار الرسائل.",
      distribution: "الفرصة الحالية في التوزيع: ركّز على QR والمشاركة المحلية بعد وجود تفاعل أساسي.",
    },
    en: {
      baseline: "Build a baseline before judging performance.",
      discovery: "Current opportunity: improve menu discovery and entry points.",
      conversion: "Current opportunity: make high-intent actions such as WhatsApp or ordering clearer.",
      content: "Current opportunity: improve product/category completeness before testing messaging.",
      distribution: "Current opportunity: scale QR and local distribution after core engagement exists.",
    },
  }[lang];

  return (
    <section className="grid gap-4 rounded-2xl border border-line bg-sand/20 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "مسار النمو" : "Growth loop"}</p>
        <h2 className="mt-1 font-display text-xl font-semibold">{lang === "ar" ? "من الزيارة إلى الإجراء" : "From visit to action"}</h2>
        <p className="mt-1 text-sm text-muted">{opportunity[metrics.primaryOpportunity]}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RatioCard label={lang === "ar" ? "مشاهدات لكل 100 زيارة" : "Product views / 100 visits"} metric={metrics.productInterest} />
        <RatioCard label={lang === "ar" ? "نقرات واتساب لكل 100 جلسة" : "WhatsApp clicks / 100 sessions"} metric={metrics.whatsappIntent} />
        <RatioCard label={lang === "ar" ? "الزيارات لكل 100 مسح QR" : "Visits / 100 QR scans"} metric={metrics.qrVisitRatio} />
        <RatioCard label={lang === "ar" ? "متوسط المشاهدات لكل جلسة" : "Views / session"} metric={{ numerator: analytics.productViews, denominator: analytics.uniqueSessions, per100: metrics.averageViewsPerSession }} suffix={lang === "ar" ? " مشاهدة" : " views"} />
      </div>
      <p className="text-xs leading-5 text-muted">{lang === "ar" ? "هذه نسب تشغيلية من إجمالي الأحداث، وليست نسب تحويل لمستخدمين فريدين؛ لأن مخطط الأحداث الحالي لا يملك عدد الجلسات الفريدة لكل نوع حدث." : "These are operational event ratios, not unique-user conversion rates; the current event model does not expose unique-session counts for every event type."}</p>
      {metrics.leadingProduct ? <p className="text-sm text-muted">{lang === "ar" ? "الأكثر مشاهدة" : "Top product"}: <strong className="text-ink">{lang === "ar" ? metrics.leadingProduct.nameAr : metrics.leadingProduct.nameEn || metrics.leadingProduct.nameAr}</strong></p> : null}
    </section>
  );
}

function GrowthStory({ analytics, lang }: { analytics: OwnerAnalytics; lang: "ar" | "en" }) {
  const metrics = buildGrowthMetrics(analytics);
  const cards = [
    {
      title: lang === "ar" ? "عمق التصفح" : "Browse depth",
      value: analytics.uniqueSessions > 0 ? `${metrics.averageViewsPerSession.toFixed(1)}×` : "—",
      body: lang === "ar" ? "متوسط مشاهدات المنتجات لكل جلسة. استخدمه لقياس قوة اكتشاف المنيو." : "Average product views per session. Use it as a menu-discovery signal.",
    },
    {
      title: lang === "ar" ? "أقوى نقطة جذب" : "Leading product",
      value: metrics.leadingProduct ? (lang === "ar" ? metrics.leadingProduct.nameAr : metrics.leadingProduct.nameEn || metrics.leadingProduct.nameAr) : "—",
      body: lang === "ar" ? "الصنف الأعلى مشاهدة في الفترة المحددة." : "Highest-viewed product in the selected period.",
    },
    {
      title: lang === "ar" ? "أقوى تصنيف" : "Leading category",
      value: metrics.leadingCategory ? (lang === "ar" ? metrics.leadingCategory.nameAr : metrics.leadingCategory.nameEn || metrics.leadingCategory.nameAr) : "—",
      body: lang === "ar" ? "التصنيف الأعلى نشاطاً وفق الأحداث المسجلة." : "Most active category from recorded events.",
    },
  ];
  return (
    <section className="grid gap-4 rounded-2xl border border-line p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "قصة البيانات" : "Data story"}</p>
        <h2 className="mt-1 font-display text-xl font-semibold">{lang === "ar" ? "ماذا تقول الأرقام الآن؟" : "What the data says now"}</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rounded-xl bg-sand/30 p-4">
            <p className="text-xs text-muted">{card.title}</p>
            <p className="mt-2 truncate font-display text-lg font-semibold" title={card.value}>{card.value}</p>
            <p className="mt-2 text-xs leading-5 text-muted">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function VisibilityReadiness({ studio, analytics, lang }: { studio: StudioSnapshot; analytics: OwnerAnalytics; lang: "ar" | "en" }) {
  const tenant = studio.tenant;
  const branch = studio.branches.find((item) => item.isActive) ?? studio.branches[0];
  const checks = [
    { label: lang === "ar" ? "اسم المطعم" : "Restaurant name", ok: Boolean(tenant.nameAr.trim() || tenant.nameEn.trim()) },
    { label: lang === "ar" ? "المدينة" : "City", ok: Boolean(tenant.city.trim()) },
    { label: lang === "ar" ? "عنوان الفرع" : "Branch address", ok: Boolean(branch?.addressAr?.trim() || branch?.addressEn?.trim()) },
    { label: lang === "ar" ? "رقم الهاتف" : "Phone", ok: Boolean(branch?.phone?.trim()) },
    { label: lang === "ar" ? "رابط الخرائط" : "Maps link", ok: Boolean(branch?.mapsUrl?.trim()) },
    { label: lang === "ar" ? "واتساب" : "WhatsApp", ok: Boolean(tenant.whatsapp.trim()) },
    { label: lang === "ar" ? "إنستغرام" : "Instagram", ok: Boolean(tenant.instagramUrl.trim()) },
    { label: lang === "ar" ? "صور الهوية" : "Brand imagery", ok: Boolean(tenant.logoUrl.trim() || tenant.coverUrl.trim()) },
  ];
  const score = Math.round((checks.filter((check) => check.ok).length / checks.length) * 100);
  const missing = checks.filter((check) => !check.ok).map((check) => check.label);

  return (
    <section className="grid gap-4 rounded-2xl border border-line p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "الظهور المحلي" : "Local visibility"}</p>
          <h2 className="mt-1 font-display text-xl font-semibold">{lang === "ar" ? "جاهزية حضور المطعم" : "Restaurant presence readiness"}</h2>
          <p className="mt-1 text-sm text-muted">{lang === "ar" ? "فحص قائم على البيانات الموجودة فعلياً في حساب المطعم، وليس على افتراضات خارجية." : "A readiness check based only on verified restaurant data already in the account."}</p>
        </div>
        <div className="rounded-full border border-line px-4 py-2 text-sm font-semibold tabular">{score}%</div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {checks.map((check) => <div key={check.label} className="rounded-lg border border-line px-3 py-2 text-sm"><span aria-hidden="true" className="me-2">{check.ok ? "✓" : "○"}</span>{check.label}</div>)}
      </div>
      <div className="rounded-xl bg-sand/30 p-4 text-sm">
        {missing.length ? (
          <p>{lang === "ar" ? `أولوية التحسين: ${missing.join("، ")}.` : `Priority gaps: ${missing.join(", ")}.`}</p>
        ) : (
          <p>{lang === "ar" ? "البيانات الأساسية للحضور المحلي مكتملة وفق الحقول الحالية." : "Core local-presence fields are complete according to the current data model."}</p>
        )}
        <p className="mt-2 text-xs text-muted">{lang === "ar" ? `هذه الطبقة لا تدّعي ترتيب Google أو نتائج بحث فعلية. الزيارات المسجلة حالياً: ${analytics.visits}.` : `This does not claim Google ranking or live search performance. Recorded visits: ${analytics.visits}.`}</p>
      </div>
    </section>
  );
}

function ExperimentationBoard({ analytics, lang }: { analytics: OwnerAnalytics; lang: "ar" | "en" }) {
  const metrics = buildGrowthMetrics(analytics);
  const experiments = {
    discovery: {
      ar: "اختبر ترتيب التصنيفات أو إبراز الأصناف الأعلى اهتماماً لزيادة عمق التصفح.",
      en: "Test category ordering or stronger presentation of high-interest products to increase browse depth.",
    },
    conversion: {
      ar: "اختبر وضوح الإجراء المباشر في المناطق التي يصل إليها المستخدم بعد مشاهدة المنتج.",
      en: "Test clearer high-intent actions after a guest views a product.",
    },
    content: {
      ar: "اختبر اكتمال الوصف والصور في الأصناف الأعلى ظهوراً قبل تغيير الرسائل.",
      en: "Test richer descriptions and imagery on high-visibility products before changing messaging.",
    },
    distribution: {
      ar: "اختبر مصدر توزيع واحد في كل مرة، مثل QR أو رابط المشاركة، مع الحفاظ على نفس الفترة القياسية.",
      en: "Test one distribution source at a time, such as QR or shared links, using the same measurement window.",
    },
    baseline: {
      ar: "أنشئ خط أساس أولاً؛ لا تبدأ تجربة قبل توفر حجم أحداث كافٍ للمقارنة.",
      en: "Establish a baseline first; do not run an experiment until enough events exist for comparison.",
    },
  }[metrics.primaryOpportunity];

  return (
    <section className="grid gap-4 rounded-2xl border border-line p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "التجارب" : "Experimentation"}</p>
        <h2 className="mt-1 font-display text-xl font-semibold">{lang === "ar" ? "اقتراح تجربة واحدة في كل مرة" : "One experiment at a time"}</h2>
        <p className="mt-1 text-sm text-muted">{lang === "ar" ? "الإطار يحدد فرضية ومؤشراً من الأحداث الموجودة؛ لا يختلق نتائج أو دلالة إحصائية." : "The framework defines a hypothesis and metric from existing events; it does not invent results or statistical significance."}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-line p-4"><p className="text-xs text-muted">{lang === "ar" ? "الفرضية" : "Hypothesis"}</p><p className="mt-2 text-sm leading-6">{experiments[lang]}</p></article>
        <article className="rounded-xl border border-line p-4"><p className="text-xs text-muted">{lang === "ar" ? "المؤشر الأساسي" : "Primary metric"}</p><p className="mt-2 font-medium">{metrics.primaryOpportunity === "conversion" ? (lang === "ar" ? "نقرات واتساب / جلسات" : "WhatsApp clicks / sessions") : (lang === "ar" ? "مشاهدات المنتجات / الزيارات" : "Product views / visits")}</p></article>
        <article className="rounded-xl border border-line p-4"><p className="text-xs text-muted">{lang === "ar" ? "قاعدة القرار" : "Decision rule"}</p><p className="mt-2 text-sm leading-6">{lang === "ar" ? "سجّل الفرضية والفترة والنتيجة قبل الانتقال للتجربة التالية." : "Record the hypothesis, window, and outcome before moving to the next experiment."}</p></article>
      </div>
    </section>
  );
}

function RatioCard({ label, metric, suffix = "%" }: { label: string; metric: { numerator: number; denominator: number; per100: number }; suffix?: string }) {
  return <div className="rounded-xl border border-line bg-paper p-4"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-display text-2xl tabular">{metric.denominator > 0 ? `${metric.per100.toFixed(1)}${suffix}` : "—"}</p><p className="mt-1 text-xs text-muted tabular">{metric.numerator} / {metric.denominator}</p></div>;
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-line p-4"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-display text-2xl tabular">{value}</p></div>; }

function Rank({ title, rows, lang }: { title: string; rows: Array<{ id: string; nameAr: string; nameEn: string; count: number }>; lang: "ar" | "en" }) {
  if (!rows.length) return null;
  const max = Math.max(...rows.map((r) => r.count), 1);
  return <section className="grid gap-3 rounded-xl border border-line p-5"><h2 className="font-medium">{title}</h2><ul className="grid gap-2">{rows.map((r) => <li key={r.id} className="grid gap-1"><div className="flex justify-between text-sm"><span>{lang === "ar" ? r.nameAr : r.nameEn || r.nameAr}</span><span className="tabular text-muted">{r.count}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-sand"><div className="h-full bg-accent" style={{ width: `${(r.count / max) * 100}%` }} /></div></li>)}</ul></section>;
}

function SimpleBars({ points }: { points: Array<{ label: string; value: number }> }) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return <div className="flex h-32 items-end gap-1">{points.map((p) => <div key={p.label} className="grid min-w-0 flex-1 justify-items-center gap-1"><div className="w-full rounded-t-sm bg-accent" style={{ height: `${(p.value / max) * 100}%` }} /><span className="text-xs text-muted">{p.label}</span></div>)}</div>;
}
