import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpLeft, BarChart3, Check, ChevronDown, ExternalLink, GitBranch, Globe2,
  Layers3, Menu, ScanLine, Sparkles, Smartphone, Store, X, QrCode,
} from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useLang } from "@/lib/lang";
import { submitLead } from "@/lib/menu/public";
import { COMMERCIAL_PLANS } from "@/lib/menu/commercial-catalog";
import { MENU_THEMES, normalizeThemeKey, type ThemeKey } from "@/lib/theme";
import "./index.css";

export const Route = createFileRoute("/")({ component: Home });

const FEATURES = [
  { icon: QrCode, ar: "منيو رقمي", en: "Digital menu", bodyAr: "منيو جذاب وسهل المشاركة عبر QR ورابط مباشر.", bodyEn: "A polished menu that is easy to share by QR and public link." },
  { icon: Smartphone, ar: "تجربة جوال", en: "Mobile experience", bodyAr: "تجربة سريعة وواضحة للضيف على أي هاتف.", bodyEn: "A fast, clear guest experience on every phone." },
  { icon: BarChart3, ar: "تحليلات واضحة", en: "Actionable analytics", bodyAr: "افهم الزيارات ومشاهدات الأصناف وما يهم ضيوفك.", bodyEn: "Understand visits, product views, and what guests care about." },
  { icon: GitBranch, ar: "إدارة فروع", en: "Branch management", bodyAr: "لكل فرع رابط ومنيو وإعدادات مستقلة ضمن قدرات المنصة.", bodyEn: "Branch-aware links, menus, and settings within the platform." },
  { icon: Globe2, ar: "عربي وإنجليزي", en: "Arabic & English", bodyAr: "لغة واضحة واتجاه RTL/LTR مصمم من الأساس.", bodyEn: "Intentional Arabic RTL and English LTR presentation." },
  { icon: Sparkles, ar: "تحديث فوري", en: "Instant updates", bodyAr: "غيّر سعراً أو أضف صنفاً ثم انشر دون إعادة طباعة.", bodyEn: "Update prices or products and publish without reprinting." },
] as const;

const STEPS = [
  { n: "01", icon: Store, ar: "أنشئ حسابك", en: "Create your account", bodyAr: "اختر اسم مطعمك وأضف أساسيات الهوية.", bodyEn: "Set your restaurant name and core brand details." },
  { n: "02", icon: Layers3, ar: "أضف المنيو والفروع", en: "Add menu & branches", bodyAr: "رتّب الأصناف والأسعار وأماكن الخدمة.", bodyEn: "Organize products, prices, and service locations." },
  { n: "03", icon: ScanLine, ar: "شارك QR والرابط", en: "Share QR & link", bodyAr: "اجعل التجربة جاهزة لزوارك خلال دقائق.", bodyEn: "Put the experience in front of guests in minutes." },
] as const;

const FAQS = [
  { qAr: "هل أحتاج خبرة تقنية؟", qEn: "Do I need technical experience?", aAr: "لا. صُممت المنصة ليتمكن فريق المطعم من إدارة الأصناف وتحديث المنيو من خلال واجهة واضحة دون كتابة كود.", aEn: "No. The platform is designed so restaurant teams can manage products and update the menu through a clear interface without writing code." },
  { qAr: "هل يدعم العربية والإنجليزية؟", qEn: "Does it support Arabic and English?", aAr: "نعم. Menu V3 مبني على تجربة عربية أولاً مع دعم الإنجليزية واتجاه RTL/LTR.", aEn: "Yes. Menu V3 is Arabic-first with English and intentional RTL/LTR support." },
  { qAr: "هل أستطيع إدارة أكثر من فرع؟", qEn: "Can I manage multiple branches?", aAr: "نعم، حسب حدود الباقة. لكل فرع سياقه وروابطه مع الحفاظ على إدارة موحدة.", aEn: "Yes, within the selected plan limits, with branch-aware context and centralized management." },
  { qAr: "هل يمكن تحديث الأسعار فوراً؟", qEn: "Can I update prices immediately?", aAr: "نعم. بعد نشر التعديل، تتبع المنصة مسار نشر المحتوى العام الموجود في Menu V3.", aEn: "Yes. After publishing, Menu V3 propagates the updated public content through its existing publishing path." },
  { qAr: "هل يوجد رابط عام للمطعم والمنيو؟", qEn: "Is there a public restaurant/menu link?", aAr: "نعم. المنصة توفر رابطاً عاماً للمنيو ومعلومات المطعم، ويمكن استخدامه مع QR والمشاركة المباشرة.", aEn: "Yes. The platform provides a public menu/restaurant link that can be used with QR and direct sharing." },
] as const;

