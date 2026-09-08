import { useEffect, useMemo, useState } from "react";
import { BellRing, Clock3, Map, MapPin, Minus, Phone, Plus, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useLang } from "@/lib/lang";
import { recordPublicEvent } from "@/lib/menu/public";
import { submitPublicOrder } from "@/lib/menu/order-public";
import { getGuestSessionId } from "@/lib/menu/session";
import type { Lang, Product, ProductOptions, PublicMenu } from "@/lib/menu/types";
import { cn, formatSar, weekdayLabel } from "@/lib/utils";

const text = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar || en : en || ar;

type CartItem = {
  key: string;
  product: Product;
  options: ProductOptions;
  variantId: string;
  modifierOptionIds: string[];
  unitPrice: number;
  quantity: number;
};

type Props = { menu: PublicMenu; preview?: boolean };

function DishImage({ product, className }: { product: Product; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!product.imageUrl || failed) return <div className={cn("taste-image-fallback", className)} aria-hidden="true">Menu</div>;
  return <img src={product.imageUrl} alt="" loading="lazy" decoding="async" className={cn("taste-image", className)} onError={() => setFailed(true)} />;
}

function ProductDialog({ lang, product, options, close, add, submitting }: { lang: Lang; product: Product; options?: ProductOptions; close: () => void; add: (item: CartItem) => void; submitting: boolean }) {
  const variants = options?.variants.filter((v) => v.isAvailable) ?? [];
  const groups = options?.groups.filter((g) => g.isActive) ?? [];
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const total = (variants.find((v) => v.id === variantId)?.price ?? product.price) + (options?.options ?? []).filter((o) => selected.includes(o.id)).reduce((sum, o) => sum + o.priceDelta, 0);
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
    add({ key: `${product.id}:${variantId}:${[...selected].sort().join(",")}`, product, options: options ?? { variants: [], groups: [], options: [] }, variantId, modifierOptionIds: [...selected].sort(), unitPrice: total, quantity: 1 });
    close();
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);
  return <div className="taste-dialog-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}>
    <section className="taste-product-dialog" role="dialog" aria-modal="true" aria-labelledby="taste-product-title">
      <div className="taste-dialog-head"><strong>{text(lang, "تفاصيل الصنف", "Item details")}</strong><button type="button" onClick={close} aria-label={text(lang, "إغلاق", "Close")}><X /></button></div>
      <div className="taste-dialog-body"><DishImage product={product} className="taste-dialog-image" /><div className="taste-product-copy"><h2 id="taste-product-title">{text(lang, product.nameAr, product.nameEn)}</h2><strong className="taste-price"><bdi dir="ltr">{formatSar(total, lang)}</bdi></strong>{product.descriptionAr || product.descriptionEn ? <p>{text(lang, product.descriptionAr, product.descriptionEn)}</p> : null}</div>
        {product.dietaryLabels.length ? <div className="taste-tags">{product.dietaryLabels.map((x) => <span key={x}>{x}</span>)}</div> : null}
        {product.allergens ? <p className="taste-allergen-box"><strong>{text(lang, "مسببات الحساسية:", "Allergens:")}</strong> {product.allergens}</p> : null}
        {variants.length ? <fieldset className="taste-choice"><legend>{text(lang, "الحجم", "Size")}</legend>{variants.map((v) => <label key={v.id}><span><input type="radio" name={`taste-variant-${product.id}`} checked={variantId === v.id} onChange={() => setVariantId(v.id)} />{text(lang, v.nameAr, v.nameEn)}</span><bdi dir="ltr">{formatSar(v.price, lang)}</bdi></label>)}</fieldset> : null}
        {groups.map((group) => <fieldset key={group.id} className="taste-choice"><legend>{text(lang, group.nameAr, group.nameEn)} {group.isRequired ? "*" : ""}</legend><small>{text(lang, `اختر ${group.minSelect} إلى ${group.maxSelect}`, `Choose ${group.minSelect} to ${group.maxSelect}`)}</small>{(options?.options ?? []).filter((o) => o.groupId === group.id && o.isAvailable).map((option) => <label key={option.id}><span><input type={group.maxSelect === 1 ? "radio" : "checkbox"} name={`taste-option-${product.id}-${group.id}`} checked={selected.includes(option.id)} onChange={() => toggle(group.id, option.id, group.maxSelect)} />{text(lang, option.nameAr, option.nameEn)}</span><bdi dir="ltr">{option.priceDelta === 0 ? "—" : `${option.priceDelta > 0 ? "+" : ""}${formatSar(option.priceDelta, lang)}`}</bdi></label>)}</fieldset>)}
        {error ? <p className="taste-error" role="alert">{error}</p> : null}
        <button type="button" disabled={submitting} onClick={confirm} className="taste-dialog-submit">{text(lang, `أضف للطلب · ${formatSar(total, lang)}`, `Add to order · ${formatSar(total, lang)}`)}</button>
      </div>
    </section>
  </div>;
}

