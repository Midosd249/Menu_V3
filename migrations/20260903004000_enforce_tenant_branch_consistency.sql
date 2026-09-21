-- Level 4: relational tenant/branch integrity.
-- Prevents a tenant_id from being paired with a branch owned by another tenant.

create unique index if not exists branches_tenant_id_id_uidx
  on menu_v3.branches (tenant_id, id);

create unique index if not exists tenant_members_tenant_id_user_id_uidx
  on menu_v3.tenant_members (tenant_id, user_id);

alter table menu_v3.member_branch_access
  drop constraint if exists member_branch_access_tenant_id_fkey;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'member_branch_access_tenant_user_fkey'
      and conrelid = 'menu_v3.member_branch_access'::regclass
  ) then
    alter table menu_v3.member_branch_access
      add constraint member_branch_access_tenant_user_fkey
      foreign key (tenant_id, user_id)
      references menu_v3.tenant_members (tenant_id, user_id)
      on delete cascade;
  end if;
end;
$$;

alter table menu_v3.member_branch_access
  drop constraint if exists member_branch_access_branch_id_fkey;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'member_branch_access_tenant_branch_fkey'
      and conrelid = 'menu_v3.member_branch_access'::regclass
  ) then
    alter table menu_v3.member_branch_access
      add constraint member_branch_access_tenant_branch_fkey
      foreign key (tenant_id, branch_id)
      references menu_v3.branches (tenant_id, id)
      on delete cascade;
  end if;
end;
$$;

alter table menu_v3.orders
  drop constraint if exists orders_branch_id_fkey;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_tenant_branch_fkey'
      and conrelid = 'menu_v3.orders'::regclass
  ) then
    alter table menu_v3.orders
      add constraint orders_tenant_branch_fkey
      foreign key (tenant_id, branch_id)
      references menu_v3.branches (tenant_id, id)
      on delete restrict;
  end if;
end;
$$;
