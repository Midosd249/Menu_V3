import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const ownerSource = readFileSync(join(here, "owner.ts"), "utf8");
const publicSource = readFileSync(join(here, "public.ts"), "utf8");

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
    /select id from tenants where slug = \$\{data\.slug\} and is_active = true and is_published = true limit 1/,
  );
});
