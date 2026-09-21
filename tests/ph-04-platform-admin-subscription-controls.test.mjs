import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync("migrations/20260917120000_ph04_platform_admin_subscription_controls.sql", "utf8");
const server = readFileSync("src/lib/menu/platform-subscriptions.ts", "utf8");
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
