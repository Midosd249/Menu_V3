-- Level 4B: subscription plans and tenant subscription state.
-- Pricing is configuration only; no payment provider is introduced here.
SET search_path = menu_v3, public;

CREATE TABLE IF NOT EXISTS menu_v3.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  max_branches INTEGER NOT NULL CHECK (max_branches > 0),
  max_products INTEGER NOT NULL CHECK (max_products > 0),
  max_team_members INTEGER NOT NULL CHECK (max_team_members > 0),
  monthly_price_sar NUMERIC(10,2) NOT NULL CHECK (monthly_price_sar >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_v3.tenant_subscriptions (
  tenant_id TEXT PRIMARY KEY REFERENCES menu_v3.tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES menu_v3.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'trialing'
    CHECK (status IN ('trialing','active','past_due','cancelled')),
  trial_ends_at TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_plan
  ON menu_v3.tenant_subscriptions(plan_id);

ALTER TABLE menu_v3.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_v3.tenant_subscriptions ENABLE ROW LEVEL SECURITY;

-- The application server is the authorization boundary for these tables.
-- No direct client grants/policies are introduced in Level 4B.

INSERT INTO menu_v3.subscription_plans
  (code, name_ar, name_en, max_branches, max_products, max_team_members, monthly_price_sar)
VALUES
  ('free', 'مجاني', 'Free', 1, 50, 3, 0),
  ('starter', 'بداية', 'Starter', 3, 300, 10, 99),
  ('pro', 'احترافي', 'Pro', 10, 1000, 25, 199)
ON CONFLICT (code) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  max_branches = EXCLUDED.max_branches,
  max_products = EXCLUDED.max_products,
  max_team_members = EXCLUDED.max_team_members,
  monthly_price_sar = EXCLUDED.monthly_price_sar,
  is_active = true,
  updated_at = now();

INSERT INTO menu_v3.tenant_subscriptions (tenant_id, plan_id, status, trial_ends_at)
SELECT
  t.id,
  p.id,
  'trialing',
  now() + interval '14 days'
FROM menu_v3.tenants t
CROSS JOIN menu_v3.subscription_plans p
WHERE p.code = 'free'
ON CONFLICT (tenant_id) DO NOTHING;
