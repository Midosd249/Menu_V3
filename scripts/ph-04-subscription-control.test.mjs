import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync("migrations/20260917120000_platform_admin_subscription_control.sql", "utf8");
const server = readFileSync("src/lib/menu/admin-subscriptions.ts", "utf8");
const ui = readFileSync("src/components/admin-subscription-control.tsx", "utf8");
const route = readFileSync("src/routes/admin/$workspace.tsx", "utf8");
const plan = readFileSync("docs/PH_SELF_SERVE_CUSTOMER_LIFECYCLE_PLAN.md", "utf8");

test("PH-04 mutation is server-authorized and database-authoritative", () => {
  assert.match(server, /authMiddleware/);
  assert.match(server, /requirePlatformAdmin\(userId\)/);
  assert.match(server, /context\.userId/);
  assert.match(server, /admin_control_subscription/);
  assert.match(migration, /SECURITY DEFINER/);
  assert.match(migration, /SET search_path = menu_v3, pg_catalog, pg_temp/);
  assert.match(migration, /REVOKE ALL ON FUNCTION/);
  assert.match(migration, /GRANT EXECUTE ON FUNCTION .* TO postgres/);
});

test("PH-04 keeps account and subscription states separate", () => {
  assert.match(migration, /account_status TEXT NOT NULL DEFAULT 'active'/);
  assert.match(migration, /account_status IN \('active', 'frozen', 'blocked'\)/);
  assert.match(migration, /status.*IN \('trialing','active','past_due','cancelled'\)/s);
  assert.match(migration, /freeze_account/);
  assert.match(migration, /unfreeze_account/);
  assert.match(migration, /v_account_status = 'blocked'/);
  assert.match(migration, /account_status = 'frozen'/);
});

test("PH-04 trial controls are bounded and state-aware", () => {
  assert.match(server, /days: z\.number\(\)\.int\(\)\.min\(1\)\.max\(30\)/);
  assert.match(migration, /p_trial_extension_days < 1 OR p_trial_extension_days > 30/);
  assert.match(migration, /status = 'trialing'/);
  assert.match(migration, /ADMIN_SUBSCRIPTION_TRIAL_NOT_ACTIVE/);
  assert.match(migration, /trial_ends_at = now\(\), status = 'cancelled'/);
});

test("PH-04 every successful mutation records before and after state", () => {
  assert.match(migration, /platform_subscription_audit/);
  assert.match(migration, /before_state JSONB NOT NULL/);
  assert.match(migration, /after_state JSONB NOT NULL/);
  assert.match(migration, /actor_user_id TEXT NOT NULL/);
  assert.match(migration, /INSERT INTO menu_v3\.platform_subscription_audit/);
  assert.match(migration, /p_actor_user_id, p_tenant_id, p_action, v_before, v_after/);
});

test("PH-04 UI exposes the existing subscription workspace without duplicating the Admin shell", () => {
  assert.match(route, /workspace === "subscriptions"/);
  assert.match(route, /AdminSubscriptionControl/);
  assert.match(ui, /getAdminSubscriptions/);
  assert.match(ui, /updateAdminSubscription/);
  assert.match(ui, /تجميد الحساب/);
  assert.match(ui, /إلغاء التجميد/);
  assert.match(ui, /تمديد 7 أيام/);
  assert.match(ui, /إنهاء التجربة/);
});

test("PH continuity records PH-04 as the only active phase and PH-05 as not started", () => {
  assert.match(plan, /PH-04 — Platform Admin Subscription & Account Control/);
  assert.match(plan, /\*\*Status: `IN_PROGRESS`\*\*/);
  assert.match(plan, /PH-05.*TODO \/ NOT STARTED/s);
  assert.match(plan, /only active PH milestone/s);
});
