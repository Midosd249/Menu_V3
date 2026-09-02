-- Platform lead operations. Additive migration: no existing lead data is removed.

alter table leads
  add column if not exists status text not null default 'new',
  add column if not exists notes text not null default '',
  add column if not exists source text not null default 'website',
  add column if not exists updated_at timestamptz not null default now();

alter table leads drop constraint if exists leads_status_ck;
alter table leads add constraint leads_status_ck
  check (status in ('new', 'contacted', 'qualified', 'converted', 'lost'));

create index if not exists leads_status_created_idx on leads (status, created_at desc);
create index if not exists leads_created_idx on leads (created_at desc);
create index if not exists leads_phone_idx on leads (contact_phone);

create or replace function touch_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at
before update on leads
for each row execute function touch_leads_updated_at();
