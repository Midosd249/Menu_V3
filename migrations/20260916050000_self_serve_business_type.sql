-- Self-serve customer onboarding: persist the business type chosen during brand setup.
set search_path to menu_v3, public;

alter table menu_v3.tenants
  add column if not exists business_type text not null default 'restaurant';

alter table menu_v3.tenants
  drop constraint if exists tenants_business_type_ck;

alter table menu_v3.tenants
  add constraint tenants_business_type_ck
  check (business_type in ('restaurant', 'cafe', 'bakery', 'dessert', 'food_truck', 'other'));
