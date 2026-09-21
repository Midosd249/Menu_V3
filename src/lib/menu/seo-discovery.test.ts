import assert from "node:assert/strict";
import test from "node:test";
import { buildPublicMenuSitemapEntries, buildRobotsTxt, buildSitemapXml, getPublicOrigin, publicPath } from "./seo-discovery.ts";

test("public discovery uses the configured production origin and stable public paths", () => {
  assert.equal(getPublicOrigin({ VITE_VERCEL_PROJECT_PRODUCTION_URL: "menu.example.com/" }), "https://menu.example.com");
  assert.equal(publicPath("najd-kitchen", "olaya", "ar"), "/m/najd-kitchen/olaya");
  assert.equal(publicPath("najd-kitchen", "olaya", "en"), "/m/najd-kitchen/olaya?lang=en");
});

test("robots excludes private/control surfaces and advertises the sitemap", () => {
  const robots = buildRobotsTxt("https://example.com");
  assert.match(robots, /^User-agent: \*/m);
  assert.match(robots, /Disallow: \/admin/);
  assert.match(robots, /Disallow: \/studio/);
  assert.match(robots, /Disallow: \/invite\//);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Sitemap: https:\/\/example\.com\/sitemap\.xml/);
});

test("sitemap contains only published branch paths and reciprocal locale alternates", () => {
  const entries = buildPublicMenuSitemapEntries([
    { slug: "najd-kitchen", branchSlug: "olaya", nameEn: "Najd Kitchen", branchNameEn: "Olaya Branch" },
    { slug: "arabic-only", branchSlug: "central", nameEn: "", branchNameEn: "" },
  ], "https://example.com");
  assert.equal(entries.length, 3);
  assert.equal(entries[0].loc, "https://example.com/m/najd-kitchen/olaya");
  assert.deepEqual(entries[0].alternates, [
    { hreflang: "ar", href: "https://example.com/m/najd-kitchen/olaya" },
    { hreflang: "en", href: "https://example.com/m/najd-kitchen/olaya?lang=en" },
  ]);
  assert.equal(entries[1].loc, "https://example.com/m/najd-kitchen/olaya?lang=en");
  assert.equal(entries[2].loc, "https://example.com/m/arabic-only/central");
  assert.equal(entries[2].alternates, undefined);

  const xml = buildSitemapXml(entries);
  assert.match(xml, /<urlset[^>]+xmlns:xhtml=/);
  assert.match(xml, /<loc>https:\/\/example\.com\/m\/najd-kitchen\/olaya<\/loc>/);
  assert.match(xml, /hreflang="en" href="https:\/\/example\.com\/m\/najd-kitchen\/olaya\?lang=en"/);
  assert.doesNotMatch(xml, /arabic-only\/central\?lang=en/);
});
