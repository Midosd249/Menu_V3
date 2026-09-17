-- PH-06: commercial catalog reconciliation and annual billing foundation.
-- No payment provider, automatic charging, webhook, or payment-success inference is introduced.
SET search_path = menu_v3, public;

ALTER TABLE menu_v3.subscription_plans
  ADD COLUMN IF NOT EXISTS annual_price_sar NUMERIC(10,2);

UPDATE menu_v3.subscription_plans
SET annual_price_sar = CASE code
  WHEN 'free' THEN 0
  WHEN 'starter' THEN 490
  WHEN 'pro' THEN 1490
  ELSE annual_price_sar
END,
monthly_price_sar = CASE code
  WHEN 'free' THEN 0
  WHEN 'starter' THEN 49
  WHEN 'pro' THEN 149
  ELSE monthly_price_sar
END,
updated_at = now()
WHERE code IN ('free', 'starter', 'pro');

ALTER TABLE menu_v3.subscription_plans
  ALTER COLUMN annual_price_sar SET NOT NULL;

ALTER TABLE menu_v3.tenant_subscriptions
  ALTER COLUMN status SET DEFAULT 'active';

ALTER TABLE menu_v3.tenant_subscriptions
  ADD COLUMN IF NOT EXISTS billing_interval TEXT NOT NULL DEFAULT 'monthly'
  CHECK (billing_interval IN ('monthly', 'annual'));

UPDATE menu_v3.tenant_subscriptions ts
SET status = 'active',
    trial_ends_at = NULL,
    billing_interval = 'monthly',
    updated_at = now()
FROM menu_v3.subscription_plans sp
WHERE sp.id = ts.plan_id
  AND sp.code = 'free'
  AND (ts.status = 'trialing' OR ts.trial_ends_at IS NOT NULL);

ALTER TABLE menu_v3.subscription_invoices
  ADD COLUMN IF NOT EXISTS billing_interval TEXT NOT NULL DEFAULT 'monthly'
  CHECK (billing_interval IN ('monthly', 'annual'));

-- Existing invoices are historical monthly snapshots. Their amount is intentionally untouched.

