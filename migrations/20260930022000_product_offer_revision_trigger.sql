create or replace function menu_v3.bump_parent_tenant_public_content_version()
returns trigger
language plpgsql
set search_path = menu_v3, pg_temp
as $$
declare tenant_id_to_bump text;
begin
  if tg_table_name in ('branches','categories','products','product_variants','modifier_groups','modifier_options','product_offers') then
    tenant_id_to_bump := coalesce(new.tenant_id, old.tenant_id);
  elsif tg_table_name = 'branch_hours' then
    select tenant_id into tenant_id_to_bump from menu_v3.branches where id = coalesce(new.branch_id, old.branch_id);
  elsif tg_table_name = 'product_modifier_groups' then
    select tenant_id into tenant_id_to_bump from menu_v3.products where id = coalesce(new.product_id, old.product_id);
  end if;
  if tenant_id_to_bump is not null then
    update menu_v3.tenants set public_content_version = public_content_version + 1 where id = tenant_id_to_bump;
  end if;
  return coalesce(new, old);
end;
$$;
