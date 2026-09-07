import { LangToggle } from "@/components/lang-toggle";
import { MenuMedia, MenuPrice } from "@/components/menu";
import { PublicMenuView } from "@/components/public-menu";
import { useLang } from "@/lib/lang";
import type { Lang, PublicMenu } from "@/lib/menu/types";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar || en : en || ar;

export function FineDiningHospitalityTemplate({ menu, preview = false }: { menu: PublicMenu; preview?: boolean }) {
  const { lang } = useLang();
  const { tenant, branch, products } = menu;
  const visible = preview ? products : products.filter((product) => product.isAvailable);
  const signature = visible.filter((product) => product.isFeatured).slice(0, 3);
  const tagline = text(lang, tenant.taglineAr, tenant.taglineEn);

  return <div className="noir-template-shell min-h-dvh">
    <header className="noir-template-hero">
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
      <section className="noir-template-featured" aria-labelledby="noir-featured-heading">
        <div className="noir-template-section-heading">
          <p>{text(lang, "مختارات", "Featured")}</p>
          <h2 id="noir-featured-heading">{text(lang, "أطباق مختارة", "Selected dishes")}</h2>
        </div>
        {signature.length ? <div className="noir-template-featured-grid">
          {signature.map((product) => <article key={product.id} className="noir-template-featured-card">
            <MenuMedia src={product.imageUrl} alt={text(lang, product.nameAr, product.nameEn)} className="noir-template-featured-image" />
            <div className="noir-template-featured-copy">
              <h3>{text(lang, product.nameAr, product.nameEn)}</h3>
              {product.descriptionAr || product.descriptionEn ? <p dir="auto">{text(lang, product.descriptionAr, product.descriptionEn)}</p> : null}
              <MenuPrice price={product.price} currency={product.currency} lang={lang} className="noir-template-featured-price" />
            </div>
          </article>)}
        </div> : <p className="noir-template-featured-empty">{text(lang, "اكتشف القائمة بالأسفل.", "Explore the menu below.")}</p>}
      </section>

      <section className="noir-template-menu" aria-label={text(lang, "القائمة الكاملة", "Full menu")}>
        <PublicMenuView menu={menu} preview={preview} />
      </section>
    </main>
  </div>;
}
