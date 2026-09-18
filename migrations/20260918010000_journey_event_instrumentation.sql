-- A.2 minimal journey instrumentation: extend the canonical menu_events stream.
-- No parallel analytics source is introduced.

alter table menu_events
  add column if not exists category_id text references categories(id) on delete set null;

alter table menu_events
  drop constraint if exists menu_events_type_ck;

alter table menu_events
  add constraint menu_events_type_ck
  check (event_type in (
    'visit',
    'product_view',
    'qr_scan',
    'whatsapp',
    'search',
    'category_view',
    'add_to_cart'
  ));

create index if not exists menu_events_category_idx
  on menu_events (tenant_id, category_id, created_at desc);
