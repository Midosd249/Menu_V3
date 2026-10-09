import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingFooter } from "@/components/marketing-footer";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/terms")({
  head: ({ matches }) => {
    const search = matches[matches.length - 1]?.search as Record<string, unknown> | undefined;
    const en = search?.lang === "en";
    return {
      meta: [
        { title: en ? "Terms of Service | Menuun" : "شروط الاستخدام | Menuun" },
        { name: "description", content: en ? "Plain-language terms for using Menuun's digital menu platform." : "شروط واضحة لاستخدام منصة Menuun للمنيو الرقمي." },
      ],
    };
  },
  component: TermsPage,
});

function TermsPage() {
  const { lang } = useLang();
  const en = lang === "en";
  return (
    <div data-platform-chrome className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="font-display text-xl font-semibold">Menuun</Link>
          <div className="flex items-center gap-2"><ThemeToggle /><LangToggle /></div>
        </div>
      </header>
      <main dir={en ? "ltr" : "rtl"} className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <p className="text-sm font-medium text-accent">{en ? "Last updated: 9 October 2026" : "آخر تحديث: 9 أكتوبر 2026"}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{en ? "Terms of Service" : "شروط الاستخدام"}</h1>
        <p className="mt-5 leading-8 text-ink-soft">{en
          ? "These terms explain the basic rules for using Menuun, a digital-menu platform for restaurants and cafés. By creating an account or using the service, you agree to use it lawfully and follow these terms."
          : "توضح هذه الشروط القواعد الأساسية لاستخدام Menuun، وهي منصة منيو رقمي للمطاعم والكافيهات. بإنشاء حساب أو استخدام الخدمة، فإنك توافق على استخدامها بطريقة نظامية والالتزام بهذه الشروط."}</p>

        <section className="mt-9 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "1. Your account and information" : "١. حسابك وبياناتك"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "Provide accurate registration and restaurant information and keep it up to date. You are responsible for safeguarding your sign-in details and for activity carried out through your account. Contact us if you believe your account has been accessed without permission."
            : "قدّم معلومات صحيحة عند التسجيل وعن مطعمك، وحافظ على تحديثها. أنت مسؤول عن حماية بيانات تسجيل الدخول وعن النشاط الذي يتم عبر حسابك. تواصل معنا إذا اعتقدت أن حسابك استُخدم دون إذن."}</p>
        </section>
        <section className="mt-7 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "2. Your restaurant and menu content" : "٢. محتوى المطعم والمنيو"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "You remain responsible for the restaurant information, menu items, prices, images, and other content you submit or publish, including having the rights and permissions needed to use it. Check that published information is accurate and lawful."
            : "تبقى مسؤولًا عن معلومات المطعم وأصناف المنيو والأسعار والصور وأي محتوى تضيفه أو تنشره، بما في ذلك امتلاك الحقوق والأذونات اللازمة لاستخدامه. تأكد من صحة المعلومات المنشورة ومشروعيتها."}</p>
        </section>
        <section className="mt-7 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "3. Plans, upgrades, and payments" : "٣. الباقات والترقية والدفع"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "Plan prices and limits are described on the pricing page. Menuun does not currently process payments directly through the platform. Paid-plan upgrades are arranged manually by contacting us, including through WhatsApp, and are not activated by an online checkout or automatic charge. Any upgrade, price, or payment arrangement should be confirmed with us directly."
            : "تُعرض أسعار الباقات وحدودها في صفحة الأسعار. لا تعالج Menuun المدفوعات مباشرةً داخل المنصة في الوقت الحالي. تتم ترتيبات الترقية إلى الباقات المدفوعة يدويًا عبر التواصل معنا، بما في ذلك واتساب؛ ولا يوجد حاليًا Checkout إلكتروني أو خصم تلقائي لتفعيل الترقية. يجب تأكيد أي ترقية أو سعر أو ترتيب للدفع معنا مباشرةً."}</p>
        </section>
        <section className="mt-7 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "4. Acceptable use and service changes" : "٤. الاستخدام المقبول وتغييرات الخدمة"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "Do not misuse the service, attempt unauthorized access, interfere with its operation, or publish unlawful content. Features may change as the product develops, and availability may be interrupted for maintenance or reasons outside our control. We do not promise uninterrupted or error-free service."
            : "لا تُسئ استخدام الخدمة، ولا تحاول الوصول غير المصرح به أو تعطيل عملها أو نشر محتوى مخالف للأنظمة. قد تتغير الميزات مع تطور المنتج، وقد تتوقف الخدمة مؤقتًا للصيانة أو لأسباب خارجة عن سيطرتنا. لا نعد بتوفر الخدمة دون انقطاع أو خلوها من الأخطاء."}</p>
        </section>
        <section className="mt-7 grid gap-3">
          <h2 className="text-xl font-semibold">{en ? "5. Contact and requests" : "٥. التواصل والطلبات"}</h2>
          <p className="leading-8 text-ink-soft">{en
            ? "For questions about these terms, account corrections, or requests to change or delete your data, email ahmed.mohamed@menuun.com. We will review requests and handle them subject to applicable law and any records we are legally required to retain."
            : "للاستفسار عن هذه الشروط أو تصحيح الحساب أو طلب تعديل بياناتك أو حذفها، راسل ahmed.mohamed@menuun.com. سنراجع الطلب ونتعامل معه وفق الأنظمة المعمول بها وأي سجلات يلزم الاحتفاظ بها نظامًا."}</p>
        </section>
        <p className="mt-10 border-t border-line pt-5 text-sm leading-7 text-muted">{en
          ? "These terms are a plain-language description of the current service, not a statement that the product has undergone a legal compliance audit."
          : "هذه الشروط وصف مبسط للخدمة الحالية، وليست إقرارًا بأن المنتج خضع لتدقيق قانوني للامتثال."}</p>
      </main>
      <MarketingFooter />
    </div>
  );
}
