-- Saudi food disclosure foundation.
-- Values are nullable because Menu V3 must never invent regulatory data.
alter table menu_v3.products
  add column if not exists sodium_mg numeric(8,2),
  add column if not exists caffeine_mg numeric(8,2),
  add column if not exists caffeine_basis text;

alter table menu_v3.products
  drop constraint if exists products_sodium_mg_ck;
alter table menu_v3.products
  add constraint products_sodium_mg_ck
  check (sodium_mg is null or (sodium_mg >= 0 and sodium_mg <= 100000));

alter table menu_v3.products
  drop constraint if exists products_caffeine_mg_ck;
alter table menu_v3.products
  add constraint products_caffeine_mg_ck
  check (caffeine_mg is null or (caffeine_mg >= 0 and caffeine_mg <= 100000));

alter table menu_v3.products
  drop constraint if exists products_caffeine_basis_ck;
alter table menu_v3.products
  add constraint products_caffeine_basis_ck
  check (caffeine_basis is null or caffeine_basis in ('per_100ml', 'per_cup'));
