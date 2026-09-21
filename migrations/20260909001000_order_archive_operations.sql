-- Platform/owner order operations.
-- Archive is a reversible soft-delete: it removes an order from operational lists
-- without destroying the historical order, item snapshots, or status events.

set search_path to menu_v3, public;

alter table if exists menu_v3.orders
  add column if not exists archived_at timestamptz;

create index if not exists orders_active_created_idx
  on menu_v3.orders (created_at desc)
  where archived_at is null;
