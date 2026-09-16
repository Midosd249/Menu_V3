import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Mail, MessageCircle, Phone, RefreshCw, ShieldCheck, UserCheck, XCircle } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LangToggle } from "@/components/lang-toggle";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLang } from "@/lib/lang";
import { getAdminActivationRequests, getAdminDashboard, reviewActivationRequest, updateLead, type AdminActivationRequest, type AdminDashboard, type AdminLead, type ActivationStatus, type LeadStatus } from "@/lib/menu/admin";
import { approveLead, getLeadOnboardingStatus, revokeLeadOnboarding, type LeadOnboardingStatus } from "@/lib/menu/platform-onboarding";

export const Route = createFileRoute("/admin/onboarding")({ component: AdminOnboardingPage });

type LegacyStatus = LeadStatus | "all";
const activationLabels = {
  ar: { title: "طلبات تفعيل العملاء", subtitle: "المركز الموحد لمراجعة الحسابات الجديدة واعتماد تفعيل مساحة العمل. التسجيل لا ينشئ مساحة عمل قبل الموافقة.", all: "كل طلبات التفعيل", pending: "قيد المراجعة", action_required: "مطلوب إجراء", approved: "معتمد", activated: "مفعل", rejected: "مرفوض", approve: "اعتماد الطلب", reject: "رفض", changes: "طلب تعديل", refresh: "تحديث", search: "ابحث بالبراند أو الاسم أو الجوال أو البريد", reason: "ملاحظة القرار", reasonPlaceholder: "سبب الرفض أو المعلومات المطلوبة…", legacy: "طلبات النظام القديم", legacyHint: "تظهر هنا الطلبات القديمة التي تستخدم رابط التسجيل الآمن، وتبقى متاحة للتوافق الخلفي." },
  en: { title: "Customer Activation Requests", subtitle: "One review center for new accounts and workspace activation. Signup never creates a workspace before approval.", all: "All activation requests", pending: "Pending", action_required: "Action required", approved: "Approved", activated: "Activated", rejected: "Rejected", approve: "Approve request", reject: "Reject", changes: "Request changes", refresh: "Refresh", search: "Search brand, name, phone, or email", reason: "Decision note", reasonPlaceholder: "Reason for rejection or requested changes…", legacy: "Legacy requests", legacyHint: "Older requests using secure registration links remain available here for backward compatibility." },
} as const;

