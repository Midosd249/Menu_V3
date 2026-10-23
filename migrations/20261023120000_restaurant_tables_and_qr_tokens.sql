-- QR table ordering foundation.
-- Restaurant tables are branch-scoped. Opaque QR tokens are stored as SHA-256 hashes.
-- Public customers resolve tokens server-side only; tokens are not staff credentials.

set search_path to menu_v3, public;

create table if not exists restaurant_tables (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  branch_id text not null references branches(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_tables_label_ck check (char_length(trim(label)) >= 1 and char_length(label) <= 80),
  constraint restaurant_tables_sort_ck check (sort_order >= 0)
);

create unique index if not exists restaurant_tables_branch_label_uidx
  on restaurant_tables (branch_id, lower(trim(label)))
  where is_active = true;

create index if not exists restaurant_tables_tenant_branch_idx
  on restaurant_tables (tenant_id, branch_id, sort_order);

create table if not exists table_qr_tokens (
  id text primary key,
  table_id text not null references restaurant_tables(id) on delete cascade,
  tenant_id text not null references tenants(id) on delete cascade,
  branch_id text not null references branches(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  expires_at timestamptz,
  created_by text
);

create index if not exists table_qr_tokens_table_active_idx
  on table_qr_tokens (table_id, created_at desc)
  where revoked_at is null;

create index if not exists table_qr_tokens_tenant_branch_idx
  on table_qr_tokens (tenant_id, branch_id);

-- Enforce tenant/branch consistency for tables
create or replace function enforce_restaurant_table_tenant_consistency()
returns trigger
language plpgsql
set search_path = menu_v3, pg_temp
as $$
declare
  branch_tenant text;
begin
  select tenant_id into branch_tenant from branches where id = new.branch_id;
  if branch_tenant is null or branch_tenant <> new.tenant_id then
    raise exception 'restaurant table branch tenant mismatch';
  end if;
  return new;
end;
$$;

drop trigger if exists restaurant_table_tenant_guard on restaurant_tables;
create trigger restaurant_table_tenant_guard
before insert or update on restaurant_tables
for each row execute function enforce_restaurant_table_tenant_consistency();

create or replace function touch_restaurant_tables_updated_at()
returns trigger language plpgsql set search_path = menu_v3, pg_temp as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists restaurant_tables_updated_at on restaurant_tables;
create trigger restaurant_tables_updated_at
before update on restaurant_tables
for each row execute function touch_restaurant_tables_updated_at();

-- Enforce token consistency with its table
create or replace function enforce_table_qr_token_consistency()
returns trigger
language plpgsql
set search_path = menu_v3, pg_temp
as $$
declare
  t_tenant text;
  t_branch text;
begin
  select tenant_id, branch_id into t_tenant, t_branch
  from restaurant_tables where id = new.table_id;
  if t_tenant is null or t_tenant <> new.tenant_id or t_branch <> new.branch_id then
    raise exception 'table QR token table ownership mismatch';
  end if;
  return new;
end;
$$;

drop trigger if exists table_qr_token_guard on table_qr_tokens;
create trigger table_qr_token_guard
before insert or update on table_qr_tokens
for each row execute function enforce_table_qr_token_consistency();

-- Associate orders with a table (nullable for backward compatibility)
alter table orders
  add column if not exists table_id text references restaurant_tables(id) on delete set null;

create index if not exists orders_table_created_idx on orders (table_id, created_at desc)
  where table_id is not null;

-- Server-only: enable RLS with no public policies (default deny for client roles)
alter table restaurant_tables enable row level security;
alter table table_qr_tokens enable row level security;

-- Revoke any accidental public grants (defense in depth)
revoke all on table restaurant_tables from public, anon, authenticated;
revoke all on table table_qr_tokens from public, anon, authenticated;
