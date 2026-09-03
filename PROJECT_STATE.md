# PROJECT_STATE

## Identity
- Status: VERIFIED
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Current repository HEAD after agent-contract documentation: `c3a6e612f98a6f64b997ccd20318bca53aee218b`.
- Current audited application implementation remains `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- Product: Menu V3, an Arabic-first bilingual multi-tenant digital-menu SaaS.

## Current Position
- Status: VERIFIED
- Level 0: CLOSED.
- Level 1: CLOSED.
- Level 2: IMPLEMENTED; historical verification caveats remain.
- Level 3: CLOSED in repository documentation.
- Level 4: IN_PROGRESS as the roadmap milestone, with no feature task currently active.
- Canonical durable authorization integration: DONE / VERIFIED.
- Repository agent operating contract: upgraded and committed; no application code changed.

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
- CI quality run `33733296763` succeeded for final application implementation commit `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- `AGENTS.md` upgraded at repository root in `c3a6e612f98a6f64b997ccd20318bca53aee218b` with the autonomous operating cycle, research rules, planning/verification gates, security rules, continuity contract, and one-task discipline.

## In Progress
- Status: NONE
- No feature task is currently `IN_PROGRESS`. The next task remains queued and unstarted.

## Do Not Redo
- Status: VERIFIED
- Do not rebuild or replace completed work.
- Do not remove `/admin`, `server/`, `public/__grok/`, or existing platform integrations.
- Do not add AI, payments, or domain work before Level 4 foundation work is stable.
- Do not mark work DONE without direct verification.

## Important Paths
- `AGENTS.md`
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`
- `SESSION_PROTOCOL.md`
- `src/lib/auth/authorization.server.ts`
- `src/lib/auth/permissions.ts`
- `src/lib/menu/types.ts`
- `src/lib/menu/team.ts`
- `src/lib/menu/team-invitations.ts`
- `src/routes/onboarding.tsx`
- `migrations/20260903008000_roles_permissions_foundation.sql`
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
- Repository `main` advanced from the previously audited application commit to documentation-only HEAD `c3a6e612f98a6f64b997ccd20318bca53aee218b`.
- The `AGENTS.md` change is documentation-only; no application source, tests, migrations, or configuration were modified by this session.
- Existing CI quality run `33733296763` remains the verification evidence for application commit `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- Current session did not execute local test/typecheck/lint/build commands because the available GitHub interface exposes repository files/history rather than a local checkout; local command execution is `UNKNOWN`.
- Vercel deployment verification remains separate from GitHub CI verification.

## Known Issues
- Status: VERIFIED
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
- Repository agent behavior is governed by the concise `AGENTS.md` operating contract and its `DISCOVER → UNDERSTAND → RESEARCH → PLAN → IMPLEMENT → TEST → REVIEW → DOCUMENT → STOP` cycle.

## Session Log
- 2026-09-03 — VERIFIED repository audit completed; continuity system initialized.
- 2026-09-03 — Executed exactly one task: integrated canonical durable role/branch-scope authorization across shared role types, server authorization, team writes, invitation acceptance, and focused regression tests. Final CI quality run `33733296763` succeeded on commit `46b5b42a56ba93f9715a511a6062f39a0f739ace`. No second feature task started.
- 2026-09-03 — Continuity review: verified the four continuity files against current `main` and repository CI evidence; corrected stale verification state so the completed authorization task is recorded as DONE/VERIFIED and the onboarding hardening task remains the exact next unblocked TODO. No application code changed and no new feature task started.
- 2026-09-03 — Agent-contract upgrade: inspected the existing root `AGENTS.md`, continuity state, package scripts, completion/QA documentation, repository tree, and recent GitHub history. Replaced the prior long workspace-specific contract with a concise repository-grounded autonomous engineering manual. No application code changed. Current repository HEAD is `c3a6e612f98a6f64b997ccd20318bca53aee218b`; the next feature task remains onboarding lifecycle/idempotency and was not started.