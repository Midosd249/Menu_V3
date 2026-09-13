import type { BranchHour, Lang, PublicMenu } from "./types";
import { DEFAULT_PUBLIC_ORIGIN, getPublicOrigin } from "./seo-discovery.ts";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export type PublicLocale = Lang;
export type LocaleAlternate = { hreflang: PublicLocale; href: string };

function clean(value: string): string { return value.replace(/\s+/g, " ").trim(); }
function absoluteHttpUrl(value: string): string | undefined { return /^https?:\/\//i.test(value) ? value : undefined; }
function publicOrigin(): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return getPublicOrigin({ VITE_VERCEL_PROJECT_PRODUCTION_URL: env?.VITE_VERCEL_PROJECT_PRODUCTION_URL, VERCEL_PROJECT_PRODUCTION_URL: env?.VERCEL_PROJECT_PRODUCTION_URL });
}
function branchName(menu: PublicMenu, lang: Lang = "ar"): string { return clean(lang === "ar" ? menu.branch.nameAr || menu.tenant.nameAr : menu.branch.nameEn || menu.tenant.nameEn || menu.branch.nameAr || menu.tenant.nameAr); }
function description(menu: PublicMenu, lang: Lang): string {
  const tagline = clean(lang === "ar" ? menu.tenant.taglineAr || menu.tenant.taglineEn : menu.tenant.taglineEn || menu.tenant.taglineAr);
  const city = clean(menu.tenant.city);
  return clean((lang === "ar" ? [tagline, city && `في ${city}`, "القائمة الرقمية للمطعم"] : [tagline, city && `Restaurant menu in ${city}`]).filter(Boolean).join(" — "));
}
function openingHoursSpecification(hours: BranchHour[]) {
  return hours.filter((hour) => !hour.isClosed && hour.opensAt && hour.closesAt).map((hour) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${DAY_NAMES[hour.weekday] ?? DAY_NAMES[0]}`, opens: hour.opensAt, closes: hour.closesAt }));
}
function hasVerifiedSaudiLocation(menu: PublicMenu): boolean { return clean(menu.tenant.country).toUpperCase() === "SA" && Boolean(clean(menu.tenant.city)) && Boolean(branchName(menu)) && Boolean(clean(menu.branch.addressAr)); }

function menuStructuredData(menu: PublicMenu, lang: Lang) {
  const sections = menu.categories.filter((category) => category.isActive).map((category) => {
    const products = menu.products.filter((product) => product.categoryId === category.id && product.isAvailable).map((product) => ({
      "@type": "MenuItem",
      name: clean(lang === "ar" ? product.nameAr || product.nameEn : product.nameEn || product.nameAr),
      ...(clean(lang === "ar" ? product.descriptionAr || product.descriptionEn : product.descriptionEn || product.descriptionAr) ? { description: clean(lang === "ar" ? product.descriptionAr || product.descriptionEn : product.descriptionEn || product.descriptionAr) } : {}),
      offers: { "@type": "Offer", price: String(product.price), priceCurrency: product.currency || menu.tenant.currency || "SAR", availability: "https://schema.org/InStock" },
      ...(product.calories != null ? { nutrition: { "@type": "NutritionInformation", calories: `${product.calories} calories` } } : {}),
    }));
    return { "@type": "MenuSection", name: clean(lang === "ar" ? category.nameAr || category.nameEn : category.nameEn || category.nameAr), hasMenuItem: products };
  }).filter((section) => section.hasMenuItem.length > 0);

  const uncategorized = menu.products.filter((product) => !product.categoryId && product.isAvailable).map((product) => ({
    "@type": "MenuItem",
    name: clean(lang === "ar" ? product.nameAr || product.nameEn : product.nameEn || product.nameAr),
    ...(clean(lang === "ar" ? product.descriptionAr || product.descriptionEn : product.descriptionEn || product.descriptionAr) ? { description: clean(lang === "ar" ? product.descriptionAr || product.descriptionEn : product.descriptionEn || product.descriptionAr) } : {}),
    offers: { "@type": "Offer", price: String(product.price), priceCurrency: product.currency || menu.tenant.currency || "SAR", availability: "https://schema.org/InStock" },
  }));
  if (uncategorized.length) sections.push({ "@type": "MenuSection", name: lang === "ar" ? "أصناف أخرى" : "Other items", hasMenuItem: uncategorized });
  return { "@type": "Menu", name: lang === "ar" ? `قائمة ${branchName(menu, lang)}` : `${branchName(menu, lang)} menu`, inLanguage: lang, hasMenuSection: sections };
}

export function isPublicMenuLocaleAvailable(menu: PublicMenu, lang: Lang): boolean { if (lang === "ar") return Boolean(branchName(menu, "ar")); return Boolean(clean(menu.tenant.nameEn) && clean(menu.branch.nameEn)); }
export function resolvePublicMenuLocale(menu: PublicMenu, requested: Lang): PublicLocale { return requested === "en" && isPublicMenuLocaleAvailable(menu, "en") ? "en" : "ar"; }
function localePath(pathname: string, lang: Lang): string { return lang === "en" ? `${pathname}?lang=en` : pathname; }
export function getPublicMenuLocaleAlternates(menu: PublicMenu, pathname: string, origin = publicOrigin()): LocaleAlternate[] { if (!isPublicMenuLocaleAvailable(menu, "en")) return []; return [{ hreflang: "ar", href: `${origin}${localePath(pathname, "ar")}` }, { hreflang: "en", href: `${origin}${localePath(pathname, "en")}` }]; }

export function getPublicMenuSeo(menu: PublicMenu, pathname: string, requestedLang: Lang = "ar", origin = publicOrigin()) {
  const lang = resolvePublicMenuLocale(menu, requestedLang);
  const name = branchName(menu, lang);
  const city = clean(menu.tenant.city);
  const title = lang === "ar" ? clean(city ? `${name} — القائمة والمنيو في ${city}` : `${name} — القائمة والمنيو`) : clean(city ? `${name} — Menu in ${city}` : `${name} — Restaurant Menu`);
  const image = absoluteHttpUrl(menu.tenant.coverUrl) ?? absoluteHttpUrl(menu.tenant.logoUrl);
  const logo = absoluteHttpUrl(menu.tenant.logoUrl);
  const mapsUrl = absoluteHttpUrl(menu.branch.mapsUrl);
  const canonical = `${origin}${localePath(pathname, lang)}`;
  const alternates = lang === requestedLang ? getPublicMenuLocaleAlternates(menu, pathname, origin) : [];
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${canonical}#restaurant`,
    name,
    description: description(menu, lang),
    url: canonical,
    hasMenu: menuStructuredData(menu, lang),
    currenciesAccepted: menu.tenant.currency || "SAR",
    telephone: menu.branch.phone || menu.tenant.whatsapp || undefined,
    ...(hasVerifiedSaudiLocation(menu) ? { address: { "@type": "PostalAddress", streetAddress: clean(menu.branch.addressAr), addressLocality: city, addressCountry: "SA" } } : {}),
    openingHoursSpecification: openingHoursSpecification(menu.hours),
    ...(mapsUrl ? { hasMap: mapsUrl } : {}),
  };
  if (image) schema.image = image;
  if (logo) schema.logo = logo;
  const instagram = absoluteHttpUrl(menu.tenant.instagramUrl);
  if (instagram) schema.sameAs = [instagram];
  return { title, description: description(menu, lang), canonical, image, schema, localSeoEligible: hasVerifiedSaudiLocation(menu), locale: lang, requestedLocale: requestedLang, localeAvailable: lang === requestedLang, alternates };
}

export function getNotFoundMenuSeo(pathname: string, origin = publicOrigin()) { return { canonical: `${origin}${pathname}`, robots: "noindex, nofollow" }; }
export { DEFAULT_PUBLIC_ORIGIN };
