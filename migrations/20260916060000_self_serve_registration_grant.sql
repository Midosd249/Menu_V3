-- Self-serve registration authorization.
-- The application server grants one tenant-creation capability immediately after
-- successful account registration. The database trigger consumes it at tenant insert.
set search_path to menu_v3, public;

create table if not exists menu_v3.self_serve_registration_grants (
  user_id text primary key,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

alter table menu_v3.self_serve_registration_grants enable row level security;

revoke all on menu_v3.self_serve_registration_grants from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on menu_v3.self_serve_registration_grants from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on menu_v3.self_serve_registration_grants from authenticated;
  end if;
end;
$$;

create or replace function menu_v3.enforce_customer_approval_before_tenant_insert()
returns trigger
language plpgsql
security definer
set search_path = menu_v3, pg_temp
as $$
begin
  if exists (
    select 1
    from menu_v3.self_serve_registration_grants g
    where g.user_id = new.owner_user_id
      and g.used_at is null
  ) then
    update menu_v3.self_serve_registration_grants
    set used_at = now()
    where user_id = new.owner_user_id and used_at is null;
    return new;
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
