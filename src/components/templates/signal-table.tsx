import { useEffect, useMemo, useRef, useState } from "react";
import { Languages, MapPin, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { EmptyState } from "@/components/state-panel";
import { MenuBadge, MenuMedia, MenuPrice } from "@/components/menu";
import { PublicActionLinks } from "@/components/public-action-links";
import { useLang } from "@/lib/lang";
import { recordPublicEvent } from "@/lib/menu/public";
import { submitPublicOrder } from "@/lib/menu/order-public";
import { getQuickAddDecision, quickAddKey } from "@/lib/menu/quick-add";
import { isPublicMenuLocaleAvailable } from "@/lib/menu/seo";
import type { Lang, Product, ProductOptions, PublicMenu } from "@/lib/menu/types";
import { cn, formatSar, weekdayLabel } from "@/lib/utils";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar || en : en || ar;
type CartItem = { key: string; product: Product; options: ProductOptions; variantId: string; modifierOptionIds: string[]; unitPrice: number; quantity: number };
type Props = { menu: PublicMenu; preview?: boolean };

function SignalLanguageControl({ lang, englishAvailable }: { lang: Lang; englishAvailable: boolean }) {
  const nextLang = lang === "ar" ? "en" : "ar";
  const nextLabel = nextLang === "ar" ? "عربي" : "EN";
  const nextFlag = nextLang === "ar" ? "🇸🇦" : "🇬🇧";
  const disabled = nextLang === "en" && !englishAvailable;

  const changeLang = () => {
    if (disabled || typeof window === "undefined") return;
    const nextUrl = new URL(window.location.href);
    if (nextLang === "en") nextUrl.searchParams.set("lang", "en");
    else nextUrl.searchParams.delete("lang");
    window.location.replace(nextUrl.toString());
  };

  return <button type="button" data-language-switcher="true" aria-label={nextLang === "ar" ? "التبديل إلى العربية" : "Switch to English"} aria-disabled={disabled} disabled={disabled} title={disabled ? (lang === "ar" ? "النسخة الإنجليزية غير متاحة لهذا المطعم" : "English content is not available for this menu") : undefined} className="signal-topbar-lang menu-lang-toggle inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-line bg-paper px-2.5 text-xs font-semibold" onClick={changeLang}><Languages className="size-4 shrink-0" aria-hidden="true" /><span aria-hidden="true">{nextFlag}</span><span dir="ltr">{nextLabel}</span></button>;
}

function ProductDialog({ lang, product, options, close, add, submitting }: { lang: Lang; product: Product; options?: ProductOptions; close: () => void; add: (item: CartItem) => void; submitting: boolean }) {
  const variants = options?.variants.filter((v) => v.isAvailable) ?? [];
  const groups = options?.groups.filter((g) => g.isActive) ?? [];
  const [variantId, setVariantId] = useState(variants[0]?.id ?? ""); const [selected, setSelected] = useState<string[]>([]); const [error, setError] = useState("");
  const basePrice = variants.find((v) => v.id === variantId)?.price ?? product.price; const optionTotal = (options?.options ?? []).filter((o) => selected.includes(o.id)).reduce((sum, o) => sum + o.priceDelta, 0); const total = basePrice + optionTotal;
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, [close]);
  const toggle = (groupId: string, optionId: string, max: number) => setSelected((current) => { if (current.includes(optionId)) return current.filter((id) => id !== optionId); const count = current.filter((id) => (options?.options ?? []).some((o) => o.id === id && o.groupId === groupId)).length; return count >= max ? current : [...current, optionId]; });
  const confirm = () => { for (const group of groups) { const count = selected.filter((id) => (options?.options ?? []).some((o) => o.id === id && o.groupId === group.id)).length; if (count < group.minSelect || count > group.maxSelect) { setError(text(lang, `أكمل اختيار «${group.nameAr}»`, `Complete “${group.nameEn || group.nameAr}”`)); return; } } add({ key: `${product.id}:${variantId}:${[...selected].sort().join(",")}`, product, options: options ?? { variants: [], groups: [], options: [] }, variantId, modifierOptionIds: [...selected].sort(), unitPrice: total, quantity: 1 }); close(); };
  return <div className="fixed inset-0 z-[60] grid items-end bg-black/55 p-0 sm:items-center sm:p-5" onMouseDown={(e) => e.target === e.currentTarget && close()} role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="signal-product-title" className="signal-dialog max-h-[94dvh] w-full overflow-y-auto bg-paper shadow-2xl sm:mx-auto sm:max-w-xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/95 px-5 py-4 backdrop-blur"><span className="text-xs font-semibold uppercase tracking-[0.16em]">{text(lang, "تفاصيل الطبق", "Dish details")}</span><button type="button" onClick={close} aria-label={text(lang, "إغلاق", "Close")} className="grid size-11 place-items-center rounded-full border border-line hover:bg-sand focus-visible:outline-2"><X className="size-5" /></button></div><div className="grid gap-5 p-5"><MenuMedia src={product.imageUrl} alt={text(lang, product.nameAr, product.nameEn)} className="aspect-[4/3] w-full rounded-xl" eager fallback={text(lang, "صورة الطبق", "Dish image")} /><div className="grid gap-2"><h2 id="signal-product-title" className="font-display text-2xl font-semibold tracking-tight">{text(lang, product.nameAr, product.nameEn)}</h2><MenuPrice price={total} currency={product.currency} lang={lang} className="text-lg" />{product.descriptionAr || product.descriptionEn ? <p className="max-w-prose text-sm leading-6 text-ink-soft">{text(lang, product.descriptionAr, product.descriptionEn)}</p> : null}</div>{product.dietaryLabels.length ? <div className="flex flex-wrap gap-2">{product.dietaryLabels.map((x) => <MenuBadge key={x} tone="muted">{x}</MenuBadge>)}</div> : null}{product.allergens ? <p className="rounded-xl bg-sand p-4 text-xs leading-5"><strong>{text(lang, "مسببات الحساسية:", "Allergens:")}</strong> {product.allergens}</p> : null}{variants.length ? <fieldset className="grid gap-2 border-t border-line pt-5"><legend className="text-sm font-semibold">{text(lang, "الحجم", "Size")}</legend>{variants.map((v) => <label key={v.id} className={cn("flex min-h-11 cursor-pointer items-center justify-between rounded-lg border p-3", variantId === v.id && "border-ink bg-sand")}><span className="flex items-center gap-2"><input type="radio" name={`signal-variant-${product.id}`} checked={variantId === v.id} onChange={() => setVariantId(v.id)} />{text(lang, v.nameAr, v.nameEn)}</span><MenuPrice price={v.price} currency={product.currency} lang={lang} /></label>)}</fieldset> : null}{groups.map((group) => { const items = (options?.options ?? []).filter((o) => o.groupId === group.id && o.isAvailable); return <fieldset key={group.id} className="grid gap-2 border-t border-line pt-5"><legend className="text-sm font-semibold">{text(lang, group.nameAr, group.nameEn)} {group.isRequired ? "*" : ""}</legend><p className="text-xs text-muted">{text(lang, `اختر ${group.minSelect} إلى ${group.maxSelect}`, `Choose ${group.minSelect} to ${group.maxSelect}`)}</p>{items.map((item) => <label key={item.id} className="flex min-h-11 cursor-pointer items-center justify-between rounded-lg border border-line p-3"><span className="flex items-center gap-2"><input type={group.maxSelect === 1 ? "radio" : "checkbox"} name={`signal-modifier-${product.id}-${group.id}`} checked={selected.includes(item.id)} onChange={() => toggle(group.id, item.id, group.maxSelect)} />{text(lang, item.nameAr, item.nameEn)}</span><span className="text-sm text-accent">{item.priceDelta === 0 ? "—" : `${item.priceDelta > 0 ? "+" : ""}${formatSar(item.priceDelta, lang)}`}</span></label>)}</fieldset>; })}{error ? <p role="alert" className="rounded-lg bg-bad/10 p-3 text-sm text-bad">{error}</p> : null}<button type="button" disabled={submitting} onClick={confirm} className="min-h-12 rounded-full bg-ink px-5 font-medium text-paper disabled:opacity-50">{text(lang, `أضف للطلب · ${formatSar(total, lang)}`, `Add to order · ${formatSar(total, lang)}`)}</button></div></section></div>;
}

