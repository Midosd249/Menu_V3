-- Level 4: branch-scoped authorization foundation.
-- Owner/Admin retain tenant-wide branch access; Editors require explicit branch grants.
create table if not exists menu_v3.member_branch_access (
  tenant_id text not null,
  user_id text not null,
  branch_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, branch_id),
  foreign key (tenant_id) references menu_v3.tenants(id) on delete cascade,
  foreign key (branch_id) references menu_v3.branches(id) on delete cascade
);

create index if not exists member_branch_access_tenant_user_idx
  on menu_v3.member_branch_access (tenant_id, user_id);

create index if not exists member_branch_access_branch_idx
  on menu_v3.member_branch_access (branch_id, user_id);

alter table menu_v3.member_branch_access enable row level security;

create or replace function menu_v3.can_access_branch(p_user_id text, p_branch_id text)
returns boolean
language sql
stable
security definer
set search_path = menu_v3, pg_catalog
as $$
  select exists (
    select 1
    from menu_v3.tenant_members tm
    join menu_v3.branches b on b.tenant_id = tm.tenant_id
    where tm.user_id = p_user_id
      and b.id = p_branch_id
      and (
        tm.role in ('owner', 'admin')
        or exists (
          select 1
          from menu_v3.member_branch_access mba
          where mba.user_id = tm.user_id
            and mba.branch_id = b.id
            and mba.tenant_id = tm.tenant_id
        )
      )
  );
$$;

revoke all on table menu_v3.member_branch_access from anon, authenticated, public;
revoke all on function menu_v3.can_access_branch(text, text) from anon, authenticated, public;
grant execute on function menu_v3.can_access_branch(text, text) to postgres;
