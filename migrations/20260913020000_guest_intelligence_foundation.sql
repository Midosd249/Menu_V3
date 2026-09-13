set search_path to menu_v3, public;

create table if not exists guest_profiles (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  branch_id text references branches(id) on delete set null,
  identity_hash text not null,
  display_name text not null default '',
  consent_status text not null default 'unknown',
  source text not null default 'web',
  first_order_at timestamptz,
  last_order_at timestamptz,
  order_count integer not null default 0,
  total_spend numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guest_profiles_consent_ck check (consent_status in ('unknown','granted','denied','revoked')),
  constraint guest_profiles_source_ck check (source in ('web','qr','whatsapp','manual','imported')),
  constraint guest_profiles_order_count_ck check (order_count >= 0),
  constraint guest_profiles_total_spend_ck check (total_spend >= 0),
  unique (tenant_id, branch_id, identity_hash)
);

alter table orders add column if not exists guest_profile_id text references guest_profiles(id) on delete set null;

create index if not exists guest_profiles_tenant_last_order_idx on guest_profiles (tenant_id, last_order_at desc);
create index if not exists guest_profiles_branch_last_order_idx on guest_profiles (branch_id, last_order_at desc);
create index if not exists guest_profiles_tenant_identity_idx on guest_profiles (tenant_id, identity_hash);
create index if not exists orders_guest_profile_idx on orders (guest_profile_id, created_at desc);

create or replace function sync_guest_profile_from_order() returns trigger language plpgsql as $$
declare
  normalized_phone text;
  normalized_email text;
  profile_id text;
  profile_identity text;
begin
  normalized_phone := regexp_replace(coalesce(new.customer_phone, ''), '[^0-9+]', '', 'g');
  normalized_email := lower(trim(coalesce(new.customer_email, '')));
  if normalized_phone = '' and normalized_email = '' then return new; end if;
  profile_identity := md5(concat(new.tenant_id, ':', coalesce(new.branch_id, ''), ':', normalized_phone, ':', normalized_email));
  select id into profile_id from guest_profiles where tenant_id = new.tenant_id and branch_id is not distinct from new.branch_id and identity_hash = profile_identity limit 1;
  if profile_id is null then
    profile_id := 'guest_' || md5(random()::text || clock_timestamp()::text);
    insert into guest_profiles (id, tenant_id, branch_id, identity_hash, display_name, source, first_order_at, last_order_at, order_count, total_spend)
    values (profile_id, new.tenant_id, new.branch_id, profile_identity, coalesce(new.customer_name, ''), case when new.source = 'qr' then 'qr' when new.source = 'whatsapp' then 'whatsapp' else 'web' end, new.created_at, new.created_at, 1, greatest(coalesce(new.total, 0), 0));
  else
    update guest_profiles set display_name = case when coalesce(new.customer_name, '') <> '' then new.customer_name else display_name end,
      last_order_at = greatest(coalesce(last_order_at, new.created_at), new.created_at), order_count = order_count + 1,
      total_spend = total_spend + greatest(coalesce(new.total, 0), 0), updated_at = now() where id = profile_id;
  end if;
  new.guest_profile_id := profile_id;
  return new;
end;
$$;

drop trigger if exists orders_guest_profile_sync on orders;
create trigger orders_guest_profile_sync before insert on orders for each row execute function sync_guest_profile_from_order();

with grouped as (
  select o.tenant_id, o.branch_id,
    md5(concat(o.tenant_id, ':', coalesce(o.branch_id, ''), ':', regexp_replace(coalesce(o.customer_phone, ''), '[^0-9+]', '', 'g'), ':', lower(trim(coalesce(o.customer_email, ''))))) as identity_hash,
    (array_agg(o.customer_name order by o.created_at desc))[1] as display_name,
    (array_agg(o.source order by o.created_at desc))[1] as source,
    min(o.created_at) as first_order_at, max(o.created_at) as last_order_at,
    count(*)::int as order_count, sum(greatest(coalesce(o.total, 0), 0)) as total_spend
  from orders o
  where coalesce(o.customer_phone, '') <> '' or coalesce(o.customer_email, '') <> ''
  group by o.tenant_id, o.branch_id, identity_hash
)
insert into guest_profiles (id, tenant_id, branch_id, identity_hash, display_name, source, first_order_at, last_order_at, order_count, total_spend)
select 'guest_' || md5(random()::text || g.tenant_id || g.identity_hash), g.tenant_id, g.branch_id, g.identity_hash, coalesce(g.display_name, ''),
  case when g.source = 'qr' then 'qr' when g.source = 'whatsapp' then 'whatsapp' else 'web' end,
  g.first_order_at, g.last_order_at, g.order_count, g.total_spend
from grouped g
on conflict (tenant_id, branch_id, identity_hash) do update set
  display_name = case when excluded.display_name <> '' then excluded.display_name else guest_profiles.display_name end,
  first_order_at = least(guest_profiles.first_order_at, excluded.first_order_at),
  last_order_at = greatest(guest_profiles.last_order_at, excluded.last_order_at),
  order_count = excluded.order_count, total_spend = excluded.total_spend, updated_at = now();

update orders o set guest_profile_id = g.id
from guest_profiles g
where o.guest_profile_id is null and g.tenant_id = o.tenant_id and g.branch_id is not distinct from o.branch_id
  and g.identity_hash = md5(concat(o.tenant_id, ':', coalesce(o.branch_id, ''), ':', regexp_replace(coalesce(o.customer_phone, ''), '[^0-9+]', '', 'g'), ':', lower(trim(coalesce(o.customer_email, '')))))
  and (coalesce(o.customer_phone, '') <> '' or coalesce(o.customer_email, '') <> '');