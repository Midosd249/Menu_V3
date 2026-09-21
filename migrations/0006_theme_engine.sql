-- Menu V3 Theme Engine: tenant-scoped published theme.
-- Safe for existing tenants: all rows receive Editorial by default.

alter table public.tenants
  add column if not exists theme_key text not null default 'editorial';

update public.tenants
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

alter table public.tenants
  drop constraint if exists tenants_theme_key_check;

alter table public.tenants
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

create index if not exists tenants_theme_key_idx on public.tenants(theme_key);
