import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Clock, Instagram, MapPin, Minus, Phone, Plus, Search, ShoppingBag, X } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { EmptyState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { recordPublicEvent } from "@/lib/menu/public";
import { submitPublicOrder } from "@/lib/menu/order-public";
import { getGuestSessionId } from "@/lib/menu/session";
import type { Lang, Product, ProductOptions, PublicMenu } from "@/lib/menu/types";
import { cn, formatSar, weekdayLabel } from "@/lib/utils";

const label = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar : en;
const value = (lang: Lang, ar: string, en: string) => lang === "ar" ? ar || en : en || ar;

type CartItem = {
  key: string;
  product: Product;
  options: ProductOptions;
  variantId: string;
  modifierOptionIds: string[];
  unitPrice: number;
  quantity: number;
};

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.5 2 2 6.49 2 12.05c0 1.77.46 3.45 1.28 4.92L2 22l5.16-1.35a9.96 9.96 0 0 0 4.88 1.24h.01c5.54 0 10.04-4.49 10.04-10.04 0-2.68-1.04-5.2-2.94-7.09Zm-7.01 15.4h-.01a8.28 8.28 0 0 1-4.22-1.16l-.3-.18-3.06.8.82-2.98-.2-.31a8.26 8.26 0 0 1-1.27-4.42c0-4.57 3.72-8.29 8.3-8.29 2.22 0 4.3.86 5.86 2.43a8.24 8.24 0 0 1 2.43 5.87c0 4.58-3.73 8.3-8.35 8.3Zm4.56-6.21c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.16 1.73 2.64 4.2 3.7.59.25 1.04.41 1.4.52.59.18 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" /></svg>;
}

function DishMedia({ product, className = "" }: { product: Product; className?: string }) {
  if (product.imageUrl) return <img src={product.imageUrl} alt="" loading="lazy" decoding="async" fetchPriority="low" className={cn("object-cover", className)} />;
  return <div className={cn("grid place-items-center bg-sand text-xs text-muted", className)} aria-hidden="true">Menu</div>;
}

function useModalAccessibility(open: boolean, close: () => void, dialogRef: React.RefObject<HTMLElement | null>, initialFocusRef?: React.RefObject<HTMLElement | null>) {
  const restoreRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => (initialFocusRef?.current ?? dialogRef.current)?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex='-1'])")).filter((el) => el.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      restoreRef.current?.focus();
    };
  }, [open, close, dialogRef, initialFocusRef]);
}

