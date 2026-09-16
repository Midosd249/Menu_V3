-- Unify account registration with the existing lead/customer approval system.
-- New accounts create an activation request, never a tenant.
-- Existing legacy lead onboarding remains valid as a backward-compatible fallback.

set search_path to menu_v3, public;

alter table menu_v3.leads
  add column if not exists account_user_id text,
  add column if not exists brand_name_en text not null default '',
  add column if not exists business_type text not null default 'restaurant',
  add column if not exists activation_status text not null default 'legacy',
  add column if not exists activation_requested_at timestamptz,
  add column if not exists decision_at timestamptz,
  add column if not exists decision_by text,
  add column if not exists decision_reason text not null default '';

alter table menu_v3.leads drop constraint if exists leads_activation_status_ck;
alter table menu_v3.leads add constraint leads_activation_status_ck
  check (activation_status in ('legacy', 'pending', 'action_required', 'approved', 'activated', 'rejected'));

create unique index if not exists leads_account_user_unique_idx
  on menu_v3.leads (account_user_id)
  where account_user_id is not null;

create index if not exists leads_activation_status_idx
  on menu_v3.leads (activation_status, updated_at desc)
  where activation_status <> 'legacy';

create index if not exists leads_account_user_idx
  on menu_v3.leads (account_user_id)
  where account_user_id is not null;

-- Replace the old grant bypass. Signup grants are retained as historical data only;
-- they no longer authorize tenant creation.
create or replace function menu_v3.enforce_customer_approval_before_tenant_insert()
returns trigger
language plpgsql
security definer
set search_path = menu_v3, pg_temp
as $$
begin
  if exists (
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
    return new;
  end if;

  if exists (
    select 1
    from menu_v3.leads l
    where l.account_user_id = new.owner_user_id
      and l.activation_status = 'approved'
  ) then
    return new;
  end if;

  raise exception using
    errcode = '42501',
    message = 'CUSTOMER_APPROVAL_REQUIRED';
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

-- The only new tenant-creation path for the customer activation lifecycle.
-- The request row is locked before any tenant insert, so concurrent activation
-- attempts cannot create duplicate tenants or memberships.
create or replace function menu_v3.activate_customer_workspace(
  p_request_id text,
  p_user_id text,
  p_tenant_id text,
  p_branch_id text,
  p_slug text
)
returns table (tenant_id text, slug text)
language plpgsql
security definer
set search_path = menu_v3, pg_temp
as $$
declare
  request_row menu_v3.leads%rowtype;
  existing_member record;
begin
  select * into request_row
  from menu_v3.leads
  where id = p_request_id
  for update;

  if request_row.id is null then
    raise exception using errcode = 'P0002', message = 'ACTIVATION_REQUEST_NOT_FOUND';
  end if;

  if request_row.account_user_id <> p_user_id then
    raise exception using errcode = '42501', message = 'ACTIVATION_REQUEST_USER_MISMATCH';
  end if;

  if request_row.activation_status = 'activated' then
    if request_row.details is not null then
      select tm.tenant_id, t.slug into existing_member
      from menu_v3.tenant_members tm
      join menu_v3.tenants t on t.id = tm.tenant_id
      where tm.user_id = p_user_id and tm.is_active = true
      order by tm.created_at
      limit 1;
      if existing_member.tenant_id is not null then
        return query select existing_member.tenant_id::text, existing_member.slug::text;
        return;
      end if;
    end if;
    raise exception using errcode = '23505', message = 'ACTIVATION_ALREADY_COMPLETED';
  end if;

  if request_row.activation_status <> 'approved' then
    raise exception using errcode = '42501', message = 'ACTIVATION_APPROVAL_REQUIRED';
  end if;

  select tm.tenant_id, t.slug into existing_member
  from menu_v3.tenant_members tm
  join menu_v3.tenants t on t.id = tm.tenant_id
  where tm.user_id = p_user_id and tm.is_active = true
  order by tm.created_at
  limit 1;

  if existing_member.tenant_id is not null then
    update menu_v3.leads
    set activation_status = 'activated', status = 'converted', updated_at = now(), decision_at = coalesce(decision_at, now())
    where id = request_row.id;
    return query select existing_member.tenant_id::text, existing_member.slug::text;
    return;
  end if;

  insert into menu_v3.tenants (
    id, owner_user_id, slug, name_ar, name_en, tagline_ar, business_type,
    is_published, is_active
  ) values (
    p_tenant_id, p_user_id, p_slug, request_row.business_name,
    request_row.brand_name_en, request_row.details, request_row.business_type,
    false, true
  );

  insert into menu_v3.tenant_members (tenant_id, user_id, role)
  values (p_tenant_id, p_user_id, 'owner');

  insert into menu_v3.branches (
    id, tenant_id, slug, name_ar, name_en, address_ar, is_active
  ) values (
    p_branch_id, p_tenant_id, 'main', 'الفرع الرئيسي', 'Main branch', '', true
  );

  insert into menu_v3.branch_hours (branch_id, weekday, opens_at, closes_at, is_closed)
  values
    (p_branch_id, 0, '07:00', '00:00', false),
    (p_branch_id, 1, '07:00', '00:00', false),
    (p_branch_id, 2, '07:00', '00:00', false),
    (p_branch_id, 3, '07:00', '00:00', false),
    (p_branch_id, 4, '07:00', '00:00', false),
    (p_branch_id, 5, '13:00', '00:00', false),
    (p_branch_id, 6, '07:00', '00:00', false);

  update menu_v3.leads
  set activation_status = 'activated',
      status = 'converted',
      updated_at = now()
  where id = request_row.id
    and activation_status = 'approved';

  if not found then
    raise exception using errcode = '40001', message = 'ACTIVATION_REQUEST_STATE_CHANGED';
  end if;

  return query select p_tenant_id, p_slug;
end;
$$;

revoke all on function menu_v3.activate_customer_workspace(text,text,text,text,text) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function menu_v3.activate_customer_workspace(text,text,text,text,text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function menu_v3.activate_customer_workspace(text,text,text,text,text) from authenticated;
  end if;
end;
$$;
