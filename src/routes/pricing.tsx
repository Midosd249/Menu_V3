import { createFileRoute } from "@tanstack/react-router";
import { Check, ArrowUpLeft } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/lang";
import { COMMERCIAL_FEATURES, COMMERCIAL_PLANS } from "@/lib/menu/commercial-catalog";

export const Route = createFileRoute("/pricing")({ component: Pricing });

function Pricing() {
  const { lang } = useLang();
  const features = COMMERCIAL_FEATURES[lang];

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="font-display text-xl font-semibold">{lang === "ar" ? "منيو" : "Menu"}</Link>
          <div className="flex items-center gap-2"><LangToggle /><Link to="/login" className="hidden h-10 items-center rounded-xl bg-ink px-4 text-sm text-paper sm:inline-flex">{lang === "ar" ? "ابدأ الآن" : "Get started"}</Link></div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-5 pb-10 pt-14 text-center lg:pt-20">
          <p className="text-sm font-semibold text-accent">{lang === "ar" ? "أسعار واضحة بلا تعقيد" : "Clear pricing, without the noise"}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{lang === "ar" ? "اختر الباقة التي تناسب حجم مطعمك" : "Choose the plan that fits your restaurant"}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-soft">{lang === "ar" ? "كل الباقات تستخدم نفس تجربة المنيو والثيمات. الفرق الأساسي هو حدود الفروع والأصناف وأعضاء الفريق." : "Every plan uses the same menu experience and theme catalog. The core difference is the limits for branches, items, and team members."}</p>
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-muted">{lang === "ar" ? "الأسعار شهرية بالريال السعودي. الدفع الإلكتروني غير مفعل بعد؛ الترقية تتم عبر طلب مباشر حتى لا نعد بمسار دفع غير موجود." : "Prices are monthly in SAR. Online payment is not enabled yet; upgrades are handled by direct request rather than an unsupported checkout flow."}</p>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 md:grid-cols-3 lg:pb-24">
          {COMMERCIAL_PLANS.map((plan) => {
            const name = lang === "ar" ? plan.nameAr : plan.nameEn;
            return (
              <article key={plan.code} className={`relative flex flex-col rounded-3xl border p-6 shadow-sm ${plan.recommended ? "border-ink bg-ink text-paper shadow-xl shadow-ink/10" : "border-line bg-paper"}`}>
                {plan.recommended ? <span className="absolute -top-3 start-5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-paper">{lang === "ar" ? "الأكثر توازناً" : "Best fit"}</span> : null}
                <div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-2xl font-semibold">{name}</h2><p className={`mt-1 text-sm ${plan.recommended ? "text-paper/65" : "text-muted"}`}>{plan.code === "free" ? (lang === "ar" ? "للبداية" : "For getting started") : plan.code === "starter" ? (lang === "ar" ? "للمطاعم النامية" : "For growing restaurants") : (lang === "ar" ? "للمطاعم متعددة الفروع" : "For scaling restaurants")}</p></div></div>
                <div className="mt-6"><span className="font-display text-4xl font-semibold">{plan.monthlyPriceSar === 0 ? (lang === "ar" ? "مجاناً" : "Free") : plan.monthlyPriceSar}</span>{plan.monthlyPriceSar > 0 ? <span className={`ms-2 text-sm ${plan.recommended ? "text-paper/65" : "text-muted"}`}>{lang === "ar" ? "ر.س / شهر" : "SAR / month"}</span> : null}</div>
                <div className={`mt-6 grid gap-3 border-t pt-5 text-sm ${plan.recommended ? "border-paper/15" : "border-line"}`}>
                  <Limit label={lang === "ar" ? "الفروع" : "Branches"} value={plan.maxBranches} />
                  <Limit label={lang === "ar" ? "الأصناف" : "Menu items"} value={plan.maxProducts} />
                  <Limit label={lang === "ar" ? "أعضاء الفريق" : "Team members"} value={plan.maxTeamMembers} />
                </div>
                <ul className="mt-6 grid gap-3 text-sm">
                  {features.map((feature) => <li key={feature} className="flex items-start gap-2"><Check className={`mt-0.5 size-4 shrink-0 ${plan.recommended ? "text-accent" : "text-accent"}`} /><span>{feature}</span></li>)}
                </ul>
                <a href="/#commercial-contact" className={`mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium ${plan.recommended ? "bg-paper text-ink" : "bg-ink text-paper"}`}>
                  {plan.code === "free" ? (lang === "ar" ? "ابدأ مجاناً" : "Start free") : (lang === "ar" ? "اطلب الترقية" : "Request upgrade")}
                  <ArrowUpLeft className="size-4" />
                </a>
              </article>
            );
          })}
        </section>

        <section className="border-y border-line bg-sand/35">
          <div className="mx-auto max-w-4xl px-5 py-14 text-center">
            <h2 className="font-display text-2xl font-semibold">{lang === "ar" ? "لماذا لا نفرّق بين الثيمات والباقات؟" : "Why don't plans gate the themes?"}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink-soft">{lang === "ar" ? "الهوية البصرية جزء من قيمة المنصة وليست حاجزاً مصطنعاً للبيع. الباقة ترتفع عندما يكبر التشغيل: فروع أكثر، أصناف أكثر، وفريق أكبر." : "Visual identity is part of the product value, not an artificial sales gate. The plan should grow with operations: more branches, items, and team members."}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

function Limit({ label, value }: { label: string; value: number }) {
  return <div className="flex items-center justify-between gap-3"><span className="text-muted">{label}</span><strong className="tabular">{value.toLocaleString()}</strong></div>;
}
