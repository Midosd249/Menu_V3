alter table menu_v3.order_items
  add column if not exists original_unit_price numeric not null default 0,
  add column if not exists discount_amount numeric not null default 0,
  add column if not exists offer_id text references menu_v3.product_offers(id) on delete set null;
alter table menu_v3.order_items drop constraint if exists order_items_discount_amount_ck;
alter table menu_v3.order_items add constraint order_items_discount_amount_ck check (discount_amount >= 0);
update menu_v3.order_items set original_unit_price = unit_price where original_unit_price = 0;
