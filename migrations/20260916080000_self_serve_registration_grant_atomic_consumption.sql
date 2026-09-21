-- Atomic one-time consumption hardening for self-serve registration grants.
-- This is forward-only: the existing trigger is redefined so an unused grant is
-- claimed by one conditional UPDATE and the affected-row count is authoritative.
set search_path to menu_v3, public;

create or replace function menu_v3.enforce_customer_approval_before_tenant_insert()
returns trigger
language plpgsql
security definer
set search_path = menu_v3, pg_temp
as $$
declare
  consumed_user_id text;
  grant_exists boolean;
begin
  update menu_v3.self_serve_registration_grants
  set used_at = now()
  where user_id = new.owner_user_id
    and used_at is null
  returning user_id into consumed_user_id;

  if consumed_user_id is not null then
    return new;
  end if;

  select exists (
    select 1
    from menu_v3.self_serve_registration_grants g
    where g.user_id = new.owner_user_id
  )
  into grant_exists;

  if grant_exists then
    raise exception using
      errcode = '42501',
      message = 'SELF_SERVE_GRANT_ALREADY_USED';
  end if;

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
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function menu_v3.enforce_customer_approval_before_tenant_insert() from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function menu_v3.enforce_customer_approval_before_tenant_insert() from authenticated;
  end if;
end;
$$;
