create table if not exists menu_v3.public_order_invalid_rate_limits (
  tenant_id uuid not null,
  branch_id uuid not null,
  identity_token text not null,
  window_start timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, branch_id, identity_token, window_start)
);

create index if not exists public_order_invalid_rate_limits_updated_idx
  on menu_v3.public_order_invalid_rate_limits (updated_at);

revoke all on table menu_v3.public_order_invalid_rate_limits from public, anon, authenticated;
