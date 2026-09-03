# PLAN

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
- **LEVEL 4 — Client SaaS & Commercial Platform: Client Account Lifecycle and Onboarding Hardening** is DONE / VERIFIED for the implemented onboarding idempotency boundary.
- Existing foundations include onboarding, team invitations, durable roles, branch scope, subscription plans, and verified application authorization integration.
- This session hardened the client onboarding ownership boundary without rebuilding the existing onboarding flow.

## Phases
- Status: VERIFIED / PLANNED
1. Level 4A — Durable authorization integration — DONE / VERIFIED.
2. Level 4B — Client account lifecycle and onboarding hardening — DONE / VERIFIED for owner uniqueness and concurrent-request reconciliation.
3. Level 4C — Subscription entitlement enforcement — TODO / UNBLOCKED.
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
- Research decision: PostgreSQL unique-index enforcement is the smallest compatible concurrency boundary for the existing PostgreSQL/PGLite schema. PostgreSQL documentation states that unique indexes enforce duplicate prevention and that `ON CONFLICT` provides a native atomic alternative for future server-side create-or-get refinement.
- Research sources: PostgreSQL `INSERT` documentation (https://www.postgresql.org/docs/current/sql-insert.html) and PostgreSQL unique-index documentation (https://www.postgresql.org/docs/current/indexes-unique.html).
- Official references for future hardening: https://www.postgresql.org/docs/current/ddl-rowsecurity.html ; https://www.postgresql.org/docs/current/sql-createfunction.html ; https://supabase.com/docs/guides/database/postgres/row-level-security ; https://tanstack.com/start/latest/docs/framework/react/guide/server-functions .

## Risks
- The new unique index will fail migration if an existing live database already contains multiple tenants with the same `owner_user_id`; no direct live duplicate audit was available in this GitHub-only session, so production duplicate state is `UNKNOWN`.
- The current server create flow still performs tenant/member/branch writes as separate statements; the current task closes duplicate-owner creation but does not claim full multi-statement transactional onboarding.
- Vercel deployment status is separate from GitHub CI.
- Local working-tree state and local command execution are `UNKNOWN` in the current GitHub-only execution interface.

## Release Criteria
- One authenticated client owner cannot create multiple tenants through concurrent onboarding requests.
- Existing onboarding behavior remains compatible and redirects existing members to Studio.
- Concurrent conflict recovery reads trusted server-side membership rather than trusting client tenant identifiers.
- Clean migration, route generation, typecheck, tests, lint, and production build pass in CI.
- No Level 0–3 behavior is intentionally regressed.

## Next Task
- Status: TODO / UNBLOCKED
- **Connect the existing subscription-plan foundation to server-side entitlement checks without changing the existing plan data model.**
- Do not start this task automatically after the current session.
