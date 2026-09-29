-- Branch-scoped menu ordering overrides.
-- Categories and products remain tenant-owned content; this table stores only the
-- presentation order for a specific tenant branch. Missing overrides fall back to
-- the existing tenant-wide sort_order fields.

create table if not exists menu_v3.branch_category_order (
  branch_id text not null references menu_v3.branches(id) on delete cascade,
  tenant_id text not null references menu_v3.tenants(id) on delete cascade,
  category_id text not null references menu_v3.categories(id) on delete cascade,
  sort_order integer not null,
  primary key (branch_id, category_id),
  constraint branch_category_order_sort_ck check (sort_order >= 0)
);

create table if not exists menu_v3.branch_product_order (
  branch_id text not null references menu_v3.branches(id) on delete cascade,
  tenant_id text not null references menu_v3.tenants(id) on delete cascade,
  product_id text not null references menu_v3.products(id) on delete cascade,
  sort_order integer not null,
  primary key (branch_id, product_id),
  constraint branch_product_order_sort_ck check (sort_order >= 0)
);

create index if not exists branch_category_order_tenant_branch_idx
  on menu_v3.branch_category_order (tenant_id, branch_id, sort_order);
create index if not exists branch_product_order_tenant_branch_idx
  on menu_v3.branch_product_order (tenant_id, branch_id, sort_order);

-- Enforce that an override cannot connect resources from different tenants.
create or replace function menu_v3.validate_branch_menu_order_tenant()
returns trigger
language plpgsql
set search_path = menu_v3, pg_temp
as $$
declare
  branch_tenant text;
  resource_tenant text;
begin
  select tenant_id into branch_tenant from menu_v3.branches where id = new.branch_id;
  if branch_tenant is null or branch_tenant <> new.tenant_id then
    raise exception 'menu order branch tenant mismatch';
  end if;

  if tg_table_name = 'branch_category_order' then
    select tenant_id into resource_tenant from menu_v3.categories where id = new.category_id;
  else
    select tenant_id into resource_tenant from menu_v3.products where id = new.product_id;
  end if;

  if resource_tenant is null or resource_tenant <> new.tenant_id then
    raise exception 'menu order resource tenant mismatch';
  end if;

  return new;
end;
$$;

drop trigger if exists branch_category_order_tenant_check on menu_v3.branch_category_order;
create trigger branch_category_order_tenant_check
before insert or update on menu_v3.branch_category_order
for each row execute function menu_v3.validate_branch_menu_order_tenant();

drop trigger if exists branch_product_order_tenant_check on menu_v3.branch_product_order;
create trigger branch_product_order_tenant_check
before insert or update on menu_v3.branch_product_order
for each row execute function menu_v3.validate_branch_menu_order_tenant();

-- Reuse the existing tenant public-menu revision contract so process-local caches
-- cannot retain the previous branch ordering after a successful mutation.
create or replace function menu_v3.bump_menu_order_public_content_version()
returns trigger
language plpgsql
set search_path = menu_v3, pg_temp
as $$
begin
  update menu_v3.tenants
  set public_content_version = public_content_version + 1
  where id = coalesce(new.tenant_id, old.tenant_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists branch_category_order_public_content_version on menu_v3.branch_category_order;
create trigger branch_category_order_public_content_version
after insert or update or delete on menu_v3.branch_category_order
for each row execute function menu_v3.bump_menu_order_public_content_version();

drop trigger if exists branch_product_order_public_content_version on menu_v3.branch_product_order;
create trigger branch_product_order_public_content_version
after insert or update or delete on menu_v3.branch_product_order
for each row execute function menu_v3.bump_menu_order_public_content_version();
