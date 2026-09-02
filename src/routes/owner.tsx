import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MessageCircle, Phone, RefreshCw, Search, ShoppingBag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getAdminDashboard, LEAD_STATUSES, updateLead, type AdminDashboard, type AdminLead, type LeadStatus } from "@/lib/menu/admin";
import { getOrdersDashboard, ORDER_STATUSES, updateOrderStatus, type AdminOrder, type OrderStatus, type OrdersDashboard } from "@/lib/menu/orders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/owner")({ component: OwnerPage });

const ORDER_LABELS: Record<OrderStatus, string> = {
  new: "جديد", confirmed: "مؤكد", preparing: "قيد التحضير", ready: "جاهز", completed: "مكتمل", cancelled: "ملغى",
};
const LEAD_LABELS: Record<LeadStatus, string> = {
  new: "جديد", contacted: "تم التواصل", qualified: "مؤهل", converted: "تم التحويل", lost: "مغلق",
};

function emptyOrders(): OrdersDashboard { return { total: 0, newCount: 0, activeCount: 0, completedCount: 0, cancelledCount: 0, orders: [] }; }
function emptyLeads(): AdminDashboard { return { total: 0, newCount: 0, contactedCount: 0, qualifiedCount: 0, convertedCount: 0, lostCount: 0, leads: [] }; }
function formatDate(v: string) { try { return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v)); } catch { return v; } }
function cleanPhone(v: string) { return v.replace(/[^\d+]/g, ""); }
function whatsapp(v: string) { const d = cleanPhone(v).replace(/^\+/, ""); return d ? `https://wa.me/${d}` : "#"; }

function OwnerPage() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [tab, setTab] = useState<"orders" | "leads">("orders");
  const [orders, setOrders] = useState<OrdersDashboard>(emptyOrders);
  const [leads, setLeads] = useState<AdminDashboard>(emptyLeads);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "all">("all");
  const [leadStatus, setLeadStatus] = useState<LeadStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [orderResult, leadResult] = await Promise.all([
        getOrdersDashboard({ data: { status: orderStatus === "all" ? undefined : orderStatus, q: query.trim() || undefined } }),
        getAdminDashboard({ data: { status: leadStatus === "all" ? undefined : leadStatus, q: query.trim() || undefined } }),
      ]);
      if (!orderResult.ok) setError(orderResult.error); else { setOrders(orderResult.data); setSelectedOrder((s) => s && orderResult.data.orders.some((o) => o.id === s.id) ? s : orderResult.data.orders[0] ?? null); }
      if (!leadResult.ok) setError((current) => current || leadResult.error); else { setLeads(leadResult.data); setSelectedLead((s) => s && leadResult.data.leads.some((l) => l.id === s.id) ? s : leadResult.data.leads[0] ?? null); }
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر تحميل مركز المالك"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (isPending) return;
    if (!user) { void navigate({ to: "/login", search: { redirect: "/owner" } as never, replace: true }); return; }
    void load();
  }, [isPending, user]);
  useEffect(() => { if (!isPending && user) { const t = window.setTimeout(() => void load(), 220); return () => window.clearTimeout(t); } }, [tab, orderStatus, leadStatus, query]);

  async function changeOrder(id: string, status: OrderStatus) {
    const result = await updateOrderStatus({ data: { id, status } });
    if (!result.ok) { setError(result.error); return; }
    setOrders((d) => ({ ...d, orders: d.orders.map((o) => o.id === id ? result.data : o) }));
    setSelectedOrder(result.data);
  }
  async function changeLead(lead: AdminLead, status: LeadStatus) {
    const result = await updateLead({ data: { id: lead.id, status, notes: lead.notes } });
    if (!result.ok) { setError(result.error); return; }
    setLeads((d) => ({ ...d, leads: d.leads.map((l) => l.id === lead.id ? result.data : l) }));
    setSelectedLead(result.data);
  }

  if (isPending || !user) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">جار التحقق من صلاحيات المالك...</div>;

  return (
    <main className="mx-auto grid max-w-7xl gap-6 py-4 lg:py-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/50 px-3 py-1 text-xs text-muted"><ShoppingBag className="size-3.5" /> Owner Workspace</span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">مركز الطلبات والعملاء المحتملين</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">مساحة تشغيل المالك: تابع الطلبات الفعلية، حدّث حالتها، وأدر العملاء المحتملين من مكان واحد. تحرير المنيو والمنتجات يبقى داخل Studio.</p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={cn("size-4", loading && "animate-spin")} /> تحديث</Button>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Metric label="الطلبات" value={orders.total} active={tab === "orders"} onClick={() => setTab("orders")} icon={<ShoppingBag className="size-4" />} />
        <Metric label="جديدة" value={orders.newCount} active={tab === "orders" && orderStatus === "new"} onClick={() => { setTab("orders"); setOrderStatus(orderStatus === "new" ? "all" : "new"); }} />
        <Metric label="نشطة" value={orders.activeCount} active={tab === "orders" && ["confirmed","preparing","ready"].includes(orderStatus)} onClick={() => setTab("orders")} />
        <Metric label="العملاء المحتملون" value={leads.total} active={tab === "leads"} onClick={() => setTab("leads")} icon={<Users className="size-4" />} />
        <Metric label="عملاء مؤهلون" value={leads.qualifiedCount} active={tab === "leads" && leadStatus === "qualified"} onClick={() => { setTab("leads"); setLeadStatus(leadStatus === "qualified" ? "all" : "qualified"); }} />
      </section>

      <section className="grid gap-3 rounded-2xl border border-line bg-paper p-3 md:grid-cols-[1fr_230px]"><label className="relative"><Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث في الطلبات والعملاء المحتملين" className="ps-9" /></label><select value={tab === "orders" ? orderStatus : leadStatus} onChange={(e) => tab === "orders" ? setOrderStatus(e.target.value as OrderStatus | "all") : setLeadStatus(e.target.value as LeadStatus | "all")} className="h-10 rounded-md border border-line bg-paper px-3 text-sm outline-none"><option value="all">كل الحالات</option>{(tab === "orders" ? ORDER_STATUSES : LEAD_STATUSES).map((s) => <option key={s} value={s}>{tab === "orders" ? ORDER_LABELS[s as OrderStatus] : LEAD_LABELS[s as LeadStatus]}</option>)}</select></section>
      {error ? <div className="rounded-xl border border-line bg-sand/60 px-4 py-3 text-sm">{error}</div> : null}

      {tab === "orders" ? <OrdersView orders={orders.orders} selected={selectedOrder} loading={loading} onSelect={setSelectedOrder} onStatus={changeOrder} /> : <LeadsView leads={leads.leads} selected={selectedLead} loading={loading} onSelect={setSelectedLead} onStatus={changeLead} />}
    </main>
  );
}

