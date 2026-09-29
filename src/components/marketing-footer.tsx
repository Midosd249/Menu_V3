import { Mail, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LangToggle } from "@/components/lang-toggle";
import { MenuunLogo } from "@/components/menuun-logo";
import { useLang } from "@/lib/lang";

const CONTACT_EMAIL = "ahmed.mohamed@menuun.com";
const WHATSAPP_NUMBER = "966549598318";

export function MarketingFooter() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const year = new Date().getFullYear();
  const linkClass = "min-h-10 py-2 text-sm text-ink/70 transition-colors hover:text-ink focus-visible:text-ink";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <footer dir={ar ? "rtl" : "ltr"} className="border-t border-line bg-[#FFF7ED] px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-12 text-[#0F1115] sm:pt-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex min-h-10 items-center rounded-lg" aria-label="Menuun">
              <MenuunLogo lang={lang} className="h-11 w-auto max-w-full" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-ink/70">
              {ar ? "منصة منيو رقمية للمطاعم والكافيهات في السعودية." : "A digital menu platform for restaurants and cafés in Saudi Arabia."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 text-sm transition-colors hover:border-[#1FD1A5] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1FD1A5]" aria-label={ar ? "راسل Menuun عبر البريد الإلكتروني" : "Email Menuun"}>
                <Mail className="size-4" aria-hidden="true" />
                <span>{CONTACT_EMAIL}</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#1FD1A5] px-3.5 text-sm font-semibold text-[#0F1115] transition-colors hover:bg-[#17b991] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F]" aria-label={ar ? "تواصل مع Menuun عبر واتساب" : "Contact Menuun on WhatsApp"}>
                <MessageCircle className="size-4" aria-hidden="true" />
                <span>{ar ? "واتساب" : "WhatsApp"}</span>
              </a>
            </div>
          </div>
          <section>
            <h2 className="text-sm font-semibold tracking-tight">{ar ? "من نحن" : "About"}</h2>
            <p className="mt-4 max-w-xs text-sm leading-7 text-ink/70">{ar ? "Menuun منصة منيو رقمية للمطاعم والكافيهات في السعودية. تساعد المطاعم على تقديم منيو يحمل هويتها وإدارة المحتوى والفروع من مساحة تشغيل واحدة." : "Menuun is a digital menu platform for restaurants and cafés in Saudi Arabia. It helps restaurants present a menu that reflects their identity and manage content and branches from one operating workspace."}</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold tracking-tight">{ar ? "تواصل معنا" : "Contact"}</h2>
            <div className="mt-4 grid gap-1">
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className={linkClass}>{ar ? "+966 54 959 8318 · واتساب" : "+966 54 959 8318 · WhatsApp"}</a>
            </div>
          </section>
          <nav aria-label={ar ? "روابط الموقع" : "Site links"}>
            <h2 className="text-sm font-semibold tracking-tight">{ar ? "روابط" : "Links"}</h2>
            <div className="mt-4 grid gap-1">
              <Link to="/pricing" className={linkClass}>{ar ? "الباقات والأسعار" : "Pricing"}</Link>
              <Link to="/themes/preview" className={linkClass}>{ar ? "المعاينة" : "Preview"}</Link>
              <Link to="/login" className={linkClass}>{ar ? "تسجيل الدخول" : "Sign in"}</Link>
            </div>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-5 text-xs text-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{ar ? `© ${year} Menuun. جميع الحقوق محفوظة.` : `© ${year} Menuun. All rights reserved.`}</p>
          <div className="flex items-center gap-4"><LangToggle /><span>{ar ? "المطاعم والكافيهات في السعودية" : "For restaurants and cafés in Saudi Arabia"}</span></div>
        </div>
      </div>
    </footer>
  );
}
