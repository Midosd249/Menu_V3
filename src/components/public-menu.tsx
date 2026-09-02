import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Clock,
  Instagram,
  MapPin,
  Phone,
  Search,
  X,
} from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { EmptyState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";
import { recordPublicEvent } from "@/lib/menu/public";
import { getGuestSessionId } from "@/lib/menu/session";
import type { Lang, Product, PublicMenu } from "@/lib/menu/types";
import { cn, formatSar, weekdayLabel } from "@/lib/utils";

function loc(lang: Lang, ar: string, en: string) {
  return lang === "ar" ? ar || en : en || ar;
}

function dishTone(name: string) {
  const tones = ["#8f4e32", "#5c4638", "#6b5344", "#9a6b2f", "#3d4a3a", "#4a3b32"];
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i) * (i + 1)) % tones.length;
  return tones[hash];
}

function isOpenNow(hours: PublicMenu["hours"]): boolean | null {
  if (!hours.length) return null;
  const now = new Date();
  const day = now.getDay();
  const row = hours.find((h) => h.weekday === day);
  if (!row || row.isClosed || !row.opensAt || !row.closesAt) return false;
  const toMin = (v: string) => {
    const [h, m] = v.split(":").map(Number);
    return h * 60 + m;
  };
  const current = now.getHours() * 60 + now.getMinutes();
  const open = toMin(row.opensAt);
  const close = toMin(row.closesAt);
  if (close <= open) return current >= open || current <= close;
  return current >= open && current <= close;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.5 2 2 6.49 2 12.05c0 1.77.46 3.45 1.28 4.92L2 22l5.16-1.35a9.96 9.96 0 0 0 4.88 1.24h.01c5.54 0 10.04-4.49 10.04-10.04 0-2.68-1.04-5.2-2.94-7.09Zm-7.01 15.4h-.01a8.28 8.28 0 0 1-4.22-1.16l-.3-.18-3.06.8.82-2.98-.2-.31a8.26 8.26 0 0 1-1.27-4.42c0-4.57 3.72-8.29 8.3-8.29 2.22 0 4.3.86 5.86 2.43a8.24 8.24 0 0 1 2.43 5.87c0 4.58-3.73 8.3-8.35 8.3Zm4.56-6.21c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.16 1.73 2.64 4.2 3.7.59.25 1.04.41 1.4.52.59.18 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
    </svg>
  );
}