CREATE OR REPLACE FUNCTION menu_v3.ensure_default_tenant_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = menu_v3, pg_catalog
AS $$
BEGIN
  INSERT INTO menu_v3.tenant_subscriptions (tenant_id, plan_id, status, trial_ends_at, billing_interval)
  SELECT NEW.id, p.id, 'active', NULL, 'monthly'
  FROM menu_v3.subscription_plans p
  WHERE p.code = 'free' AND p.is_active = true
  ON CONFLICT (tenant_id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION menu_v3.ensure_default_tenant_subscription() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION menu_v3.ensure_default_tenant_subscription() TO postgres;

-- Paid plan selection starts the approved 14-day trial at the database trust boundary.
CREATE OR REPLACE FUNCTION menu_v3.enforce_paid_plan_trial_on_selection()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = menu_v3, pg_catalog
AS $$
DECLARE
  old_code text;
  new_code text;
BEGIN
  SELECT code INTO old_code FROM menu_v3.subscription_plans WHERE id = OLD.plan_id;
  SELECT code INTO new_code FROM menu_v3.subscription_plans WHERE id = NEW.plan_id;

  IF new_code = 'free' THEN
    NEW.status := 'active';
    NEW.trial_ends_at := NULL;
    NEW.billing_interval := 'monthly';
  ELSIF old_code = 'free' AND new_code <> 'free' THEN
    NEW.status := 'trialing';
    NEW.trial_ends_at := now() + interval '14 days';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION menu_v3.enforce_paid_plan_trial_on_selection() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION menu_v3.enforce_paid_plan_trial_on_selection() TO postgres;

DROP TRIGGER IF EXISTS trg_ph06_paid_plan_trial ON menu_v3.tenant_subscriptions;
CREATE TRIGGER trg_ph06_paid_plan_trial
BEFORE UPDATE OF plan_id ON menu_v3.tenant_subscriptions
FOR EACH ROW
EXECUTE FUNCTION menu_v3.enforce_paid_plan_trial_on_selection();

-- Keep the database entitlement boundary server-authoritative and make the paid Pro product limit effectively unlimited.
CREATE OR REPLACE FUNCTION menu_v3.enforce_subscription_entitlement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = menu_v3, pg_catalog
AS $$
DECLARE
  max_allowed integer;
  current_count integer;
  subscription_status text;
  resource text;
BEGIN
  SELECT ts.status,
         CASE TG_TABLE_NAME
           WHEN 'branches' THEN sp.max_branches
           WHEN 'products' THEN sp.max_products
           WHEN 'tenant_members' THEN sp.max_team_members
         END
    INTO subscription_status, max_allowed
  FROM menu_v3.tenant_subscriptions ts
  JOIN menu_v3.subscription_plans sp ON sp.id = ts.plan_id
  WHERE ts.tenant_id = NEW.tenant_id
    AND sp.is_active = true
  FOR UPDATE OF ts;

  IF subscription_status IS NULL OR subscription_status NOT IN ('trialing', 'active') THEN
    RAISE EXCEPTION 'SUBSCRIPTION_REQUIRED' USING ERRCODE = 'P0001';
  END IF;

  resource := CASE TG_TABLE_NAME
    WHEN 'branches' THEN 'branches'
    WHEN 'products' THEN 'products'
    WHEN 'tenant_members' THEN 'team_members'
  END;

  IF TG_TABLE_NAME = 'branches' THEN
    IF TG_OP = 'INSERT' AND COALESCE(NEW.is_active, true) THEN
      SELECT count(*)::integer INTO current_count FROM menu_v3.branches WHERE tenant_id = NEW.tenant_id AND is_active = true;
    ELSIF TG_OP = 'UPDATE' AND COALESCE(NEW.is_active, true) AND COALESCE(OLD.is_active, false) = false THEN
      SELECT count(*)::integer INTO current_count FROM menu_v3.branches WHERE tenant_id = NEW.tenant_id AND is_active = true;
    ELSE
      RETURN NEW;
    END IF;
  ELSIF TG_TABLE_NAME = 'products' THEN
    IF TG_OP = 'INSERT' THEN
      SELECT count(*)::integer INTO current_count FROM menu_v3.products WHERE tenant_id = NEW.tenant_id;
    ELSE
      RETURN NEW;
    END IF;
  ELSIF TG_TABLE_NAME = 'tenant_members' THEN
    IF TG_OP = 'INSERT' AND COALESCE(NEW.is_active, true) THEN
      SELECT count(*)::integer INTO current_count FROM menu_v3.tenant_members WHERE tenant_id = NEW.tenant_id AND is_active = true;
    ELSIF TG_OP = 'UPDATE' AND COALESCE(NEW.is_active, true) AND COALESCE(OLD.is_active, false) = false THEN
      SELECT count(*)::integer INTO current_count FROM menu_v3.tenant_members WHERE tenant_id = NEW.tenant_id AND is_active = true;
    ELSE
      RETURN NEW;
    END IF;
  ELSE
    RETURN NEW;
  END IF;

  -- Pro is the only plan with unlimited products. Other resources remain bounded by the catalog.
  IF TG_TABLE_NAME = 'products' AND EXISTS (
    SELECT 1
    FROM menu_v3.tenant_subscriptions ts
    JOIN menu_v3.subscription_plans sp ON sp.id = ts.plan_id
    WHERE ts.tenant_id = NEW.tenant_id AND sp.code = 'pro' AND sp.is_active = true
  ) THEN
    RETURN NEW;
  END IF;

  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'PLAN_LIMIT:%:%:%', resource, current_count, max_allowed USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION menu_v3.enforce_subscription_entitlement() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION menu_v3.enforce_subscription_entitlement() TO postgres;

-- Server/provider boundary: no client grants, checkout state, provider callbacks, or payment-success state are introduced here.
