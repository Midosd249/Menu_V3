-- Platform-owner customer onboarding requests are separate from restaurant customer orders.
create table if not exists customer_requests (
  id text primary key,
  tenant_id text not null unique references tenants(id) on delete cascade,
  owner_user_id text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_requests_status_created_idx
  on customer_requests (status, created_at desc);

create index if not exists customer_requests_owner_idx
  on customer_requests (owner_user_id, created_at desc);

insert into customer_requests (id, tenant_id, owner_user_id, status, submitted_at)
select
  'cr-' || t.id,
  t.id,
  t.owner_user_id,
  'pending',
  coalesce(t.created_at, now())
from tenants t
where not exists (select 1 from customer_requests cr where cr.tenant_id = t.id)
  and t.slug = 'mndy-alwtnya';
