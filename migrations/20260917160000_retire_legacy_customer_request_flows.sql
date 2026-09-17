-- Retire the legacy customer-request and approval surfaces now that customer signup is self-serve.
-- Historical schema objects remain migration-compatible, but they no longer receive
-- new records or participate in the active customer lifecycle.
set search_path to menu_v3, public;

drop trigger if exists tenants_platform_customer_request on menu_v3.tenants;
drop function if exists menu_v3.create_platform_customer_request();

-- Remove request records that were previously surfaced to Platform Admin.
delete from menu_v3.lead_onboarding;
delete from menu_v3.customer_requests;
delete from public.service_requests;
delete from menu_v3.leads;

-- Keep the tenant insert guard fail-closed: only the dedicated server-side
-- provisioning function may create a new tenant through this path.
create or replace function menu_v3.enforce_customer_approval_before_tenant_insert()
returns trigger
language plpgsql
security definer
set search_path = menu_v3, pg_temp
as $$
declare
  provisioner_role text;
begin
  select r.rolname into provisioner_role
  from pg_proc p
  join pg_roles r on r.oid = p.proowner
  where p.oid = 'menu_v3.provision_customer_workspace(text,text,text,text,text,text)'::regprocedure;

  if current_setting('menu_v3.provision_customer_workspace', true) = '1'
     and provisioner_role is not null
     and session_user = provisioner_role then
    return new;
  end if;

  raise exception using
    errcode = '42501',
    message = 'CUSTOMER_WORKSPACE_PROVISIONING_REQUIRED';
end;
$$;

revoke all on function menu_v3.enforce_customer_approval_before_tenant_insert() from public;

-- Re-create the guard trigger after replacing its function. This preserves
-- fail-closed tenant creation while allowing only the dedicated provisioning
-- function's transaction-local marker to pass.
create trigger tenants_platform_customer_request
before insert on menu_v3.tenants
for each row execute function menu_v3.enforce_customer_approval_before_tenant_insert();