function Metric({ label, value, active, onClick, icon }: { label: string; value: number; active?: boolean; onClick?: () => void; icon?: React.ReactNode }) {
  const cls = cn("grid gap-1 rounded-2xl border p-4 text-start", active ? "border-ink bg-ink text-paper" : "border-line bg-paper", onClick && "cursor-pointer hover:bg-sand/50");
  return onClick ? <button type="button" className={cls} onClick={onClick}>{icon ? <span className="flex items-center gap-2 text-xs opacity-70">{icon}{label}</span> : <span className="text-xs opacity-70">{label}</span>}<strong className="text-2xl">{value}</strong></button> : <div className={cls}><span className="text-xs opacity-70">{label}</span><strong className="text-2xl">{value}</strong></div>;
}

function OrdersView({ orders, selected, loading, onSelect, onStatus }: { orders: AdminOrder[]; selected: AdminOrder | null; loading: boolean; onSelect: (o: AdminOrder) => void; onStatus: (id: string, s: OrderStatus) => Promise<void> }) {
  return <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]"><div className="grid gap-2">{loading && !orders.length ? <Empty text="جار تحميل الطلبات..." /> : !orders.length ? <Empty text="لا توجد طلبات بعد. ستظهر هنا عند بدء استقبال الطلبات من المنيو المنشور." /> : orders.map((o) => <button key={o.id} type="button" onClick={() => onSelect(o)} className={cn("grid gap-2 rounded-2xl border p-4 text-start", selected?.id === o.id ? "border-ink bg-sand/40" : "border-line bg-paper hover:bg-sand/30")}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">#{o.orderNumber} · {o.restaurantName}</p><p className="mt-1 text-sm text-muted">{o.branchName} · {o.customerName || "عميل"}</p></div><Status label={ORDER_LABELS[o.status]} /></div><div className="flex justify-between text-xs text-muted"><span>{o.itemCount} عناصر · {o.total.toFixed(2)} {o.currency}</span><span>{formatDate(o.createdAt)}</span></div></button>)}</div><OrderDetail order={selected} onStatus={onStatus} /></section>;
}
function OrderDetail({ order, onStatus }: { order: AdminOrder | null; onStatus: (id: string, s: OrderStatus) => Promise<void> }) {
  if (!order) return <Empty text="اختر طلباً لعرض التفاصيل." />;
  return <aside className="grid content-start gap-5 rounded-2xl border border-line bg-paper p-5 lg:sticky lg:top-5 lg:h-fit"><div><p className="text-xs text-muted">طلب #{order.orderNumber}</p><h2 className="mt-1 text-2xl font-semibold">{order.restaurantName}</h2><p className="mt-1 text-sm text-muted">{order.branchName}</p></div><div className="grid gap-2 text-sm"><p><span className="text-muted">العميل:</span> {order.customerName || "—"}</p><p><span className="text-muted">الجوال:</span> {order.customerPhone || "—"}</p><p><span className="text-muted">الإجمالي:</span> {order.total.toFixed(2)} {order.currency}</p><p><span className="text-muted">المصدر:</span> {order.source}</p><p><span className="text-muted">أُنشئ:</span> {formatDate(order.createdAt)}</p></div>{order.notes ? <div className="rounded-xl bg-sand/50 p-4 text-sm leading-6"><p className="mb-1 text-xs text-muted">ملاحظات</p>{order.notes}</div> : null}<label className="grid gap-2 text-xs font-medium">الحالة<select value={order.status} onChange={(e) => void onStatus(order.id, e.target.value as OrderStatus)} className="h-10 rounded-md border border-line bg-paper px-3 text-sm outline-none">{ORDER_STATUSES.map((s) => <option key={s} value={s}>{ORDER_LABELS[s]}</option>)}</select></label></aside>;
}

