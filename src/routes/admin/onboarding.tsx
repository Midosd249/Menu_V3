import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, ExternalLink, Link2, QrCode, RefreshCw, RotateCcw, Search, ShieldCheck, XCircle } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getAdminDashboard, LEAD_STATUSES, type AdminDashboard, type AdminLead, type LeadStatus } from "@/lib/menu/admin";
import { approveLead, getLeadOnboardingStatus, revokeLeadOnboarding, type LeadOnboardingStatus } from "@/lib/menu/platform-onboarding";

export const Route = createFileRoute("/admin/onboarding")({ component: AdminOnboardingPage });

const LABELS: Record<LeadStatus, string> = { new: "جديد", contacted: "تم التواصل", qualified: "مؤهل", converted: "تم التحويل", lost: "مغلق" };
const ONBOARDING_LABELS = { pending: "بانتظار التسجيل", used: "تم التسجيل", revoked: "ملغى", expired: "منتهي", none: "لم يُعتمد" } as const;

function AdminOnboardingPage() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [dashboard, setDashboard] = useState<AdminDashboard>({ total: 0, newCount: 0, contactedCount: 0, qualifiedCount: 0, convertedCount: 0, lostCount: 0, leads: [] });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [selected, setSelected] = useState<AdminLead | null>(null);
  const [onboarding, setOnboarding] = useState<LeadOnboardingStatus | null>(null);
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [qr, setQr] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    if (!user) return;
    setBusy(true); setError("");
    const result = await getAdminDashboard({ data: { status: status === "all" ? undefined : status, q: query.trim() || undefined } });
    if (result.ok) { setDashboard(result.data); setSelected((current) => current && result.data.leads.some((x) => x.id === current.id) ? result.data.leads.find((x) => x.id === current.id) ?? current : result.data.leads[0] ?? null); }
    else setError(result.error);
    setBusy(false);
  }

  async function loadSelected(lead: AdminLead | null) {
    setSelected(lead); setRegistrationUrl(""); setQr("");
    if (!lead) { setOnboarding(null); return; }
    const result = await getLeadOnboardingStatus({ data: { leadId: lead.id } });
    if (result.ok) setOnboarding(result.data); else setError(result.error);
  }

  useEffect(() => { if (isPending) return; if (!user) { void navigate({ to: "/login", search: { redirect: "/admin/onboarding" } as never, replace: true }); return; } void load(); }, [isPending, user]);
  useEffect(() => { if (!isPending && user) { const timer = window.setTimeout(() => void load(), 220); return () => window.clearTimeout(timer); } }, [query, status]);
  useEffect(() => { if (!registrationUrl) return; let cancelled = false; void import("qrcode").then((QR) => QR.toDataURL(registrationUrl, { width: 640, margin: 2, color: { dark: "#171411", light: "#ffffff" } }).then((data) => { if (!cancelled) setQr(data); })); return () => { cancelled = true; }; }, [registrationUrl]);

  async function approve() {
    if (!selected || busy) return;
    setBusy(true); setError("");
    const result = await approveLead({ data: { leadId: selected.id } });
    if (result.ok) { setRegistrationUrl(result.data.registrationUrl); setOnboarding(result.data); }
    else setError(result.error);
    setBusy(false);
    if (result.ok) void load();
  }

  async function revoke() {
    if (!selected || busy) return;
    if (!window.confirm("إلغاء رابط التسجيل الحالي؟")) return;
    setBusy(true); const result = await revokeLeadOnboarding({ data: { leadId: selected.id } });
    if (result.ok) { setOnboarding(result.data); setRegistrationUrl(""); setQr(""); } else setError(result.error);
    setBusy(false);
  }

  const counts = useMemo(() => ({ new: dashboard.newCount, contacted: dashboard.contactedCount, qualified: dashboard.qualifiedCount, converted: dashboard.convertedCount }), [dashboard]);
  if (isPending || !user) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">جارٍ التحقق من صلاحيات مالك المنصة…</div>;

  return <main className="mx-auto grid max-w-[1450px] gap-5 py-4 lg:py-8" dir="rtl">
    <header className="flex flex-col gap-4 rounded-3xl border border-line bg-paper p-5 md:flex-row md:items-end md:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/50 px-3 py-1 text-xs text-muted"><ShieldCheck className="size-3.5" /> Platform Owner · Customer Onboarding</div><h1 className="mt-3 font-display text-3xl font-semibold">مركز اعتماد العملاء الجدد</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">استقبل طلب المطعم، راجعه، تواصل معه، اعتمده، وأرسل له رابط تسجيل مخصص. بعد التسجيل تُنشأ مساحة المطعم تلقائيًا ويظهر رابط المنيو وQR.</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => void navigate({ to: "/admin" })}>العودة للإدارة</Button><Button variant="outline" disabled={busy} onClick={() => void load()}><RefreshCw className={busy ? "size-4 animate-spin" : "size-4"} /> تحديث</Button></div></header>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4"><Metric label="جديد" value={counts.new} /><Metric label="تم التواصل" value={counts.contacted} /><Metric label="مؤهل" value={counts.qualified} /><Metric label="تم التحويل" value={counts.converted} /></div>
    {error ? <div className="rounded-xl border border-bad/30 bg-bad/5 px-4 py-3 text-sm text-bad">{error}</div> : null}
    <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
      <div className="grid content-start gap-3 rounded-3xl border border-line bg-sand/20 p-3"><div className="grid gap-2 md:grid-cols-[1fr_180px]"><label className="relative"><Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input className="ps-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="اسم المطعم، المسؤول، الجوال، البريد، المدينة" /></label><select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus | "all")} className="h-10 rounded-md border border-line bg-paper px-3 text-sm"><option value="all">كل الحالات</option>{LEAD_STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}</select></div><div className="grid gap-2">{dashboard.leads.map((lead) => <button key={lead.id} type="button" onClick={() => void loadSelected(lead)} className={`grid gap-2 rounded-2xl border bg-paper p-4 text-start ${selected?.id === lead.id ? "border-ink bg-sand/40" : "border-line"}`}><div className="flex items-start justify-between gap-3"><div><strong>{lead.businessName}</strong><p className="mt-1 text-xs text-muted">{lead.contactName} · {lead.city || "—"}</p></div><span className="rounded-full bg-sand px-2.5 py-1 text-xs">{LABELS[lead.status]}</span></div><div className="flex flex-wrap gap-2 text-xs text-muted"><span>{lead.contactPhone}</span>{lead.contactEmail ? <span>{lead.contactEmail}</span> : null}<span>{new Date(lead.createdAt).toLocaleDateString("ar-SA")}</span></div></button>)}{!dashboard.leads.length ? <div className="p-8 text-center text-sm text-muted">لا توجد طلبات مطابقة.</div> : null}</div></div>
      <LeadDetail lead={selected} onboarding={onboarding} registrationUrl={registrationUrl} qr={qr} busy={busy} onApprove={approve} onRevoke={revoke} />
    </section>
  </main>;
}

