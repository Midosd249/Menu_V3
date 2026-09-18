import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildPublicMenuSitemapEntries, buildRobotsTxt, buildSitemapXml } from "../src/lib/menu/seo-discovery.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKFLOW = readFileSync(join(ROOT, ".github/workflows/quality.yml"), "utf8");
const DISCOVERY_MIDDLEWARE = readFileSync(join(ROOT, "server/middleware/seo-discovery.ts"), "utf8");
const PWA_MIDDLEWARE = readFileSync(join(ROOT, "server/middleware/grok-pwa.ts"), "utf8");
const BRANCH_PUBLIC_MENU_ROUTE = readFileSync(join(ROOT, "src/routes/m.$slug.$branch.tsx"), "utf8");
const PUBLIC_MENU = readFileSync(join(ROOT, "src/components/public-menu.tsx"), "utf8");
const PUBLIC_MENU_ROUTE = readFileSync(join(ROOT, "src/routes/m.$slug.tsx"), "utf8");
const ROOT_ROUTE = readFileSync(join(ROOT, "src/routes/__root.tsx"), "utf8");
const PERFORMANCE_AUDIT = readFileSync(join(ROOT, "scripts/performance-audit.mjs"), "utf8");

test("Browser template QA isolates the preview from runner process cleanup and covers all themes", () => {
  assert.ok(WORKFLOW.includes("setsid bash -c 'unset RUNNER_TRACKING_ID; exec node ./node_modules/vite/bin/vite.js preview"));
  assert.ok(WORKFLOW.includes("npm run performance:audit -- http://127.0.0.1:8081/themes/preview?theme=editorial"));
  assert.ok(WORKFLOW.includes("npm run qa:template http://127.0.0.1:8081/themes/preview?theme=editorial -- --all-themes"));
  assert.ok(WORKFLOW.includes("echo \"[preview] Browser QA failed — preview log follows\""));
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

test("public menu hydration reuses SSR data without a duplicate network fetch", () => {
  assert.match(PUBLIC_MENU_ROUTE, /if \(initialMenu\) \{/);
  assert.match(PUBLIC_MENU_ROUTE, /writeCachedMenu\(cacheKey, initialMenu\);/);
  assert.ok(PUBLIC_MENU_ROUTE.includes("return;"));
  assert.match(PUBLIC_MENU_ROUTE, /load\(\); \/\/ eslint-disable-line react-hooks\/exhaustive-deps/);
});

test("public menu failure handling uses bounded retries and localized terminal messages", () => {
  assert.match(PUBLIC_MENU_ROUTE, /const MENU_RETRY_LIMIT = 2/);
  assert.match(PUBLIC_MENU_ROUTE, /for \(let attempt = 1; attempt <= MENU_RETRY_LIMIT; attempt \+= 1\)/);
  assert.match(PUBLIC_MENU_ROUTE, /if \(attempt < MENU_RETRY_LIMIT\) await sleep\(MENU_RETRY_DELAY_MS \* attempt\)/);
  assert.match(PUBLIC_MENU_ROUTE, /result\.code === "not_found" \|\| result\.code === "invalid"/);
  assert.match(PUBLIC_MENU_ROUTE, /locale === "en"/);
  assert.match(PUBLIC_MENU_ROUTE, /استغرق تحميل المنيو وقتًا أطول من المتوقع/);
  assert.match(PUBLIC_MENU_ROUTE, /المنيو غير متاحة مؤقتًا/);
});

test("critical font origin is warmed before the typography stylesheet", () => {
  const preconnect = ROOT_ROUTE.indexOf('{ rel: "preconnect", href: "https://cdn.jsdelivr.net"');
  const stylesheet = ROOT_ROUTE.indexOf('{ rel: "stylesheet", href: typographyCss }');
  assert.ok(preconnect >= 0, "missing jsDelivr preconnect");
  assert.ok(ROOT_ROUTE.includes('{ rel: "dns-prefetch", href: "https://cdn.jsdelivr.net" }'));
  assert.ok(ROOT_ROUTE.includes('crossOrigin: "anonymous"'));
  assert.ok(stylesheet > preconnect, "font connection hint must precede typography stylesheet");
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

test("sitemap renders canonical branch entries with XML-safe values and locale alternates", () => {
  const entries = buildPublicMenuSitemapEntries([
    { slug: "nafas", branchSlug: "olaya", nameEn: "Nafas", branchNameEn: "Olaya" },
  ], "https://menu.example.com");
  const xml = buildSitemapXml(entries);

  assert.equal((xml.match(/<url>/g) ?? []).length, 2);
  assert.match(xml, /https:\/\/menu\.example\.com\/m\/nafas\/olaya/);
  assert.match(xml, /hreflang="en" href="https:\/\/menu\.example\.com\/m\/nafas\/olaya\?lang=en"/);
  assert.doesNotMatch(xml, /<\/script>/i);
});

test("sitemap deduplicates repeated canonical URLs without replacing the first entry", () => {
  const xml = buildSitemapXml([
    { loc: "https://menu.example.com/m/nafas", alternates: [] },
    { loc: "https://menu.example.com/m/nafas", alternates: [] },
  ]);

  assert.equal((xml.match(/<url>/g) ?? []).length, 1);
});

test("public discovery has one owner for robots and sitemap responses", () => {
  assert.match(DISCOVERY_MIDDLEWARE, /pathname === "\/robots\.txt"/);
  assert.match(DISCOVERY_MIDDLEWARE, /pathname !== "\/sitemap\.xml"/);
  assert.match(DISCOVERY_MIDDLEWARE, /from tenants t/);
  assert.match(DISCOVERY_MIDDLEWARE, /join branches b on b\.tenant_id = t\.id and b\.is_active = true/);
  assert.match(DISCOVERY_MIDDLEWARE, /where t\.is_active = true and t\.is_published = true/);
  assert.match(DISCOVERY_MIDDLEWARE, /order by t\.slug, b\.created_at/);
  assert.doesNotMatch(PWA_MIDDLEWARE, /path === "\/robots\.txt"/);
  assert.doesNotMatch(PWA_MIDDLEWARE, /path === "\/sitemap\.xml"/);
});

test("public menu keeps below-the-fold product media lazy-loaded and low-priority", () => {
  assert.match(PUBLIC_MENU, /loading="lazy"/);
  assert.match(PUBLIC_MENU, /decoding="async"/);
  assert.match(PUBLIC_MENU, /fetchPriority="low"/);
});


test("public menu routes convert not-found data into router-level 404s", () => {
  assert.match(PUBLIC_MENU_ROUTE, /import \{ createFileRoute, notFound \} from "@\/tanstack\/react-router"/);
  assert.match(PUBLIC_MENU_ROUTE, /if \(result\.code === "not_found"\) throw notFound\(\)/);
  assert.match(BRANCH_PUBLIC_MENU_ROUTE, /import \{ createFileRoute, notFound \} from "@\/tanstack\/react-router"/);
  assert.match(BRANCH_PUBLIC_MENU_ROUTE, /if \(result\.code === "not_found"\) throw notFound\(\)/);
});
