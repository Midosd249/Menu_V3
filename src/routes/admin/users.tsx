import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, ShieldCheck, Smartphone, UserRound, UserX, Trash2 } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LangToggle } from "@/components/lang-toggle";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLang } from "@/lib/lang";
import { deletePlatformUser, getPlatformUsers, setPlatformUserBan, verifyPlatformUserPhone, type PlatformUser } from "@/lib/menu/platform-users";

export const Route = createFileRoute("/admin/users")({ component: PlatformUsersPage });

function PlatformUsersPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const result = await getPlatformUsers({ data: { q: query.trim() || undefined } });
      if (!result.ok) setError(result.error);
      else setUsers(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر تحميل الحسابات" : "Unable to load accounts"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      void navigate({ to: "/login", search: { redirect: "/admin/users" } as never, replace: true });
      return;
    }
    void load();
  }, [isPending, user]);

  useEffect(() => {
    if (isPending || !user) return;
    const timer = window.setTimeout(() => void load(), 250);
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

  if (isPending || !user) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted">{lang === "ar" ? "جارٍ التحقق من صلاحيات مالك المنصة…" : "Checking Platform Owner access…"}</div>;

  return <main className="mx-auto grid max-w-[1500px] gap-5 py-4 lg:py-8" dir={lang === "ar" ? "rtl" : "ltr"}>
    <header className="rounded-3xl border border-line bg-paper p-5 md:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/50 px-3 py-1 text-xs text-muted"><ShieldCheck className="size-3.5" /> Menu V3 · Platform Owner</div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">{lang === "ar" ? "إدارة الحسابات" : "Account Management"}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{lang === "ar" ? "عرض الحسابات، اعتماد أرقام العملاء، تجميد الحسابات، وإزالة الحسابات غير المرتبطة بمطاعم. لا يتم حذف بيانات مطعم قائم من هذا المسار." : "Review accounts, approve customer phone numbers, freeze accounts, and remove accounts that are not linked to restaurants. Restaurant data is never deleted from this path."}</p>
        </div>
        <div className="flex flex-wrap gap-2"><LangToggle /><Button variant="outline" onClick={() => void navigate({ to: "/admin" })}>لوحة المنصة</Button><Button variant="outline" disabled={loading} onClick={() => void load()}><RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />{lang === "ar" ? "تحديث" : "Refresh"}</Button></div>
      </div>
    </header>

    <section className="grid gap-3 rounded-3xl border border-line bg-sand/20 p-4">
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={lang === "ar" ? "ابحث بالاسم أو البريد أو الجوال" : "Search name, email, or phone"} />
      {error ? <div className="rounded-2xl border border-bad/30 bg-bad/5 px-4 py-3 text-sm text-bad" role="alert">{error}</div> : null}
      <div className="grid gap-3">
        {visible.map((target) => <article key={target.id} className="grid gap-4 rounded-2xl border border-line bg-paper p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="grid gap-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2"><strong className="text-base">{target.name || "—"}</strong>{target.isPlatformAdmin ? <span className="rounded-full bg-ink px-2 py-1 text-[11px] text-paper">Platform Owner</span> : null}{target.banned ? <span className="rounded-full bg-bad/10 px-2 py-1 text-[11px] text-bad">{lang === "ar" ? "مجمد" : "Frozen"}</span> : null}</div>
            <div className="grid gap-1 text-sm text-muted md:grid-cols-3"><span dir="ltr">{target.email || "—"}</span><span dir="ltr">{target.phoneNumber || "—"}</span><span>{target.tenantCount} {lang === "ar" ? "مساحة/ارتباط" : "workspace links"}</span></div>
            {target.banReason ? <p className="text-xs text-muted">{target.banReason}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {!target.isPlatformAdmin ? <>
              <Button variant="outline" disabled={busyId === target.id} onClick={() => void verifyPhone(target)}><Smartphone className="size-4" />{target.phoneVerified ? (lang === "ar" ? "الجوال معتمد" : "Phone verified") : (lang === "ar" ? "اعتماد الجوال" : "Verify phone")}</Button>
              <Button variant="outline" disabled={busyId === target.id} onClick={() => void toggleBan(target)}>{target.banned ? <UserRound className="size-4" /> : <UserX className="size-4" />}{target.banned ? (lang === "ar" ? "إلغاء التجميد" : "Unfreeze") : (lang === "ar" ? "تجميد" : "Freeze")}</Button>
              <Button variant="outline" disabled={busyId === target.id || target.tenantCount > 0} onClick={() => void remove(target)}><Trash2 className="size-4" />{lang === "ar" ? "حذف" : "Delete"}</Button>
            </> : <span className="inline-flex items-center gap-2 px-3 py-2 text-xs text-muted"><CheckCircle2 className="size-4" />{lang === "ar" ? "حساب محمي" : "Protected account"}</span>}
          </div>
        </article>)}
        {!loading && !visible.length ? <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-line p-6 text-sm text-muted">{lang === "ar" ? "لا توجد حسابات مطابقة." : "No matching accounts."}</div> : null}
      </div>
    </section>
  </main>;
}
