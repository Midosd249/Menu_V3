import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, ExternalLink, Mail, MessageCircle, Phone, RefreshCw, Search, ShieldCheck, UserCheck, XCircle, Link2 } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LangToggle } from "@/components/lang-toggle";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLang } from "@/lib/lang";
import { getPlatformCustomerRequests, updatePlatformCustomerRequest, type PlatformCustomerRequest } from "@/lib/menu/platform-customers";
import { getAdminDashboard, updateLead, type AdminLead } from "@/lib/menu/admin";
import { approveLead } from "@/lib/menu/platform-onboarding";

export const Route = createFileRoute("/admin/onboarding")({ component: AdminOnboardingPage });

type QueueRow =
  | (PlatformCustomerRequest & { source: "account" })
  | { source: "lead"; id: string; tenantId: string; ownerUserId: string; businessName: string; businessNameEn: string; city: string; phone: string; email: string; status: "pending" | "approved" | "rejected"; submittedAt: string; reviewedAt: string | null; adminNotes: string; menuUrl: string; isPublished: boolean; isActive: boolean; leadId: string; contactName: string; leadStatus: AdminLead["status"]; registrationUrl: string | null };

type Status = QueueRow["status"] | "all";
const labels = {
  ar: { pending: "بانتظار الاعتماد", approved: "معتمد", rejected: "مرفوض", all: "كل العملاء", title: "طلبات العملاء الجدد", subtitle: "مركز واحد لطلبات المطاعم الجديدة، سواء جاءت من نموذج الموقع أو من حساب تم إنشاؤه بالفعل. راجع، تواصل، اعتمد، ثم سلّم رابط التسجيل عند الحاجة.", refresh: "تحديث", search: "ابحث باسم المطعم، المدينة، الجوال أو البريد", empty: "لا توجد طلبات عملاء مطابقة.", details: "تفاصيل العميل", business: "المطعم", city: "المدينة", phone: "الجوال", email: "البريد", submitted: "تاريخ الطلب", status: "الحالة", notes: "ملاحظات الإدارة", notesPlaceholder: "أضف ملاحظة داخلية…", approve: "اعتماد وإنشاء رابط", reject: "رفض الطلب", approved: "تم اعتماد العميل", rejected: "تم رفض الطلب", menu: "فتح المنيو", copy: "نسخ الرابط", copied: "تم النسخ", call: "اتصال", whatsapp: "WhatsApp", emailAction: "بريد", overview: "إجمالي", pendingCount: "بانتظار الاعتماد", approvedCount: "معتمد", rejectedCount: "مرفوض", active: "الحساب نشط", published: "المنيو منشور", draft: "المنيو غير منشور", registration: "رابط التسجيل", copyRegistration: "نسخ رابط التسجيل", lead: "طلب من الموقع", account: "حساب مطعم" },
  en: { pending: "Pending approval", approved: "Approved", rejected: "Rejected", all: "All customers", title: "New Customer Requests", subtitle: "One workspace for new restaurant requests, whether they came from the website form or an already-created account. Review, contact, approve, and hand off registration when needed.", refresh: "Refresh", search: "Search restaurant, city, phone, or email", empty: "No matching customer requests.", details: "Customer details", business: "Restaurant", city: "City", phone: "Phone", email: "Email", submitted: "Submitted", status: "Status", notes: "Admin notes", notesPlaceholder: "Add an internal note…", approve: "Approve & create link", reject: "Reject request", approved: "Customer approved", rejected: "Request rejected", menu: "Open menu", copy: "Copy link", copied: "Copied", call: "Call", whatsapp: "WhatsApp", emailAction: "Email", overview: "Total", pendingCount: "Pending", approvedCount: "Approved", rejectedCount: "Rejected", active: "Account active", published: "Menu published", draft: "Menu not published", registration: "Registration link", copyRegistration: "Copy registration link", lead: "Website request", account: "Restaurant account" },
} as const;

