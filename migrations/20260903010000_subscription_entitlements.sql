-- Menu V3 Level 4C: enforce subscription entitlements at the database boundary.
-- The existing subscription plan data model remains unchanged.
SET search_path = menu_v3, pg_catalog;

-- Existing tenants created before the subscription foundation must have a
-- deterministic default subscription before entitlement checks are enabled.
INSERT INTO menu_v3.tenant_subscriptions (tenant_id, plan_id, status, trial_ends_at)
SELECT t.id, p.id, 'trialing', now() + interval '14 days'
FROM menu_v3.tenants t
JOIN menu_v3.subscription_plans p ON p.code = 'free'
LEFT JOIN menu_v3.tenant_subscriptions ts ON ts.tenant_id = t.id
WHERE ts.tenant_id IS NULL;

CREATE OR REPLACE FUNCTION menu_v3.ensure_default_tenant_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = menu_v3, pg_catalog
AS $$
BEGIN
  INSERT INTO menu_v3.tenant_subscriptions (tenant_id, plan_id, status, trial_ends_at)
  SELECT NEW.id, p.id, 'trialing', now() + interval '14 days'
  FROM menu_v3.subscription_plans p
  WHERE p.code = 'free' AND p.is_active = true
  ON CONFLICT (tenant_id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION menu_v3.ensure_default_tenant_subscription() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION menu_v3.ensure_default_tenant_subscription() TO postgres;

DROP TRIGGER IF EXISTS tenants_default_subscription ON menu_v3.tenants;
CREATE TRIGGER tenants_default_subscription
AFTER INSERT ON menu_v3.tenants
FOR EACH ROW
EXECUTE FUNCTION menu_v3.ensure_default_tenant_subscription();

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
  -- Lock the tenant's subscription row for the complete write statement.
  -- This serializes concurrent limit checks for the same tenant.
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
    SELECT count(*)::integer INTO current_count
    FROM menu_v3.products
    WHERE tenant_id = NEW.tenant_id;
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

  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'PLAN_LIMIT:%:%:%', resource, current_count, max_allowed
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION menu_v3.enforce_subscription_entitlement() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION menu_v3.enforce_subscription_entitlement() TO postgres;

DROP TRIGGER IF EXISTS branches_subscription_entitlement ON menu_v3.branches;
CREATE TRIGGER branches_subscription_entitlement
BEFORE INSERT OR UPDATE OF is_active ON menu_v3.branches
FOR EACH ROW
EXECUTE FUNCTION menu_v3.enforce_subscription_entitlement();

DROP TRIGGER IF EXISTS products_subscription_entitlement ON menu_v3.products;
CREATE TRIGGER products_subscription_entitlement
BEFORE INSERT ON menu_v3.products
FOR EACH ROW
EXECUTE FUNCTION menu_v3.enforce_subscription_entitlement();

DROP TRIGGER IF EXISTS tenant_members_subscription_entitlement ON menu_v3.tenant_members;
CREATE TRIGGER tenant_members_subscription_entitlement
BEFORE INSERT OR UPDATE OF is_active ON menu_v3.tenant_members
FOR EACH ROW
EXECUTE FUNCTION menu_v3.enforce_subscription_entitlement();
