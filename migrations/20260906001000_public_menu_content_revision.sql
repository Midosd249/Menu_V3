-- Public Menu freshness contract.
-- Keeps the process-local menu cache safe across owner mutations and server instances.
-- The database revision is the source of truth; the application never trusts a stale cache key.
-- Menu V3 is explicitly isolated in its canonical schema so this migration can never
-- accidentally target the legacy public schema.

alter table menu_v3.tenants
  add column if not exists public_content_version bigint not null default 0;

-- Tenant changes (branding, publication state, etc.) are public-menu changes.
create or replace function menu_v3.bump_tenant_public_content_version()
returns trigger
language plpgsql
set search_path = menu_v3, pg_temp
as $$
begin
  if new.public_content_version is distinct from old.public_content_version then
    return new;
  end if;

  new.public_content_version := old.public_content_version + 1;
  return new;
end;
$$;

drop trigger if exists tenants_public_content_version on menu_v3.tenants;
create trigger tenants_public_content_version
before update on menu_v3.tenants
for each row execute function menu_v3.bump_tenant_public_content_version();

-- Child-row changes invalidate the tenant-wide public representation. This is
-- deliberately database-driven so direct SQL/import paths cannot bypass it.
create or replace function menu_v3.bump_parent_tenant_public_content_version()
returns trigger
language plpgsql
set search_path = menu_v3, pg_temp
as $$
declare
  tenant_id_to_bump text;
begin
  if tg_table_name in ('branches', 'categories', 'products', 'product_variants', 'modifier_groups', 'modifier_options') then
    tenant_id_to_bump := coalesce(new.tenant_id, old.tenant_id);
  elsif tg_table_name = 'branch_hours' then
    select tenant_id into tenant_id_to_bump
    from menu_v3.branches
    where id = coalesce(new.branch_id, old.branch_id);
  elsif tg_table_name = 'product_modifier_groups' then
    select tenant_id into tenant_id_to_bump
    from menu_v3.products
    where id = coalesce(new.product_id, old.product_id);
  end if;

  if tenant_id_to_bump is not null then
    update menu_v3.tenants
    set public_content_version = public_content_version + 1
    where id = tenant_id_to_bump;
  end if;

  return coalesce(new, old);
end;
$$;

-- Recreate idempotently so this migration is safe in local/PGlite replay checks.
drop trigger if exists branches_public_content_version on menu_v3.branches;
create trigger branches_public_content_version
after insert or update or delete on menu_v3.branches
for each row execute function menu_v3.bump_parent_tenant_public_content_version();

drop trigger if exists branch_hours_public_content_version on menu_v3.branch_hours;
create trigger branch_hours_public_content_version
after insert or update or delete on menu_v3.branch_hours
for each row execute function menu_v3.bump_parent_tenant_public_content_version();

drop trigger if exists categories_public_content_version on menu_v3.categories;
create trigger categories_public_content_version
after insert or update or delete on menu_v3.categories
for each row execute function menu_v3.bump_parent_tenant_public_content_version();

drop trigger if exists products_public_content_version on menu_v3.products;
create trigger products_public_content_version
after insert or update or delete on menu_v3.products
for each row execute function menu_v3.bump_parent_tenant_public_content_version();

drop trigger if exists product_variants_public_content_version on menu_v3.product_variants;
create trigger product_variants_public_content_version
after insert or update or delete on menu_v3.product_variants
for each row execute function menu_v3.bump_parent_tenant_public_content_version();

drop trigger if exists modifier_groups_public_content_version on menu_v3.modifier_groups;
create trigger modifier_groups_public_content_version
after insert or update or delete on menu_v3.modifier_groups
for each row execute function menu_v3.bump_parent_tenant_public_content_version();

drop trigger if exists modifier_options_public_content_version on menu_v3.modifier_options;
create trigger modifier_options_public_content_version
after insert or update or delete on menu_v3.modifier_options
for each row execute function menu_v3.bump_parent_tenant_public_content_version();

drop trigger if exists product_modifier_groups_public_content_version on menu_v3.product_modifier_groups;
create trigger product_modifier_groups_public_content_version
after insert or update or delete on menu_v3.product_modifier_groups
for each row execute function menu_v3.bump_parent_tenant_public_content_version();

-- Seed a non-zero revision for existing published content so old process-local
-- cache entries cannot accidentally share the initial revision after deployment.
update menu_v3.tenants
set public_content_version = 1
where public_content_version = 0;
