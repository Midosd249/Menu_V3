-- Security hardening for the seven server-only menu_v3 tables and the mutable trigger function search_path.
-- These tables are intentionally server-only. The application uses the server-side PostgreSQL connection;
-- anon/authenticated must have no table privileges and no row-level allow policies.
-- service_role/server-side access remains available through its existing privileged connection and RLS bypass.

alter table menu_v3.public_order_rate_limits enable row level security;
alter table menu_v3.public_order_idempotency enable row level security;
alter table menu_v3.lead_onboarding enable row level security;
alter table menu_v3.ai_request_rate_limits enable row level security;
alter table menu_v3.menu_upsell_recommendations enable row level security;
alter table menu_v3.guest_profiles enable row level security;
alter table menu_v3.anonymous_sessions enable row level security;

revoke all on table menu_v3.public_order_rate_limits from public, anon, authenticated;
revoke all on table menu_v3.public_order_idempotency from public, anon, authenticated;
revoke all on table menu_v3.lead_onboarding from public, anon, authenticated;
revoke all on table menu_v3.ai_request_rate_limits from public, anon, authenticated;
revoke all on table menu_v3.menu_upsell_recommendations from public, anon, authenticated;
revoke all on table menu_v3.guest_profiles from public, anon, authenticated;
revoke all on table menu_v3.anonymous_sessions from public, anon, authenticated;

create policy public_order_rate_limits_deny_client_roles
  on menu_v3.public_order_rate_limits
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy public_order_idempotency_deny_client_roles
  on menu_v3.public_order_idempotency
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy lead_onboarding_deny_client_roles
  on menu_v3.lead_onboarding
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy ai_request_rate_limits_deny_client_roles
  on menu_v3.ai_request_rate_limits
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy menu_upsell_recommendations_deny_client_roles
  on menu_v3.menu_upsell_recommendations
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy guest_profiles_deny_client_roles
  on menu_v3.guest_profiles
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy anonymous_sessions_deny_client_roles
  on menu_v3.anonymous_sessions
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

alter function menu_v3.sync_guest_profile_from_order()
  set search_path = menu_v3, pg_catalog;
