import { LangToggle } from "@/components/lang-toggle";
import { MenuMedia } from "@/components/menu";
import { PublicMenuView } from "@/components/public-menu";
import { useLang } from "@/lib/lang";
import type { Lang, PublicMenu } from "@/lib/menu/types";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar || en : en || ar;

export function FineDiningHospitalityTemplate({ menu, preview = false }: { menu: PublicMenu; preview?: boolean }) {
  const { lang } = useLang();
  const { tenant, branch, products } = menu;
  const visible = preview ? products : products.filter((product) => product.isAvailable);
  const tagline = text(lang, tenant.taglineAr, tenant.taglineEn);

  return <div className="noir-template-shell min-h-dvh">
    <header className="noir-template-hero">
      <MenuMedia src={tenant.coverUrl} alt="" className="noir-template-hero-image" eager fallback={<span aria-hidden="true" />} />
      <div className="noir-template-hero-inner">
        <div className="noir-template-identity">
          <div className="noir-template-brand">
            {tenant.logoUrl ? <img src={tenant.logoUrl} alt="" decoding="async" /> : <div className="noir-template-brand-fallback" aria-hidden="true">{text(lang, tenant.nameAr, tenant.nameEn).slice(0, 1)}</div>}
            <div className="min-w-0">
              <p className="noir-template-kicker">{text(lang, "القائمة", "Menu")}</p>
              <h1>{text(lang, tenant.nameAr, tenant.nameEn)}</h1>
              <p className="noir-template-branch">{text(lang, branch.nameAr, branch.nameEn)}{tenant.city ? ` · ${tenant.city}` : ""}</p>
            </div>
          </div>
          <div className="noir-template-lang"><LangToggle /></div>
        </div>
        {tagline ? <p className="noir-template-tagline" dir="auto">{tagline}</p> : null}
      </div>
    </header>

    <main className="noir-template-main">
      <section className="noir-template-menu" aria-label={text(lang, "القائمة الكاملة", "Full menu")}>
        <PublicMenuView menu={menu} preview={preview} />
      </section>
    </main>
  </div>;
}
