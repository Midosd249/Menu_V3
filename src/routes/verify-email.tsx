import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { LangToggle } from "@/components/lang-toggle";
import { MarketingFooter } from "@/components/marketing-footer";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/verify-email")({ component: VerifyEmail });

function VerifyEmail() {
  const { lang } = useLang();
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    try { return window.sessionStorage.getItem("menuun.pending-registration-email") ?? ""; } catch { return ""; }
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function resend() {
    if (busy || !email.trim()) return;
    setBusy(true); setMessage(""); setError("");
    try {
      const result = await authClient.sendVerificationEmail({
        email: email.trim().toLowerCase(),
        callbackURL: "/login?verified=1",
      });
      if (result.error) throw new Error(result.error.message ?? "Unable to send verification email.");
      setMessage(lang === "ar" ? "تم إرسال رسالة تحقق جديدة. تحقق من بريدك الوارد أو مجلد الرسائل غير المرغوب فيها." : "A new verification email was sent. Check your inbox or spam folder.");
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "ar" ? "تعذر إرسال رسالة التحقق." : "Unable to send the verification email."));
    } finally { setBusy(false); }
  }

  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
    <div className="w-full max-w-md grid gap-6">
      <div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">Menuun</Link><LangToggle /></div>
      <section className="grid gap-4 rounded-2xl border border-line bg-paper p-6 shadow-sm">
        <div className="grid gap-2"><p className="text-sm font-medium text-accent">{lang === "ar" ? "الخطوة التالية" : "Next step"}</p><h1 className="font-display text-2xl font-semibold">{lang === "ar" ? "تحقق من بريدك الإلكتروني" : "Verify your email"}</h1><p className="text-sm leading-6 text-muted">{lang === "ar" ? "أرسلنا رابط تحقق إلى بريدك الإلكتروني. تحقق من الرسالة ثم عد لتسجيل الدخول." : "We sent a verification link to your email. Verify it, then return to sign in."}</p></div>
        <Field label={lang === "ar" ? "البريد الإلكتروني" : "Email"}><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></Field>
        {message ? <p className="text-sm text-ink-soft" role="status">{message}</p> : null}
        {error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}
        <Button type="button" disabled={busy || !email.trim()} onClick={() => void resend()}>{busy ? (lang === "ar" ? "جارٍ الإرسال…" : "Sending…") : (lang === "ar" ? "إعادة إرسال رسالة التحقق" : "Resend verification email")}</Button>
        <Link to="/login" className="text-center text-sm text-muted underline-offset-4 hover:underline">{lang === "ar" ? "العودة لتسجيل الدخول" : "Back to sign in"}</Link>
      </section>
      <MarketingFooter />
    </div>
  </main>;
}
