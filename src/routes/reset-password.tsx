import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { LangToggle } from "@/components/lang-toggle";
import { MarketingFooter } from "@/components/marketing-footer";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/reset-password")({ component: ResetPassword });

function ResetPassword() {
  const { lang } = useLang();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token")?.trim() ?? "";
  const invalid = typeof window !== "undefined" && Boolean(new URLSearchParams(window.location.search).get("error"));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !token) return;
    if (password.length < 8) {
      setError(lang === "ar" ? "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل." : "Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError(lang === "ar" ? "كلمتا المرور غير متطابقتين." : "Passwords do not match.");
      return;
    }
    setBusy(true); setError("");
    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) throw new Error(result.error.message ?? "Unable to reset password.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر إعادة تعيين كلمة المرور." : "Unable to reset your password."));
    } finally { setBusy(false); }
  }

  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
    <div className="w-full max-w-md grid gap-6">
      <div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">Menuun</Link><LangToggle /></div>
      <section className="grid gap-4 rounded-2xl border border-line bg-paper p-6 shadow-sm">
        {done ? <>
          <h1 className="font-display text-2xl font-semibold">{lang === "ar" ? "تم تحديث كلمة المرور" : "Password updated"}</h1>
          <p className="text-sm leading-6 text-muted">{lang === "ar" ? "تم تحديث كلمة المرور وإلغاء الجلسات الأخرى. سجّل الدخول باستخدام كلمة المرور الجديدة." : "Your password was updated and other sessions were revoked. Sign in with your new password."}</p>
          <Button asChild><Link to="/login">{lang === "ar" ? "تسجيل الدخول" : "Sign in"}</Link></Button>
        </> : <>
          <div className="grid gap-2"><p className="text-sm font-medium text-accent">{lang === "ar" ? "أمان الحساب" : "Account security"}</p><h1 className="font-display text-2xl font-semibold">{lang === "ar" ? "إعادة تعيين كلمة المرور" : "Reset your password"}</h1><p className="text-sm leading-6 text-muted">{invalid || !token ? (lang === "ar" ? "رابط إعادة التعيين غير صالح أو منتهي. اطلب رابطًا جديدًا." : "This reset link is invalid or expired. Request a new one.") : (lang === "ar" ? "اختر كلمة مرور جديدة لحسابك." : "Choose a new password for your account.")}</p></div>
          {!invalid && token ? <form className="grid gap-3" onSubmit={submit}>
            <Field label={lang === "ar" ? "كلمة المرور الجديدة" : "New password"}><Input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></Field>
            <Field label={lang === "ar" ? "تأكيد كلمة المرور" : "Confirm password"}><Input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></Field>
            {error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}
            <Button type="submit" disabled={busy}>{busy ? (lang === "ar" ? "جارٍ الحفظ…" : "Saving…") : (lang === "ar" ? "تحديث كلمة المرور" : "Update password")}</Button>
          </form> : <Button asChild variant="outline"><Link to="/forgot-password">{lang === "ar" ? "طلب رابط جديد" : "Request a new link"}</Link></Button>}
        </>}
      </section>
      <MarketingFooter />
    </div>
  </main>;
}
