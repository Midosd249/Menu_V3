import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, ExternalLink, Mail, MessageCircle, Phone, RefreshCw, Search, ShieldCheck, UserCheck, XCircle } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LangToggle } from "@/components/lang-toggle";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLang } from "@/lib/lang";
import { getAdminDashboard, LEAD_STATUSES, updateLead, type AdminDashboard, type AdminLead, type LeadStatus } from "@/lib/menu/admin";
import { approveLead, getLeadOnboardingStatus, revokeLeadOnboarding, type LeadOnboardingStatus } from "@/lib/menu/platform-onboarding";

export const Route = createFileRoute("/admin/onboarding")({ component: AdminOnboardingPage });
type Status = LeadStatus | "all";

const labels = {
  ar: {
    title: "طلبات العملاء الجدد",
    subtitle: "مركزك الموحد لمراجعة الطلبات الواردة من الموقع، التواصل مع العميل، اعتماد الطلب، وإنشاء رابط التسجيل الآمن.",
    refresh: "تحديث",
    search: "ابحث باسم المطعم أو المدينة أو الجوال أو البريد",
    all: "كل الطلبات",
    empty: "لا توجد طلبات مطابقة.",
    details: "تفاصيل الطلب",
    business: "المطعم",
    city: "المدينة",
    contact: "جهة الاتصال",
    phone: "الجوال",
    email: "البريد",
    submitted: "تاريخ الطلب",
    status: "الحالة",
    new: "جديد",
    contacted: "تم التواصل",
    qualified: "مؤهل",
    converted: "تم التحويل",
    lost: "مغلق",
    notes: "ملاحظات الإدارة",
    notesPlaceholder: "ملاحظة داخلية…",
    save: "حفظ",
    approve: "اعتماد وإنشاء رابط التسجيل",
    revoke: "إلغاء رابط التسجيل",
    call: "اتصال",
    whatsapp: "WhatsApp",
    emailAction: "بريد",
    copy: "نسخ رابط التسجيل",
    copied: "تم النسخ",
    open: "فتح الرابط",
    onboarding: "التسجيل",
    pendingLink: "يوجد رابط تسجيل نشط. لأسباب أمنية لا يمكن استعادة الرمز السري بعد مغادرة شاشة الإنشاء؛ يمكنك إلغاؤه وإنشاء رابط جديد.",
    noLink: "لم يتم اعتماد هذا الطلب بعد.",
    approved: "تم اعتماد العميل وإنشاء رابط التسجيل.",
    revoked: "تم إلغاء رابط التسجيل.",
  },
  en: {
    title: "New Customer Requests",
    subtitle: "One workspace for reviewing website requests, contacting the customer, approving the request, and creating a secure registration link.",
    refresh: "Refresh",
    search: "Search restaurant, city, phone, or email",
    all: "All requests",
    empty: "No matching requests.",
    details: "Request details",
    business: "Restaurant",
    city: "City",
    contact: "Contact",
    phone: "Phone",
    email: "Email",
    submitted: "Submitted",
    status: "Status",
    new: "New",
    contacted: "Contacted",
    qualified: "Qualified",
    converted: "Converted",
    lost: "Closed",
    notes: "Admin notes",
    notesPlaceholder: "Internal note…",
    save: "Save",
    approve: "Approve & create registration link",
    revoke: "Revoke registration link",
    call: "Call",
    whatsapp: "WhatsApp",
    emailAction: "Email",
    copy: "Copy registration link",
    copied: "Copied",
    open: "Open link",
    onboarding: "Registration",
    pendingLink: "An active registration link exists. For security, the secret token cannot be recovered after leaving the creation screen; revoke it to create a new link.",
    noLink: "This request has not been approved yet.",
    approved: "Customer approved and registration link created.",
    revoked: "Registration link revoked.",
  },
} as const;

