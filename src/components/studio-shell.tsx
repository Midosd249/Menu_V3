import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { BarChart3, BellRing, Building2, QrCode, Settings, LayoutDashboard, Palette, Upload, UtensilsCrossed, SlidersHorizontal, ExternalLink, Ellipsis, Users, ShieldCheck, Sparkles, X, UsersRound } from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { useStudio } from "@/lib/menu/studio";
import { canManageTeam, canWriteSettings, type Permission } from "@/lib/auth/permissions";
import { getOrderNotificationSummary, type OrderNotificationSummary } from "@/lib/menu/order-notifications";
import { cn } from "@/lib/utils";
import { Sheet } from "@/components/state-panel";
import { MenuImportPanel } from "@/components/studio/menu-import-panel";
import { MobileBottomNav, WorkspaceNavigation, type WorkspaceNavigationItem } from "@/components/internal-design-system";

type StudioNavItem = {
  to: string;
  icon: typeof LayoutDashboard;
  label: { ar: string; en: string };
  exact?: boolean;
  permission?: Permission;
};

type StudioNavSection = {
  label: { ar: string; en: string };
  items: readonly StudioNavItem[];
};

const WORKSPACE_NAV: readonly StudioNavItem[] = [
  { to: "/studio", icon: LayoutDashboard, label: copy.nav.overview, exact: true },
  { to: "/studio/menu", icon: UtensilsCrossed, label: copy.nav.menu },
  { to: "/studio/orders", icon: BellRing, label: { ar: "الطلبات", en: "Orders" } },
  { to: "/studio/growth", icon: Sparkles, label: { ar: "النمو", en: "Growth" } },
  { to: "/studio/guests", icon: UsersRound, label: { ar: "العملاء", en: "Customers" } },
  { to: "/studio/settings", icon: Settings, label: copy.nav.settings, permission: "settings.write" },
];

const NAV_SECTIONS: readonly StudioNavSection[] = [
  {
    label: { ar: "القائمة", en: "Menu" },
    items: [
      { to: "/studio/menu", icon: UtensilsCrossed, label: { ar: "الأصناف والفئات", en: "Items & categories" } },
      { to: "/studio/options", icon: SlidersHorizontal, label: { ar: "الخيارات", en: "Options" } },
      { to: "/studio/import", icon: Upload, label: { ar: "الاستيراد", en: "Import" } },
    ],
  },
  {
    label: { ar: "النمو", en: "Growth" },
    items: [
      { to: "/studio/growth", icon: Sparkles, label: { ar: "نظرة عامة", en: "Overview" } },
      { to: "/studio/intelligence", icon: Sparkles, label: { ar: "الذكاء", en: "Intelligence" } },
      { to: "/studio/intelligence-actions", icon: SlidersHorizontal, label: { ar: "الإجراءات", en: "Actions" } },
      { to: "/studio/analytics", icon: BarChart3, label: { ar: "التحليلات", en: "Analytics" } },
      { to: "/studio/reports", icon: BarChart3, label: { ar: "التقارير", en: "Reports" } },
    ],
  },
  {
    label: { ar: "العملاء", en: "Customers" },
    items: [
      { to: "/studio/guests", icon: UsersRound, label: { ar: "الضيوف والاحتفاظ", en: "Guests & retention" } },
    ],
  },
  {
    label: { ar: "المظهر والنشر", en: "Appearance & Publishing" },
    items: [
      { to: "/studio/brand", icon: Palette, label: { ar: "الهوية", en: "Brand" }, permission: "settings.write" },
      { to: "/studio/design", icon: Palette, label: { ar: "المظهر", en: "Appearance" }, permission: "settings.write" },
      { to: "/studio/qr", icon: QrCode, label: { ar: "رمز QR", en: "QR" } },
      { to: "/studio/preview", icon: ExternalLink, label: { ar: "المعاينة", en: "Preview" } },
    ],
  },
  {
    label: { ar: "الإعدادات", en: "Settings" },
    items: [
      { to: "/studio/branches", icon: Building2, label: copy.nav.branches, permission: "settings.write" },
      { to: "/studio/team", icon: Users, label: { ar: "الفريق والصلاحيات", en: "Team & permissions" }, permission: "team.write" },
      { to: "/studio/settings", icon: Settings, label: copy.nav.settings, permission: "settings.write" },
    ],
  },
];

