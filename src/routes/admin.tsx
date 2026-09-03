import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, BarChart3, Building2, ClipboardList, ExternalLink, LayoutDashboard, RefreshCw, Search, Settings, ShieldCheck, Store, Users, Wallet, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getAdminDashboard, LEAD_STATUSES, type AdminDashboard, type LeadStatus } from "@/lib/menu/admin";
import { getPlatformDashboard, updatePlatformTenantStatus, type PlatformDashboard, type PlatformTenant } from "@/lib/menu/platform";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: PlatformAdminPage });

type Tab = "overview" | "tenants" | "clients" | "branches" | "leads" | "projects" | "requests" | "subscriptions" | "analytics" | "activity" | "system";
const LABELS: Record<LeadStatus, string> = { new: "جديد", contacted: "تم التواصل", qualified: "مؤهل", converted: "تم التحويل", lost: "مغلق" };
const emptyPlatform = (): PlatformDashboard => ({ tenants: [], branches: [], members: [], projects: [], serviceRequests: [], activity: [], analytics: { visits: 0, productViews: 0, qrScans: 0, whatsappClicks: 0, orders: 0, completedOrders: 0 }, tenantCount: 0, activeTenantCount: 0, publishedTenantCount: 0, branchCount: 0, productCount: 0, orderCount: 0, openOrderCount: 0, leadCount: 0, newLeadCount: 0, menuEventCount: 0, activeSubscriptionCount: 0, trialSubscriptionCount: 0 });
const emptyLeads = (): AdminDashboard => ({ total: 0, newCount: 0, contactedCount: 0, qualifiedCount: 0, convertedCount: 0, lostCount: 0, leads: [] });
function fmt(v: string) { try { return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v)); } catch { return v; } }

const NAV: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "الرئيسية", icon: LayoutDashboard },
  { id: "tenants", label: "المطاعم", icon: Store },
  { id: "clients", label: "العملاء والحسابات", icon: Users },
  { id: "branches", label: "الفروع", icon: Building2 },
  { id: "leads", label: "العملاء المحتملون", icon: ClipboardList },
  { id: "projects", label: "المشاريع", icon: Wrench },
  { id: "requests", label: "طلبات الخدمات", icon: ClipboardList },
  { id: "subscriptions", label: "الاشتراكات", icon: Wallet },
  { id: "analytics", label: "تحليلات المنصة", icon: BarChart3 },
  { id: "activity", label: "سجل النشاط", icon: Activity },
  { id: "system", label: "النظام والأمان", icon: ShieldCheck },
];

