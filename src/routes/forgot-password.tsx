import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { LangToggle } from "@/components/lang-toggle";
import { MarketingFooter } from "@/components/marketing-footer";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });

function ForgotPassword() {
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setMessage(""); setError("");
    try {
      const result = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: "/reset-password",
      });
      if (result.error) throw new Error(result.error.message ?? "Unable to request password reset.");
      setMessage(lang === "ar" ? "إذا كان البريد مسجلًا، ستصلك رسالة لإعادة تعيين كلمة المرور. تحقق من بريدك الوارد أو مجلد الرسائل غير المرغوب فيها." : "If this email is registered, you will receive a password reset message. Check your inbox or spam folder.");
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر إرسال طلب إعادة التعيين." : "Unable to request a password reset."));
    } finally { setBusy(false); }
  }

  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
    <div className="w-full max-w-md grid gap-6">
      <div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">Menuun</Link><LangToggle /></div>
      <section className="grid gap-4 rounded-2xl border border-line bg-paper p-6 shadow-sm">
        <div className="grid gap-2"><p className="text-sm font-medium text-accent">{lang === "ar" ? "استعادة الحساب" : "Account recovery"}</p><h1 className="font-display text-2xl font-semibold">{lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot your password?"}</h1><p className="text-sm leading-6 text-muted">{lang === "ar" ? "أدخل بريدك وسنرسل رابطًا آمنًا لإعادة تعيين كلمة المرور." : "Enter your email and we’ll send a secure password reset link."}</p></div>
        <form className="grid gap-3" onSubmit={submit}>
          <Field label={lang === "ar" ? "البريد الإلكتروني" : "Email"}><Input name="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></Field>
          {message ? <p className="text-sm text-ink-soft" role="status">{message}</p> : null}
          {error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}
          <Button type="submit" disabled={busy}>{busy ? (lang === "ar" ? "جارٍ الإرسال…" : "Sending…") : (lang === "ar" ? "إرسال رابط إعادة التعيين" : "Send reset link")}</Button>
        </form>
        <Link to="/login" className="text-center text-sm text-muted underline-offset-4 hover:underline">{lang === "ar" ? "العودة لتسجيل الدخول" : "Back to sign in"}</Link>
      </section>
      <MarketingFooter />
    </div>
  </main>;
}
