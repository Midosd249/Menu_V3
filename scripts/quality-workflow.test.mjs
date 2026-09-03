import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildRobotsTxt, buildSitemapXml, publicMenuSitemapEntries } from "../src/lib/seo/crawl.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKFLOW = readFileSync(join(ROOT, ".github/workflows/quality.yml"), "utf8");

test("Browser template QA isolates the preview from runner process cleanup", () => {
  const qaStep = WORKFLOW.match(/- name: Browser template QA\n[ ]{8}run: \|\n([\s\S]*?)(?=\n[ ]{6}- name: Stop built preview)/)?.[1] ?? "";

  assert.match(qaStep, /setsid bash -c 'unset RUNNER_TRACKING_ID; exec node \.\/node_modules\/vite\/bin\/vite\.js preview/);
  assert.match(qaStep, /npm run qa:template http:\/\/127\.0\.0\.1:8081\/themes\/preview\?theme=editorial/);
  assert.match(qaStep, /Browser QA failed — preview log follows/);
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
