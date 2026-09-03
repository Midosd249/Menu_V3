import assert from "node:assert/strict";
import test from "node:test";
import { getNotFoundMenuSeo, getPublicMenuSeo } from "./seo.ts";
import type { PublicMenu } from "./types.ts";

const menu = {
  tenant: {
    id: "t1", ownerUserId: "u1", slug: "najd-kitchen", nameAr: "مطبخ نجد", nameEn: "Najd Kitchen",
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
  categories: [], products: [],
} satisfies PublicMenu;

test("public menu SEO derives Arabic title, canonical, and restaurant schema from visible data", () => {
  const seo = getPublicMenuSeo(menu, "/m/najd-kitchen/olaya");
  assert.equal(seo.title, "فرع العليا — القائمة والمنيو في الرياض");
  assert.equal(seo.canonical, "/m/najd-kitchen/olaya");
  assert.equal(seo.schema["@type"], "Restaurant");
  assert.equal(seo.schema.name, "فرع العليا");
  assert.equal(seo.schema.currenciesAccepted, "SAR");
  assert.deepEqual(seo.schema.openingHoursSpecification, [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "https://schema.org/Monday",
    opens: "10:00",
    closes: "23:00",
  }]);
});

test("missing public menu SEO is explicitly noindex", () => {
  assert.deepEqual(getNotFoundMenuSeo("/m/missing"), {
    canonical: "/m/missing",
    robots: "noindex, nofollow",
  });
});