function CartDialog({ lang, items, setItems, close, submit, submitting, error }: { lang: Lang; items: CartItem[]; setItems: (items: CartItem[]) => void; close: () => void; submit: (customer: { name: string; phone: string; email: string; notes: string }) => void; submitting: boolean; error: string }) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [email, setEmail] = useState(""); const [notes, setNotes] = useState("");
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0); const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const changeQty = (key: string, delta: number) => setItems(items.flatMap((item) => item.key !== key ? [item] : item.quantity + delta <= 0 ? [] : [{ ...item, quantity: Math.min(20, item.quantity + delta) }]));
  return <div className="taste-dialog-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}>
    <section className="taste-cart-dialog" role="dialog" aria-modal="true" aria-labelledby="taste-cart-title">
      <div className="taste-dialog-head"><div><h2 id="taste-cart-title">{text(lang, "طلبك", "Your order")}</h2><small>{count} {text(lang, "صنف", "items")}</small></div><button type="button" onClick={close} aria-label={text(lang, "إغلاق", "Close")}><X /></button></div>
      <div className="taste-cart-items">{items.map((item) => <article key={item.key}><DishImage product={item.product} className="taste-cart-image" /><div><strong>{text(lang, item.product.nameAr, item.product.nameEn)}</strong><span className="taste-price"><bdi dir="ltr">{formatSar(item.unitPrice * item.quantity, lang)}</bdi></span></div><div className="taste-qty"><button type="button" onClick={() => changeQty(item.key, -1)} aria-label={text(lang, "تقليل الكمية", "Decrease quantity")}><Minus /></button><span>{item.quantity}</span><button type="button" onClick={() => changeQty(item.key, 1)} aria-label={text(lang, "زيادة الكمية", "Increase quantity")}><Plus /></button></div></article>)}
        {!items.length ? <div className="taste-empty-cart">{text(lang, "السلة فارغة", "Your cart is empty")}</div> : null}
        {items.length ? <div className="taste-cart-form"><input value={name} onChange={(e) => setName(e.target.value)} placeholder={text(lang, "الاسم *", "Name *")} /><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder={text(lang, "رقم الجوال *", "Phone *")} /><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={text(lang, "البريد الإلكتروني (اختياري)", "Email (optional)")} /><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={text(lang, "ملاحظات", "Notes")} />{error ? <p className="taste-error" role="alert">{error}</p> : null}</div> : null}
      </div>
      {items.length ? <footer className="taste-cart-footer"><div><span>{text(lang, "الإجمالي", "Total")}</span><strong className="taste-price"><bdi dir="ltr">{formatSar(total, lang)}</bdi></strong></div><button type="button" disabled={submitting || name.trim().length < 2 || phone.trim().length < 8} onClick={() => submit({ name, phone, email, notes })}>{submitting ? text(lang, "جاري الإرسال…", "Submitting…") : text(lang, "تأكيد الطلب", "Submit order")}</button></footer> : null}
    </section>
  </div>;
}

