create table if not exists menu_v3.public_order_rate_limits (
  tenant_id uuid not null,
  branch_id uuid not null,
  client_token text not null,
  window_start timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, branch_id, client_token, window_start)
);

create index if not exists public_order_rate_limits_updated_idx
  on menu_v3.public_order_rate_limits (updated_at);

create table if not exists menu_v3.public_order_idempotency (
  tenant_id uuid not null,
  branch_id uuid not null,
  client_token text not null,
  idempotency_key text not null,
  order_id uuid,
  order_number bigint,
  total numeric,
  currency text,
  created_at timestamptz not null default now(),
  primary key (tenant_id, branch_id, client_token, idempotency_key)
);

create index if not exists public_order_idempotency_created_idx
  on menu_v3.public_order_idempotency (created_at);

revoke all on table menu_v3.public_order_rate_limits from anon, authenticated;
revoke all on table menu_v3.public_order_idempotency from anon, authenticated;
