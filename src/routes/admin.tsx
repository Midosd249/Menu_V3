import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getAdminDashboard, LEAD_STATUSES, updateLead, type AdminDashboard, type AdminLead, type LeadStatus } from "@/lib/menu/admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  qualified: "مؤهل",
  converted: "تم التحويل",
  lost: "مغلق / غير مهتم",
};

const STATUS_TONES: Record<LeadStatus, string> = {
  new: "bg-ink text-paper",
  contacted: "bg-sand text-ink",
  qualified: "bg-accent/15 text-ink",
  converted: "bg-ink text-paper",
  lost: "bg-line text-muted",
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function cleanPhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function whatsappHref(phone: string) {
  const digits = cleanPhone(phone).replace(/^\+/, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

function emptyDashboard(): AdminDashboard {
  return { total: 0, newCount: 0, contactedCount: 0, qualifiedCount: 0, convertedCount: 0, lostCount: 0, leads: [] };
}

function AdminPage() {
  const navigate = useNavigate();
  const { user, isPending: authPending } = useCurrentUserState();
  const [dashboard, setDashboard] = useState<AdminDashboard>(emptyDashboard);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const selected = useMemo(() => dashboard.leads.find((lead) => lead.id === selectedId) ?? null, [dashboard.leads, selectedId]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const result = await getAdminDashboard({
        data: {
          status: statusFilter === "all" ? undefined : statusFilter,
          q: query.trim() || undefined,
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDashboard(result.data);
      setSelectedId((current) => current && result.data.leads.some((lead) => lead.id === current) ? current : result.data.leads[0]?.id ?? null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذر الاتصال بلوحة الإدارة");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authPending) return;
    if (!user) {
      void navigate({ to: "/login", search: { redirect: "/admin" } as never, replace: true });
      return;
    }
    void load();
  }, [authPending, user]);

  useEffect(() => {
    if (authPending || !user) return;
    const timer = window.setTimeout(() => void load(), 220);
    return () => window.clearTimeout(timer);
  }, [statusFilter, query]);

  async function saveLead(lead: AdminLead, nextStatus: LeadStatus, notes: string) {
    setSavingId(lead.id);
    setError("");
    try {
      const result = await updateLead({ data: { id: lead.id, status: nextStatus, notes } });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDashboard((current) => ({
        ...current,
        leads: current.leads.map((item) => item.id === lead.id ? result.data : item),
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذر حفظ الطلب");
    } finally {
      setSavingId(null);
    }
  }

  if (authPending || (!user && loading)) {
    return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">جار التحقق من صلاحيات الإدارة...</div>;
  }

  if (error && dashboard.total === 0 && !loading) {
    return (
      <main className="mx-auto grid max-w-6xl gap-6 py-8">
        <div className="rounded-2xl border border-line bg-paper p-8 text-center">
          <ShieldCheck className="mx-auto mb-4 size-8 text-muted" />
          <h1 className="text-xl font-semibold">لا يمكن فتح لوحة الإدارة</h1>
          <p className="mt-2 text-sm text-muted">{error}</p>
          <Button className="mt-5" onClick={() => void load()}><RefreshCw className="size-4" />إعادة المحاولة</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 py-2 lg:py-8">
      <header className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-line bg-sand/50 px-3 py-1 text-xs text-muted">
            <ShieldCheck className="size-3.5" /> إدارة المنصة
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">مركز الطلبات والعملاء المحتملين</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">كل طلب يرسله صاحب مطعم من الموقع يظهر هنا. تابع الحالة، تواصل مباشرة، وسجل ملاحظاتك حتى يتحول الطلب من استفسار إلى عميل فعلي.</p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={cn("size-4", loading && "animate-spin")} /> تحديث
        </Button>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Metric label="كل الطلبات" value={dashboard.total} />
        <Metric label="جديد" value={dashboard.newCount} active={statusFilter === "new"} onClick={() => setStatusFilter(statusFilter === "new" ? "all" : "new")} />
        <Metric label="تم التواصل" value={dashboard.contactedCount} active={statusFilter === "contacted"} onClick={() => setStatusFilter(statusFilter === "contacted" ? "all" : "contacted")} />
        <Metric label="مؤهل" value={dashboard.qualifiedCount} active={statusFilter === "qualified"} onClick={() => setStatusFilter(statusFilter === "qualified" ? "all" : "qualified")} />
        <Metric label="تم التحويل" value={dashboard.convertedCount} active={statusFilter === "converted"} onClick={() => setStatusFilter(statusFilter === "converted" ? "all" : "converted")} />
        <Metric label="مغلق" value={dashboard.lostCount} active={statusFilter === "lost"} onClick={() => setStatusFilter(statusFilter === "lost" ? "all" : "lost")} />
      </section>

      <section className="grid gap-3 rounded-2xl border border-line bg-paper p-3 md:grid-cols-[1fr_220px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث باسم المطعم، المسؤول، المدينة، الجوال أو البريد" className="ps-9" />
        </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")} className="h-10 rounded-md border border-line bg-paper px-3 text-sm outline-none">
          <option value="all">كل الحالات</option>
          {LEAD_STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
        </select>
      </section>

      {error ? <div className="rounded-xl border border-line bg-sand/60 px-4 py-3 text-sm text-ink">{error}</div> : null}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
        <div className="grid gap-2">
          {loading && dashboard.leads.length === 0 ? (
            <div className="rounded-2xl border border-line p-10 text-center text-sm text-muted">جار تحميل الطلبات...</div>
          ) : dashboard.leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">لا توجد طلبات تطابق البحث الحالي.</div>
          ) : dashboard.leads.map((lead) => (
            <button key={lead.id} type="button" onClick={() => setSelectedId(lead.id)} className={cn("grid w-full gap-3 rounded-2xl border p-4 text-start transition", selectedId === lead.id ? "border-ink bg-sand/40" : "border-line bg-paper hover:bg-sand/30")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{lead.businessName}</p>
                  <p className="mt-1 text-sm text-muted">{lead.contactName}{lead.city ? ` · ${lead.city}` : ""}</p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px]", STATUS_TONES[lead.status])}>{STATUS_LABELS[lead.status]}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span>{lead.contactPhone}</span>
                <span>{formatDate(lead.createdAt)}</span>
              </div>
            </button>
          ))}
        </div>

        <LeadDetail lead={selected} saving={selected ? savingId === selected.id : false} onSave={saveLead} />
      </section>
    </main>
  );
}

function Metric({ label, value, active, onClick }: { label: string; value: number; active?: boolean; onClick?: () => void }) {
  const className = cn("grid gap-1 rounded-2xl border p-4 text-start", active ? "border-ink bg-ink text-paper" : "border-line bg-paper", onClick && "cursor-pointer hover:bg-sand/50");
  if (!onClick) return <div className={className}><span className="text-xs opacity-70">{label}</span><strong className="text-2xl">{value}</strong></div>;
  return <button type="button" onClick={onClick} className={className}><span className="text-xs opacity-70">{label}</span><strong className="text-2xl">{value}</strong></button>;
}

function LeadDetail({ lead, saving, onSave }: { lead: AdminLead | null; saving: boolean; onSave: (lead: AdminLead, status: LeadStatus, notes: string) => Promise<void> }) {
  const [status, setStatus] = useState<LeadStatus>(lead?.status ?? "new");
  const [notes, setNotes] = useState(lead?.notes ?? "");

  useEffect(() => {
    setStatus(lead?.status ?? "new");
    setNotes(lead?.notes ?? "");
  }, [lead?.id, lead?.status, lead?.notes]);

  if (!lead) return <aside className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">اختر طلباً لعرض التفاصيل وإدارته.</aside>;

  return (
    <aside className="grid content-start gap-5 rounded-2xl border border-line bg-paper p-5 lg:sticky lg:top-5 lg:h-fit">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted">طلب رقم {lead.id.slice(0, 8)}</p>
            <h2 className="mt-1 text-2xl font-semibold">{lead.businessName}</h2>
          </div>
          <span className={cn("rounded-full px-2.5 py-1 text-[11px]", STATUS_TONES[status])}>{STATUS_LABELS[status]}</span>
        </div>
        <p className="mt-2 text-sm text-muted">أُرسل {formatDate(lead.createdAt)}</p>
      </div>

      <div className="grid gap-2 text-sm">
        <Info label="المسؤول" value={lead.contactName} />
        <Info label="المدينة" value={lead.city || "—"} />
        <Info label="الجوال" value={lead.contactPhone} />
        <Info label="البريد" value={lead.contactEmail || "—"} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <a href={`tel:${cleanPhone(lead.contactPhone)}`} className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-line text-xs"><Phone className="size-4" />اتصال</a>
        <a href={whatsappHref(lead.contactPhone)} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-line text-xs"><MessageCircle className="size-4" />واتساب</a>
        {lead.contactEmail ? <a href={`mailto:${lead.contactEmail}`} className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-line text-xs"><Mail className="size-4" />إيميل</a> : <span className="inline-flex h-10 items-center justify-center rounded-md border border-line text-xs text-muted">لا يوجد إيميل</span>}
      </div>

      {lead.details ? <div className="rounded-xl bg-sand/50 p-4 text-sm leading-6"><p className="mb-1 text-xs text-muted">تفاصيل العميل</p>{lead.details}</div> : null}

      <div className="grid gap-2">
        <label className="text-xs font-medium">الحالة</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} className="h-10 rounded-md border border-line bg-paper px-3 text-sm outline-none">
          {LEAD_STATUSES.map((item) => <option key={item} value={item}>{STATUS_LABELS[item]}</option>)}
        </select>
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-medium">ملاحظات داخلية</label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} placeholder="مثال: تم التواصل عبر واتساب، يريد 3 فروع، أرسل التسعيرة..." />
      </div>

      <Button onClick={() => void onSave(lead, status, notes)} disabled={saving}>{saving ? "جار الحفظ..." : "حفظ التحديث"}</Button>
      <p className="text-center text-[11px] text-muted">آخر تحديث: {formatDate(lead.updatedAt)}</p>
    </aside>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 border-b border-line/70 py-2 last:border-0"><span className="text-muted">{label}</span><span className="text-end font-medium">{value}</span></div>;
}
