-- Serialize legacy approval and token issuance in one database transaction.
set search_path to menu_v3, public;

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
  select * into lead_row
  from menu_v3.leads
  where id = p_lead_id
  for update;

  if lead_row.id is null then
    raise exception using errcode = 'P0002', message = 'LEGACY_LEAD_NOT_FOUND';
  end if;

  if exists (
    select 1 from menu_v3.lead_onboarding
    where lead_id = p_lead_id
      and used_at is null
      and revoked_at is null
      and expires_at > now()
  ) then
    raise exception using errcode = '23505', message = 'LEGACY_APPROVAL_ALREADY_ACTIVE';
  end if;

  onboarding_id := md5(p_lead_id || ':' || p_token_hash || ':' || clock_timestamp()::text);
  insert into menu_v3.lead_onboarding (
    id, lead_id, token_hash, expires_at, approved_at, created_by
  ) values (
    onboarding_id, p_lead_id, p_token_hash, p_expires_at, now(), p_created_by
  );

  update menu_v3.leads
  set status = 'qualified', updated_at = now()
  where id = p_lead_id;

  return query select onboarding_id, p_expires_at;
end;
$$;

revoke all on function menu_v3.approve_legacy_lead(text,text,timestamptz,text) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function menu_v3.approve_legacy_lead(text,text,timestamptz,text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function menu_v3.approve_legacy_lead(text,text,timestamptz,text) from authenticated;
  end if;
end;
$$;
