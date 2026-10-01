-- Order preparation time and server-derived ETA.
-- Backward-compatible: both fields are nullable and no existing orders require backfill.
-- The migration is intentionally unqualified so it works with the production menu_v3 search_path
-- and the PGlite public fallback.
-- Rollback (only before intentionally retaining this feature's data):
-- alter table orders drop constraint if exists orders_preparation_duration_minutes_ck;
-- alter table orders drop column if exists estimated_ready_at;
-- alter table orders drop column if exists preparation_duration_minutes;

alter table orders
  add column if not exists preparation_duration_minutes integer,
  add column if not exists estimated_ready_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_preparation_duration_minutes_ck'
      and conrelid = 'orders'::regclass
  ) then
    alter table orders
      add constraint orders_preparation_duration_minutes_ck
      check (
        preparation_duration_minutes is null
        or (preparation_duration_minutes >= 1 and preparation_duration_minutes <= 120)
      );
  end if;
end;
$$;
