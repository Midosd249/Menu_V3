import assert from "node:assert/strict";
import test from "node:test";
import { getNotFoundMenuSeo, getPublicMenuLocaleAlternates, getPublicMenuSeo, isPublicMenuLocaleAvailable, resolvePublicMenuLocale } from "./seo.ts";
import { mapPublicTenant } from "./map.ts";
import type { PublicMenu } from "./types.ts";

const menu = {
  tenant: {
    id: "t1", slug: "najd-kitchen", nameAr: "مطبخ نجد", nameEn: "Najd Kitchen",
    taglineAr: "أطباق نجدية بطابع معاصر", taglineEn: "Modern Najdi cuisine", logoUrl: "https://example.com/logo.png",
    coverUrl: "https://example.com/cover.jpg", instagramUrl: "", whatsapp: "+966500000000", whatsappTemplate: "",
    primaryColor: "#111", accentColor: "#eee", themeKey: "editorial", currency: "SAR", city: "الرياض", country: "SA",
    isPublished: true, isActive: true, createdAt: "", updatedAt: "",
  },
  branch: {
    id: "b1", tenantId: "t1", slug: "olaya", nameAr: "فرع العليا", nameEn: "Olaya Branch", addressAr: "شارع العليا",
    addressEn: "Olaya Street", mapsUrl: "", phone: "+966511111111", isActive: true,
  },
  branches: [],
  hours: [{ branchId: "b1", weekday: 0, opensAt: "10:00", closesAt: "23:00", isClosed: false }],
  categories: [{ id: "cat1", tenantId: "t1", sortOrder: 1, nameAr: "الأطباق", nameEn: "Dishes", isActive: true }],
  products: [{ id: "p1", tenantId: "t1", categoryId: "cat1", sortOrder: 1, nameAr: "كبسة نجد", nameEn: "Najdi Kabsa", descriptionAr: "كبسة يومية", descriptionEn: "Daily kabsa", price: 42, currency: "SAR", imageUrl: "", calories: 650, isAvailable: true, isFeatured: true, allergens: "", tags: [], dietaryLabels: [] }],
} satisfies PublicMenu;

test("public tenant mapping excludes owner identity from the public response shape", () => {
  const publicTenant = mapPublicTenant({
    id: "t1", owner_user_id: "private-owner-id", slug: "najd-kitchen", name_ar: "مطبخ نجد", name_en: "Najd Kitchen",
    tagline_ar: "", tagline_en: "", logo_url: "", cover_url: "", instagram_url: "", whatsapp: "", whatsapp_template: "",
    primary_color: "#111", accent_color: "#eee", theme_key: "editorial", currency: "SAR", city: "الرياض", country: "SA",
    is_published: true, is_active: true, created_at: "", updated_at: "", public_content_version: 42,
  });
  assert.equal("ownerUserId" in publicTenant, false);
  assert.equal("public_content_version" in publicTenant, false);
});

test("public menu SEO derives Arabic title, absolute canonical, and structured restaurant/menu data", () => {
  const seo = getPublicMenuSeo(menu, "/m/najd-kitchen/olaya", "ar", "https://example.com");
  assert.equal(seo.title, "فرع العليا — القائمة والمنيو في الرياض");
  assert.equal(seo.canonical, "https://example.com/m/najd-kitchen/olaya");
  assert.equal(seo.schema["@type"], "Restaurant");
  assert.equal(seo.schema.name, "فرع العليا");
  assert.equal(seo.schema.url, "https://example.com/m/najd-kitchen/olaya");
  const structuredMenu = seo.schema.hasMenu as Record<string, unknown>;
  assert.equal(structuredMenu["@type"], "Menu");
  const sections = structuredMenu.hasMenuSection as Array<Record<string, unknown>>;
  assert.equal(sections[0].name, "الأطباق");
  const items = sections[0].hasMenuItem as Array<Record<string, unknown>>;
  assert.equal(items[0].name, "كبسة نجد");
  assert.deepEqual(items[0].offers, { "@type": "Offer", price: "42", priceCurrency: "SAR", availability: "https://schema.org/InStock" });
  assert.equal(seo.schema.currenciesAccepted, "SAR");
  assert.equal(seo.localSeoEligible, true);
  assert.equal(seo.locale, "ar");
  assert.deepEqual(seo.schema.address, { "@type": "PostalAddress", streetAddress: "شارع العليا", addressLocality: "الرياض", addressCountry: "SA" });
  assert.deepEqual(seo.schema.openingHoursSpecification, [{ "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Monday", opens: "10:00", closes: "23:00" }]);
});

test("English public menu SEO is a real URL-level locale variant with reciprocal alternates", () => {
  assert.equal(isPublicMenuLocaleAvailable(menu, "en"), true);
  assert.equal(resolvePublicMenuLocale(menu, "en"), "en");
  const seo = getPublicMenuSeo(menu, "/m/najd-kitchen/olaya", "en", "https://example.com");
  assert.equal(seo.locale, "en");
  assert.equal(seo.localeAvailable, true);
  assert.equal(seo.title, "Olaya Branch — Menu in الرياض");
  assert.equal(seo.canonical, "https://example.com/m/najd-kitchen/olaya?lang=en");
  assert.deepEqual(seo.alternates, [{ hreflang: "ar", href: "https://example.com/m/najd-kitchen/olaya" }, { hreflang: "en", href: "https://example.com/m/najd-kitchen/olaya?lang=en" }]);
  assert.deepEqual(getPublicMenuLocaleAlternates(menu, "/m/najd-kitchen/olaya", "https://example.com"), seo.alternates);
});

test("missing English locale does not create a fabricated English variant", () => {
  const withoutEnglish = { ...menu, tenant: { ...menu.tenant, nameEn: "" }, branch: { ...menu.branch, nameEn: "" } } satisfies PublicMenu;
  assert.equal(isPublicMenuLocaleAvailable(withoutEnglish, "en"), false);
  assert.equal(resolvePublicMenuLocale(withoutEnglish, "en"), "ar");
  assert.deepEqual(getPublicMenuLocaleAlternates(withoutEnglish, "/m/najd-kitchen/olaya", "https://example.com"), []);
  const seo = getPublicMenuSeo(withoutEnglish, "/m/najd-kitchen/olaya", "en", "https://example.com");
  assert.equal(seo.locale, "ar");
  assert.equal(seo.localeAvailable, false);
  assert.equal(seo.canonical, "https://example.com/m/najd-kitchen/olaya");
  assert.deepEqual(seo.alternates, []);
});

test("local SEO omits location markup when verified Saudi location data is incomplete", () => {
  const incomplete = { ...menu, tenant: { ...menu.tenant, city: "" }, branch: { ...menu.branch, addressAr: "", mapsUrl: "https://maps.google.com/?q=unknown" } } satisfies PublicMenu;
  const seo = getPublicMenuSeo(incomplete, "/m/najd-kitchen/olaya", "ar", "https://example.com");
  assert.equal(seo.localSeoEligible, false);
  assert.equal("address" in seo.schema, false);
  assert.equal(seo.schema.hasMap, "https://maps.google.com/?q=unknown");
});

test("missing public menu SEO is explicitly noindex with an absolute canonical", () => {
  assert.deepEqual(getNotFoundMenuSeo("/m/missing", "https://example.com"), { canonical: "https://example.com/m/missing", robots: "noindex, nofollow" });
});
