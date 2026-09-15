import { useState } from "react";
import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { LoadingState, ErrorState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";

export const Route = createFileRoute("/login")({ component: Login });

function invitationToken() {
  if (typeof window === "undefined") return "";
  const token = new URLSearchParams(window.location.search).get("invite")?.trim() || "";
  return token.length >= 40 && token.length <= 200 ? token : "";
}

function Login() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isPending, error: sessionError, refresh } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
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
    const name = String(form.get("name") || "").trim();
    setBusy(true);
    setError("");
    try {
      if (mode === "up") {
        const email = identity.toLowerCase();
        const result = await authClient.signUp.email({ email, password, name: name || email.split("@")[0] });
        if (result.error) throw new Error(result.error.message);
      } else if (loginMethod === "phone") {
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
    } finally {
      setBusy(false);
    }
  }

  const isPhoneLogin = mode === "in" && loginMethod === "phone";
  return <main className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
    <div className="w-full max-w-md grid gap-6">
      <div className="flex items-center justify-between"><Link to="/" className="font-display text-xl font-semibold">{t(copy.brand, lang)}</Link><LangToggle /></div>
      <div className="grid gap-2"><p className="text-sm font-medium text-accent">{lang === "ar" ? "بوابة Menu V3" : "Menu V3 workspace"}</p><h1 className="font-display text-2xl font-semibold">{t(copy.auth.title, lang)}</h1><p className="text-sm leading-6 text-muted">{invite ? (lang === "ar" ? "سجّل الدخول بالحساب المدعو ثم أكمل قبول الدعوة." : "Sign in with the invited account, then accept the invitation.") : t(copy.auth.subtitle, lang)}</p></div>
      {authEnabled ? <>
        <div className="grid gap-2">{GROK_PROVIDERS.map((p) => <Button key={p.providerId} type="button" variant="outline" disabled={busy} onClick={() => signIn(p.providerId, { callbackURL: invite ? `/invite/${encodeURIComponent(invite)}` : "/studio" })}>{t(copy.auth.google, lang)}</Button>)}</div>
        <p className="text-center text-xs text-muted">{t(copy.auth.or, lang)}</p>
        <form className="grid gap-3" onSubmit={onSubmit}>
          {mode === "up" ? <Field label={t(copy.auth.name, lang)}><Input name="name" autoComplete="name" /></Field> : null}
          {mode === "in" ? <div className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-sand/20 p-1">
            <button type="button" className={`rounded-lg px-3 py-2 text-sm ${loginMethod === "email" ? "bg-paper font-medium shadow-sm" : "text-muted"}`} onClick={() => setLoginMethod("email")} disabled={busy}>{lang === "ar" ? "بالبريد" : "Email"}</button>
            <button type="button" className={`rounded-lg px-3 py-2 text-sm ${loginMethod === "phone" ? "bg-paper font-medium shadow-sm" : "text-muted"}`} onClick={() => setLoginMethod("phone")} disabled={busy}>{lang === "ar" ? "بالجوال" : "Phone"}</button>
          </div> : null}
          <Field label={mode === "up" || !isPhoneLogin ? t(copy.auth.email, lang) : (lang === "ar" ? "رقم الجوال" : "Phone number")}><Input name="identity" type={mode === "up" || !isPhoneLogin ? "email" : "tel"} required autoComplete={mode === "up" || !isPhoneLogin ? "email" : "tel"} placeholder={isPhoneLogin ? "+9665XXXXXXXX" : undefined} /></Field>
          <Field label={t(copy.auth.password, lang)}><Input name="password" type="password" required minLength={8} autoComplete={mode === "up" ? "new-password" : "current-password"} /></Field>
          {isPhoneLogin ? <p className="text-xs leading-5 text-muted">{lang === "ar" ? "يعمل الدخول بالجوال بعد اعتماد الرقم ضمن طلب الخدمة." : "Phone sign-in is available after the number is approved on the service request."}</p> : null}
          {error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}
          <Button type="submit" disabled={busy}>{busy ? t(copy.state.loading, lang) : mode === "up" ? t(copy.auth.signUp, lang) : t(copy.auth.signIn, lang)}</Button>
        </form>
        <button type="button" className="text-sm text-ink-soft underline-offset-4 hover:underline" disabled={busy} onClick={() => { const next = mode === "up" ? "in" : "up"; setMode(next); if (next === "up") setLoginMethod("email"); }}>{mode === "up" ? t(copy.auth.haveAccount, lang) : t(copy.auth.noAccount, lang)}</button>
      </> : <p className="text-sm text-muted">{t(copy.state.unavailable, lang)}</p>}
      <Link to="/" className="text-center text-sm text-muted underline-offset-4 hover:underline">{lang === "ar" ? "العودة إلى الموقع" : "Back to website"}</Link>
    </div>
  </main>;
}
