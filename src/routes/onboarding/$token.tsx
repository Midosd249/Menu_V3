import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, ExternalLink, QrCode, ShieldCheck } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { activateLeadOnboarding } from "@/lib/menu/platform-onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/onboarding/$token")({ component: OnboardingPage });

function OnboardingPage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const { user, isPending, refresh } = useCurrentUserState();
  const [mode, setMode] = useState<"up" | "in">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ slug: string; menuUrl: string } | null>(null);
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (user && !done) void activate();
  }, [user]);

  useEffect(() => {
    if (!done) return;
    let cancelled = false;
    void import("qrcode").then((QR) => QR.toDataURL(done.menuUrl, { width: 640, margin: 2, color: { dark: "#171411", light: "#ffffff" } }).then((data) => { if (!cancelled) setQr(data); }));
    return () => { cancelled = true; };
  }, [done]);

  const title = useMemo(() => mode === "up" ? "أنشئ حساب مطعمك" : "أكمل بحسابك", [mode]);

  async function activate() {
    if (busy) return;
    setBusy(true);
    setError("");
    const result = await activateLeadOnboarding({ data: { token } });
    if (result.ok) {
      setDone({ slug: result.data.slug, menuUrl: result.data.menuUrl });
      await refresh();
    } else {
      setError(result.error);
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "up") {
        const result = await authClient.signUp.email({ email: email.trim().toLowerCase(), password, name: name.trim() || email.split("@")[0] });
        if (result.error) throw new Error(result.error.message);
      } else {
        const result = await authClient.signIn.email({ email: email.trim().toLowerCase(), password });
        if (result.error) throw new Error(result.error.message);
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إنشاء الحساب");
      setBusy(false);
    }
  }

  if (isPending) return <main className="grid min-h-dvh place-items-center bg-paper p-5">جارٍ التحقق…</main>;
  if (done) return <main className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink"><section className="w-full max-w-2xl rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-sand/70"><CheckCircle2 className="size-6" /></span><div><p className="text-sm text-accent">Menu V3</p><h1 className="font-display text-2xl font-semibold">تم تجهيز مساحة مطعمك</h1></div></div><p className="mt-4 text-sm leading-6 text-muted">حسابك أصبح مرتبطًا بمساحة المطعم. يمكنك الآن الدخول إلى الاستوديو وإكمال الهوية والأصناف والثيم ونشر المنيو.</p><div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px]"><div className="grid content-start gap-3"><label className="text-sm font-medium">رابط المنيو</label><div className="flex gap-2"><Input readOnly value={done.menuUrl} /><Button type="button" variant="outline" onClick={() => void navigator.clipboard.writeText(done.menuUrl)} aria-label="نسخ رابط المنيو"><Copy className="size-4" /></Button></div><div className="flex flex-wrap gap-2"><Button type="button" onClick={() => void navigate({ to: "/studio" })}>فتح الاستوديو</Button><a href={done.menuUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm"><ExternalLink className="size-4" />معاينة المنيو</a></div></div>{qr ? <div className="rounded-2xl border border-line bg-white p-3"><img src={qr} alt="QR للمنيو" className="w-full" /><div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted"><QrCode className="size-3.5" /> QR المنيو</div></div> : <div className="aspect-square rounded-2xl bg-sand/60" />}</div></section></main>;

  return <main className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink"><section className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-sand/70"><ShieldCheck className="size-5" /></span><div><p className="text-sm text-accent">Menu V3</p><h1 className="font-display text-2xl font-semibold">{title}</h1></div></div><p className="mt-3 text-sm leading-6 text-muted">هذا رابط تسجيل مخصص من إدارة المنصة. بعد إنشاء الحساب سيتم تجهيز مساحة مطعمك تلقائيًا، ثم تحصل على رابط المنيو وQR.</p><form className="mt-6 grid gap-3" onSubmit={submit}>{mode === "up" ? <label className="grid gap-1.5 text-sm"><span>اسم المسؤول</span><Input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label> : null}<label className="grid gap-1.5 text-sm"><span>البريد الإلكتروني</span><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label><label className="grid gap-1.5 text-sm"><span>كلمة المرور</span><Input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "up" ? "new-password" : "current-password"} /></label>{error ? <p className="rounded-xl border border-bad/30 bg-bad/5 p-3 text-sm text-bad" role="alert">{error}</p> : null}<Button type="submit" disabled={busy}>{busy ? "جارٍ التجهيز…" : mode === "up" ? "إنشاء الحساب وتجهيز المطعم" : "دخول وتجهيز المطعم"}</Button></form><button type="button" className="mt-4 w-full text-sm text-muted underline-offset-4 hover:underline" disabled={busy} onClick={() => setMode(mode === "up" ? "in" : "up")}>{mode === "up" ? "لدي حساب بالفعل" : "أريد إنشاء حساب جديد"}</button></section></main>;
}
