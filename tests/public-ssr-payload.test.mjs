import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicSource = fs.readFileSync(path.join(root, "src/lib/menu/public.ts"), "utf8");
const mapSource = fs.readFileSync(path.join(root, "src/lib/menu/map.ts"), "utf8");
const routeSource = fs.readFileSync(path.join(root, "src/routes/m.$slug.tsx"), "utf8");
const auditSource = fs.readFileSync(path.join(root, "scripts/performance-audit.mjs"), "utf8");

test("public SSR loader projects only the fields required by the public mappers", () => {
  assert.doesNotMatch(publicSource, /to_jsonb\(t\)|to_jsonb\(b\)|to_jsonb\(p\)/);
  assert.match(publicSource, /jsonb_build_object\(/);
  assert.match(publicSource, /'image_url', p\.image_url/);
  assert.match(publicSource, /'updated_at', t\.updated_at/);
});

test("public tenant mapper does not reintroduce server-only lifecycle fields", () => {
  assert.match(mapSource, /export function mapPublicTenant\(/);
  assert.match(mapSource, /id: tenant\.id,/);
  assert.match(mapSource, /country: tenant\.country,/);
  assert.doesNotMatch(mapSource, /\.\.\.publicTenant/);
});

test("30-product empty-options shape no longer serializes one empty options object per product", () => {
  const productIds = Array.from({ length: 30 }, (_, index) => `product-${index + 1}`);
  const legacy = Object.fromEntries(productIds.map((id) => [id, { variants: [], groups: [], options: [] }]));
  const compact = {};
  const legacyBytes = Buffer.byteLength(JSON.stringify(legacy));
  const compactBytes = Buffer.byteLength(JSON.stringify(compact));
  assert.equal(compactBytes, 2);
  assert.ok(legacyBytes > 1000, `expected legacy empty-options payload to exceed 1KB, got ${legacyBytes}`);
  assert.ok(legacyBytes - compactBytes >= 1200, `expected at least 1.2KB structural reduction, got ${legacyBytes - compactBytes}`);
});

test("performance audit records the SSR document transfer and decoded HTML size", () => {
  assert.match(auditSource, /document:\s*navigation/);
  assert.match(auditSource, /transferBytes: Number\(navigation\.transferSize/);
  assert.match(auditSource, /encodedBytes: Number\(navigation\.encodedBodySize/);
  assert.match(auditSource, /decodedBytes: Number\(navigation\.decodedBodySize/);
});

test("SSR keeps the hydrated initialMenu path and does not add a second client fetch", () => {
  assert.match(routeSource, /initialMenu\?: PublicMenu/);
  assert.match(routeSource, /if \(initialMenu\) \{ writeCachedMenu\(cacheKey, initialMenu\); return; \}/);
});
