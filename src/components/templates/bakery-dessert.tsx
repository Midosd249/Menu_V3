import type { PublicMenu } from "@/lib/menu/types";
import { PublicMenuView } from "@/components/public-menu";
import { useLang } from "@/lib/lang";
import { LangToggle } from "@/components/lang-toggle";

/**
 * Bakery & Dessert presentation shell.
 *
 * Keeps the existing public-menu ordering/data contracts intact while giving
 * bakery and dessert brands a dedicated, image-led visual hierarchy.
 */
export function BakeryDessertTemplate({ menu }: { menu: PublicMenu }) {
  const { lang } = useLang();
  const { tenant } = menu;
  const name = lang === "ar" ? tenant.nameAr || tenant.nameEn : tenant.nameEn || tenant.nameAr;
  const tagline = lang === "ar" ? tenant.taglineAr || tenant.taglineEn : tenant.taglineEn || tenant.taglineAr;

  return (
    <div className="min-h-dvh bg-[#fffaf5] text-[#2b211c]">
      <header className="mx-auto max-w-3xl px-5 pb-2 pt-5">
        <div className="overflow-hidden rounded-[2rem] border border-[#eadfd5] bg-[#f6eadf] shadow-sm">
          <div className="flex items-start justify-between gap-4 px-5 py-5">
            <div className="flex min-w-0 items-center gap-3">
              {tenant.logoUrl ? (
                <img src={tenant.logoUrl} alt="" className="size-14 rounded-2xl object-cover" />
              ) : (
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#2b211c] text-xl font-bold text-white">
                  {name.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f60]">
                  {lang === "ar" ? "مخبوزات وحلويات" : "Bakery & Dessert"}
                </p>
                <h1 className="truncate font-display text-2xl font-bold">{name}</h1>
              </div>
            </div>
            <LangToggle />
          </div>
          {tagline ? <p className="px-5 pb-5 text-sm leading-6 text-[#705e53]">{tagline}</p> : null}
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 pb-6 pt-2">
        <PublicMenuView menu={menu} />
      </div>
    </div>
  );
}
