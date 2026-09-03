import assert from "node:assert/strict";
import test from "node:test";
import { getNotFoundMenuSeo, getPublicMenuSeo } from "./seo.ts";
import { buildRobotsTxt, buildSitemapXml, publicMenuSitemapEntries } from "../seo/crawl.ts";
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

test("robots.txt allows public pages and declares the sitemap", () => {
  const robots = buildRobotsTxt("https://menu.example.com/");
  assert.match(robots, /^User-agent: \*/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Disallow: \/admin$/m);
  assert.match(robots, /^Disallow: \/api\/$/m);
  assert.match(robots, /^Sitemap: https:\/\/menu\.example\.com\/sitemap\.xml$/m);
});

test("sitemap renders public menu and branch entries with XML-safe values", () => {
  const entries = publicMenuSitemapEntries([
    { slug: "nafas", branchSlug: "olaya", updatedAt: "2026-09-03T14:00:00Z" },
  ]);
  const xml = buildSitemapXml("https://menu.example.com", entries);

  assert.equal((xml.match(/<url>/g) ?? []).length, 2);
  assert.match(xml, /https:\/\/menu\.example\.com\/m\/nafas/);
  assert.match(xml, /https:\/\/menu\.example\.com\/m\/nafas\/olaya/);
  assert.match(xml, /<lastmod>2026-09-03T14:00:00Z<\/lastmod>/);
  assert.doesNotMatch(xml, /<\/script>/i);
});

test("sitemap deduplicates repeated paths", () => {
  const xml = buildSitemapXml("https://menu.example.com", [
    { path: "/m/nafas", lastModified: "2026-09-01T00:00:00Z" },
    { path: "/m/nafas", lastModified: "2026-09-02T00:00:00Z" },
  ]);

  assert.equal((xml.match(/<url>/g) ?? []).length, 1);
  assert.match(xml, /2026-09-01T00:00:00Z/);
  assert.doesNotMatch(xml, /2026-09-02T00:00:00Z/);
});
