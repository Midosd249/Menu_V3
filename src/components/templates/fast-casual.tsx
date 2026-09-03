import { useEffect, useMemo, useState } from "react";
import { Plus, Search, ShoppingBag } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { MenuMedia, MenuPrice } from "@/components/menu";
import { useLang } from "@/lib/lang";
import { getGuestSessionId } from "@/lib/menu/session";
import { recordPublicEvent } from "@/lib/menu/public";
import type { Lang, Product, PublicMenu } from "@/lib/menu/types";
import { cn } from "@/lib/utils";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar || en : en || ar;

export function FastCasualTemplate({ menu, preview = false }: { menu: PublicMenu; preview?: boolean }) {
  const { lang } = useLang();
  const { tenant, branch, categories, products } = menu;
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const visible = preview ? products : products.filter((product) => product.isAvailable);
  const featured = visible.filter((product) => product.isFeatured).slice(0, 4);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return visible.filter((product) => {
      const matchesCategory = categoryId === "all" || product.categoryId === categoryId;
      const haystack = [product.nameAr, product.nameEn, product.descriptionAr, product.descriptionEn, ...product.tags].join(" ").toLowerCase();
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [categoryId, query, visible]);

  useEffect(() => {
    if (!preview) void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: "visit", lang, sessionId: getGuestSessionId() } });
  }, [branch.slug, lang, preview, tenant.slug]);

  const QuickProduct = ({ product }: { product: Product }) => (
    <button type="button" onClick={() => setCartCount((count) => Math.min(99, count + 1))} className="group overflow-hidden rounded-2xl border border-line bg-paper text-start shadow-sm">
      <MenuMedia src={product.imageUrl} className="aspect-square w-full transition-transform group-hover:scale-[1.02]" />
      <span className="block p-3"><span className="line-clamp-1 font-bold">{text(lang, product.nameAr, product.nameEn)}</span><span className="mt-1 flex items-center justify-between gap-2"><MenuPrice price={product.price} currency={product.currency} lang={lang} className="text-sm font-bold text-accent" /><Plus className="size-5 rounded-full bg-accent p-1 text-white" /></span></span>
    </button>
  );

  return <div className="min-h-dvh bg-paper text-ink"><header className="bg-ink text-paper"><div className="mx-auto grid max-w-3xl gap-5 px-5 pb-7 pt-6"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-center gap-3">{tenant.logoUrl ? <img src={tenant.logoUrl} alt="" className="size-14 rounded-2xl object-cover" /> : <div className="grid size-14 place-items-center rounded-2xl bg-accent text-xl font-black">{text(lang, tenant.nameAr, tenant.nameEn).slice(0, 1)}</div>}<div className="min-w-0"><p className="text-xs uppercase tracking-[0.16em] text-paper/60">{tenant.city}</p><h1 className="truncate font-display text-2xl font-black">{text(lang, tenant.nameAr, tenant.nameEn)}</h1></div></div><LangToggle /></div>{tenant.taglineAr || tenant.taglineEn ? <p className="text-sm leading-6 text-paper/70">{text(lang, tenant.taglineAr, tenant.taglineEn)}</p> : null}</div></header>
    <main className="mx-auto grid max-w-3xl gap-7 px-5 py-6"><section className="grid gap-4"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{text(lang, "سريع ولذيذ", "Fast & tasty")}</p><h2 className="mt-1 text-2xl font-black">{text(lang, "ماذا تشتهي؟", "What are you craving?")}</h2></div>{cartCount > 0 ? <button type="button" aria-label={text(lang, "السلة", "Cart")} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 font-bold text-white"><ShoppingBag className="size-4" />{cartCount}</button> : null}</div><label className="relative block"><Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={text(lang, "بحث في المنيو", "Search menu")} placeholder={text(lang, "ابحث عن برجر، بيتزا، وجبة…", "Search burgers, pizza, meals…")} className="h-13 w-full rounded-2xl border-2 border-line bg-paper ps-12 pe-4 outline-none focus:border-accent" /></label><nav className="flex gap-2 overflow-x-auto pb-1" aria-label={text(lang, "أقسام المنيو", "Menu categories")}><button type="button" onClick={() => setCategoryId("all")} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-bold", categoryId === "all" ? "bg-ink text-paper" : "bg-sand text-muted")}>{text(lang, "الكل", "All")}</button>{categories.filter((category) => category.isActive).map((category) => <button type="button" key={category.id} onClick={() => setCategoryId(category.id)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-bold", categoryId === category.id ? "bg-ink text-paper" : "bg-sand text-muted")}>{text(lang, category.nameAr, category.nameEn)}</button>)}</nav></section>
      {featured.length > 0 && categoryId === "all" && !query ? <section className="grid gap-3"><h2 className="text-lg font-black">{text(lang, "الأكثر طلباً", "Most wanted")}</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{featured.map((product) => <QuickProduct key={product.id} product={product} />)}</div></section> : null}
      <section className="grid gap-3"><div className="flex items-center justify-between"><h2 className="text-lg font-black">{text(lang, "كل الأصناف", "Full menu")}</h2><span className="text-xs text-muted">{filtered.length}</span></div><div className="grid gap-3">{filtered.map((product) => <article key={product.id} className="flex gap-3 rounded-2xl border border-line bg-paper p-3"><MenuMedia src={product.imageUrl} className="size-24 shrink-0 rounded-xl" /><div className="min-w-0 flex-1"><h3 className="line-clamp-2 font-bold">{text(lang, product.nameAr, product.nameEn)}</h3>{product.descriptionAr || product.descriptionEn ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{text(lang, product.descriptionAr, product.descriptionEn)}</p> : null}<div className="mt-2 flex items-center justify-between"><MenuPrice price={product.price} currency={product.currency} lang={lang} className="font-bold text-accent" /><button type="button" onClick={() => setCartCount((count) => Math.min(99, count + 1))} aria-label={text(lang, `إضافة ${product.nameAr}`, `Add ${product.nameEn || product.nameAr}`)} className="grid size-9 place-items-center rounded-xl bg-accent text-white"><Plus className="size-5" /></button></div></div></article>)}</div></section>
    </main></div>;
}
