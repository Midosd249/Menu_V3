-- R8.4 evidence-based upsell signals and owner-approved recommendations.
-- Uses existing event/order truth and keeps recommendation state separate from menu content.

create table if not exists menu_upsell_recommendations (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  branch_id text not null references branches(id) on delete cascade,
  source_product_id text not null references products(id) on delete cascade,
  recommended_product_id text not null references products(id) on delete cascade,
  status text not null default 'approved',
  evidence_score numeric not null default 0,
  co_view_sessions integer not null default 0,
  co_cart_orders integer not null default 0,
  co_order_orders integer not null default 0,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menu_upsell_pair_ck check (source_product_id <> recommended_product_id),
  constraint menu_upsell_status_ck check (status in ('approved', 'dismissed')),
  unique (tenant_id, branch_id, source_product_id, recommended_product_id)
);

create index if not exists menu_upsell_tenant_status_idx
  on menu_upsell_recommendations (tenant_id, branch_id, status, updated_at desc);

create index if not exists menu_upsell_source_idx
  on menu_upsell_recommendations (tenant_id, source_product_id, status);

alter table menu_events
  drop constraint if exists menu_events_type_ck;

alter table menu_events
  add constraint menu_events_type_ck
  check (event_type in (
    'visit', 'product_view', 'qr_scan', 'whatsapp',
    'upsell_impression', 'upsell_click'
  ));

create index if not exists menu_events_product_type_idx
  on menu_events (tenant_id, branch_id, event_type, product_id, created_at desc);
