import { useEffect } from "react";
import { LangToggle } from "@/components/lang-toggle";
import { MenuMedia, MenuPrice } from "@/components/menu";
import { PublicMenuView } from "@/components/public-menu";
import { useLang } from "@/lib/lang";
import { getGuestSessionId } from "@/lib/menu/session";
import { recordPublicEvent } from "@/lib/menu/public";
import type { Lang, PublicMenu } from "@/lib/menu/types";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar || en : en || ar;

export function FineDiningHospitalityTemplate({ menu, preview = false }: { menu: PublicMenu; preview?: boolean }) {
  const { lang } = useLang();
  const { tenant, branch, products } = menu;
  const visible = preview ? products : products.filter((product) => product.isAvailable);
  const signature = visible.filter((product) => product.isFeatured).slice(0, 3);
  const tagline = text(lang, tenant.taglineAr, tenant.taglineEn);

  useEffect(() => {
    if (!preview) void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: "visit", lang, sessionId: getGuestSessionId() } });
  }, [branch.slug, lang, preview, tenant.slug]);

  return <div className="min-h-dvh bg-[#151210] text-[#f6efe6]"><header className="relative overflow-hidden border-b border-[#3a322c]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(210,160,105,0.16),transparent_55%)]" /><div className="relative mx-auto max-w-4xl px-5 pb-10 pt-7 sm:px-8"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-center gap-4">{tenant.logoUrl ? <img src={tenant.logoUrl} alt="" className="size-16 rounded-full object-cover ring-1 ring-[#5b4b3e]" /> : <div className="grid size-16 place-items-center rounded-full border border-[#6b5848] text-2xl font-display">{text(lang, tenant.nameAr, tenant.nameEn).slice(0, 1)}</div>}<div className="min-w-0"><p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#caa477]">{text(lang, "القائمة", "Menu")}</p><h1 className="font-display text-3xl font-semibold leading-tight">{text(lang, tenant.nameAr, tenant.nameEn)}</h1><p className="mt-1 text-xs text-[#b9aaa0]">{text(lang, branch.nameAr, branch.nameEn)}{tenant.city ? ` · ${tenant.city}` : ""}</p></div></div><div className="rounded-full bg-white/5"><LangToggle /></div></div>{tagline ? <p className="mt-7 max-w-2xl font-display text-lg leading-8 text-[#d9cec3]">{tagline}</p> : null}</div></header>
    <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8"><section className="grid gap-5"><div><p className="text-[11px] uppercase tracking-[0.25em] text-[#caa477]">{text(lang, "مختارات", "Featured")}</p><h2 className="mt-2 font-display text-2xl font-semibold">{text(lang, "أطباق مختارة", "Selected dishes")}</h2></div>{signature.length ? <div className="grid gap-4 md:grid-cols-3">{signature.map((product) => <article key={product.id} className="overflow-hidden rounded-[1.5rem] border border-[#3a322c] bg-[#1d1916]"><MenuMedia src={product.imageUrl} className="aspect-[4/3] w-full" /><div className="p-4"><h3 className="font-display text-lg">{text(lang, product.nameAr, product.nameEn)}</h3><p className="mt-1 text-xs leading-5 text-[#b9aaa0]">{text(lang, product.descriptionAr, product.descriptionEn)}</p><MenuPrice price={product.price} currency={product.currency} lang={lang} className="mt-3 text-sm text-[#d8ad78]" /></div></article>)}</div> : <p className="rounded-2xl border border-dashed border-[#3a322c] p-5 text-sm text-[#b9aaa0]">{text(lang, "اكتشف القائمة بالأسفل.", "Explore the menu below.")}</p>}</section>
      <section className="mt-10 border-t border-[#3a322c] pt-8"><PublicMenuView menu={menu} /></section>
    </main></div>;
}
