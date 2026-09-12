-- R6 experiment measurement: preserve the existing event stream while recording
-- a server-derived experiment assignment for eligible public-menu sessions.
alter table menu_events
  add column if not exists experiment_key text,
  add column if not exists experiment_variant text;

alter table menu_events
  drop constraint if exists menu_events_experiment_variant_ck;

alter table menu_events
  add constraint menu_events_experiment_variant_ck
  check (experiment_variant is null or experiment_variant in ('control', 'prominent'));

create index if not exists menu_events_experiment_idx
  on menu_events (tenant_id, experiment_key, experiment_variant, created_at desc);
