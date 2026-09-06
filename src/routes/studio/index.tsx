import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowUpLeft, BellRing, Palette, ShoppingBag } from "lucide-react";
import { ErrorState } from "@/components/state-panel";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { getOwnerAnalytics } from "@/lib/menu/owner";
import { getOrdersDashboard, type OrdersDashboard } from "@/lib/menu/orders";
import { getMySubscription, type CommercialSnapshot } from "@/lib/menu/commercial";
import { useStudio } from "@/lib/menu/studio";
import type { OwnerAnalytics } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/")({ component: Overview });

function Overview() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const { tenant, products, categories, branches, health } = snapshot;
  const activeBranches = branches.filter((branch) => branch.isActive).length;
  const [analytics, setAnalytics] = useState<{ status: "loading" } | { status: "error"; message: string } | { status: "ok"; data: OwnerAnalytics }>({ status: "loading" });
  const [orders, setOrders] = useState<OrdersDashboard>({ total: 0, newCount: 0, activeCount: 0, completedCount: 0, cancelledCount: 0, orders: [] });
  const [subscription, setSubscription] = useState<{ status: "loading" } | { status: "ready"; data: CommercialSnapshot | null }>({ status: "loading" });

  useEffect(() => {
    getOwnerAnalytics({ data: { days: 7 } }).then((result) => result.ok ? setAnalytics({ status: "ok", data: result.data }) : setAnalytics({ status: "error", message: result.error })).catch((err: unknown) => setAnalytics({ status: "error", message: err instanceof Error ? err.message : "تعذر التحميل" }));
    getOrdersDashboard({ data: {} }).then((result) => { if (result.ok) setOrders(result.data); }).catch(() => undefined);
    getMySubscription().then((result) => setSubscription({ status: "ready", data: result })).catch(() => setSubscription({ status: "ready", data: null }));
  }, []);

  return <div className="mx-auto grid max-w-5xl gap-6">
    <div className="flex flex-col gap-4 rounded-3xl border border-line bg-paper p-5 md:p-7 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted">Menu Studio</p><h1 className="mt-2 font-display text-3xl font-semibold">{t(copy.studio.greeting, lang)}</h1><p className="mt-1 text-sm text-muted">{lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr}</p></div>
      <Link to="/studio/orders" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-5 text-sm font-medium text-paper hover:opacity-90"><ShoppingBag className="size-4" /> الطلبات {orders.newCount > 0 ? <span className="rounded-full bg-paper/15 px-2 py-0.5">{orders.newCount}</span> : null}</Link>
    </div>

    <section className="grid grid-cols-2 gap-3 md:grid-cols-4"><Stat label={t(copy.studio.health, lang)} value={`${health.score}`} suffix="%" /><Stat label={t(copy.analytics.visits, lang)} value={analytics.status === "ok" ? String(analytics.data.visits) : analytics.status === "error" ? "—" : "…"} /><Stat label={t(copy.studio.products, lang)} value={String(products.length)} /><Stat label={t(copy.studio.branches, lang)} value={String(activeBranches)} /></section>

    <section className="grid gap-4 md:grid-cols-[1.3fr_.7fr]">
      <article className="relative overflow-hidden rounded-3xl border border-line bg-ink p-6 text-paper"><div className="relative z-10 grid gap-4"><div className="flex size-11 items-center justify-center rounded-2xl border border-paper/20 bg-paper/10"><BellRing className="size-5" /></div><div><h2 className="font-display text-2xl font-semibold">مركز تشغيل الطلبات</h2><p className="mt-2 max-w-xl text-sm leading-6 text-paper/70">الطلبات القادمة من المنيو تظهر هنا داخل مساحة نشاطك فقط. افتح النافذة لمراجعة الطلب، العميل، الفرع، الأصناف وتغيير الحالة.</p></div><Link to="/studio/orders" className="inline-flex w-fit items-center gap-2 rounded-xl bg-paper px-4 py-2.5 text-sm font-medium text-ink">فتح الطلبات <ArrowUpLeft className="size-4" /></Link></div><div className="absolute -end-16 -top-20 size-56 rounded-full border border-paper/10" /><div className="absolute -end-5 -bottom-24 size-44 rounded-full border border-paper/10" /></article>
      <article className="grid content-between gap-5 rounded-3xl border border-line bg-sand/30 p-6"><div><div className="flex size-11 items-center justify-center rounded-2xl bg-paper"><Palette className="size-5" /></div><h2 className="mt-4 font-semibold">هوية بصرية قابلة للتطور</h2><p className="mt-2 text-sm leading-6 text-muted">اختَر الثيم، العلامة، الصور والتكوين من Studio. التخصيص مضبوط ليبقى المنيو متماسكًا واحترافيًا.</p></div><Button asChild variant="outline"><Link to="/studio/design">استوديو التصميم</Link></Button></article>
    </section>

    <section className="grid gap-4 rounded-3xl border border-line bg-sand/25 p-5 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "الخطة الحالية" : "Current plan"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{subscription.status === "ready" && subscription.data ? (lang === "ar" ? subscription.data.nameAr : subscription.data.nameEn) : subscription.status === "loading" ? "…" : (lang === "ar" ? "غير متاحة" : "Unavailable")}</h2><p className="mt-1 text-sm text-muted">{subscription.status === "ready" && subscription.data ? (subscription.data.monthlyPriceSar === 0 ? (lang === "ar" ? "مجاناً" : "Free") : `${subscription.data.monthlyPriceSar} ${lang === "ar" ? "ر.س / شهر" : "SAR / month"}`) : (lang === "ar" ? "لا يمكن عرض حالة الاشتراك حالياً" : "Subscription status is unavailable right now")}</p></div><Link to="/pricing" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-paper">{lang === "ar" ? "عرض الباقات" : "View plans"}<ArrowUpLeft className="size-4" /></Link></div>
      {subscription.status === "ready" && subscription.data ? <div className="grid gap-3 sm:grid-cols-3"><LimitStat label={lang === "ar" ? "الفروع" : "Branches"} current={activeBranches} max={subscription.data.limits.branches} /><LimitStat label={lang === "ar" ? "الأصناف" : "Items"} current={products.length} max={subscription.data.limits.products} /><LimitStat label={lang === "ar" ? "أعضاء الفريق" : "Team"} current={snapshot.members.length} max={subscription.data.limits.teamMembers} /></div> : null}
    </section>

    <section className="grid gap-3 rounded-3xl border border-line p-5"><h2 className="font-medium">{t(copy.studio.needsAttention, lang)}</h2>{health.attention.length === 0 ? <p className="text-sm text-good">{t(copy.studio.allClear, lang)}</p> : <ul className="grid gap-2">{health.attention.map((item) => <li key={item.key}><Link to={item.href} className="flex items-start gap-3 rounded-xl bg-sand/60 px-3 py-3 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" /><span>{lang === "ar" ? item.titleAr : item.titleEn}</span></Link></li>)}</ul>}</section>

    {analytics.status === "error" ? <ErrorState message={analytics.message} /> : analytics.status === "ok" && analytics.data.visits === 0 && analytics.data.productViews === 0 ? <p className="rounded-xl border border-line px-4 py-6 text-sm text-muted">{t(copy.state.noDataYet, lang)}</p> : analytics.status === "ok" ? <section className="grid gap-2 rounded-xl border border-line p-5"><h2 className="font-medium">{t(copy.analytics.title, lang)}</h2><p className="text-sm text-muted">{analytics.data.uniqueSessions} {t(copy.analytics.sessions, lang)} · {analytics.data.productViews} {t(copy.analytics.views, lang)}</p></section> : null}

    <div className="flex flex-wrap gap-3"><Button asChild><Link to="/studio/menu">{t(copy.studio.addProduct, lang)}</Link></Button><Button asChild variant="outline"><a href={`/m/${tenant.slug}`}>{t(copy.studio.openMenu, lang)}</a></Button></div><p className="text-xs text-muted">{categories.length} {t(copy.studio.categories, lang)}</p>
  </div>;
}
function Stat({ label, value, suffix }: { label: string; value: string; suffix?: string }) { return <div className="rounded-xl border border-line p-4"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-display text-2xl tabular">{value}{suffix ? <span className="text-base">{suffix}</span> : null}</p></div>; }
function LimitStat({ label, current, max }: { label: string; current: number; max: number }) { const ratio = Math.min(100, max > 0 ? (current / max) * 100 : 100); return <div className="rounded-2xl border border-line bg-paper p-4"><div className="flex items-center justify-between gap-3 text-sm"><span className="text-muted">{label}</span><strong className="tabular">{current} / {max}</strong></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-sand"><div className={`h-full rounded-full ${ratio >= 90 ? "bg-warn" : "bg-ink"}`} style={{ width: `${ratio}%` }} /></div></div>; }