function PlatformAdminPage() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [tab, setTab] = useState<Tab>("overview");
  const [platform, setPlatform] = useState<PlatformDashboard>(emptyPlatform);
  const [leads, setLeads] = useState<AdminDashboard>(emptyLeads);
  const [leadStatus, setLeadStatus] = useState<LeadStatus | "all">("all");
  const [leadQuery, setLeadQuery] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const filteredTenants = useMemo(() => filterRows(platform.tenants, query, (t) => [t.nameAr, t.nameEn, t.slug, t.city, t.ownerName, t.ownerEmail]), [platform.tenants, query]);
  const filteredBranches = useMemo(() => filterRows(platform.branches, query, (b) => [b.tenantName, b.nameAr, b.nameEn, b.city, b.phone]), [platform.branches, query]);
  const filteredMembers = useMemo(() => filterRows(platform.members, query, (m) => [m.tenantName, m.name, m.email, m.role]), [platform.members, query]);
  const filteredProjects = useMemo(() => filterRows(platform.projects, query, (p) => [p.businessName, p.city, p.contactName, p.contactPhone, p.status]), [platform.projects, query]);
  const filteredRequests = useMemo(() => filterRows(platform.serviceRequests, query, (r) => [r.businessName, r.city, r.contactName, r.contactPhone, r.serviceType, r.status]), [platform.serviceRequests, query]);

  async function load() {
    setLoading(true); setError("");
    try {
      const [p, l] = await Promise.all([
        getPlatformDashboard(),
        getAdminDashboard({ data: { status: leadStatus === "all" ? undefined : leadStatus, q: leadQuery.trim() || undefined } }),
      ]);
      if (!p.ok) setError(p.error); else setPlatform(p.data);
      if (!l.ok) setError((current) => current || l.error); else setLeads(l.data);
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر تحميل مركز تحكم المنصة"); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (isPending) return;
    if (!user) { void navigate({ to: "/login", search: { redirect: "/admin" } as never, replace: true }); return; }
    void load();
  }, [isPending, user]);

  useEffect(() => {
    if (isPending || !user) return;
    const timer = window.setTimeout(() => void load(), 250);
    return () => window.clearTimeout(timer);
  }, [leadStatus, leadQuery]);

  async function toggle(t: PlatformTenant) {
    setSaving(t.id);
    const r = await updatePlatformTenantStatus({ data: { tenantId: t.id, isActive: !t.isActive } });
    if (!r.ok) setError(r.error);
    else setPlatform((current) => ({ ...current, activeTenantCount: current.activeTenantCount + (r.data.isActive ? 1 : -1), tenants: current.tenants.map((x) => x.id === t.id ? { ...x, isActive: r.data.isActive } : x) }));
    setSaving(null);
  }

  if (isPending || !user) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">جار التحقق من صلاحيات مالك المنصة...</div>;
  const activeNav = NAV.find((item) => item.id === tab);
  return <main className="mx-auto grid max-w-[1500px] gap-5 py-4 lg:py-8">
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div><div className="mb-2 inline-flex items-center gap-2 rounded-full border border-line bg-sand/50 px-3 py-1 text-xs text-muted"><ShieldCheck className="size-3.5" /> Platform Owner Control Center</div><h1 className="font-display text-3xl font-semibold sm:text-4xl">مركز تحكم Menu V3</h1><p className="mt-2 max-w-4xl text-sm leading-6 text-ink-soft">إدارة المنصة بالكامل من مساحة مستقلة عن تشغيل المطاعم: العملاء، المطاعم، الفروع، المشاريع، الخدمات، العملاء المحتملون، الاشتراكات، التحليلات، النشاط، والأمان.</p></div>
      <Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={cn("size-4", loading && "animate-spin")} /> تحديث البيانات</Button>
    </header>

    <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
      <aside className="h-fit rounded-2xl border border-line bg-paper p-2 lg:sticky lg:top-4"><p className="px-3 py-3 text-xs font-semibold text-muted">إدارة المنصة</p><nav className="grid gap-1">{NAV.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => { setTab(item.id); setQuery(""); }} className={cn("flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm text-start", tab === item.id ? "bg-ink text-paper" : "text-ink-soft hover:bg-sand/50")}><Icon className="size-4 shrink-0" />{item.label}</button>; })}</nav></aside>

      <section className="min-w-0 grid gap-4">
        {error ? <div className="rounded-xl border border-line bg-sand/60 px-4 py-3 text-sm">{error}</div> : null}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8"><Metric label="المطاعم" value={platform.tenantCount} /><Metric label="النشطة" value={platform.activeTenantCount} /><Metric label="المنشورة" value={platform.publishedTenantCount} /><Metric label="الفروع" value={platform.branchCount} /><Metric label="الأصناف" value={platform.productCount} /><Metric label="الطلبات" value={platform.orderCount} /><Metric label="المفتوحة" value={platform.openOrderCount} /><Metric label="Leads جديدة" value={platform.newLeadCount} /></div>
        {tab !== "overview" && tab !== "system" && <Toolbar value={query} onChange={setQuery} placeholder={`ابحث في ${activeNav?.label ?? "المحتوى"}`} />}
        {tab === "overview" ? <Overview platform={platform} leads={leads} onTab={setTab} /> : null}
        {tab === "tenants" ? <Tenants rows={filteredTenants} saving={saving} onToggle={toggle} /> : null}
        {tab === "clients" ? <Clients rows={filteredMembers} /> : null}
        {tab === "branches" ? <Branches rows={filteredBranches} /> : null}
        {tab === "leads" ? <Leads leads={leads} status={leadStatus} query={leadQuery} setStatus={setLeadStatus} setQuery={setLeadQuery} /> : null}
        {tab === "projects" ? <Projects rows={filteredProjects} /> : null}
        {tab === "requests" ? <Requests rows={filteredRequests} /> : null}
        {tab === "subscriptions" ? <Subscriptions platform={platform} /> : null}
        {tab === "analytics" ? <Analytics platform={platform} /> : null}
        {tab === "activity" ? <ActivityView rows={platform.activity} /> : null}
        {tab === "system" ? <SystemView platform={platform} /> : null}
      </section>
    </div>
  </main>;
}

