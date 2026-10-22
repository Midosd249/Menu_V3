-- Enforce expired trial expiry at the database write boundary.
-- Preserve Pro's unlimited-product behavior after the expiry check; this migration changes no rows.
SET search_path = menu_v3, pg_catalog;

-- Keep the billing-interval audit event valid so the mutation and audit can commit atomically.
ALTER TABLE menu_v3.platform_admin_subscription_audit
  DROP CONSTRAINT IF EXISTS platform_admin_subscription_audit_action_check;

ALTER TABLE menu_v3.platform_admin_subscription_audit
  ADD CONSTRAINT platform_admin_subscription_audit_action_check
  CHECK (action IN (
    'plan_changed',
    'trial_extended',
    'trial_ended',
    'billing_interval_changed',
    'subscription_status_changed',
    'account_frozen',
    'account_unfrozen'
  ));

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
  trial_ends_at timestamptz;
  free_plan_id menu_v3.subscription_plans.id%TYPE;
  resource text;
BEGIN
  -- Serialize the expiry decision and entitlement check for this tenant.
  SELECT ts.status,
         ts.trial_ends_at,
         CASE TG_TABLE_NAME
           WHEN 'branches' THEN sp.max_branches
           WHEN 'products' THEN sp.max_products
           WHEN 'tenant_members' THEN sp.max_team_members
         END
    INTO subscription_status, trial_ends_at, max_allowed
  FROM menu_v3.tenant_subscriptions ts
  JOIN menu_v3.subscription_plans sp ON sp.id = ts.plan_id
  WHERE ts.tenant_id = NEW.tenant_id
    AND sp.is_active = true
  FOR UPDATE OF ts;

  -- Expired trials are downgraded before checking the write against Free limits.
  -- An admin extension must expire once its replacement end date passes too.
  IF subscription_status = 'trialing'
     AND (trial_ends_at IS NULL OR trial_ends_at <= now()) THEN
    SELECT id
      INTO free_plan_id
    FROM menu_v3.subscription_plans
    WHERE code = 'free'
      AND is_active = true
    LIMIT 1;

    IF free_plan_id IS NULL THEN
      RAISE EXCEPTION 'SUBSCRIPTION_PLAN_UNAVAILABLE'
        USING ERRCODE = 'P0001';
    END IF;

    UPDATE menu_v3.tenant_subscriptions
    SET plan_id = free_plan_id,
        status = 'active',
        trial_ends_at = NULL,
        billing_interval = 'monthly',
        updated_at = now()
    WHERE tenant_id = NEW.tenant_id
      AND status = 'trialing'
      AND (trial_ends_at IS NULL OR trial_ends_at <= now());

    -- Reload authoritative Free limits while retaining the row lock.
    SELECT ts.status,
           ts.trial_ends_at,
           CASE TG_TABLE_NAME
             WHEN 'branches' THEN sp.max_branches
             WHEN 'products' THEN sp.max_products
             WHEN 'tenant_members' THEN sp.max_team_members
           END
      INTO subscription_status, trial_ends_at, max_allowed
    FROM menu_v3.tenant_subscriptions ts
    JOIN menu_v3.subscription_plans sp ON sp.id = ts.plan_id
    WHERE ts.tenant_id = NEW.tenant_id
      AND sp.is_active = true
    FOR UPDATE OF ts;
  END IF;

  IF subscription_status IS NULL OR subscription_status NOT IN ('trialing', 'active') THEN
    RAISE EXCEPTION 'SUBSCRIPTION_REQUIRED'
      USING ERRCODE = 'P0001';
  END IF;

  resource := CASE TG_TABLE_NAME
    WHEN 'branches' THEN 'branches'
    WHEN 'products' THEN 'products'
    WHEN 'tenant_members' THEN 'team_members'
  END;

  IF TG_TABLE_NAME = 'branches' THEN
    IF TG_OP = 'INSERT' AND COALESCE(NEW.is_active, true) THEN
      SELECT count(*)::integer INTO current_count
      FROM menu_v3.branches
      WHERE tenant_id = NEW.tenant_id AND is_active = true;
    ELSIF TG_OP = 'UPDATE'
      AND COALESCE(NEW.is_active, true)
      AND COALESCE(OLD.is_active, false) = false THEN
      SELECT count(*)::integer INTO current_count
      FROM menu_v3.branches
      WHERE tenant_id = NEW.tenant_id AND is_active = true;
    ELSE
      RETURN NEW;
    END IF;
  ELSIF TG_TABLE_NAME = 'products' THEN
    IF TG_OP = 'INSERT' THEN
      SELECT count(*)::integer INTO current_count
      FROM menu_v3.products
      WHERE tenant_id = NEW.tenant_id;
    ELSE
      RETURN NEW;
    END IF;
  ELSIF TG_TABLE_NAME = 'tenant_members' THEN
    IF TG_OP = 'INSERT' AND COALESCE(NEW.is_active, true) THEN
      SELECT count(*)::integer INTO current_count
      FROM menu_v3.tenant_members
      WHERE tenant_id = NEW.tenant_id AND is_active = true;
    ELSIF TG_OP = 'UPDATE'
      AND COALESCE(NEW.is_active, true)
      AND COALESCE(OLD.is_active, false) = false THEN
      SELECT count(*)::integer INTO current_count
      FROM menu_v3.tenant_members
      WHERE tenant_id = NEW.tenant_id AND is_active = true;
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
    RAISE EXCEPTION 'PLAN_LIMIT:%:%:%', resource, current_count, max_allowed
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION menu_v3.enforce_subscription_entitlement() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION menu_v3.enforce_subscription_entitlement() TO postgres;
