import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpLeft, Check } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { submitLead } from "@/lib/menu/public";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { lang } = useLang();
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          {t(copy.brand, lang)}
        </Link>
        <div className="flex items-center gap-2">
          <LangToggle />
          <SignedOut>
            <Link
              to="/login"
              className="inline-flex h-10 items-center rounded-md border border-line px-3 text-sm"
            >
              {t(copy.marketing.ctaLogin, lang)}
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/studio" className="inline-flex h-10 items-center rounded-md bg-ink px-3 text-sm text-paper">
              {t(copy.nav.overview, lang)}
            </Link>
          </SignedIn>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-5xl gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="grid max-w-xl gap-6">
            <p className="text-sm tracking-wide text-muted">{t(copy.marketing.heroEyebrow, lang)}</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.15] sm:text-5xl">
              {t(copy.marketing.heroTitle, lang)}
            </h1>
            <p className="text-base text-ink-soft sm:text-lg">{t(copy.marketing.heroBody, lang)}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/login">
                  {t(copy.marketing.ctaPrimary, lang)}
                  <ArrowUpLeft className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/m/$slug" params={{ slug: "nafas" }}>
                  {t(copy.marketing.ctaSecondary, lang)}
                </Link>
              </Button>
            </div>
            <ul className="grid gap-2 text-sm text-ink-soft">
              {[copy.marketing.proofA, copy.marketing.proofB, copy.marketing.proofC].map((item) => (
                <li key={item.ar} className="flex items-center gap-2">
                  <Check className="size-4 text-accent" />
                  {t(item, lang)}
                </li>
              ))}
            </ul>
          </div>
          <LiveCard />
        </section>

        <section className="border-y border-line bg-sand/40">
          <div className="mx-auto grid max-w-5xl gap-8 px-5 py-14 md:grid-cols-3">
            <p className="md:col-span-3 text-sm text-muted">{t(copy.marketing.sectionProduct, lang)}</p>
            {[
              [copy.marketing.f1t, copy.marketing.f1d],
              [copy.marketing.f2t, copy.marketing.f2d],
              [copy.marketing.f3t, copy.marketing.f3d],
            ].map(([title, body]) => (
              <article key={title.ar} className="grid gap-2 rounded-xl bg-paper p-5 hairline">
                <h2 className="text-lg font-semibold">{t(title, lang)}</h2>
                <p className="text-sm text-ink-soft">{t(body, lang)}</p>
              </article>
            ))}
          </div>
        </section>

        <LeadForm />
      </main>
      <footer className="mx-auto max-w-5xl px-5 py-10 text-sm text-muted">
        {t(copy.brand, lang)} · {lang === "ar" ? "منصة مستقلة عن النسخة السابقة" : "Independent from the previous version"}
      </footer>
    </div>
  );
}

function LiveCard() {
  const { lang } = useLang();
  return (
    <Link
      to="/m/$slug"
      params={{ slug: "nafas" }}
      className="block overflow-hidden rounded-xl bg-ink text-paper hairline"
    >
      <div className="h-36 bg-[radial-gradient(80%_80%_at_80%_0%,#9a5a38,transparent),linear-gradient(#1c1712,#0d0b09)]" />
      <div className="grid gap-2 p-5">
        <p className="text-xs text-paper/60">{t(copy.marketing.liveExample, lang)}</p>
        <p className="font-display text-2xl">نَفَس</p>
        <p className="text-sm text-paper/70">
          {lang === "ar" ? "قهوة مختصة ومخبوزات يومية في العليا" : "Specialty coffee and daily pastry in Al Olaya"}
        </p>
        <p className="text-xs text-paper/50">{t(copy.marketing.liveHint, lang)}</p>
      </div>
    </Link>
  );
}

function LeadForm() {
  const { lang } = useLang();
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("saving");
    setError("");
    const result = await submitLead({
      data: {
        businessName: String(form.get("businessName") || ""),
        city: String(form.get("city") || ""),
        contactName: String(form.get("contactName") || ""),
        contactPhone: String(form.get("contactPhone") || ""),
        contactEmail: String(form.get("contactEmail") || ""),
        details: String(form.get("details") || ""),
      },
    });
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("done");
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-5 py-16 lg:grid-cols-2">
      <div className="grid content-start gap-3">
        <h2 className="font-display text-3xl font-semibold">{t(copy.marketing.leadTitle, lang)}</h2>
        <p className="text-ink-soft">{t(copy.marketing.leadBody, lang)}</p>
      </div>
      {status === "done" ? (
        <p className="rounded-xl border border-line bg-sand/50 p-6 text-lg">{t(copy.marketing.sent, lang)}</p>
      ) : (
        <form className="grid gap-3 rounded-xl bg-paper p-5 hairline" onSubmit={onSubmit}>
          <Field label={lang === "ar" ? "اسم المطعم" : "Restaurant name"}>
            <Input name="businessName" required minLength={2} />
          </Field>
          <Field label={lang === "ar" ? "المدينة" : "City"}>
            <Input name="city" placeholder={lang === "ar" ? "الرياض" : "Riyadh"} />
          </Field>
          <Field label={lang === "ar" ? "اسم المسؤول" : "Contact name"}>
            <Input name="contactName" required minLength={2} />
          </Field>
          <Field label={lang === "ar" ? "الجوال / واتساب" : "Mobile / WhatsApp"}>
            <Input name="contactPhone" required minLength={8} inputMode="tel" />
          </Field>
          <Field label={lang === "ar" ? "البريد (اختياري)" : "Email (optional)"}>
            <Input name="contactEmail" type="email" />
          </Field>
          <Field label={lang === "ar" ? "تفاصيل" : "Details"}>
            <Textarea name="details" rows={3} />
          </Field>
          {error ? <p className="text-sm text-bad">{error}</p> : null}
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? t(copy.state.loading, lang) : t(copy.marketing.ctaPrimary, lang)}
          </Button>
        </form>
      )}
    </section>
  );
}
