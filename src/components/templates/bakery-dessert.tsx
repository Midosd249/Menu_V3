import type { PublicMenu } from "@/lib/menu/types";
import { PublicMenuView } from "@/components/public-menu";
import { useLang } from "@/lib/lang";
import { LangToggle } from "@/components/lang-toggle";

/**
 * Gallery presentation shell.
 *
 * The public-menu data, ordering, cart, search, filtering, Quick Add and
 * option/note flows remain owned by the shared renderer. This shell only
 * establishes the approved Mazaq/Taste visual hierarchy around it.
 */
export function BakeryDessertTemplate({ menu }: { menu: PublicMenu }) {
  const { lang } = useLang();
  const { tenant } = menu;
  const name = lang === "ar" ? tenant.nameAr || tenant.nameEn : tenant.nameEn || tenant.nameAr;
  const tagline = lang === "ar" ? tenant.taglineAr || tenant.taglineEn : tenant.taglineEn || tenant.taglineAr;

  return (
    <div className="gallery-public-frame min-h-dvh bg-[#241b14] text-[#f4e7d3]">
      <header
        className="gallery-brand-header gallery-hero mx-auto max-w-3xl px-3 pb-2 pt-3"
        style={
          tenant.coverUrl
            ? { backgroundImage: `linear-gradient(180deg, rgba(36,27,20,.08), rgba(36,27,20,.82)), url(${tenant.coverUrl})` }
            : undefined
        }
      >
        <div className="overflow-hidden rounded-[1.1rem] border-0 bg-[#3a2a20] shadow-2xl">
          <div className="gallery-brand-row flex items-start justify-between gap-4 px-4 py-4">
            <div className="gallery-brand-copy flex min-w-0 items-center gap-3">
              {tenant.logoUrl ? (
                <img src={tenant.logoUrl} alt="" className="gallery-brand-logo size-11 shrink-0 rounded-xl object-cover" />
              ) : (
                <div className="gallery-brand-logo grid size-11 shrink-0 place-items-center rounded-xl bg-[#2a2018] text-lg font-bold text-[#f4e7d3]">
                  {name.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0">
                <p className="gallery-brand-kicker text-[10px] font-semibold uppercase tracking-[0.16em]">
                  {lang === "ar" ? "تجربة مذاق" : "Mazaq Experience"}
                </p>
                <h1 className="gallery-brand-name truncate font-display font-bold">{name}</h1>
              </div>
            </div>
            <div className="gallery-brand-language shrink-0">
              <LangToggle />
            </div>
          </div>
          {tagline ? <p className="gallery-brand-tagline px-4 pb-4 leading-6">{tagline}</p> : null}
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-3 pb-6 pt-2">
        <PublicMenuView menu={menu} />
      </div>
    </div>
  );
}
