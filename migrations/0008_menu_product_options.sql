-- LEVEL 2 / Menu Experience foundation.
-- Product options are tenant-scoped and intentionally separate from ordering.

alter table products
  add column if not exists tags text[] not null default '{}',
  add column if not exists dietary_labels text[] not null default '{}';

create table if not exists product_variants (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  product_id text not null references products(id) on delete cascade,
  name_ar text not null,
  name_en text not null default '',
  price numeric not null default 0,
  sort_order integer not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_price_ck check (price >= 0)
);

create table if not exists modifier_groups (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  name_ar text not null,
  name_en text not null default '',
  min_select integer not null default 0,
  max_select integer not null default 1,
  sort_order integer not null default 0,
  is_required boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint modifier_groups_min_ck check (min_select >= 0),
  constraint modifier_groups_max_ck check (max_select >= min_select)
);

create table if not exists modifier_options (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  group_id text not null references modifier_groups(id) on delete cascade,
  name_ar text not null,
  name_en text not null default '',
  price_delta numeric not null default 0,
  sort_order integer not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint modifier_options_group_tenant_fk
    foreign key (group_id) references modifier_groups(id) on delete cascade
);

create table if not exists product_modifier_groups (
  product_id text not null references products(id) on delete cascade,
  modifier_group_id text not null references modifier_groups(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (product_id, modifier_group_id)
);

create index if not exists products_tags_gin_idx on products using gin (tags);
create index if not exists products_dietary_labels_gin_idx on products using gin (dietary_labels);
create index if not exists product_variants_product_idx on product_variants (product_id, sort_order);
create index if not exists product_variants_tenant_idx on product_variants (tenant_id, product_id);
create index if not exists modifier_groups_tenant_idx on modifier_groups (tenant_id, sort_order);
create index if not exists modifier_options_group_idx on modifier_options (group_id, sort_order);
create index if not exists modifier_options_tenant_idx on modifier_options (tenant_id, group_id);
create index if not exists product_modifier_groups_group_idx on product_modifier_groups (modifier_group_id, sort_order);

-- Defensive tenant-consistency checks for cross-tenant references.
create or replace function enforce_product_variant_tenant()
returns trigger
language plpgsql
as $$
declare product_tenant text;
begin
  select tenant_id into product_tenant from products where id = new.product_id;
  if product_tenant is null or product_tenant <> new.tenant_id then
    raise exception 'product_variant tenant mismatch';
  end if;
  return new;
end;
$$;

drop trigger if exists product_variant_tenant_guard on product_variants;
create trigger product_variant_tenant_guard
before insert or update on product_variants
for each row execute function enforce_product_variant_tenant();

create or replace function enforce_modifier_option_tenant()
returns trigger
language plpgsql
as $$
declare group_tenant text;
begin
  select tenant_id into group_tenant from modifier_groups where id = new.group_id;
  if group_tenant is null or group_tenant <> new.tenant_id then
    raise exception 'modifier_option tenant mismatch';
  end if;
  return new;
end;
$$;

drop trigger if exists modifier_option_tenant_guard on modifier_options;
create trigger modifier_option_tenant_guard
before insert or update on modifier_options
for each row execute function enforce_modifier_option_tenant();

create or replace function enforce_product_modifier_group_tenant()
returns trigger
language plpgsql
as $$
declare product_tenant text;
declare group_tenant text;
begin
  select tenant_id into product_tenant from products where id = new.product_id;
  select tenant_id into group_tenant from modifier_groups where id = new.modifier_group_id;
  if product_tenant is null or group_tenant is null or product_tenant <> group_tenant then
    raise exception 'product_modifier_group tenant mismatch';
  end if;
  return new;
end;
$$;

drop trigger if exists product_modifier_group_tenant_guard on product_modifier_groups;
create trigger product_modifier_group_tenant_guard
before insert or update on product_modifier_groups
for each row execute function enforce_product_modifier_group_tenant();