const PLATFORM_OWNER_EMAIL = "midosd2.mm@gmail.com";

export function StudioShell() {
  const { lang } = useLang();
  const { snapshot } = useStudio();
  const { user } = useCurrentUserState();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tenant = snapshot.tenant;
  const role = snapshot.role;
  const [moreOpen, setMoreOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuImportOpen, setMenuImportOpen] = useState(false);
  const [notificationSummary, setNotificationSummary] = useState<OrderNotificationSummary>({ newCount: 0, latestNewOrder: null });
  const [orderAlert, setOrderAlert] = useState<OrderNotificationSummary["latestNewOrder"]>(null);
  const initialNotificationLoad = useRef(true);
  const previousLatestId = useRef<string | null>(null);
  const isPlatformOwner = user?.primaryEmail?.toLowerCase() === PLATFORM_OWNER_EMAIL;
  const publicHref = `/m/${tenant.slug}${snapshot.branches[0] ? `/${snapshot.branches[0].slug}` : ""}`;

  const canView = (item: StudioNavItem) => {
    if (!item.permission) return true;
    if (item.permission === "team.write") return canManageTeam(role);
    if (item.permission === "settings.write") return canWriteSettings(role);
    return false;
  };

  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(canView),
  })).filter((section) => section.items.length > 0);

  const workspaceItems: WorkspaceNavigationItem[] = WORKSPACE_NAV.filter(canView).map((item) => ({
    id: item.to,
    label: t(item.label, lang),
    icon: <item.icon className="size-4" />,
    active: item.exact ? pathname === item.to : pathname.startsWith(item.to),
  }));

  const mobileItems: WorkspaceNavigationItem[] = [
    ...WORKSPACE_NAV.filter((item) => ["/studio", "/studio/menu", "/studio/orders", "/studio/growth"].includes(item.to)).filter(canView).map((item) => ({
      id: item.to,
      label: t(item.label, lang),
      icon: <item.icon className="size-4" />,
      active: item.exact ? pathname === item.to : pathname.startsWith(item.to),
    })),
    {
      id: "more",
      label: t(copy.nav.more, lang),
      icon: <Ellipsis className="size-4" />,
      active: moreOpen,
    },
  ];

  const navigateTo = (item: WorkspaceNavigationItem) => {
    if (item.id === "more") {
      setMoreOpen(true);
      return;
    }
    void navigate({ to: item.id as never });
  };

  const platformAdminLink = <Link to="/admin" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-soft"><ShieldCheck className="size-4" />{lang === "ar" ? "إدارة المنصة" : "Platform Admin"}</Link>;

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const result = await getOrderNotificationSummary({ data: { tenantId: tenant.id } });
        if (!active || !result.ok) return;
        const latest = result.data.latestNewOrder;
        if (initialNotificationLoad.current) {
          previousLatestId.current = latest?.id ?? null;
          initialNotificationLoad.current = false;
        } else if (latest && latest.id !== previousLatestId.current) {
          previousLatestId.current = latest.id;
          setOrderAlert(latest);
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification(lang === "ar" ? `طلب جديد #${latest.orderNumber}` : `New order #${latest.orderNumber}`, { body: `${latest.restaurantName}${latest.branchName ? ` · ${latest.branchName}` : ""} · ${latest.customerName || (lang === "ar" ? "عميل" : "Customer")} · ${latest.total.toFixed(2)} ${latest.currency}` });
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
  }, [lang, tenant.id]);

  async function enableBrowserNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    try { await Notification.requestPermission(); } catch { /* browser denied or unsupported */ }
  }

  return <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[280px_1fr]">
    <aside className="hidden border-e border-line bg-paper lg:flex lg:flex-col">
      <div className="grid gap-1 px-5 py-6"><p className="font-display text-lg font-semibold">{t(copy.brand, lang)}</p><p className="truncate text-sm text-muted">{lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr}</p></div>
      <WorkspaceNavigation
        items={workspaceItems}
        onSelect={navigateTo}
        ariaLabel={lang === "ar" ? "مساحات العمل" : "Workspaces"}
        footer={<div className="grid gap-3">{visibleSections.map((section) => <div key={section.label.en} className="grid gap-1"><p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t(section.label, lang)}</p>{section.items.map((item) => { const active = item.exact ? pathname === item.to : pathname.startsWith(item.to); const Icon = item.icon; return <Link key={item.to} to={item.to as never} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-ink-soft hover:bg-sand/70 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active && "bg-sand text-ink")}><Icon className="size-4 shrink-0" />{t(item.label, lang)}</Link>; })}</div>)}</div>}
      />
      <div className="mt-auto grid gap-3 border-t border-line p-4">{isPlatformOwner ? platformAdminLink : null}<Link to="/studio/preview" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-soft"><ExternalLink className="size-4" />{t(copy.nav.preview,lang)}</Link>{tenant.isPublished?<a href={publicHref} className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-soft"><ExternalLink className="size-4" />{t(copy.studio.openMenu,lang)}</a>:null}<UserButton /></div>
    </aside>
    <div className="flex min-w-0 flex-col">
      <header className="relative flex items-center justify-between gap-3 border-b border-line px-4 py-3 lg:px-8"><div className="min-w-0"><p className="truncate text-sm font-medium">{lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr}</p><p className="text-xs text-muted">{tenant.isPublished?t(copy.state.published,lang):t(copy.state.draft,lang)}</p></div><div className="flex items-center gap-2">
        {pathname === "/studio/menu" ? <button type="button" onClick={() => setMenuImportOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-paper px-3 text-sm font-medium text-ink-soft hover:bg-sand" aria-label={lang === "ar" ? "استيراد القائمة" : "Import menu"}><Upload className="size-4" />{lang === "ar" ? "استيراد" : "Import"}</button> : null}
        <div className="relative"><button type="button" aria-label={lang === "ar" ? "نشاط وتنبيهات الطلبات" : "Order activity and notifications"} aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((value) => !value); setOrderAlert(null); }} className={cn("relative grid size-11 place-items-center rounded-xl border border-line", notificationsOpen ? "bg-ink text-paper" : "bg-paper text-ink-soft hover:bg-sand")}><BellRing className="size-4" />{notificationSummary.newCount > 0 ? <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-warn px-1 text-[10px] font-bold text-ink">{notificationSummary.newCount > 99 ? "99+" : notificationSummary.newCount}</span> : null}</button>{notificationsOpen ? <div className="fixed inset-x-3 top-16 z-50 max-h-[70dvh] w-auto overflow-auto rounded-2xl border border-line bg-paper p-4 shadow-2xl sm:absolute sm:start-0 sm:top-12 sm:max-h-[32rem] sm:w-[min(22rem,calc(100vw-2rem))]"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "نشاط الطلبات" : "Order activity"}</p><h2 className="mt-1 font-semibold">{notificationSummary.latestNewOrder?.restaurantName || (lang === "ar" ? "نشاطك" : "Your business")}</h2>{notificationSummary.latestNewOrder?.branchName ? <p className="mt-1 text-xs text-muted">{notificationSummary.latestNewOrder.branchName}</p> : null}<p className="mt-1 text-sm text-muted">{notificationSummary.newCount ? `${notificationSummary.newCount} ${lang === "ar" ? "طلب جديد" : "new orders"}` : (lang === "ar" ? "لا توجد طلبات جديدة" : "No new orders")}</p></div><button type="button" aria-label={lang === "ar" ? "إغلاق" : "Close"} onClick={() => setNotificationsOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-lg hover:bg-sand"><X className="size-4" /></button></div>{notificationSummary.latestNewOrder ? <div className="mt-4 rounded-xl bg-sand/50 p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">#{notificationSummary.latestNewOrder.orderNumber} · {notificationSummary.latestNewOrder.customerName || (lang === "ar" ? "عميل" : "Customer")}</p><p className="mt-1 text-xs text-muted">{notificationSummary.latestNewOrder.restaurantName} · {notificationSummary.latestNewOrder.branchName}</p><p className="mt-1 text-xs text-muted">{notificationSummary.latestNewOrder.total.toFixed(2)} {notificationSummary.latestNewOrder.currency} · {new Date(notificationSummary.latestNewOrder.createdAt).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}</p></div><span className="rounded-full bg-paper px-2 py-1 text-xs">{lang === "ar" ? "جديد" : "New"}</span></div></div> : null}<div className="mt-3 grid gap-2"><Link to="/studio/orders" onClick={() => setNotificationsOpen(false)} className="inline-flex h-10 items-center justify-center rounded-xl bg-ink px-4 text-sm font-medium text-paper">{lang === "ar" ? "فتح الطلبات" : "Open orders"}</Link>{typeof window !== "undefined" && "Notification" in window && Notification.permission !== "granted" ? <button type="button" onClick={() => void enableBrowserNotifications()} className="h-10 rounded-xl border border-line text-sm text-ink-soft">{lang === "ar" ? "تفعيل تنبيهات الجهاز" : "Enable device notifications"}</button> : null}</div></div> : null}</div><LangToggle /><div className="lg:hidden"><UserButton /></div></div></header>
      <div className="flex-1 px-4 py-6 pb-28 lg:px-8"><Outlet /></div>
      <MobileBottomNav items={mobileItems} onSelect={navigateTo} />
    </div>
    {orderAlert ? <div className="fixed inset-x-4 top-16 z-[60] mx-auto max-w-md rounded-2xl border border-line bg-paper p-4 shadow-2xl lg:inset-x-auto lg:end-6"><div className="flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-paper"><BellRing className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{lang === "ar" ? "طلب جديد" : "New order"}</p><p className="mt-1 font-semibold">#{orderAlert.orderNumber} · {orderAlert.customerName || (lang === "ar" ? "عميل" : "Customer")}</p><p className="mt-1 text-xs text-muted">{orderAlert.restaurantName} · {orderAlert.branchName}</p><p className="mt-1 text-sm text-muted">{orderAlert.total.toFixed(2)} {orderAlert.currency}</p><Link to="/studio/orders" onClick={() => setOrderAlert(null)} className="mt-3 inline-flex h-9 items-center rounded-lg bg-ink px-3 text-xs font-medium text-paper">{lang === "ar" ? "مراجعة الطلب" : "Review order"}</Link></div><button type="button" aria-label={lang === "ar" ? "إغلاق" : "Close"} onClick={() => setOrderAlert(null)} className="grid size-8 shrink-0 place-items-center rounded-lg hover:bg-sand"><X className="size-4" /></button></div></div> : null}
    {menuImportOpen ? <Sheet title={lang === "ar" ? "استيراد القائمة" : "Import menu"} onClose={() => setMenuImportOpen(false)}><MenuImportPanel onClose={() => setMenuImportOpen(false)} /></Sheet> : null}
    {moreOpen?<div className="fixed inset-0 z-40 lg:hidden"><button type="button" className="absolute inset-0 bg-ink/40" aria-label={t(copy.studio.cancel,lang)} onClick={()=>setMoreOpen(false)} /><div className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-auto rounded-t-2xl bg-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"><div className="mb-3 flex items-center justify-between gap-3"><p className="text-sm font-semibold">{t(copy.nav.more,lang)}</p><button type="button" aria-label={lang === "ar" ? "إغلاق" : "Close"} onClick={()=>setMoreOpen(false)} className="grid size-10 place-items-center rounded-lg hover:bg-sand"><X className="size-4" /></button></div><div className="grid gap-4">{isPlatformOwner? <div className="rounded-lg border border-line p-3">{platformAdminLink}</div>:null}{visibleSections.map((section)=><div key={section.label.en} className="grid gap-1"><p className="px-1 pb-1 text-xs font-semibold text-muted">{t(section.label,lang)}</p>{section.items.map((item)=>{const Icon=item.icon;const active=item.exact?pathname===item.to:pathname.startsWith(item.to);return <Link key={item.to} to={item.to as never} onClick={()=>setMoreOpen(false)} aria-current={active?"page":undefined} className={cn("flex min-h-11 items-center gap-3 rounded-lg border border-line px-3 text-sm text-ink-soft",active?"bg-ink text-paper":"bg-paper hover:bg-sand") }><Icon className="size-4 shrink-0" />{t(item.label,lang)}</Link>;})}</div>)}</div></div></div>:null}
  </div>;
}