function LeadDetail({ lead, onboarding, registrationUrl, qr, busy, onApprove, onRevoke }: { lead: AdminLead | null; onboarding: LeadOnboardingStatus | null; registrationUrl: string; qr: string; busy: boolean; onApprove: () => Promise<void>; onRevoke: () => Promise<void> }) {
  if (!lead) return <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-line bg-paper p-8 text-sm text-muted">اختر طلبًا لبدء المراجعة.</div>;
  const tel = lead.contactPhone ? `tel:${lead.contactPhone.replace(/[^0-9+]/g, "")}` : "";
  const wa = lead.contactPhone ? `https://wa.me/${lead.contactPhone.replace(/[^0-9]/g, "")}` : "";
  return <aside className="grid content-start gap-5 rounded-3xl border border-line bg-paper p-5 lg:sticky lg:top-5 lg:h-fit"><div><p className="text-xs text-muted">طلب عميل جديد</p><h2 className="mt-1 text-2xl font-semibold">{lead.businessName}</h2><p className="mt-1 text-sm text-muted">{lead.contactName} · {lead.city || "—"}</p></div><div className="grid gap-2 text-sm"><div className="flex justify-between gap-3"><span className="text-muted">الجوال</span><span dir="ltr">{lead.contactPhone}</span></div><div className="flex justify-between gap-3"><span className="text-muted">البريد</span><span className="break-all" dir="ltr">{lead.contactEmail || "—"}</span></div><div className="flex justify-between gap-3"><span className="text-muted">المصدر</span><span>{lead.source}</span></div>{lead.details ? <div className="rounded-xl bg-sand/50 p-3 leading-6"><span className="text-muted">التفاصيل:</span><br />{lead.details}</div> : null}</div><div className="flex flex-wrap gap-2">{tel ? <a href={tel} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm">اتصال</a> : null}{wa ? <a href={wa} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm">WhatsApp</a> : null}{lead.contactEmail ? <a href={`mailto:${lead.contactEmail}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm">بريد</a> : null}</div><div className="rounded-2xl border border-line p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs text-muted">حالة التسجيل</p><strong>{onboarding ? ONBOARDING_LABELS[onboarding.status] : "جارٍ التحميل…"}</strong></div>{onboarding?.status === "used" ? <CheckCircle2 className="size-5" /> : onboarding?.status === "revoked" || onboarding?.status === "expired" ? <XCircle className="size-5" /> : <Link2 className="size-5" />}</div>{onboarding?.status === "used" && onboarding.menuUrl ? <a href={onboarding.menuUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm underline"><ExternalLink className="size-4" />معاينة المنيو</a> : null}{onboarding?.status === "pending" ? <p className="mt-2 text-xs leading-5 text-muted">الرابط الحالي صالح لمدة 7 أيام. لإصدار رابط جديد، ألغِ الحالي ثم أنشئ واحدًا جديدًا.</p> : null}</div>{lead.status !== "converted" ? <div className="grid gap-2 sm:grid-cols-2"><Button disabled={busy || onboarding?.status === "pending"} onClick={() => void onApprove()}><Link2 className="size-4" />{onboarding?.status === "revoked" || onboarding?.status === "expired" ? "إنشاء رابط جديد" : "اعتماد وإنشاء رابط"}</Button>{onboarding?.status === "pending" ? <Button variant="outline" disabled={busy} onClick={() => void onRevoke()}><RotateCcw className="size-4" />إلغاء الرابط</Button> : null}</div> : null}{registrationUrl ? <div className="grid gap-3 rounded-2xl border border-line bg-white p-4"><div className="flex items-center gap-2 text-sm font-semibold"><QrCode className="size-4" />رابط التسجيل</div><div className="flex gap-2"><Input readOnly value={registrationUrl} /><Button variant="outline" type="button" onClick={() => void navigator.clipboard.writeText(registrationUrl)} aria-label="نسخ رابط التسجيل"><Copy className="size-4" /></Button></div>{qr ? <img src={qr} alt="QR لرابط تسجيل العميل" className="mx-auto w-52 rounded-xl" /> : null}<p className="text-xs leading-5 text-muted">أرسل الرابط أو QR للعميل. بعد التسجيل تُنشأ مساحة المطعم تلقائيًا.</p></div> : null}</aside>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="grid gap-1 rounded-2xl border border-line bg-paper p-4"><span className="text-xs text-muted">{label}</span><strong className="text-2xl">{value.toLocaleString("ar-SA")}</strong></div>; }