function Home() {
  const { lang } = useLang();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey | "">("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    const theme = params.get("theme")?.toLowerCase();
    const validPlan = Boolean(plan && COMMERCIAL_PLANS.some((item) => item.code === plan));
    const validTheme = theme ? normalizeThemeKey(theme) : null;
    if (plan && validPlan) setSelectedPlan(plan);
    if (validTheme) setSelectedTheme(validTheme);
    if (validPlan || validTheme) window.setTimeout(() => document.getElementById("request-service")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }, []);

  function choose(plan = "", theme: ThemeKey | "" = "") {
    setSelectedPlan(plan);
    setSelectedTheme(theme);
    setMobileOpen(false);
    window.requestAnimationFrame(() => document.getElementById("request-service")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const navItems = [
    ["#features", lang === "ar" ? "المميزات" : "Features"], ["#themes", lang === "ar" ? "التصاميم" : "Themes"],
    ["#how", lang === "ar" ? "كيف تعمل" : "How it works"], ["#pricing", lang === "ar" ? "الباقات" : "Pricing"], ["#faq", lang === "ar" ? "الأسئلة الشائعة" : "FAQ"],
  ] as const;
  const themeCards = useMemo(() => MENU_THEMES.map((theme) => ({ ...theme })), []);

  return <main className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
      <Link to="/" className="font-semibold tracking-tight">Menu V3</Link>
      <nav className="hidden items-center gap-6 md:flex">{navItems.map(([href, label]) => <a key={href} href={href} className="text-sm text-muted-foreground transition hover:text-foreground">{label}</a>)}</nav>
      <div className="flex items-center gap-2"><LangToggle /><SignedOut><Button asChild size="sm"><Link to="/auth/sign-in">{lang === "ar" ? "دخول" : "Sign in"}</Link></Button></SignedOut><SignedIn><Button asChild size="sm"><Link to="/studio">{lang === "ar" ? "الاستوديو" : "Studio"}</Link></Button></SignedIn><button aria-label={lang === "ar" ? "فتح القائمة" : "Open menu"} className="rounded-md p-2 md:hidden" onClick={() => setMobileOpen((v) => !v)}>{mobileOpen ? <X size={20}/> : <Menu size={20}/>}</button></div>
    </div>{mobileOpen && <nav className="border-t px-4 py-3 md:hidden">{navItems.map(([href, label]) => <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm">{label}</a>)}</nav>}</header>

    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24"><div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
      <div className="max-w-3xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"><Sparkles size={14}/> {lang === "ar" ? "منيو رقمي عربي أولاً" : "Arabic-first digital menus"}</div><h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">{lang === "ar" ? "حوّل منيو مطعمك إلى تجربة تستحق الزيارة." : "Turn your restaurant menu into an experience worth visiting."}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{lang === "ar" ? "Menu V3 يمنح المطاعم والكافيهات منيو سريعاً، أنيقاً، ثنائي اللغة، ومصمماً ليعمل على الجوال من أول لمسة." : "Menu V3 gives restaurants and cafés a fast, elegant, bilingual menu designed mobile-first from the first tap."}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" onClick={() => choose()}>{lang === "ar" ? "ابدأ طلبك" : "Start your request"}<ArrowUpLeft className="ms-2" size={18}/></Button><Button asChild size="lg" variant="outline"><Link to="/themes/preview">{lang === "ar" ? "شاهد التصاميم" : "Explore themes"}<ExternalLink className="ms-2" size={17}/></Link></Button></div><div className="mt-8 grid max-w-xl grid-cols-3 gap-4 text-sm"><div><strong className="block text-xl">5</strong><span className="text-muted-foreground">{lang === "ar" ? "تصاميم" : "Themes"}</span></div><div><strong className="block text-xl">RTL</strong><span className="text-muted-foreground">{lang === "ar" ? "من الأساس" : "Native"}</span></div><div><strong className="block text-xl">QR</strong><span className="text-muted-foreground">{lang === "ar" ? "ومشاركة" : "& sharing"}</span></div></div></div>
      <div className="relative mx-auto w-full max-w-xl"><div className="rounded-[2rem] border bg-muted/40 p-3 shadow-2xl"><div className="overflow-hidden rounded-[1.5rem] border bg-background"><div className="aspect-[4/3] bg-gradient-to-br from-muted to-background p-5"><div className="flex items-center justify-between text-xs text-muted-foreground"><span>Menu V3</span><span>● Open</span></div><div className="mt-12 max-w-xs"><p className="text-xs uppercase tracking-[.22em] text-muted-foreground">Restaurant</p><h2 className="mt-2 text-4xl font-semibold">Taste your story.</h2><p className="mt-3 text-sm text-muted-foreground">{lang === "ar" ? "قائمة مختارة بعناية" : "A carefully curated menu"}</p></div><div className="mt-10 grid grid-cols-2 gap-3"><div className="aspect-square rounded-xl bg-muted"/><div className="aspect-square rounded-xl bg-muted"/></div></div></div></div></div></div>
    </div></section>

    <section id="features" className="border-y bg-muted/30 px-4 py-20 sm:px-6"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-sm font-medium">{lang === "ar" ? "مصمم للمطاعم" : "Built for restaurants"}</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{lang === "ar" ? "كل ما يحتاجه المنيو الحديث، في تجربة واحدة." : "Everything a modern menu needs, in one experience."}</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{FEATURES.map(({icon: Icon, ar, en, bodyAr, bodyEn}) => <article key={en} className="rounded-2xl border bg-background p-6"><Icon size={22}/><h3 className="mt-5 text-lg font-semibold">{lang === "ar" ? ar : en}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{lang === "ar" ? bodyAr : bodyEn}</p></article>)}</div></div></section>

    <section id="themes" className="px-4 py-20 sm:px-6"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-medium">{lang === "ar" ? "هوية قبل القالب" : "Identity before template"}</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{lang === "ar" ? "اختر الأسلوب الذي يشبه مطعمك." : "Choose the style that fits your restaurant."}</h2></div><Button asChild variant="outline"><Link to="/themes/preview">{lang === "ar" ? "معاينة كاملة" : "Full preview"}</Link></Button></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{themeCards.map((theme) => <article key={theme.key} className="group overflow-hidden rounded-2xl border bg-background"><div className="aspect-[16/10] bg-muted bg-cover bg-center" style={{ backgroundImage: `url(${theme.preview.image})` }}/><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold">{theme.name[lang]}</h3><p className="mt-1 text-sm text-muted-foreground">{theme.description[lang]}</p></div><span className="rounded-full border px-2 py-1 text-[11px]">{theme.tier === "free" ? (lang === "ar" ? "مجاني" : "Free") : theme.tier}</span></div><Button className="mt-5 w-full" variant="outline" onClick={() => choose("", theme.key)}>{lang === "ar" ? "اختر هذا التصميم" : "Choose this theme"}</Button></div></article>)}</div></div></section>

    <section id="how" className="bg-foreground px-4 py-20 text-background sm:px-6"><div className="mx-auto max-w-7xl"><h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">{lang === "ar" ? "من الفكرة إلى QR خلال خطوات واضحة." : "From idea to QR in three clear steps."}</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{STEPS.map(({n, icon: Icon, ar, en, bodyAr, bodyEn}) => <article key={n} className="rounded-2xl border border-background/15 p-6"><div className="flex items-center justify-between"><span className="text-sm opacity-60">{n}</span><Icon size={22}/></div><h3 className="mt-12 text-xl font-semibold">{lang === "ar" ? ar : en}</h3><p className="mt-2 text-sm leading-6 opacity-70">{lang === "ar" ? bodyAr : bodyEn}</p></article>)}</div></div></section>

    <section id="pricing" className="px-4 py-20 sm:px-6"><div className="mx-auto max-w-7xl"><div><p className="text-sm font-medium">{lang === "ar" ? "باقات واضحة" : "Simple plans"}</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{lang === "ar" ? "ابدأ بما يناسب حجم عملك." : "Start with the plan that fits your business."}</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{COMMERCIAL_PLANS.map((plan, index) => <article key={plan.code} className={`rounded-2xl border p-6 ${index === 1 ? "ring-2 ring-foreground" : ""}`}><h3 className="text-xl font-semibold">{lang === "ar" ? plan.nameAr : plan.nameEn}</h3><div className="mt-5 text-4xl font-semibold">{plan.monthlyPriceSar} <span className="text-sm font-normal text-muted-foreground">{lang === "ar" ? "ريال / شهر" : "SAR / month"}</span></div><ul className="mt-6 space-y-3 text-sm"><li className="flex gap-2"><Check size={17}/>{lang === "ar" ? `${plan.maxBranches} فرع` : `${plan.maxBranches} branch${plan.maxBranches === 1 ? "" : "es"}`}</li><li className="flex gap-2"><Check size={17}/>{lang === "ar" ? `${plan.maxProducts.toLocaleString("ar-SA")} صنف` : `${plan.maxProducts.toLocaleString("en-US")} products`}</li><li className="flex gap-2"><Check size={17}/>{lang === "ar" ? `${plan.maxTeamMembers} أعضاء فريق` : `${plan.maxTeamMembers} team members`}</li></ul><Button className="mt-7 w-full" onClick={() => choose(plan.code)}>{selectedPlan === plan.code ? (lang === "ar" ? "الباقة مختارة" : "Plan selected") : (lang === "ar" ? "اختر الباقة" : "Choose plan")}</Button></article>)}</div><p className="mt-5 text-center text-xs text-muted-foreground">{lang === "ar" ? "الأسعار الشهرية الحالية فقط؛ لا يوجد تسعير سنوي مُعرّف في الكتالوج الحالي." : "Current monthly pricing only; the catalog does not define annual pricing."}</p></div></section>

    <section id="faq" className="border-y bg-muted/30 px-4 py-20 sm:px-6"><div className="mx-auto max-w-4xl"><h2 className="text-3xl font-semibold sm:text-4xl">{lang === "ar" ? "الأسئلة الشائعة" : "Frequently asked questions"}</h2><div className="mt-8 divide-y rounded-2xl border bg-background">{FAQS.map((faq) => <details key={faq.qEn} className="group p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium"><span>{lang === "ar" ? faq.qAr : faq.qEn}</span><ChevronDown size={18} className="transition group-open:rotate-180"/></summary><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{lang === "ar" ? faq.aAr : faq.aEn}</p></details>)}</div></div></section>

    <section id="request-service" className="px-4 py-20 sm:px-6"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-medium">{lang === "ar" ? "طلب عميل جديد" : "New customer request"}</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{lang === "ar" ? "أرسل تفاصيل مطعمك وسنبدأ من الاتجاه الصحيح." : "Send your restaurant details and start in the right direction."}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{lang === "ar" ? "يمكنك اختيار الباقة والتصميم مسبقاً، وسيتم تمريرهما إلى الطلب." : "Your selected plan and theme can be passed into the request."}</p>{(selectedPlan || selectedTheme) && <div className="mt-6 rounded-xl border bg-muted/30 p-4 text-sm">{selectedPlan && <div><strong>{lang === "ar" ? "الباقة:" : "Plan:"}</strong> {selectedPlan}</div>}{selectedTheme && <div className="mt-1"><strong>{lang === "ar" ? "التصميم:" : "Theme:"}</strong> {MENU_THEMES.find((item) => item.key === selectedTheme)?.name[lang]}</div>}</div>}</div><LeadForm lang={lang} selectedPlan={selectedPlan} selectedTheme={selectedTheme}/></div></section>

    <footer className="border-t px-4 py-8 sm:px-6"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-muted-foreground sm:flex-row"><span>© {new Date().getFullYear()} Menu V3</span><div className="flex gap-5"><Link to="/privacy">{lang === "ar" ? "الخصوصية" : "Privacy"}</Link><Link to="/terms">{lang === "ar" ? "الشروط" : "Terms"}</Link></div></div></footer>
  </main>;
}

function LeadForm({ lang, selectedPlan, selectedTheme }: { lang: "ar" | "en"; selectedPlan: string; selectedTheme: ThemeKey | "" }) {
  const [status, setStatus] = useState<string>("");
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const result = await submitLead({ data: {
        businessName: String(data.get("businessName") || ""),
        city: String(data.get("city") || ""),
        contactName: String(data.get("contactName") || ""),
        contactPhone: String(data.get("contactPhone") || ""),
        contactEmail: String(data.get("contactEmail") || ""),
        details: [selectedPlan ? `Selected plan: ${selectedPlan}` : "Selected plan: not selected", selectedTheme ? `Selected theme: ${selectedTheme}` : "Selected theme: not selected", String(data.get("details") || "").trim()].filter(Boolean).join("\n"),
      }});
      if (!result.ok) { setStatus(result.error); return; }
      setStatus(lang === "ar" ? `تم إرسال الطلب بنجاح. الرقم المرجعي: ${result.data.id.slice(0, 8).toUpperCase()}` : `Request submitted successfully. Reference: ${result.data.id.slice(0, 8).toUpperCase()}`);
      event.currentTarget.reset();
    } catch {
      setStatus(lang === "ar" ? "تعذر إرسال الطلب. حاول مرة أخرى." : "Could not submit the request. Please try again.");
    }
  }
  return <form onSubmit={handleSubmit} className="rounded-2xl border bg-background p-6 shadow-sm"><div className="grid gap-5 sm:grid-cols-2"><Field label={lang === "ar" ? "اسم المطعم" : "Restaurant name"}><Input name="businessName" required minLength={2} /></Field><Field label={lang === "ar" ? "المدينة" : "City"}><Input name="city" required /></Field><Field label={lang === "ar" ? "اسم التواصل" : "Contact name"}><Input name="contactName" required minLength={2} /></Field><Field label={lang === "ar" ? "رقم الجوال" : "Phone"}><Input name="contactPhone" required minLength={8} inputMode="tel" /></Field><Field label={lang === "ar" ? "البريد الإلكتروني" : "Email"}><Input name="contactEmail" type="email" /></Field><div className="sm:col-span-2"><Field label={lang === "ar" ? "ما الذي تريد تطويره؟" : "What would you like to improve?"}><Textarea name="details" rows={5} /></Field></div></div><Button type="submit" className="mt-6">{lang === "ar" ? "إرسال الطلب" : "Submit request"}</Button>{status && <p role="status" className="mt-3 text-sm text-muted-foreground">{status}</p>}</form>;
}
