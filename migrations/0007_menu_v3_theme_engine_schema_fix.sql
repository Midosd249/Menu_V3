-- Menu V3 Theme Engine: repair the schema-qualified migration.
-- 0006_theme_engine.sql targeted public.tenants, while Menu V3 runs against menu_v3.
-- Keep published theme state in the canonical Menu V3 tenant table.

alter table menu_v3.tenants
  add column if not exists theme_key text not null default 'editorial';

update menu_v3.tenants
set theme_key = 'editorial'
where theme_key is null or theme_key not in (
  'editorial',
  'dark-dining',
  'coffee',
  'heritage',
  'fast-casual',
  'gallery',
  'immersive',
  'minimal'
);

alter table menu_v3.tenants
  drop constraint if exists tenants_theme_key_check;

alter table menu_v3.tenants
  add constraint tenants_theme_key_check
  check (theme_key in (
    'editorial',
    'dark-dining',
    'coffee',
    'heritage',
    'fast-casual',
    'gallery',
    'immersive',
    'minimal'
  ));

create index if not exists tenants_theme_key_idx
  on menu_v3.tenants(theme_key);
