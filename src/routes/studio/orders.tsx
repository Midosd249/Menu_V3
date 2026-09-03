import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, PackageCheck, RefreshCw, Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOrdersDashboard, ORDER_STATUSES, updateOrderStatus, type AdminOrder, type OrderStatus, type OrdersDashboard } from "@/lib/menu/orders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/studio/orders")({ component: OrdersPage });

const labels: Record<OrderStatus, string> = { new: "جديد", confirmed: "مؤكد", preparing: "قيد التحضير", ready: "جاهز", completed: "مكتمل", cancelled: "ملغى" };
const empty: OrdersDashboard = { total: 0, newCount: 0, activeCount: 0, completedCount: 0, cancelledCount: 0, orders: [] };

function OrdersPage() {
  const [data, setData] = useState(empty);
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const result = await getOrdersDashboard({ data: { status: status === "all" ? undefined : status, q: query.trim() || undefined } });
      if (!result.ok) setError(result.error);
      else { setData(result.data); setSelected((current) => current && result.data.orders.some((x) => x.id === current.id) ? result.data.orders.find((x) => x.id === current.id) ?? current : result.data.orders[0] ?? null); }
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر تحميل الطلبات"); }
    finally { setLoading(false); }
  }

  useEffect(() => { const timer = window.setTimeout(() => void load(), 180); return () => window.clearTimeout(timer); }, [status, query]);

  async function changeStatus(id: string, next: OrderStatus) {
    const result = await updateOrderStatus({ data: { id, status: next } });
    if (!result.ok) setError(result.error); else { setData((current) => ({ ...current, orders: current.orders.map((x) => x.id === id ? result.data : x) })); setSelected(result.data); }
  }

  return <main className="mx-auto grid max-w-7xl gap-5 py-4 lg:py-8">
    <header className="flex flex-col gap-4 rounded-3xl border border-line bg-paper p-5 md:p-7 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted">Restaurant Operations</p><h1 className="mt-2 font-display text-3xl font-semibold">نافذة الطلبات</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">كل طلبات المنيو الخاصة بنشاطك في مساحة تشغيل واحدة. لا تظهر هنا طلبات أي مطعم آخر.</p></div>
      <Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={cn("size-4", loading && "animate-spin")} /> تحديث</Button>
    </header>
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4"><Kpi icon={<PackageCheck className="size-4" />} label="كل الطلبات" value={data.total} /><Kpi icon={<Clock3 className="size-4" />} label="جديدة" value={data.newCount} /><Kpi icon={<Clock3 className="size-4" />} label="نشطة" value={data.activeCount} /><Kpi icon={<CheckCircle2 className="size-4" />} label="مكتملة" value={data.completedCount} /></section>
    {error ? <div className="rounded-2xl border border-line bg-sand/50 p-4 text-sm">{error}</div> : null}
    <section className="grid gap-4 rounded-3xl border border-line bg-sand/20 p-3 md:p-4 lg:grid-cols-[1.1fr_.9fr]">
      <div className="grid content-start gap-3"><div className="grid gap-2 md:grid-cols-[1fr_190px]"><label className="relative"><Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input className="ps-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="اسم العميل أو الجوال أو رقم الطلب" /></label><select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | "all")} className="h-10 rounded-md border border-line bg-paper px-3 text-sm"><option value="all">كل الحالات</option>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{labels[s]}</option>)}</select></div>{loading && !data.orders.length ? <Empty text="جار تحميل الطلبات…" /> : !data.orders.length ? <Empty text="لا توجد طلبات لهذا النشاط حتى الآن." /> : data.orders.map((order) => <button key={order.id} type="button" onClick={() => setSelected(order)} className={cn("grid gap-2 rounded-2xl border bg-paper p-4 text-start transition", selected?.id === order.id ? "border-ink bg-sand/40" : "border-line hover:bg-sand/40")}><div className="flex items-start justify-between gap-3"><div><strong>#{order.orderNumber} · {order.customerName || "عميل"}</strong><p className="mt-1 text-xs text-muted">{order.branchName} · {order.customerPhone || "بدون جوال"}</p></div><Badge status={order.status} /></div><div className="flex justify-between text-xs text-muted"><span>{order.itemCount} عناصر · {order.total.toFixed(2)} {order.currency}</span><span>{new Date(order.createdAt).toLocaleString("ar-SA")}</span></div></button>)}</div>
      <OrderDetail order={selected} onStatus={changeStatus} />
    </section>
  </main>;
}
function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="rounded-2xl border border-line bg-paper p-4"><span className="flex items-center gap-2 text-xs text-muted">{icon}{label}</span><strong className="mt-1 block text-2xl tabular-nums">{value.toLocaleString("ar-SA")}</strong></div>; }
function Badge({ status }: { status: OrderStatus }) { return <span className="rounded-full bg-sand px-2.5 py-1 text-xs">{labels[status]}</span>; }
function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">{text}</div>; }
function OrderDetail({ order, onStatus }: { order: AdminOrder | null; onStatus: (id: string, status: OrderStatus) => Promise<void> }) { if (!order) return <Empty text="اختر طلبًا لعرض تفاصيله." />; return <aside className="grid content-start gap-5 rounded-2xl border border-line bg-paper p-5 lg:sticky lg:top-5 lg:h-fit"><div><p className="text-xs text-muted">طلب #{order.orderNumber}</p><h2 className="mt-1 text-2xl font-semibold">{order.customerName || "عميل"}</h2><p className="mt-1 text-sm text-muted">{order.branchName}</p></div><div className="grid gap-2 text-sm"><p><span className="text-muted">الجوال:</span> {order.customerPhone || "—"}</p>{order.customerEmail ? <p><span className="text-muted">البريد:</span> {order.customerEmail}</p> : null}<p><span className="text-muted">الإجمالي:</span> {order.total.toFixed(2)} {order.currency}</p></div><div className="grid gap-2">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-3 rounded-xl bg-sand/40 px-3 py-2 text-sm"><span>{item.quantity} × {item.productNameAr}</span><span>{item.lineTotal.toFixed(2)}</span></div>)}</div><div className="grid grid-cols-2 gap-2">{ORDER_STATUSES.filter((s) => s !== "cancelled" || order.status !== "completed").map((next) => <Button key={next} variant={next === order.status ? "default" : "outline"} disabled={next === order.status} onClick={() => void onStatus(order.id, next)}>{next === "cancelled" ? <XCircle className="size-4" /> : null}{labels[next]}</Button>)}</div></aside>; }
