-- Golden Demo data correction: include two real sodium-driven high-salt cases.
update menu_v3.products
set sodium_mg = 2050,
    updated_at = now()
where id = 'golden-p-mutabbaq'
  and tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497';
