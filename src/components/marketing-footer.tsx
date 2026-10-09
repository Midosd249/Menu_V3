import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
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
        <div className="grid gap-10 lg:grid-cols-[1.25fr_repeat(2,minmax(0,1fr))] lg:gap-12">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex min-h-10 items-center rounded-lg" aria-label="Menuun">
              <MenuunLogo lang={lang} className="h-11 w-auto max-w-full" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-ink/70">
              {ar ? "منيو رقمي يساعد المطاعم والكافيهات في السعودية على إبراز هويتها وإدارة فروعها." : "Digital menus that help Saudi restaurants and cafés present their brand and manage branches."}
            </p>
          </div>
          <nav aria-label={ar ? "روابط الموقع" : "Site links"}>
            <h2 className="text-sm font-semibold tracking-tight">{ar ? "روابط" : "Links"}</h2>
            <div className="mt-4 grid gap-1">
              <Link to="/pricing" className={linkClass}>{ar ? "الباقات والأسعار" : "Pricing"}</Link>
              <Link to="/themes/preview" className={linkClass}>{ar ? "المعاينة" : "Preview"}</Link>
              <Link to="/login" className={linkClass}>{ar ? "تسجيل الدخول" : "Sign in"}</Link>
              <Link to="/terms" className={linkClass}>{ar ? "شروط الاستخدام" : "Terms of Service"}</Link>
              <Link to="/privacy" className={linkClass}>{ar ? "سياسة الخصوصية" : "Privacy Policy"}</Link>
            </div>
          </nav>
          <section>
            <h2 className="text-sm font-semibold tracking-tight">{ar ? "تواصل معنا" : "Contact"}</h2>
            <div className="mt-4 grid gap-1">
              <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkClass} inline-flex items-center gap-2`} aria-label={ar ? "إرسال بريد إلكتروني" : "Send email"}><Mail aria-hidden="true" className="h-4 w-4 shrink-0" /><span>{ar ? "راسلنا عبر البريد الإلكتروني" : "Email us"}</span></a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-2`} aria-label={ar ? "التواصل عبر واتساب" : "Contact us on WhatsApp"}><MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" /><span>WhatsApp</span></a>
            </div>
          </section>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-5 text-xs text-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{ar ? `© ${year} Menuun. جميع الحقوق محفوظة.` : `© ${year} Menuun. All rights reserved.`}</p>
          <LangToggle />
        </div>
      </div>
    </footer>
  );
}
