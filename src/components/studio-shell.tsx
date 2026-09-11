import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BarChart3, BellRing, Building2, QrCode, Settings, LayoutDashboard, Palette, Upload, UtensilsCrossed, SlidersHorizontal, ExternalLink, Ellipsis, Users, ShieldCheck, Sparkles, X } from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { useStudio } from "@/lib/menu/studio";
import { canManageTeam, canWriteSettings, type Permission } from "@/lib/auth/permissions";
import { getOrderNotificationSummary, type OrderNotificationSummary } from "@/lib/menu/order-notifications";
import { cn } from "@/lib/utils";

type NavItem = { to: string; icon: typeof LayoutDashboard; label: { ar: string; en: string }; exact?: boolean; permission?: Permission };
const NAV: readonly NavItem[] = [
  { to: "/studio", icon: LayoutDashboard, label: copy.nav.overview, exact: true },
  { to: "/studio/menu", icon: UtensilsCrossed, label: copy.nav.menu },
  { to: "/studio/intelligence", icon: Sparkles, label: { ar: "ذكاء القائمة", en: "Menu Intelligence" } },
  { to: "/studio/options", icon: SlidersHorizontal, label: { ar: "خيارات الأصناف", en: "Item options" } },
  { to: "/studio/branches", icon: Building2, label: copy.nav.branches, permission: "settings.write" },
  { to: "/studio/brand", icon: Palette, label: copy.nav.brand, permission: "settings.write" },
  { to: "/studio/design", icon: Palette, label: { ar: "التصميم", en: "Design" }, permission: "settings.write" },
  { to: "/studio/qr", icon: QrCode, label: copy.nav.qr },
  { to: "/studio/analytics", icon: BarChart3, label: copy.nav.analytics },
  { to: "/studio/import", icon: Upload, label: copy.nav.import },
  { to: "/studio/team", icon: Users, label: { ar: "الفريق والصلاحيات", en: "Team & permissions" }, permission: "team.write" },
  { to: "/studio/settings", icon: Settings, label: copy.nav.settings, permission: "settings.write" },
];
const MOBILE_PRIMARY = ["/studio", "/studio/menu", "/studio/design"] as const;
const PLATFORM_OWNER_EMAIL = "midosd2.mm@gmail.com";

