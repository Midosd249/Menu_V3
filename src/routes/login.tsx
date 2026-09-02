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

function Login() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isPending, error: sessionError, refresh } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isPending) return <LoadingState label="جارٍ التحقق…" />;
  if (user) return <Navigate to="/studio" />;
  if (sessionError && !busy) {
    return <ErrorState message={sessionError} onRetry={refresh} />;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "").trim();
    setBusy(true);
    setError("");
    try {
      if (mode === "up") {
        const result = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
        });
        if (result.error) throw new Error(result.error.message);
      } else {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) throw new Error(result.error.message);
      }

      await refresh();
      await navigate({ to: "/studio", replace: true });
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t(copy.auth.error, lang));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-5 py-10 text-ink">
      <div className="w-full max-w-md grid gap-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold">
            {t(copy.brand, lang)}
          </Link>
          <LangToggle />
        </div>

        <div className="grid gap-2">
          <p className="text-sm font-medium text-accent">{lang === "ar" ? "بوابة Menu V3" : "Menu V3 workspace"}</p>
          <h1 className="font-display text-2xl font-semibold">{t(copy.auth.title, lang)}</h1>
          <p className="text-sm leading-6 text-muted">{t(copy.auth.subtitle, lang)}</p>
        </div>

        {authEnabled ? (
          <>
            <div className="grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => signIn(p.providerId, { callbackURL: "/studio" })}
                >
                  {p.providerId === "google" ? t(copy.auth.google, lang) : t(copy.auth.x, lang)}
                </Button>
              ))}
            </div>
            <p className="text-center text-xs text-muted">{t(copy.auth.or, lang)}</p>
            <form className="grid gap-3" onSubmit={onSubmit}>
              {mode === "up" ? (
                <Field label={t(copy.auth.name, lang)}>
                  <Input name="name" autoComplete="name" />
                </Field>
              ) : null}
              <Field label={t(copy.auth.email, lang)}>
                <Input name="email" type="email" required autoComplete="email" />
              </Field>
              <Field label={t(copy.auth.password, lang)}>
                <Input name="password" type="password" required minLength={8} autoComplete={mode === "up" ? "new-password" : "current-password"} />
              </Field>
              {error ? <p className="text-sm text-bad" role="alert">{error}</p> : null}
              <Button type="submit" disabled={busy}>
                {busy ? t(copy.state.loading, lang) : mode === "up" ? t(copy.auth.signUp, lang) : t(copy.auth.signIn, lang)}
              </Button>
            </form>
            <button
              type="button"
              className="text-sm text-ink-soft underline-offset-4 hover:underline"
              disabled={busy}
              onClick={() => setMode(mode === "up" ? "in" : "up")}
            >
              {mode === "up" ? t(copy.auth.haveAccount, lang) : t(copy.auth.noAccount, lang)}
            </button>
          </>
        ) : (
          <p className="text-sm text-muted">{t(copy.state.unavailable, lang)}</p>
        )}

        <section className="grid gap-3 border-t border-line pt-5" aria-label={lang === "ar" ? "مساحات العمل" : "Workspaces"}>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{lang === "ar" ? "مساحات العمل" : "Workspaces"}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link to="/studio" className="rounded-xl border border-line p-4 text-sm hover:bg-sand">
              <span className="font-semibold">{lang === "ar" ? "Studio" : "Studio"}</span>
              <span className="mt-1 block text-xs leading-5 text-muted">{lang === "ar" ? "إدارة المنيو والمنتجات والتصميم والفروع" : "Menu, products, design and branches"}</span>
            </Link>
            <Link to="/owner" className="rounded-xl border border-line p-4 text-sm hover:bg-sand">
              <span className="font-semibold">{lang === "ar" ? "Owner" : "Owner"}</span>
              <span className="mt-1 block text-xs leading-5 text-muted">{lang === "ar" ? "مركز الطلبات والعملاء المحتملين" : "Orders and lead center"}</span>
            </Link>
          </div>
        </section>

        <Link to="/" className="text-center text-sm text-muted underline-offset-4 hover:underline">
          {lang === "ar" ? "العودة إلى الموقع" : "Back to website"}
        </Link>
      </div>
    </main>
  );
}
