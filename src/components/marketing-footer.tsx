import { Link } from "@tanstack/react-router";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/lang";

export function MarketingFooter() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <footer dir={ar ? "rtl" : "ltr"} className="border-t border-line bg-paper px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10 text-ink">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
        <div className="max-w-sm">
          <Link to="/" className="font-display text-xl font-semibold">Menu V3</Link>
          <p className="mt-3 text-sm leading-7 text-muted">{ar ? "حضور رقمي عربي أولاً للمطاعم والكافيهات." : "Arabic-first digital restaurant presence for restaurants and cafés."}</p>
        </div>
        <nav className="grid content-start gap-2 text-sm" aria-label={ar ? "روابط المنتج" : "Product links"}>
          <strong className="mb-1 text-xs uppercase tracking-[0.14em] text-accent">{ar ? "المنتج" : "Product"}</strong>
          <a href="/#journey" className="min-h-10 py-2 hover:text-accent">{ar ? "تجربة الضيف" : "Guest journey"}</a>
          <a href="/#presence" className="min-h-10 py-2 hover:text-accent">{ar ? "التصاميم" : "Themes"}</a>
          <Link to="/pricing" className="min-h-10 py-2 hover:text-accent">{ar ? "الباقات والأسعار" : "Plans & pricing"}</Link>
        </nav>
        <nav className="grid content-start gap-2 text-sm" aria-label={ar ? "روابط المساعدة" : "Help links"}>
          <strong className="mb-1 text-xs uppercase tracking-[0.14em] text-accent">{ar ? "المساعدة" : "Help"}</strong>
          <a href="/#faq" className="min-h-10 py-2 hover:text-accent">{ar ? "الأسئلة الشائعة" : "FAQ"}</a>
          <Link to="/login" className="min-h-10 py-2 hover:text-accent">{ar ? "تسجيل الدخول" : "Sign in"}</Link>
          <Link to="/themes/preview" className="min-h-10 py-2 hover:text-accent">{ar ? "المعاينة" : "Preview"}</Link>
        </nav>
        <div className="grid content-start justify-items-start gap-3 sm:justify-items-end">
          <LangToggle />
          <span className="text-xs text-muted">© 2026 Menu V3</span>
        </div>
      </div>
    </footer>
  );
}
