# PROJECT_STATE

## Identity
- Status: VERIFIED
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Current repository HEAD at the implementation checkpoint: `db364b717d257127efe8307ebaa227b8bcb8f361`.
- Current audited application implementation before Level 4B hardening: `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- Product: Menu V3, an Arabic-first bilingual multi-tenant digital-menu SaaS.

## Current Position
- Status: VERIFIED
- Level 0: CLOSED.
- Level 1: CLOSED.
- Level 2: IMPLEMENTED; historical verification caveats remain.
- Level 3: CLOSED in repository documentation.
- Level 4: IN_PROGRESS as the roadmap milestone.
- Canonical durable authorization integration: DONE / VERIFIED.
- Client account lifecycle and onboarding hardening: DONE / VERIFIED for owner uniqueness and concurrent-request reconciliation.
- Subscription entitlement enforcement: DONE / VERIFIED for default subscription provisioning and branch/product/team-member limits.

## Stack
- Status: VERIFIED
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGLite-ready data layer, Supabase production integration, Vercel, Node 24 CI.
- Commands in `package.json`: `dev`, `build`, `typecheck`, `test`, `test:platform`, `lint`, `check:auth`, `db:migrate`.

## Completed
- Status: VERIFIED
- Public menu/order flow, Studio, onboarding, QR, analytics, auth foundation, team invitations, durable role database foundation, subscription-plan foundation, and canonical authorization integration exist on `main`.
- Team invitation lifecycle merged by PR #5 at `161d955be4311a457d5b3573212fd8a1baa21489`.
- Durable roles foundation: `migrations/20260903008000_roles_permissions_foundation.sql`.
- Canonical authorization integration completed through the recorded authorization commits, with final UI compatibility fix `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- CI quality run `33733296763` succeeded for final authorization application implementation commit `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- Repository agent contract upgraded in root `AGENTS.md`.
- Client onboarding idempotency hardening added in `migrations/20260903009000_client_onboarding_idempotency.sql` and `src/routes/onboarding.tsx`.
- CI quality run `33736116086` succeeded for onboarding hardening implementation commit `e003d249313b238eadbb18f27ca6f19edde34718`.
- Subscription entitlement enforcement added in `migrations/20260903010000_subscription_entitlements.sql` without changing the existing subscription plan data model.
- The entitlement migration backfills missing tenant subscriptions, provisions the existing `free` plan for new tenants, and enforces active/trialing subscription state plus configured branch/product/team-member limits at the database boundary.
- CI quality run `33736780359` succeeded for entitlement implementation commit `d7bdccc23de5e6308fb86351053e4206631dc797`; route generation, typecheck, tests, lint, and production build all completed successfully.
- Final continuity documentation was updated after the verified entitlement implementation.

## In Progress
- Status: NONE
- No feature task is currently `IN_PROGRESS`.

## Do Not Redo
- Status: VERIFIED
- Do not rebuild or replace completed work.
- Do not remove `/admin`, `server/`, `public/__grok/`, or existing platform integrations.
- Do not add AI, payments, or domain work before Level 4 foundation work is stable.
- Do not mark work DONE without direct verification.
- Do not replace the onboarding flow; its ownership/idempotency boundary is now part of the verified Level 4 foundation.
- Do not replace the subscription plan model; entitlement enforcement now consumes its existing limits and subscription state.

## Important Paths
- `AGENTS.md`
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`
- `SESSION_PROTOCOL.md`
- `src/routes/onboarding.tsx`
- `src/lib/auth/authorization.server.ts`
- `src/lib/auth/permissions.ts`
- `src/lib/menu/types.ts`
- `src/lib/menu/subscription-limits.ts`
- `src/lib/menu/subscriptions.ts`
- `src/lib/menu/team.ts`
- `src/lib/menu/team-invitations.ts`
- `src/lib/menu/owner.ts`
- `migrations/20260903008000_roles_permissions_foundation.sql`
- `migrations/20260903009000_client_onboarding_idempotency.sql`
- `migrations/20260903010000_subscription_entitlements.sql`
- `.github/workflows/quality.yml`
- `package.json`

