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

-- Replace the old signup-grant bypass. Signup grants are retained as historical
-- data only and no longer authorize tenant creation.
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

  select tm.tenant_id, t.slug into existing_member
  from menu_v3.tenant_members tm
  join menu_v3.tenants t on t.id = tm.tenant_id
  where tm.user_id = p_user_id and tm.is_active = true
  order by tm.created_at
  limit 1;

  if request_row.activation_status = 'activated' then
    if existing_member.tenant_id is not null then
      return query select existing_member.tenant_id::text, existing_member.slug::text;
    end if;
    raise exception using errcode = '23505', message = 'ACTIVATION_ALREADY_COMPLETED';
  end if;

  if request_row.activation_status <> 'approved' then
    raise exception using errcode = '42501', message = 'ACTIVATION_APPROVAL_REQUIRED';
  end if;

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
  set activation_status = 'activated', status = 'converted', updated_at = now()
  where id = request_row.id and activation_status = 'approved';

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

-- Legacy registration-link activation remains available, but is now atomic and idempotent.
create or replace function menu_v3.activate_legacy_customer_workspace(
  p_onboarding_id text,
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
  onboarding_row menu_v3.lead_onboarding%rowtype;
  lead_row menu_v3.leads%rowtype;
  existing_member record;
begin
  select * into onboarding_row
  from menu_v3.lead_onboarding
  where id = p_onboarding_id
  for update;

  if onboarding_row.id is null then
    raise exception using errcode = 'P0002', message = 'LEGACY_ONBOARDING_NOT_FOUND';
  end if;

  select * into lead_row from menu_v3.leads where id = onboarding_row.lead_id limit 1;
  if lead_row.id is null then
    raise exception using errcode = 'P0002', message = 'LEGACY_LEAD_NOT_FOUND';
  end if;

  select tm.tenant_id, t.slug into existing_member
  from menu_v3.tenant_members tm
  join menu_v3.tenants t on t.id = tm.tenant_id
  where tm.user_id = p_user_id and tm.is_active = true
  order by tm.created_at
  limit 1;

  if onboarding_row.used_at is not null then
    if onboarding_row.tenant_id is not null then
      select t.slug into existing_member.slug from menu_v3.tenants t where t.id = onboarding_row.tenant_id limit 1;
      return query select onboarding_row.tenant_id::text, existing_member.slug::text;
      return;
    end if;
    if existing_member.tenant_id is not null then
      return query select existing_member.tenant_id::text, existing_member.slug::text;
      return;
    end if;
    raise exception using errcode = '23505', message = 'LEGACY_ONBOARDING_ALREADY_USED';
  end if;

  if onboarding_row.revoked_at is not null or onboarding_row.expires_at <= now() then
    raise exception using errcode = '42501', message = 'LEGACY_ONBOARDING_INVALID';
  end if;

  if existing_member.tenant_id is not null then
    update menu_v3.lead_onboarding
    set used_at = now(), tenant_id = existing_member.tenant_id
    where id = onboarding_row.id and used_at is null and revoked_at is null;
    update menu_v3.leads set status = 'converted', updated_at = now() where id = onboarding_row.lead_id;
    return query select existing_member.tenant_id::text, existing_member.slug::text;
    return;
  end if;

  insert into menu_v3.tenants (
    id, owner_user_id, slug, name_ar, name_en, city, whatsapp, is_published, is_active
  ) values (
    p_tenant_id, p_user_id, p_slug, lead_row.business_name, '', coalesce(lead_row.city, ''), coalesce(lead_row.contact_phone, ''), false, true
  );

  insert into menu_v3.tenant_members (tenant_id, user_id, role)
  values (p_tenant_id, p_user_id, 'owner');

  insert into menu_v3.branches (id, tenant_id, slug, name_ar, name_en, address_ar, is_active)
  values (p_branch_id, p_tenant_id, 'main', 'الفرع الرئيسي', '', '', true);

  insert into menu_v3.branch_hours (branch_id, weekday, opens_at, closes_at, is_closed)
  values
    (p_branch_id, 0, '07:00', '00:00', false),
    (p_branch_id, 1, '07:00', '00:00', false),
    (p_branch_id, 2, '07:00', '00:00', false),
    (p_branch_id, 3, '07:00', '00:00', false),
    (p_branch_id, 4, '07:00', '00:00', false),
    (p_branch_id, 5, '13:00', '00:00', false),
    (p_branch_id, 6, '07:00', '00:00', false);

  update menu_v3.lead_onboarding
  set used_at = now(), tenant_id = p_tenant_id
  where id = onboarding_row.id and used_at is null and revoked_at is null;

  if not found then
    raise exception using errcode = '40001', message = 'LEGACY_ONBOARDING_STATE_CHANGED';
  end if;

  update menu_v3.leads set status = 'converted', updated_at = now() where id = onboarding_row.lead_id;
  return query select p_tenant_id, p_slug;
end;
$$;

revoke all on function menu_v3.activate_legacy_customer_workspace(text,text,text,text,text) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function menu_v3.activate_legacy_customer_workspace(text,text,text,text,text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function menu_v3.activate_legacy_customer_workspace(text,text,text,text,text) from authenticated;
  end if;
end;
$$;
