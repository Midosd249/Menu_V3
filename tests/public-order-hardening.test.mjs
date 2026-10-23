import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const orderSource = await readFile("src/lib/menu/order-public.ts", "utf8");
const tableQrSource = await readFile("src/lib/menu/table-qr.ts", "utf8");
const publicMenuRouteSource = await readFile("src/routes/m.$slug.tsx", "utf8");
const publicBranchRouteSource = await readFile("src/routes/m.$slug.$branch.tsx", "utf8");
const abuseMigration = await readFile("migrations/20260909001000_public_order_abuse_controls.sql", "utf8");
const layeredAbuseMigration = await readFile("migrations/20261002090000_layered_public_order_abuse_controls.sql", "utf8");
const correctiveRlsMigration = await readFile("migrations/20261020080000_reconcile_public_order_invalid_rate_limits_rls.sql", "utf8");
const rpcMigration = await readFile("migrations/20260909002000_reconcile_legacy_security_definer_rpc_grants.sql", "utf8");
const attributionMigration = await readFile("migrations/20260918020000_anonymous_session_order_attribution.sql", "utf8");

test("public orders enforce a bounded database-backed rate limit", () => {
  assert.match(orderSource, /public_order_rate_limits/);
  assert.match(orderSource, /request_count/);
  assert.match(orderSource, /600000/);
  assert.match(orderSource, /> 6/);
  assert.match(abuseMigration, /primary key \(tenant_id, branch_id, client_token, window_start\)/);
});

test("public order fingerprinting is deterministic and browser-safe", () => {
  assert.doesNotMatch(orderSource, /node:crypto/);
  assert.doesNotMatch(orderSource, /crypto\.subtle\.digest/);
  assert.match(orderSource, /stableDigest/);
  assert.match(orderSource, /orderFingerprint/);
  assert.match(orderSource, /orderRateKey/);
  assert.match(orderSource, /public_order_idempotency/);
  assert.match(orderSource, /on conflict \(tenant_id, branch_id, client_token, idempotency_key\) do nothing/);
});

test("legacy security-definer RPCs are not executable by public client roles", () => {
  for (const name of [
    "get_public_menu",
    "record_public_menu_event",
    "submit_service_request",
    "submit_visibility_audit",
    "submit_website_brief",
    "manage_tenant_member_by_email",
  ]) {
    assert.match(rpcMigration, new RegExp(`revoke execute on function public\\.${name}`));
  }
  assert.match(rpcMigration, /set search_path = public, pg_temp/);
});


test("table QR ordering resolves opaque tokens server-side and associates only trusted table IDs", () => {
  assert.match(tableQrSource, /t\\.revoked_at is null/);
  assert.match(tableQrSource, /t\\.expires_at is null or t\\.expires_at > now\\(\\)/);
  assert.match(orderSource, /resolveTableQrToken\\(sql, data\\.tableQrToken\\)/);
  assert.match(orderSource, /tableContext\\.tenantId !== String\\(tenant\\.id\\)/);
  assert.match(orderSource, /tableContext\\.branchId !== String\\(branchId\\)/);
  assert.match(orderSource, /insert into orders \\([^\\n]*table_id/);
  assert.doesNotMatch(orderSource, /tableId:\\s*data\\./);
  assert.match(publicMenuRouteSource, /resolvePublicTableQrContext/);
  assert.match(publicBranchRouteSource, /resolvePublicTableQrContext/);
  assert.match(publicMenuRouteSource, /Referrer-Policy/);
  assert.match(publicBranchRouteSource, /Referrer-Policy/);
});

test("public orders attach only a valid server-controlled tenant session", () => {
  assert.match(orderSource, /resolveAnonymousSession\(sql, String\(tenant\.id\)\)/);
  assert.match(orderSource, /const anonymousSessionId = anonymousSession\.id/);
  assert.match(orderSource, /anonymous_session_id/);
  assert.doesNotMatch(orderSource, /anonymous_session_id.*data\./);
  assert.match(attributionMigration, /foreign key \(tenant_id, anonymous_session_id\)\s+references anonymous_sessions \(tenant_id, id\)/);
});


test("public order reservation and finalization use one transaction", async () => {
  const dbSource = await readFile("src/lib/db.ts", "utf8");
  assert.match(dbSource, /transaction<.*\(callback/);
  assert.match(orderSource, /await sql\.transaction\(/);
  assert.match(orderSource, /insert into public_order_idempotency/);
  assert.match(orderSource, /update public_order_idempotency/);
  assert.match(orderSource, /insert into orders/);
  assert.match(orderSource, /insert into order_items/);
  assert.match(orderSource, /insert into order_status_events/);
});

test("public order abuse protection is layered across server session and trusted request IP", () => {
  assert.match(orderSource, /getRequestHeader\("x-forwarded-for"\)/);
  assert.match(orderSource, /anonymousSession\.id/);
  assert.match(orderSource, /rateIdentityTokens/);
  assert.match(orderSource, /ip:/);
  assert.match(orderSource, /session:/);
  assert.match(orderSource, /public_order_rate_limits/);
});

test("accepted order quota is applied only after business validation", () => {
  const validationIndex = orderSource.indexOf("const prepared: PreparedItem[] = [];");
  const rateIndex = orderSource.indexOf("acceptedRateLimit");
  assert.ok(validationIndex >= 0, "business validation must exist");
  assert.ok(rateIndex > validationIndex, "accepted rate limiting must occur after business validation");
  assert.doesNotMatch(orderSource.slice(0, validationIndex), /insert into public_order_rate_limits/);
});

test("invalid order traffic has a separate throttle", () => {
  assert.match(orderSource, /public_order_invalid_rate_limits/);
  assert.match(orderSource, /recordInvalidAttempt/);
  assert.match(layeredAbuseMigration, /create table if not exists menu_v3\.public_order_invalid_rate_limits/);
});

test("invalid-order rate-limit storage is server-only and protected by RLS", () => {
  assert.match(correctiveRlsMigration, /alter table menu_v3\.public_order_invalid_rate_limits\s+enable row level security/i);
  assert.match(correctiveRlsMigration, /revoke all on table menu_v3\.public_order_invalid_rate_limits\s+from public, anon, authenticated/i);
  assert.doesNotMatch(correctiveRlsMigration, /\bgrant\b/i);
});
