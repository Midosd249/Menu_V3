import assert from "node:assert/strict";
import test from "node:test";
import { buildRobotsTxt, buildSitemapXml, publicMenuSitemapEntries } from "../src/lib/seo/crawl.ts";

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
