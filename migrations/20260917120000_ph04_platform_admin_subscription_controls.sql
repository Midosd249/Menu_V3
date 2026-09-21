-- PH-04 — Platform Admin Subscription & Account Control
-- Server-authorized administrative mutations only. No client role receives direct write access.
SET search_path = menu_v3, public;

ALTER TABLE menu_v3.tenant_subscriptions
  DROP CONSTRAINT IF EXISTS tenant_subscriptions_status_check;

ALTER TABLE menu_v3.tenant_subscriptions
  ADD CONSTRAINT tenant_subscriptions_status_check
  CHECK (status IN ('trialing','active','past_due','cancelled','suspended'));

CREATE TABLE IF NOT EXISTS menu_v3.platform_admin_subscription_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id TEXT NOT NULL,
  target_user_id TEXT,
  tenant_id TEXT REFERENCES menu_v3.tenants(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN (
    'plan_changed',
    'trial_extended',
    'trial_ended',
    'subscription_status_changed',
    'account_frozen',
    'account_unfrozen'
  )),
  reason TEXT,
  before_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  after_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_admin_subscription_audit_tenant_created
  ON menu_v3.platform_admin_subscription_audit (tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_admin_subscription_audit_target_created
  ON menu_v3.platform_admin_subscription_audit (target_user_id, created_at DESC);

ALTER TABLE menu_v3.platform_admin_subscription_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON menu_v3.platform_admin_subscription_audit FROM anon, authenticated;
