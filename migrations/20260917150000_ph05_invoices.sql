-- PH-05: invoice generation is a document ledger only.
-- No payment provider, automatic charging, webhook, or payment-status inference is introduced.
SET search_path = menu_v3, public;

CREATE TABLE IF NOT EXISTS menu_v3.subscription_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES menu_v3.tenants(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  plan_code TEXT NOT NULL,
  plan_name_ar TEXT NOT NULL,
  plan_name_en TEXT NOT NULL,
  amount_sar NUMERIC(10,2) NOT NULL CHECK (amount_sar >= 0),
  currency TEXT NOT NULL DEFAULT 'SAR' CHECK (currency = 'SAR'),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL CHECK (period_end > period_start),
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'void')),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_user_id TEXT REFERENCES menu_v3."user"(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscription_invoices_tenant_created
  ON menu_v3.subscription_invoices(tenant_id, created_at DESC);

ALTER TABLE menu_v3.subscription_invoices ENABLE ROW LEVEL SECURITY;

-- Direct client access is intentionally absent. The authenticated server boundary
-- resolves the tenant from the current session and never accepts a client tenant id.
