set search_path to menu_v3, public;

-- R9: owner-controlled guest relationship foundation.
-- No outbound messaging, automatic rewards, or autonomous campaign execution.

create table if not exists guest_loyalty_accounts (
  id text primary key,
  guest_profile_id text not null unique references guest_profiles(id) on delete cascade,
  tenant_id text not null references tenants(id) on delete cascade,
  branch_id text references branches(id) on delete set null,
  points_balance integer not null default 0,
  lifetime_points integer not null default 0,
  tier text not null default 'standard',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guest_loyalty_balance_ck check (points_balance >= 0),
  constraint guest_loyalty_lifetime_ck check (lifetime_points >= 0),
  constraint guest_loyalty_tier_ck check (tier in ('standard','silver','gold','vip'))
);

create table if not exists guest_loyalty_ledger (
  id text primary key,
  loyalty_account_id text not null references guest_loyalty_accounts(id) on delete cascade,
  tenant_id text not null references tenants(id) on delete cascade,
  branch_id text references branches(id) on delete set null,
  points integer not null,
  reason text not null,
  order_id text references orders(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint guest_loyalty_points_nonzero_ck check (points <> 0)
);

create table if not exists guest_campaigns (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  branch_id text references branches(id) on delete set null,
  name text not null,
  status text not null default 'draft',
  channel text not null default 'manual',
  audience_definition jsonb not null default '{}'::jsonb,
  message_ar text not null default '',
  message_en text not null default '',
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guest_campaign_status_ck check (status in ('draft','approved','paused','completed')),
  constraint guest_campaign_channel_ck check (channel in ('manual','whatsapp'))
);

create table if not exists guest_feedback (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  branch_id text references branches(id) on delete set null,
  guest_profile_id text references guest_profiles(id) on delete set null,
  order_id text references orders(id) on delete set null,
  rating integer,
  comment text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guest_feedback_rating_ck check (rating is null or rating between 1 and 5),
  constraint guest_feedback_status_ck check (status in ('new','reviewed','resolved','archived'))
);

create index if not exists guest_loyalty_tenant_branch_idx on guest_loyalty_accounts (tenant_id, branch_id, updated_at desc);
create index if not exists guest_loyalty_ledger_account_idx on guest_loyalty_ledger (loyalty_account_id, created_at desc);
create index if not exists guest_loyalty_ledger_tenant_idx on guest_loyalty_ledger (tenant_id, branch_id, created_at desc);
create index if not exists guest_campaigns_tenant_idx on guest_campaigns (tenant_id, branch_id, status, updated_at desc);
create index if not exists guest_feedback_tenant_idx on guest_feedback (tenant_id, branch_id, status, created_at desc);
create index if not exists guest_feedback_guest_idx on guest_feedback (guest_profile_id, created_at desc);

alter table guest_loyalty_accounts enable row level security;
alter table guest_loyalty_ledger enable row level security;
alter table guest_campaigns enable row level security;
alter table guest_feedback enable row level security;

-- Server-side application authorization is the access boundary for these tables.
-- Supabase provides anon/authenticated roles; local PGlite does not. Keep the
-- migration portable by revoking only when each role exists.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table guest_loyalty_accounts from anon';
    execute 'revoke all on table guest_loyalty_ledger from anon';
    execute 'revoke all on table guest_campaigns from anon';
    execute 'revoke all on table guest_feedback from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table guest_loyalty_accounts from authenticated';
    execute 'revoke all on table guest_loyalty_ledger from authenticated';
    execute 'revoke all on table guest_campaigns from authenticated';
    execute 'revoke all on table guest_feedback from authenticated';
  end if;
end
$$;
revoke all on table guest_loyalty_accounts from public;
revoke all on table guest_loyalty_ledger from public;
revoke all on table guest_campaigns from public;
revoke all on table guest_feedback from public;