export function PublicMenuView({
  menu,
  preview = false,
}: {
  menu: PublicMenu;
  preview?: boolean;
}) {
  const { lang } = useLang();
  const { tenant, branch, branches, hours, categories, products } = menu;
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const guestProducts = preview ? products : products.filter((p) => p.isAvailable);
  const open = isOpenNow(hours);
  const featured = guestProducts.filter((p) => p.isFeatured);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guestProducts.filter((p) => {
      if (cat !== "all" && p.categoryId !== cat) return false;
      if (!q) return true;
      return [p.nameAr, p.nameEn, p.descriptionAr, p.descriptionEn].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [guestProducts, cat, query]);

  useEffect(() => {
    if (preview) return;
    const sessionId = getGuestSessionId();
    const source = new URLSearchParams(window.location.search).get("src");
    void recordPublicEvent({
      data: {
        slug: tenant.slug,
        branchSlug: branch.slug,
        eventType: source === "qr" ? "qr_scan" : "visit",
        lang,
        sessionId,
      },
    });
  }, [tenant.slug, branch.slug, lang, preview]);

  const selected = guestProducts.find((p) => p.id === openId) ?? null;

  function track(type: "product_view" | "whatsapp", product?: Product) {
    if (preview) return;
    void recordPublicEvent({
      data: {
        slug: tenant.slug,
        branchSlug: branch.slug,
        productId: product?.id,
        eventType: type,
        lang,
        sessionId: getGuestSessionId(),
      },
    });
  }

  function waLink(product?: Product) {
    if (!tenant.whatsapp) return null;
    const phone = tenant.whatsapp.replace(/[^\d]/g, "");
    const msg = tenant.whatsappTemplate
      .replace("{product}", loc(lang, product?.nameAr ?? "", product?.nameEn ?? "") || loc(lang, tenant.nameAr, tenant.nameEn))
      .replace("{restaurant}", loc(lang, tenant.nameAr, tenant.nameEn));
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div
      className="min-h-dvh bg-paper text-ink"
      style={
        {
          "--menu-accent": tenant.accentColor,
          "--menu-ink": tenant.primaryColor,
        } as CSSProperties
      }
    >
      {preview ? (
        <div className="bg-ink px-4 py-2 text-center text-xs text-paper">
          {lang === "ar" ? "معاينة المالك — الضيوف يرون المنشور فقط" : "Owner preview — guests only see the published menu"}
        </div>
      ) : null}

      <header className="relative overflow-hidden bg-ink text-paper">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: tenant.coverUrl
              ? `center/cover url(${tenant.coverUrl})`
              : `radial-gradient(120% 80% at 80% 0%, ${tenant.accentColor} 0%, transparent 55%), linear-gradient(180deg, ${tenant.primaryColor}, #0d0b09)`,
          }}
        />
        <div className="relative mx-auto flex max-w-lg flex-col gap-5 px-5 pb-8 pt-[max(1.5rem,env(safe-area-inset-top))]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {tenant.logoUrl ? (
                <img src={tenant.logoUrl} alt="" className="size-12 rounded-md object-cover" />
              ) : (
                <div
                  className="grid size-12 place-items-center rounded-md text-lg font-semibold"
                  style={{ background: tenant.accentColor }}
                >
                  {tenant.nameAr.slice(0, 1)}
                </div>
              )}
              <div>
                <p className="text-xs tracking-wide text-paper/70">{tenant.city}</p>
                <h1 className="font-display text-2xl font-semibold leading-tight">
                  {loc(lang, tenant.nameAr, tenant.nameEn)}
                </h1>
              </div>
            </div>
            <LangToggle />
          </div>
          {tenant.taglineAr || tenant.taglineEn ? (
            <p className="max-w-sm text-sm text-paper/80">{loc(lang, tenant.taglineAr, tenant.taglineEn)}</p>
          ) : null}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-paper/10 px-3 py-1">
              {open == null ? t(copy.menu.hours, lang) : open ? t(copy.menu.open, lang) : t(copy.menu.closed, lang)}
            </span>
            <span className="rounded-full bg-paper/10 px-3 py-1">{loc(lang, branch.nameAr, branch.nameEn)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {waLink() ? (
              <a
                className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--menu-accent)] px-3 text-sm font-medium text-paper"
                href={waLink()!}
                onClick={() => track("whatsapp")}
              >
                <WhatsAppIcon />
                {t(copy.menu.whatsapp, lang)}
              </a>
            ) : null}
            {branch.mapsUrl ? (
              <a className="inline-flex h-10 items-center gap-2 rounded-md bg-paper/10 px-3 text-sm" href={branch.mapsUrl}>
                <MapPin className="size-4" />
                {t(copy.menu.location, lang)}
              </a>
            ) : null}
            {branch.phone ? (
              <a className="inline-flex h-10 items-center gap-2 rounded-md bg-paper/10 px-3 text-sm" href={`tel:${branch.phone}`}>
                <Phone className="size-4" />
                {t(copy.menu.call, lang)}
              </a>
            ) : null}
            {tenant.instagramUrl ? (
              <a className="inline-flex h-10 items-center gap-2 rounded-md bg-paper/10 px-3 text-sm" href={tenant.instagramUrl}>
                <Instagram className="size-4" />
                {t(copy.menu.instagram, lang)}
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {branches.length > 1 ? (
        <div className="mx-auto flex max-w-lg gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
          {branches.map((b) => (
            <a
              key={b.id}
              href={`/m/${tenant.slug}/${b.slug}`}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-sm",
                b.id === branch.id ? "border-ink bg-ink text-paper" : "border-line text-ink-soft",
              )}
            >
              {loc(lang, b.nameAr, b.nameEn)}
            </a>
          ))}
        </div>
      ) : null}

      <div className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-3">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted start-3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(copy.menu.search, lang)}
              className="h-11 w-full rounded-md border border-line bg-paper pe-3 ps-10 text-sm"
            />
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setCat("all")}
              className={cn(
                "h-9 shrink-0 rounded-full px-3 text-sm",
                cat === "all" ? "bg-ink text-paper" : "bg-sand text-ink-soft",
              )}
            >
              {t(copy.menu.all, lang)}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className={cn(
                  "h-9 shrink-0 rounded-full px-3 text-sm",
                  cat === c.id ? "bg-ink text-paper" : "bg-sand text-ink-soft",
                )}
              >
                {loc(lang, c.nameAr, c.nameEn)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto flex max-w-lg flex-col gap-8 px-4 py-6">
        {featured.length > 0 && cat === "all" && !query ? (
          <section className="grid gap-3">
            <h2 className="text-sm font-medium text-muted">{t(copy.menu.featured, lang)}</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {featured.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setOpenId(p.id);
                    track("product_view", p);
                  }}
                  className="w-44 shrink-0 overflow-hidden rounded-lg border border-line bg-paper text-start"
                >
                  <DishMedia product={p} className="h-28 w-full" />
                  <div className="grid gap-1 p-3">
                    <p className="text-sm font-medium leading-snug">{loc(lang, p.nameAr, p.nameEn)}</p>
                    <p className="text-sm text-accent">{formatSar(p.price, lang)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {guestProducts.length === 0 ? (
          <EmptyState title={t(copy.menu.emptyMenu, lang)} />
        ) : filtered.length === 0 ? (
          <EmptyState title={t(copy.menu.noResults, lang)} />
        ) : (
          (cat === "all" ? categories : categories.filter((c) => c.id === cat)).map((c) => {
            const items = filtered.filter((p) => p.categoryId === c.id);
            if (!items.length) return null;
            return (
              <section key={c.id} className="grid gap-3">
                <h2 className="text-lg font-semibold">{loc(lang, c.nameAr, c.nameEn)}</h2>
                <ul className="grid gap-2">
                  {items.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenId(p.id);
                          track("product_view", p);
                        }}
                        className="flex w-full items-stretch gap-3 rounded-lg border border-line bg-paper p-2 text-start"
                      >
                        <DishMedia product={p} className="size-20 shrink-0 rounded-md" />
                        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-1">
                          <p className="font-medium leading-snug">{loc(lang, p.nameAr, p.nameEn)}</p>
                          {p.descriptionAr || p.descriptionEn ? (
                            <p className="line-clamp-2 text-xs text-muted">
                              {loc(lang, p.descriptionAr, p.descriptionEn)}
                            </p>
                          ) : null}
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-medium text-accent">{formatSar(p.price, lang)}</span>
                            {p.calories != null ? (
                              <span className="text-xs text-muted">
                                {p.calories} {t(copy.menu.kcal, lang)}
                              </span>
                            ) : null}
                            {!p.isAvailable ? (
                              <span className="text-xs text-bad">{t(copy.menu.unavailable, lang)}</span>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })
        )}

        <footer className="grid gap-3 border-t border-line pb-10 pt-6 text-sm text-ink-soft">
          <p>{t(copy.menu.vat, lang)}</p>
          {hours.length ? (
            <div className="grid gap-1">
              <p className="flex items-center gap-2 font-medium text-ink">
                <Clock className="size-4" />
                {t(copy.menu.hours, lang)}
              </p>
              {hours.map((h) => (
                <p key={h.weekday} className="flex justify-between text-xs">
                  <span>{weekdayLabel(h.weekday, lang)}</span>
                  <span>
                    {h.isClosed
                      ? lang === "ar"
                        ? "مغلق"
                        : "Closed"
                      : `${h.opensAt ?? ""} – ${h.closesAt ?? ""}`}
                  </span>
                </p>
              ))}
            </div>
          ) : null}
          {branch.addressAr || branch.addressEn ? (
            <p className="flex items-start gap-2 text-xs">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {loc(lang, branch.addressAr, branch.addressEn)}
            </p>
          ) : null}
        </footer>
      </main>

      {selected ? (
        <div className="fixed inset-0 z-40 grid place-items-end bg-ink/40 p-0 sm:place-items-center sm:p-6">
          <button type="button" className="absolute inset-0" aria-label="Close" onClick={() => setOpenId(null)} />
          <article className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-auto rounded-t-xl bg-paper sm:rounded-xl">
            <DishMedia product={selected} className="h-48 w-full" />
            <button
              type="button"
              className="absolute top-3 end-3 grid size-10 place-items-center rounded-full bg-paper/90"
              onClick={() => setOpenId(null)}
            >
              <X className="size-4" />
            </button>
            <div className="grid gap-4 p-5">
              <div>
                <h3 className="text-xl font-semibold">{loc(lang, selected.nameAr, selected.nameEn)}</h3>
                <p className="mt-1 text-lg text-accent">{formatSar(selected.price, lang)}</p>
              </div>
              {selected.descriptionAr || selected.descriptionEn ? (
                <p className="text-sm text-ink-soft">{loc(lang, selected.descriptionAr, selected.descriptionEn)}</p>
              ) : null}
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                {selected.calories != null ? (
                  <span>
                    {selected.calories} {t(copy.menu.kcal, lang)}
                  </span>
                ) : null}
                {selected.allergens
                  ? selected.allergens.split(",").map((a) => (
                      <span key={a} className="rounded-full bg-sand px-2 py-1">
                        {a.trim()}
                      </span>
                    ))
                  : null}
                {!selected.isAvailable ? (
                  <span className="text-bad">{t(copy.menu.unavailable, lang)}</span>
                ) : null}
              </div>
              {waLink(selected) && selected.isAvailable ? (
                <a
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--menu-accent)] text-sm font-medium text-paper"
                  href={waLink(selected)!}
                  onClick={() => track("whatsapp", selected)}
                >
                  <WhatsAppIcon />
                  {t(copy.menu.whatsapp, lang)}
                </a>
              ) : null}
            </div>
          </article>
        </div>
      ) : null}
    </div>
  );
}

function DishMedia({ product, className }: { product: Product; className?: string }) {
  if (product.imageUrl) {
    return <img src={product.imageUrl} alt="" className={cn("object-cover", className)} />;
  }
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: dishTone(product.nameAr || product.nameEn) }}
      aria-hidden
    >
      <div className="absolute inset-3 rounded-full bg-paper/15" />
      <div className="absolute inset-x-0 bottom-0 bg-ink/25 p-2 text-xs text-paper">
        {(product.nameAr || product.nameEn).slice(0, 18)}
      </div>
    </div>
  );
}
