import { useEffect, useMemo, useState } from "react";
import { ArrowUpLeft, Clock3, Eye, MapPin, MessageCircle, ShoppingBag, TrendingUp, UtensilsCrossed } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ActionCard, EmptyState, ErrorState, InsightCard, LoadingState, MetricRow, PageHeader, SectionHeader, StatusBadge } from "@/components/internal-design-system";
import { useLang } from "@/lib/lang";
import { getOwnerAnalytics } from "@/lib/menu/owner";
import { getOrdersDashboard, type AdminOrder, type OrdersDashboard } from "@/lib/menu/orders";
import { buildMenuGrowthAdvisor, type MenuGrowthAdvisor } from "@/lib/menu/growth-advisor";
import { useStudio } from "@/lib/menu/studio";
import { canWriteSettings } from "@/lib/auth/permissions";
import type { OwnerAnalytics } from "@/lib/menu/types";
import { cn } from "@/lib/utils";

const ORDER_STATUS: Record<AdminOrder["status"], { ar: string; en: string; tone: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  new: { ar: "جديد", en: "New", tone: "info" },
  confirmed: { ar: "مؤكد", en: "Confirmed", tone: "info" },
  preparing: { ar: "قيد التحضير", en: "Preparing", tone: "warning" },
  ready: { ar: "جاهز", en: "Ready", tone: "success" },
  completed: { ar: "مكتمل", en: "Completed", tone: "success" },
  cancelled: { ar: "ملغى", en: "Cancelled", tone: "danger" },
};

type LoadState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };

