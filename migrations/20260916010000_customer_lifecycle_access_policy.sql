-- Customer lifecycle access policy.
-- New tenant workspaces require an active, platform-approved onboarding record
-- for the authenticated owner email. Existing tenants are unchanged.

create or replace function menu_v3.enforce_customer_approval_before_tenant_insert()
returns trigger
language plpgsql
security definer
set search_path = menu_v3, pg_temp
as $$
begin
  if not exists (
    select 1
    from menu_v3.lead_onboarding lo
    join menu_v3.leads l on l.id = lo.lead_id
    join menu_v3."user" u on lower(trim(u."email")) = lower(trim(l.contact_email))
    where u."id" = new.owner_user_id
      and l.status = 'qualified'
      and lo.approved_at is not null
      and lo.used_at is null
      and lo.revoked_at is null
      and lo.expires_at > now()
  ) then
    raise exception using
      errcode = '42501',
      message = 'CUSTOMER_APPROVAL_REQUIRED';
  end if;

  return new;
end;
$$;

drop trigger if exists tenants_customer_approval_guard on menu_v3.tenants;
create trigger tenants_customer_approval_guard
before insert on menu_v3.tenants
for each row execute function menu_v3.enforce_customer_approval_before_tenant_insert();

revoke all on function menu_v3.enforce_customer_approval_before_tenant_insert() from public;
