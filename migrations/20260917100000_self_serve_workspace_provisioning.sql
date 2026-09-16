-- PH-01.3: secure self-serve workspace provisioning.
-- Historical self-serve grants remain retired. Legacy Customer Lifecycle
-- approval/registration-link paths remain valid and continue to use the
-- existing approval guard.
set search_path to menu_v3, public;

create or replace function menu_v3.enforce_customer_approval_before_tenant_insert()
returns trigger
language plpgsql
security definer
set search_path = menu_v3, pg_temp
as $$
declare
  provisioner_role text;
begin
  -- A tenant created by the dedicated PH-01.3 provisioning function is
  -- authorized by that function's server-only execution path, not by a
  -- self-serve grant and not by client-supplied approval state.
  select r.rolname into provisioner_role
  from pg_proc p
  join pg_roles r on r.oid = p.proowner
  where p.oid = 'menu_v3.provision_customer_workspace(text,text,text,text,text,text)'::regprocedure;

  if current_setting('menu_v3.provision_customer_workspace', true) = '1'
     and provisioner_role is not null
     and current_user = provisioner_role then
    return new;
  end if;

  -- Preserve the existing legacy approved registration-link path.
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

  -- Preserve the existing account-bound approved lifecycle path.
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

create or replace function menu_v3.provision_customer_workspace(
  p_user_id text,
  p_slug text,
  p_name_ar text,
  p_name_en text,
  p_description_ar text,
  p_business_type text
)
returns table (tenant_id text, slug text)
language plpgsql
security definer
set search_path = menu_v3, pg_catalog, pg_temp
as $$
declare
  user_row record;
  existing_member record;
  existing_owned_tenant record;
  branch_row record;
  final_slug text;
  slug_suffix text;
  new_tenant_id text;
  new_branch_id text;
  provisioner_role text;
