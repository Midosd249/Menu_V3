import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, LockKeyhole, RefreshCw, Search, Snowflake, UnlockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState, PageHeader, SectionHeader } from "@/components/internal-design-system";
import { getAdminSubscriptions, updateAdminSubscription, type AdminSubscription, type AdminSubscriptionStatus } from "@/lib/menu/admin-subscriptions";

const statusLabels: Record<AdminSubscriptionStatus, string> = { trialing: "تجربة", active: "نشط", past_due: "متأخر", cancelled: "ملغى" };
const accountLabels = { active: "نشط", frozen: "مجمد", blocked: "محظور" } as const;
const workspaces = [
  ["/admin", "الرئيسية"], ["/admin/restaurants", "المطاعم"], ["/admin/orders", "الطلبات"], ["/admin/clients", "العملاء والحسابات"],
  ["/admin/branches", "الفروع"], ["/admin/leads", "العملاء المحتملون"], ["/admin/projects", "المشاريع"], ["/admin/service-requests", "طلبات الخدمات"],
  ["/admin/subscriptions", "الاشتراكات"], ["/admin/analytics", "تحليلات المنصة"], ["/admin/activity", "سجل النشاط"], ["/admin/system", "النظام والأمان"],
] as const;

function date(value: string | null) {
  if (!value) return "—";
  try { return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); } catch { return value; }
}
function confirmAction(message: string) { return typeof window === "undefined" || window.confirm(message); }
type MutationData =
  | { action: "set_plan"; tenantId: string; planCode: "free" | "starter" | "pro" }
  | { action: "extend_trial"; tenantId: string; days: number }
  | { action: "end_trial"; tenantId: string }
  | { action: "freeze_account"; tenantId: string }
  | { action: "unfreeze_account"; tenantId: string }
  | { action: "set_subscription_status"; tenantId: string; status: AdminSubscriptionStatus };

