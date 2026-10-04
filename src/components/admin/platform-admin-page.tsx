import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Archive, BarChart3, BellRing, Building2, CheckCircle2, ExternalLink, LayoutDashboard, Mail, MessageCircle, PackageCheck, Clock3, Phone, Search, Settings, ShieldCheck, Store, Users, Wallet, Wrench, XCircle } from "lucide-react";
import { ErrorState, LoadingState, MetricRow, PageHeader, SectionHeader } from "@/components/internal-design-system";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { archivePlatformOrder, getPlatformCustomerNotifications, getPlatformDashboard, getPlatformOrders, updatePlatformOrderStatus, updatePlatformTenantStatus, type PlatformCustomerNotification, type PlatformDashboard, type PlatformOrder, type PlatformTenant } from "@/lib/menu/platform";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/menu/orders";
import { ADMIN_ROUTES, ADMIN_WORKSPACE_TABS, type Tab } from "@/lib/admin/routes";

const ORDER_LABELS: Record<OrderStatus, string> = { new: "جديد", confirmed: "مؤكد", preparing: "قيد التحضير", ready: "جاهز", completed: "مكتمل", cancelled: "ملغى" };
const emptyPlatform = (): PlatformDashboard => ({ tenants: [], branches: [], members: [], projects: [], activity: [], analytics: { visits: 0, productViews: 0, qrScans: 0, whatsappClicks: 0, orders: 0, completedOrders: 0 }, tenantCount: 0, activeTenantCount: 0, publishedTenantCount: 0, branchCount: 0, productCount: 0, orderCount: 0, openOrderCount: 0, menuEventCount: 0, activeSubscriptionCount: 0, trialSubscriptionCount: 0 });
function fmt(v: string) { try { return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v)); } catch { return v; } }
function phoneHref(value: string) { const digits = value.replace(/[^0-9+]/g, ""); return digits ? `tel:${digits}` : ""; }
function whatsappHref(value: string) { const digits = value.replace(/[^0-9]/g, ""); return digits ? `https://wa.me/${digits}` : ""; }
const NAV: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [ { id: "overview", label: "الرئيسية", icon: LayoutDashboard }, { id: "tenants", label: "المطاعم", icon: Store }, { id: "orders", label: "الطلبات", icon: PackageCheck }, { id: "clients", label: "العملاء والحسابات", icon: Users }, { id: "branches", label: "الفروع", icon: Building2 }, { id: "projects", label: "المشاريع", icon: Wrench }, { id: "subscriptions", label: "الاشتراكات", icon: Wallet }, { id: "analytics", label: "تحليلات المنصة", icon: BarChart3 }, { id: "activity", label: "سجل النشاط", icon: Activity }, { id: "system", label: "النظام والأمان", icon: ShieldCheck } ];
const ADMIN_GROUPS: Array<{ id: string; label: string; items: Tab[] }> = [ { id: "overview", label: "نظرة عامة", items: ["overview"] }, { id: "customers", label: "العملاء", items: ["tenants", "clients", "branches", "projects"] }, { id: "commerce", label: "التجارة والتشغيل", items: ["orders", "subscriptions"] }, { id: "intelligence", label: "الذكاء التشغيلي", items: ["analytics", "activity"] }, { id: "system", label: "النظام", items: ["system"] } ];
export function PlatformAdminPage({ initialTab = "overview" }: { initialTab?: Tab }) {
  const navigate = useNavigate(); const { user, isPending } = useCurrentUserState(); const [tab, setTab] = useState<Tab>(initialTab); const [platform, setPlatform] = useState<PlatformDashboard>(emptyPlatform); const [orders, setOrders] = useState<PlatformOrder[]>([]); const [orderStatus, setOrderStatus] = useState<OrderStatus | "all">("all"); const [orderQuery, setOrderQuery] = useState(""); const [selectedOrder, setSelectedOrder] = useState<PlatformOrder | null>(null); const [query, setQuery] = useState(""); const [loading, setLoading] = useState(true); const [ordersLoading, setOrdersLoading] = useState(false); const [error, setError] = useState(""); const [saving, setSaving] = useState<string | null>(null); const [customerNotificationsOpen, setCustomerNotificationsOpen] = useState(false); const [customerNotifications, setCustomerNotifications] = useState<PlatformCustomerNotification[]>([]); const [customerNotificationCount, setCustomerNotificationCount] = useState(0); const [customerAlert, setCustomerAlert] = useState<PlatformCustomerNotification | null>(null);
  const filteredTenants = useMemo(() => filterRows(platform.tenants, query, (t) => [t.nameAr, t.nameEn, t.slug, t.city, t.ownerName, t.ownerEmail]), [platform.tenants, query]); const filteredBranches = useMemo(() => filterRows(platform.branches, query, (b) => [b.tenantName, b.nameAr, b.nameEn, b.city, b.phone]), [platform.branches, query]); const filteredMembers = useMemo(() => filterRows(platform.members, query, (m) => [m.tenantName, m.name, m.email, m.role]), [platform.members, query]); const filteredProjects = useMemo(() => filterRows(platform.projects, query, (p) => [p.businessName, p.city, p.contactName, p.contactPhone, p.status]), [platform.projects, query]);
  const customerNotificationReadKey = "menu-v3:platform-admin:customer-notifications-read-at";
  const customerNotificationCursor = useRef<string | null>(null);

  async function pollCustomerNotifications(initial = false) {
    const cursor = new Date().toISOString();
    const storedReadAt = typeof window !== "undefined" ? window.localStorage.getItem(customerNotificationReadKey) : null;
    const since = customerNotificationCursor.current ?? (storedReadAt || cursor);
    try {
      const result = await getPlatformCustomerNotifications({ data: { since } });
      if (!result.ok) return;
      setCustomerNotifications(result.data.recent);
      const latestCreatedAt = result.data.recent.reduce((latest, item) => item.createdAt > latest ? item.createdAt : latest, cursor);
      customerNotificationCursor.current = latestCreatedAt > cursor ? latestCreatedAt : cursor;
      if (initial && !storedReadAt) {
        window.localStorage.setItem(customerNotificationReadKey, customerNotificationCursor.current);
        return;
      }
      if (!result.data.newCustomers.length) return;
      setCustomerNotificationCount((count) => count + result.data.newCustomers.length);
      const latest = result.data.newCustomers[0];
      setCustomerAlert(latest);
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("عميل جديد في Menu V3", { body: latest.tenantName ? `تم تسجيل ${latest.customerName || latest.email || "عميل"} وإنشاء مساحة «${latest.tenantName}».` : "تم تسجيل عميل جديد في المنصة." });
      }
      window.setTimeout(() => setCustomerAlert((current) => current?.tenantId === latest.tenantId ? null : current), 6000);
    } catch {
      // Notifications are non-blocking; the main admin surface remains usable if polling fails.
    }
  }

  async function loadOrders() { setOrdersLoading(true); try { const result = await getPlatformOrders({ data: { status: orderStatus === "all" ? undefined : orderStatus, q: orderQuery.trim() || undefined } }); if (!result.ok) setError(result.error); else { setOrders(result.data); setSelectedOrder((current) => current && result.data.some((x) => x.id === current.id) ? result.data.find((x) => x.id === current.id) ?? current : result.data[0] ?? null); } } catch (e) { setError(e instanceof Error ? e.message : "تعذر تحميل الطلبات"); } finally { setOrdersLoading(false); } }
  async function load() { setLoading(true); setError(""); try { const p = await getPlatformDashboard(); if (!p.ok) setError(p.error); else setPlatform(p.data); } catch (e) { setError(e instanceof Error ? e.message : "تعذر تحميل مركز تحكم المنصة"); } finally { setLoading(false); } }
  function selectTab(next: Tab) {\n    setTab(next);\n    setQuery("");\n    if (next === "overview") {\n      void navigate({ to: "/admin" });\n      return;\n    }\n    const workspace = Object.entries(ADMIN_WORKSPACE_TABS).find(([, tab]) => tab === next)?.[0];\n    if (!workspace) return;\n    void navigate({ to: "/admin/$workspace", params: { workspace } });\n  }
  useEffect(() => { setTab(initialTab); }, [initialTab]);
  useEffect(() => { if (isPending) return; if (!user) { void navigate({ to: "/login", search: { redirect: "/admin" } as never, replace: true }); return; } void load(); void pollCustomerNotifications(true); }, [isPending, user]);
  useEffect(() => {
    if (isPending || !user) return;
    const timer = window.setInterval(() => void pollCustomerNotifications(), 10000);
    return () => window.clearInterval(timer);
  }, [isPending, user]);
  useEffect(() => { if (isPending || !user || tab !== "orders") return; const timer = window.setTimeout(() => void loadOrders(), 180); return () => window.clearTimeout(timer); }, [tab, orderStatus, orderQuery]);
  async function toggle(t: PlatformTenant) { setSaving(t.id); const r = await updatePlatformTenantStatus({ data: { tenantId: t.id, isActive: !t.isActive } }); if (!r.ok) setError(r.error); else setPlatform((current) => ({ ...current, activeTenantCount: current.activeTenantCount + (r.data.isActive ? 1 : -1), tenants: current.tenants.map((x) => x.id === t.id ? { ...x, isActive: r.data.isActive } : x) })); setSaving(null); }
  async function changeOrderStatus(id: string, status: OrderStatus) { setSaving(id); const result = await updatePlatformOrderStatus({ data: { id, status } }); if (!result.ok) setError(result.error); else { setOrders((current) => current.map((order) => order.id === id ? result.data : order)); setSelectedOrder(result.data); setPlatform((current) => ({ ...current, openOrderCount: current.openOrderCount + (isOpenOrder(result.data.status) ? 1 : 0) - (selectedOrder && isOpenOrder(selectedOrder.status) ? 1 : 0) })); } setSaving(null); }
  async function archiveOrder(order: PlatformOrder) { if (!window.confirm(`إزالة الطلب #${order.orderNumber} من لوحة التشغيل؟\nسيتم أرشفته وليس حذف سجله التاريخي.`)) return; setSaving(order.id); const result = await archivePlatformOrder({ data: { id: order.id } }); if (!result.ok) setError(result.error); else { setOrders((current) => current.filter((x) => x.id !== order.id)); setSelectedOrder((current) => current?.id === order.id ? null : current); setPlatform((current) => ({ ...current, orderCount: Math.max(0, current.orderCount - 1), openOrderCount: isOpenOrder(order.status) ? Math.max(0, current.openOrderCount - 1) : current.openOrderCount })); } setSaving(null); }
  function toggleCustomerNotifications() {
    setCustomerNotificationsOpen((value) => !value);
    setCustomerNotificationCount(0);
    if (typeof window !== "undefined") window.localStorage.setItem(customerNotificationReadKey, new Date().toISOString());
  }
  async function enableBrowserNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    await Notification.requestPermission();
  }
  if (isPending || !user) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">جار التحقق من صلاحيات مالك المنصة...</div>;
  const activeNav = NAV.find((item) => item.id === tab);
  return <>
    {customerAlert ? <div role="status" aria-live="polite" className="fixed inset-x-4 top-4 z-[60] mx-auto max-w-md rounded-2xl border border-line bg-paper p-4 shadow-2xl">
      <p className="text-xs font-semibold text-accent">عميل جديد</p>
      <p className="mt-1 font-semibold">{customerAlert.tenantName || "مساحة عمل جديدة"}</p>
      <p className="mt-1 text-sm text-muted">{customerAlert.customerName || customerAlert.email || "تم تسجيل عميل جديد."}</p>
      <Link to="/admin/users" onClick={() => setCustomerAlert(null)} className="mt-3 inline-flex min-h-9 items-center rounded-lg bg-ink px-3 text-xs text-paper">فتح الحسابات</Link>
    </div> : null}
    <main className="mx-auto grid max-w-[1500px] gap-5 py-4 lg:py-8">
      <PageHeader
        eyebrow="Platform Admin"
        title="مركز تحكم Menu V3"
        description="مساحة تشغيل مستقلة لمالك المنصة لمراجعة المطاعم، الطلبات، الحسابات، الاشتراكات، الذكاء التشغيلي، والنظام."
        actions={<div className="flex flex-wrap gap-2">
          <Button variant="outline" aria-label="إشعارات العملاء الجدد" aria-expanded={customerNotificationsOpen} onClick={toggleCustomerNotifications}>
            <BellRing className="size-4" />
            إشعارات
            {customerNotificationCount > 0 ? <span className="rounded-full bg-bad px-2 py-0.5 text-[10px] text-white">{customerNotificationCount > 99 ? "99+" : customerNotificationCount}</span> : null}
          </Button>
          <Button variant="outline" onClick={() => { void load(); if (tab === "orders") void loadOrders(); }} disabled={loading || ordersLoading}>
            <span className={cn("size-4", (loading || ordersLoading) && "animate-spin")}>↻</span>
            تحديث البيانات
          </Button>
        </div>}
      />
      {customerNotificationsOpen ? <CustomerNotificationPanel notifications={customerNotifications} onClose={() => setCustomerNotificationsOpen(false)} onOpenAccounts={() => setCustomerNotificationsOpen(false)} onEnableBrowserNotifications={() => void enableBrowserNotifications()} /> : null}
      <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <AdminNavigation tab={tab} platform={platform} onSelect={selectTab} />
        <section className="min-w-0 grid gap-4">
          {error ? <ErrorState title="تعذر تحميل بعض بيانات المنصة" message={error} action={<Button variant="outline" onClick={() => { void load(); if (tab === "orders") void loadOrders(); }}>إعادة المحاولة</Button>} /> : null}
          {loading && !platform.tenants.length ? <LoadingState label="جارٍ تحميل مساحة إدارة المنصة…" /> : null}
          {!loading || platform.tenants.length ? <>
            <section className="rounded-2xl border border-line bg-paper p-4">
              <SectionHeader title="لقطة تشغيلية" description="أرقام حقيقية من بيانات المنصة الحالية فقط." />
              <div className="mt-2 grid gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                <MetricRow label="المطاعم" value={platform.tenantCount.toLocaleString("ar-SA")} />
                <MetricRow label="النشطة" value={platform.activeTenantCount.toLocaleString("ar-SA")} />
                <MetricRow label="المنشورة" value={platform.publishedTenantCount.toLocaleString("ar-SA")} />
                <MetricRow label="الفروع" value={platform.branchCount.toLocaleString("ar-SA")} />
                <MetricRow label="الأصناف" value={platform.productCount.toLocaleString("ar-SA")} />
                <MetricRow label="الطلبات" value={platform.orderCount.toLocaleString("ar-SA")} />