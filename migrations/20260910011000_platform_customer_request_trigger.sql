create or replace function menu_v3.create_platform_customer_request()
returns trigger
language plpgsql
security definer
set search_path = menu_v3, public
as $$
begin
  insert into menu_v3.customer_requests (id, tenant_id, owner_user_id, status)
  values ('cr-' || new.id, new.id, new.owner_user_id, 'pending')
  on conflict (tenant_id) do nothing;
  return new;
end;
$$;

drop trigger if exists tenants_platform_customer_request on menu_v3.tenants;
create trigger tenants_platform_customer_request
after insert on menu_v3.tenants
for each row execute function menu_v3.create_platform_customer_request();

revoke all on function menu_v3.create_platform_customer_request() from public;
