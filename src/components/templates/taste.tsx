import { useEffect, useMemo, useState } from "react";
import { Clock3, MapPin, Minus, Plus, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { MenuBadge, MenuMedia, MenuPrice } from "@/components/menu";
import { PublicActionLinks } from "@/components/public-action-links";
import { useLang } from "@/lib/lang";
import { getGuestSessionId } from "@/lib/menu/session";
import { getQuickAddDecision, quickAddKey } from "@/lib/menu/quick-add";
import { recordPublicEvent } from "@/lib/menu/public";
import { submitPublicOrder } from "@/lib/menu/order-public";
import type { Lang, Product, ProductOptions, PublicMenu } from "@/lib/menu/types";
import { cn, formatSar, weekdayLabel } from "@/lib/utils";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar || en : en || ar;

type CartItem = { key: string; product: Product; options: ProductOptions; variantId: string; modifierOptionIds: string[]; note: string; unitPrice: number; quantity: number };

type Props = { menu: PublicMenu; preview?: boolean };

function ProductSheet({ lang, product, options, close, add, submitting }: { lang: Lang; product: Product; options?: ProductOptions; close: () => void; add: (item: CartItem) => void; submitting: boolean }) {
  const variants = options?.variants.filter((v) => v.isAvailable) ?? [];
  const groups = options?.groups.filter((g) => g.isActive) ?? [];
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [itemNote, setItemNote] = useState("");
  const [error, setError] = useState("");
  const basePrice = variants.find((v) => v.id === variantId)?.price ?? product.price;
  const optionTotal = (options?.options ?? []).filter((o) => selected.includes(o.id)).reduce((sum, o) => sum + o.priceDelta, 0);
  const total = basePrice + optionTotal;
  const toggle = (groupId: string, optionId: string, max: number) => setSelected((current) => {
    if (current.includes(optionId)) return current.filter((id) => id !== optionId);
    const count = current.filter((id) => (options?.options ?? []).some((o) => o.id === id && o.groupId === groupId)).length;
    return count >= max ? current : [...current, optionId];
  });
  const confirm = () => {
    for (const group of groups) {
      const count = selected.filter((id) => (options?.options ?? []).some((o) => o.id === id && o.groupId === group.id)).length;
      if (count < group.minSelect || count > group.maxSelect) {
        setError(text(lang, `أكمل اختيار «${group.nameAr}»`, `Complete “${group.nameEn || group.nameAr}”`));
        return;
      }
    }
    const note = itemNote.trim().slice(0, 500);
    add({ key: `${product.id}:${variantId}:${[...selected].sort().join(",")}:${note}`, product, options: options ?? { variants: [], groups: [], options: [] }, variantId, modifierOptionIds: [...selected].sort(), note, unitPrice: total, quantity: 1 });
    close();
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);
  return (
    <div className="taste-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section role="dialog" aria-modal="true" aria-labelledby="taste-product-title" className="taste-dialog">
        <header className="taste-dialog-header"><span>{text(lang, "تفاصيل الصنف", "Item details")}</span><button type="button" onClick={close} aria-label={text(lang, "إغلاق", "Close")}><X className="size-5" /></button></header>
        <div className="taste-dialog-body">
          <MenuMedia src={product.imageUrl} alt={text(lang, product.nameAr, product.nameEn)} className="taste-dialog-image" eager fallback={text(lang, "صورة الصنف", "Dish image")} />
          <div className="taste-dialog-title-row"><div><h2 id="taste-product-title">{text(lang, product.nameAr, product.nameEn)}</h2><p>{text(lang, product.descriptionAr, product.descriptionEn)}</p></div><MenuPrice price={total} currency={product.currency} lang={lang} className="taste-dialog-price" /></div>
          {product.dietaryLabels.length ? <div className="flex flex-wrap gap-2">{product.dietaryLabels.map((label) => <MenuBadge key={label} tone="muted">{label}</MenuBadge>)}</div> : null}
          {product.allergens ? <p className="taste-allergen"><strong>{text(lang, "مسببات الحساسية:", "Allergens:")}</strong> {product.allergens}</p> : null}
          {variants.length ? <fieldset className="taste-option-group"><legend>{text(lang, "الحجم", "Size")}</legend>{variants.map((variant) => <label key={variant.id} className={cn("taste-option", variantId === variant.id && "is-selected")}><span><input type="radio" name={`taste-size-${product.id}`} checked={variantId === variant.id} onChange={() => setVariantId(variant.id)} />{text(lang, variant.nameAr, variant.nameEn)}</span><MenuPrice price={variant.price} currency={product.currency} lang={lang} /></label>)}</fieldset> : null}
          {groups.map((group) => <fieldset key={group.id} className="taste-option-group"><legend>{text(lang, group.nameAr, group.nameEn)} {group.isRequired ? "*" : ""}</legend><p>{text(lang, `اختر ${group.minSelect} إلى ${group.maxSelect}`, `Choose ${group.minSelect} to ${group.maxSelect}`)}</p>{(options?.options ?? []).filter((option) => option.groupId === group.id && option.isAvailable).map((option) => <label key={option.id} className="taste-option"><span><input type={group.maxSelect === 1 ? "radio" : "checkbox"} name={`taste-modifier-${product.id}-${group.id}`} checked={selected.includes(option.id)} onChange={() => toggle(group.id, option.id, group.maxSelect)} />{text(lang, option.nameAr, option.nameEn)}</span><span>{option.priceDelta === 0 ? "—" : `${option.priceDelta > 0 ? "+" : ""}${formatSar(option.priceDelta, lang)}`}</span></label>)}</fieldset>)}
          <label className="taste-item-note"><span>{text(lang, "ملاحظة للصنف (اختياري)", "Item note (optional)")}</span><textarea value={itemNote} maxLength={500} onChange={(event) => setItemNote(event.target.value)} placeholder={text(lang, "مثال: بدون بصل، الصوص على الجانب...", "Example: no onions, sauce on the side...")} rows={3} /></label>
          {error ? <p className="taste-error" role="alert">{error}</p> : null}
          <button type="button" disabled={submitting} onClick={confirm} className="taste-primary-button">{text(lang, `أضف للطلب · ${formatSar(total, lang)}`, `Add to order · ${formatSar(total, lang)}`)}</button>
        </div>
      </section>
    </div>
  );
}

function CartSheet({ lang, items, setItems, close, submit, error, submitting }: { lang: Lang; items: CartItem[]; setItems: (items: CartItem[]) => void; close: () => void; submit: (customer: { name: string; phone: string; email: string; notes: string }) => void; error: string; submitting: boolean }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const change = (key: string, delta: number) => setItems(items.flatMap((item) => item.key !== key ? [item] : item.quantity + delta <= 0 ? [] : [{ ...item, quantity: Math.min(20, item.quantity + delta) }]));
  return (
    <div className="taste-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section role="dialog" aria-modal="true" aria-labelledby="taste-cart-title" className="taste-cart">
        <header className="taste-dialog-header"><div><h2 id="taste-cart-title">{text(lang, "سلة الطلب", "Your order")}</h2><small>{count} {text(lang, "صنف", "items")}</small></div><button type="button" onClick={close} aria-label={text(lang, "إغلاق", "Close")}><X className="size-5" /></button></header>
        <div className="taste-cart-body">{items.map((item) => <article key={item.key} className="taste-cart-item"><MenuMedia src={item.product.imageUrl} alt="" className="taste-cart-image" /><div className="min-w-0 flex-1"><h3>{text(lang, item.product.nameAr, item.product.nameEn)}</h3>{item.note ? <p className="text-xs leading-5 opacity-70">{text(lang, "ملاحظة:", "Note:")} {item.note}</p> : null}<MenuPrice price={item.unitPrice * item.quantity} currency={item.product.currency} lang={lang} className="text-sm" /></div><div className="taste-qty"><button type="button" onClick={() => change(item.key, -1)} aria-label={text(lang, "تقليل الكمية", "Decrease quantity")}><Minus className="size-3.5" /></button><span>{item.quantity}</span><button type="button" onClick={() => change(item.key, 1)} aria-label={text(lang, "زيادة الكمية", "Increase quantity")}><Plus className="size-3.5" /></button></div></article>)}
          {items.length ? <div className="taste-customer-fields"><input value={name} onChange={(event) => setName(event.target.value)} placeholder={text(lang, "الاسم *", "Name *")} /><input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" placeholder={text(lang, "رقم الجوال *", "Phone *")} /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder={text(lang, "البريد الإلكتروني (اختياري)", "Email (optional)")} /><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={text(lang, "ملاحظات على الطلب", "Order notes")} />{error ? <p className="taste-error" role="alert">{error}</p> : null}</div> : <div className="taste-empty-cart">{text(lang, "السلة فارغة", "Your cart is empty")}</div>}</div>
        {items.length ? <footer className="taste-cart-footer"><div><span>{text(lang, "الإجمالي", "Total")}</span><strong>{formatSar(total, lang)}</strong></div><button type="button" disabled={submitting || name.trim().length < 2 || phone.trim().length < 8} onClick={() => submit({ name, phone, email, notes })} className="taste-primary-button">{submitting ? text(lang, "جاري الإرسال…", "Submitting…") : text(lang, "تأكيد الطلب", "Submit order")}</button></footer> : null}
      </section>
    </div>
  );
}

export function TasteTemplate({ menu, preview = false }: Props) {
  const { lang } = useLang();
  const { tenant, branch, branches, hours, categories, products } = menu;
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [success, setSuccess] = useState<number | null>(null);
  const visible = preview ? products : products.filter((product) => product.isAvailable);
  const selected = visible.find((product) => product.id === selectedId);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visible.filter((product) => (categoryId === "all" || product.categoryId === categoryId) && (!q || [product.nameAr, product.nameEn, product.descriptionAr, product.descriptionEn, ...product.tags, ...product.dietaryLabels].some((value) => value.toLowerCase().includes(q))));
  }, [visible, query, categoryId]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const featured = visible.filter((product) => product.isFeatured).slice(0, 3);
  const englishAvailable = Boolean(tenant.nameEn || tenant.taglineEn || products.some((product) => product.nameEn));
  const groupedCategories = categories.filter((category) => category.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  useEffect(() => {
    if (!preview) void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: new URLSearchParams(window.location.search).get("src") === "qr" ? "qr_scan" : "visit", lang, sessionId: getGuestSessionId() } });
  }, [tenant.slug, branch.slug, lang, preview]);
  const openProduct = (product: Product) => {
    setSelectedId(product.id);
    if (!preview) void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, productId: product.id, eventType: "product_view", lang, sessionId: getGuestSessionId() } });
  };
  const add = (item: CartItem) => setCart((current) => {
    const existing = current.find((entry) => entry.key === item.key);
    return existing ? current.map((entry) => entry.key === item.key ? { ...entry, quantity: Math.min(20, entry.quantity + 1) } : entry) : [...current, item];
  });
  const addSimpleProduct = (product: Product) => {
    if (getQuickAddDecision(product, menu.productOptions?.[product.id]) !== "eligible") return;
    add({ key: quickAddKey(product.id), product, options: { variants: [], groups: [], options: [] }, variantId: "", modifierOptionIds: [], note: "", unitPrice: product.price, quantity: 1 });
  };
  const submit = async (customer: { name: string; phone: string; email: string; notes: string }) => {
    setSubmitting(true); setOrderError("");
    const result = await submitPublicOrder({ data: { slug: tenant.slug, branchSlug: branch.slug, source: new URLSearchParams(window.location.search).get("src") === "qr" ? "qr" : "web", customerName: customer.name, customerPhone: customer.phone, customerEmail: customer.email, notes: customer.notes, items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity, selected: { variantId: item.variantId || null, modifierOptionIds: item.modifierOptionIds, note: item.note || undefined } })) } });
    setSubmitting(false);
    if (!result.ok) { setOrderError(result.error); return; }
    setCart([]); setCartOpen(false); setSuccess(result.data.orderNumber);
  };
  const dayHours = [...hours].sort((a, b) => a.weekday - b.weekday);
  return (
    <div className="taste-page" dir={lang === "ar" ? "rtl" : "ltr"}>
      <nav className="taste-nav" aria-label={text(lang, "التنقل", "Navigation")}>
        <button type="button" className="taste-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={text(lang, "العودة إلى الأعلى", "Back to top")}><span className="taste-brand-icon"><ShoppingBag className="size-5" /></span><span>{text(lang, tenant.nameAr, tenant.nameEn)}</span></button>
        <div className="taste-nav-actions"><LangToggle disabled={!englishAvailable} /><button type="button" onClick={() => document.getElementById("taste-search")?.focus()} aria-label={text(lang, "بحث", "Search")}><Search className="size-5" /></button><button type="button" className="taste-nav-cart" onClick={() => setCartOpen(true)} aria-label={text(lang, "فتح السلة", "Open cart")}><ShoppingBag className="size-5" /><span>{cartCount}</span></button></div>
      </nav>

      <header className="taste-hero">
        <MenuMedia src={tenant.coverUrl} alt={text(lang, tenant.nameAr, tenant.nameEn)} className="taste-hero-image" eager fallback={text(lang, "صورة المطعم", "Restaurant cover")} />
        <div className="taste-hero-overlay" />
        <div className="taste-hero-content">
          <div className="taste-hero-copy"><span className="taste-eyebrow">{text(lang, "تجربة طعام عربية معاصرة", "Contemporary Arabic dining")}</span><h1>{text(lang, tenant.taglineAr || tenant.nameAr, tenant.taglineEn || tenant.nameEn)}</h1><p>{text(lang, tenant.taglineAr, tenant.taglineEn)}</p><button type="button" onClick={() => document.getElementById("taste-menu")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="taste-hero-button">{text(lang, "اطلب الآن", "Order now")}</button></div>
          <div className="taste-hero-meta">{branch.nameAr || branch.nameEn ? <span><MapPin className="size-4" />{text(lang, branch.nameAr, branch.nameEn)}</span> : null}</div>
        </div>
      </header>

      <section className="taste-category-rail" aria-label={text(lang, "تصنيفات المنيو", "Menu categories")}>
        <div className="taste-category-inner"><label className="taste-search"><Search className="size-5" /><input id="taste-search" value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder={text(lang, "ابحث عن صنف أو مكوّن...", "Search menu...")} aria-label={text(lang, "البحث في المنيو", "Search menu")} /></label><div className="taste-category-scroll"><button type="button" className={cn("taste-category", categoryId === "all" && "is-active")} aria-pressed={categoryId === "all"} onClick={() => setCategoryId("all")}>{text(lang, "الكل", "All")}</button>{groupedCategories.map((category) => <button type="button" key={category.id} className={cn("taste-category", categoryId === category.id && "is-active")} aria-pressed={categoryId === category.id} onClick={() => setCategoryId(category.id)}>{text(lang, category.nameAr, category.nameEn)}</button>)}</div></div>
      </section>

      <main id="taste-menu" className="taste-main">
        {featured.length ? <section className="taste-section taste-featured"><div className="taste-section-heading"><div><span>{text(lang, "اختياراتنا", "Our picks")}</span><h2>{text(lang, "أطباق تستحق التجربة", "Worth trying")}</h2></div></div><div className="taste-featured-grid">{featured.map((product) => <button type="button" key={product.id} className="taste-featured-card" onClick={() => openProduct(product)}><MenuMedia src={product.imageUrl} alt={text(lang, product.nameAr, product.nameEn)} className="taste-featured-image" fallback={text(lang, "صورة الطبق", "Dish image")} /><div><h3>{text(lang, product.nameAr, product.nameEn)}</h3><p>{text(lang, product.descriptionAr, product.descriptionEn)}</p><MenuPrice price={product.price} currency={product.currency} lang={lang} /></div></button>)}</div></section> : null}

        <section className="taste-section"><div className="taste-section-heading"><div><span>{text(lang, "قائمة الطعام", "Menu")}</span><h2>{text(lang, "اكتشف القائمة", "Explore the menu")}</h2></div><p>{filtered.length} {text(lang, "صنف", "items")}</p></div><div className="taste-product-list">{filtered.length ? filtered.map((product) => <article key={product.id} className="taste-product relative"><button type="button" className="taste-product-main" onClick={() => openProduct(product)}><MenuMedia src={product.imageUrl} alt={text(lang, product.nameAr, product.nameEn)} className="taste-product-image" fallback={text(lang, "صورة الطبق", "Dish image")} /><div className="taste-product-copy"><div className="taste-product-title"><h3>{text(lang, product.nameAr, product.nameEn)}</h3></div><p>{text(lang, product.descriptionAr, product.descriptionEn)}</p><div className="taste-product-price"><MenuPrice price={product.price} currency={product.currency} lang={lang} /></div>{product.dietaryLabels.length ? <div className="taste-product-tags">{product.dietaryLabels.map((label) => <MenuBadge key={label} tone="muted">{label}</MenuBadge>)}</div> : null}</div></button>{getQuickAddDecision(product, menu.productOptions?.[product.id]) === "eligible" ? <button type="button" onClick={(event) => { event.stopPropagation(); addSimpleProduct(product); }} aria-label={text(lang, `إضافة ${product.nameAr || product.nameEn} للسلة`, `Add ${product.nameEn || product.nameAr} to cart`)} title={text(lang, "إضافة للسلة", "Add to cart")} className="absolute left-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#344331] shadow-md ring-1 ring-black/5 backdrop-blur transition hover:scale-105 active:scale-95"><Plus className="size-5" /></button> : null}</article>) : <div className="taste-empty-state"><Search className="size-8" /><h3>{text(lang, "لم نجد ما تبحث عنه", "Nothing found")}</h3><p>{text(lang, "جرّب كلمة أخرى أو اختر تصنيفًا مختلفًا.", "Try another search or category.")}</p></div>}</div></section>

        {featured[0] ? <section className="taste-offer"><MenuMedia src={featured[0].imageUrl} alt="" className="taste-offer-image" /><div><span>{text(lang, "اختيار اليوم", "Today's pick")}</span><h2>{text(lang, "وليمة المشاركة", "Sharing feast")}</h2><p>{text(lang, featured[0].descriptionAr, featured[0].descriptionEn)}</p><button type="button" onClick={() => openProduct(featured[0])} className="taste-offer-button">{text(lang, "عرض الصنف", "View item")}</button></div></section> : null}

        <section className="taste-info-grid">
          <article><Clock3 className="taste-info-icon" /><span>{text(lang, "المعلومات", "Information")}</span><h2>{text(lang, "ساعات العمل", "Opening hours")}</h2><div className="taste-hours">{dayHours.map((hour) => <div key={hour.weekday}><strong>{weekdayLabel(hour.weekday, lang)}</strong><span>{hour.isClosed ? text(lang, "مغلق", "Closed") : `${hour.opensAt ?? "—"} – ${hour.closesAt ?? "—"}`}</span></div>)}</div></article>
          <article><MapPin className="taste-info-icon" /><span>{text(lang, "الموقع", "Location")}</span><h2>{text(lang, "فروعنا", "Our branches")}</h2><div className="taste-branches">{branches.filter((item) => item.isActive).map((item) => <div key={item.id}><strong>{text(lang, item.nameAr, item.nameEn)}</strong><p>{text(lang, item.addressAr, item.addressEn)}</p>{item.mapsUrl ? <a href={item.mapsUrl} target="_blank" rel="noopener noreferrer">{text(lang, "فتح الخريطة", "Open map")}</a> : null}</div>)}</div></article>
          <article><Sparkles className="taste-info-icon" /><span>{text(lang, "هوية", "Experience")}</span><h2>{text(lang, "تفاصيل المطعم", "Restaurant details")}</h2><p>{text(lang, tenant.taglineAr, tenant.taglineEn)}</p><div className="taste-action-links"><PublicActionLinks tenant={tenant} branch={branch} lang={lang} preview={preview} /></div></article>
        </section>
      </main>

      <section className="taste-actions-section"><PublicActionLinks tenant={tenant} branch={branch} lang={lang} preview={preview} /></section>
      <footer className="taste-footer"><div><strong>{text(lang, "تنبيه الحساسية", "Allergy notice")}</strong><p>{text(lang, "قد تحتوي أطباقنا على مسببات حساسية. يرجى سؤال فريق الخدمة عن المكونات قبل الطلب.", "Our dishes may contain allergens. Please ask the team about ingredients before ordering.")}</p></div></footer>

      {cartCount ? <div className="taste-floating-cart"><button type="button" onClick={() => setCartOpen(true)}><ShoppingBag className="size-5" /><span>{text(lang, "السلة", "Cart")} · {cartCount}</span><strong>{formatSar(cartTotal, lang)}</strong></button></div> : null}
      {selected ? <ProductSheet lang={lang} product={selected} options={menu.productOptions?.[selected.id]} close={() => setSelectedId(null)} add={add} submitting={submitting} /> : null}
      {cartOpen ? <CartSheet lang={lang} items={cart} setItems={setCart} close={() => setCartOpen(false)} submit={submit} error={orderError} submitting={submitting} /> : null}
      {success ? <div className="taste-dialog-backdrop" role="presentation"><section role="dialog" aria-modal="true" className="taste-success"><Sparkles className="size-8" /><h2>{text(lang, "تم استلام طلبك", "Order received")}</h2><p>{text(lang, `رقم الطلب #${success}`, `Order #${success}`)}</p><button type="button" className="taste-primary-button" onClick={() => setSuccess(null)}>{text(lang, "حسنًا", "Done")}</button></section></div> : null}
    </div>
  );
}
