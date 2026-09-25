create table if not exists menu_v3.ai_guest_assistant_daily_limits (
  tenant_id uuid not null,
  window_start date not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, window_start)
);

alter table menu_v3.ai_guest_assistant_daily_limits enable row level security;

create index if not exists ai_guest_assistant_daily_limits_updated_idx
  on menu_v3.ai_guest_assistant_daily_limits (updated_at);

revoke all on table menu_v3.ai_guest_assistant_daily_limits from public, anon, authenticated;
