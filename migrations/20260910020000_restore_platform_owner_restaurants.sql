-- Restore the designated platform-owner account and the existing Mint Blossom customer workspace.
-- Ownership remains singular per tenant; the platform owner receives admin membership on
-- the other existing tenants rather than transferring their ownership.
set search_path = menu_v3, public;

insert into platform_admins (user_id)
values ('w7VBsriXFgVJbzlCn9tKhsi3tvpThKun')
on conflict (user_id) do nothing;

update tenants
set owner_user_id = 'w7VBsriXFgVJbzlCn9tKhsi3tvpThKun',
    updated_at = now()
where slug = 'mndy-alwtnya';

insert into tenant_members (tenant_id, user_id, role, access_role, is_active, updated_at)
select id, 'w7VBsriXFgVJbzlCn9tKhsi3tvpThKun', 'owner', 'tenant_owner', true, now()
from tenants
where slug = 'mndy-alwtnya'
on conflict (tenant_id, user_id) do update
set role = 'owner', access_role = 'tenant_owner', is_active = true, updated_at = now();

insert into tenant_members (tenant_id, user_id, role, access_role, is_active, updated_at)
select id, 'w7VBsriXFgVJbzlCn9tKhsi3tvpThKun', 'admin', 'tenant_owner', true, now()
from tenants
where slug in ('nafas', 'omdorman-boys')
  and owner_user_id <> 'w7VBsriXFgVJbzlCn9tKhsi3tvpThKun'
on conflict (tenant_id, user_id) do update
set role = 'admin', access_role = 'tenant_owner', is_active = true, updated_at = now();

update customer_requests cr
set owner_user_id = 'w7VBsriXFgVJbzlCn9tKhsi3tvpThKun',
    status = case when cr.status = 'rejected' then 'pending' else cr.status end,
    updated_at = now()
from tenants t
where cr.tenant_id = t.id
  and t.slug = 'mndy-alwtnya';

insert into customer_requests (id, tenant_id, owner_user_id, status)
select 'cr-' || t.id, t.id, t.owner_user_id, 'pending'
from tenants t
where t.slug = 'mndy-alwtnya'
on conflict (tenant_id) do nothing;
