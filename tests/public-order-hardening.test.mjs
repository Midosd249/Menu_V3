import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const orderSource = await readFile("src/lib/menu/order-public.ts", "utf8");
const abuseMigration = await readFile("migrations/20260909001000_public_order_abuse_controls.sql", "utf8");
const rpcMigration = await readFile("migrations/20260909002000_reconcile_legacy_security_definer_rpc_grants.sql", "utf8");

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