export function AdminSubscriptionControl() {
  const [rows, setRows] = useState<AdminSubscription[]>([]); const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState<string | null>(null); const [error, setError] = useState("");
  async function load() { setLoading(true); setError(""); const result = await getAdminSubscriptions(); if (!result.ok) setError(result.error); else setRows(result.data); setLoading(false); }
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => { const needle = query.trim().toLocaleLowerCase(); if (!needle) return rows; return rows.filter((row) => [row.customerName, row.customerEmail, row.phone, row.tenantName, row.planCode, row.status].join(" ").toLocaleLowerCase().includes(needle)); }, [rows, query]);
  async function mutate(data: MutationData, message: string) {
    if (!confirmAction(message)) return; setSaving(data.tenantId); setError(""); const result = await updateAdminSubscription({ data });
    if (!result.ok) setError(result.error); else setRows((current) => current.map((row) => row.tenantId === result.data.tenantId ? result.data : row)); setSaving(null);
  }
  return <main className="mx-auto grid max-w-[1500px] gap-5 py-4 lg:py-8">
    <PageHeader eyebrow="Platform Admin" title="مركز تحكم Menu V3" description="الاشتراكات والحسابات — تغييرات إدارية حساسة مصرح بها من الخادم ومُسجلة في سجل التدقيق." actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />تحديث</Button>} />
    <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside aria-label="تنقل إدارة المنصة" className="rounded-2xl border border-line bg-paper p-3"><nav className="grid gap-1">{workspaces.map(([href, label]) => <a key={href} href={href} aria-current={href === "/admin/subscriptions" ? "page" : undefined} className={href === "/admin/subscriptions" ? "rounded-xl bg-surface px-3 py-2 text-sm font-semibold text-ink" : "rounded-xl px-3 py-2 text-sm text-muted hover:bg-surface hover:text-ink"}>{label}</a>)}</nav></aside>
      <section className="min-w-0 grid gap-4">
        {error ? <ErrorState title="تعذر تنفيذ العملية" message={error} action={<Button variant="outline" onClick={() => void load()}>إعادة المحاولة</Button>} /> : null}
        <section className="rounded-2xl border border-line bg-paper p-4"><SectionHeader title="اشتراكات العملاء" description="لا يتم تنفيذ أي تغيير من العميل نفسه؛ صلاحية مالك المنصة والتحقق من الحالة تتم على الخادم." />
          <div className="mt-4 flex flex-col gap-3 md:flex-row"><label className="relative min-w-0 flex-1"><span className="sr-only">بحث</span><Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-11 w-full rounded-xl border border-line bg-surface px-10 py-2 text-sm text-ink outline-none focus:border-accent" placeholder="ابحث بالعميل أو البريد أو المطعم…" /></label><div className="rounded-xl border border-line bg-surface px-4 py-2 text-sm text-muted">{filtered.length} من {rows.length} عميل</div></div>
        </section>
        {loading && rows.length === 0 ? <LoadingState label="جارٍ تحميل اشتراكات العملاء…" /> : null}
        <div className="grid gap-4">{filtered.map((row) => <article key={row.tenantId} className="rounded-2xl border border-line bg-paper p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold text-ink">{row.tenantName}</h2><span className="rounded-full border border-line px-2 py-1 text-xs">{row.planNameAr} · {row.monthlyPriceSar} ر.س</span><span className="rounded-full border border-line px-2 py-1 text-xs">{statusLabels[row.status]}</span><span className="rounded-full border border-line px-2 py-1 text-xs">الحساب: {accountLabels[row.accountStatus]}</span></div><p className="mt-2 text-sm text-muted">{row.customerName || "بدون اسم"} · {row.customerEmail || "بدون بريد"} · {row.phone || "بدون جوال"}</p><dl className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-2 lg:grid-cols-3"><div><dt>نهاية التجربة</dt><dd className="text-ink">{date(row.trialEndsAt)}</dd></div><div><dt>نهاية الفترة</dt><dd className="text-ink">{date(row.currentPeriodEnd)}</dd></div><div><dt>آخر تحديث</dt><dd className="text-ink">{date(row.updatedAt)}</dd></div></dl></div>
            <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-[430px]"><label className="grid gap-1 text-xs text-muted"><span>الخطة</span><select disabled={saving === row.tenantId} value={row.planCode} onChange={(event) => void mutate({ action: "set_plan", tenantId: row.tenantId, planCode: event.target.value as "free" | "starter" | "pro" }, `تغيير خطة ${row.tenantName}؟`)} className="min-h-10 rounded-xl border border-line bg-surface px-3 text-sm text-ink"><option value="free">مجاني</option><option value="starter">بداية</option><option value="pro">احترافي</option></select></label><label className="grid gap-1 text-xs text-muted"><span>حالة الاشتراك</span><select disabled={saving === row.tenantId} value={row.status} onChange={(event) => void mutate({ action: "set_subscription_status", tenantId: row.tenantId, status: event.target.value as AdminSubscriptionStatus }, `تغيير حالة اشتراك ${row.tenantName} إلى ${statusLabels[event.target.value as AdminSubscriptionStatus]}؟`)} className="min-h-10 rounded-xl border border-line bg-surface px-3 text-sm text-ink"><option value="trialing">تجربة</option><option value="active">نشط</option><option value="past_due">متأخر</option><option value="cancelled">ملغى</option></select></label><Button variant="outline" disabled={saving === row.tenantId || row.status !== "trialing"} onClick={() => void mutate({ action: "extend_trial", tenantId: row.tenantId, days: 7 }, `تمديد تجربة ${row.tenantName} لمدة 7 أيام؟`)}><Clock3 className="size-4" />تمديد 7 أيام</Button><Button variant="outline" disabled={saving === row.tenantId || row.status !== "trialing"} onClick={() => void mutate({ action: "end_trial", tenantId: row.tenantId }, `إنهاء تجربة ${row.tenantName} الآن؟`)}><CheckCircle2 className="size-4" />إنهاء التجربة</Button>{row.accountStatus === "frozen" ? <Button variant="outline" disabled={saving === row.tenantId} onClick={() => void mutate({ action: "unfreeze_account", tenantId: row.tenantId }, `استعادة حساب ${row.tenantName}؟`)}><UnlockKeyhole className="size-4" />إلغاء التجميد</Button> : <Button variant="outline" disabled={saving === row.tenantId || row.accountStatus === "blocked"} onClick={() => void mutate({ action: "freeze_account", tenantId: row.tenantId }, `تجميد حساب ${row.tenantName}؟ لن يتم حذف البيانات.`)}><Snowflake className="size-4" />تجميد الحساب</Button>}<div className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs text-muted"><LockKeyhole className="size-4" />كل تغيير يُسجل بالحالة السابقة واللاحقة</div></div>
          </div></article>)}
          {!loading && filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-line bg-paper p-8 text-center text-sm text-muted">لا توجد اشتراكات مطابقة.</div> : null}</div>
      </section>
    </div>
  </main>;
}
