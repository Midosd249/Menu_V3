# PROJECT_STATE

## Identity
- Status: VERIFIED
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Current audited implementation commit: `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- Product: Menu V3, an Arabic-first bilingual multi-tenant digital-menu SaaS.

## Current Position
- Status: VERIFIED
- Level 0: CLOSED.
- Level 1: CLOSED.
- Level 2: IMPLEMENTED; historical verification caveats remain.
- Level 3: CLOSED in repository documentation.
- Level 4: IN_PROGRESS.
- Current authorization milestone: canonical durable authorization integration is DONE / VERIFIED.

## Stack
- Status: VERIFIED
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGLite-ready data layer, Supabase production integration, Vercel, Node 24 CI.
- Commands in `package.json`: `dev`, `build`, `typecheck`, `test`, `test:platform`, `lint`, `check:auth`, `db:migrate`.

## Completed
- Status: VERIFIED
- Public menu/order flow, Studio, onboarding, QR, analytics, auth foundation, team invitations, durable role database foundation, subscription-plan foundation, and canonical authorization integration exist on `main`.
- Team invitation lifecycle merged by PR #5 at `161d955be4311a457d5b3573212fd8a1baa21489`.
- Durable roles foundation: `migrations/20260903008000_roles_permissions_foundation.sql`.
- Canonical authorization integration completed through commits `cd1eef169450351d3f32f3e18c19aff5178c731d`, `e66d3baa9391eb6266ea1827bfef53409d0f8e38`, `a01001402b2f4b83f6f8a10668036c5cf18ecbbc`, `3237a39d8cedbb7fe8101903e8bfc43a1b830a2c`, `0a4530caaf7b83e2be833a073769228d6e876728`, and `19a6c3721244cdde0ff9e8ad514704ce9bcec555`, with final UI compatibility fix `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- CI quality run `33733296763` succeeded for final commit `46b5b42a56ba93f9715a511a6062f39a0f739ace`.

## In Progress
- Status: NONE
- No task is currently IN_PROGRESS after verification. The next task remains queued and unstarted.

## Do Not Redo
- Status: VERIFIED
- Do not rebuild or replace completed work.
- Do not remove `/admin`, `server/`, `public/__grok/`, or existing platform integrations.
- Do not add AI, payments, or domain work before Level 4 foundation work is stable.
- Do not mark work DONE without direct verification.

## Important Paths
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

## Verification
- Status: VERIFIED
- Repository default branch is `main`, currently at `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- CI quality workflow covers route-tree generation, typecheck, tests, lint, and production build.
- Quality run `33733296763` completed with `success` for `46b5b42a56ba93f9715a511a6062f39a0f739ace`.
- Earlier run `33733157069` failed on predecessor commit `19a6c3721244cdde0ff9e8ad514704ce9bcec555`; the failure was corrected by the final staff-role UI compatibility commit, and run `33733296763` subsequently passed.
- Earlier run `33685195512` was documented as SUCCESS but predates the current implementation.
- Vercel status previously reported `failure` with a Vercel build-rate-limit target; this is not interpreted as a code/build failure.
- Local working-tree `git status`, local uncommitted diffs, and direct local command execution remain UNKNOWN because the available interface exposes GitHub repository state rather than a local checkout.

## Known Issues
- Status: VERIFIED
- Historical Supabase security-advisor notices remain.
- Historical authenticated/cache/editor E2E caveats remain.
- Realtime and tenant/branch-scoped order numbering remain deferred.
- Vercel deployment verification remains separate from the successful GitHub CI verification.

## Decisions
- Status: VERIFIED
- `main` is the source of truth.
- Preserve legacy `role` semantics for UI compatibility while resolving server authority from canonical durable roles.
- `staff` is least privilege: `menu.read` only.
- Branch scope is derived from trusted membership state and fails closed.
- Only one task may be IN_PROGRESS; after a task is verified DONE, no new task is started automatically.

## Session Log
- 2026-09-03 — VERIFIED repository audit completed; continuity system initialized.
- 2026-09-03 — Executed exactly one task: integrated canonical durable role/branch-scope authorization across shared role types, server authorization, team writes, invitation acceptance, and focused regression tests. Final CI quality run `33733296763` succeeded on commit `46b5b42a56ba93f9715a511a6062f39a0f739ace`. No second feature task started.
- 2026-09-03 — Continuity review: verified the four continuity files against current `main` and repository CI evidence; corrected stale verification state so the completed authorization task is recorded as DONE/VERIFIED and the onboarding hardening task remains the exact next unblocked TODO. No application code changed and no new feature task started.