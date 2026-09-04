import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildRobotsTxt, buildSitemapXml, publicMenuSitemapEntries } from "../src/lib/seo/crawl.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKFLOW = readFileSync(join(ROOT, ".github/workflows/quality.yml"), "utf8");
const CRAWL_MIDDLEWARE = readFileSync(join(ROOT, "server/middleware/grok-pwa.ts"), "utf8");
const PUBLIC_MENU = readFileSync(join(ROOT, "src/components/public-menu.tsx"), "utf8");
const PERFORMANCE_AUDIT = readFileSync(join(ROOT, "scripts/performance-audit.mjs"), "utf8");

test("Browser template QA isolates the preview from runner process cleanup and covers all themes", () => {
  const qaStep = WORKFLOW.match(/- name: Browser template QA — all themes\n[ ]{8}run: \|\n([\s\S]*?)(?=\n[ ]{6}- name: Upload browser performance baseline)/)?.[1] ?? "";

  assert.match(qaStep, /setsid bash -c 'unset RUNNER_TRACKING_ID; exec node \.\/node_modules\/vite\/bin\/vite\.js preview/);
  assert.match(qaStep, /npm run performance:audit -- http:\/\/127\.0\.0\.1:8081\/themes\/preview\?theme=editorial/);
  assert.match(qaStep, /npm run qa:template http:\/\/127\.0\.0\.1:8081\/themes\/preview\?theme=editorial -- --all-themes/);
  assert.match(qaStep, /Browser QA failed — preview log follows/);
});

test("performance audit measures the G6 baseline without imposing guessed budgets", () => {
  assert.match(PERFORMANCE_AUDIT, /largest-contentful-paint/);
  assert.match(PERFORMANCE_AUDIT, /layout-shift/);
  assert.match(PERFORMANCE_AUDIT, /getEntriesByType\("event"\)/);
  assert.match(PERFORMANCE_AUDIT, /transferSize/);
  assert.match(PERFORMANCE_AUDIT, /isFont/);
  assert.match(PERFORMANCE_AUDIT, /lazyImageCount/);
  assert.match(PERFORMANCE_AUDIT, /cachedResourceCount/);
  assert.match(PERFORMANCE_AUDIT, /schemaVersion: 1/);
  assert.doesNotMatch(PERFORMANCE_AUDIT, /LCP.*(?:budget|threshold)|CLS.*(?:budget|threshold)|INP.*(?:budget|threshold)/i);
});

test("robots.txt allows public pages, protects private surfaces, and declares the sitemap", () => {
  const robots = buildRobotsTxt("https://menu.example.com/");
  assert.match(robots, /^User-agent: \*/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Disallow: \/admin$/m);
  assert.match(robots, /^Disallow: \/studio$/m);
  assert.match(robots, /^Disallow: \/api\/$/m);
  assert.doesNotMatch(robots, /^Disallow: \/m/m);
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

test("sitemap deduplicates repeated paths without replacing the first source entry", () => {
  const xml = buildSitemapXml("https://menu.example.com", [
    { path: "/m/nafas", lastModified: "2026-09-01T00:00:00Z" },
    { path: "/m/nafas", lastModified: "2026-09-02T00:00:00Z" },
  ]);

  assert.equal((xml.match(/<url>/g) ?? []).length, 1);
  assert.match(xml, /2026-09-01T00:00:00Z/);
  assert.doesNotMatch(xml, /2026-09-02T00:00:00Z/);
});

test("sitemap middleware exposes only published active tenants and active branches", () => {
  assert.match(CRAWL_MIDDLEWARE, /path === "\/sitemap\.xml"/);
  assert.match(CRAWL_MIDDLEWARE, /from tenants t\n\s+join branches b on b\.tenant_id = t\.id and b\.is_active = true/);
  assert.match(CRAWL_MIDDLEWARE, /where t\.is_active = true and t\.is_published = true/);
  assert.match(CRAWL_MIDDLEWARE, /order by t\.slug, b\.created_at/);
});

test("public menu keeps below-the-fold product media lazy-loaded and low-priority", () => {
  assert.match(PUBLIC_MENU, /loading="lazy"/);
  assert.match(PUBLIC_MENU, /decoding="async"/);
  assert.match(PUBLIC_MENU, /fetchPriority="low"/);
});
