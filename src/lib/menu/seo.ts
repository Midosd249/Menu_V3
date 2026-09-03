import type { BranchHour, PublicMenu } from "./types";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function absoluteHttpUrl(value: string): string | undefined {
  return /^https?:\/\//i.test(value) ? value : undefined;
}

function branchName(menu: PublicMenu): string {
  return clean(menu.branch.nameAr || menu.tenant.nameAr);
}

function description(menu: PublicMenu): string {
  const tagline = clean(menu.tenant.taglineAr);
  const city = clean(menu.tenant.city);
  const parts = [tagline, city && `في ${city}`, "القائمة الرقمية للمطعم"];
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

export function getPublicMenuSeo(menu: PublicMenu, pathname: string) {
  const name = branchName(menu);
  const city = clean(menu.tenant.city);
  const title = clean(city ? `${name} — القائمة والمنيو في ${city}` : `${name} — القائمة والمنيو`);
  const image = absoluteHttpUrl(menu.tenant.coverUrl) ?? absoluteHttpUrl(menu.tenant.logoUrl);
  const logo = absoluteHttpUrl(menu.tenant.logoUrl);
  const canonical = pathname || `/m/${menu.tenant.slug}`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    description: description(menu),
    url: canonical,
    hasMenu: canonical,
    currenciesAccepted: menu.tenant.currency || "SAR",
    telephone: menu.branch.phone || menu.tenant.whatsapp || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: clean(menu.branch.addressAr),
      addressLocality: city || undefined,
      addressCountry: menu.tenant.country || "SA",
    },
    openingHoursSpecification: openingHoursSpecification(menu.hours),
  };
  if (image) schema.image = image;
  if (logo) schema.logo = logo;

  return {
    title,
    description: description(menu),
    canonical,
    image,
    schema,
  };
}

export function getNotFoundMenuSeo(pathname: string) {
  return {
    canonical: pathname,
    robots: "noindex, nofollow",
  };
}
