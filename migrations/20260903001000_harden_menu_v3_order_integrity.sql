-- Menu V3: database-level order integrity hardening.
-- Mirrors the production migration applied to Supabase project ublxptcqefujkbeepylc.

alter table menu_v3.order_items
  drop constraint if exists order_items_line_total_ck;

alter table menu_v3.order_items
  add constraint order_items_line_total_ck
  check (line_total >= 0 and line_total = quantity * unit_price);

alter table menu_v3.orders
  add constraint orders_total_not_less_than_subtotal_ck
  check (total >= subtotal);

create unique index if not exists orders_tenant_order_number_uidx
  on menu_v3.orders (tenant_id, order_number);

create or replace function menu_v3.validate_order_item_integrity()
returns trigger
language plpgsql
set search_path = menu_v3, public, pg_temp
as $$
begin
  if new.quantity <= 0 then
    raise exception 'order item quantity must be positive';
  end if;
  if new.unit_price < 0 then
    raise exception 'order item unit price cannot be negative';
  end if;
  if new.line_total <> new.quantity * new.unit_price then
    raise exception 'order item line total mismatch';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_validate_order_item_integrity on menu_v3.order_items;
create trigger trg_validate_order_item_integrity
before insert or update on menu_v3.order_items
for each row execute function menu_v3.validate_order_item_integrity();

create or replace function menu_v3.validate_order_status_transition()
returns trigger
language plpgsql
set search_path = menu_v3, public, pg_temp
as $$
begin
  if new.status <> old.status then
    if not (
      (old.status = 'new' and new.status in ('confirmed','cancelled')) or
      (old.status = 'confirmed' and new.status in ('preparing','cancelled')) or
      (old.status = 'preparing' and new.status in ('ready','cancelled')) or
      (old.status = 'ready' and new.status in ('completed','cancelled'))
    ) then
      raise exception 'invalid order status transition: % -> %', old.status, new.status;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_validate_order_status_transition on menu_v3.orders;
create trigger trg_validate_order_status_transition
before update of status on menu_v3.orders
for each row execute function menu_v3.validate_order_status_transition();