function LeadsView({ leads, selected, loading, onSelect, onStatus }: { leads: AdminLead[]; selected: AdminLead | null; loading: boolean; onSelect: (l: AdminLead) => void; onStatus: (l: AdminLead, s: LeadStatus) => Promise<void> }) {
  return <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]"><div className="grid gap-2">{loading && !leads.length ? <Empty text="جار تحميل العملاء المحتملين..." /> : !leads.length ? <Empty text="لا توجد نتائج مطابقة." /> : leads.map((l) => <button key={l.id} type="button" onClick={() => onSelect(l)} className={cn("grid gap-2 rounded-2xl border p-4 text-start", selected?.id === l.id ? "border-ink bg-sand/40" : "border-line bg-paper hover:bg-sand/30")}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{l.businessName}</p><p className="mt-1 text-sm text-muted">{l.contactName}{l.city ? ` · ${l.city}` : ""}</p></div><Status label={LEAD_LABELS[l.status]} /></div><div className="flex justify-between text-xs text-muted"><span>{l.contactPhone}</span><span>{formatDate(l.createdAt)}</span></div></button>)}</div><LeadDetail lead={selected} onStatus={onStatus} /></section>;
}
function LeadDetail({ lead, onStatus }: { lead: AdminLead | null; onStatus: (l: AdminLead, s: LeadStatus) => Promise<void> }) {
  if (!lead) return <Empty text="اختر عميلاً لعرض التفاصيل." />;
  return <aside className="grid content-start gap-5 rounded-2xl border border-line bg-paper p-5 lg:sticky lg:top-5 lg:h-fit"><div><p className="text-xs text-muted">عميل محتمل</p><h2 className="mt-1 text-2xl font-semibold">{lead.businessName}</h2><p className="mt-1 text-sm text-muted">{lead.contactName} · {lead.city || "—"}</p></div><div className="grid grid-cols-2 gap-2"><a href={`tel:${cleanPhone(lead.contactPhone)}`} className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-line text-xs"><Phone className="size-4" /> اتصال</a><a href={whatsapp(lead.contactPhone)} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-line text-xs"><MessageCircle className="size-4" /> واتساب</a></div>{lead.details ? <div className="rounded-xl bg-sand/50 p-4 text-sm leading-6">{lead.details}</div> : null}<label className="grid gap-2 text-xs font-medium">الحالة<select value={lead.status} onChange={(e) => void onStatus(lead, e.target.value as LeadStatus)} className="h-10 rounded-md border border-line bg-paper px-3 text-sm outline-none">{LEAD_STATUSES.map((s) => <option key={s} value={s}>{LEAD_LABELS[s]}</option>)}</select></label></aside>;
}
function Status({ label }: { label: string }) { return <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-[11px]">{label}</span>; }
function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">{text}</div>; }
