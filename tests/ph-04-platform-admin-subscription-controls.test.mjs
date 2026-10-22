import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync("migrations/20260917120000_ph04_platform_admin_subscription_controls.sql", "utf8");
const server = readFileSync("src/lib/menu/platform-subscriptions.ts", "utf8");
const expiryMigration = readFileSync("migrations/20261022090000_enforce_trial_expiry_and_atomic_entitlement.sql", "utf8");
const users = readFileSync("src/routes/admin/users.tsx", "utf8");


test("PH-04 migration keeps administrative audit data server-only", () => {
  assert.match(migration, /platform_admin_subscription_audit/);
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /REVOKE ALL ON menu_v3\.platform_admin_subscription_audit FROM anon, authenticated/);
  assert.match(migration, /before_state JSONB/);
  assert.match(migration, /after_state JSONB/);
});

test("PH-04 subscription states include suspended without weakening the existing states", () => {
  assert.match(migration, /CHECK \(status IN \('trialing','active','past_due','cancelled','suspended'\)\)/);
  assert.match(server, /z\.enum\(\["active", "trialing", "past_due", "cancelled", "suspended"\]\)/);
});

test("PH-04 administrative mutations require authenticated Platform Owner authorization", () => {
  for (const fn of [
    "changePlatformSubscriptionPlan",
    "managePlatformTrial",
    "setPlatformSubscriptionStatus",
    "setPlatformAccountFrozen",
  ]) {
    assert.match(server, new RegExp(`export const ${fn}`));
  }
  assert.match(server, /middleware\(\[authMiddleware\]\)/);
  assert.match(server, /requirePlatformAdmin\(userId\)/);
});

test("PH-04 plan changes validate active plans and current usage before mutation", () => {
  assert.match(server, /is_active = true/);
  assert.match(server, /before\.branchCount > Number\(plan\.max_branches\)/);
  assert.match(server, /before\.productCount > Number\(plan\.max_products\)/);
  assert.match(server, /before\.teamMemberCount > Number\(plan\.max_team_members\)/);
  assert.match(server, /action: "plan_changed"/);
});

test("PH-04 trial control refuses free-plan trials and rejects past trial dates", () => {
  assert.match(server, /before\.planCode === "free"/);
  assert.match(server, /end\.getTime\(\) <= Date\.now\(\)/);
  assert.match(server, /action: data\.action === "extend" \? "trial_extended" : "trial_ended"/);
});

test("PH-04 account freeze revokes sessions and records an audit event", () => {
  assert.match(server, /delete from "session" where "userId"/);
  assert.match(server, /action: data\.frozen \? "account_frozen" : "account_unfrozen"/);
  assert.match(users, /toggleAccountFreeze/);
});

test("PH-04 Admin UI exposes plan, trial, status, freeze, and audit controls", () => {
  assert.match(users, /changePlatformSubscriptionPlan/);
  assert.match(users, /managePlatformTrial/);
  assert.match(users, /setPlatformSubscriptionStatus/);
  assert.match(users, /setPlatformAccountFrozen/);
  assert.match(users, /getPlatformSubscriptionAudit/);
  assert.match(users, /تغيير الخطة|Plan/);
  assert.match(users, /تمديد التجربة|Extend trial/);
  assert.match(users, /سجل التدقيق|Audit log/);
});


test("expired trials are downgraded before the database checks write entitlements", () => {
  const expiryGuard = expiryMigration.indexOf("IF subscription_status = 'trialing'");
  const statusGuard = expiryMigration.indexOf("IF subscription_status IS NULL OR subscription_status NOT IN ('trialing', 'active')");
  assert.ok(expiryGuard >= 0 && statusGuard > expiryGuard, "trial expiry must run before the generic status check");
  assert.match(expiryMigration, /trial_ends_at <= now\(\)/);
  assert.ok(expiryMigration.includes("trial_ends_at IS NULL OR trial_ends_at <= now()"));
  assert.match(expiryMigration, /WHERE tenant_id = NEW\\.tenant_id[\\s\\S]*AND status = 'trialing'[\\s\\S]*AND \\(trial_ends_at IS NULL OR trial_ends_at <= now\\(\\)\\);/);
  assert.match(expiryMigration, /SET plan_id = free_plan_id,[\s\S]*status = 'active',[\s\S]*trial_ends_at = NULL,[\s\S]*billing_interval = 'monthly'/);
  assert.match(expiryMigration, /Pro is the only plan with unlimited products/);
  assert.match(expiryMigration, /REVOKE ALL ON FUNCTION menu_v3\.enforce_subscription_entitlement\(\) FROM PUBLIC, anon, authenticated/);
  assert.match(expiryMigration, /GRANT EXECUTE ON FUNCTION menu_v3\.enforce_subscription_entitlement\(\) TO postgres/);
  assert.match(expiryMigration, /DROP CONSTRAINT IF EXISTS platform_admin_subscription_audit_action_check/);
  assert.match(expiryMigration, /'billing_interval_changed'/);
});

test("Platform Owner mutations commit the state change and audit event atomically", () => {
  for (const fn of [
    "changePlatformSubscriptionPlan",
    "setPlatformBillingInterval",
    "managePlatformTrial",
    "setPlatformSubscriptionStatus",
    "setPlatformAccountFrozen",
  ]) {
    const start = server.indexOf("export const " + fn + " =");
    assert.ok(start >= 0, "missing " + fn);
    const next = server.indexOf("\nexport const ", start + 1);
    const body = server.slice(start, next < 0 ? server.length : next);
    assert.match(body, /sql\.transaction\(async \(tx\) =>/);
    assert.match(body, /writeAudit\(tx,/);
    if (fn !== "setPlatformAccountFrozen") assert.match(body, /lockSubscription\(tx, data\.tenantId\)/);
  }
});