## Commands
- `npm install --no-audit --no-fund`
- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`
- `npm run check:auth`
- `npm run test:platform`
- `npm run db:migrate`

## Verification
- Status: VERIFIED
- GitHub CI run `33736780359` completed successfully on `d7bdccc23de5e6308fb86351053e4206631dc797`.
- CI completed route-tree generation, typecheck, tests, lint, and production build successfully.
- The entitlement implementation is migration-only; it covers existing branch/product/team-member write paths at the database boundary, including import and invitation acceptance flows.
- The migration creates default `free` subscription state for new tenants and backfills existing tenants missing subscription rows.
- The trigger uses a row lock on each tenant's subscription record before counting resources, keeping concurrent entitlement checks for the same tenant serialized within the database transaction.
- Local command execution is `UNKNOWN` because the available execution interface exposes the repository and GitHub Actions rather than a local checkout.
- Live production subscription state and resource counts are `UNKNOWN`; no direct production database audit was available in this GitHub-only session.
- Vercel deployment status is `UNKNOWN` and remains separate from GitHub CI verification.

## Known Issues
- Status: VERIFIED
- Plan-limit database errors are currently surfaced through existing generic mutation error handling in several application paths; a dedicated upgrade/limit UI response is not part of this atomic task.
- Historical Supabase security-advisor notices remain.
- Historical authenticated/cache/editor E2E caveats remain.
- Realtime and tenant/branch-scoped order numbering remain deferred.
- Historical multi-statement onboarding transaction semantics remain unchanged.

## Decisions
- Status: VERIFIED
- `main` is the source of truth.
- Preserve legacy `role` semantics for UI compatibility while resolving server authority from canonical durable roles.
- `staff` is least privilege: `menu.read` only.
- Branch scope is derived from trusted membership state and fails closed.
- Only one task may be `IN_PROGRESS`; after a task is verified DONE, no new task is started automatically.
- Client onboarding ownership is constrained to one tenant per `owner_user_id` at the database layer.
- Concurrent onboarding conflicts are reconciled by re-reading trusted server-side membership before reporting an error.
- The repository agent contract is governed by the root `AGENTS.md` cycle and continuity rules.
- Subscription entitlement enforcement remains server/database-side and does not trust client-supplied plan, tenant, or limit values.
- The existing subscription plan data model remains unchanged; only default provisioning/backfill and enforcement triggers were added.
- PostgreSQL trigger functions are `SECURITY DEFINER` with a restricted search path and no public execute privilege.

## Session Log
- 2026-09-03 — VERIFIED repository audit completed; continuity system initialized.
- 2026-09-03 — Executed exactly one task: integrated canonical durable role/branch-scope authorization across shared role types, server authorization, team writes, invitation acceptance, and focused regression tests. Final CI quality run `33733296763` succeeded on commit `46b5b42a56ba93f9715a511a6062f39a0f739ace`. No second feature task started.
- 2026-09-03 — Continuity review verified the four continuity files against current `main` and repository CI evidence; no application code changed in that review.
- 2026-09-03 — Agent-contract upgrade replaced the prior workspace-specific root contract with a concise repository-grounded autonomous engineering manual. No application feature was started.
- 2026-09-03 — Executed exactly one Level 4B task: hardened client onboarding idempotency by enforcing database-level unique tenant ownership and reconciling concurrent onboarding conflicts through trusted server-side membership lookup. CI quality run `33736116086` succeeded on `e003d249313b238eadbb18f27ca6f19edde34718`. Subsequent commits only recorded continuity state. No second feature task started.
- 2026-09-03 — Executed exactly one Level 4C task: connected the existing subscription-plan foundation to server-side database entitlement enforcement without changing the plan data model. Added default subscription provisioning/backfill and database triggers for branch, product, and active team-member limits. CI quality run `33736780359` succeeded on `d7bdccc23de5e6308fb86351053e4206631dc797`. No second feature task started.
