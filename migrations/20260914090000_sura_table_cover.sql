begin;

update menu_v3.tenants
set cover_url = '/menu-covers/sura-table.svg',
    updated_at = now()
where id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497'
  and slug = 'sura-table';

commit;