function mapLead(lead: AdminLead): QueueRow {
  const status = lead.status === "converted" ? "approved" : lead.status === "lost" ? "rejected" : "pending";
  return { source: "lead", id: `lead:${lead.id}`, leadId: lead.id, tenantId: "", ownerUserId: "", businessName: lead.businessName, businessNameEn: "", city: lead.city, phone: lead.contactPhone, email: lead.contactEmail, status, submittedAt: lead.createdAt, reviewedAt: null, adminNotes: lead.notes, menuUrl: "", isPublished: false, isActive: false, contactName: lead.contactName, leadStatus: lead.status, registrationUrl: null };
}

function AdminOnboardingPage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const copy = labels[lang];
  const { user, isPending } = useCurrentUserState();
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("all");
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!user) return;
    setLoading(true); setError("");
    try {
      const [accounts, leads] = await Promise.all([
        getPlatformCustomerRequests({ data: { status: status === "all" ? undefined : status, q: query.trim() || undefined } }),
        getAdminDashboard({ data: { q: query.trim() || undefined } }),
      ]);
      if (!accounts.ok) { setError(accounts.error); return; }
      if (!leads.ok) { setError(leads.error); return; }
      const accountRows = accounts.data.map((row) => ({ ...row, source: "account" as const }));
      const merged = [...accountRows, ...leads.data.leads.map(mapLead)]
        .filter((row) => status === "all" || row.status === status)
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setRows(merged);
      setSelectedId((current) => current && merged.some((row) => row.id === current) ? current : merged[0]?.id ?? null);
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر تحميل طلبات العملاء"); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isPending) return; if (!user) { void navigate({ to: "/login", search: { redirect: "/admin/onboarding" } as never, replace: true }); return; } void load(); }, [isPending, user]);
  useEffect(() => { if (!isPending && user) { const timer = window.setTimeout(() => void load(), 250); return () => window.clearTimeout(timer); } }, [status, query]);

  const selected = useMemo(() => rows.find((row) => row.id === selectedId) ?? null, [rows, selectedId]);
  const counts = useMemo(() => ({ pending: rows.filter((r) => r.status === "pending").length, approved: rows.filter((r) => r.status === "approved").length, rejected: rows.filter((r) => r.status === "rejected").length }), [rows]);
  useEffect(() => { setNotes(selected?.adminNotes ?? ""); setCopied(false); }, [selected?.id]);

  async function approveSelected() {
    if (!selected || saving) return;
    setSaving(true); setError("");
    try {
      if (selected.source === "lead") {
        const result = await approveLead({ data: { leadId: selected.leadId } });
        if (!result.ok) { setError(result.error); return; }
        setRows((current) => current.map((row) => row.id === selected.id ? { ...row, status: "approved", registrationUrl: result.data.registrationUrl, adminNotes: notes } : row));
      } else {
        const result = await updatePlatformCustomerRequest({ data: { id: selected.id, status: "approved", adminNotes: notes } });
        if (!result.ok) { setError(result.error); return; }
        setRows((current) => current.map((row) => row.id === result.data.id ? { ...result.data, source: "account" } : row));
      }
    } finally { setSaving(false); }
  }

  async function rejectSelected() {
    if (!selected || saving) return;
    setSaving(true); setError("");
    try {
      if (selected.source === "lead") {
        const result = await updateLead({ data: { id: selected.leadId, status: "lost", notes } });
        if (!result.ok) { setError(result.error); return; }
      } else {
        const result = await updatePlatformCustomerRequest({ data: { id: selected.id, status: "rejected", adminNotes: notes } });
        if (!result.ok) { setError(result.error); return; }
      }
      setRows((current) => current.map((row) => row.id === selected.id ? { ...row, status: "rejected", adminNotes: notes } : row));
    } finally { setSaving(false); }
  }

  async function copyValue(value: string) { if (!value) return; await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const menuLink = selected?.menuUrl ? `${origin}${selected.menuUrl}` : "";
  const registrationLink = selected?.source === "lead" && selected.registrationUrl ? `${origin}${selected.registrationUrl}` : "";

  if (isPending || !user) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">{lang === "ar" ? "جارٍ التحقق من صلاحيات مالك المنصة…" : "Checking platform-owner access…"}</div>;

  return <main className="mx-auto grid max-w-[1500px] gap-5 py-4 lg:py-8" dir={lang === "ar" ? "rtl" : "ltr"}>
    <header className="rounded-3xl border border-line bg-paper p-5 md:p-7"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/50 px-3 py-1 text-xs text-muted"><ShieldCheck className="size-3.5" /> Menu V3 · Platform Owner</div><h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">{copy.title}</h1><p className="mt-2 max-w-4xl text-sm leading-6 text-muted">{copy.subtitle}</p></div><div className="flex flex-wrap items-center gap-2"><LangToggle /><Button variant="outline" onClick={() => void navigate({ to: "/admin" })}>{lang === "ar" ? "لوحة المنصة" : "Platform admin"}</Button><Button variant="outline" disabled={loading} onClick={() => void load()}><RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />{copy.refresh}</Button></div></div></header>
    <section className="grid grid-cols-3 gap-3 md:grid-cols-4"><Metric label={copy.pendingCount} value={counts.pending} active={status === "pending"} onClick={() => setStatus("pending")} /><Metric label={copy.approvedCount} value={counts.approved} active={status === "approved"} onClick={() => setStatus("approved")} /><Metric label={copy.rejectedCount} value={counts.rejected} active={status === "rejected"} onClick={() => setStatus("rejected")} /><Metric label={copy.overview} value={rows.length} active={status === "all"} onClick={() => setStatus("all")} className="hidden md:grid" /></section>
    {error ? <div className="rounded-2xl border border-bad/30 bg-bad/5 px-4 py-3 text-sm text-bad" role="alert">{error}</div> : null}
    <section className="grid min-h-[620px] gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
      <div className="grid content-start gap-3 rounded-3xl border border-line bg-sand/20 p-3"><div className="grid gap-2 md:grid-cols-[1fr_180px]"><label className="relative"><Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input className="ps-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={copy.search} /></label><select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="h-10 rounded-md border border-line bg-paper px-3 text-sm"><option value="all">{copy.all}</option><option value="pending">{copy.pending}</option><option value="approved">{copy.approved}</option><option value="rejected">{copy.rejected}</option></select></div><div className="grid gap-2">{rows.map((row) => <button key={row.id} type="button" onClick={() => setSelectedId(row.id)} className={`grid gap-3 rounded-2xl border p-4 text-start transition ${selectedId === row.id ? "border-ink bg-paper shadow-sm" : "border-line bg-paper/70 hover:bg-paper"}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><strong className="block truncate">{row.businessName}</strong><span className="mt-1 block text-xs text-muted">{row.city || "—"} · {row.email || row.phone || "—"}</span></div><div className="flex shrink-0 items-center gap-1.5"><span className="rounded-full bg-sand px-2.5 py-1 text-xs">{row.source === "lead" ? copy.lead : copy.account}</span><StatusPill status={row.status} lang={lang} /></div></div><div className="flex flex-wrap gap-2 text-xs text-muted"><span>{new Date(row.submittedAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</span>{row.source === "account" && (row.isPublished ? <span>• {copy.published}</span> : <span>• {copy.draft}</span>)}</div></button>)}{!rows.length ? <div className="grid min-h-72 place-items-center p-8 text-center text-sm text-muted">{copy.empty}</div> : null}</div></div>
      {selected ? <aside className="grid content-start gap-5 rounded-3xl border border-line bg-paper p-5 lg:sticky lg:top-5 lg:h-fit"><div className="flex items-start justify-between gap-4"><div><p className="text-xs text-muted">{copy.details}</p><h2 className="mt-1 font-display text-2xl font-semibold">{selected.businessName}</h2><p className="mt-1 text-sm text-muted">{selected.source === "lead" ? selected.contactName : selected.businessNameEn || selected.city || "—"}</p></div><StatusPill status={selected.status} lang={lang} /></div><div className="grid gap-2 rounded-2xl border border-line bg-sand/20 p-4 text-sm"><Info label={copy.business} value={selected.businessName} /><Info label={copy.city} value={selected.city || "—"} /><Info label={copy.phone} value={selected.phone || "—"} dir="ltr" /><Info label={copy.email} value={selected.email || "—"} dir="ltr" /><Info label={copy.submitted} value={new Date(selected.submittedAt).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")} /></div><div className="flex flex-wrap gap-2">{selected.phone ? <a href={`tel:${selected.phone.replace(/[^0-9+]/g, "")}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm"><Phone className="size-4" />{copy.call}</a> : null}{selected.phone ? <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm"><MessageCircle className="size-4" />{copy.whatsapp}</a> : null}{selected.email ? <a href={`mailto:${selected.email}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm"><Mail className="size-4" />{copy.emailAction}</a> : null}</div>{registrationLink ? <div className="grid gap-3 rounded-2xl border border-line bg-sand/20 p-4"><div className="flex items-center gap-2 text-sm font-semibold"><Link2 className="size-4" />{copy.registration}</div><div className="break-all rounded-xl bg-paper p-3 text-xs" dir="ltr">{registrationLink}</div><Button variant="outline" type="button" onClick={() => void copyValue(registrationLink)}><Copy className="size-4" />{copied ? copy.copied : copy.copyRegistration}</Button></div> : null}{menuLink ? <div className="flex flex-wrap gap-2"><a href={menuLink} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm"><ExternalLink className="size-4" />{copy.menu}</a><Button variant="outline" type="button" onClick={() => void copyValue(menuLink)}><Copy className="size-4" />{copied ? copy.copied : copy.copy}</Button></div> : null}<div className="grid gap-3 rounded-2xl border border-line p-4"><div className="flex items-center gap-2 text-sm font-semibold"><UserCheck className="size-4" />{copy.status}</div>{selected.source === "account" ? <div className="grid grid-cols-2 gap-2"><div className="rounded-xl bg-sand/40 p-3"><span className="block text-xs text-muted">{copy.active}</span><strong className="text-sm">{selected.isActive ? "✓" : "—"}</strong></div><div className="rounded-xl bg-sand/40 p-3"><span className="block text-xs text-muted">{selected.isPublished ? copy.published : copy.draft}</span><strong className="text-sm">{selected.isPublished ? "✓" : "—"}</strong></div></div> : <p className="text-xs leading-5 text-muted">{copy.lead}</p>}</div><div className="grid gap-2"><label className="text-sm font-medium">{copy.notes}</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={copy.notesPlaceholder} className="min-h-24 rounded-xl border border-line bg-paper p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-ink/20" /></div>{selected.status === "pending" ? <div className="grid gap-2 sm:grid-cols-2"><Button disabled={saving} onClick={() => void approveSelected()}><CheckCircle2 className="size-4" />{saving ? "…" : copy.approve}</Button><Button variant="outline" disabled={saving} onClick={() => void rejectSelected()}><XCircle className="size-4" />{copy.reject}</Button></div> : <div className="rounded-xl bg-sand/40 p-3 text-sm">{selected.status === "approved" ? copy.approved : copy.rejected}</div>}</aside> : <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-line bg-paper p-8 text-sm text-muted">{copy.empty}</div>}
    </section>
  </main>;
}

function Metric({ label, value, active, onClick, className = "" }: { label: string; value: number; active: boolean; onClick: () => void; className?: string }) { return <button type="button" onClick={onClick} className={`grid gap-1 rounded-2xl border p-4 text-start ${active ? "border-ink bg-ink text-paper" : "border-line bg-paper"} ${className}`}><span className={`text-xs ${active ? "text-paper/70" : "text-muted"}`}>{label}</span><strong className="text-2xl">{value.toLocaleString()}</strong></button>; }
function StatusPill({ status, lang }: { status: QueueRow["status"]; lang: "ar" | "en" }) { const label = status === "pending" ? labels[lang].pending : status === "approved" ? labels[lang].approved : labels[lang].rejected; return <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-xs font-medium">{label}</span>; }
function Info({ label, value, dir }: { label: string; value: string; dir?: "ltr" | "rtl" }) { return <div className="flex justify-between gap-4"><span className="text-muted">{label}</span><span className="max-w-[65%] break-words text-end" dir={dir}>{value}</span></div>; }
