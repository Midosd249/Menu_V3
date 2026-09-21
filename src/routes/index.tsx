import { useMemo, useState } from "react";
import {
  ArrowUpLeft,
  BarChart3,
  Check,
  ChevronDown,
  ExternalLink,
  GitBranch,
  Globe2,
  Layers3,
  Menu,
  QrCode,
  Search,
  ScanLine,
  Sparkles,
  Smartphone,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { COMMERCIAL_FEATURES, COMMERCIAL_PLAN_FEATURES, COMMERCIAL_PLANS } from "@/lib/menu/commercial-catalog";
import { MENU_THEMES } from "@/lib/theme";
import { DEMO_MENU } from "@/lib/menu/demo";
import { MarketingFooter } from "@/components/marketing-footer";
import "./index.css";

export const Route = createFileRoute("/")({ component: Home });

const FEATURES = [
  {
    icon: Smartphone,
    ar: "تجربة ضيف واضحة",
    en: "A clear guest experience",
    bodyAr: "من QR إلى الأصناف والسعر والإجراء التالي، بدون طبقات مشتتة.",
    bodyEn: "From QR to products, pricing, and the next action without distracting layers.",
  },
  {
    icon: Store,
    ar: "حضور يحمل هوية مطعمك",
    en: "A presence that feels like your restaurant",
    bodyAr: "اختر من خمسة تصاميم محمية وابدأ من هوية مطعمك، لا من قالب SaaS عام.",
    bodyEn: "Choose from five protected themes and start from your restaurant identity, not a generic SaaS template.",
  },
  {
    icon: Layers3,
    ar: "تحكم من Studio",
    en: "Control from Studio",
    bodyAr: "حدّث المنيو والفروع والمحتوى من مساحة تشغيل واحدة.",
    bodyEn: "Manage menu content, branches, and publishing from one operating workspace.",
  },
  {
    icon: BarChart3,
    ar: "ذكاء ونمو",
    en: "Intelligence & growth",
    bodyAr: "استخدم البيانات المتاحة لفهم الزيارات ومشاهدة الأصناف واتخاذ قرارات أفضل.",
    bodyEn: "Use available product and visit signals to understand what guests engage with and act on it.",
  },
  {
    icon: GitBranch,
    ar: "فروع ضمن حدود الباقة",
    en: "Branch-aware management",
    bodyAr: "إدارة متعددة الفروع مع الحفاظ على سياق كل فرع.",
    bodyEn: "Manage multiple branches while keeping each branch in its own context.",
  },
  {
    icon: Globe2,
    ar: "عربي أولاً",
    en: "Arabic-first",
    bodyAr: "RTL وLTR من الأساس، مع دعم حقيقي للمحتوى المختلط والأسعار والأرقام.",
    bodyEn: "RTL and LTR from the foundation, including mixed content, prices, and numbers.",
  },
] as const;

const STEPS = [
  {
    n: "01",
    icon: Store,
    ar: "أنشئ مساحة مطعمك",
    en: "Create your restaurant workspace",
    bodyAr: "ابدأ بحسابك ثم جهّز هوية المطعم والمحتوى الأساسي.",
    bodyEn: "Start with your account, then prepare your restaurant identity and core content.",
  },
  {
    n: "02",
    icon: Layers3,
    ar: "ابنِ التجربة",
    en: "Build the experience",
    bodyAr: "أضف الأصناف والأسعار والفروع واختر التصميم المناسب.",
    bodyEn: "Add products, prices, branches, and the visual direction that fits your restaurant.",
  },
  {
    n: "03",
    icon: ScanLine,
    ar: "انشر وشارك",
    en: "Publish & share",
    bodyAr: "استخدم الرابط وQR وراقب الإشارات المتاحة لتطوير التجربة.",
    bodyEn: "Share the public link and QR, then use available signals to improve the experience.",
  },
] as const;

const DEMO_PREVIEW_PRODUCTS = DEMO_MENU.products.filter((product) => product.isFeatured).slice(0, 2);

const FAQS = [
  {
    qAr: "هل Menu V3 مجرد QR Menu؟",
    qEn: "Is Menu V3 just a QR menu?",
    aAr: "لا. الـQR هو مدخل التجربة. المنصة تجمع الحضور العام للمنيو، إدارة المحتوى والفروع، Studio، التحليلات والذكاء والنمو ضمن منظومة واحدة.",
    aEn: "No. QR is the entry point. The platform brings together the public menu experience, content and branch management, Studio, analytics, intelligence, and growth capabilities.",
  },
  {
    qAr: "هل يدعم العربية والإنجليزية؟",
    qEn: "Does it support Arabic and English?",
    aAr: "نعم. Menu V3 عربي أولاً مع دعم الإنجليزية وRTL/LTR، ويجب أن يبقى المحتوى المختلط جزءاً من اختبار الجودة.",
    aEn: "Yes. Menu V3 is Arabic-first with English and RTL/LTR support, with mixed-direction content treated as a first-class quality case.",
  },
  {
    qAr: "هل أستطيع إدارة أكثر من فرع؟",
    qEn: "Can I manage multiple branches?",
    aAr: "نعم، ضمن حدود الباقة المختارة وبسياق فرعي واضح.",
    aEn: "Yes, within the selected plan limits and with branch-aware context.",
  },
  {
    qAr: "هل يمكنني تحديث المنيو دون إعادة طباعة QR؟",
    qEn: "Can I update the menu without reprinting the QR?",
    aAr: "نعم، عند تحديث المحتوى المنشور يبقى الرابط العام هو نقطة الوصول نفسها.",
    aEn: "Yes. When published content is updated, the public link remains the same entry point.",
  },
  {
    qAr: "هل أحتاج خبرة تقنية؟",
    qEn: "Do I need technical experience?",
    aAr: "المنتج مصمم لإدارة المنيو من واجهة Studio دون كتابة كود.",
    aEn: "The product is designed to manage menu content through Studio without writing code.",
  },
] as const;

function Home() {
  const { lang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const themeCards = useMemo(
    () => MENU_THEMES.map((theme) => ({ ...theme, preview: { ...theme.preview, image: `/homepage/themes/${theme.key}.webp` } })),
    [],
  );
  const signup = (
    <Link to="/login" search={{ mode: "signup" } as never}>
      {lang === "ar" ? "ابدأ مجانًا" : "Start free"}
    </Link>
  );
  const navItems = [
    ["#journey", lang === "ar" ? "تجربة الضيف" : "Guest journey"],
    ["#presence", lang === "ar" ? "هوية المطعم" : "Restaurant presence"],
    ["#control", lang === "ar" ? "التحكم" : "Control"],
    ["#pricing", lang === "ar" ? "الباقات" : "Pricing"],
    ["#faq", lang === "ar" ? "الأسئلة" : "FAQ"],
  ] as const;

  return (
    <main className="menuq-home min-h-screen bg-background text-foreground">
      <header className="menuq-nav sticky top-0 z-50 border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="font-semibold tracking-tight">
            Menu V3
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label={lang === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
            {navItems.map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LangToggle />
            <Button asChild size="sm">
              <Link to="/login">{lang === "ar" ? "دخول" : "Sign in"}</Link>
            </Button>
            <button
              type="button"
              aria-label={lang === "ar" ? "فتح القائمة" : "Open menu"}
              aria-expanded={mobileOpen}
              className="menuq-icon-button md:hidden"
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t px-4 py-3 md:hidden" aria-label={lang === "ar" ? "التنقل المحمول" : "Mobile navigation"}>
            {navItems.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block min-h-11 py-3 text-sm">
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section className="menuq-hero relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-20">
        <div className="menuq-hero-grain" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.95fr_1.05fr]">
          <div className="relative z-10 max-w-3xl">
            <div className="menuq-kicker mb-5">
              <Sparkles size={15} />
              {lang === "ar" ? "من حضور المطعم إلى نموه" : "From restaurant presence to growth"}
            </div>

            <h1 className="menuq-display">
              {lang === "ar"
                ? "اجعل منيو مطعمك هو بداية التجربة، لا نهايتها."
                : "Make your restaurant menu the beginning of the experience, not the end."}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              {lang === "ar"
                ? "Menu V3 منصة حضور وتشغيل للمطاعم، عربي أولاً، تبني منيو يحمل هويتك، تجربة ضيف واضحة، ومساحة Studio تساعدك على الإدارة والفهم والنمو."
                : "Menu V3 is an Arabic-first restaurant presence and operating platform: a branded menu, a clear guest experience, and Studio tools for management, insight, and growth."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                {signup}
                <ArrowUpLeft className="ms-2" size={18} />
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/themes/preview">
                  {lang === "ar" ? "شاهد التجربة" : "Explore the experience"}
                  <ExternalLink className="ms-2" size={17} />
                </Link>
              </Button>
            </div>

            <div className="menuq-proof-row mt-9">
              <div>
                <strong>5</strong>
                <span>{lang === "ar" ? "تصاميم محمية" : "protected themes"}</span>
              </div>
              <div>
                <strong>RTL</strong>
                <span>{lang === "ar" ? "عربي أولاً" : "Arabic-first"}</span>
              </div>
              <div>
                <strong>QR</strong>
                <span>{lang === "ar" ? "ورابط عام" : "and public link"}</span>
              </div>
            </div>
          </div>

          <div className="menuq-hero-stage" aria-label={lang === "ar" ? "معاينة منيو إلكتروني حقيقي" : "Real digital menu preview"}>
            <div className="menuq-live-menu">
              <header className="menuq-live-header">
                <div className="menuq-live-brand">
                  <div className="menuq-live-logo">نَ</div>
                  <div>
                    <strong>{lang === "ar" ? DEMO_MENU.tenant.nameAr : DEMO_MENU.tenant.nameEn}</strong>
                    <span>{lang === "ar" ? DEMO_MENU.tenant.taglineAr : DEMO_MENU.tenant.taglineEn}</span>
                  </div>
                </div>
                <div className="menuq-live-actions">
                  <button aria-label={lang === "ar" ? "بحث" : "Search"}><Search size={16} /></button>
                  <button aria-label={lang === "ar" ? "السلة" : "Cart"} className="menuq-cart-button"><ShoppingBag size={16} /><b>0</b></button>
                </div>
              </header>

              <div className="menuq-live-intro">
                <div>
                  <span className="menuq-live-kicker"><span className="menuq-live-status" /> {lang === "ar" ? "مفتوح الآن · العليا" : "Open now · Al Olaya"}</span>
                  <h3>{lang === "ar" ? "أهلاً بك في نَفَس" : "Welcome to Nafas"}</h3>
                  <p>{lang === "ar" ? "خذ لحظتك. اختر قهوتك. واستمتع بتفاصيل صُنعت بهدوء." : "Take your moment. Choose your coffee. Enjoy the details."}</p>
                </div>
                <div className="menuq-live-meta"><Store size={15} /> {lang === "ar" ? "العليا، الرياض" : "Al Olaya, Riyadh"}</div>
              </div>

              <nav className="menuq-live-nav" aria-label={lang === "ar" ? "تصنيفات المنيو" : "Menu categories"}>
                <span className="active">{lang === "ar" ? "الكل" : "All"}</span>
                <span>{lang === "ar" ? "القهوة" : "Coffee"}</span>
                <span>{lang === "ar" ? "التوقيع" : "Signature"}</span>
                <span>{lang === "ar" ? "المخبوزات والحلى" : "Pastry & Dessert"}</span>
              </nav>

              <div className="menuq-live-body">
                <div className="menuq-live-products">
                  <div className="menuq-live-section-title"><div><span>{lang === "ar" ? "اختياراتنا" : "OUR PICKS"}</span><h4>{lang === "ar" ? "أطباق تستحق التجربة" : "Worth discovering"}</h4></div><small>8 {lang === "ar" ? "أصناف" : "items"}</small></div>
                  <div className="menuq-live-product-grid">
                    {DEMO_PREVIEW_PRODUCTS.map((product, index) => <article key={product.id} className="menuq-live-product"><img src={product.imageUrl || "/homepage/menu-dish.webp"} alt="" className="menuq-live-product-image" loading={index === 0 ? "eager" : "lazy"} decoding="async" fetchPriority={index === 0 ? "high" : "auto"} /><div><h5>{lang === "ar" ? product.nameAr : product.nameEn}</h5><p>{lang === "ar" ? product.descriptionAr : product.descriptionEn}</p><strong>{product.price} {lang === "ar" ? "ر.س" : "SAR"}</strong><button aria-label={lang === "ar" ? `إضافة ${product.nameAr}` : `Add ${product.nameEn}`}>+</button></div></article>)}
                  </div>v>
                </div>
                <aside className="menuq-live-order">
                  <span className="menuq-live-order-icon"><ShoppingBag size={17} /></span>
                  <strong>{lang === "ar" ? "سلتك جاهزة" : "Your order starts here"}</strong>
                  <p>{lang === "ar" ? "أضف صنفًا لتبدأ طلبك بسهولة." : "Add an item to start your order."}</p>
                  <button>{lang === "ar" ? "اطلب الآن" : "Order now"}<ArrowUpLeft size={14} /></button>
                </aside>
              </div>
              <footer className="menuq-live-footer"><span><ScanLine size={14} /> {lang === "ar" ? "منيو رقمي · تجربة بلا انتظار" : "Digital menu · no waiting"}</span><span>{lang === "ar" ? "يفتح يوميًا 07:00" : "Open daily 07:00"}</span></footer>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="border-y bg-muted/25 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="menuq-section-heading">
            <div>
              <p className="menuq-eyebrow">{lang === "ar" ? "رحلة الضيف" : "THE GUEST JOURNEY"}</p>
              <h2 className="menuq-section-title">
                {lang === "ar" ? "من المسح إلى الاختيار، كل خطوة لها مكان." : "From scan to choice, every step has a place."}
              </h2>
            </div>
            <p className="max-w-xl leading-7 text-muted-foreground">
              {lang === "ar"
                ? "لا نعرض لك صورة داخل جهاز. نعرض منيو إلكترونيًا حيًا: هوية واضحة، اكتشاف سريع، معلومات قابلة للقراءة، ثم إجراء طلب واضح."
                : "This is not a device mockup. It is a living digital menu: clear identity, fast discovery, readable information, and an obvious order action."}
            </p>
          </div>

          <div className="menuq-journey-grid mt-12">
            <article className="menuq-journey-card menuq-journey-card-dark">
              <div className="flex items-center justify-between">
                <span className="menuq-index">01</span>
                <QrCode size={20} />
              </div>
              <h3>{lang === "ar" ? "QR أو رابط مباشر" : "QR or direct link"}</h3>
              <p>{lang === "ar" ? "نقطة دخول بسيطة، ثم تبدأ التجربة الحقيقية." : "A simple entry point, then the real experience begins."}</p>
            </article>

            <article className="menuq-journey-card">
              <div className="flex items-center justify-between">
                <span className="menuq-index">02</span>
                <Layers3 size={20} />
              </div>
              <h3>{lang === "ar" ? "هوية المطعم والمحتوى" : "Restaurant identity & content"}</h3>
              <p>{lang === "ar" ? "الاسم، الصورة، التصنيفات، الوصف والسعر تعمل معًا بدل التزاحم." : "Name, imagery, categories, description, and price work together instead of competing."}</p>
            </article>

            <article className="menuq-journey-card">
              <div className="flex items-center justify-between">
                <span className="menuq-index">03</span>
                <ArrowUpLeft size={20} />
              </div>
              <h3>{lang === "ar" ? "الإجراء التالي" : "The next action"}</h3>
              <p>{lang === "ar" ? "عندما تكون هناك وسيلة طلب أو تواصل مهيأة، تظهر في المكان المناسب بدل أن تشتت التصفح." : "When an order or contact action is configured, it appears where it helps rather than interrupting discovery."}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="presence" className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="menuq-section-heading">
            <div>
              <p className="menuq-eyebrow">{lang === "ar" ? "هوية المطعم" : "RESTAURANT PRESENCE"}</p>
              <h2 className="menuq-section-title">
                {lang === "ar" ? "خمسة تصاميم. تجربة واحدة تحمل اسم مطعمك." : "Five directions. One experience that carries your restaurant."}
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/themes/preview">{lang === "ar" ? "استكشف كل التصاميم" : "Explore all themes"}</Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {themeCards.map((theme) => (
              <article key={theme.key} className="menuq-theme-card">
                <Link
                  to="/themes/preview"
                  search={{ theme: theme.key } as never}
                  className="block"
                  aria-label={lang === "ar" ? `استكشف تصميم ${theme.name.ar}` : `Explore the ${theme.name.en} theme`}
                >
                  <div className="menuq-theme-image">
                    <img
                      src={theme.preview.image}
                      alt={lang === "ar" ? `صورة تعبر عن تصميم ${theme.name.ar}` : `${theme.name.en} theme visual`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <span>{lang === "ar" ? theme.name.ar : theme.name.en}</span>
                  </div>
                  <div className="p-5">
                    <h3>{lang === "ar" ? theme.name.ar : theme.name.en}</h3>
                    <p>{lang === "ar" ? theme.promise.ar : theme.promise.en}</p>
                    <span className="menuq-theme-link">{lang === "ar" ? "استكشف التصميم" : "Explore theme"} <ArrowUpLeft size={14} /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="control" className="menuq-control-section px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="menuq-eyebrow">{lang === "ar" ? "منصة التشغيل" : "THE OPERATING LAYER"}</p>
            <h2 className="menuq-section-title mt-3">
              {lang === "ar" ? "الضيف يرى المنيو. أنت ترى الصورة الأكبر." : "Guests see the menu. You see the bigger picture."}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              {lang === "ar"
                ? "Studio ليس لوحة أرقام للعرض فقط. هو مساحة العمل التي تربط المحتوى والفروع والنشر والإشارات المتاحة من تجربة الضيف."
                : "Studio is not a dashboard made for screenshots. It is the workspace connecting content, branches, publishing, and available guest signals."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {FEATURES.slice(2, 6).map(({ icon: Icon, ar, en, bodyAr, bodyEn }) => (
                <article key={en} className="menuq-feature-mini">
                  <Icon size={19} />
                  <div>
                    <h3>{lang === "ar" ? ar : en}</h3>
                    <p>{lang === "ar" ? bodyAr : bodyEn}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="menuq-studio-frame" aria-label={lang === "ar" ? "معاينة مساحة التحليلات" : "Studio analytics preview"}>
            <div className="menuq-studio-top">
              <span>Studio</span>
              <span>{lang === "ar" ? "معاينة توضيحية" : "Illustrative preview"}</span>
            </div>
            <div className="menuq-analytics-visual">
              <span className="sr-only">Guest signals / إشارات الضيوف</span>
              <img
                src="/homepage-analytics-real.png"
                alt={lang === "ar" ? "لوحة تحليلات تعرض الزيارات ومشاهدات المنتجات ومسح الرموز وأداء الفروع" : "Analytics dashboard showing visits, product views, QR scans, and branch performance"}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-background px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="menuq-eyebrow">{lang === "ar" ? "ميزة يصعب إضافتها لاحقًا" : "A foundation that is hard to bolt on later"}</p>
            <h2 className="menuq-section-title mt-3">
              {lang === "ar" ? "العربية ليست طبقة ترجمة فوق واجهة إنجليزية." : "Arabic is not a translation layer over an English interface."}
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {lang === "ar"
                ? "نختبر المحتوى العربي والإنجليزي والمختلط والأرقام والأسعار واتجاهات القراءة ضمن نفس التجربة. هذا مهم خصوصًا عندما يكون المطعم سعوديًا والضيف قد ينتقل بين اللغتين في لحظة واحدة."
                : "Arabic, English, mixed-direction content, numbers, and prices are treated as one experience. That matters when a Saudi restaurant serves guests who may switch language in the same session."}
            </p>
          </div>

          <div className="menuq-bidi-grid mt-10">
            <div className="menuq-bidi-card" dir="rtl">
              <span>AR</span>
              <strong>كبسة لحم — 68 ر.س</strong>
              <p>أرز بسمتي، لحم مطهو ببطء، صلصة طماطم.</p>
            </div>
            <div className="menuq-bidi-card" dir="ltr">
              <span>EN</span>
              <strong>Lamb Kabsa — 68 SAR</strong>
              <p>Basmati rice, slow-cooked lamb, tomato sauce.</p>
            </div>
            <div className="menuq-bidi-card menuq-bidi-card-mixed">
              <span>MIX</span>
              <strong dir="auto">Special: كبسة لحم 68 SAR</strong>
              <p dir="auto">Arabic name, Latin price, and a clear reading order.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foreground px-4 py-20 text-background sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="menuq-eyebrow menuq-eyebrow-light">{lang === "ar" ? "كيف تعمل" : "HOW IT WORKS"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              {lang === "ar" ? "مسار بسيط من الإعداد إلى QR." : "A simple path from setup to QR."}
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map(({ n, icon: Icon, ar, en, bodyAr, bodyEn }) => (
              <article key={n} className="menuq-step">
                <div className="flex items-center justify-between">
                  <span>{n}</span>
                  <Icon size={21} />
                </div>
                <h3>{lang === "ar" ? ar : en}</h3>
                <p>{lang === "ar" ? bodyAr : bodyEn}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="menuq-eyebrow">{lang === "ar" ? "باقات واضحة" : "SIMPLE PLANS"}</p>
            <h2 className="menuq-section-title mt-3">
              {lang === "ar" ? "ابدأ بالحجم الذي يناسب مطعمك." : "Start with the plan that fits your restaurant."}
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {COMMERCIAL_PLANS.map((plan) => (
              <article key={plan.code} className={`menuq-plan-card ${plan.recommended ? "menuq-plan-featured" : ""}`}>
                <div className="flex items-center justify-between gap-3">
                  <h3>{lang === "ar" ? plan.nameAr : plan.nameEn}</h3>
                  {plan.recommended && (
                    <span className="rounded-full border px-2 py-1 text-[10px]">
                      {lang === "ar" ? "موصى به" : "Recommended"}
                    </span>
                  )}
                </div>
                <div className="mt-5 text-4xl font-semibold">
                  {plan.monthlyPriceSar}
                  <span className="text-sm font-normal text-muted-foreground"> {lang === "ar" ? "ريال / شهر" : "SAR / month"}</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm">
                  <li><Check size={17} />{lang === "ar" ? `${plan.maxBranches} فرع` : `${plan.maxBranches} branch${plan.maxBranches === 1 ? "" : "es"}`}</li>
                  <li><Check size={17} />{plan.code === "pro" ? (lang === "ar" ? "أصناف غير محدودة" : "Unlimited products") : (lang === "ar" ? `${plan.maxProducts.toLocaleString("ar-SA")} صنف` : `${plan.maxProducts.toLocaleString("en-US")} products`)}</li>
                  <li><Check size={17} />{lang === "ar" ? `${plan.maxTeamMembers} أعضاء فريق` : `${plan.maxTeamMembers} team members`}</li>
                </ul>
                <div className="mt-5 grid gap-2 border-t pt-5">
                  {COMMERCIAL_PLAN_FEATURES[plan.code].slice(0, 4).map((feature) => (
                    <div key={feature.en} className="flex gap-2 text-xs leading-5 text-muted-foreground">
                      <Check size={14} className="mt-0.5 shrink-0" />
                      <span>{lang === "ar" ? feature.ar : feature.en}</span>
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-7 w-full">{signup}</Button>
              </article>
            ))}
          </div>

          <div className="menuq-card mt-8">
            <p className="font-medium">{lang === "ar" ? "المميزات الأساسية في جميع الباقات" : "Core features in every plan"}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {COMMERCIAL_FEATURES[lang].map((feature) => (
                <div key={feature} className="flex gap-2 text-sm text-muted-foreground">
                  <Check size={16} className="shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/25 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem] border bg-background p-7 md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <p className="menuq-eyebrow">{lang === "ar" ? "جاهز للبداية" : "READY TO START"}</p>
            <h2 className="menuq-section-title mt-3">
              {lang === "ar" ? "لا تجعل منيوك مجرد صفحة. اجعله حضور مطعمك." : "Do not make your menu just a page. Make it your restaurant presence."}
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              {lang === "ar"
                ? "ابدأ مجانًا، ثم ابنِ التجربة التي تريد أن يراها ضيوفك."
                : "Start free, then build the experience you want your guests to see."}
            </p>
          </div>
          <Button asChild size="lg">
            {signup}
            <ArrowUpLeft className="ms-2" size={18} />
          </Button>
        </div>
      </section>

      <section id="faq" className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="menuq-eyebrow">FAQ</p>
          <h2 className="menuq-section-title mt-3">
            {lang === "ar" ? "أسئلة قبل أن تبدأ." : "Questions before you start."}
          </h2>
          <div className="mt-8 divide-y rounded-2xl border">
            {FAQS.map(({ qAr, qEn, aAr, aEn }) => (
              <details key={qEn} className="group p-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  <span>{lang === "ar" ? qAr : qEn}</span>
                  <ChevronDown className="transition-transform group-open:rotate-180" size={18} aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {lang === "ar" ? aAr : aEn}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />    </main>
  );
}
