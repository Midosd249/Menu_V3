import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Clock, Instagram, MapPin, Phone, Search, X } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { EmptyState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { recordPublicEvent } from "@/lib/menu/public";
import { getGuestSessionId } from "@/lib/menu/session";
import type { Lang, Product, ProductOptions, PublicMenu } from "@/lib/menu/types";
import { cn, formatSar, weekdayLabel } from "@/lib/utils";

const label = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar : en;
const value = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar || en : en || ar;

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.5 2 2 6.49 2 12.05c0 1.77.46 3.45 1.28 4.92L2 22l5.16-1.35a9.96 9.96 0 0 0 4.88 1.24h.01c5.54 0 10.04-4.49 10.04-10.04 0-2.68-1.04-5.2-2.94-7.09Zm-7.01 15.4h-.01a8.28 8.28 0 0 1-4.22-1.16l-.3-.18-3.06.8.82-2.98-.2-.31a8.26 8.26 0 0 1-1.27-4.42c0-4.57 3.72-8.29 8.3-8.29 2.22 0 4.3.86 5.86 2.43a8.24 8.24 0 0 1 2.43 5.87c0 4.58-3.73 8.3-8.35 8.3Zm4.56-6.21c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.16 1.73 2.64 4.2 3.7.59.25 1.04.41 1.4.52.59.18 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" /></svg>;
}

function DishMedia({ product, className = "" }: { product: Product; className?: string }) {
  if (product.imageUrl) return <img src={product.imageUrl} alt="" loading="lazy" className={cn("object-cover", className)} />;
  return <div className={cn("grid place-items-center bg-sand text-xs text-muted", className)} aria-hidden>Menu</div>;
}