begin
  if p_user_id is null or btrim(p_user_id) = '' then
    raise exception using errcode = '42501', message = 'PROVISIONING_USER_REQUIRED';
  end if;

  if p_name_ar is null or char_length(btrim(p_name_ar)) < 2 or char_length(btrim(p_name_ar)) > 80 then
    raise exception using errcode = '22023', message = 'INVALID_BRAND_NAME';
  end if;
  if p_name_en is not null and char_length(btrim(p_name_en)) > 80 then
    raise exception using errcode = '22023', message = 'INVALID_ENGLISH_BRAND_NAME';
  end if;
  if p_description_ar is not null and char_length(btrim(p_description_ar)) > 160 then
    raise exception using errcode = '22023', message = 'INVALID_BRAND_DESCRIPTION';
  end if;
  if p_business_type is null or p_business_type not in ('restaurant', 'cafe', 'bakery', 'dessert', 'food_truck', 'other') then
    raise exception using errcode = '22023', message = 'INVALID_BUSINESS_TYPE';
  end if;
  if p_slug is null or btrim(p_slug) = '' or p_slug !~ '^[a-z0-9][a-z0-9-]{0,62}$' then
    raise exception using errcode = '22023', message = 'INVALID_WORKSPACE_SLUG';
  end if;

  -- Serialize all provisioning attempts for the same authenticated account.
  select u."id", u."email", u."phoneNumber" as phone
  into user_row
  from menu_v3."user" u
  where u."id" = p_user_id
  for update;

  if user_row."id" is null then
    raise exception using errcode = 'P0002', message = 'PROVISIONING_USER_NOT_FOUND';
  end if;
  if user_row.phone is null or user_row.phone !~ '^\+9665[0-9]{8}$' then
    raise exception using errcode = '42501', message = 'CUSTOMER_PHONE_REQUIRED';
  end if;

  -- Legacy lead/service-request accounts remain on the protected approval
  -- lifecycle and cannot be converted into self-serve workspaces here.
  if exists (
    select 1 from menu_v3.leads l
    where l.account_user_id = p_user_id
       or (l.contact_email is not null and lower(trim(l.contact_email)) = lower(trim(user_row."email")))
  ) then
    raise exception using errcode = '42501', message = 'CUSTOMER_APPROVAL_REQUIRED';
  end if;

  select tm.tenant_id, t.slug
  into existing_member
  from menu_v3.tenant_members tm
  join menu_v3.tenants t on t.id = tm.tenant_id
  where tm.user_id = p_user_id and tm.is_active = true
  order by tm.created_at
  limit 1;

  if existing_member.tenant_id is not null then
    return query select existing_member.tenant_id::text, existing_member.slug::text;
    return;
  end if;

  -- Recover a tenant created by a previous partial/legacy attempt for this
  -- owner rather than ever creating a second workspace.
  select t.id, t.slug
  into existing_owned_tenant
  from menu_v3.tenants t
  where t.owner_user_id = p_user_id
  order by t.created_at
  limit 1;

  if existing_owned_tenant.id is not null then
    insert into menu_v3.tenant_members (tenant_id, user_id, role)
    values (existing_owned_tenant.id, p_user_id, 'owner')
    on conflict (tenant_id, user_id) do update set role = 'owner', is_active = true;

    select b.id
    into branch_row
    from menu_v3.branches b
    where b.tenant_id = existing_owned_tenant.id and b.is_active = true
    order by b.created_at
    limit 1;

    if branch_row.id is null then
      new_branch_id := gen_random_uuid()::text;
      insert into menu_v3.branches (id, tenant_id, slug, name_ar, name_en, address_ar, is_active)
      values (new_branch_id, existing_owned_tenant.id, 'main', 'الفرع الرئيسي', 'Main branch', '', true);
      branch_row.id := new_branch_id;
    end if;

    insert into menu_v3.branch_hours (branch_id, weekday, opens_at, closes_at, is_closed)
    values
      (branch_row.id, 0, '07:00', '00:00', false),
      (branch_row.id, 1, '07:00', '00:00', false),
      (branch_row.id, 2, '07:00', '00:00', false),
      (branch_row.id, 3, '07:00', '00:00', false),
      (branch_row.id, 4, '07:00', '00:00', false),
      (branch_row.id, 5, '13:00', '00:00', false),
      (branch_row.id, 6, '07:00', '00:00', false)
    on conflict (branch_id, weekday) do nothing;

    return query select existing_owned_tenant.id::text, existing_owned_tenant.slug::text;
    return;
  end if;

  final_slug := btrim(p_slug);
  if exists (select 1 from menu_v3.tenants t where t.slug = final_slug) then
    slug_suffix := left(md5(p_user_id), 8);
    final_slug := left(final_slug, 54) || '-' || slug_suffix;
  end if;
  if exists (select 1 from menu_v3.tenants t where t.slug = final_slug) then
    final_slug := left(final_slug, 44) || '-' || left(md5(p_user_id || ':' || p_name_ar), 18);
  end if;
  if final_slug !~ '^[a-z0-9][a-z0-9-]{0,62}$' then
    raise exception using errcode = '22023', message = 'INVALID_WORKSPACE_SLUG';
  end if;

  new_tenant_id := gen_random_uuid()::text;
  new_branch_id := gen_random_uuid()::text;

  select r.rolname into provisioner_role
  from pg_proc p
  join pg_roles r on r.oid = p.proowner
  where p.oid = 'menu_v3.provision_customer_workspace(text,text,text,text,text,text)'::regprocedure;
  if provisioner_role is null or current_user <> provisioner_role then
    raise exception using errcode = '42501', message = 'PROVISIONING_AUTHORITY_REQUIRED';
  end if;

  -- Transaction-local marker is visible only for the tenant insert below and
  -- disappears automatically when this transaction ends.
  perform set_config('menu_v3.provision_customer_workspace', '1', true);

  insert into menu_v3.tenants (
    id, owner_user_id, slug, name_ar, name_en, tagline_ar, business_type,
    is_published, is_active
  ) values (
    new_tenant_id, p_user_id, final_slug, btrim(p_name_ar), coalesce(btrim(p_name_en), ''),
    coalesce(btrim(p_description_ar), ''), p_business_type, false, true
  );

  insert into menu_v3.tenant_members (tenant_id, user_id, role)
  values (new_tenant_id, p_user_id, 'owner');

  insert into menu_v3.branches (id, tenant_id, slug, name_ar, name_en, address_ar, is_active)
  values (new_branch_id, new_tenant_id, 'main', 'الفرع الرئيسي', 'Main branch', '', true);

  insert into menu_v3.branch_hours (branch_id, weekday, opens_at, closes_at, is_closed)
  values
    (new_branch_id, 0, '07:00', '00:00', false),
    (new_branch_id, 1, '07:00', '00:00', false),
    (new_branch_id, 2, '07:00', '00:00', false),
    (new_branch_id, 3, '07:00', '00:00', false),
    (new_branch_id, 4, '07:00', '00:00', false),
    (new_branch_id, 5, '13:00', '00:00', false),
    (new_branch_id, 6, '07:00', '00:00', false);

  return query select new_tenant_id, final_slug;
end;
$$;

revoke all on function menu_v3.provision_customer_workspace(text,text,text,text,text,text) from public, anon, authenticated;
grant execute on function menu_v3.provision_customer_workspace(text,text,text,text,text,text) to postgres;
