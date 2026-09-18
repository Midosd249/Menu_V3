import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const ownerSource = readFileSync(join(here, "owner.ts"), "utf8");
const publicSource = readFileSync(join(here, "public.ts"), "utf8");
const typesSource = readFileSync(join(here, "types.ts"), "utf8");
const disclosureMigration = readFileSync(join(here, "../../../migrations/20260913001000_saudifood_disclosure.sql"), "utf8");
const journeyMigration = readFileSync(join(here, "../../../migrations/20260918010000_journey_event_instrumentation.sql"), "utf8");
const publicMenuSource = readFileSync(join(here, "../../components/public-menu.tsx"), "utf8");
const tasteSource = readFileSync(join(here, "../../components/templates/taste.tsx"), "utf8");
const contemporarySource = readFileSync(join(here, "../../components/templates/contemporary-restaurant.tsx"), "utf8");
const specialtySource = readFileSync(join(here, "../../components/templates/specialty-cafe.tsx"), "utf8");
const fastCasualSource = readFileSync(join(here, "../../components/templates/fast-casual.tsx"), "utf8");

test("owner analytics accepts only the supported 7/30 day ranges", () => {
  assert.match(
    ownerSource,
    /validator\(z\.object\(\{ days: z\.union\(\[z\.literal\(7\), z\.literal\(30\)\]\)\.optional\(\) \}\)\)/,
  );
  assert.match(ownerSource, /const days = data\.days === 30 \? 30 : 7;/);
});

test("owner analytics keeps every aggregation tenant-scoped", () => {
  const analytics = ownerSource.slice(ownerSource.indexOf("export const getOwnerAnalytics"));
  assert.equal((analytics.match(/from menu_events/g) ?? []).length, 5, "expected all menu_events aggregations");
  assert.match(analytics, /from menu_events\s+where tenant_id = \$\{member\.tenant_id\} and created_at >= \$\{since\}/);
  assert.match(analytics, /from menu_events e\s+join products p on p\.id = e\.product_id\s+where e\.tenant_id = \$\{member\.tenant_id\}/);
  assert.match(analytics, /join categories c on c\.id = p\.category_id\s+where e\.tenant_id = \$\{member\.tenant_id\}/);
  assert.match(analytics, /join branches b on b\.id = e\.branch_id\s+where e\.tenant_id = \$\{member\.tenant_id\}/);
  assert.match(analytics, /and e\.event_type in \('visit', 'qr_scan'\)/);
});

test("public product views reject missing or cross-tenant products", () => {
  assert.match(publicSource, /if \(data\.eventType === "product_view"\)/);
  assert.match(publicSource, /if \(!data\.productId\) return \{ ok: false, code: "invalid"/);
  assert.match(
    publicSource,
    /select id from products where id = \$\{data\.productId\} and tenant_id = \$\{tenantId\} limit 1/,
  );
  assert.match(publicSource, /if \(!p\[0\]\) return \{ ok: false, code: "invalid"/);
});

test("public visit and QR events retain the 30-minute duplicate suppression", () => {
  assert.match(publicSource, /data\.eventType === "visit" \|\| data\.eventType === "qr_scan"/);
  assert.match(
    publicSource,
    /where tenant_id = \$\{tenantId\} and session_id = \$\{data\.sessionId\} and event_type = \$\{data\.eventType\} and created_at > now\(\) - interval '30 minutes'/,
  );
  assert.match(publicSource, /if \(recent\[0\]\) return \{ ok: true, data: \{ recorded: false \} \};/);
});

test("public events resolve the tenant from the published active slug", () => {
  assert.match(
    publicSource,
    /select id, whatsapp from tenants where slug = \$\{data\.slug\} and is_active = true and is_published = true limit 1/,
  );
});

test("Saudi disclosure keeps nutrition values nullable and derives high salt from sodium", () => {
  assert.match(typesSource, /sodiumMg\?: number \| null/);
  assert.match(typesSource, /caffeineMg\?: number \| null/);
  assert.match(typesSource, /product\.sodiumMg >= 2000/);
  assert.match(disclosureMigration, /add column if not exists sodium_mg/);
  assert.match(disclosureMigration, /add column if not exists caffeine_mg/);
  assert.match(disclosureMigration, /caffeine_basis in \('per_100ml', 'per_cup'\)/);
});


test("A.2 canonical public events include search, category selection, and add-to-cart", () => {
  assert.match(typesSource, /EventType = .*search.*category_view.*add_to_cart/);
  assert.match(publicSource, /eventType: z\.enum\(\["visit", "product_view", "qr_scan", "whatsapp", "search", "category_view", "add_to_cart"\]\)/);
  assert.match(publicSource, /categoryId: z\.string\(\)\.max\(80\)\.optional\(\)/);
  assert.match(publicSource, /eventType === "product_view" \|\| data\.eventType === "add_to_cart"/);
  assert.match(publicSource, /eventType === "category_view"/);
  assert.match(publicSource, /and tenant_id = \$\{tenantId\} and is_active = true limit 1/);
  assert.match(publicSource, /eventType === "visit" \|\| data\.eventType === "qr_scan" \|\| data\.eventType === "search"/);
  assert.match(publicSource, /category_id, event_type/);
});

test("A.2 migration extends menu_events without replacing the canonical stream", () => {
  assert.match(journeyMigration, /add column if not exists category_id text references categories\(id\) on delete set null/);
  assert.match(journeyMigration, /drop constraint if exists menu_events_type_ck/);
  assert.match(journeyMigration, /'search'/);
  assert.match(journeyMigration, /'category_view'/);
  assert.match(journeyMigration, /'add_to_cart'/);
  assert.match(journeyMigration, /menu_events_category_idx/);
});


test("A.2 public renderers emit the new journey events", () => {
  for (const source of [publicMenuSource, tasteSource, contemporarySource, specialtySource, fastCasualSource]) {
    assert.match(source, /eventType: "search"/);
    assert.match(source, /eventType: "category_view"/);
    assert.match(source, /eventType: "add_to_cart"/);
  }
  assert.match(publicMenuSource, /categoryId: nextCategoryId/);
  assert.match(publicMenuSource, /productId: item\.product\.id/);
});
