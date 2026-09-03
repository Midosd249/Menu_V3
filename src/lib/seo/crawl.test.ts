import assert from "node:assert/strict";
import test from "node:test";
import { buildRobotsTxt, buildSitemapXml, publicMenuSitemapEntries } from "./crawl.ts";

test("robots.txt allows public pages and declares the sitemap", () => {
  const robots = buildRobotsTxt("https://menu.example.com/");
  assert.match(robots, /^User-agent: \*/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Disallow: \/admin$/m);
  assert.match(robots, /^Disallow: \/api\/$/m);
  assert.match(robots, /^Sitemap: https:\/\/menu\.example\.com\/sitemap\.xml$/m);
});

test("sitemap includes only supplied public menu entries and escapes XML", () => {
  const entries = publicMenuSitemapEntries([
    { slug: "nafas", branchSlug: "olaya", updatedAt: "2026-09-03T14:00:00Z" },
    { slug: "closed-tenant", branchSlug: null, updatedAt: null },
  ]);
  const xml = buildSitemapXml("https://menu.example.com", entries);

  assert.equal((xml.match(/<url>/g) ?? []).length, 3);
  assert.match(xml, /https:\/\/menu\.example\.com\/m\/nafas/);
  assert.match(xml, /https:\/\/menu\.example\.com\/m\/nafas\/olaya/);
  assert.match(xml, /https:\/\/menu\.example\.com\/m\/closed-tenant/);
  assert.match(xml, /<lastmod>2026-09-03T14:00:00Z<\/lastmod>/);
  assert.doesNotMatch(xml, /<\/script>/i);
});

test("sitemap deduplicates paths and preserves the first entry", () => {
  const xml = buildSitemapXml("https://menu.example.com", [
    { path: "/m/nafas", lastModified: "2026-09-01T00:00:00Z" },
    { path: "/m/nafas", lastModified: "2026-09-02T00:00:00Z" },
  ]);

  assert.equal((xml.match(/<url>/g) ?? []).length, 1);
  assert.match(xml, /2026-09-01T00:00:00Z/);
  assert.doesNotMatch(xml, /2026-09-02T00:00:00Z/);
});