function CartDialog({ lang, items, setItems, close, submit, submitting, error }: { lang: Lang; items: CartItem[]; setItems: (items: CartItem[]) => void; close: () => void; submit: (customer: { name: string; phone: string; email: string; notes: string }) => void; submitting: boolean; error: string }) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [email, setEmail] = useState(""); const [notes, setNotes] = useState(""); const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0); const count = items.reduce((sum, item) => sum + item.quantity, 0);
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, [close]);
  const changeQty = (key: string, delta: number) => setItems(items.flatMap((item) => item.key !== key ? [item] : item.quantity + delta <= 0 ? [] : [{ ...item, quantity: Math.min(20, item.quantity + delta) }]));
  return <div className="fixed inset-0 z-[60] bg-black/55" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}><section role="dialog" aria-modal="true" aria-labelledby="signal-cart-title" className="signal-cart ms-auto flex h-full w-full max-w-lg flex-col bg-paper shadow-2xl"><header className="signal-dialog-header flex items-center justify-between border-b border-line px-5 py-4"><div><h2 id="signal-cart-title" className="font-display text-lg font-semibold">{text(lang, "طلبك", "Your order")}</h2><p className="text-xs text-muted">{count} {text(lang, "صنف", "items")}</p></div><button type="button" onClick={close} aria-label={text(lang, "إغلاق", "Close")} className="grid size-11 place-items-center rounded-full border border-line hover:bg-sand"><X className="size-5" /></button></header><div className="flex-1 space-y-3 overflow-y-auto p-5">{items.map((item) => <article key={item.key} className="grid grid-cols-[4.5rem_1fr_auto] gap-3 border-b border-line pb-3"><MenuMedia src={item.product.imageUrl} className="size-[4.5rem] rounded-lg" fallback={text(lang, "صورة", "Image")} /><div className="min-w-0"><h3 className="break-words text-sm font-semibold">{text(lang, item.product.nameAr, item.product.nameEn)}</h3><p className="text-sm text-accent">{formatSar(item.unitPrice * item.quantity, lang)}</p></div><div className="flex items-center gap-1"><button type="button" onClick={() => changeQty(item.key, -1)} aria-label={text(lang, "تقليل الكمية", "Decrease quantity")} className="grid size-9 place-items-center rounded-full border border-line"><Minus className="size-3.5" /></button><span className="min-w-6 text-center text-sm">{item.quantity}</span><button type="button" onClick={() => changeQty(item.key, 1)} aria-label={text(lang, "زيادة الكمية", "Increase quantity")} className="grid size-9 place-items-center rounded-full border border-line"><Plus className="size-3.5" /></button></div></article>)}{items.length ? <div className="grid gap-3 border-t border-line pt-5"><input value={name} onChange={(e) => setName(e.target.value)} placeholder={text(lang, "الاسم *", "Name *")} className="h-11 rounded-lg border border-line px-3 text-sm" /><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder={text(lang, "رقم الجوال *", "Phone *")} className="h-11 rounded-lg border border-line px-3 text-sm" /><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={text(lang, "البريد الإلكتروني (اختياري)", "Email (optional)")} className="h-11 rounded-lg border border-line px-3 text-sm" /><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={text(lang, "ملاحظات", "Notes")} className="min-h-24 rounded-lg border border-line p-3 text-sm" />{error ? <p role="alert" className="rounded-lg bg-bad/10 p-3 text-sm text-bad">{error}</p> : null}</div> : <EmptyState title={text(lang, "السلة فارغة", "Your cart is empty")} />}</div>{items.length ? <footer className="border-t border-line p-5"><div className="mb-3 flex items-end justify-between"><span className="text-sm text-muted">{text(lang, "الإجمالي", "Total")}</span><strong className="font-display text-xl text-accent">{formatSar(total, lang)}</strong></div><button type="button" disabled={submitting || name.trim().length < 2 || phone.trim().length < 8} onClick={() => submit({ name, phone, email, notes })} className="h-12 w-full rounded-full bg-ink font-medium text-paper disabled:opacity-50">{submitting ? text(lang, "جاري الإرسال…", "Submitting…") : text(lang, "تأكيد الطلب", "Submit order")}</button></footer> : null}</section></div>;
}

