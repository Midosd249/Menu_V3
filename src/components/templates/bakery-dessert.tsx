import type { PublicMenu } from "@/lib/menu/types";
import { PublicMenuView } from "@/components/public-menu";
import { useLang } from "@/lib/lang";
import { ArrowDown } from "lucide-react";

/**
 * Gallery / Canva reference implementation.
 *
 * The visual composition is intentionally based on the supplied Canva source
 * and reference capture. PublicMenuView remains the owner of all live menu
 * behavior: search, categories, product options, item notes, Quick Add, cart,
 * ordering, language and accessibility.
 */
export function BakeryDessertTemplate({ menu }: { menu: PublicMenu }) {
  const { lang } = useLang();
  const { tenant } = menu;
  const name = lang === "ar" ? tenant.nameAr || tenant.nameEn : tenant.nameEn || tenant.nameAr;
  const tagline = lang === "ar" ? tenant.taglineAr || tenant.taglineEn : tenant.taglineEn || tenant.taglineAr;
  const heroTitle = lang === "ar" ? `${name}\nمنيو بطابع مختلف` : `${name}\nA menu with a different character`;
  const heroCopy = lang === "ar"
    ? tagline || "أطباق معاصرة، مكونات منتقاة، ونكهات جريئة تُحضّر لتُشارك أجمل اللحظات."
    : tagline || "Contemporary dishes, selected ingredients, and bold flavors made to share memorable moments.";

  return (
    <div className="gallery-public-frame gallery-canva-reference min-h-dvh bg-[#f7f0e4] text-[#17140f]">
      <section
        id="home"
        className="gallery-canva-hero hero relative overflow-hidden bg-[#17140f]"
        style={tenant.coverUrl ? { backgroundImage: `url(${tenant.coverUrl})` } : undefined}
      >
        <div className="gallery-canva-hero-copy mx-auto flex min-h-[30rem] max-w-7xl items-end px-5 py-14">
          <div className="max-w-2xl text-white">
            <p className="gallery-canva-hero-kicker mb-5 inline-block border-b pb-2 font-bold tracking-[.12em]">
              {lang === "ar" ? "مذاق يلفت النظر" : "A taste worth noticing"}
            </p>
            <h1 className="gallery-canva-hero-title mb-5 whitespace-pre-line font-display font-bold">
              {heroTitle}
            </h1>
            <p className="gallery-canva-hero-copy mb-8 max-w-xl leading-relaxed">
              {heroCopy}
            </p>
            <a href="#menu" className="gallery-canva-hero-button inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold transition">
              <span>{lang === "ar" ? "استكشف المنيو" : "Explore menu"}</span>
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <div id="menu" className="gallery-canva-menu mx-auto w-full max-w-7xl">
        <PublicMenuView menu={menu} />
      </div>
    </div>
  );
}
