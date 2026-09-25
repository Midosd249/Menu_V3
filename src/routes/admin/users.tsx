import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, ShieldCheck, Smartphone, UserRound, UserX, Trash2, History, ReceiptText, MessageCircle, Printer, X } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LangToggle } from "@/components/lang-toggle";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLang } from "@/lib/lang";
import { deletePlatformUser, getPlatformUsers, setPlatformUserBan, verifyPlatformUserPhone, type PlatformUser } from "@/lib/menu/platform-users";
import { changePlatformSubscriptionPlan, getPlatformSubscriptionAudit, getPlatformSubscriptions, managePlatformTrial, setPlatformAccountFrozen, setPlatformBillingInterval, setPlatformSubscriptionStatus, type PlatformSubscription, type PlatformSubscriptionAudit } from "@/lib/menu/platform-subscriptions";
import { buildInvoiceWhatsAppUrl, getPlatformInvoices, issuePlatformInvoice, type PlatformInvoice } from "@/lib/menu/platform-billing";

export const Route = createFileRoute("/admin/users")({ component: PlatformUsersPage });

function PlatformUsersPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [subscriptions, setSubscriptions] = useState<PlatformSubscription[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [auditByTenant, setAuditByTenant] = useState<Record<string, PlatformSubscriptionAudit[]>>({});
  const [invoicesByTenant, setInvoicesByTenant] = useState<Record<string, PlatformInvoice[]>>({});
  const [invoiceTenantId, setInvoiceTenantId] = useState<string | null>(null);
  const [invoiceBusy, setInvoiceBusy] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<PlatformInvoice | null>(null);
  const [invoiceForm, setInvoiceForm] = useState({ planCode: "pro", amountSar: "", periodStart: "", periodEnd: "", notes: "" });

  const load = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const result = await getPlatformUsers({ data: { q: query.trim() || undefined } });
      if (!result.ok) setError(result.error); else setUsers(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر تحميل الحسابات" : "Unable to load accounts"));
    } finally { setLoading(false); }
  };

  const loadSubscriptions = async () => {
    if (!user) return;
    setSubscriptionLoading(true);
    try {
      const result = await getPlatformSubscriptions({ data: { q: query.trim() || undefined } });
      if (!result.ok) setError(result.error); else setSubscriptions(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر تحميل الاشتراكات" : "Unable to load subscriptions"));
    } finally { setSubscriptionLoading(false); }
  };

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      void navigate({ to: "/login", search: { redirect: "/admin/users" } as never, replace: true });
      return;
    }
    void load();
    void loadSubscriptions();
  }, [isPending, user]);

  useEffect(() => {
    if (isPending || !user) return;
    const timer = window.setTimeout(() => { void load(); void loadSubscriptions(); }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const visible = useMemo(() => users, [users]);

  async function toggleBan(target: PlatformUser) {
    if (busyId || target.isPlatformAdmin) return;
    const confirmed = window.confirm(target.banned
      ? (lang === "ar" ? `إلغاء تجميد حساب ${target.name || target.email}؟` : `Unfreeze ${target.name || target.email}?`)
      : (lang === "ar" ? `تجميد حساب ${target.name || target.email}؟ سيتم إنهاء جلساته الحالية.` : `Freeze ${target.name || target.email}? Current sessions will be revoked.`));
    if (!confirmed) return;
    setBusyId(target.id); setError("");
    try {
      const result = await setPlatformUserBan({ data: { userId: target.id, banned: !target.banned, reason: lang === "ar" ? "إجراء من مالك المنصة" : "Platform Owner action" } });
      if (!result.ok) setError(result.error); else setUsers((current) => current.map((x) => x.id === target.id ? result.data : x));
      await loadSubscriptions();
    } finally { setBusyId(null); }
  }

  async function verifyPhone(target: PlatformUser) {
    if (busyId || target.isPlatformAdmin) return;
    const phone = target.phoneNumber || window.prompt(lang === "ar" ? "أدخل رقم الجوال المعتمد للعميل:" : "Enter the approved customer phone number:", "+9665");
    if (!phone) return;
    setBusyId(target.id); setError("");
    try {
      const result = await verifyPlatformUserPhone({ data: { userId: target.id, phoneNumber: phone } });
      if (!result.ok) setError(result.error); else setUsers((current) => current.map((x) => x.id === target.id ? result.data : x));
    } finally { setBusyId(null); }
  }

  async function remove(target: PlatformUser) {
    if (busyId || target.isPlatformAdmin) return;
    const confirmed = window.confirm(lang === "ar"
      ? `حذف حساب ${target.name || target.email} نهائيًا؟ هذا الإجراء متاح فقط للحساب غير المرتبط بأي مطعم.`
      : `Permanently delete ${target.name || target.email}? This is only allowed for an account with no restaurant membership.`);
    if (!confirmed) return;
    setBusyId(target.id); setError("");
    try {
      const result = await deletePlatformUser({ data: { userId: target.id } });
      if (!result.ok) setError(result.error); else setUsers((current) => current.filter((x) => x.id !== target.id));
    } finally { setBusyId(null); }
  }

  async function changePlan(subscription: PlatformSubscription, planCode: string) {
    setBusyId(subscription.tenantId); setError("");
    try {
      const result = await changePlatformSubscriptionPlan({ data: { tenantId: subscription.tenantId, planCode, reason: lang === "ar" ? "تغيير خطة من مالك المنصة" : "Plan change by Platform Owner" } });
      if (!result.ok) setError(result.error); else setSubscriptions((current) => current.map((x) => x.tenantId === subscription.tenantId ? result.data : x));
    } finally { setBusyId(null); }
  }

  async function changeBillingInterval(subscription: PlatformSubscription, billingInterval: PlatformSubscription["billingInterval"]) {
    setBusyId(subscription.tenantId); setError("");
    try {
      const result = await setPlatformBillingInterval({ data: { tenantId: subscription.tenantId, billingInterval, reason: lang === "ar" ? "تغيير دورة الفوترة من مالك المنصة" : "Billing interval change by Platform Owner" } });
      if (!result.ok) setError(result.error); else setSubscriptions((current) => current.map((x) => x.tenantId === subscription.tenantId ? result.data : x));
    } finally { setBusyId(null); }
  }

  async function trialAction(subscription: PlatformSubscription, action: "extend" | "end") {
    setBusyId(subscription.tenantId); setError("");
    try {
      const trialEndsAt = action === "extend" ? window.prompt(lang === "ar" ? "أدخل نهاية التجربة بصيغة ISO (مثال 2026-10-01T12:00:00Z):" : "Enter trial end as ISO datetime:", subscription.trialEndsAt || "") || undefined : undefined;
      if (action === "extend" && !trialEndsAt) return;
      const result = await managePlatformTrial({ data: { tenantId: subscription.tenantId, action, trialEndsAt, reason: lang === "ar" ? "إدارة التجربة من مالك المنصة" : "Trial management by Platform Owner" } });
      if (!result.ok) setError(result.error); else setSubscriptions((current) => current.map((x) => x.tenantId === subscription.tenantId ? result.data : x));
    } finally { setBusyId(null); }
  }

  async function changeStatus(subscription: PlatformSubscription, status: PlatformSubscription["status"]) {
    setBusyId(subscription.tenantId); setError("");
    try {
      const result = await setPlatformSubscriptionStatus({ data: { tenantId: subscription.tenantId, status, reason: lang === "ar" ? "تحديث حالة الاشتراك من مالك المنصة" : "Subscription status change by Platform Owner" } });
      if (!result.ok) setError(result.error); else setSubscriptions((current) => current.map((x) => x.tenantId === subscription.tenantId ? result.data : x));
    } finally { setBusyId(null); }
  }

  async function toggleAccountFreeze(subscription: PlatformSubscription) {
    const frozen = !subscription.accountFrozen;
    if (!window.confirm(frozen
      ? (lang === "ar" ? `تجميد حساب ${subscription.ownerName || subscription.ownerEmail}؟ سيتم إنهاء جلساته الحالية.` : `Freeze ${subscription.ownerName || subscription.ownerEmail}? Current sessions will be revoked.`)
      : (lang === "ar" ? `إلغاء تجميد حساب ${subscription.ownerName || subscription.ownerEmail}؟` : `Unfreeze ${subscription.ownerName || subscription.ownerEmail}?`))) return;
    setBusyId(subscription.tenantId); setError("");
    try {
      const result = await setPlatformAccountFrozen({ data: { userId: subscription.ownerUserId, frozen, reason: lang === "ar" ? "إجراء حساب من مالك المنصة" : "Account control by Platform Owner" } });
      if (!result.ok) setError(result.error); else await loadSubscriptions();
    } finally { setBusyId(null); }
  }

  async function loadInvoices(tenantId: string) {
    setInvoiceBusy(`load:${tenantId}`);
    setError("");
    try {
      const result = await getPlatformInvoices({ data: { tenantId } });
      if (!result.ok) setError(result.error);
      else setInvoicesByTenant((current) => ({ ...current, [tenantId]: result.data }));
    } finally { setInvoiceBusy(null); }
  }

  function openIssueInvoice(subscription: PlatformSubscription) {
    const end = subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : new Date();
    const start = new Date(end);
    start.setMonth(start.getMonth() - (subscription.billingInterval === "annual" ? 12 : 1));
    if (!subscription.currentPeriodEnd) {
      end.setMonth(end.getMonth() + (subscription.billingInterval === "annual" ? 12 : 1));
    }
    const dateValue = (value: Date) => value.toISOString().slice(0, 10);
    const defaultAmount = subscription.billingInterval === "annual" ? subscription.annualPriceSar : subscription.monthlyPriceSar;
    setInvoiceForm({
      planCode: subscription.planCode,
      amountSar: String(defaultAmount),
      periodStart: dateValue(start),
      periodEnd: dateValue(end),
      notes: "",
    });
    setInvoiceTenantId(subscription.tenantId);
  }

  async function issueInvoice(subscription: PlatformSubscription) {
    if (!invoiceForm.periodStart || !invoiceForm.periodEnd || !invoiceForm.amountSar) {
      setError(lang === "ar" ? "أكمل الخطة والمبلغ وبداية ونهاية الفترة." : "Complete the plan, amount, and billing dates.");
      return;
    }
    setInvoiceBusy(`issue:${subscription.tenantId}`);
    setError("");
    try {
      const result = await issuePlatformInvoice({
        data: {
          tenantId: subscription.tenantId,
          planCode: invoiceForm.planCode,
          amountSar: Number(invoiceForm.amountSar),
          periodStart: invoiceForm.periodStart,
          periodEnd: invoiceForm.periodEnd,
          notes: invoiceForm.notes.trim() || undefined,
        },
      });
      if (!result.ok) setError(result.error);
      else {
        setInvoiceTenantId(null);
        setSelectedInvoice(result.data);
        await loadInvoices(subscription.tenantId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر إصدار الفاتورة" : "Unable to issue invoice"));
    } finally { setInvoiceBusy(null); }
  }

  async function showAudit(subscription: PlatformSubscription) {
    setBusyId(`audit:${subscription.tenantId}`); setError("");
    try {
      const result = await getPlatformSubscriptionAudit({ data: { tenantId: subscription.tenantId } });
      if (!result.ok) setError(result.error); else setAuditByTenant((current) => ({ ...current, [subscription.tenantId]: result.data }));
    } finally { setBusyId(null); }
  }

  if (isPending || !user) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">{lang === "ar" ? "جارٍ التحقق من صلاحيات مالك المنصة…" : "Checking Platform Owner access…"}</div>;

  return <main className="mx-auto grid max-w-[1500px] gap-5 py-4 lg:py-8" dir={lang === "ar" ? "rtl" : "ltr"}>
    <header className="rounded-3xl border border-line bg-paper p-5 md:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/50 px-3 py-1 text-xs text-muted"><ShieldCheck className="size-3.5" /> Menu V3 · Platform Owner</div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">{lang === "ar" ? "إدارة الحسابات والاشتراكات" : "Accounts & Subscriptions"}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{lang === "ar" ? "تحكم إداري server-authorized في الخطط والتجارب وحالات الاشتراك وتجميد الحسابات، مع سجل تدقيق لكل تغيير. لا يمنح هذا المسار أي صلاحيات عبر بيانات العميل." : "Server-authorized administrative control for plans, trials, subscription states, and account freezing, with an audit record for every mutation."}</p>
        </div>
        <div className="flex flex-wrap gap-2"><LangToggle /><Button variant="outline" onClick={() => void navigate({ to: "/admin" })}>لوحة المنصة</Button><Button variant="outline" disabled={loading || subscriptionLoading} onClick={() => { void load(); void loadSubscriptions(); }}><RefreshCw className={loading || subscriptionLoading ? "size-4 animate-spin" : "size-4"} />{lang === "ar" ? "تحديث" : "Refresh"}</Button></div>
      </div>
    </header>

    <section className="grid gap-3 rounded-3xl border border-line bg-sand/20 p-4">
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={lang === "ar" ? "ابحث بالاسم أو البريد أو مساحة العمل" : "Search name, email, or workspace"} />
      {error ? <div className="rounded-2xl border border-bad/30 bg-bad/5 px-4 py-3 text-sm text-bad" role="alert">{error}</div> : null}
    </section>

    <section className="grid gap-3">
      {subscriptionLoading ? <div className="rounded-2xl border border-line bg-paper p-6 text-sm text-muted">{lang === "ar" ? "جارٍ تحميل الاشتراكات…" : "Loading subscriptions…"}</div> : null}
      {subscriptions.map((subscription) => {
        const audit = auditByTenant[subscription.tenantId] || [];
        const busy = busyId === subscription.tenantId;
        return <article key={subscription.tenantId} className="grid gap-4 rounded-3xl border border-line bg-paper p-4 md:p-5">
          <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><strong className="text-lg">{subscription.tenantName || subscription.tenantSlug}</strong><span className="rounded-full bg-sand px-2 py-1 text-[11px]">{subscription.planNameAr}</span><span className="rounded-full bg-sand px-2 py-1 text-[11px]" dir="ltr">{subscription.status}</span>{subscription.accountFrozen ? <span className="rounded-full bg-bad/10 px-2 py-1 text-[11px] text-bad">{lang === "ar" ? "الحساب مجمد" : "Account frozen"}</span> : null}</div>
              <div className="mt-1 grid gap-1 text-sm text-muted md:grid-cols-3"><span>{subscription.ownerName || "—"}</span><span dir="ltr">{subscription.ownerEmail || "—"}</span><span dir="ltr">{subscription.tenantSlug || "—"}</span></div>
              <div className="mt-3 grid gap-1 text-xs text-muted md:grid-cols-4"><span>{subscription.branchCount}/{subscription.maxBranches} {lang === "ar" ? "فروع" : "branches"}</span><span>{subscription.productCount}/{subscription.productsUnlimited ? "∞" : subscription.maxProducts} {lang === "ar" ? "منتجات" : "products"}</span><span>{subscription.teamMemberCount}/{subscription.maxTeamMembers} {lang === "ar" ? "أعضاء" : "members"}</span><span dir="ltr">{subscription.billingInterval === "annual" ? `${subscription.annualPriceSar} SAR/yr` : `${subscription.monthlyPriceSar} SAR/mo`}</span></div>
            </div>
            <Button variant="outline" disabled={busyId === `audit:${subscription.tenantId}`} onClick={() => void showAudit(subscription)}><History className="size-4" />{lang === "ar" ? "سجل التدقيق" : "Audit log"}</Button>
          </div>

          <div className="grid gap-3 rounded-2xl border border-line bg-sand/20 p-3 md:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1 text-xs text-muted"><span>{lang === "ar" ? "الخطة" : "Plan"}</span><select className="h-10 rounded-md border border-line bg-paper px-3 text-sm text-ink" value={subscription.planCode} disabled={busy} onChange={(e) => void changePlan(subscription, e.target.value)}><option value="free">Free</option><option value="starter">Growth</option><option value="pro">Pro</option></select></label>
            <label className="grid gap-1 text-xs text-muted"><span>{lang === "ar" ? "دورة الفوترة" : "Billing interval"}</span><select className="h-10 rounded-md border border-line bg-paper px-3 text-sm text-ink" value={subscription.billingInterval} disabled={busy || subscription.planCode === "free"} onChange={(e) => void changeBillingInterval(subscription, e.target.value as PlatformSubscription["billingInterval"])}><option value="monthly">{lang === "ar" ? "شهري" : "Monthly"}</option><option value="annual">{lang === "ar" ? "سنوي" : "Annual"}</option></select></label>
            <label className="grid gap-1 text-xs text-muted"><span>{lang === "ar" ? "حالة الاشتراك" : "Subscription status"}</span><select className="h-10 rounded-md border border-line bg-paper px-3 text-sm text-ink" value={subscription.status} disabled={busy} onChange={(e) => void changeStatus(subscription, e.target.value as PlatformSubscription["status"])}>{["active","trialing","past_due","cancelled","suspended"].map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
            <div className="flex flex-wrap items-end gap-2"><Button variant="outline" disabled={busy || subscription.planCode === "free"} onClick={() => void trialAction(subscription, "extend")}>{lang === "ar" ? "تمديد التجربة" : "Extend trial"}</Button><Button variant="outline" disabled={busy || subscription.planCode === "free" || subscription.status !== "trialing"} onClick={() => void trialAction(subscription, "end")}>{lang === "ar" ? "إنهاء التجربة" : "End trial"}</Button></div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" disabled={invoiceBusy === `load:${subscription.tenantId}`} onClick={() => void loadInvoices(subscription.tenantId)}>
              <ReceiptText className="size-4" />{lang === "ar" ? "فواتير العميل" : "Customer invoices"}
            </Button>
            <Button disabled={invoiceBusy === `issue:${subscription.tenantId}`} onClick={() => openIssueInvoice(subscription)}>
              <ReceiptText className="size-4" />{lang === "ar" ? "إصدار فاتورة" : "Issue invoice"}
            </Button>
          </div>
          {invoiceTenantId === subscription.tenantId ? (
            <section className="grid gap-3 rounded-2xl border border-line bg-paper p-4">
              <div className="flex items-center justify-between gap-3">
                <strong>{lang === "ar" ? "إصدار فاتورة للعميل" : "Issue invoice for this customer"}</strong>
                <Button variant="outline" onClick={() => setInvoiceTenantId(null)} aria-label={lang === "ar" ? "إغلاق" : "Close"}><X className="size-4" /></Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <label className="grid gap-1 text-xs text-muted"><span>{lang === "ar" ? "الخطة" : "Plan"}</span><select className="h-10 rounded-md border border-line bg-paper px-3 text-sm text-ink" value={invoiceForm.planCode} onChange={(e) => setInvoiceForm((x) => ({ ...x, planCode: e.target.value }))}><option value="free">Free</option><option value="starter">Growth</option><option value="pro">Pro</option></select></label>
                <label className="grid gap-1 text-xs text-muted"><span>{lang === "ar" ? "المبلغ (SAR)" : "Amount (SAR)"}</span><Input type="number" min="0" step="0.01" value={invoiceForm.amountSar} onChange={(e) => setInvoiceForm((x) => ({ ...x, amountSar: e.target.value }))} /></label>
                <label className="grid gap-1 text-xs text-muted"><span>{lang === "ar" ? "بداية الفترة" : "Period start"}</span><Input type="date" value={invoiceForm.periodStart} onChange={(e) => setInvoiceForm((x) => ({ ...x, periodStart: e.target.value }))} /></label>
                <label className="grid gap-1 text-xs text-muted"><span>{lang === "ar" ? "نهاية الفترة" : "Period end"}</span><Input type="date" value={invoiceForm.periodEnd} onChange={(e) => setInvoiceForm((x) => ({ ...x, periodEnd: e.target.value }))} /></label>
              </div>
              <label className="grid gap-1 text-xs text-muted"><span>{lang === "ar" ? "ملاحظات" : "Notes"}</span><textarea className="min-h-20 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink" maxLength={1000} value={invoiceForm.notes} onChange={(e) => setInvoiceForm((x) => ({ ...x, notes: e.target.value }))} placeholder={lang === "ar" ? "ملاحظة تظهر في الفاتورة ورسالة واتساب" : "Optional note shown on the invoice and WhatsApp message"} /></label>
              <div className="flex flex-wrap gap-2">
                <Button disabled={invoiceBusy === `issue:${subscription.tenantId}`} onClick={() => void issueInvoice(subscription)}><ReceiptText className="size-4" />{invoiceBusy === `issue:${subscription.tenantId}` ? (lang === "ar" ? "جارٍ الإصدار…" : "Issuing…") : (lang === "ar" ? "إصدار الفاتورة" : "Issue invoice")}</Button>
                <Button variant="outline" onClick={() => setInvoiceTenantId(null)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
              </div>
            </section>
          ) : null}
          {invoicesByTenant[subscription.tenantId]?.length ? (
            <section className="grid gap-2 rounded-2xl border border-line p-3">
              <strong className="text-sm">{lang === "ar" ? "الفواتير الصادرة من المنصة" : "Platform-issued invoices"}</strong>
              {invoicesByTenant[subscription.tenantId].map((invoice) => (
                <article key={invoice.id} className="grid gap-3 rounded-xl border border-line bg-sand/20 p-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="grid gap-1 text-sm">
                    <div className="flex flex-wrap items-center gap-2"><strong dir="ltr">{invoice.invoiceNumber}</strong><span>{lang === "ar" ? invoice.planNameAr : invoice.planNameEn}</span><span dir="ltr">{invoice.amountSar.toFixed(2)} SAR</span><span className="text-xs text-muted">{invoice.periodStart.slice(0,10)} → {invoice.periodEnd.slice(0,10)}</span></div>
                    {invoice.notes ? <p className="text-xs text-muted">{invoice.notes}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => setSelectedInvoice(invoice)}><Printer className="size-4" />{lang === "ar" ? "عرض / طباعة" : "View / print"}</Button>
                    <Button variant="outline" asChild><a href={buildInvoiceWhatsAppUrl(invoice, lang)} target="_blank" rel="noreferrer"><MessageCircle className="size-4" />WhatsApp</a></Button>
                  </div>
                </article>
              ))}
            </section>
          ) : null}
          <div className="flex flex-wrap items-end gap-2"><Button variant="outline" disabled={busy} onClick={() => void toggleAccountFreeze(subscription)}>{subscription.accountFrozen ? <UserRound className="size-4" /> : <UserX className="size-4" />}{subscription.accountFrozen ? (lang === "ar" ? "إلغاء تجميد" : "Unfreeze") : (lang === "ar" ? "تجميد الحساب" : "Freeze account")}</Button></div>
          {subscription.trialEndsAt ? <p className="text-xs text-muted">{lang === "ar" ? "نهاية التجربة:" : "Trial ends:"} <span dir="ltr">{subscription.trialEndsAt}</span></p> : null}
          {audit.length ? <div className="grid gap-2 rounded-2xl border border-line p-3"><strong className="text-sm">{lang === "ar" ? "آخر تغييرات الإدارة" : "Recent administrative changes"}</strong>{audit.slice(0, 5).map((entry) => <div key={entry.id} className="grid gap-1 border-t border-line pt-2 text-xs text-muted md:grid-cols-[auto_1fr_auto]"><span dir="ltr">{entry.action}</span><span>{entry.reason || "—"}</span><span dir="ltr">{entry.createdAt}</span></div>)}</div> : null}
        </article>;
      })}
      {!subscriptionLoading && !subscriptions.length ? <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-line p-6 text-sm text-muted">{lang === "ar" ? "لا توجد اشتراكات مطابقة." : "No matching subscriptions."}</div> : null}
    </section>

    <section className="grid gap-3 rounded-3xl border border-line bg-paper p-4">
      <h2 className="text-lg font-semibold">{lang === "ar" ? "الحسابات" : "Accounts"}</h2>
      <div className="grid gap-3">
        {visible.map((target) => <article key={target.id} className="grid gap-4 rounded-2xl border border-line bg-sand/20 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="grid gap-2 min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="text-base">{target.name || "—"}</strong>{target.isPlatformAdmin ? <span className="rounded-full bg-ink px-2 py-1 text-[11px] text-paper">Platform Owner</span> : null}{target.banned ? <span className="rounded-full bg-bad/10 px-2 py-1 text-[11px] text-bad">{lang === "ar" ? "مجمد" : "Frozen"}</span> : null}</div><div className="grid gap-1 text-sm text-muted md:grid-cols-3"><span dir="ltr">{target.email || "—"}</span><span dir="ltr">{target.phoneNumber || "—"}</span><span>{target.tenantCount} {lang === "ar" ? "مساحة/ارتباط" : "workspace links"}</span></div>{target.banReason ? <p className="text-xs text-muted">{target.banReason}</p> : null}</div>
          <div className="flex flex-wrap gap-2 lg:justify-end">{!target.isPlatformAdmin ? <><Button variant="outline" disabled={busyId === target.id} onClick={() => void verifyPhone(target)}><Smartphone className="size-4" />{target.phoneVerified ? (lang === "ar" ? "الجوال معتمد" : "Phone verified") : (lang === "ar" ? "اعتماد الجوال" : "Verify phone")}</Button><Button variant="outline" disabled={busyId === target.id} onClick={() => void toggleBan(target)}>{target.banned ? <UserRound className="size-4" /> : <UserX className="size-4" />}{target.banned ? (lang === "ar" ? "إلغاء التجميد" : "Unfreeze") : (lang === "ar" ? "تجميد" : "Freeze")}</Button><Button variant="outline" disabled={busyId === target.id || target.tenantCount > 0} onClick={() => void remove(target)}><Trash2 className="size-4" />{lang === "ar" ? "حذف" : "Delete"}</Button></> : <span className="inline-flex items-center gap-2 px-3 py-2 text-xs text-muted"><CheckCircle2 className="size-4" />{lang === "ar" ? "حساب محمي" : "Protected account"}</span>}</div>
        </article>)}
        {!loading && !visible.length ? <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-line p-6 text-sm text-muted">{lang === "ar" ? "لا توجد حسابات مطابقة." : "No matching accounts."}</div> : null}
      </div>
    </section>
  </main>;
}

function AdminInvoicePrintView({ invoice, lang, onClose }: { invoice: PlatformInvoice; lang: "ar" | "en"; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={lang === "ar" ? "الفاتورة" : "Invoice"}>
      <div className="mx-auto my-6 max-w-2xl rounded-3xl bg-paper p-6 shadow-xl md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
          <div><p className="text-xs text-muted">Menu V3</p><h2 className="mt-1 font-display text-2xl font-semibold">{lang === "ar" ? "فاتورة اشتراك" : "Subscription invoice"}</h2></div>
          <strong dir="ltr">{invoice.invoiceNumber}</strong>
        </div>
        <div className="grid gap-5 py-6 text-sm">
          <div><span className="text-muted">{lang === "ar" ? "العميل" : "Customer"}: </span><strong>{invoice.tenantName}</strong><p className="text-muted">{invoice.ownerEmail}</p></div>
          <div><span className="text-muted">{lang === "ar" ? "الخطة" : "Plan"}: </span><strong>{lang === "ar" ? invoice.planNameAr : invoice.planNameEn}</strong></div>
          <div><span className="text-muted">{lang === "ar" ? "الفترة" : "Period"}: </span><strong>{invoice.periodStart.slice(0,10)} → {invoice.periodEnd.slice(0,10)}</strong></div>
          <div className="flex items-center justify-between rounded-2xl bg-sand/40 p-4"><span>{lang === "ar" ? "الإجمالي" : "Total"}</span><strong dir="ltr">{invoice.amountSar.toFixed(2)} SAR</strong></div>
          {invoice.notes ? <div><span className="text-muted">{lang === "ar" ? "ملاحظات" : "Notes"}</span><p className="mt-1 whitespace-pre-wrap">{invoice.notes}</p></div> : null}
          <p className="text-xs leading-5 text-muted">{lang === "ar" ? "هذه فاتورة اشتراك صادرة من مالك المنصة. لا تمثل إثبات دفع ولا تنفذ تحصيلاً إلكترونياً." : "This is a subscription invoice issued by the Platform Owner. It is not proof of payment and does not perform electronic collection."}</p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button onClick={() => window.print()}><Printer className="size-4" />{lang === "ar" ? "طباعة" : "Print"}</Button>
          <Button variant="outline" asChild><a href={buildInvoiceWhatsAppUrl(invoice, lang)} target="_blank" rel="noreferrer"><MessageCircle className="size-4" />WhatsApp</a></Button>
          <Button variant="outline" onClick={onClose}>{lang === "ar" ? "إغلاق" : "Close"}</Button>
        </div>
      </div>
    </div>
  );
}
