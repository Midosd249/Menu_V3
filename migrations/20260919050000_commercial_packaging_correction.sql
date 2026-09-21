-- Commercial packaging correction: Free is intentionally capped at 20 products and 2 team members.
-- Existing paid limits remain unchanged. Server/database entitlement remains authoritative.
SET search_path = menu_v3, public;

UPDATE menu_v3.subscription_plans
SET max_products = CASE code
      WHEN 'free' THEN 20
      WHEN 'starter' THEN 300
      WHEN 'pro' THEN max_products
      ELSE max_products
    END,
    max_team_members = CASE code
      WHEN 'free' THEN 2
      WHEN 'starter' THEN 10
      WHEN 'pro' THEN 25
      ELSE max_team_members
    END,
    updated_at = now()
WHERE code IN ('free', 'starter', 'pro');