function greeting(lang: "ar" | "en") {
  const hour = new Date().getHours();
  if (lang === "ar") return hour < 12 ? "صباح الخير" : "مساء الخير";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatTime(value: string, lang: "ar" | "en") {
  try {
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-SA", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
  } catch {
    return "—";
  }
}

function formatNumber(value: number, lang: "ar" | "en") {
  return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-SA").format(value);
}

function hrefAllowed(href: string, role: "owner" | "admin" | "editor" | "staff") {
  if (href === "/studio/brand" || href === "/studio/branches") return canWriteSettings(role);
  return href === "/studio/menu" || href === "/studio/intelligence";
}

export function StudioHome() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const { tenant, role, products, categories, branches, health } = snapshot;
  const activeBranches = branches.filter((branch) => branch.isActive);
  const currentBranch = activeBranches[0] ?? branches[0] ?? null;
  const [analytics, setAnalytics] = useState<LoadState<OwnerAnalytics>>({ status: "loading" });
  const [orders, setOrders] = useState<LoadState<OrdersDashboard>>({ status: "loading" });

  useEffect(() => {
    let active = true;
    void getOwnerAnalytics({ data: { days: 7 } })
      .then((result) => {
        if (!active) return;
        setAnalytics(result.ok ? { status: "ready", data: result.data } : { status: "error", message: result.error });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAnalytics({ status: "error", message: error instanceof Error ? error.message : "تعذر تحميل الأداء" });
      });
    void getOrdersDashboard({ data: {} })
      .then((result) => {
        if (!active) return;
        setOrders(result.ok ? { status: "ready", data: result.data } : { status: "error", message: result.error });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setOrders({ status: "error", message: error instanceof Error ? error.message : "تعذر تحميل الطلبات" });
      });
    return () => {
      active = false;
    };
  }, []);

  const advisor = useMemo<MenuGrowthAdvisor | null>(() => {
    if (analytics.status !== "ready") return null;
    return buildMenuGrowthAdvisor(snapshot, analytics.data);
  }, [analytics, snapshot]);

  const attention = health.attention.filter((item) => hrefAllowed(item.href, role)).slice(0, 4);
  const advisorAction = advisor?.actions.find((action) => hrefAllowed(action.href, role)) ?? null;
  const primaryAction = attention[0] ?? advisorAction;
  const primaryHref = primaryAction?.href ?? "/studio/growth";
  const primaryTitle = primaryAction
    ? (lang === "ar" ? primaryAction.titleAr : primaryAction.titleEn)
    : lang === "ar" ? "راجع فرص النمو" : "Review growth opportunities";

  const availableProducts = products.filter((product) => product.isAvailable).length;
  const activeCategories = categories.filter((category) => category.isActive).length;
  const healthStatus = health.score >= 85 ? "success" : health.score >= 65 ? "warning" : "danger";

  return (
    <div className="mx-auto grid max-w-[1280px] gap-6">
      <PageHeader
        eyebrow={currentBranch ? (lang === "ar" ? `الفرع الحالي · ${currentBranch.nameAr || currentBranch.nameEn}` : `Current branch · ${currentBranch.nameEn || currentBranch.nameAr}`) : lang === "ar" ? "مساحة التشغيل" : "Operational workspace"}
        title={`${greeting(lang)}، ${lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr}`}
        description={lang === "ar" ? "هذه الصفحة تلخص ما يحدث الآن، وما يحتاج انتباهك، والخطوة العملية التالية." : "A concise operational view of what is happening, what needs attention, and what to do next."}
        actions={<div className="flex flex-wrap gap-2">{tenant.isPublished ? <StatusBadge status="success">{lang === "ar" ? "منشور" : "Published"}</StatusBadge> : <StatusBadge status="warning">{lang === "ar" ? "غير منشور" : "Unpublished"}</StatusBadge>}{currentBranch ? <StatusBadge status="neutral"><MapPin className="me-1 size-3.5" aria-hidden />{lang === "ar" ? currentBranch.nameAr || currentBranch.nameEn : currentBranch.nameEn || currentBranch.nameAr}</StatusBadge> : null}</div>}
      />

      <section aria-labelledby="home-attention-title" className="grid gap-3">
        <SectionHeader title={<span id="home-attention-title">{lang === "ar" ? "يحتاج انتباهك" : "Needs your attention"}</span>} description={lang === "ar" ? "مشكلات قابلة للتنفيذ مستخرجة من حالة المنيو الحالية." : "Actionable issues derived from the current menu state."} />
        {attention.length > 0 ? <div className="grid gap-3 md:grid-cols-2">{attention.map((item) => <InsightCard key={item.key} tone={item.severity === "high" ? "danger" : item.severity === "medium" ? "warning" : "info"} title={lang === "ar" ? item.titleAr : item.titleEn} body={lang === "ar" ? "راجع الحالة من المصدر الحالي قبل مشاركة القائمة أو توجيه الضيوف إليها." : "Review the current source state before sharing the menu or directing guests to it."} action={<Link to={item.href as never} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{lang === "ar" ? "مراجعة" : "Review"}<ArrowUpLeft className="size-4" aria-hidden /></Link>} />)}</div> : <EmptyState title={lang === "ar" ? "لا توجد نقاط تحتاج انتباهًا الآن" : "Nothing needs attention right now"} body={lang === "ar" ? "لا توجد مشكلة قابلة للتنفيذ في إشارات صحة المنيو الحالية." : "No actionable issue is currently reported by the menu health signals."} />}
      </section>

      <section aria-labelledby="home-performance-title" className="grid gap-3">
        <SectionHeader title={<span id="home-performance-title">{lang === "ar" ? "الأداء الحالي" : "Current performance"}</span>} description={lang === "ar" ? "آخر ٧ أيام — أحداث مسجلة فعليًا فقط." : "Last 7 days — recorded events only."} />
        {analytics.status === "loading" ? <LoadingState label={lang === "ar" ? "جاري تحميل مؤشرات الأداء…" : "Loading performance signals…"} /> : analytics.status === "error" ? <ErrorState title={lang === "ar" ? "تعذر تحميل الأداء" : "Performance unavailable"} message={analytics.message} /> : <div className="grid gap-3 rounded-xl border border-line bg-paper p-4 sm:grid-cols-2 lg:grid-cols-4"><MetricRow label={lang === "ar" ? "الزيارات" : "Visits"} value={formatNumber(analytics.data.visits, lang)} detail={lang === "ar" ? "آخر ٧ أيام" : "Last 7 days"} /><MetricRow label={lang === "ar" ? "مشاهدات الأصناف" : "Product views"} value={formatNumber(analytics.data.productViews, lang)} detail={lang === "ar" ? "أحداث مسجلة" : "Recorded events"} /><MetricRow label={lang === "ar" ? "الجلسات" : "Sessions"} value={formatNumber(analytics.data.uniqueSessions, lang)} detail={lang === "ar" ? "جلسات فريدة مسجلة" : "Recorded unique sessions"} /><MetricRow label={lang === "ar" ? "نقرات واتساب" : "WhatsApp clicks"} value={formatNumber(analytics.data.whatsappClicks, lang)} detail={lang === "ar" ? "إشارة تواصل فقط" : "Contact signal only"} /></div>}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <section aria-labelledby="home-activity-title" className="grid gap-3">
          <SectionHeader title={<span id="home-activity-title">{lang === "ar" ? "آخر النشاط التشغيلي" : "Recent operational activity"}</span>} description={lang === "ar" ? "آخر الطلبات الموجودة في المصدر التشغيلي." : "Latest orders from the operational source."} action={<Link to="/studio/orders" className="text-sm font-medium text-ink hover:underline">{lang === "ar" ? "فتح الطلبات" : "Open orders"}</Link>} />
          {orders.status === "loading" ? <LoadingState label={lang === "ar" ? "جاري تحميل الطلبات…" : "Loading orders…"} /> : orders.status === "error" ? <ErrorState title={lang === "ar" ? "تعذر تحميل النشاط" : "Activity unavailable"} message={orders.message} /> : orders.data.orders.length === 0 ? <EmptyState title={lang === "ar" ? "لا توجد طلبات مسجلة" : "No recorded orders"} body={lang === "ar" ? "لا توجد بيانات تشغيلية يمكن عرضها هنا حاليًا." : "There is no operational activity to show here yet."} /> : <div className="overflow-hidden rounded-xl border border-line bg-paper">{orders.data.orders.slice(0, 5).map((order) => { const status = ORDER_STATUS[order.status]; return <div key={order.id} className="flex min-w-0 items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0"><div className="min-w-0"><div className="flex items-center gap-2"><ShoppingBag className="size-4 shrink-0 text-muted" aria-hidden /><p className="truncate text-sm font-semibold">#{order.orderNumber}</p><StatusBadge status={status.tone}>{lang === "ar" ? status.ar : status.en}</StatusBadge></div><p className="mt-1 truncate text-xs text-muted">{order.customerName || (lang === "ar" ? "عميل" : "Customer")} · {order.branchName || (lang === "ar" ? "كل الفروع" : "All branches")}</p></div><div className="shrink-0 text-end"><p className="tabular text-sm font-semibold">{new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(order.total)} {order.currency}</p><p className="mt-1 inline-flex items-center gap-1 text-xs text-muted"><Clock3 className="size-3" aria-hidden />{formatTime(order.createdAt, lang)}</p></div></div>; })}</div>}
        </section>

        <section aria-labelledby="home-health-title" className="grid gap-3">
          <SectionHeader title={<span id="home-health-title">{lang === "ar" ? "صحة المنيو" : "Menu health"}</span>} description={lang === "ar" ? "حالة حقيقية من نموذج صحة المنيو الحالي." : "Current state from the existing menu health model."} />
          <div className="grid gap-3 rounded-xl border border-line bg-paper p-4"><div className="flex items-end justify-between gap-3"><div><p className="text-sm font-medium">{lang === "ar" ? "الدرجة الحالية" : "Current score"}</p><p className="mt-1 text-xs text-muted">{health.checks.filter((check) => check.ok).length} / {health.checks.length} {lang === "ar" ? "فحوصات ناجحة" : "checks passing"}</p></div><div className="flex items-baseline gap-1"><span className="tabular text-3xl font-semibold">{formatNumber(health.score, lang)}</span><span className="text-sm text-muted">/100</span></div></div><div className="h-2 overflow-hidden rounded-full bg-sand" role="progressbar" aria-label={`${health.score}/100`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={health.score}><div className={cn("h-full rounded-full", healthStatus === "success" ? "bg-good" : healthStatus === "warning" ? "bg-warn" : "bg-bad")} style={{ width: `${Math.max(0, Math.min(100, health.score))}%` }} /></div><div className="grid gap-0 rounded-lg border border-line px-3"><MetricRow label={lang === "ar" ? "الأصناف المتاحة" : "Available items"} value={`${formatNumber(availableProducts, lang)} / ${formatNumber(products.length, lang)}`} /><MetricRow label={lang === "ar" ? "التصنيفات النشطة" : "Active categories"} value={formatNumber(activeCategories, lang)} /><MetricRow label={lang === "ar" ? "الفروع النشطة" : "Active branches"} value={formatNumber(activeBranches.length, lang)} /></div></div>
        </section>
      </div>

      <section aria-labelledby="home-growth-title" className="grid gap-3">
        <SectionHeader title={<span id="home-growth-title">{lang === "ar" ? "فرصة النمو" : "Growth opportunity"}</span>} description={lang === "ar" ? "إشارة مبنية على البيانات الحالية، وليست توصية مولدة من فراغ." : "An evidence-bound signal from the current data, not a fabricated recommendation."} />
        {advisor?.actions.length || advisor?.insights.length ? (() => { const action = advisor.actions.find((item) => hrefAllowed(item.href, role)); const insight = advisor.insights[0]; if (action) return <ActionCard title={lang === "ar" ? action.titleAr : action.titleEn} body={lang === "ar" ? `${action.reasonAr} · ${action.metricAr}` : `${action.reasonEn} · ${action.metricEn}`} action={<Link to={action.href} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{lang === "ar" ? "ابدأ الآن" : "Start now"}<ArrowUpLeft className="size-4" aria-hidden /></Link>} />; if (!insight) return null; return <InsightCard tone="info" title={lang === "ar" ? insight.titleAr : insight.titleEn} body={lang === "ar" ? insight.evidenceAr : insight.evidenceEn} meta={lang === "ar" ? insight.interpretationAr : insight.interpretationEn} action={<Link to="/studio/growth" className="text-sm font-medium text-ink hover:underline">{lang === "ar" ? "فتح النمو" : "Open Growth"}</Link>} />; })() : <ActionCard title={lang === "ar" ? "لا توجد إشارة نمو كافية بعد" : "No growth signal yet"} body={lang === "ar" ? "اجمع بيانات فعلية من القائمة ثم استخدم مساحة النمو لمتابعتها." : "Collect observed menu activity, then use Growth to monitor it."} action={<Link to="/studio/growth" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-4 text-sm font-medium text-ink hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{lang === "ar" ? "فتح النمو" : "Open Growth"}<TrendingUp className="size-4" aria-hidden /></Link>} />}
      </section>

      <section aria-label={lang === "ar" ? "الإجراء التالي" : "Next action"}><ActionCard title={primaryTitle} body={attention[0] ? (lang === "ar" ? "هذا هو الإجراء الأول في قائمة الحالات الحالية." : "This is the first actionable item from the current state.") : (lang === "ar" ? "إجراء محايد عندما لا توجد مشكلة عاجلة." : "A neutral next step when no urgent issue is reported.")} action={<Link to={primaryHref as never} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-5 text-sm font-medium text-paper hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{lang === "ar" ? "المتابعة" : "Continue"}<ArrowUpLeft className="size-4" aria-hidden /></Link>} /></section>

      <div className="grid gap-3 rounded-xl border border-line bg-sand/20 p-4 text-sm text-muted sm:grid-cols-3"><div className="flex items-center gap-2"><UtensilsCrossed className="size-4 shrink-0" aria-hidden />{formatNumber(products.length, lang)} {lang === "ar" ? "صنف" : "items"}</div><div className="flex items-center gap-2"><Eye className="size-4 shrink-0" aria-hidden />{analytics.status === "ready" ? formatNumber(analytics.data.productViews, lang) : "—"} {lang === "ar" ? "مشاهدة صنف" : "product views"}</div><div className="flex items-center gap-2"><MessageCircle className="size-4 shrink-0" aria-hidden />{analytics.status === "ready" ? formatNumber(analytics.data.whatsappClicks, lang) : "—"} {lang === "ar" ? "نقرة واتساب" : "WhatsApp clicks"}</div></div>
    </div>
  );
}