export function StudioShell() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const { user } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tenant = snapshot.tenant; const role = snapshot.role; const [moreOpen, setMoreOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationSummary, setNotificationSummary] = useState<OrderNotificationSummary>({ newCount: 0, latestNewOrder: null });
  const [orderAlert, setOrderAlert] = useState<OrderNotificationSummary["latestNewOrder"]>(null);
  const initialNotificationLoad = useRef(true);
  const previousLatestId = useRef<string | null>(null);
  const isPlatformOwner = user?.primaryEmail?.toLowerCase() === PLATFORM_OWNER_EMAIL;
  const publicHref = `/m/${tenant.slug}${snapshot.branches[0] ? `/${snapshot.branches[0].slug}` : ""}`;
  const visibleNav = NAV.filter((item) => { if (!item.permission) return true; if (item.permission === "team.write") return canManageTeam(role); if (item.permission === "settings.write") return canWriteSettings(role); return false; });
  const platformAdminLink = <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-ink-soft"><ShieldCheck className="size-4" />{lang === "ar" ? "إدارة المنصة" : "Platform Admin"}</Link>;

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const result = await getOrderNotificationSummary();
        if (!active || !result.ok) return;
        const latest = result.data.latestNewOrder;
        if (initialNotificationLoad.current) {
          previousLatestId.current = latest?.id ?? null;
          initialNotificationLoad.current = false;
        } else if (latest && latest.id !== previousLatestId.current) {
          previousLatestId.current = latest.id;
          setOrderAlert(latest);
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification(lang === "ar" ? `طلب جديد #${latest.orderNumber}` : `New order #${latest.orderNumber}`, { body: `${latest.customerName || (lang === "ar" ? "عميل" : "Customer")} · ${latest.total.toFixed(2)} ${latest.currency}` });
          }
        }
        setNotificationSummary(result.data);
      } catch {
        // Notifications are non-blocking; the orders page remains the source of truth.
      }
    };
    void poll();
    const timer = window.setInterval(() => void poll(), 20_000);
    return () => { active = false; window.clearInterval(timer); };
  }, [lang]);

  async function enableBrowserNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    try { await Notification.requestPermission(); } catch { /* browser denied or unsupported */ }
  }

  return <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[240px_1fr]">
    <aside className="hidden border-e border-line lg:flex lg:flex-col">
      <div className="grid gap-1 px-5 py-6"><p className="font-display text-lg font-semibold">{t(copy.brand, lang)}</p><p className="truncate text-sm text-muted">{lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr}</p></div>
      <nav className="grid gap-1 px-3 pb-6">{visibleNav.map((item) => { const active=item.exact?pathname===item.to:pathname.startsWith(item.to); const Icon=item.icon; return <Link key={item.to} to={item.to} className={cn("flex h-11 items-center gap-2 rounded-md px-3 text-sm",active?"bg-ink text-paper":"text-ink-soft hover:bg-sand")}><Icon className="size-4" />{t(item.label,lang)}</Link>; })}</nav>
      <div className="mt-auto grid gap-3 border-t border-line p-4">{isPlatformOwner ? platformAdminLink : null}<Link to="/studio/preview" className="inline-flex items-center gap-2 text-sm text-ink-soft"><ExternalLink className="size-4" />{t(copy.nav.preview,lang)}</Link>{tenant.isPublished?<a href={publicHref} className="inline-flex items-center gap-2 text-sm text-ink-soft"><ExternalLink className="size-4" />{t(copy.studio.openMenu,lang)}</a>:null}<UserButton /></div>
    </aside>
    <div className="flex min-w-0 flex-col">
      <header className="relative flex items-center justify-between gap-3 border-b border-line px-4 py-3 lg:px-8"><div className="min-w-0"><p className="truncate text-sm font-medium">{lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr}</p><p className="text-xs text-muted">{tenant.isPublished?t(copy.state.published,lang):t(copy.state.draft,lang)}</p></div><div className="flex items-center gap-2"><div className="relative"><button type="button" aria-label={lang === "ar" ? "تنبيهات الطلبات" : "Order notifications"} aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((value) => !value); setOrderAlert(null); }} className={cn("relative grid size-10 place-items-center rounded-xl border border-line", notificationsOpen ? "bg-ink text-paper" : "bg-paper text-ink-soft hover:bg-sand")}><BellRing className="size-4" />{notificationSummary.newCount > 0 ? <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-warn px-1 text-[10px] font-bold text-ink">{notificationSummary.newCount > 99 ? "99+" : notificationSummary.newCount}</span> : null}</button>{notificationsOpen ? <div className="absolute end-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-paper p-4 shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "تنبيهات الطلبات" : "Order alerts"}</p><h2 className="mt-1 font-semibold">{notificationSummary.newCount ? `${notificationSummary.newCount} ${lang === "ar" ? "طلب جديد" : "new orders"}` : (lang === "ar" ? "لا توجد طلبات جديدة" : "No new orders")}</h2></div><button type="button" aria-label={lang === "ar" ? "إغلاق" : "Close"} onClick={() => setNotificationsOpen(false)} className="grid size-8 place-items-center rounded-lg hover:bg-sand"><X className="size-4" /></button></div>{notificationSummary.latestNewOrder ? <div className="mt-4 rounded-xl bg-sand/50 p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">#{notificationSummary.latestNewOrder.orderNumber} · {notificationSummary.latestNewOrder.customerName || (lang === "ar" ? "عميل" : "Customer")}</p><p className="mt-1 text-xs text-muted">{notificationSummary.latestNewOrder.total.toFixed(2)} {notificationSummary.latestNewOrder.currency} · {new Date(notificationSummary.latestNewOrder.createdAt).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}</p></div><span className="rounded-full bg-paper px-2 py-1 text-xs">{lang === "ar" ? "جديد" : "New"}</span></div></div> : null}<div className="mt-3 grid gap-2"><Link to="/studio/orders" onClick={() => setNotificationsOpen(false)} className="inline-flex h-10 items-center justify-center rounded-xl bg-ink px-4 text-sm font-medium text-paper">{lang === "ar" ? "فتح الطلبات" : "Open orders"}</Link>{typeof window !== "undefined" && "Notification" in window && Notification.permission !== "granted" ? <button type="button" onClick={() => void enableBrowserNotifications()} className="h-10 rounded-xl border border-line text-sm text-ink-soft">{lang === "ar" ? "تفعيل تنبيهات الجهاز" : "Enable device notifications"}</button> : null}</div></div> : null}</div><LangToggle /><div className="lg:hidden"><UserButton /></div></div></header>
      <div className="flex-1 px-4 py-6 pb-28 lg:px-8"><Outlet /></div>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 gap-1 border-t border-line bg-paper px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">{visibleNav.filter((item)=>MOBILE_PRIMARY.includes(item.to as typeof MOBILE_PRIMARY[number])).map((item)=>{const active=item.exact?pathname===item.to:pathname.startsWith(item.to);const Icon=item.icon;return <Link key={item.to} to={item.to} className={cn("grid h-12 place-items-center rounded-md text-xs",active?"bg-ink text-paper":"text-muted")}><Icon className="size-4" />{t(item.label,lang)}</Link>;})}<button type="button" onClick={()=>setMoreOpen(true)} className={cn("grid h-12 place-items-center rounded-md text-xs",moreOpen||visibleNav.some((item)=>!MOBILE_PRIMARY.includes(item.to as typeof MOBILE_PRIMARY[number])&&(item.exact?pathname===item.to:pathname.startsWith(item.to)))?"bg-ink text-paper":"text-muted")}><Ellipsis className="size-4" />{t(copy.nav.more,lang)}</button></nav>
    </div>
    {orderAlert ? <div className="fixed inset-x-4 top-16 z-[60] mx-auto max-w-md rounded-2xl border border-line bg-paper p-4 shadow-2xl lg:inset-x-auto lg:end-6"><div className="flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-paper"><BellRing className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "طلب جديد" : "New order"}</p><p className="mt-1 font-semibold">#{orderAlert.orderNumber} · {orderAlert.customerName || (lang === "ar" ? "عميل" : "Customer")}</p><p className="mt-1 text-sm text-muted">{orderAlert.total.toFixed(2)} {orderAlert.currency}</p><Link to="/studio/orders" onClick={() => setOrderAlert(null)} className="mt-3 inline-flex h-9 items-center rounded-lg bg-ink px-3 text-xs font-medium text-paper">{lang === "ar" ? "مراجعة الطلب" : "Review order"}</Link></div><button type="button" aria-label={lang === "ar" ? "إغلاق" : "Close"} onClick={() => setOrderAlert(null)} className="grid size-8 shrink-0 place-items-center rounded-lg hover:bg-sand"><X className="size-4" /></button></div></div> : null}
    {moreOpen?<div className="fixed inset-0 z-40 lg:hidden"><button type="button" className="absolute inset-0 bg-ink/40" aria-label={t(copy.studio.cancel,lang)} onClick={()=>setMoreOpen(false)} /><div className="absolute inset-x-0 bottom-0 rounded-t-xl bg-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"><p className="mb-3 text-sm font-medium">{t(copy.nav.more,lang)}</p><div className="grid grid-cols-3 gap-2">{isPlatformOwner? <span>{platformAdminLink}</span>:null}{visibleNav.filter((item)=>!MOBILE_PRIMARY.includes(item.to as typeof MOBILE_PRIMARY[number])).map((item)=>{const Icon=item.icon;const active=pathname.startsWith(item.to);return <Link key={item.to} to={item.to} onClick={()=>setMoreOpen(false)} className={cn("grid h-20 place-items-center gap-1 rounded-lg border border-line text-xs",active?"bg-ink text-paper":"bg-paper text-ink-soft")}><Icon className="size-4" />{t(item.label,lang)}</Link>;})}<Link to="/studio/preview" onClick={()=>setMoreOpen(false)} className="grid h-20 place-items-center gap-1 rounded-lg border border-line text-xs text-ink-soft"><ExternalLink className="size-4" />{t(copy.nav.preview,lang)}</Link></div></div></div>:null}
  </div>;
}
