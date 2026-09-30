create table if not exists menu_v3.product_offers (
  id text primary key, tenant_id text not null references menu_v3.tenants(id) on delete cascade,
  product_id text not null references menu_v3.products(id) on delete cascade,
  offer_type text not null, value numeric, label_ar text not null default '', label_en text not null default '',
  starts_at timestamptz, ends_at timestamptz, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint product_offers_type_ck check (offer_type in ('percentage','fixed','sale_price','bogo')),
  constraint product_offers_value_ck check (value is null or value >= 0),
  constraint product_offers_dates_ck check (ends_at is null or starts_at is null or ends_at > starts_at)
);
create unique index if not exists product_offers_one_active_idx on menu_v3.product_offers(product_id) where is_active = true;
create index if not exists product_offers_public_idx on menu_v3.product_offers(tenant_id, product_id, is_active, starts_at, ends_at);
create or replace function menu_v3.enforce_product_offer_tenant() returns trigger language plpgsql set search_path = menu_v3, pg_temp as $$
declare product_tenant text;
begin select tenant_id into product_tenant from menu_v3.products where id = new.product_id;
if product_tenant is null or product_tenant <> new.tenant_id then raise exception 'product_offer tenant mismatch'; end if; return new; end; $$;
drop trigger if exists product_offer_tenant_guard on menu_v3.product_offers;
create trigger product_offer_tenant_guard before insert or update on menu_v3.product_offers for each row execute function menu_v3.enforce_product_offer_tenant();
drop trigger if exists product_offers_public_content_version on menu_v3.product_offers;
create trigger product_offers_public_content_version after insert or update or delete on menu_v3.product_offers for each row execute function menu_v3.bump_parent_tenant_public_content_version();
