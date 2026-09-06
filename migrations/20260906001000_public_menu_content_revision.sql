-- Public Menu freshness contract.
-- Keeps the process-local menu cache safe across owner mutations and server instances.
-- The database revision is the source of truth; the application never trusts a stale cache key.

alter table tenants
  add column if not exists public_content_version bigint not null default 0;

-- Tenant changes (branding, publication state, etc.) are public-menu changes.
create or replace function bump_tenant_public_content_version()
returns trigger
language plpgsql
as $$
begin
  if new.public_content_version is distinct from old.public_content_version then
    return new;
  end if;

  new.public_content_version := old.public_content_version + 1;
  return new;
end;
$$;

drop trigger if exists tenants_public_content_version on tenants;
create trigger tenants_public_content_version
before update on tenants
for each row execute function bump_tenant_public_content_version();

-- Child-row changes invalidate the tenant-wide public representation. This is
-- deliberately database-driven so direct SQL/import paths cannot bypass it.
create or replace function bump_parent_tenant_public_content_version()
returns trigger
language plpgsql
as $$
declare
  tenant_id_to_bump text;
begin
  if tg_table_name in ('branches', 'categories', 'products', 'product_variants', 'modifier_groups', 'modifier_options') then
    tenant_id_to_bump := coalesce(new.tenant_id, old.tenant_id);
  elsif tg_table_name = 'branch_hours' then
    select tenant_id into tenant_id_to_bump
    from branches
    where id = coalesce(new.branch_id, old.branch_id);
  elsif tg_table_name = 'product_modifier_groups' then
    select tenant_id into tenant_id_to_bump
    from products
    where id = coalesce(new.product_id, old.product_id);
  end if;

  if tenant_id_to_bump is not null then
    update tenants
    set public_content_version = public_content_version + 1
    where id = tenant_id_to_bump;
  end if;

  return coalesce(new, old);
end;
$$;

-- Recreate idempotently so this migration is safe in local/PGlite replay checks.
drop trigger if exists branches_public_content_version on branches;
create trigger branches_public_content_version
after insert or update or delete on branches
for each row execute function bump_parent_tenant_public_content_version();

drop trigger if exists branch_hours_public_content_version on branch_hours;
create trigger branch_hours_public_content_version
after insert or update or delete on branch_hours
for each row execute function bump_parent_tenant_public_content_version();

drop trigger if exists categories_public_content_version on categories;
create trigger categories_public_content_version
after insert or update or delete on categories
for each row execute function bump_parent_tenant_public_content_version();

drop trigger if exists products_public_content_version on products;
create trigger products_public_content_version
after insert or update or delete on products
for each row execute function bump_parent_tenant_public_content_version();

drop trigger if exists product_variants_public_content_version on product_variants;
create trigger product_variants_public_content_version
after insert or update or delete on product_variants
for each row execute function bump_parent_tenant_public_content_version();

drop trigger if exists modifier_groups_public_content_version on modifier_groups;
create trigger modifier_groups_public_content_version
after insert or update or delete on modifier_groups
for each row execute function bump_parent_tenant_public_content_version();

drop trigger if exists modifier_options_public_content_version on modifier_options;
create trigger modifier_options_public_content_version
after insert or update or delete on modifier_options
for each row execute function bump_parent_tenant_public_content_version();

drop trigger if exists product_modifier_groups_public_content_version on product_modifier_groups;
create trigger product_modifier_groups_public_content_version
after insert or update or delete on product_modifier_groups
for each row execute function bump_parent_tenant_public_content_version();

-- Seed a non-zero revision for existing published content so old process-local
-- cache entries cannot accidentally share the initial revision after deployment.
update tenants
set public_content_version = 1
where public_content_version = 0;
