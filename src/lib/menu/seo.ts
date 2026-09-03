import type { BranchHour, Lang, PublicMenu } from "./types";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const DEFAULT_PUBLIC_ORIGIN = "https://menu-v3-kohl.vercel.app";

export type PublicLocale = Lang;
export type LocaleAlternate = { hreflang: PublicLocale; href: string };

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function absoluteHttpUrl(value: string): string | undefined {
  return /^https?:\/\//i.test(value) ? value : undefined;
}

function publicOrigin(): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const configured = env?.VITE_VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (configured) return configured.startsWith("http") ? configured.replace(/\/+$/, "") : `https://${configured}`;
  return DEFAULT_PUBLIC_ORIGIN;
}

function branchName(menu: PublicMenu, lang: Lang = "ar"): string {
  return clean(lang === "ar" ? menu.branch.nameAr || menu.tenant.nameAr : menu.branch.nameEn || menu.tenant.nameEn || menu.branch.nameAr || menu.tenant.nameAr);
}

function description(menu: PublicMenu, lang: Lang): string {
  const tagline = clean(lang === "ar" ? menu.tenant.taglineAr || menu.tenant.taglineEn : menu.tenant.taglineEn || menu.tenant.taglineAr);
  const city = clean(menu.tenant.city);
  const parts = lang === "ar"
    ? [tagline, city && `في ${city}`, "القائمة الرقمية للمطعم"]
    : [tagline, city && `Restaurant menu in ${city}`];
  return clean(parts.filter(Boolean).join(" — "));
}

function openingHoursSpecification(hours: BranchHour[]) {
  return hours
    .filter((hour) => !hour.isClosed && hour.opensAt && hour.closesAt)
    .map((hour) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAY_NAMES[hour.weekday] ?? DAY_NAMES[0]}`,
      opens: hour.opensAt,
      closes: hour.closesAt,
    }));
}

function hasVerifiedSaudiLocation(menu: PublicMenu): boolean {
  return clean(menu.tenant.country).toUpperCase() === "SA"
    && Boolean(clean(menu.tenant.city))
    && Boolean(branchName(menu))
    && Boolean(clean(menu.branch.addressAr));
}

export function isPublicMenuLocaleAvailable(menu: PublicMenu, lang: Lang): boolean {
  if (lang === "ar") return Boolean(branchName(menu, "ar"));
  return Boolean(clean(menu.tenant.nameEn) && clean(menu.branch.nameEn));
}

export function resolvePublicMenuLocale(menu: PublicMenu, requested: Lang): PublicLocale {
  return requested === "en" && isPublicMenuLocaleAvailable(menu, "en") ? "en" : "ar";
}

function localePath(pathname: string, lang: Lang): string {
  return lang === "en" ? `${pathname}?lang=en` : pathname;
}

export function getPublicMenuLocaleAlternates(menu: PublicMenu, pathname: string, origin = publicOrigin()): LocaleAlternate[] {
  if (!isPublicMenuLocaleAvailable(menu, "en")) return [];
  return [
    { hreflang: "ar", href: `${origin}${localePath(pathname, "ar")}` },
    { hreflang: "en", href: `${origin}${localePath(pathname, "en")}` },
  ];
}

export function getPublicMenuSeo(menu: PublicMenu, pathname: string, requestedLang: Lang = "ar", origin = publicOrigin()) {
  const lang = resolvePublicMenuLocale(menu, requestedLang);
  const name = branchName(menu, lang);
  const city = clean(menu.tenant.city);
  const title = lang === "ar"
    ? clean(city ? `${name} — القائمة والمنيو في ${city}` : `${name} — القائمة والمنيو`)
    : clean(city ? `${name} — Menu in ${city}` : `${name} — Restaurant Menu`);
  const image = absoluteHttpUrl(menu.tenant.coverUrl) ?? absoluteHttpUrl(menu.tenant.logoUrl);
  const logo = absoluteHttpUrl(menu.tenant.logoUrl);
  const mapsUrl = absoluteHttpUrl(menu.branch.mapsUrl);
  const canonical = localePath(pathname, lang);
  const alternates = lang === requestedLang ? getPublicMenuLocaleAlternates(menu, pathname, origin) : [];
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    description: description(menu, lang),
    url: canonical,
    hasMenu: canonical,
    currenciesAccepted: menu.tenant.currency || "SAR",
    telephone: menu.branch.phone || menu.tenant.whatsapp || undefined,
    ...(hasVerifiedSaudiLocation(menu) ? {
      address: {
        "@type": "PostalAddress",
        streetAddress: clean(menu.branch.addressAr),
        addressLocality: city,
        addressCountry: "SA",
      },
    } : {}),
    openingHoursSpecification: openingHoursSpecification(menu.hours),
    ...(mapsUrl ? { hasMap: mapsUrl } : {}),
  };
  if (image) schema.image = image;
  if (logo) schema.logo = logo;

  return {
    title,
    description: description(menu, lang),
    canonical,
    image,
    schema,
    localSeoEligible: hasVerifiedSaudiLocation(menu),
    locale: lang,
    requestedLocale: requestedLang,
    localeAvailable: lang === requestedLang,
    alternates,
  };
}

export function getNotFoundMenuSeo(pathname: string) {
  return {
    canonical: pathname,
    robots: "noindex, nofollow",
  };
}
