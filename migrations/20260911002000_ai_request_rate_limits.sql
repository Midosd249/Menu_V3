create table if not exists menu_v3.ai_request_rate_limits (
  tenant_id uuid not null,
  user_id text not null,
  window_start timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, user_id, window_start)
);

create index if not exists ai_request_rate_limits_updated_idx
  on menu_v3.ai_request_rate_limits (updated_at);

revoke all on table menu_v3.ai_request_rate_limits from anon, authenticated;
