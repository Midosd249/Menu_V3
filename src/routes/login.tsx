import { useState } from "react";
import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { saveCustomerRegistrationPhone, validateCustomerRegistrationContract } from "@/lib/auth/customer-registration";
import { customerRegistrationSchema, GENERIC_REGISTRATION_ERROR } from "@/lib/auth/customer-registration-contract";
import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { LoadingState, ErrorState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { MarketingFooter } from "@/components/marketing-footer";

export const Route = createFileRoute("/login")({ component: Login });

function invitationToken() { if (typeof window === "undefined") return ""; const token = new URLSearchParams(window.location.search).get("invite")?.trim() || ""; return token.length >= 40 && token.length <= 200 ? token : ""; }
function initialMode(): "in" | "up" { if (typeof window === "undefined") return "in"; return new URLSearchParams(window.location.search).get("mode") === "signup" ? "up" : "in"; }

function Login() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isPending, error: sessionError, refresh } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">(initialMode);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const invite = invitationToken();

  if (isPending) return <LoadingState label="جارٍ التحقق…" />;
  if (user && invite) return <Navigate to="/invite/$token" params={{ token: invite }} />;
  if (user) return <Navigate to="/studio" />;
  if (sessionError && !busy) return <ErrorState message={sessionError} onRetry={refresh} />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = new FormData(e.currentTarget);
    const identity = String(form.get("identity") || "").trim();
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    setBusy(true); setError("");
    try {
      if (mode === "up") {
        const email = identity.toLowerCase();
        const contract = customerRegistrationSchema.safeParse({
          fullName: name,
          phone,
          email,
          password,
          confirmPassword,
        });
        if (!contract.success) {
          const issue = contract.error.issues[0];
          if (issue?.path[0] === "confirmPassword") {
            throw new Error(lang === "ar" ? "كلمتا المرور غير متطابقتين." : "Passwords do not match.");
          }
          if (issue?.path[0] === "fullName") {
            throw new Error(lang === "ar" ? "أدخل اسمك الكامل." : "Enter your full name.");
          }
          if (issue?.path[0] === "phone") {
            throw new Error(lang === "ar" ? "أدخل رقم الجوال." : "Enter your phone number.");
          }
          if (issue?.path[0] === "email") {
            throw new Error(lang === "ar" ? "أدخل بريدًا إلكترونيًا صحيحًا." : "Enter a valid email address.");
          }
          throw new Error(lang === "ar" ? "تحقق من بيانات التسجيل." : "Check your registration details.");
        }
        let validationResult: Awaited<ReturnType<typeof validateCustomerRegistrationContract>>;
        try {
          validationResult = await validateCustomerRegistrationContract({ data: contract.data });
        } catch {
          throw new Error(lang === "ar" ? "تحقق من بيانات التسجيل." : "Check your registration details.");
        }
        if (!validationResult.ok) {
          if (validationResult.code === "invalid") throw new Error(lang === "ar" ? "أدخل رقم جوال سعودي صحيح." : "Enter a valid Saudi phone number.");
          throw new Error(GENERIC_REGISTRATION_ERROR[lang]);
        }
        const result = await authClient.signUp.email({ email, password, name });
        if (result.error) throw new Error(GENERIC_REGISTRATION_ERROR[lang]);
        const phoneResult = await saveCustomerRegistrationPhone({ data: { phone } });
        if (!phoneResult.ok) {
          if (phoneResult.code === "invalid") throw new Error(lang === "ar" ? "أدخل رقم جوال سعودي صحيح." : "Enter a valid Saudi phone number.");
          throw new Error(GENERIC_REGISTRATION_ERROR[lang]);
        }
        await refresh();
        await navigate({ to: "/onboarding", replace: true });
        return;
      }
      if (loginMethod === "phone") {
        const result = await authClient.signIn.phoneNumber({ phoneNumber: identity, password });
        if (result.error) throw new Error(result.error.message);
      } else {
        const result = await authClient.signIn.email({ email: identity.toLowerCase(), password });
        if (result.error) throw new Error(result.error.message);
      }
      await refresh();
      if (invite) await navigate({ to: "/invite/$token", params: { token: invite }, replace: true });
      else await navigate({ to: "/studio", replace: true });
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t(copy.auth.error, lang));
    } finally { setBusy(false); }
  }

  const isPhoneLogin = mode === "in" && loginMethod === "phone";
  const signup = mode === "up";
  return <main dir={lang === "ar" ? "rtl" : "ltr"} className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
    <div className="w-full max-w-md grid gap-6">
      <div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">{t(copy.brand, lang)}</Link><LangToggle /></div>
      <div className="grid gap-2"><p className="text-sm font-medium text-accent">{lang === "ar" ? "ابدأ مع Menu V3" : "Start with Menu V3"}</p><h1 className="font-display text-2xl font-semibold">{signup ? (lang === "ar" ? "أنشئ حسابك مجانًا" : "Create your free account") : t(copy.auth.title, lang)}</h1><p className="text-sm leading-6 text-muted">{signup ? (lang === "ar" ? "أدخل بيانات حسابك، ثم أكمل بيانات المطعم في الخطوة التالية." : "Enter your account details, then complete your restaurant setup in the next step.") : (invite ? (lang === "ar" ? "سجّل الدخول بالحساب المدعو ثم أكمل قبول الدعوة." : "Sign in with the invited account, then accept the invitation.") : t(copy.auth.subtitle, lang))}</p></div>
      {authEnabled ? <>
        {!signup && <><div className="grid gap-2">{GROK_PROVIDERS.map((p) => <Button key={p.providerId} type="button" variant="outline" disabled={busy} onClick={() => signIn(p.providerId, { callbackURL: invite ? `/invite/${encodeURIComponent(invite)}` : "/studio" })}>{t(copy.auth.google, lang)}</Button>)}</div><p className="text-center text-xs text-muted">{t(copy.auth.or, lang)}</p></>}
        <form className="grid gap-3" onSubmit={onSubmit}>
          {signup ? <Field label={lang === "ar" ? "الاسم الكامل" : "Full name"}><Input name="name" required minLength={2} maxLength={100} autoComplete="name" /></Field> : null}
                    {signup ? <Field label={lang === "ar" ? "رقم الجوال السعودي" : "Saudi phone number"}><Input name="phone" type="tel" required minLength={8} maxLength={30} inputMode="tel" autoComplete="tel" placeholder="05XXXXXXXX" /></Field> : null}
          {mode === "in" ? <div className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-sand/20 p-1"><button type="button" className={`rounded-lg px-3 py-2 text-sm ${loginMethod === "email" ? "bg-paper font-medium shadow-sm" : "text-muted"}`} onClick={() => setLoginMethod("email")} disabled={busy}>{lang === "ar" ? "بالبريد" : "Email"}</button><button type="button" className={`rounded-lg px-3 py-2 text-sm ${loginMethod === "phone" ? "bg-paper font-medium shadow-sm" : "text-muted"}`} onClick={() => setLoginMethod("phone")} disabled={busy}>{lang === "ar" ? "بالجوال" : "Phone"}</button></div> : null}
          <Field label={mode === "up" || !isPhoneLogin ? t(copy.auth.email, lang) : (lang === "ar" ? "رقم الجوال" : "Phone number")}><Input name="identity" type={mode === "up" || !isPhoneLogin ? "email" : "tel"} required autoComplete={mode === "up" || !isPhoneLogin ? "email" : "tel"} placeholder={isPhoneLogin ? "+9665XXXXXXXX" : undefined} /></Field>
          <Field label={t(copy.auth.password, lang)}><Input name="password" type="password" required minLength={8} autoComplete={signup ? "new-password" : "current-password"} /></Field>
          {signup ? <Field label={lang === "ar" ? "تأكيد كلمة المرور" : "Confirm password"}><Input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" /></Field> : null}
          {isPhoneLogin ? <p className="text-xs leading-5 text-muted">{lang === "ar" ? "الدخول بالجوال متاح للحسابات التي تم اعتماد رقمها. لا نستخدم SMS OTP في التسجيل الحالي." : "Phone sign-in is available for accounts with an approved number. SMS OTP is not used for signup currently."}</p> : null}
          {signup ? <p className="text-xs leading-5 text-muted">{lang === "ar" ? "يُحفظ رقم الجوال مع الحساب للتحقق من بيانات التسجيل. لا تُستخدم هذه الصفحة لمنح صلاحيات أو اختيار مساحة عمل." : "Your phone is stored with the account as part of registration. This page does not grant permissions or select a workspace."}</p> : null}
          {error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}
          <Button type="submit" disabled={busy}>{busy ? t(copy.state.loading, lang) : signup ? (lang === "ar" ? "إنشاء الحساب" : "Create account") : t(copy.auth.signIn, lang)}</Button>
        </form>
        <button type="button" className="text-sm text-ink-soft underline-offset-4 hover:underline" disabled={busy} onClick={() => { const next = mode === "up" ? "in" : "up"; setMode(next); if (next === "up") setLoginMethod("email"); }}>{signup ? (lang === "ar" ? "لدي حساب بالفعل" : "I already have an account") : t(copy.auth.noAccount, lang)}</button>
      </> : <p className="text-sm text-muted">{t(copy.state.unavailable, lang)}</p>}
      <Link to="/" className="text-center text-sm text-muted underline-offset-4 hover:underline">{lang === "ar" ? "العودة إلى الموقع" : "Back to website"}</Link>
      <MarketingFooter />
    </div>
  </main>;
}
