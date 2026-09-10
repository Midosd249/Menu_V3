-- Restore the designated platform-owner account and the existing Mint Blossom customer workspace.
-- Ownership remains singular per tenant; the platform owner receives admin membership on
-- the other existing tenants rather than transferring their ownership.
set search_path = menu_v3, public;

with owner as (select id from "user" where lower(email) = lower('ahmed16060080@gmail.com') limit 1)
insert into platform_admins (user_id)
select id from owner
on conflict (user_id) do nothing;

with owner as (select id from "user" where lower(email) = lower('ahmed16060080@gmail.com') limit 1)
update tenants t
set owner_user_id = owner.id, updated_at = now()
from owner
where t.slug = 'mndy-alwtnya';

with owner as (select id from "user" where lower(email) = lower('ahmed16060080@gmail.com') limit 1)
insert into tenant_members (tenant_id, user_id, role, access_role, is_active, updated_at)
select t.id, owner.id, 'owner', 'tenant_owner', true, now()
from tenants t cross join owner
where t.slug = 'mndy-alwtnya'
on conflict (tenant_id, user_id) do update
set role='owner', access_role='tenant_owner', is_active=true, updated_at=now();

with owner as (select id from "user" where lower(email) = lower('ahmed16060080@gmail.com') limit 1)
insert into tenant_members (tenant_id, user_id, role, access_role, is_active, updated_at)
select t.id, owner.id, 'admin', 'tenant_owner', true, now()
from tenants t cross join owner
where t.slug in ('nafas','omdorman-boys') and t.owner_user_id <> owner.id
on conflict (tenant_id,user_id) do update
set role='admin', access_role='tenant_owner', is_active=true, updated_at=now();

with owner as (select id from "user" where lower(email) = lower('ahmed16060080@gmail.com') limit 1)
update customer_requests cr
set owner_user_id=owner.id,
    status=case when cr.status='rejected' then 'pending' else cr.status end,
    updated_at=now()
from tenants t cross join owner
where cr.tenant_id=t.id and t.slug='mndy-alwtnya';

with owner as (select id from "user" where lower(email) = lower('ahmed16060080@gmail.com') limit 1)
insert into customer_requests (id,tenant_id,owner_user_id,status)
select 'cr-'||t.id,t.id,owner.id,'pending'
from tenants t cross join owner
where t.slug='mndy-alwtnya'
on conflict (tenant_id) do nothing;
