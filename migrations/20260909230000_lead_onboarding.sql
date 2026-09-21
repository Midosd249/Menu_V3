-- Platform lead approval and customer onboarding links.
-- Tokens are stored as SHA-256 hashes; the plain token is returned only once when generated.
create table if not exists lead_onboarding (
  id text primary key,
  lead_id text not null references leads(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  approved_at timestamptz not null default now(),
  used_at timestamptz,
  revoked_at timestamptz,
  tenant_id text references tenants(id) on delete set null,
  created_by text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_onboarding_lead_idx on lead_onboarding (lead_id, created_at desc);
create index if not exists lead_onboarding_active_idx on lead_onboarding (lead_id, expires_at desc)
  where used_at is null and revoked_at is null;