function AdminOnboardingPage() {
  const { lang } = useLang();
  const copy = activationLabels[lang];
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [requests, setRequests] = useState<AdminActivationRequest[]>([]);
  const [selected, setSelected] = useState<AdminActivationRequest | null>(null);
  const [activationFilter, setActivationFilter] = useState<ActivationStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [reason, setReason] = useState("");
  const [legacy, setLegacy] = useState<AdminDashboard | null>(null);
  const [legacySelected, setLegacySelected] = useState<AdminLead | null>(null);
  const [legacyOnboarding, setLegacyOnboarding] = useState<LeadOnboardingStatus | null>(null);
  const [legacyUrl, setLegacyUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    if (!user) return;
    setLoading(true); setError("");
    try {
      const [activationResult, legacyResult] = await Promise.all([
        getAdminActivationRequests({ data: { status: activationFilter === "all" ? undefined : activationFilter, q: query.trim() || undefined } }),
        getAdminDashboard({ data: { status: undefined, q: undefined } }),
      ]);
      if (!activationResult.ok) throw new Error(activationResult.error);
      if (!legacyResult.ok) throw new Error(legacyResult.error);
      setRequests(activationResult.data);
      setSelected((current) => activationResult.data.find((r) => r.id === current?.id) ?? activationResult.data[0] ?? null);
      setLegacy(legacyResult.data);
      setLegacySelected((current) => legacyResult.data.leads.find((r) => r.id === current?.id) ?? legacyResult.data.leads[0] ?? null);
    } catch (err) { setError(err instanceof Error ? err.message : "تعذر تحميل الطلبات"); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (isPending) return;
    if (!user) { void navigate({ to: "/login", search: { redirect: "/admin/onboarding" } as never, replace: true }); return; }
    void load();
  }, [isPending, user, activationFilter, query]);

  useEffect(() => {
    setReason(selected?.decisionReason ?? "");
  }, [selected?.id]);

  useEffect(() => {
    setLegacyUrl(""); setLegacyOnboarding(null);
    if (legacySelected && user) void getLeadOnboardingStatus({ data: { leadId: legacySelected.id } }).then((result) => { if (result.ok) setLegacyOnboarding(result.data); }).catch(() => undefined);
  }, [legacySelected?.id, user]);

  async function decide(decision: "approve" | "reject" | "action_required") {
    if (!selected || busy) return;
    setBusy(true); setError("");
    try {
      const result = await reviewActivationRequest({ data: { id: selected.id, decision, reason: reason.trim() || undefined } });
      if (!result.ok) throw new Error(result.error);
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "تعذر حفظ القرار"); }
    finally { setBusy(false); }
  }

  async function legacyApprove() {
    if (!legacySelected || busy) return;
    setBusy(true); setError("");
    try {
      const result = await approveLead({ data: { leadId: legacySelected.id } });
      if (!result.ok) throw new Error(result.error);
      setLegacyUrl(result.data.registrationUrl);
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "تعذر اعتماد الطلب القديم"); }
    finally { setBusy(false); }
  }

  async function legacyReject() {
    if (!legacySelected || busy) return;
    setBusy(true); setError("");
    try {
      const result = await updateLead({ data: { id: legacySelected.id, status: "lost", notes: "Rejected from legacy onboarding flow" } });
      if (!result.ok) throw new Error(result.error);
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "تعذر رفض الطلب القديم"); }
    finally { setBusy(false); }
  }

  if (isPending || !user) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">{lang === "ar" ? "جارٍ التحقق من صلاحيات مالك المنصة…" : "Checking platform-owner access…"}</div>;

  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto grid max-w-[1500px] gap-5 px-4 py-4 lg:py-8">
    <header className="rounded-3xl border border-line bg-paper p-5 md:p-7"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/50 px-3 py-1 text-xs text-muted"><ShieldCheck className="size-3.5" /> Menu V3 · Platform Owner</div><h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">{copy.title}</h1><p className="mt-2 max-w-4xl text-sm leading-6 text-muted">{copy.subtitle}</p></div><div className="flex flex-wrap gap-2"><LangToggle /><Button variant="outline" onClick={() => void navigate({ to: "/admin" })}>لوحة المنصة</Button><Button variant="outline" disabled={loading} onClick={() => void load()}><RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />{copy.refresh}</Button></div></div></header>
    {error ? <div className="rounded-2xl border border-bad/30 bg-bad/5 px-4 py-3 text-sm text-bad" role="alert">{error}</div> : null}

    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)]">
      <div className="grid content-start gap-3 rounded-3xl border border-line bg-sand/20 p-3">
        <div className="grid gap-2 md:grid-cols-[1fr_220px]"><label className="grid gap-1"><span className="sr-only">{copy.search}</span><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={copy.search} /></label><select value={activationFilter} onChange={(e) => setActivationFilter(e.target.value as ActivationStatus | "all")} className="h-10 rounded-md border border-line bg-paper px-3 text-sm"><option value="all">{copy.all}</option>{(["pending", "action_required", "approved", "activated", "rejected"] as ActivationStatus[]).map((value) => <option key={value} value={value}>{copy[value]}</option>)}</select></div>
        <div className="grid gap-2">{requests.map((item) => <button key={item.id} type="button" onClick={() => setSelected(item)} className={`grid gap-2 rounded-2xl border p-4 text-start ${selected?.id === item.id ? "border-ink bg-paper shadow-sm" : "border-line bg-paper"}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><strong className="block truncate">{item.brandNameAr}</strong><span className="mt-1 block text-xs text-muted">{item.contactName} · {item.contactPhone || item.contactEmail}</span></div><StatusPill status={item.status} lang={lang} /></div><span className="text-xs text-muted">{new Date(item.requestedAt).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}</span></button>)}{!requests.length ? <div className="grid min-h-56 place-items-center p-8 text-center text-sm text-muted">{lang === "ar" ? "لا توجد طلبات تفعيل مطابقة." : "No activation requests match the filter."}</div> : null}</div>
      </div>
      {selected ? <aside className="grid content-start gap-4 rounded-3xl border border-line bg-paper p-5 lg:sticky lg:top-5 lg:h-fit"><div className="flex items-start justify-between gap-4"><div><p className="text-xs text-muted">{lang === "ar" ? "تفاصيل طلب التفعيل" : "Activation request"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{selected.brandNameAr}</h2><p className="mt-1 text-sm text-muted">{selected.contactName}</p></div><StatusPill status={selected.status} lang={lang} /></div><div className="grid gap-2 rounded-2xl border border-line bg-sand/20 p-4 text-sm"><Info label={lang === "ar" ? "الاسم بالإنجليزية" : "English name"} value={selected.brandNameEn || "—"} /><Info label={lang === "ar" ? "نوع النشاط" : "Business type"} value={selected.businessType} /><Info label={lang === "ar" ? "الجوال" : "Phone"} value={selected.contactPhone || "—"} dir="ltr" /><Info label={lang === "ar" ? "البريد" : "Email"} value={selected.contactEmail || "—"} dir="ltr" /><Info label={lang === "ar" ? "الوصف" : "Description"} value={selected.descriptionAr || "—"} /></div><div className="grid gap-2"><label className="text-sm font-medium">{copy.reason}</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder={copy.reasonPlaceholder} className="min-h-24 rounded-xl border border-line bg-paper p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-ink/20" /></div><div className="grid gap-2 sm:grid-cols-3"><Button disabled={busy || selected.status === "activated"} onClick={() => void decide("approve")}><CheckCircle2 className="size-4" />{copy.approve}</Button><Button variant="outline" disabled={busy || selected.status === "activated"} onClick={() => void decide("action_required")}><UserCheck className="size-4" />{copy.changes}</Button><Button variant="outline" disabled={busy || selected.status === "activated"} onClick={() => void decide("reject")}><XCircle className="size-4" />{copy.reject}</Button></div></aside> : null}
    </section>

    <section className="grid gap-4 rounded-3xl border border-line bg-paper p-5"><div><h2 className="font-display text-2xl font-semibold">{copy.legacy}</h2><p className="mt-1 text-sm text-muted">{copy.legacyHint}</p></div><div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]"><div className="grid gap-2">{legacy?.leads.filter((lead) => lead.status !== "converted").slice(0, 20).map((lead) => <button key={lead.id} type="button" onClick={() => setLegacySelected(lead)} className={`rounded-2xl border p-4 text-start ${legacySelected?.id === lead.id ? "border-ink" : "border-line"}`}><div className="flex items-center justify-between gap-3"><strong>{lead.businessName}</strong><span className="rounded-full bg-sand px-2 py-1 text-xs">{lead.status}</span></div><span className="mt-1 block text-xs text-muted">{lead.contactName} · {lead.contactEmail}</span></button>)}</div>{legacySelected ? <div className="grid content-start gap-3 rounded-2xl border border-line bg-sand/20 p-4"><Info label={lang === "ar" ? "البريد" : "Email"} value={legacySelected.contactEmail} dir="ltr" /><Info label={lang === "ar" ? "الجوال" : "Phone"} value={legacySelected.contactPhone} dir="ltr" /><div className="flex flex-wrap gap-2">{legacySelected.contactPhone ? <a href={`tel:${legacySelected.contactPhone}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm"><Phone className="size-4" />{lang === "ar" ? "اتصال" : "Call"}</a> : null}{legacySelected.contactPhone ? <a href={`https://wa.me/${legacySelected.contactPhone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm"><MessageCircle className="size-4" />WhatsApp</a> : null}{legacySelected.contactEmail ? <a href={`mailto:${legacySelected.contactEmail}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm"><Mail className="size-4" />Email</a> : null}</div>{legacyOnboarding?.status === "pending" && !legacyUrl ? <p className="text-sm text-muted">{lang === "ar" ? "يمكنك اعتماد الطلب القديم وإنشاء رابط تسجيل آمن." : "Approve this legacy request to create its secure registration link."}</p> : null}{legacyUrl ? <div className="grid gap-2"><div className="rounded-xl bg-sand p-3 text-xs break-all" dir="ltr">{window.location.origin}{legacyUrl}</div><a href={legacyUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-line px-3 text-sm"><ExternalLink className="size-4" />{lang === "ar" ? "فتح الرابط" : "Open link"}</a></div> : null}<div className="grid gap-2 sm:grid-cols-2"><Button disabled={busy || legacySelected.status === "converted" || legacySelected.status === "lost"} onClick={() => void legacyApprove()}><CheckCircle2 className="size-4" />{lang === "ar" ? "اعتماد وإنشاء رابط" : "Approve & create link"}</Button><Button variant="outline" disabled={busy || legacySelected.status === "converted" || legacySelected.status === "lost"} onClick={() => void legacyReject()}><XCircle className="size-4" />{lang === "ar" ? "رفض" : "Reject"}</Button></div></div> : null}</div></section>
  </main>;
}

function StatusPill({ status, lang }: { status: ActivationStatus; lang: "ar" | "en" }) { return <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-xs font-medium">{activationLabels[lang][status]}</span>; }
function Info({ label, value, dir }: { label: string; value: string; dir?: "ltr" | "rtl" }) { return <div className="flex items-start justify-between gap-4"><span className="text-muted">{label}</span><span className="max-w-[70%] break-words text-end" dir={dir}>{value}</span></div>; }
