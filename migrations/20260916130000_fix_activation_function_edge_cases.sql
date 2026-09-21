-- Forward-only correction for null descriptions and PL/pgSQL output-name ambiguity.
set search_path to menu_v3, public;

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
  select * into request_row from menu_v3.leads where id = p_request_id for update;
  if request_row.id is null then raise exception using errcode = 'P0002', message = 'ACTIVATION_REQUEST_NOT_FOUND'; end if;
  if request_row.account_user_id <> p_user_id then raise exception using errcode = '42501', message = 'ACTIVATION_REQUEST_USER_MISMATCH'; end if;

  select tm.tenant_id, t.slug into existing_member
  from menu_v3.tenant_members tm
  join menu_v3.tenants t on t.id = tm.tenant_id
  where tm.user_id = p_user_id and tm.is_active = true
  order by tm.created_at limit 1;

  if request_row.activation_status = 'activated' then
    if existing_member.tenant_id is not null then return query select existing_member.tenant_id::text, existing_member.slug::text; end if;
    raise exception using errcode = '23505', message = 'ACTIVATION_ALREADY_COMPLETED';
  end if;
  if request_row.activation_status <> 'approved' then raise exception using errcode = '42501', message = 'ACTIVATION_APPROVAL_REQUIRED'; end if;

  if existing_member.tenant_id is not null then
    update menu_v3.leads set activation_status = 'activated', status = 'converted', updated_at = now(), decision_at = coalesce(decision_at, now()) where id = request_row.id;
    return query select existing_member.tenant_id::text, existing_member.slug::text;
  end if;

  insert into menu_v3.tenants (id, owner_user_id, slug, name_ar, name_en, tagline_ar, business_type, is_published, is_active)
  values (p_tenant_id, p_user_id, p_slug, request_row.business_name, request_row.brand_name_en, coalesce(request_row.details, ''), request_row.business_type, false, true);

  insert into menu_v3.tenant_members (tenant_id, user_id, role) values (p_tenant_id, p_user_id, 'owner');
  insert into menu_v3.branches (id, tenant_id, slug, name_ar, name_en, address_ar, is_active)
  values (p_branch_id, p_tenant_id, 'main', 'الفرع الرئيسي', 'Main branch', '', true);
  insert into menu_v3.branch_hours (branch_id, weekday, opens_at, closes_at, is_closed)
  values
    (p_branch_id, 0, '07:00', '00:00', false), (p_branch_id, 1, '07:00', '00:00', false),
    (p_branch_id, 2, '07:00', '00:00', false), (p_branch_id, 3, '07:00', '00:00', false),
    (p_branch_id, 4, '07:00', '00:00', false), (p_branch_id, 5, '13:00', '00:00', false),
    (p_branch_id, 6, '07:00', '00:00', false);

  update menu_v3.leads set activation_status = 'activated', status = 'converted', updated_at = now()
  where id = request_row.id and activation_status = 'approved';
  if not found then raise exception using errcode = '40001', message = 'ACTIVATION_REQUEST_STATE_CHANGED'; end if;
  return query select p_tenant_id, p_slug;
end;
$$;

create or replace function menu_v3.approve_legacy_lead(
  p_lead_id text,
  p_token_hash text,
  p_expires_at timestamptz,
  p_created_by text
)
returns table (onboarding_id text, expires_at timestamptz)
language plpgsql
security definer
set search_path = menu_v3, pg_temp
as $$
declare
  lead_row menu_v3.leads%rowtype;
  onboarding_id text;
begin
  select * into lead_row from menu_v3.leads where id = p_lead_id for update;
  if lead_row.id is null then raise exception using errcode = 'P0002', message = 'LEGACY_LEAD_NOT_FOUND'; end if;
  if exists (
    select 1 from menu_v3.lead_onboarding lo
    where lo.lead_id = p_lead_id and lo.used_at is null and lo.revoked_at is null and lo.expires_at > now()
  ) then raise exception using errcode = '23505', message = 'LEGACY_APPROVAL_ALREADY_ACTIVE'; end if;

  onboarding_id := md5(p_lead_id || ':' || p_token_hash || ':' || clock_timestamp()::text);
  insert into menu_v3.lead_onboarding (id, lead_id, token_hash, expires_at, approved_at, created_by)
  values (onboarding_id, p_lead_id, p_token_hash, p_expires_at, now(), p_created_by);
  update menu_v3.leads set status = 'qualified', updated_at = now() where id = p_lead_id;
  return query select onboarding_id, p_expires_at;
end;
$$;
