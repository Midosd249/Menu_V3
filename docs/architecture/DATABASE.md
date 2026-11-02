# Database Architecture and Live Catalog Baseline

**Status:** VERIFIED metadata snapshot — 2026-11-02  
**Repository SHA:** `e5d7c89a73718f35e7accbae7933af36c366bbc1`  
**Supabase project:** `ublxptcqefujkbeepylc` / PostgreSQL 17.11 / `ap-northeast-2`

## Schemas and table counts
Read-only queries against PostgreSQL catalogs on 2026-11-02 returned:
- `menu_v3`: 47 base tables.
- `public`: 16 base tables.
- Total across these schemas: 63 base tables.
- `menu_v3._migrations` exists and contains 72 records.
- Latest custom ledger entry: `20261023120000_restaurant_tables_and_qr_tokens.sql`.

The 47 `menu_v3` tables:
`_migrations`, `account`, `ai_guest_assistant_daily_limits`, `ai_request_rate_limits`, `anonymous_sessions`, `branch_category_order`, `branch_hours`, `branch_product_order`, `branches`, `categories`, `customer_requests`, `guest_campaigns`, `guest_feedback`, `guest_loyalty_accounts`, `guest_loyalty_ledger`, `guest_profiles`, `lead_onboarding`, `leads`, `member_branch_access`, `menu_events`, `menu_upsell_recommendations`, `modifier_groups`, `modifier_options`, `order_items`, `order_status_events`, `orders`, `platform_admin_subscription_audit`, `platform_admins`, `product_modifier_groups`, `product_offers`, `product_variants`, `products`, `public_order_idempotency`, `public_order_invalid_rate_limits`, `public_order_rate_limits`, `restaurant_tables`, `self_serve_registration_grants`, `session`, `subscription_invoices`, `subscription_plans`, `table_qr_tokens`, `team_invitations`, `tenant_members`, `tenant_subscriptions`, `tenants`, `user`, `verification`.

## Core entity families
- Identity/session: `user`, `session`, `account`, `verification`.
- Tenant and access: `tenants`, `branches`, `tenant_members`, `member_branch_access`.
- Menu: `categories`, `products`, `product_variants`, `modifier_groups`, `modifier_options`, `product_modifier_groups`, `branch_hours`, `branch_category_order`, `branch_product_order`, `product_offers`.
- Orders: `orders`, `order_items`, `order_status_events`, `anonymous_sessions`, `public_order_idempotency`, `public_order_rate_limits`, `public_order_invalid_rate_limits`.
- QR tables: `restaurant_tables`, `table_qr_tokens`.
- Commercial: `subscription_plans`, `tenant_subscriptions`, `subscription_invoices`, `platform_admin_subscription_audit`.
- Team/customer/growth: `team_invitations`, `customer_requests`, `lead_onboarding`, `leads`, `menu_events`, guest/loyalty/campaign/upsell tables.
- AI limits: `ai_request_rate_limits`, `ai_guest_assistant_daily_limits`.

## RLS, policies, grants and roles
Catalog snapshot:
- All 47 `menu_v3` tables have RLS enabled.
- Zero tables have FORCE ROW LEVEL SECURITY.
- Seven restrictive deny policies exist for `anon` and `authenticated`, on: `ai_request_rate_limits`, `anonymous_sessions`, `guest_profiles`, `lead_onboarding`, `menu_upsell_recommendations`, `public_order_idempotency`, `public_order_rate_limits`.
- Remaining 40 tables have no policy in the catalog snapshot.
- `anon`, `authenticated`, and `service_role` have no direct table grants in `menu_v3` in the inspected `information_schema.role_table_grants` result.
- These three roles also lack `USAGE` on schema `menu_v3`.
- `postgres` has table privileges on all 47 tables and schema USAGE.
- `service_role` has `rolbypassrls=true`; `postgres` also has `rolbypassrls=true` and `rolcanlogin=true`.

**Critical UNKNOWN:** The actual login role used by the deployed application's `pg.Pool` connection was not inspected from credentials and must not be inferred. Therefore this metadata snapshot does not by itself prove the app's effective DB principal or complete isolation. The app's server-side authorization and parameterized tenant scoping remain essential and must be tested.

**Interpretation:** RLS enabled without a policy is deny-by-default for roles subject to RLS, but grants and schema privileges are separate gates. Never add policies or grants merely to silence an advisor. Do not expose `menu_v3` through Supabase Data API without a separately reviewed least-privilege design.

## Custom vs Supabase CLI migration history
- Repository runner: `scripts/migrate.mjs`; directory `migrations/`; schema `menu_v3`; ledger `menu_v3._migrations`.
- Live custom ledger count: 72.
- Supabase connector's CLI migration list returned a separate set of historical CLI versions. This is not evidence that the custom runner is out of sync.
- ADR-0001 preserves the custom ledger as the operational source. Never run migration repair/push to force the two ledgers to match.

## Important limits
This is a catalog snapshot, not a data audit. No customer rows or secrets were queried. Views, materialized views, triggers, indexes, grants on routines, default privileges, extensions, and every FK/index relationship were not exhaustively inventoried in this pass.
