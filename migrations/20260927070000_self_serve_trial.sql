-- Self-serve onboarding: grant every new tenant the existing Pro 14-day trial mechanism.
-- No new plan tier or entitlement override is introduced.
SET search_path = menu_v3, public;

CREATE OR REPLACE FUNCTION menu_v3.ensure_default_tenant_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = menu_v3, pg_catalog
AS $$
BEGIN
  INSERT INTO menu_v3.tenant_subscriptions (tenant_id, plan_id, status, trial_ends_at, billing_interval)
  SELECT NEW.id, p.id, 'trialing', now() + interval '14 days', 'monthly'
  FROM menu_v3.subscription_plans p
  WHERE p.code = 'pro' AND p.is_active = true
  ON CONFLICT (tenant_id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION menu_v3.ensure_default_tenant_subscription() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION menu_v3.ensure_default_tenant_subscription() TO postgres;
