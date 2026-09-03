-- Menu V3 Level 4A: durable authorization foundation.
-- This migration is intentionally additive: existing tenant_members.role remains
-- compatible while access_role becomes the canonical authorization role.
set search_path = menu_v3, public;

alter table menu_v3.tenant_members
  add column if not exists access_role text,
  add column if not exists branch_scope text[] null,
  add column if not exists is_active boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

update menu_v3.tenant_members
set access_role = case role
  when 'owner' then 'tenant_owner'
  when 'admin' then 'branch_manager'
  when 'editor' then 'editor'
  else 'staff'
end
where access_role is null;

alter table menu_v3.tenant_members
  alter column access_role set default 'staff',
  alter column access_role set not null;

alter table menu_v3.tenant_members
  drop constraint if exists tenant_members_access_role_check;
alter table menu_v3.tenant_members
  add constraint tenant_members_access_role_check
  check (access_role in ('tenant_owner','branch_manager','staff','editor'));

create index if not exists tenant_members_access_role_idx
  on menu_v3.tenant_members (tenant_id, access_role)
  where is_active = true;
create index if not exists tenant_members_branch_scope_gin_idx
  on menu_v3.tenant_members using gin (branch_scope);

-- Platform admins are outside tenant membership. IDs use the same text type as
-- Better Auth's application user table; no client-controlled role is trusted.
create table if not exists menu_v3.platform_admins (
  user_id text primary key,
  granted_by text null,
  created_at timestamptz not null default now()
);

alter table menu_v3.platform_admins enable row level security;
revoke all on table menu_v3.platform_admins from anon, authenticated, public;

create or replace function menu_v3.is_platform_admin(p_user_id text)
returns boolean
language sql stable security definer
set search_path = menu_v3, pg_catalog
as $$
  select exists (
    select 1 from menu_v3.platform_admins pa where pa.user_id = p_user_id
  );
$$;
revoke all on function menu_v3.is_platform_admin(text) from public, anon, authenticated;
grant execute on function menu_v3.is_platform_admin(text) to postgres;

create or replace function menu_v3.get_tenant_role(p_user_id text, p_tenant_id text)
returns text
language sql stable security definer
set search_path = menu_v3, pg_catalog
as $$
  select tm.access_role
  from menu_v3.tenant_members tm
  where tm.user_id = p_user_id
    and tm.tenant_id = p_tenant_id
    and tm.is_active = true
  limit 1;
$$;
revoke all on function menu_v3.get_tenant_role(text,text) from public, anon, authenticated;
grant execute on function menu_v3.get_tenant_role(text,text) to postgres;

create or replace function menu_v3.has_tenant_access(p_user_id text, p_tenant_id text)
returns boolean
language sql stable security definer
set search_path = menu_v3, pg_catalog
as $$
  select menu_v3.is_platform_admin(p_user_id)
    or exists (
      select 1 from menu_v3.tenant_members tm
      where tm.user_id = p_user_id
        and tm.tenant_id = p_tenant_id
        and tm.is_active = true
    );
$$;
revoke all on function menu_v3.has_tenant_access(text,text) from public, anon, authenticated;
grant execute on function menu_v3.has_tenant_access(text,text) to postgres;

create or replace function menu_v3.has_branch_access(p_user_id text, p_tenant_id text, p_branch_id text)
returns boolean
language sql stable security definer
set search_path = menu_v3, pg_catalog
as $$
  select menu_v3.is_platform_admin(p_user_id)
    or exists (
      select 1
      from menu_v3.tenant_members tm
      join menu_v3.branches b on b.tenant_id = tm.tenant_id
      where tm.user_id = p_user_id
        and tm.tenant_id = p_tenant_id
        and tm.is_active = true
        and b.id = p_branch_id
        and (
          tm.access_role in ('tenant_owner','branch_manager')
          or tm.branch_scope is null
          or p_branch_id = any(tm.branch_scope)
        )
    );
$$;
revoke all on function menu_v3.has_branch_access(text,text,text) from public, anon, authenticated;
grant execute on function menu_v3.has_branch_access(text,text,text) to postgres;

create or replace function menu_v3.get_user_context(p_user_id text)
returns table (
  is_platform_admin boolean,
  tenant_id text,
  role text,
  branch_scope text[]
)
language sql stable security definer
set search_path = menu_v3, pg_catalog
as $$
  select
    menu_v3.is_platform_admin(p_user_id),
    tm.tenant_id,
    tm.access_role,
    tm.branch_scope
  from menu_v3.tenant_members tm
  where tm.user_id = p_user_id
    and tm.is_active = true;
$$;
revoke all on function menu_v3.get_user_context(text) from public, anon, authenticated;
grant execute on function menu_v3.get_user_context(text) to postgres;
