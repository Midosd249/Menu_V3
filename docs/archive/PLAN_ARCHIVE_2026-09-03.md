# PLAN — Archived 2026-09-03

## Rules
- Status: VERIFIED
- `main` is the only source of truth.
- Preserve completed work and prefer additive, reversible changes.
- Verify before claiming completion.
- Never mark DONE without evidence.
- Only one task may be IN_PROGRESS.
- First unblocked TODO is the exact next feature task.
- Authorization and tenant isolation stay server-side.
- No AI, payments, or domain work before Level 4 foundation is stable.
- Repository agent cycle: `DISCOVER → UNDERSTAND → RESEARCH → PLAN → IMPLEMENT → TEST → REVIEW → DOCUMENT → STOP`.

## Current Milestone
- Status: VERIFIED
- **LEVEL 4 — Client SaaS & Commercial Platform: Subscription Entitlement Enforcement** is DONE / VERIFIED for server-side enforcement of the existing subscription-plan limits.
- Existing foundations include onboarding, team invitations, durable roles, branch scope, subscription plans, and verified application authorization integration.
- This session connected the existing subscription-plan foundation to the database/server boundary without changing the subscription plan data model.

## Phases
- Status: VERIFIED / PLANNED
1. Level 4A — Durable authorization integration — DONE / VERIFIED.
2. Level 4B — Client account lifecycle and onboarding hardening — DONE / VERIFIED for owner uniqueness and concurrent-request reconciliation.
3. Level 4C — Subscription entitlement enforcement — DONE / VERIFIED for default subscription provisioning and branch/product/team-member limits.
4. Level 4D — Service/project workflow foundations and observability — TODO.
5. Level 4 Gate — production/security verification — TODO.

## Decisions
- Status: VERIFIED
- `access_role` is the canonical durable role; legacy `role` remains a compatibility field.
- Canonical roles: `tenant_owner`, `branch_manager`, `staff`, `editor`.
- Branch access must fail closed and derive from trusted membership state.
- Existing invitation roles remain admin/editor.
- The root `AGENTS.md` is the concise autonomous repository operating manual and requires evidence-driven discovery, research when consequential, a pre-edit planning gate, task-scoped verification, continuity updates, and a hard stop after one task.
- Client onboarding ownership is enforced by a database-level unique index on `tenants.owner_user_id`; this closes the check-then-insert race that could otherwise create duplicate client tenants.
- The existing onboarding UI reconciles a concurrent create conflict by re-reading trusted server-side studio membership and routing to `/studio` when the tenant already exists.
- Subscription entitlement enforcement uses the existing `subscription_plans` and `tenant_subscriptions` tables without adding or changing columns.
- New tenants receive the existing `free` plan automatically, and legacy tenants missing subscription state are backfilled to the same `free` trial state before enforcement is enabled.
- Branch, product, and active team-member creation/reactivation are blocked at the database boundary when the tenant has no active/trialing subscription or has reached the configured plan limit.
- The entitlement trigger locks the tenant subscription row before counting resources, so concurrent writes for the same tenant are serialized through the subscription row within each database transaction.
- Research decision: database triggers are the smallest compatible enforcement boundary because they cover every existing server write path, including CSV/import flows, while keeping authorization and entitlement enforcement server-side. PostgreSQL documents row-level `BEFORE` triggers as suitable for checks before writes, and trigger execution is part of the same transaction as the triggering statement.
- Security decision: entitlement functions are `SECURITY DEFINER` with a restricted `search_path` and revoked public execute access, following PostgreSQL function-security guidance.
- Research sources: PostgreSQL trigger behavior (https://www.postgresql.org/docs/current/trigger-definition.html), PostgreSQL `CREATE TRIGGER` (https://www.postgresql.org/docs/current/sql-createtrigger.html), PostgreSQL function security (https://www.postgresql.org/docs/current/perm-functions.html), and Supabase Postgres triggers/RLS guidance (https://supabase.com/docs/guides/database/postgres/triggers ; https://supabase.com/docs/guides/database/postgres/row-level-security).

## Risks
- Live production subscription state and resource counts are `UNKNOWN`; the migration backfills tenants missing subscription rows but no direct production database audit was available in this GitHub-only session.
- The current application server still maps generic database exceptions to user-facing `unavailable` responses in several mutation handlers, so a plan-limit trigger failure is enforced server-side but is not yet surfaced as a dedicated upgrade/limit message in every UI path.
- The trigger enforces active branch/team-member counts and total product count, matching the existing plan data model. Historical over-limit data is not automatically removed or downgraded.
- Vercel deployment status is separate from GitHub CI.
- Local working-tree state and local command execution are `UNKNOWN` in the current GitHub-only execution interface.

## Release Criteria
- Existing tenants without subscription rows receive the configured default `free` subscription state.
- New tenants receive a default `free` subscription automatically.
- `trialing` and `active` subscriptions can create resources within their configured limits.
- `past_due`, `cancelled`, missing, or inactive-plan subscriptions cannot create/reactivate limited resources.
- Branch, product, and active team-member limits are enforced server-side at the database boundary, including existing import/invitation flows.
- Concurrent writes for the same tenant are serialized through the subscription-row lock used by the entitlement trigger.
- Clean migration, route generation, typecheck, tests, lint, and production build pass in CI.
- No Level 0–3 behavior is intentionally regressed.

## Next Task
- Status: TODO / UNBLOCKED
- **Establish service/project workflow foundations and observability.**
- Do not start this task automatically after the current session.