function ProductSheet({ lang, product, options, close, addToCart, ordering }: { lang: Lang; product: Product; options?: ProductOptions; close: () => void; addToCart: (item: CartItem) => void; ordering: boolean }) {
  const [variantId, setVariantId] = useState(options?.variants[0]?.id ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `product-details-title-${product.id}`;
  useModalAccessibility(true, close, dialogRef, closeRef);
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
  const add = () => {
    for (const group of groups) {
      const count = selected.filter((id) => (options?.options ?? []).some((o) => o.id === id && o.groupId === group.id)).length;
      if (count < group.minSelect || count > group.maxSelect) {
        setError(label(lang, `أكمل اختيار «${group.nameAr}»`, `Complete “${group.nameEn || group.nameAr}”`));
        return;
      }
    }
    addToCart({ key: `${product.id}:${variantId}:${[...selected].sort().join(",")}`, product, options: options ?? { variants: [], groups: [], options: [] }, variantId, modifierOptionIds: [...selected].sort(), unitPrice: total, quantity: 1 });
    close();
  };
  return <div className="fixed inset-0 z-50 grid items-end bg-black/45 sm:items-center sm:p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
    <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-paper shadow-2xl sm:mx-auto sm:max-w-lg sm:rounded-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/95 px-4 py-3 backdrop-blur"><h2 id={titleId} className="text-sm font-medium">{label(lang, "تفاصيل الصنف", "Item details")}</h2><button ref={closeRef} type="button" onClick={close} aria-label={label(lang, "إغلاق", "Close")} className="grid size-10 place-items-center rounded-full hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"><X className="size-5" aria-hidden="true" /></button></div>
      <div className="grid gap-5 p-4"><DishMedia product={product} className="h-56 w-full rounded-xl" /><div className="grid gap-2"><p className="text-2xl font-semibold" aria-label={value(lang, product.nameAr, product.nameEn)}>{value(lang, product.nameAr, product.nameEn)}</p><p className="text-lg font-medium text-accent"><bdi dir="ltr" className="tabular bidi-isolate">{formatSar(total, lang)}</bdi></p>{product.descriptionAr || product.descriptionEn ? <p className="text-sm leading-6 text-ink-soft">{value(lang, product.descriptionAr, product.descriptionEn)}</p> : null}</div>
        {product.tags.length ? <div className="flex flex-wrap gap-2">{product.tags.map((x) => <span key={x} dir="auto" className="rounded-full border border-line px-3 py-1 text-xs text-muted">#{x}</span>)}</div> : null}
        {product.dietaryLabels.length ? <div className="flex flex-wrap gap-2">{product.dietaryLabels.map((x) => <span key={x} dir="auto" className="rounded-full bg-sand px-3 py-1 text-xs">{x}</span>)}</div> : null}
        {product.allergens ? <p className="rounded-xl bg-sand p-3 text-xs leading-5" dir="auto"><strong>{label(lang, "مسببات الحساسية:", "Allergens:")}</strong> {product.allergens}</p> : null}
        {product.calories != null ? <p className="text-xs text-muted"><bdi dir="ltr" className="tabular bidi-isolate">{product.calories}</bdi> {label(lang, "سعرة حرارية", "calories")}</p> : null}
        {variants.length ? <fieldset className="grid gap-2 border-t border-line pt-4"><legend className="text-sm font-medium">{label(lang, "الحجم", "Size")}</legend>{variants.map((v) => <label key={v.id} className={cn("flex min-h-12 cursor-pointer items-center justify-between rounded-xl border p-3", variantId === v.id ? "border-ink bg-sand" : "border-line")}><span className="flex items-center gap-2"><input type="radio" name={`product-variant-${product.id}`} checked={variantId === v.id} onChange={() => setVariantId(v.id)} />{value(lang, v.nameAr, v.nameEn)}</span><bdi dir="ltr" className="text-sm text-accent tabular bidi-isolate">{formatSar(v.price, lang)}</bdi></label>)}</fieldset> : null}
        {groups.map((g) => { const items = (options?.options ?? []).filter((o) => o.groupId === g.id && o.isAvailable); const groupTitleId = `modifier-group-${g.id}`; return <fieldset key={g.id} aria-labelledby={groupTitleId} className="grid gap-2 border-t border-line pt-4"><div><legend id={groupTitleId} className="text-sm font-medium">{value(lang, g.nameAr, g.nameEn)} {g.isRequired ? <span className="text-bad" aria-hidden="true">*</span> : null}</legend><p className="text-xs text-muted">{label(lang, `اختر من ${g.minSelect} إلى ${g.maxSelect}`, `Choose ${g.minSelect} to ${g.maxSelect}`)}</p></div>{items.map((o) => <label key={o.id} className="flex min-h-12 cursor-pointer items-center justify-between rounded-xl border border-line p-3"><span className="flex items-center gap-2"><input type={g.maxSelect === 1 ? "radio" : "checkbox"} name={`modifier-${product.id}-${g.id}`} checked={selected.includes(o.id)} onChange={() => toggle(g.id, o.id, g.maxSelect)} />{value(lang, o.nameAr, o.nameEn)}</span><bdi dir="ltr" className="text-sm text-accent tabular bidi-isolate">{o.priceDelta === 0 ? "—" : `${o.priceDelta > 0 ? "+" : ""}${formatSar(o.priceDelta, lang)}`}</bdi></label>)}</fieldset>; })}
        {error ? <p role="alert" aria-live="assertive" className="rounded-xl bg-bad/10 p-3 text-sm text-bad">{error}</p> : null}
        <button type="button" onClick={add} disabled={ordering} className="h-12 rounded-xl bg-ink px-4 font-medium text-paper disabled:opacity-50">{label(lang, `أضف للطلب · ${formatSar(total, lang)}`, `Add to order · ${formatSar(total, lang)}`)}</button>
      </div>
    </section>
  </div>;
}

function CartDrawer({ lang, items, setItems, close, submit, submitting, error }: { lang: Lang; items: CartItem[]; setItems: (items: CartItem[]) => void; close: () => void; submit: (customer: { name: string; phone: string; email: string; notes: string }) => void; submitting: boolean; error: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModalAccessibility(true, close, dialogRef, closeRef);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const changeQty = (key: string, delta: number) => setItems(items.flatMap((item) => item.key !== key ? [item] : item.quantity + delta <= 0 ? [] : [{ ...item, quantity: Math.min(20, item.quantity + delta) }]));
  return <div className="fixed inset-0 z-[60] bg-black/45" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
    <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="cart-title" className="ms-auto flex h-full w-full max-w-lg flex-col bg-paper shadow-2xl">
      <div className="flex items-center justify-between border-b border-line px-4 py-4"><div><h2 id="cart-title" className="text-lg font-semibold">{label(lang, "طلبك", "Your order")}</h2><p className="text-xs text-muted" aria-live="polite">{count} {label(lang, "صنف", "items")}</p></div><button ref={closeRef} type="button" onClick={close} aria-label={label(lang, "إغلاق", "Close")} className="grid size-10 place-items-center rounded-full hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"><X className="size-5" aria-hidden="true" /></button></div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {items.length === 0 ? <EmptyState title={label(lang, "السلة فارغة", "Your cart is empty")} /> : items.map((item) => {
          const variant = item.options.variants.find((v) => v.id === item.variantId);
          const modifiers = item.options.options.filter((o) => item.modifierOptionIds.includes(o.id));
          return <div key={item.key} className="rounded-xl border border-line p-3"><div className="flex gap-3"><DishMedia product={item.product} className="size-16 shrink-0 rounded-lg" /><div className="min-w-0 flex-1"><p className="font-medium" dir="auto">{value(lang, item.product.nameAr, item.product.nameEn)}</p>{variant ? <p className="text-xs text-muted" dir="auto">{value(lang, variant.nameAr, variant.nameEn)}</p> : null}{modifiers.length ? <p className="text-xs text-muted" dir="auto">{modifiers.map((o) => value(lang, o.nameAr, o.nameEn)).join(" · ")}</p> : null}<p className="mt-1 text-sm font-medium text-accent"><bdi dir="ltr" className="tabular bidi-isolate">{formatSar(item.unitPrice * item.quantity, lang)}</bdi></p></div></div><div className="mt-3 flex items-center justify-end gap-2"><button type="button" onClick={() => changeQty(item.key, -1)} className="grid size-10 place-items-center rounded-lg border border-line" aria-label={label(lang, "تقليل الكمية", "Decrease quantity")}><Minus className="size-4" aria-hidden="true" /></button><span className="min-w-7 text-center tabular" aria-label={`${item.quantity} ${label(lang, "من الكمية", "quantity")}`}>{item.quantity}</span><button type="button" onClick={() => changeQty(item.key, 1)} className="grid size-10 place-items-center rounded-lg border border-line" aria-label={label(lang, "زيادة الكمية", "Increase quantity")}><Plus className="size-4" aria-hidden="true" /></button></div></div>;
        })}
        {items.length ? <fieldset className="grid gap-3 border-t border-line pt-4"><legend className="text-sm font-semibold">{label(lang, "بيانات العميل", "Customer details")}</legend><div className="grid gap-1"><label htmlFor="order-name" className="text-sm">{label(lang, "الاسم", "Name")} <span aria-hidden="true">*</span></label><input id="order-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder={label(lang, "الاسم", "Name")} className="h-11 rounded-xl border border-line bg-paper px-3 text-sm" /></div><div className="grid gap-1"><label htmlFor="order-phone" className="text-sm">{label(lang, "رقم الجوال", "Phone")} <span aria-hidden="true">*</span></label><input id="order-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" type="tel" autoComplete="tel" dir="ltr" placeholder={label(lang, "رقم الجوال", "Phone")} className="h-11 rounded-xl border border-line bg-paper px-3 text-sm" /></div><div className="grid gap-1"><label htmlFor="order-email" className="text-sm">{label(lang, "البريد الإلكتروني (اختياري)", "Email (optional)")}</label><input id="order-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" dir="ltr" placeholder={label(lang, "البريد الإلكتروني", "Email")} className="h-11 rounded-xl border border-line bg-paper px-3 text-sm" /></div><div className="grid gap-1"><label htmlFor="order-notes" className="text-sm">{label(lang, "ملاحظات على الطلب", "Order notes")}</label><textarea id="order-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={label(lang, "ملاحظات على الطلب", "Order notes")} className="min-h-24 rounded-xl border border-line p-3 text-sm" dir="auto" /></div>{error ? <p role="alert" aria-live="assertive" className="rounded-xl bg-bad/10 p-3 text-sm text-bad">{error}</p> : null}</fieldset> : null}
      </div>
      {items.length ? <div className="border-t border-line bg-paper p-4"><div className="mb-3 flex items-center justify-between"><span className="text-sm text-muted">{label(lang, "الإجمالي", "Total")}</span><strong className="text-lg text-accent"><bdi dir="ltr" className="tabular bidi-isolate">{formatSar(total, lang)}</bdi></strong></div><button type="button" disabled={submitting || name.trim().length < 2 || phone.trim().length < 8} onClick={() => submit({ name, phone, email, notes })} className="h-12 w-full rounded-xl bg-ink font-medium text-paper disabled:opacity-50">{submitting ? label(lang, "جاري إرسال الطلب…", "Submitting…") : label(lang, "تأكيد إرسال الطلب", "Submit order")}</button></div> : null}
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [successOrder, setSuccessOrder] = useState<{ number: number; total: number; currency: string } | null>(null);
  const visible = preview ? products : products.filter((p) => p.isAvailable);
  const selected = visible.find((p) => p.id === selectedId);
  const featured = visible.filter((p) => p.isFeatured);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visible.filter((p) => (categoryId === "all" || p.categoryId === categoryId) && (!q || [p.nameAr, p.nameEn, p.descriptionAr, p.descriptionEn, ...p.tags, ...p.dietaryLabels].some((x) => x.toLowerCase().includes(q))));
  }, [visible, query, categoryId]);
  const status = openNow(hours);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  useEffect(() => {
    if (preview) return;
    void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: new URLSearchParams(window.location.search).get("src") === "qr" ? "qr_scan" : "visit", lang, sessionId: getGuestSessionId() } });
  }, [tenant.slug, branch.slug, lang, preview]);
  const trackProduct = (p: Product) => { setSelectedId(p.id); if (!preview) void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, productId: p.id, eventType: "product_view", lang, sessionId: getGuestSessionId() } }); };
  const addToCart = (item: CartItem) => setCart((current) => { const existing = current.find((x) => x.key === item.key); return existing ? current.map((x) => x.key === item.key ? { ...x, quantity: Math.min(20, x.quantity + 1) } : x) : [...current, item]; });
  const submit = async (customer: { name: string; phone: string; email: string; notes: string }) => {
    setSubmitting(true); setOrderError("");
    const result = await submitPublicOrder({ data: { slug: tenant.slug, branchSlug: branch.slug, source: new URLSearchParams(window.location.search).get("src") === "qr" ? "qr" : "web", customerName: customer.name, customerPhone: customer.phone, customerEmail: customer.email, notes: customer.notes, items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity, selected: { variantId: item.variantId || null, modifierOptionIds: item.modifierOptionIds } })) } });
    setSubmitting(false);
    if (!result.ok) { setOrderError(result.error); return; }
    setCart([]); setCartOpen(false); setSuccessOrder({ number: result.data.orderNumber, total: result.data.total, currency: result.data.currency });
  };
  const wa = tenant.whatsapp ? `https://wa.me/${tenant.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(tenant.whatsappTemplate.replace("{restaurant}", value(lang, tenant.nameAr, tenant.nameEn)))}` : null;

  return <div className="menu-public-shell min-h-dvh bg-paper text-ink" style={{ "--menu-accent": tenant.accentColor, "--menu-ink": tenant.primaryColor } as CSSProperties}>
    {preview ? <div className="bg-ink px-4 py-2 text-center text-xs text-paper" role="status">{label(lang, "معاينة المالك — هذه ليست النسخة المنشورة", "Owner preview — this is not the published version")}</div> : null}
    <header className="relative overflow-hidden bg-ink text-paper"><div className="absolute inset-0 opacity-45" style={{ background: tenant.coverUrl ? `center/cover url(${tenant.coverUrl})` : `radial-gradient(100% 80% at 85% 0%, ${tenant.accentColor} 0%, transparent 55%)` }} aria-hidden="true" /><div className="relative mx-auto grid max-w-2xl gap-5 px-5 pb-9 pt-6">
      <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3">{tenant.logoUrl ? <img src={tenant.logoUrl} alt="" decoding="async" className="size-12 rounded-xl object-cover" /> : <div className="grid size-12 place-items-center rounded-xl bg-[var(--menu-accent)] font-semibold" aria-hidden="true">{tenant.nameAr.slice(0, 1)}</div>}<div><p className="text-xs text-paper/70">{tenant.city}</p><h1 className="font-display text-2xl font-semibold" dir="auto">{value(lang, tenant.nameAr, tenant.nameEn)}</h1></div></div><LangToggle /></div>
      {tenant.taglineAr || tenant.taglineEn ? <p className="text-sm text-paper/80" dir="auto">{value(lang, tenant.taglineAr, tenant.taglineEn)}</p> : null}<div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-paper/10 px-3 py-1">{status == null ? label(lang, "ساعات العمل", "Opening hours") : status ? label(lang, "مفتوح الآن", "Open now") : label(lang, "مغلق", "Closed")}</span><span className="rounded-full bg-paper/10 px-3 py-1" dir="auto">{value(lang, branch.nameAr, branch.nameEn)}</span></div>
      <div className="flex flex-wrap gap-2">{wa ? <a href={wa} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--menu-accent)] px-3 text-sm font-medium"><WhatsAppIcon />{label(lang, "واتساب", "WhatsApp")}</a> : null}{branch.mapsUrl ? <a href={branch.mapsUrl} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-paper/10 px-3 text-sm"><MapPin className="size-4" aria-hidden="true" />{label(lang, "الموقع", "Location")}</a> : null}{branch.phone ? <a href={`tel:${branch.phone}`} dir="ltr" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-paper/10 px-3 text-sm"><Phone className="size-4" aria-hidden="true" />{label(lang, "اتصال", "Call")}</a> : null}{tenant.instagramUrl ? <a href={tenant.instagramUrl} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-paper/10 px-3 text-sm"><Instagram className="size-4" aria-hidden="true" />Instagram</a> : null}</div>
    </div></header>
    {branches.length > 1 ? <nav aria-label={label(lang, "الفروع", "Branches")} className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-4 py-3 no-scrollbar">{branches.map((b) => <a key={b.id} href={`/m/${tenant.slug}/${b.slug}`} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-sm", b.id === branch.id ? "border-ink bg-ink text-paper" : "border-line")}><bdi dir="auto">{value(lang, b.nameAr, b.nameEn)}</bdi></a>)}</nav> : null}
    <div className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur"><div className="mx-auto grid max-w-2xl gap-3 px-4 py-3"><label className="relative block"><span className="sr-only">{label(lang, "بحث في المنيو", "Search menu")}</span><Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted start-3" aria-hidden="true" /><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label={label(lang, "بحث في المنيو", "Search menu")} placeholder={label(lang, "ابحث في المنيو", "Search menu")} className="h-11 w-full rounded-xl border border-line bg-paper pe-3 ps-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" /></label><div className="flex gap-2 overflow-x-auto no-scrollbar" role="group" aria-label={label(lang, "تصنيفات المنيو", "Menu categories")}>{[["all", label(lang, "الكل", "All")], ...categories.map((c) => [c.id, value(lang, c.nameAr, c.nameEn)])].map(([id, text]) => <button key={id} type="button" onClick={() => setCategoryId(id)} aria-pressed={categoryId === id} className={cn("min-h-9 shrink-0 rounded-full px-3 text-sm", categoryId === id ? "bg-ink text-paper" : "bg-sand text-ink-soft")}>{text}</button>)}</div></div></div>
    <main className="mx-auto grid max-w-2xl gap-8 px-4 py-7 pb-28">{featured.length && categoryId === "all" && !query ? <section className="grid gap-3" aria-labelledby="featured-heading"><h2 id="featured-heading" className="text-sm font-medium text-muted">{label(lang, "الأكثر تميزاً", "Featured")}</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{featured.map((p) => <button key={p.id} type="button" onClick={() => trackProduct(p)} className="min-h-11 overflow-hidden rounded-xl border border-line bg-paper text-start shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"><DishMedia product={p} className="h-32 w-full" /><span className="grid gap-1 p-3"><span className="font-medium" dir="auto">{value(lang, p.nameAr, p.nameEn)}</span><bdi dir="ltr" className="text-sm text-accent tabular bidi-isolate">{formatSar(p.price, lang)}</bdi></span></button>)}</div></section> : null}
      {filtered.length === 0 ? <EmptyState title={label(lang, "لا توجد أصناف مطابقة", "No matching items")} /> : (categoryId === "all" ? categories : categories.filter((c) => c.id === categoryId)).map((c) => { const items = filtered.filter((p) => p.categoryId === c.id); if (!items.length) return null; return <section key={c.id} className="grid gap-3" aria-labelledby={`category-${c.id}`}><h2 id={`category-${c.id}`} className="text-xl font-semibold" dir="auto">{value(lang, c.nameAr, c.nameEn)}</h2><ul className="grid gap-3 sm:grid-cols-2">{items.map((p) => <li key={p.id}><button type="button" onClick={() => trackProduct(p)} className="grid min-h-11 w-full grid-cols-[96px_1fr] gap-3 rounded-xl border border-line bg-paper p-2 text-start shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"><DishMedia product={p} className="h-24 w-24 rounded-lg sm:h-28 sm:w-28" /><span className="grid min-w-0 content-center gap-1"><span className="font-medium" dir="auto">{value(lang, p.nameAr, p.nameEn)}</span><span className="line-clamp-2 text-sm text-muted" dir="auto">{value(lang, p.descriptionAr, p.descriptionEn)}</span><bdi dir="ltr" className="text-sm font-medium text-accent tabular bidi-isolate">{formatSar(p.price, lang)}</bdi>{p.dietaryLabels.length ? <span className="text-[11px] text-muted" dir="auto">{p.dietaryLabels.slice(0, 2).join(" · ")}</span> : null}</span></button></li>)}</ul></section>; })}
      {hours.length ? <section className="grid gap-3 rounded-2xl border border-line bg-sand p-4" aria-labelledby="hours-heading"><div className="flex items-center gap-2"><Clock className="size-4" aria-hidden="true" /><h2 id="hours-heading" className="font-medium">{label(lang, "ساعات العمل", "Opening hours")}</h2></div>{[0,1,2,3,4,5,6].map((d) => { const h = hours.find((x) => x.weekday === d); return <div key={d} className="flex justify-between text-sm"><span>{weekdayLabel(d, lang)}</span><bdi dir="ltr" className="text-muted tabular bidi-isolate">{!h || h.isClosed ? label(lang, "مغلق", "Closed") : `${h.opensAt} – ${h.closesAt}`}</bdi></div>; })}</section> : null}
    </main>
    {!preview ? <nav aria-label={label(lang, "إجراءات المنيو", "Menu actions")} className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-lg items-center gap-2 rounded-2xl border border-line bg-paper/95 p-2 shadow-2xl backdrop-blur sm:bottom-5 sm:gap-3 sm:p-2.5">
      <button type="button" onClick={() => setCartOpen(true)} aria-label={label(lang, "السلة", "Cart")} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-3 text-sm font-medium text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"><ShoppingBag className="size-5" aria-hidden="true" /><span>{label(lang, "السلة", "Cart")}</span><span className="rounded-full bg-paper/15 px-2 py-0.5 tabular" aria-live="polite">{cartCount}</span>{cartCount ? <bdi dir="ltr" className="hidden sm:inline tabular bidi-isolate">{formatSar(cartTotal, lang)}</bdi> : null}</button>
      {wa ? <a href={wa} aria-label={label(lang, "التواصل عبر واتساب", "Contact on WhatsApp")} className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-paper text-ink" title={label(lang, "واتساب", "WhatsApp")}><WhatsAppIcon /></a> : null}
      {branch.mapsUrl ? <a href={branch.mapsUrl} aria-label={label(lang, "الموقع", "Location")} className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-paper text-ink" title={label(lang, "الموقع", "Location")}><MapPin className="size-5" aria-hidden="true" /></a> : null}
      {branch.phone ? <a href={`tel:${branch.phone}`} aria-label={label(lang, "اتصال", "Call")} dir="ltr" className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-paper text-ink" title={label(lang, "اتصال", "Call")}><Phone className="size-5" aria-hidden="true" /></a> : null}
    </nav> : null}
    {selected ? <ProductSheet lang={lang} product={selected} options={menu.productOptions?.[selected.id]} close={() => setSelectedId(null)} addToCart={addToCart} ordering={submitting} /> : null}
    {cartOpen ? <CartDrawer lang={lang} items={cart} setItems={setCart} close={() => setCartOpen(false)} submit={submit} submitting={submitting} error={orderError} /> : null}
    {successOrder ? <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4" role="presentation"><section role="alertdialog" aria-modal="true" aria-labelledby="order-success-title" className="w-full max-w-sm rounded-2xl bg-paper p-6 text-center shadow-2xl"><div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-sand text-xl" aria-hidden="true">✓</div><h2 id="order-success-title" className="text-xl font-semibold">{label(lang, "تم استلام طلبك", "Order received")}</h2><p className="mt-2 text-sm text-muted">{label(lang, "رقم الطلب", "Order number")} <strong className="text-ink"><bdi dir="ltr" className="tabular bidi-isolate">#{successOrder.number}</bdi></strong></p><p className="mt-1 text-sm text-muted"><bdi dir="ltr" className="tabular bidi-isolate">{formatSar(successOrder.total, lang)}</bdi></p><button type="button" autoFocus onClick={() => setSuccessOrder(null)} className="mt-5 h-11 w-full rounded-xl bg-ink text-sm font-medium text-paper">{label(lang, "العودة للمنيو", "Back to menu")}</button></section></div> : null}
  </div>;
}
