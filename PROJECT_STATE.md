# PROJECT_STATE

## Identity
- Status: VERIFIED
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Current repository HEAD after onboarding hardening and continuity documentation: `4b59305eb1d29c3475a0389b2f2780f0015714fb`.
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
- Final continuity documentation now records the verified onboarding task and the exact next task.

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
- `src/lib/menu/team.ts`
- `src/lib/menu/team-invitations.ts`
- `src/lib/menu/owner.ts`
- `migrations/20260903008000_roles_permissions_foundation.sql`
- `migrations/20260903009000_client_onboarding_idempotency.sql`
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
- GitHub CI run `33736116086` completed successfully on `e003d249313b238eadbb18f27ca6f19edde34718`.
- CI completed route-tree generation, typecheck, tests, lint, and production build successfully.
- Final application implementation diff for the onboarding task contains only `migrations/20260903009000_client_onboarding_idempotency.sql` and the targeted reconciliation change in `src/routes/onboarding.tsx`.
- Subsequent commits only updated continuity documentation; no application source changes were introduced after the successful implementation CI run.
- Local command execution is `UNKNOWN` because the available execution interface exposes the repository and GitHub Actions rather than a local checkout.
- Live production duplicate-owner data is `UNKNOWN`; the migration was validated by the clean CI/PGLite build path, not by a direct production data audit.

## Known Issues
- Status: VERIFIED
- The new owner uniqueness migration would fail on a live database that already contains duplicate `owner_user_id` values; no direct live duplicate audit was available in this session, so that production state is `UNKNOWN`.
- The current server create flow still uses multiple SQL statements rather than one explicit database transaction; this task closes duplicate-owner creation but does not claim full transactional onboarding rollback semantics.
- Historical Supabase security-advisor notices remain.
- Historical authenticated/cache/editor E2E caveats remain.
- Realtime and tenant/branch-scoped order numbering remain deferred.
- Vercel deployment verification remains separate from successful GitHub CI verification.

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

## Session Log
- 2026-09-03 — VERIFIED repository audit completed; continuity system initialized.
- 2026-09-03 — Executed exactly one task: integrated canonical durable role/branch-scope authorization across shared role types, server authorization, team writes, invitation acceptance, and focused regression tests. Final CI quality run `33733296763` succeeded on commit `46b5b42a56ba93f9715a511a6062f39a0f739ace`. No second feature task started.
- 2026-09-03 — Continuity review verified the four continuity files against current `main` and repository CI evidence; no application code changed in that review.
- 2026-09-03 — Agent-contract upgrade replaced the prior workspace-specific root contract with a concise repository-grounded autonomous engineering manual. No application feature was started.
- 2026-09-03 — Executed exactly one Level 4B task: hardened client onboarding idempotency by enforcing database-level unique tenant ownership and reconciling concurrent onboarding conflicts through trusted server-side membership lookup. CI quality run `33736116086` succeeded on `e003d249313b238eadbb18f27ca6f19edde34718`. Subsequent commits only recorded continuity state. No second feature task started.
