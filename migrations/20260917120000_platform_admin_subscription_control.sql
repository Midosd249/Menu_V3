-- PH-04: Platform Admin Subscription & Account Control
-- Server-side admin operations only; no direct client grants.
SET search_path = menu_v3, public;

ALTER TABLE menu_v3.tenants
  ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'active';

ALTER TABLE menu_v3.tenants
  DROP CONSTRAINT IF EXISTS tenants_account_status_ck;

ALTER TABLE menu_v3.tenants
  ADD CONSTRAINT tenants_account_status_ck
  CHECK (account_status IN ('active', 'frozen', 'blocked'));

CREATE TABLE IF NOT EXISTS menu_v3.platform_subscription_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id TEXT NOT NULL REFERENCES menu_v3."user"(id),
  tenant_id TEXT NOT NULL REFERENCES menu_v3.tenants(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('set_plan','extend_trial','end_trial','freeze_account','unfreeze_account','set_subscription_status')),
  before_state JSONB NOT NULL,
  after_state JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_subscription_audit_tenant_created
  ON menu_v3.platform_subscription_audit(tenant_id, created_at DESC);

ALTER TABLE menu_v3.platform_subscription_audit ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION menu_v3.admin_control_subscription(
  p_actor_user_id TEXT,
  p_tenant_id TEXT,
  p_action TEXT,
  p_plan_code TEXT DEFAULT NULL,
  p_trial_extension_days INTEGER DEFAULT NULL,
  p_subscription_status TEXT DEFAULT NULL
)
RETURNS TABLE (
  tenant_id TEXT,
  owner_user_id TEXT,
  customer_name TEXT,
  customer_email TEXT,
  phone TEXT,
  tenant_name TEXT,
  plan_code TEXT,
  plan_name_ar TEXT,
  monthly_price_sar NUMERIC,
  status TEXT,
  trial_ends_at TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  account_status TEXT,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = menu_v3, pg_catalog, pg_temp
AS $$
DECLARE
  v_before JSONB;
  v_after JSONB;
  v_plan_id UUID;
  v_actor_is_admin BOOLEAN;
  v_account_status TEXT;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM menu_v3.platform_admins pa
    WHERE pa.user_id = p_actor_user_id
  ) INTO v_actor_is_admin;
  IF NOT v_actor_is_admin THEN RAISE EXCEPTION 'PLATFORM_ADMIN_REQUIRED'; END IF;

  IF p_action NOT IN ('set_plan','extend_trial','end_trial','freeze_account','unfreeze_account','set_subscription_status') THEN
    RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_INVALID_ACTION';
  END IF;

  SELECT t.account_status INTO v_account_status
  FROM menu_v3.tenants t
  WHERE t.id = p_tenant_id
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_TENANT_NOT_FOUND'; END IF;

  PERFORM 1 FROM menu_v3.tenant_subscriptions ts WHERE ts.tenant_id = p_tenant_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_NOT_FOUND'; END IF;

  SELECT jsonb_build_object(
    'planCode', sp.code,
    'status', ts.status,
    'trialEndsAt', ts.trial_ends_at,
    'currentPeriodEnd', ts.current_period_end,
    'accountStatus', t.account_status,
    'isActive', t.is_active
  ) INTO v_before
  FROM menu_v3.tenant_subscriptions ts
  JOIN menu_v3.subscription_plans sp ON sp.id = ts.plan_id
  JOIN menu_v3.tenants t ON t.id = ts.tenant_id
  WHERE ts.tenant_id = p_tenant_id;

  IF p_action = 'set_plan' THEN
    SELECT id INTO v_plan_id FROM menu_v3.subscription_plans
    WHERE code = p_plan_code AND is_active = true LIMIT 1;
    IF v_plan_id IS NULL THEN RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_INVALID_PLAN'; END IF;
    UPDATE menu_v3.tenant_subscriptions
      SET plan_id = v_plan_id, updated_at = now()
    WHERE tenant_id = p_tenant_id;
  ELSIF p_action = 'extend_trial' THEN
    IF p_trial_extension_days IS NULL OR p_trial_extension_days < 1 OR p_trial_extension_days > 30 THEN
      RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_INVALID_TRIAL_EXTENSION';
    END IF;
    UPDATE menu_v3.tenant_subscriptions
      SET trial_ends_at = GREATEST(COALESCE(trial_ends_at, now()), now()) + make_interval(days => p_trial_extension_days),
          status = 'trialing', updated_at = now()
    WHERE tenant_id = p_tenant_id AND status = 'trialing';
    IF NOT FOUND THEN RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_TRIAL_NOT_ACTIVE'; END IF;
  ELSIF p_action = 'end_trial' THEN
    UPDATE menu_v3.tenant_subscriptions
      SET trial_ends_at = now(), status = 'cancelled', updated_at = now()
    WHERE tenant_id = p_tenant_id AND status = 'trialing';
    IF NOT FOUND THEN RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_TRIAL_NOT_ACTIVE'; END IF;
  ELSIF p_action = 'freeze_account' THEN
    IF v_account_status = 'blocked' THEN RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_ACCOUNT_BLOCKED'; END IF;
    UPDATE menu_v3.tenants
      SET account_status = 'frozen', is_active = false, updated_at = now()
    WHERE id = p_tenant_id AND account_status IN ('active', 'frozen');
  ELSIF p_action = 'unfreeze_account' THEN
    IF v_account_status = 'blocked' THEN RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_ACCOUNT_BLOCKED'; END IF;
    UPDATE menu_v3.tenants
      SET account_status = 'active', is_active = true, updated_at = now()
    WHERE id = p_tenant_id AND account_status = 'frozen';
    IF NOT FOUND AND v_account_status <> 'active' THEN RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_ACCOUNT_NOT_FROZEN'; END IF;
  ELSIF p_action = 'set_subscription_status' THEN
    IF p_subscription_status NOT IN ('trialing','active','past_due','cancelled') THEN
      RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_INVALID_STATUS';
    END IF;
    IF p_subscription_status = 'trialing' AND NOT EXISTS (
      SELECT 1 FROM menu_v3.tenant_subscriptions WHERE tenant_id = p_tenant_id AND trial_ends_at > now()
    ) THEN
      RAISE EXCEPTION 'ADMIN_SUBSCRIPTION_TRIAL_END_REQUIRED';
    END IF;
    UPDATE menu_v3.tenant_subscriptions
      SET status = p_subscription_status, updated_at = now()
    WHERE tenant_id = p_tenant_id;
  END IF;

  SELECT jsonb_build_object(
    'planCode', sp.code,
    'status', ts.status,
    'trialEndsAt', ts.trial_ends_at,
    'currentPeriodEnd', ts.current_period_end,
    'accountStatus', t.account_status,
    'isActive', t.is_active
  ) INTO v_after
  FROM menu_v3.tenant_subscriptions ts
  JOIN menu_v3.subscription_plans sp ON sp.id = ts.plan_id
  JOIN menu_v3.tenants t ON t.id = ts.tenant_id
  WHERE ts.tenant_id = p_tenant_id;

  INSERT INTO menu_v3.platform_subscription_audit(actor_user_id, tenant_id, action, before_state, after_state)
  VALUES (p_actor_user_id, p_tenant_id, p_action, v_before, v_after);

  RETURN QUERY
  SELECT t.id, t.owner_user_id, COALESCE(u.name, ''), COALESCE(u.email, ''), COALESCE(u."phoneNumber", ''),
    t.name_ar, sp.code, sp.name_ar, sp.monthly_price_sar, ts.status, ts.trial_ends_at,
    ts.current_period_end, t.account_status, GREATEST(t.updated_at, ts.updated_at)
  FROM menu_v3.tenants t
  JOIN menu_v3.tenant_subscriptions ts ON ts.tenant_id = t.id
  JOIN menu_v3.subscription_plans sp ON sp.id = ts.plan_id
  LEFT JOIN menu_v3."user" u ON u.id = t.owner_user_id
  WHERE t.id = p_tenant_id;
END;
$$;

REVOKE ALL ON FUNCTION menu_v3.admin_control_subscription(TEXT,TEXT,TEXT,TEXT,INTEGER,TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION menu_v3.admin_control_subscription(TEXT,TEXT,TEXT,TEXT,INTEGER,TEXT) TO postgres;
