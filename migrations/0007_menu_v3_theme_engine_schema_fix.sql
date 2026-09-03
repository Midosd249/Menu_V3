-- Menu V3 Theme Engine: repair the schema-qualified migration.
-- 0006_theme_engine.sql targets public.tenants, while production Menu V3 may
-- run against menu_v3. PGlite uses public.tenants, so apply this repair only
-- when the canonical menu_v3 schema actually exists.

do $$
begin
  if to_regnamespace('menu_v3') is not null then
    execute $migration$
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
    $migration$;
  end if;
end $$;
