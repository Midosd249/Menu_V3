-- LEVEL 3 / Orders hardening.
-- The orders triggers must resolve menu_v3 tables explicitly; relying on the
-- session search_path can resolve an unrelated public table with the same name.

create or replace function menu_v3.enforce_order_tenant_consistency()
returns trigger
language plpgsql
set search_path = menu_v3, public
as $$
declare
  branch_tenant text;
begin
  if new.branch_id is not null then
    select b.tenant_id
      into branch_tenant
      from menu_v3.branches b
     where b.id = new.branch_id;

    if branch_tenant is null or branch_tenant <> new.tenant_id then
      raise exception 'order branch tenant mismatch';
    end if;
  end if;

  return new;
end;
$$;

create or replace function menu_v3.enforce_order_item_tenant_consistency()
returns trigger
language plpgsql
set search_path = menu_v3, public
as $$
declare
  order_tenant text;
  product_tenant text;
begin
  select o.tenant_id
    into order_tenant
    from menu_v3.orders o
   where o.id = new.order_id;

  if order_tenant is null then
    raise exception 'order not found';
  end if;

  if new.product_id is not null then
    select p.tenant_id
      into product_tenant
      from menu_v3.products p
     where p.id = new.product_id;

    if product_tenant is null or product_tenant <> order_tenant then
      raise exception 'order item product tenant mismatch';
    end if;
  end if;

  return new;
end;
$$;
