-- LEVEL 3 / Orders foundation.
-- Orders are tenant/branch scoped and keep immutable item snapshots so menu edits
-- never rewrite historical order records.

create table if not exists orders (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  branch_id text references branches(id) on delete set null,
  order_number bigint generated always as identity,
  status text not null default 'new',
  source text not null default 'web',
  customer_name text not null default '',
  customer_phone text not null default '',
  customer_email text not null default '',
  notes text not null default '',
  currency text not null default 'SAR',
  subtotal numeric not null default 0,
  total numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_status_ck check (status in ('new', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  constraint orders_source_ck check (source in ('web', 'whatsapp', 'manual', 'qr')),
  constraint orders_subtotal_ck check (subtotal >= 0),
  constraint orders_total_ck check (total >= 0)
);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text references products(id) on delete set null,
  product_name_ar text not null,
  product_name_en text not null default '',
  quantity integer not null default 1,
  unit_price numeric not null default 0,
  line_total numeric not null default 0,
  selected_options jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  constraint order_items_quantity_ck check (quantity > 0),
  constraint order_items_unit_price_ck check (unit_price >= 0),
  constraint order_items_line_total_ck check (line_total >= 0)
);

create table if not exists order_status_events (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  actor_user_id text,
  created_at timestamptz not null default now(),
  constraint order_status_events_to_ck check (to_status in ('new', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'))
);

create index if not exists orders_tenant_created_idx on orders (tenant_id, created_at desc);
create index if not exists orders_branch_created_idx on orders (branch_id, created_at desc);
create index if not exists orders_status_created_idx on orders (status, created_at desc);
create index if not exists orders_customer_phone_idx on orders (customer_phone);
create index if not exists order_items_order_idx on order_items (order_id, created_at);
create index if not exists order_status_events_order_idx on order_status_events (order_id, created_at desc);

create or replace function touch_orders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at
before update on orders
for each row execute function touch_orders_updated_at();

-- Defensive tenant consistency: an order branch and product must belong to the same tenant.
create or replace function enforce_order_tenant_consistency()
returns trigger
language plpgsql
as $$
declare branch_tenant text;
begin
  if new.branch_id is not null then
    select tenant_id into branch_tenant from branches where id = new.branch_id;
    if branch_tenant is null or branch_tenant <> new.tenant_id then
      raise exception 'order branch tenant mismatch';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists order_tenant_guard on orders;
create trigger order_tenant_guard
before insert or update on orders
for each row execute function enforce_order_tenant_consistency();

create or replace function enforce_order_item_tenant_consistency()
returns trigger
language plpgsql
as $$
declare order_tenant text;
declare product_tenant text;
begin
  select tenant_id into order_tenant from orders where id = new.order_id;
  if order_tenant is null then
    raise exception 'order not found';
  end if;
  if new.product_id is not null then
    select tenant_id into product_tenant from products where id = new.product_id;
    if product_tenant is null or product_tenant <> order_tenant then
      raise exception 'order item product tenant mismatch';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists order_item_tenant_guard on order_items;
create trigger order_item_tenant_guard
before insert or update on order_items
for each row execute function enforce_order_item_tenant_consistency();
