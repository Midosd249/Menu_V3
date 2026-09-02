import { useState } from "react";
import { ArrowUpLeft, BarChart3, Check, Palette, QrCode, Sparkles } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { submitLead } from "@/lib/menu/public";

export const Route = createFileRoute("/")({ component: Home });

const HERO_IMAGE = "https://cdn-pipeline-output.picsart.com/pipeline-output/d89fb75b-a8fa-4c54-9f4f-5ab0c7c6e4d7.png";
const MENU_IMAGE = "https://cdn-pipeline-output.picsart.com/pipeline-output/5dec344a-27fb-4da1-b99d-2669d11fd8c7.png";

function Home() {
  const { lang } = useLang();
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-ink text-paper shadow-sm transition-transform group-hover:-rotate-3">
              <span className="font-display text-lg">م</span>
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">{t(copy.brand, lang)}</span>
          </Link>
          <div className="flex items-center gap-2">
            <LangToggle />
            <SignedOut>
              <Link to="/login" className="hidden h-10 items-center rounded-xl border border-line px-3 text-sm sm:inline-flex">
                {t(copy.marketing.ctaLogin, lang)}
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/studio" className="inline-flex h-10 items-center rounded-xl bg-ink px-4 text-sm text-paper shadow-sm">
                {t(copy.nav.overview, lang)}
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-line/70">
          <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "radial-gradient(55% 70% at 10% 10%, rgba(154,90,56,.18), transparent 70%), radial-gradient(45% 60% at 90% 20%, rgba(23,20,17,.10), transparent 70%)" }} />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-16">
            <div className="grid max-w-2xl gap-7">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-paper/80 px-3 py-1.5 text-xs font-medium text-muted shadow-sm">
                <Sparkles className="size-3.5 text-accent" />
                {t(copy.marketing.heroEyebrow, lang)}
              </div>
              <div className="grid gap-5">
                <h1 className="font-display text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-[4.4rem]">
                  {t(copy.marketing.heroTitle, lang)}
                </h1>
                <p className="max-w-xl text-base leading-8 text-ink-soft sm:text-lg">
                  {t(copy.marketing.heroBody, lang)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-xl px-5 shadow-lg shadow-ink/10">
                  <Link to="/login">
                    {t(copy.marketing.ctaPrimary, lang)}
                    <ArrowUpLeft className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl bg-paper/70 px-5">
                  <Link to="/m/$slug" params={{ slug: "nafas" }}>{t(copy.marketing.ctaSecondary, lang)}</Link>
                </Button>
              </div>
              <div className="grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
                {[copy.marketing.proofA, copy.marketing.proofB, copy.marketing.proofC].map((item) => (
                  <div key={item.ar} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/10 text-accent"><Check className="size-3.5" /></span>
                    {t(item, lang)}
                  </div>
                ))}
              </div>
            </div>
            <LiveCard />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-5 py-12 sm:grid-cols-3 lg:py-16">
          <ValueCard icon={<Palette className="size-5" />} title={lang === "ar" ? "هوية بصرية راقية" : "Premium visual identity"} body={lang === "ar" ? "ألوان دافئة، صور قوية، وتسلسل بصري يجعل المنيو يبدو كمنتج حقيقي." : "Warm neutrals, strong imagery, and hierarchy that feels like a real product."} />
          <ValueCard icon={<QrCode className="size-5" />} title={lang === "ar" ? "من QR إلى المنيو فوراً" : "QR to menu instantly"} body={lang === "ar" ? "تجربة سريعة على الجوال، فروع متعددة، واتصال مباشر بالمطعم." : "Fast mobile experience, branches, and direct restaurant contact."} />
          <ValueCard icon={<BarChart3 className="size-5" />} title={lang === "ar" ? "بيانات قابلة للتصرف" : "Actionable data"} body={lang === "ar" ? "زيارات، مشاهدات الأصناف ومسح QR لتعرف ما يهم العملاء." : "Visits, product views, and QR scans so owners know what matters."} />
        </section>

        <section className="border-y border-line bg-sand/35">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:py-20">
            <div className="grid gap-4">
              <p className="text-sm font-medium text-accent">{t(copy.marketing.sectionProduct, lang)}</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{lang === "ar" ? "ليس مجرد رابط للمنيو." : "More than a menu link."}</h2>
              <p className="max-w-lg leading-7 text-ink-soft">{lang === "ar" ? "نصمم تجربة ضيافة رقمية تجمع العرض، الهوية، الفروع، التواصل والتحليلات في مكان واحد." : "A hospitality experience that brings presentation, identity, branches, contact, and analytics together."}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[[copy.marketing.f1t, copy.marketing.f1d], [copy.marketing.f2t, copy.marketing.f2d], [copy.marketing.f3t, copy.marketing.f3d]].map(([title, body]) => (
                <article key={title.ar} className="grid gap-3 rounded-2xl border border-line bg-paper p-5 shadow-sm">
                  <h3 className="text-base font-semibold">{t(title, lang)}</h3>
                  <p className="text-sm leading-6 text-ink-soft">{t(body, lang)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <LeadForm />
      </main>
      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>{t(copy.brand, lang)}</span>
        <span>{lang === "ar" ? "منصة Menu V3 — تجربة عربية أولاً" : "Menu V3 — Arabic-first hospitality experience"}</span>
      </footer>
    </div>
  );
}

function LiveCard() {
  const { lang } = useLang();
  return (
    <Link to="/m/$slug" params={{ slug: "nafas" }} className="group relative block min-h-[480px] overflow-hidden rounded-[2rem] bg-ink text-paper shadow-2xl shadow-ink/15">
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 size-full object-cover opacity-75 transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      <div className="relative flex min-h-[480px] flex-col justify-between p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-paper/20 bg-ink/30 px-3 py-1.5 text-xs backdrop-blur">{t(copy.marketing.liveExample, lang)}</span>
          <span className="grid size-10 place-items-center rounded-full bg-paper text-ink shadow-lg"><ArrowUpLeft className="size-4" /></span>
        </div>
        <div className="grid gap-2">
          <p className="text-xs uppercase tracking-[.22em] text-paper/65">Al Olaya · Riyadh</p>
          <p className="font-display text-4xl font-semibold">نَفَس</p>
          <p className="max-w-xs text-sm leading-6 text-paper/80">{lang === "ar" ? "قهوة مختصة ومخبوزات يومية — نموذج حي من Menu V3" : "Specialty coffee and daily pastry — a live Menu V3 demo"}</p>
        </div>
      </div>
    </Link>
  );
}

function ValueCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return <article className="grid gap-3 rounded-2xl border border-line bg-paper p-5 shadow-sm"><span className="grid size-10 place-items-center rounded-xl bg-ink text-paper">{icon}</span><h2 className="font-semibold">{title}</h2><p className="text-sm leading-6 text-ink-soft">{body}</p></article>;
}

function LeadForm() {
  const { lang } = useLang();
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [referenceId, setReferenceId] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("saving");
    setError("");
    const result = await submitLead({ data: {
      businessName: String(form.get("businessName") || ""), city: String(form.get("city") || ""), contactName: String(form.get("contactName") || ""), contactPhone: String(form.get("contactPhone") || ""), contactEmail: String(form.get("contactEmail") || ""), details: String(form.get("details") || ""),
    } });
    if (!result.ok) { setStatus("error"); setError(result.error); return; }
    setReferenceId(result.data.id.slice(0, 8).toUpperCase());
    setStatus("done");
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:py-24">
      <div className="grid content-start gap-4">
        <p className="text-sm font-medium text-accent">{lang === "ar" ? "ابدأ من هنا" : "Start here"}</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t(copy.marketing.leadTitle, lang)}</h2>
        <p className="max-w-lg leading-7 text-ink-soft">{t(copy.marketing.leadBody, lang)}</p>
        <div className="mt-3 rounded-2xl border border-line bg-sand/50 p-4 text-sm text-ink-soft">{lang === "ar" ? "يصل الطلب مباشرة إلى مركز إدارة المنصة، حيث يمكن متابعة الحالة والتواصل معك." : "Your request goes directly to the platform lead center for follow-up."}</div>
      </div>
      {status === "done" ? (
        <div className="grid content-center gap-4 rounded-[1.75rem] border border-line bg-sand/55 p-8 sm:p-10">
          <span className="grid size-12 place-items-center rounded-full bg-ink text-paper"><Check className="size-6" /></span>
          <h3 className="font-display text-2xl font-semibold">{lang === "ar" ? "تم استلام طلبك" : "Request received"}</h3>
          <p className="text-sm leading-6 text-ink-soft">{t(copy.marketing.sent, lang)}</p>
          <p className="font-mono text-xs text-muted">REF-{referenceId}</p>
        </div>
      ) : (
        <form className="grid gap-4 rounded-[1.75rem] border border-line bg-paper p-5 shadow-xl shadow-ink/5 sm:p-7" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={lang === "ar" ? "اسم المطعم" : "Restaurant name"}><Input name="businessName" required minLength={2} className="rounded-xl" /></Field>
            <Field label={lang === "ar" ? "المدينة" : "City"}><Input name="city" placeholder={lang === "ar" ? "الرياض" : "Riyadh"} className="rounded-xl" /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={lang === "ar" ? "اسم المسؤول" : "Contact name"}><Input name="contactName" required minLength={2} className="rounded-xl" /></Field>
            <Field label={lang === "ar" ? "الجوال / واتساب" : "Mobile / WhatsApp"}><Input name="contactPhone" required minLength={8} inputMode="tel" className="rounded-xl" /></Field>
          </div>
          <Field label={lang === "ar" ? "البريد (اختياري)" : "Email (optional)"}><Input name="contactEmail" type="email" className="rounded-xl" /></Field>
          <Field label={lang === "ar" ? "ما الذي تريد تطويره؟" : "What would you like to improve?"}><Textarea name="details" rows={4} className="rounded-xl" /></Field>
          {error ? <p className="text-sm text-bad">{error}</p> : null}
          <Button type="submit" disabled={status === "saving"} size="lg" className="rounded-xl">{status === "saving" ? t(copy.state.loading, lang) : t(copy.marketing.ctaPrimary, lang)}</Button>
        </form>
      )}
    </section>
  );
}