export function ContemporaryRestaurantTemplate({ menu, preview = false }: Props) {
  const { lang, setLang } = useLang();
  const { tenant, branch, branches, hours, categories, products, productOptions = {} } = menu;
  const [query, setQuery] = useState(""); const [categoryId, setCategoryId] = useState("all"); const [selectedId, setSelectedId] = useState<string | null>(null); const [cart, setCart] = useState<CartItem[]>([]); const [cartOpen, setCartOpen] = useState(false); const [submitting, setSubmitting] = useState(false); const [orderError, setOrderError] = useState(""); const [success, setSuccess] = useState<number | null>(null);
  const visible = preview ? products : products.filter((p) => p.isAvailable);
  const featured = visible.filter((p) => p.isFeatured).slice(0, 1);
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return visible.filter((p) => (categoryId === "all" || p.categoryId === categoryId) && (!q || [p.nameAr, p.nameEn, p.descriptionAr, p.descriptionEn, ...p.tags, ...p.dietaryLabels].some((x) => x.toLowerCase().includes(q)))); }, [visible, query, categoryId]);
  const selected = visible.find((p) => p.id === selectedId);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const addToCart = (item: CartItem) => setCart((current) => { const found = current.find((x) => x.key === item.key); return found ? current.map((x) => x.key === item.key ? { ...x, quantity: Math.min(20, x.quantity + item.quantity) } : x) : [...current, item]; });
  const submit = async (customer: { name: string; phone: string; email: string; notes: string }) => {
    setSubmitting(true); setOrderError("");
    const result = await submitPublicOrder({ data: { slug: tenant.slug, branchSlug: branch.slug, source: new URLSearchParams(window.location.search).get("src") === "qr" ? "qr" : "web", customerName: customer.name, customerPhone: customer.phone, customerEmail: customer.email, notes: customer.notes, items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity, selected: { variantId: item.variantId || null, modifierOptionIds: item.modifierOptionIds } })) } });
    setSubmitting(false);
    if (!result.ok) { setOrderError(result.error); return; }
    setCart([]); setCartOpen(false); setSuccess(result.data.orderNumber);
  };
  useEffect(() => { if (!preview) void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: new URLSearchParams(window.location.search).get("src") === "qr" ? "qr_scan" : "visit", lang, sessionId: getGuestSessionId() } }); }, [branch.slug, lang, preview, tenant.slug]);
  const wa = tenant.whatsapp ? `https://wa.me/${tenant.whatsapp.replace(/\D/g, "")}` : "";
  const featuredProduct = featured[0];
  const today = hours.find((h) => h.weekday === new Date().getDay());
  const hoursText = today?.isClosed ? text(lang, "مغلق اليوم", "Closed today") : today?.opensAt && today?.closesAt ? `${today.opensAt} — ${today.closesAt}` : text(lang, "حسب أوقات الفرع", "See branch hours");
  const allergyText = text(lang, "قد تحتوي أطباقنا على مسببات حساسية. يرجى سؤال فريق الخدمة عن المكونات قبل الطلب.", "Our dishes may contain allergens. Please ask our service team about ingredients before ordering.");

  return <div className="taste-menu-shell" data-menu-theme="heritage">
    <nav className="taste-nav">
      <button type="button" className="taste-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={text(lang, "العودة إلى الأعلى", "Back to top")}><span className="taste-brand-icon">{tenant.logoUrl ? <img src={tenant.logoUrl} alt="" /> : "م"}</span><span>{text(lang, tenant.nameAr, tenant.nameEn)}</span></button>
      <div className="taste-nav-actions"><button type="button" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="taste-lang">{lang === "ar" ? "English" : "العربية"}</button><button type="button" onClick={() => document.getElementById("taste-search")?.focus()} className="taste-icon-button" aria-label={text(lang, "بحث", "Search")}><Search /></button><button type="button" onClick={() => setCartOpen(true)} className="taste-cart-button" aria-label={text(lang, "فتح السلة", "Open cart")}><ShoppingBag /><span>{cartCount}</span></button></div>
    </nav>

    <section className="taste-hero">
      <img src={tenant.coverUrl} alt="" className="taste-hero-image" />
      <div className="taste-hero-overlay" />
      <div className="taste-hero-content">
        <p>{text(lang, "تجربة طعام عربية معاصرة", "A contemporary Arabic dining experience")}</p>
        <h1>{text(lang, tenant.taglineAr || "نكهة تستحق التجربة", tenant.taglineEn || "A taste worth discovering")}</h1>
        <span>{text(lang, "أطباق أصيلة تُقدّم بلمسة أنيقة، من المطبخ إلى طاولتك.", "Authentic dishes presented with an elegant touch, from our kitchen to your table.")}</span>
        <button type="button" onClick={() => document.getElementById("taste-menu")?.scrollIntoView({ behavior: "smooth" })}>{text(lang, "اطلب الآن", "Order now")}</button>
      </div>
    </section>

    <div className="taste-category-rail"><div>{<button type="button" className={categoryId === "all" ? "active" : ""} onClick={() => setCategoryId("all")}>{text(lang, "الكل", "All")}</button>}{categories.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder).map((c) => <button type="button" key={c.id} className={categoryId === c.id ? "active" : ""} onClick={() => setCategoryId(c.id)}>{text(lang, c.nameAr, c.nameEn)}</button>)}</div></div>

    <main id="taste-menu" className="taste-main">
      <div className="taste-search-row"><label htmlFor="taste-search"><Search /><span className="sr-only">{text(lang, "البحث في المنيو", "Search menu")}</span><input id="taste-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={text(lang, "ابحث عن صنف أو مكوّن...", "Search for a dish or ingredient...")} /></label></div>

      {featuredProduct && categoryId === "all" && !query ? <section className="taste-featured"><div className="taste-section-heading"><span>{text(lang, "الأكثر تميزاً", "Featured")}</span><h2>{text(lang, "اختيارنا اليوم", "Today's selection")}</h2></div><button type="button" onClick={() => setSelectedId(featuredProduct.id)} className="taste-featured-card"><DishImage product={featuredProduct} className="taste-featured-image" /><div><h3>{text(lang, featuredProduct.nameAr, featuredProduct.nameEn)}</h3><p>{text(lang, featuredProduct.descriptionAr, featuredProduct.descriptionEn)}</p><strong className="taste-price"><bdi dir="ltr">{formatSar(featuredProduct.price, lang)}</bdi></strong></div></button></section> : null}

      <section className="taste-menu-section"><div className="taste-section-heading"><span>{text(lang, "قائمة الطعام", "Menu")}</span><h2>{categoryId === "all" ? text(lang, "أطباقنا", "Our dishes") : text(lang, categories.find((c) => c.id === categoryId)?.nameAr ?? "أطباقنا", categories.find((c) => c.id === categoryId)?.nameEn ?? "Our dishes")}</h2></div><div className="taste-menu-grid" aria-live="polite">{filtered.map((product) => <article key={product.id} className="taste-product-card"><button type="button" onClick={() => setSelectedId(product.id)} className="taste-product-hit"><DishImage product={product} className="taste-product-image" /><div className="taste-product-info"><h3>{text(lang, product.nameAr, product.nameEn)}</h3>{product.descriptionAr || product.descriptionEn ? <p>{text(lang, product.descriptionAr, product.descriptionEn)}</p> : null}<div className="taste-product-bottom"><strong className="taste-price"><bdi dir="ltr">{formatSar(product.price, lang)}</bdi></strong><span>{product.isAvailable ? text(lang, "متاح", "Available") : text(lang, "غير متاح", "Unavailable")}</span></div></div></button></article>)}</div>{!filtered.length ? <div className="taste-empty">{text(lang, "لا توجد أصناف مطابقة.", "No matching dishes.")}</div> : null}</section>

      <section className="taste-offer"><div className="taste-offer-grid">{featuredProduct ? <DishImage product={featuredProduct} className="taste-offer-image" /> : <div className="taste-offer-image taste-image-fallback">Menu</div>}<div><p>{text(lang, "عروض اليوم", "Today's offer")}</p><h2>{text(lang, "وليمة المشاركة", "Sharing feast")}</h2><span>{text(lang, "تشكيلة مختارة من المقبلات والمشاوي والحلويات، مثالية لجلسة تجمعكم.", "A curated selection of starters, grills and desserts, made for sharing.")}</span><button type="button" onClick={() => featuredProduct && setSelectedId(featuredProduct.id)}>{text(lang, "اطلب الآن", "Order now")}</button></div></div></section>

      <section className="taste-info-grid"><article><Clock3 /><h2>{text(lang, "ساعات العمل", "Opening hours")}</h2><p>{hoursText}</p><small>{today ? weekdayLabel(today.weekday, lang) : text(lang, "الفرع الحالي", "Current branch")}</small></article><article><MapPin /><h2>{text(lang, "فروعنا", "Our branches")}</h2><p>{branches.length > 1 ? branches.map((b) => text(lang, b.nameAr, b.nameEn)).join(" · ") : text(lang, branch.addressAr, branch.addressEn)}</p><small>{text(lang, tenant.city, tenant.city)}</small></article><article><Sparkles /><h2>{text(lang, "تجربة قابلة للتطوير", "A growing experience")}</h2><p>{text(lang, "الصور والأسعار والتوفر والفروع والطلبات والـQR مرتبطة مباشرة بمنصة منيو.", "Images, pricing, availability, branches, orders and QR are connected directly to Menu V3.")}</p></article></section>
    </main>

    <section className="taste-actions"><div>{branch.phone ? <a href={`tel:${branch.phone}`}><Phone />{text(lang, "اتصل بنا", "Call")}</a> : null}{wa ? <a href={wa} target="_blank" rel="noreferrer"><span className="taste-wa">◔</span>{text(lang, "واتساب", "WhatsApp")}</a> : null}{branch.mapsUrl ? <a href={branch.mapsUrl} target="_blank" rel="noreferrer"><Map />{text(lang, "الموقع", "Location")}</a> : null}</div></section>
    <footer className="taste-allergy"><strong>{text(lang, "تنبيه الحساسية", "Allergy notice")}</strong><p>{allergyText}</p></footer>
    {success ? <div className="taste-success" role="status">{text(lang, `تم استلام طلبك #${success}`, `Order #${success} received`)}</div> : null}
    {selected ? <ProductDialog lang={lang} product={selected} options={productOptions[selected.id]} close={() => setSelectedId(null)} add={addToCart} submitting={submitting} /> : null}
    {cartOpen ? <CartDialog lang={lang} items={cart} setItems={setCart} close={() => setCartOpen(false)} submit={submit} submitting={submitting} error={orderError} /> : null}
  </div>;
}