export function SignalTableTemplate({ menu, preview = false }: Props) {
  const { lang } = useLang(); const { tenant, branch, branches, hours, categories, products, experimentVariant } = menu;
  const [query, setQuery] = useState(""); const [categoryId, setCategoryId] = useState("all"); const [selectedId, setSelectedId] = useState<string | null>(null); const [cart, setCart] = useState<CartItem[]>([]); const [cartOpen, setCartOpen] = useState(false); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState<{ number: number; total: number } | null>(null); const searchTrackedRef = useRef(false);
  const visible = preview ? products : products.filter((p) => p.isAvailable); const selected = visible.find((p) => p.id === selectedId); const featured = visible.filter((p) => p.isFeatured);
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return visible.filter((p) => (categoryId === "all" || p.categoryId === categoryId) && (!q || [p.nameAr, p.nameEn, p.descriptionAr, p.descriptionEn, ...p.tags, ...p.dietaryLabels].some((x) => x.toLowerCase().includes(q)))); }, [visible, query, categoryId]);
  const status = (() => { const h = hours.find((x) => x.weekday === new Date().getDay()); if (!h || h.isClosed) return h?.isClosed ? false : null; if (!h.opensAt || !h.closesAt) return null; const mins = (v: string) => { const [a, b] = v.split(":").map(Number); return a * 60 + b; }; const now = new Date().getHours() * 60 + new Date().getMinutes(); const a = mins(h.opensAt); const b = mins(h.closesAt); return b <= a ? now >= a || now <= b : now >= a && now <= b; })();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0); const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0); const englishAvailable = isPublicMenuLocaleAvailable(menu, "en");
  useEffect(() => { if (!preview) void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: new URLSearchParams(window.location.search).get("src") === "qr" ? "qr_scan" : "visit", lang } }); }, [tenant.slug, branch.slug, lang, preview]);
  useEffect(() => {
    if (preview || searchTrackedRef.current || !query.trim()) return;
    searchTrackedRef.current = true;
    void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: "search", lang } });
  }, [branch.slug, lang, preview, query, tenant.slug]);
  const selectProduct = (product: Product) => { setSelectedId(product.id); if (!preview) void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, productId: product.id, eventType: "product_view", lang } }); };
  const trackCategory = (nextCategoryId: string) => {
    setCategoryId(nextCategoryId);
    if (!preview && nextCategoryId !== "all") {
      void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, categoryId: nextCategoryId, eventType: "category_view", lang } });
    }
  };
  const addToCart = (item: CartItem) => {
    setCart((current) => { const existing = current.find((x) => x.key === item.key); return existing ? current.map((x) => x.key === item.key ? { ...x, quantity: Math.min(20, x.quantity + 1) } : x) : [...current, item]; });
    if (!preview) {
      void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, productId: item.product.id, eventType: "add_to_cart", lang } });
    }
  };
  const addSimpleProduct = (product: Product) => { if (getQuickAddDecision(product, menu.productOptions?.[product.id]) !== "eligible") return; addToCart({ key: quickAddKey(product.id), product, options: menu.productOptions?.[product.id] ?? { variants: [], groups: [], options: [] }, variantId: "", modifierOptionIds: [], unitPrice: product.price, quantity: 1 }); };
  const submit = async (customer: { name: string; phone: string; email: string; notes: string }) => { setSubmitting(true); setError(""); const result = await submitPublicOrder({ data: { slug: tenant.slug, branchSlug: branch.slug, source: new URLSearchParams(window.location.search).get("src") === "qr" ? "qr" : "web", customerName: customer.name, customerPhone: customer.phone, customerEmail: customer.email, notes: customer.notes, items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity, selected: { variantId: item.variantId || null, modifierOptionIds: item.modifierOptionIds } })) } }); setSubmitting(false); if (!result.ok) { setError(result.error); return; } setCart([]); setCartOpen(false); setSuccess({ number: result.data.orderNumber, total: result.data.total }); };
  return <div className="menu-public-shell min-h-dvh bg-paper text-ink" data-signal-root="true" style={{ "--menu-accent": tenant.accentColor, "--menu-ink": tenant.primaryColor } as React.CSSProperties}>
    <div className="signal-topbar">
      <div className="signal-topbar-inner">
        <button
          type="button"
          className="signal-icon-button"
          onClick={() => document.getElementById("signal-search-input")?.focus()}
          aria-label={text(lang, "فتح البحث", "Open search")}
        >
          <Search className="size-4" aria-hidden="true" />
        </button>
        <div className="signal-topbar-brand">
          <MenuMedia
            src={tenant.logoUrl}
            alt=""
            eager
            fallback={tenant.nameAr.slice(0, 1)}
            className="signal-topbar-logo"
          />
          <span>{text(lang, tenant.nameAr, tenant.nameEn)}</span>
        </div>
        <div className="signal-topbar-actions">
          <SignalLanguageControl lang={lang} englishAvailable={englishAvailable} />
          {!preview ? (
            <button
              type="button"
              className="signal-topbar-cart"
              onClick={() => setCartOpen(true)}
              aria-label={text(lang, "فتح السلة", "Open cart")}
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              <span className="signal-topbar-cart-count">{cartCount}</span>
              <span>{formatSar(cartTotal, lang)}</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
    {preview ? <div className="signal-preview-banner">{text(lang, "معاينة القالب — هذه ليست النسخة المنشورة", "Template preview — this is not the published version")}</div> : null}
    <header className="signal-hero" data-signal-layer="signature">
      <div className="signal-hero-copy">
        <div className="signal-kicker"><span>{text(lang, "تجربة الضيافة", "Hospitality experience")}</span><span>{tenant.city}</span></div>
        <div className="signal-brand-row">
          <MenuMedia src={tenant.logoUrl} alt="" eager fallback={tenant.nameAr.slice(0, 1)} className="signal-brand-logo" />
          <div className="min-w-0">
            <p className="signal-branch">{text(lang, branch.nameAr, branch.nameEn)}</p>
            <h1>{text(lang, tenant.nameAr, tenant.nameEn)}</h1>
            {tenant.taglineAr || tenant.taglineEn ? <p className="signal-tagline">{text(lang, tenant.taglineAr, tenant.taglineEn)}</p> : null}
          </div>
        </div>
        <div className="signal-hero-meta">{status !== null ? <span>{status ? text(lang, "مفتوح الآن", "Open now") : text(lang, "مغلق", "Closed")}</span> : null}{branch.addressAr || branch.addressEn ? <span>{text(lang, branch.addressAr, branch.addressEn)}</span> : null}</div>
      </div>
      <div className="signal-hero-media">
        {featured[0] ? (
          <button type="button" onClick={() => selectProduct(featured[0])} className="signal-featured-stage">
            <MenuMedia src={featured[0].imageUrl} alt={text(lang, featured[0].nameAr, featured[0].nameEn)} className="signal-featured-stage-image" eager fallback={text(lang, "صورة الطبق", "Dish image")} />
            <span className="signal-featured-stage-copy">
              <span className="signal-featured-stage-label">{text(lang, "اختيار اليوم", "Signature selection")}</span>
              <span className="signal-featured-stage-name">{text(lang, featured[0].nameAr, featured[0].nameEn)}</span>
              {featured[0].descriptionAr || featured[0].descriptionEn ? <span className="signal-featured-stage-description">{text(lang, featured[0].descriptionAr, featured[0].descriptionEn)}</span> : null}
              <MenuPrice price={featured[0].price} currency={featured[0].currency} lang={lang} className="signal-featured-stage-price" />
            </span>
          </button>
        ) : tenant.coverUrl ? (
          <MenuMedia src={tenant.coverUrl} alt="" className="signal-cover" eager fallback={tenant.nameAr.slice(0, 1)} />
        ) : (
          <div className="signal-identity-fallback" aria-hidden="true">{tenant.nameAr.slice(0, 1)}</div>
        )}
      </div>
    </header>
    <div className="signal-actions-wrap"><PublicActionLinks tenant={tenant} branch={branch} lang={lang} preview={preview} experimentVariant={experimentVariant} /></div>
    {branches.length > 1 ? <nav aria-label={text(lang, "الفروع", "Branches")} className="signal-branches"><div>{branches.map((item) => <a key={item.id} href={`/m/${tenant.slug}/${item.slug}`} className={cn("signal-branch-link", item.id === branch.id && "is-active")}>{text(lang, item.nameAr, item.nameEn)}</a>)}</div></nav> : null}
    <div className="signal-search" data-signal-layer="navigation"><div className="signal-search-inner"><label className="relative block flex-1"><Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 start-3 text-muted" /><input id="signal-search-input" value={query} onChange={(e) => setQuery(e.target.value)} aria-label={text(lang, "البحث في المنيو", "Search menu")} placeholder={text(lang, "ابحث عن طبق أو مكوّن", "Search dishes or ingredients")} className="h-11 w-full rounded-full border border-line bg-paper pe-4 ps-10 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" /></label><div className="signal-categories" role="tablist" aria-label={text(lang, "تصنيفات المنيو", "Menu categories")}>{[["all", text(lang, "الكل", "All")], ...categories.map((c) => [c.id, text(lang, c.nameAr, c.nameEn)])].map(([id, name]) => <button key={id} type="button" role="tab" aria-selected={categoryId === id} onClick={() => trackCategory(id)}>{name}</button>)}</div></div></div>
    <main className="signal-main">
      {featured.length && categoryId === "all" && !query ? <section className="signal-selection" aria-labelledby="signal-selection-title"><div className="signal-section-heading"><div><p>{text(lang, "مختارات المحرر", "Editor's selection")}</p><h2 id="signal-selection-title">{text(lang, "ابدأ بهذه الأطباق", "Start with these")}</h2></div><span className="signal-heading-rule" /></div><div className="signal-featured-grid">{featured.slice(0, 6).map((p, index) => { const decision = getQuickAddDecision(p, menu.productOptions?.[p.id]); return <article key={p.id} className={cn("signal-featured-card-wrap", index === 0 && "is-lead")}><button type="button" onClick={() => selectProduct(p)} className={cn("signal-featured-card", index === 0 && "is-lead")}><MenuMedia src={p.imageUrl} alt="" className="signal-featured-image" fallback={text(lang, "صورة الطبق", "Dish image")} /><span className="signal-card-copy"><span className="signal-card-title">{text(lang, p.nameAr, p.nameEn)}</span><span className="signal-card-description">{text(lang, p.descriptionAr, p.descriptionEn)}</span><span className="signal-card-price-row"><MenuPrice price={p.price} currency={p.currency} lang={lang} className="signal-card-price" /></span></span></button>{!preview && decision === "eligible" ? <button type="button" onClick={() => addSimpleProduct(p)} className="public-menu-quick-add signal-quick-add" aria-label={text(lang, "إضافة " + text(lang, p.nameAr, p.nameEn) + " للسلة", "Add " + text(lang, p.nameAr, p.nameEn) + " to cart")}><Plus className="size-4" aria-hidden="true" />{text(lang, "أضف", "Add")}</button> : null}</article>; })}</div></section> : null}
      {filtered.length === 0 ? <section className="signal-empty"><EmptyState title={text(lang, "لا توجد أصناف مطابقة", "No matching items")} /></section> : (categoryId === "all" ? categories : categories.filter((c) => c.id === categoryId)).map((category) => { const items = filtered.filter((p) => p.categoryId === category.id); if (!items.length) return null; return <section key={category.id} id={`category-${category.id}`} className="signal-category" aria-labelledby={`category-${category.id}-title`}><div className="signal-section-heading"><div><p>{text(lang, "قسم", "Section")}</p><h2 id={`category-${category.id}-title`}>{text(lang, category.nameAr, category.nameEn)}</h2></div><span className="signal-heading-rule" /></div><ul>{items.map((p) => { const decision = getQuickAddDecision(p, menu.productOptions?.[p.id]); return <li key={p.id} className="signal-product-row"><div className="signal-product-card-wrap"><button type="button" disabled={!p.isAvailable && !preview} onClick={() => selectProduct(p)} className="signal-product-card"><MenuMedia src={p.imageUrl} alt="" className="signal-product-image" fallback={text(lang, "صورة الطبق", "Dish image")} /><span className="signal-product-copy"><span className="signal-product-name">{text(lang, p.nameAr, p.nameEn)}</span>{p.descriptionAr || p.descriptionEn ? <span className="signal-product-description">{text(lang, p.descriptionAr, p.descriptionEn)}</span> : null}<span className="signal-product-price-row"><MenuPrice price={p.price} currency={p.currency} lang={lang} className="signal-product-price" /></span><span className="signal-product-tags">{p.dietaryLabels.slice(0, 3).map((x) => <MenuBadge key={x} tone="muted">{x}</MenuBadge>)}{!p.isAvailable ? <MenuBadge tone="accent">{text(lang, "غير متوفر", "Unavailable")}</MenuBadge> : null}</span></span></button>{!preview && decision === "eligible" ? <button type="button" onClick={() => addSimpleProduct(p)} className="public-menu-quick-add signal-quick-add" aria-label={text(lang, "إضافة " + text(lang, p.nameAr, p.nameEn) + " للسلة", "Add " + text(lang, p.nameAr, p.nameEn) + " to cart")}><Plus className="size-4" aria-hidden="true" />{text(lang, "أضف للسلة", "Add to cart")}</button> : null}{!preview && decision === "requires-options" ? <button type="button" onClick={() => selectProduct(p)} className="public-menu-options-action signal-quick-add" aria-label={text(lang, "اختيار خيارات " + text(lang, p.nameAr, p.nameEn), "Choose options for " + text(lang, p.nameAr, p.nameEn))}>{text(lang, "اختر الخيارات", "Choose options")}</button> : null}</div></li>; })}</ul></section>; })}
      {hours.length ? <section className="signal-hours" aria-labelledby="signal-hours-title"><div className="signal-section-heading"><div><p>{text(lang, "المعلومات", "Information")}</p><h2 id="signal-hours-title">{text(lang, "ساعات العمل", "Opening hours")}</h2></div><span className="signal-heading-rule" /></div><div className="signal-hours-grid">{[0,1,2,3,4,5,6].map((day) => { const h = hours.find((x) => x.weekday === day); return <div key={day}><span>{weekdayLabel(day, lang)}</span><span>{!h || h.isClosed ? text(lang, "مغلق", "Closed") : `${h.opensAt} – ${h.closesAt}`}</span></div>; })}</div>{branch.addressAr || branch.addressEn ? <p className="signal-address"><MapPin className="size-4" aria-hidden />{text(lang, branch.addressAr, branch.addressEn)}</p> : null}</section> : null}
    </main>
    <footer className="signal-footer">
      <div className="signal-footer-inner">
        <p className="signal-footer-eyebrow">{text(lang, "من القلب إلى المائدة", "From the heart to the table")}</p>
        <h2 className="signal-footer-title">{text(lang, tenant.nameAr, tenant.nameEn)}</h2>
        <p className="signal-footer-copy">
          {text(
            lang,
            tenant.taglineAr || "تجربة طعام واضحة، جميلة، ومصممة للطلب بسهولة من الهاتف.",
            tenant.taglineEn || "A clear, beautiful dining experience designed for confident mobile ordering.",
          )}
        </p>
        <div className="signal-footer-grid">
          <div>
            <p className="signal-footer-label">{text(lang, "الفرع", "Branch")}</p>
            <p>{text(lang, branch.nameAr, branch.nameEn)}</p>
          </div>
          <div>
            <p className="signal-footer-label">{text(lang, "الموقع", "Location")}</p>
            <p>{text(lang, branch.addressAr, branch.addressEn) || tenant.city}</p>
          </div>
          <div>
            <p className="signal-footer-label">{text(lang, "الحالة", "Status")}</p>
            <p>{status === null ? text(lang, "ساعات العمل", "Opening hours") : status ? text(lang, "مفتوح الآن", "Open now") : text(lang, "مغلق حالياً", "Currently closed")}</p>
          </div>
        </div>
      </div>
    </footer>
    {!preview && cartCount ? <button type="button" onClick={() => setCartOpen(true)} aria-label={text(lang, `السلة ${cartCount} ${formatSar(cartTotal, lang)}`, `Cart ${cartCount} ${formatSar(cartTotal, lang)}`)} className="signal-cart-trigger"><ShoppingBag className="size-5" aria-hidden /><span>{text(lang, "الطلب", "Order")}</span><span className="signal-cart-count">{cartCount}</span><span>{formatSar(cartTotal, lang)}</span></button> : null}
    {selected ? <ProductDialog lang={lang} product={selected} options={menu.productOptions?.[selected.id]} close={() => setSelectedId(null)} add={addToCart} submitting={submitting} /> : null}
    {cartOpen ? <CartDialog lang={lang} items={cart} setItems={setCart} close={() => setCartOpen(false)} submit={submit} submitting={submitting} error={error} /> : null}
    {success ? <div className="fixed inset-0 z-[70] grid place-items-center bg-black/55 p-4" role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="signal-success-title" className="signal-success w-full max-w-sm bg-paper p-6 text-center shadow-2xl"><h2 id="signal-success-title" className="font-display text-xl font-semibold">{text(lang, "تم استلام طلبك", "Order received")}</h2><p className="mt-2 text-sm text-muted">{text(lang, "رقم الطلب", "Order number")} <strong className="text-ink">#{success.number}</strong></p><p className="mt-1 text-sm text-muted">{formatSar(success.total, lang)}</p><button type="button" onClick={() => setSuccess(null)} className="mt-5 h-11 w-full rounded-full bg-ink text-paper">{text(lang, "العودة للمنيو", "Back to menu")}</button></section></div> : null}
  </div>;
}