function filterRows<T>(rows: T[], q: string, fields: (row: T) => string[]) { const needle = q.trim().toLowerCase(); return needle ? rows.filter((row) => fields(row).some((value) => value.toLowerCase().includes(needle))) : rows; }
function Toolbar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) { return <label className="relative block rounded-2xl border border-line bg-paper p-3"><Search className="pointer-events-none absolute start-6 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input className="ps-9" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></label>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="grid gap-1 rounded-2xl border border-line bg-paper p-4"><span className="text-xs text-muted">{label}</span><strong className="text-2xl">{value.toLocaleString("ar-SA")}</strong></div>; }
function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">{text}</div>; }

function Overview({ platform, leads, onTab }: { platform: PlatformDashboard; leads: AdminDashboard; onTab: (tab: Tab) => void }) { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
  <Panel title="المطاعم والعملاء" icon={<Store className="size-5" />} text={`${platform.tenantCount} مطعم · ${platform.activeTenantCount} نشط · ${platform.publishedTenantCount} منشور`} action="إدارة المطاعم" onClick={() => onTab("tenants")} />
  <Panel title="الحسابات والفريق" icon={<Users className="size-5" />} text={`${platform.members.length} عضوية نشطة/مسجلة في البيانات الحالية`} action="عرض الحسابات" onClick={() => onTab("clients")} />
  <Panel title="الفروع" icon={<Building2 className="size-5" />} text={`${platform.branchCount} فرع مرتبط بالمطاعم`} action="إدارة الفروع" onClick={() => onTab("branches")} />
  <Panel title="العملاء المحتملون" icon={<ClipboardList className="size-5" />} text={`${leads.newCount} جديد · ${leads.qualifiedCount} مؤهل · ${leads.convertedCount} محوّل`} action="فتح CRM" onClick={() => onTab("leads")} />
  <Panel title="المشاريع وطلبات الخدمات" icon={<Wrench className="size-5" />} text={`${platform.projects.length} مشروع · ${platform.serviceRequests.length} طلب خدمة`} action="إدارة المشاريع" onClick={() => onTab("projects")} />
  <Panel title="الاشتراكات" icon={<Wallet className="size-5" />} text={`${platform.activeSubscriptionCount} نشطة · ${platform.trialSubscriptionCount} تجريبية`} action="عرض الاشتراكات" onClick={() => onTab("subscriptions")} />
  <Panel title="تحليلات المنصة" icon={<BarChart3 className="size-5" />} text={`${platform.analytics.visits} زيارة · ${platform.analytics.productViews} مشاهدة صنف · ${platform.analytics.qrScans} مسح QR`} action="فتح التحليلات" onClick={() => onTab("analytics")} />
  <Panel title="النشاط والأمان" icon={<ShieldCheck className="size-5" />} text={`${platform.activity.length} آخر أحداث الطلبات المتاحة للمراجعة`} action="فتح السجل" onClick={() => onTab("activity")} />
  <Panel title="تشغيل المطعم" icon={<ExternalLink className="size-5" />} text="تشغيل المنيو والطلبات الخاصة بالمطعم يبقى داخل مساحة العميل، وليس مركز المنصة." action="فتح مساحة العميل" onClick={() => window.location.assign("/owner")} />
</div>; }
function Panel({ title, text, action, icon, onClick }: { title: string; text: string; action: string; icon: React.ReactNode; onClick: () => void }) { return <article className="grid gap-4 rounded-2xl border border-line bg-paper p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-sand/60">{icon}</span><h2 className="font-semibold">{title}</h2></div><p className="min-h-12 text-sm leading-6 text-muted">{text}</p><Button variant="outline" onClick={onClick}>{action}</Button></article>; }

function Tenants({ rows, saving, onToggle }: { rows: PlatformTenant[]; saving: string | null; onToggle: (t: PlatformTenant) => Promise<void> }) { return <div className="overflow-x-auto rounded-2xl border border-line bg-paper"><table className="w-full min-w-[1050px] text-sm"><thead className="bg-sand/40 text-xs text-muted"><tr>{["المطعم","المالك","الموقع","الفروع","الأصناف","الطلبات","الأعضاء","الخطة","الحالة","إجراء"].map((x) => <th key={x} className="p-4 text-start">{x}</th>)}</tr></thead><tbody>{rows.map((t) => <tr key={t.id} className="border-t border-line"><td className="p-4"><b>{t.nameAr || t.nameEn}</b><div className="text-xs text-muted">/{t.slug}</div></td><td className="p-4"><div>{t.ownerName || "—"}</div><div className="text-xs text-muted">{t.ownerEmail || t.ownerUserId}</div></td><td className="p-4">{t.city || "—"} · {t.country}</td><td className="p-4">{t.branchCount}</td><td className="p-4">{t.productCount}</td><td className="p-4">{t.orderCount}</td><td className="p-4">{t.memberCount}</td><td className="p-4 uppercase">{t.planCode}</td><td className="p-4">{t.isActive ? "نشط" : "موقوف"}{t.isPublished ? " · منشور" : " · مسودة"}</td><td className="p-4"><div className="flex gap-2"><button type="button" disabled={saving === t.id} onClick={() => void onToggle(t)} className="rounded-md border border-line px-3 py-2 text-xs">{saving === t.id ? "جارٍ..." : t.isActive ? "إيقاف" : "تفعيل"}</button>{t.isPublished ? <a href={`/m/${t.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-line px-3 py-2 text-xs"><ExternalLink className="size-3" />المنيو</a> : null}</div></td></tr>)}{!rows.length ? <tr><td colSpan={10}><Empty text="لا توجد مطاعم مطابقة." /></td></tr> : null}</tbody></table></div>; }

function Clients({ rows }: { rows: PlatformDashboard["members"] }) { return <div className="overflow-x-auto rounded-2xl border border-line bg-paper"><table className="w-full min-w-[850px] text-sm"><thead className="bg-sand/40 text-xs text-muted"><tr>{["العميل/المطعم","الحساب","الدور","تاريخ الإضافة"].map((x) => <th key={x} className="p-4 text-start">{x}</th>)}</tr></thead><tbody>{rows.map((m) => <tr key={`${m.tenantId}-${m.userId}`} className="border-t border-line"><td className="p-4 font-medium">{m.tenantName}</td><td className="p-4"><div>{m.name || "بدون اسم"}</div><div className="text-xs text-muted">{m.email || m.userId}</div></td><td className="p-4">{m.role}</td><td className="p-4">{fmt(m.createdAt)}</td></tr>)}{!rows.length ? <tr><td colSpan={4}><Empty text="لا توجد حسابات." /></td></tr> : null}</tbody></table></div>; }
function Branches({ rows }: { rows: PlatformDashboard["branches"] }) { return <div className="grid gap-3">{rows.map((b) => <article key={b.id} className="rounded-2xl border border-line bg-paper p-4"><div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><b>{b.nameAr || b.nameEn}</b><p className="text-sm text-muted">{b.tenantName} · {b.city || "—"}</p></div><span className="rounded-full bg-sand px-3 py-1 text-xs">{b.isActive ? "نشط" : "موقوف"}</span></div><p className="mt-2 text-xs text-muted">{b.phone || "لا يوجد هاتف"}</p></article>)}{!rows.length ? <Empty text="لا توجد فروع." /> : null}</div>; }

function Leads({ leads, status, query, setStatus, setQuery }: { leads: AdminDashboard; status: LeadStatus | "all"; query: string; setStatus: (v: LeadStatus | "all") => void; setQuery: (v: string) => void }) { return <div className="grid gap-4"><div className="grid gap-3 rounded-2xl border border-line bg-paper p-3 md:grid-cols-[1fr_220px]"><label className="relative"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input className="ps-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث باسم النشاط أو المسؤول أو المدينة" /></label><select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus | "all")} className="h-10 rounded-md border border-line bg-paper px-3 text-sm"><option value="all">كل الحالات</option>{LEAD_STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}</select></div><div className="grid gap-2">{leads.leads.map((l) => <article key={l.id} className="rounded-2xl border border-line bg-paper p-4"><div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><b>{l.businessName}</b><p className="text-sm text-muted">{l.contactName} · {l.city || "—"} · {l.contactPhone}</p></div><span className="rounded-full bg-sand px-2.5 py-1 text-xs">{LABELS[l.status]}</span></div><div className="mt-2 text-xs text-muted">{fmt(l.createdAt)}{l.details ? ` · ${l.details}` : ""}</div></article>)}{!leads.leads.length ? <Empty text="لا توجد نتائج." /> : null}</div></div>; }

function Projects({ rows }: { rows: PlatformDashboard["projects"] }) { return <div className="grid gap-3">{rows.map((p) => <article key={p.id} className="rounded-2xl border border-line bg-paper p-4"><div className="flex flex-col gap-2 md:flex-row md:justify-between"><div><b>{p.businessName || "مشروع بدون اسم"}</b><p className="text-sm text-muted">{p.contactName || "—"} · {p.contactPhone || "—"} · {p.city || "—"}</p></div><Status text={p.status} /></div><p className="mt-2 text-xs text-muted">{fmt(p.createdAt)}</p></article>)}{!rows.length ? <Empty text="لا توجد مشاريع." /> : null}</div>; }
function Requests({ rows }: { rows: PlatformDashboard["serviceRequests"] }) { return <div className="grid gap-3">{rows.map((r) => <article key={r.id} className="rounded-2xl border border-line bg-paper p-4"><div className="flex flex-col gap-2 md:flex-row md:justify-between"><div><b>{r.businessName}</b><p className="text-sm text-muted">{r.serviceType || "خدمة"} · {r.contactName} · {r.contactPhone}</p></div><Status text={r.status} /></div><p className="mt-2 text-xs text-muted">{r.city || "—"} · {fmt(r.createdAt)}</p></article>)}{!rows.length ? <Empty text="لا توجد طلبات خدمات." /> : null}</div>; }
function Status({ text }: { text: string }) { return <span className="rounded-full bg-sand px-3 py-1 text-xs">{text || "—"}</span>; }

function Subscriptions({ platform }: { platform: PlatformDashboard }) { const byPlan = platform.tenants.reduce<Record<string, number>>((acc, t) => { acc[t.planCode] = (acc[t.planCode] ?? 0) + 1; return acc; }, {}); return <div className="grid gap-4 md:grid-cols-3"><Panel title="نشطة" text={`${platform.activeSubscriptionCount} اشتراكًا نشطًا`} action="مراجعة المطاعم" icon={<Wallet className="size-5" />} onClick={() => window.location.assign("/admin")} /><Panel title="تجريبية" text={`${platform.trialSubscriptionCount} اشتراكًا تجريبيًا`} action="مراجعة الخطط" icon={<Wallet className="size-5" />} onClick={() => undefined} /><article className="rounded-2xl border border-line bg-paper p-5"><h2 className="font-semibold">توزيع الخطط</h2><div className="mt-4 grid gap-2">{Object.entries(byPlan).map(([plan, count]) => <div key={plan} className="flex justify-between rounded-xl border border-line px-3 py-2 text-sm"><span>{plan}</span><b>{count}</b></div>)}{!Object.keys(byPlan).length ? <p className="text-sm text-muted">لا توجد بيانات خطط.</p> : null}</div></article></div>; }
function Analytics({ platform }: { platform: PlatformDashboard }) { const a = platform.analytics; return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Metric label="زيارات المنيو" value={a.visits} /><Metric label="مشاهدات الأصناف" value={a.productViews} /><Metric label="مسح QR" value={a.qrScans} /><Metric label="نقرات WhatsApp" value={a.whatsappClicks} /><Metric label="كل الطلبات" value={a.orders} /><Metric label="الطلبات المكتملة" value={a.completedOrders} /></div>; }
function ActivityView({ rows }: { rows: PlatformDashboard["activity"] }) { return <div className="grid gap-2">{rows.map((e) => <article key={e.id} className="rounded-2xl border border-line bg-paper p-4"><div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between"><div><b>{e.tenantName}</b><p className="text-sm text-muted">طلب #{e.orderNumber} · {e.fromStatus || "—"} → {e.toStatus}</p></div><span className="text-xs text-muted">{fmt(e.createdAt)}</span></div><p className="mt-2 text-xs text-muted">Actor: {e.actorUserId || "system"}</p></article>)}{!rows.length ? <Empty text="لا توجد أحداث نشاط بعد." /> : null}</div>; }
function SystemView({ platform }: { platform: PlatformDashboard }) { return <div className="grid gap-4 md:grid-cols-2"><article className="rounded-2xl border border-line bg-paper p-5"><div className="flex items-center gap-3"><ShieldCheck className="size-5" /><h2 className="font-semibold">حالة الأمان</h2></div><ul className="mt-4 grid gap-3 text-sm text-muted"><li>✓ صلاحية مركز المنصة تتحقق خادميًا.</li><li>✓ بيانات المطاعم معزولة في schema `menu_v3`.</li><li>✓ الطلبات مرتبطة بالمطعم والفرع.</li><li>✓ سجل تغييرات حالات الطلبات محفوظ.</li></ul></article><article className="rounded-2xl border border-line bg-paper p-5"><div className="flex items-center gap-3"><Settings className="size-5" /><h2 className="font-semibold">مؤشرات التشغيل</h2></div><div className="mt-4 grid gap-2 text-sm"><Row label="أحداث المنيو" value={String(platform.menuEventCount)} /><Row label="المطاعم" value={String(platform.tenantCount)} /><Row label="الفروع" value={String(platform.branchCount)} /><Row label="الأصناف" value={String(platform.productCount)} /><Row label="الطلبات المفتوحة" value={String(platform.openOrderCount)} /></div></article></div>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between rounded-xl border border-line px-3 py-2"><span className="text-muted">{label}</span><b>{value}</b></div>; }