function ProductSheet({ lang, product, options, close }: { lang: Lang; product: Product; options?: ProductOptions; close: () => void }) {
  const [variantId, setVariantId] = useState(options?.variants[0]?.id ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const variants = options?.variants ?? [];
  const groups = options?.groups.filter((g) => g.isActive) ?? [];
  const basePrice = variants.find((v) => v.id === variantId)?.price ?? product.price;
  const optionTotal = (options?.options ?? []).filter((o) => selected.includes(o.id)).reduce((sum, o) => sum + o.priceDelta, 0);
  const total = basePrice + optionTotal;
  const toggle = (groupId: string, optionId: string, max: number) => setSelected((current) => {
    if (current.includes(optionId)) return current.filter((id) => id !== optionId);
    const count = current.filter((id) => (options?.options ?? []).some((o) => o.id === id && o.groupId === groupId)).length;
    if (count >= max) return current;
    return [...current, optionId];
  });
  return <div className="fixed inset-0 z-50 grid items-end bg-black/45 sm:items-center sm:p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="product-details-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-paper shadow-2xl sm:mx-auto sm:max-w-lg sm:rounded-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/95 px-4 py-3 backdrop-blur"><span className="text-sm font-medium">{label(lang, "تفاصيل الصنف", "Item details")}</span><button type="button" onClick={close} aria-label={label(lang, "إغلاق", "Close")} className="grid size-10 place-items-center rounded-full hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"><X className="size-5" /></button></div>
      <div className="grid gap-5 p-4"><DishMedia product={product} className="h-56 w-full rounded-xl" /><div className="grid gap-2"><h2 id="product-details-title" className="text-2xl font-semibold">{value(lang, product.nameAr, product.nameEn)}</h2><p className="text-lg font-medium text-accent">{formatSar(total, lang)}</p>{product.descriptionAr || product.descriptionEn ? <p className="text-sm leading-6 text-ink-soft">{value(lang, product.descriptionAr, product.descriptionEn)}</p> : null}</div>
        {product.tags.length ? <div className="flex flex-wrap gap-2">{product.tags.map((x) => <span key={x} className="rounded-full border border-line px-3 py-1 text-xs text-muted">#{x}</span>)}</div> : null}
        {product.dietaryLabels.length ? <div className="flex flex-wrap gap-2">{product.dietaryLabels.map((x) => <span key={x} className="rounded-full bg-sand px-3 py-1 text-xs">{x}</span>)}</div> : null}
        {product.allergens ? <p className="rounded-xl bg-sand p-3 text-xs leading-5"><strong>{label(lang, "مسببات الحساسية:", "Allergens:")}</strong> {product.allergens}</p> : null}
        {product.calories != null ? <p className="text-xs text-muted">{product.calories} {label(lang, "سعرة حرارية", "calories")}</p> : null}
        {variants.length ? <div className="grid gap-2 border-t border-line pt-4"><p className="text-sm font-medium">{label(lang, "الحجم", "Size")}</p>{variants.map((v) => <label key={v.id} className={cn("flex cursor-pointer items-center justify-between rounded-xl border p-3", variantId === v.id ? "border-ink bg-sand" : "border-line")}><span className="flex items-center gap-2"><input type="radio" name="product-variant" checked={variantId === v.id} onChange={() => setVariantId(v.id)} />{value(lang, v.nameAr, v.nameEn)}</span><span className="text-sm text-accent">{formatSar(v.price, lang)}</span></label>)}</div> : null}
        {groups.map((g) => { const items = (options?.options ?? []).filter((o) => o.groupId === g.id && o.isAvailable); return <div key={g.id} className="grid gap-2 border-t border-line pt-4"><div><p className="text-sm font-medium">{value(lang, g.nameAr, g.nameEn)} {g.isRequired ? <span className="text-bad">*</span> : null}</p><p className="text-xs text-muted">{label(lang, `اختر من ${g.minSelect} إلى ${g.maxSelect}`, `Choose ${g.minSelect} to ${g.maxSelect}`)}</p></div>{items.map((o) => <label key={o.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-line p-3"><span className="flex items-center gap-2"><input type={g.maxSelect === 1 ? "radio" : "checkbox"} name={`modifier-${g.id}`} checked={selected.includes(o.id)} onChange={() => toggle(g.id, o.id, g.maxSelect)} />{value(lang, o.nameAr, o.nameEn)}</span><span className="text-sm text-accent">{o.priceDelta === 0 ? "—" : `${o.priceDelta > 0 ? "+" : ""}${formatSar(o.priceDelta, lang)}`}</span></label>)}</div>; })}
      </div>
    </section>
  </div>;
}

function openNow(hours: PublicMenu["hours"]) {
  const h = hours.find((x) => x.weekday === new Date().getDay());
  if (!h || h.isClosed || !h.opensAt || !h.closesAt) return h ? false : null;
  const minutes = (v: string) => { const [a, b] = v.split(":").map(Number); return a * 60 + b; };
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  const a = minutes(h.opensAt), b = minutes(h.closesAt);
  return b <= a ? now >= a || now <= b : now >= a && now <= b;
}

export function PublicMenuView({ menu, preview = false }: { menu: PublicMenu; preview?: boolean }) {
  const { lang } = useLang();
  const { tenant, branch, branches, hours, categories, products } = menu;
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visible = preview ? products : products.filter((p) => p.isAvailable);
  const selected = visible.find((p) => p.id === selectedId);
  const featured = visible.filter((p) => p.isFeatured);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visible.filter((p) => (categoryId === "all" || p.categoryId === categoryId) && (!q || [p.nameAr, p.nameEn, p.descriptionAr, p.descriptionEn, ...p.tags, ...p.dietaryLabels].some((x) => x.toLowerCase().includes(q))));
  }, [visible, query, categoryId]);
  const status = openNow(hours);

  useEffect(() => {
    if (preview) return;
    void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: new URLSearchParams(window.location.search).get("src") === "qr" ? "qr_scan" : "visit", lang, sessionId: getGuestSessionId() } });
  }, [tenant.slug, branch.slug, lang, preview]);
  const trackProduct = (p: Product) => { setSelectedId(p.id); if (!preview) void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, productId: p.id, eventType: "product_view", lang, sessionId: getGuestSessionId() } }); };
  const wa = tenant.whatsapp ? `https://wa.me/${tenant.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(tenant.whatsappTemplate.replace("{product}", value(lang, selected?.nameAr ?? "", selected?.nameEn ?? "")).replace("{restaurant}", value(lang, tenant.nameAr, tenant.nameEn)))}` : null;

  return <div className="min-h-dvh bg-paper text-ink" style={{ "--menu-accent": tenant.accentColor, "--menu-ink": tenant.primaryColor } as CSSProperties}>
    {preview ? <div className="bg-ink px-4 py-2 text-center text-xs text-paper">{label(lang, "معاينة المالك — هذه ليست النسخة المنشورة", "Owner preview — this is not the published version")}</div> : null}
    <header className="relative overflow-hidden bg-ink text-paper"><div className="absolute inset-0 opacity-45" style={{ background: tenant.coverUrl ? `center/cover url(${tenant.coverUrl})` : `radial-gradient(100% 80% at 85% 0%, ${tenant.accentColor} 0%, transparent 55%)` }} /><div className="relative mx-auto grid max-w-2xl gap-5 px-5 pb-9 pt-6">
      <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3">{tenant.logoUrl ? <img src={tenant.logoUrl} alt="" className="size-12 rounded-xl object-cover" /> : <div className="grid size-12 place-items-center rounded-xl bg-[var(--menu-accent)] font-semibold">{tenant.nameAr.slice(0, 1)}</div>}<div><p className="text-xs text-paper/70">{tenant.city}</p><h1 className="font-display text-2xl font-semibold">{value(lang, tenant.nameAr, tenant.nameEn)}</h1></div></div><LangToggle /></div>
      {tenant.taglineAr || tenant.taglineEn ? <p className="text-sm text-paper/80">{value(lang, tenant.taglineAr, tenant.taglineEn)}</p> : null}<div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-paper/10 px-3 py-1">{status == null ? label(lang, "ساعات العمل", "Opening hours") : status ? label(lang, "مفتوح الآن", "Open now") : label(lang, "مغلق الآن", "Closed")}</span><span className="rounded-full bg-paper/10 px-3 py-1">{value(lang, branch.nameAr, branch.nameEn)}</span></div>
      <div className="flex flex-wrap gap-2">{wa ? <a href={wa} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--menu-accent)] px-3 text-sm font-medium" onClick={() => !preview && void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: "whatsapp", lang, sessionId: getGuestSessionId() } })}><WhatsAppIcon />{label(lang, "واتساب", "WhatsApp")}</a> : null}{branch.mapsUrl ? <a href={branch.mapsUrl} className="inline-flex h-10 items-center gap-2 rounded-xl bg-paper/10 px-3 text-sm"><MapPin className="size-4" />{label(lang, "الموقع", "Location")}</a> : null}{branch.phone ? <a href={`tel:${branch.phone}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-paper/10 px-3 text-sm"><Phone className="size-4" />{label(lang, "اتصال", "Call")}</a> : null}{tenant.instagramUrl ? <a href={tenant.instagramUrl} className="inline-flex h-10 items-center gap-2 rounded-xl bg-paper/10 px-3 text-sm"><Instagram className="size-4" />Instagram</a> : null}</div>
    </div></header>
    {branches.length > 1 ? <nav aria-label={label(lang, "الفروع", "Branches")} className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-4 py-3 no-scrollbar">{branches.map((b) => <a key={b.id} href={`/m/${tenant.slug}/${b.slug}`} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-sm", b.id === branch.id ? "border-ink bg-ink text-paper" : "border-line")}>{value(lang, b.nameAr, b.nameEn)}</a>)}</nav> : null}
    <div className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur"><div className="mx-auto grid max-w-2xl gap-3 px-4 py-3"><label className="relative block"><Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted start-3" /><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label={label(lang, "بحث", "Search")} placeholder={label(lang, "ابحث في المنيو", "Search menu")} className="h-11 w-full rounded-xl border border-line bg-paper pe-3 ps-10 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" /></label><div className="flex gap-2 overflow-x-auto no-scrollbar">{[["all", label(lang, "الكل", "All")], ...categories.map((c) => [c.id, value(lang, c.nameAr, c.nameEn)])].map(([id, text]) => <button key={id} type="button" onClick={() => setCategoryId(id)} aria-pressed={categoryId === id} className={cn("h-9 shrink-0 rounded-full px-3 text-sm", categoryId === id ? "bg-ink text-paper" : "bg-sand text-ink-soft")}>{text}</button>)}</div></div></div>
    <main className="mx-auto grid max-w-2xl gap-8 px-4 py-7">{featured.length && categoryId === "all" && !query ? <section className="grid gap-3"><h2 className="text-sm font-medium text-muted">{label(lang, "الأكثر تميزاً", "Featured")}</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{featured.map((p) => <button key={p.id} type="button" onClick={() => trackProduct(p)} className="overflow-hidden rounded-xl border border-line bg-paper text-start shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"><DishMedia product={p} className="h-32 w-full" /><span className="grid gap-1 p-3"><span className="font-medium">{value(lang, p.nameAr, p.nameEn)}</span><span className="text-sm text-accent">{formatSar(p.price, lang)}</span></span></button>)}</div></section> : null}
      {filtered.length === 0 ? <EmptyState title={label(lang, "لا توجد أصناف مطابقة", "No matching items")} /> : (categoryId === "all" ? categories : categories.filter((c) => c.id === categoryId)).map((c) => { const items = filtered.filter((p) => p.categoryId === c.id); if (!items.length) return null; return <section key={c.id} className="grid gap-3"><h2 className="text-xl font-semibold">{value(lang, c.nameAr, c.nameEn)}</h2><ul className="grid gap-3 sm:grid-cols-2">{items.map((p) => <li key={p.id}><button type="button" onClick={() => trackProduct(p)} className="grid w-full grid-cols-[96px_1fr] gap-3 rounded-xl border border-line bg-paper p-2 text-start shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:grid-cols-[112px_1fr]"><DishMedia product={p} className="h-24 w-24 rounded-lg sm:h-28 sm:w-28" /><span className="grid min-w-0 content-center gap-1"><span className="font-medium">{value(lang, p.nameAr, p.nameEn)}</span><span className="line-clamp-2 text-sm text-muted">{value(lang, p.descriptionAr, p.descriptionEn)}</span><span className="text-sm font-medium text-accent">{formatSar(p.price, lang)}</span>{p.dietaryLabels.length ? <span className="text-[11px] text-muted">{p.dietaryLabels.slice(0, 2).join(" · ")}</span> : null}</span></button></li>)}</ul></section>; })}
      {hours.length ? <section className="grid gap-3 rounded-2xl border border-line bg-sand p-4"><div className="flex items-center gap-2"><Clock className="size-4" /><h2 className="font-medium">{label(lang, "ساعات العمل", "Opening hours")}</h2></div>{[0,1,2,3,4,5,6].map((d) => { const h = hours.find((x) => x.weekday === d); return <div key={d} className="flex justify-between text-sm"><span>{weekdayLabel(d, lang)}</span><span className="text-muted">{!h || h.isClosed ? label(lang, "مغلق", "Closed") : `${h.opensAt} – ${h.closesAt}`}</span></div>; })}</section> : null}
    </main>
    {selected ? <ProductSheet lang={lang} product={selected} options={menu.productOptions?.[selected.id]} close={() => setSelectedId(null)} /> : null}
  </div>;
}
