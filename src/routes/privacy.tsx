import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingFooter } from "@/components/marketing-footer";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/privacy")({
  head: ({ matches }) => {
    const search = matches[matches.length - 1]?.search as Record<string, unknown> | undefined;
    const en = search?.lang === "en";
    return {
      meta: [
        { title: en ? "Privacy Policy | Menuun" : "سياسة الخصوصية | Menuun" },
        { name: "description", content: en ? "How Menuun handles account and restaurant information." : "كيف تتعامل Menuun مع بيانات الحساب والمطعم." },
      ],
    };
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  const { lang } = useLang();
  const en = lang === "en";
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="font-display text-xl font-semibold">Menuun</Link>
          <LangToggle />
        </div>
      </header>
      <main dir={en ? "ltr" : "rtl"} className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <p className="text-sm font-medium text-accent">{en ? "Last updated: 9 October 2026" : "آخر تحديث: 9 أكتوبر 2026"}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{en ? "Privacy Policy" : "سياسة الخصوصية"}</h1>
        <p className="mt-5 leading-8 text-ink-soft">{en
          ? "This policy describes, in plain language, the account and restaurant information Menuun handles to provide its digital-menu service. The product and its practices may evolve, so this page describes the service as it exists today."
          : "توضح هذه السياسة بلغة مباشرة بيانات الحساب والمطعم التي تتعامل معها Menuun لتقديم خدمة المنيو الرقمي. قد يتطور المنتج وممارساته، ولذلك تصف هذه الصفحة الخدمة كما هي اليوم."}</p>

        <section className="mt-9 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "1. Information you provide" : "١. المعلومات التي تقدمها"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "When you register, the account information includes your full name, email address, and phone number. To set up and operate your workspace, you may also provide restaurant or café information, branch details, menu items, prices, images, and other content you choose to add."
            : "عند التسجيل، تشمل بيانات الحساب اسمك الكامل وبريدك الإلكتروني ورقم جوالك. ولإعداد مساحة العمل وتشغيلها، قد تقدم أيضًا معلومات المطعم أو الكافيه والفروع وأصناف المنيو والأسعار والصور ومحتوى آخر تختار إضافته."}</p>
        </section>
        <section className="mt-7 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "2. Why we use it and where it is stored" : "٢. لماذا نستخدم البيانات وأين تُخزّن"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "We use this information to create and manage your account, support sign-in, configure your restaurant workspace, and display the menu content you publish. Supabase is used as part of the platform's data-storage infrastructure. This policy does not claim that data is stored in a particular country or that no service provider processes it."
            : "نستخدم هذه المعلومات لإنشاء حسابك وإدارته، ودعم تسجيل الدخول، وإعداد مساحة عمل المطعم، وعرض محتوى المنيو الذي تنشره. تُستخدم Supabase ضمن البنية التحتية لتخزين بيانات المنصة. لا تدّعي هذه السياسة أن البيانات تُخزّن في دولة معينة أو أن مزودي الخدمة لا يعالجونها."}</p>
        </section>
        <section className="mt-7 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "3. Login sessions and browser storage" : "٣. جلسات تسجيل الدخول وتخزين المتصفح"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "When you sign in, authentication session cookies are used to keep your session active and support authenticated requests. The site also stores your chosen language in your browser's local storage. Language preference storage is not a cookie. This page does not claim that the service uses advertising cookies."
            : "عند تسجيل الدخول، تُستخدم ملفات تعريف ارتباط خاصة بجلسة المصادقة للحفاظ على جلسة الدخول ودعم الطلبات التي تتطلب المصادقة. كما يحفظ الموقع اللغة التي تختارها في التخزين المحلي للمتصفح (local storage)، وهذا ليس ملف تعريف ارتباط. لا تدّعي هذه الصفحة أن الخدمة تستخدم ملفات تعريف ارتباط إعلانية."}</p>
        </section>
        <section className="mt-7 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "4. Payments and sharing" : "٤. المدفوعات ومشاركة البيانات"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "Menuun does not currently process payments directly through the platform. Paid upgrades are arranged manually, including through WhatsApp or direct contact. We do not describe an online payment processor as part of the current service. We do not sell your personal information. We have not documented a complete list of every infrastructure provider or data-transfer location in this policy, so we do not make broader claims about all processing or transfers."
            : "لا تعالج Menuun المدفوعات مباشرةً داخل المنصة في الوقت الحالي. تتم ترتيبات الترقية المدفوعة يدويًا، بما في ذلك عبر واتساب أو التواصل المباشر. لذلك لا نصف معالج مدفوعات إلكترونيًا على أنه جزء من الخدمة الحالية. لا نبيع معلوماتك الشخصية. ولم نوثق في هذه السياسة قائمة كاملة بجميع مزودي البنية التحتية أو مواقع نقل البيانات، لذلك لا نقدم ادعاءات أوسع بشأن جميع عمليات المعالجة أو النقل."}</p>
        </section>
        <section className="mt-7 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "5. Data changes and deletion requests" : "٥. طلبات تعديل البيانات وحذفها"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "To request access to, correction of, or deletion of your account information, email ahmed.mohamed@menuun.com. Include enough information for us to understand the request, but do not send your password. Requests will be reviewed and handled subject to applicable law and any information we are required to retain."
            : "لطلب الوصول إلى بيانات حسابك أو تصحيحها أو حذفها، راسل ahmed.mohamed@menuun.com. اذكر ما يكفي لفهم طلبك، ولا ترسل كلمة المرور. ستتم مراجعة الطلبات والتعامل معها وفق الأنظمة المعمول بها وأي معلومات يلزم الاحتفاظ بها نظامًا."}</p>
        </section>
        <section className="mt-7 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "6. Saudi Personal Data Protection Law (PDPL)" : "٦. نظام حماية البيانات الشخصية السعودي"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "The Saudi Personal Data Protection Law (PDPL) and its implementing regulations are relevant to personal-data handling in Saudi Arabia. This policy is intended to explain current practices in general terms; publishing it is not a certification, legal opinion, or claim that Menuun has completed a compliance audit. Applicable rights and obligations depend on the law and the circumstances of each request."
            : "يُعد نظام حماية البيانات الشخصية السعودي ولوائحه التنفيذية إطارًا ذا صلة بالتعامل مع البيانات الشخصية في المملكة. تهدف هذه السياسة إلى شرح الممارسات الحالية بصورة عامة؛ ونشرها لا يُعد شهادة امتثال أو رأيًا قانونيًا أو ادعاءً بأن Menuun أجرت تدقيقًا للامتثال. وتتحدد الحقوق والالتزامات المطبقة وفق النظام وظروف كل طلب."}</p>
        </section>
        <section className="mt-7 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "7. Contact" : "٧. التواصل"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "For privacy questions or requests, contact ahmed.mohamed@menuun.com."
            : "للاستفسارات أو الطلبات المتعلقة بالخصوصية، تواصل عبر ahmed.mohamed@menuun.com."}</p>
        </section>
        <p className="mt-10 border-t border-line pt-5 text-sm leading-7 text-muted">{en
          ? "This page describes the current service and is not a representation that a formal privacy or legal compliance audit has been completed."
          : "تصف هذه الصفحة الخدمة الحالية، ولا تمثل إقرارًا بإتمام تدقيق رسمي للخصوصية أو الامتثال القانوني."}</p>
      </main>
      <MarketingFooter />
    </div>
  );
}
