import type { ReactNode } from "react";
import type { Lang, Product } from "@/lib/menu/types";
import { cn, formatSar } from "@/lib/utils";

export type MenuMediaProps = {
  src?: string;
  alt?: string;
  className?: string;
  eager?: boolean;
  fallback?: ReactNode;
};

export function MenuMedia({ src, alt = "", className, eager = false, fallback }: MenuMediaProps) {
  if (!src) {
    return <div className={cn("grid place-items-center bg-sand text-xs text-muted", className)} aria-hidden>{fallback ?? "Menu"}</div>;
  }

  return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={cn("object-cover", className)} />;
}

export function MenuPrice({ price, currency, lang, className }: { price: number; currency?: string; lang: Lang; className?: string }) {
  const formatted = currency && currency !== "SAR" ? `${price.toFixed(2)} ${currency}` : formatSar(price, lang);
  return <span className={cn("font-medium text-accent tabular-nums", className)} aria-label={formatted}>{formatted}</span>;
}

export function MenuBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "muted" }) {
  return <span className={cn(
    "inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-xs leading-4",
    tone === "accent" && "border-accent/30 bg-accent/10 text-accent",
    tone === "muted" && "border-transparent bg-sand text-muted",
    tone === "neutral" && "border-line text-muted",
  )}>{children}</span>;
}

export function MenuSection({ id, title, description, children, className }: { id?: string; title: string; description?: string; children: ReactNode; className?: string }) {
  return <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={cn("grid gap-4", className)}>
    <header className="grid gap-1">
      <h2 id={id ? `${id}-title` : undefined} className="text-xl font-semibold leading-tight text-ink">{title}</h2>
      {description ? <p className="max-w-prose text-sm leading-6 text-ink-soft">{description}</p> : null}
    </header>
    {children}
  </section>;
}

export function MenuProductCard({ product, lang, onSelect, className }: { product: Product; lang: Lang; onSelect?: (product: Product) => void; className?: string }) {
  const name = lang === "ar" ? product.nameAr || product.nameEn : product.nameEn || product.nameAr;
  const description = lang === "ar" ? product.descriptionAr || product.descriptionEn : product.descriptionEn || product.descriptionAr;
  const unavailable = !product.isAvailable;

  return <article className={cn("grid min-w-0 grid-cols-[auto_1fr] gap-3 rounded-2xl border border-line bg-paper p-3", className)}>
    <MenuMedia src={product.imageUrl} alt="" className="size-24 shrink-0 rounded-xl sm:size-28" />
    <div className="grid min-w-0 content-start gap-2">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <h3 className="min-w-0 break-words text-base font-semibold leading-6 text-ink">{name}</h3>
        <MenuPrice price={product.price} currency={product.currency} lang={lang} className="shrink-0" />
      </div>
      {description ? <p className="break-words text-sm leading-5 text-ink-soft">{description}</p> : null}
      <div className="flex min-w-0 flex-wrap gap-1.5" aria-label={lang === "ar" ? "معلومات الصنف" : "Item information"}>
        {product.dietaryLabels.map((label) => <MenuBadge key={label} tone="muted">{label}</MenuBadge>)}
        {unavailable ? <MenuBadge tone="accent">{lang === "ar" ? "غير متوفر" : "Unavailable"}</MenuBadge> : null}
      </div>
      {onSelect ? <button type="button" onClick={() => onSelect(product)} disabled={unavailable} className="mt-1 min-h-10 w-fit rounded-xl border border-ink px-4 text-sm font-medium text-ink transition hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50">{lang === "ar" ? "عرض التفاصيل" : "View details"}</button> : null}
    </div>
  </article>;
}
