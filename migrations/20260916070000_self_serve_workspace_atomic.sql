-- Atomic self-serve workspace creation.
-- The existing tenant trigger remains the final approval boundary and consumes
-- the one-time self-serve grant during the tenant insert. Wrapping the tenant,
-- membership, branch, and hours inserts in one database function keeps grant
-- consumption and workspace creation atomic.
set search_path to menu_v3, public;

create or replace function menu_v3.create_self_serve_workspace(
  p_user_id text,
  p_tenant_id text,
  p_branch_id text,
  p_slug text,
  p_name_ar text,
  p_name_en text,
  p_description_ar text,
  p_business_type text
)
returns void
language plpgsql
security invoker
set search_path = menu_v3, pg_temp
as $$
begin
  if not exists (
    select 1
    from menu_v3.self_serve_registration_grants g
    where g.user_id = p_user_id
      and g.used_at is null
  ) then
    raise exception using
      errcode = '42501',
      message = 'SELF_SERVE_GRANT_REQUIRED';
  end if;

  if not exists (
    select 1
    from menu_v3."user" u
    where u."id" = p_user_id
      and u."phoneNumber" like '+9665%'
  ) then
    raise exception using
      errcode = '42501',
      message = 'CUSTOMER_PHONE_REQUIRED';
  end if;

  if p_name_ar is null or char_length(trim(p_name_ar)) < 2 or char_length(trim(p_name_ar)) > 80 then
    raise exception using errcode = '22023', message = 'INVALID_BRAND_NAME';
  end if;

  if p_name_en is not null and char_length(trim(p_name_en)) > 80 then
    raise exception using errcode = '22023', message = 'INVALID_ENGLISH_BRAND_NAME';
  end if;

  if p_description_ar is not null and char_length(trim(p_description_ar)) > 160 then
    raise exception using errcode = '22023', message = 'INVALID_BRAND_DESCRIPTION';
  end if;

  insert into menu_v3.tenants (
    id, owner_user_id, slug, name_ar, name_en, tagline_ar, business_type,
    is_published, is_active
  ) values (
    p_tenant_id, p_user_id, p_slug, trim(p_name_ar), coalesce(trim(p_name_en), ''),
    coalesce(trim(p_description_ar), ''), p_business_type, false, true
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
end;
$$;

revoke all on function menu_v3.create_self_serve_workspace(text,text,text,text,text,text,text,text) from public, anon, authenticated;
do $$
begin
  execute format(
    'grant execute on function menu_v3.create_self_serve_workspace(text,text,text,text,text,text,text,text) to %I',
    current_user
  );
end;
$$;