function AdminOnboardingPage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const copy = labels[lang];
  const { user, isPending } = useCurrentUserState();
  const [data, setData] = useState<AdminDashboard>({ total: 0, newCount: 0, contactedCount: 0, qualifiedCount: 0, convertedCount: 0, lostCount: 0, leads: [] });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("all");
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [onboarding, setOnboarding] = useState<LeadOnboardingStatus | null>(null);
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const result = await getAdminDashboard({ data: { status: status === "all" ? undefined : status, q: query.trim() || undefined } });
      if (!result.ok) setError(result.error);
      else {
        setData(result.data);
        setSelectedId((current) => current && result.data.leads.some((lead) => lead.id === current) ? current : result.data.leads[0]?.id ?? null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      void navigate({ to: "/login", search: { redirect: "/admin/onboarding" } as never, replace: true });
      return;
    }
    void load();
  }, [isPending, user]);

  useEffect(() => {
    if (!isPending && user) {
      const timer = window.setTimeout(() => void load(), 250);
      return () => window.clearTimeout(timer);
    }
  }, [status, query]);

  const selected = useMemo(() => data.leads.find((lead) => lead.id === selectedId) ?? null, [data.leads, selectedId]);

  useEffect(() => {
    setNotes(selected?.notes ?? "");
    setOnboarding(null);
    setRegistrationUrl("");
    setCopied(false);
    if (selected && user) {
      void getLeadOnboardingStatus({ data: { leadId: selected.id } }).then((result) => {
        if (result.ok) setOnboarding(result.data);
      }).catch(() => undefined);
    }
  }, [selected?.id, user]);

  async function save(nextStatus = selected?.status) {
    if (!selected || saving || !nextStatus) return;
    setSaving(true);
    setError("");
    try {
      const result = await updateLead({ data: { id: selected.id, status: nextStatus, notes } });
      if (!result.ok) setError(result.error);
      else setData((current) => ({ ...current, leads: current.leads.map((lead) => lead.id === result.data.id ? result.data : lead) }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ الطلب");
    } finally {
      setSaving(false);
    }
  }

  async function approve() {
    if (!selected || saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await approveLead({ data: { leadId: selected.id } });
      if (!result.ok) setError(result.error);
      else {
        setRegistrationUrl(result.data.registrationUrl);
        setOnboarding(result.data);
        setData((current) => ({ ...current, leads: current.leads.map((lead) => lead.id === selected.id ? { ...lead, status: "qualified", updatedAt: new Date().toISOString() } : lead) }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر اعتماد العميل");
    } finally {
      setSaving(false);
    }
  }

  async function revoke() {
    if (!selected || saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await revokeLeadOnboarding({ data: { leadId: selected.id } });
      if (!result.ok) setError(result.error);
      else {
        setOnboarding(result.data);
        setRegistrationUrl("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إلغاء الرابط");
    } finally {
      setSaving(false);
    }
  }

  async function copyRegistrationUrl() {
    if (!registrationUrl) return;
    await navigator.clipboard.writeText(`${window.location.origin}${registrationUrl}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (isPending || !user) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">{lang === "ar" ? "جارٍ التحقق من صلاحيات مالك المنصة…" : "Checking platform-owner access…"}</div>;

  return <main className="mx-auto grid max-w-[1500px] gap-5 py-4 lg:py-8" dir={lang === "ar" ? "rtl" : "ltr"}>
    <header className="rounded-3xl border border-line bg-paper p-5 md:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/50 px-3 py-1 text-xs text-muted"><ShieldCheck className="size-3.5" /> Menu V3 · Platform Owner</div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">{copy.title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">{copy.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2"><LangToggle /><Button variant="outline" onClick={() => void navigate({ to: "/admin" })}>لوحة المنصة</Button><Button variant="outline" disabled={loading} onClick={() => void load()}><RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />{copy.refresh}</Button></div>
      </div>
    </header>

    <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <Metric label={copy.all} value={data.total} active={status === "all"} onClick={() => setStatus("all")} />
      <Metric label={copy.new} value={data.newCount} active={status === "new"} onClick={() => setStatus("new")} />
      <Metric label={copy.contacted} value={data.contactedCount} active={status === "contacted"} onClick={() => setStatus("contacted")} />
      <Metric label={copy.qualified} value={data.qualifiedCount} active={status === "qualified"} onClick={() => setStatus("qualified")} />
      <Metric label={copy.converted} value={data.convertedCount} active={status === "converted"} onClick={() => setStatus("converted")} />
    </section>

    {error ? <div className="rounded-2xl border border-bad/30 bg-bad/5 px-4 py-3 text-sm text-bad" role="alert">{error}</div> : null}

    <section className="grid min-h-[620px] gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
      <div className="grid content-start gap-3 rounded-3xl border border-line bg-sand/20 p-3">
        <div className="grid gap-2 md:grid-cols-[1fr_180px]"><label className="relative"><Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input className="ps-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={copy.search} /></label><select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="h-10 rounded-md border border-line bg-paper px-3 text-sm"><option value="all">{copy.all}</option>{LEAD_STATUSES.map((value) => <option key={value} value={value}>{copy[value]}</option>)}</select></div>
        <div className="grid gap-2">
          {data.leads.map((lead) => <button key={lead.id} type="button" onClick={() => setSelectedId(lead.id)} className={`grid gap-3 rounded-2xl border p-4 text-start transition ${selectedId === lead.id ? "border-ink bg-paper shadow-sm" : "border-line bg-paper/70 hover:bg-paper"}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><strong className="block truncate">{lead.businessName}</strong><span className="mt-1 block text-xs text-muted">{lead.city || "—"} · {lead.contactPhone || lead.contactEmail || "—"}</span></div><StatusPill status={lead.status} lang={lang} /></div><div className="flex flex-wrap gap-2 text-xs text-muted"><span>{new Date(lead.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</span><span>• {lead.source}</span></div></button>)}
          {!data.leads.length ? <div className="grid min-h-72 place-items-center p-8 text-center text-sm text-muted">{copy.empty}</div> : null}
        </div>
      </div>

      {selected ? <aside className="grid content-start gap-5 rounded-3xl border border-line bg-paper p-5 lg:sticky lg:top-5 lg:h-fit">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs text-muted">{copy.details}</p><h2 className="mt-1 font-display text-2xl font-semibold">{selected.businessName}</h2><p className="mt-1 text-sm text-muted">{selected.contactName}</p></div><StatusPill status={selected.status} lang={lang} /></div>
        <div className="grid gap-2 rounded-2xl border border-line bg-sand/20 p-4 text-sm"><Info label={copy.business} value={selected.businessName} /><Info label={copy.city} value={selected.city || "—"} /><Info label={copy.contact} value={selected.contactName} /><Info label={copy.phone} value={selected.contactPhone || "—"} dir="ltr" /><Info label={copy.email} value={selected.contactEmail || "—"} dir="ltr" /><Info label={copy.submitted} value={new Date(selected.createdAt).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")} /></div>
        <div className="flex flex-wrap gap-2">{selected.contactPhone ? <a href={`tel:${selected.contactPhone.replace(/[^0-9+]/g, "")}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm"><Phone className="size-4" />{copy.call}</a> : null}{selected.contactPhone ? <a href={`https://wa.me/${selected.contactPhone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm"><MessageCircle className="size-4" />{copy.whatsapp}</a> : null}{selected.contactEmail ? <a href={`mailto:${selected.contactEmail}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm"><Mail className="size-4" />{copy.emailAction}</a> : null}</div>
        <div className="grid gap-3 rounded-2xl border border-line p-4"><div className="flex items-center gap-2 text-sm font-semibold"><UserCheck className="size-4" />{copy.onboarding}</div><p className="text-sm leading-6 text-muted">{onboarding?.status === "pending" && !registrationUrl ? copy.pendingLink : onboarding?.status === "none" ? copy.noLink : onboarding?.status === "revoked" ? copy.revoked : onboarding?.status === "expired" ? copy.revoked : copy.approved}</p>{registrationUrl ? <div className="rounded-xl bg-sand/40 p-3 text-xs break-all" dir="ltr">{window.location.origin}{registrationUrl}</div> : null}<div className="flex flex-wrap gap-2">{registrationUrl ? <><Button type="button" onClick={() => void copyRegistrationUrl()}><Copy className="size-4" />{copied ? copy.copied : copy.copy}</Button><a href={registrationUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm"><ExternalLink className="size-4" />{copy.open}</a></> : null}{onboarding?.status === "pending" && !registrationUrl ? <Button variant="outline" type="button" disabled={saving} onClick={() => void revoke()}><XCircle className="size-4" />{copy.revoke}</Button> : null}</div></div>
        <div className="grid gap-2"><label className="text-sm font-medium">{copy.notes}</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={copy.notesPlaceholder} className="min-h-24 rounded-xl border border-line bg-paper p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-ink/20" /><div className="flex justify-end"><Button variant="outline" disabled={saving} onClick={() => void save()}>{copy.save}</Button></div></div>
        <div className="grid gap-2 sm:grid-cols-2"><Button disabled={saving || selected.status === "converted"} onClick={() => void approve()}><CheckCircle2 className="size-4" />{saving ? "…" : copy.approve}</Button><Button variant="outline" disabled={saving} onClick={() => void save("contacted")}><UserCheck className="size-4" />{copy.contacted}</Button></div>
      </aside> : <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-line bg-paper p-8 text-sm text-muted">{copy.empty}</div>}
    </section>
  </main>;
}

function StatusPill({ status, lang }: { status: LeadStatus; lang: "ar" | "en" }) {
  return <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-xs font-medium">{labels[lang][status]}</span>;
}
function Metric({ label, value, active, onClick }: { label: string; value: number; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`grid gap-1 rounded-2xl border bg-paper p-4 text-start ${active ? "border-ink ring-1 ring-ink/10" : "border-line"}`}><span className="text-xs text-muted">{label}</span><strong className="text-2xl">{value.toLocaleString()}</strong></button>;
}
function Info({ label, value, dir }: { label: string; value: string; dir?: "ltr" | "rtl" }) {
  return <div className="flex items-start justify-between gap-4"><span className="text-muted">{label}</span><span className="max-w-[70%] break-words text-end" dir={dir}>{value}</span></div>;
}
