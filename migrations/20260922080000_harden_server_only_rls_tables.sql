-- RLS hardening for server-only menu_v3 tables identified by the live Supabase security audit.
-- These tables are accessed by the application through the server-side PostgreSQL connection.
-- They have no intended browser/API access and therefore receive no client RLS policies.
-- Keeping RLS enabled with no policies provides default-deny defense in depth for any
-- future role that accidentally receives table privileges.

alter table menu_v3.public_order_rate_limits enable row level security;
alter table menu_v3.public_order_idempotency enable row level security;
alter table menu_v3.lead_onboarding enable row level security;
alter table menu_v3.ai_request_rate_limits enable row level security;
alter table menu_v3.menu_upsell_recommendations enable row level security;
alter table menu_v3.guest_profiles enable row level security;
alter table menu_v3.anonymous_sessions enable row level security;

revoke all on table menu_v3.public_order_rate_limits from anon, authenticated;
revoke all on table menu_v3.public_order_idempotency from anon, authenticated;
revoke all on table menu_v3.lead_onboarding from anon, authenticated;
revoke all on table menu_v3.ai_request_rate_limits from anon, authenticated;
revoke all on table menu_v3.menu_upsell_recommendations from anon, authenticated;
revoke all on table menu_v3.guest_profiles from anon, authenticated;
revoke all on table menu_v3.anonymous_sessions from anon, authenticated;
