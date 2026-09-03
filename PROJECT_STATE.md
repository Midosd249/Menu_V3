# PROJECT_STATE

## Identity
- Status: VERIFIED
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Current audited implementation commit: `19a6c3721244cdde0ff9e8ad514704ce9bcec555`.
- Product: Menu V3, an Arabic-first bilingual multi-tenant digital-menu SaaS.

## Current Position
- Status: VERIFIED / IN_PROGRESS
- Level 0: CLOSED.
- Level 1: CLOSED.
- Level 2: IMPLEMENTED; historical verification caveats remain.
- Level 3: CLOSED in repository documentation.
- Level 4: IN_PROGRESS.
- Current task: canonical durable authorization integration.

## Stack
- Status: VERIFIED
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGLite-ready data layer, Supabase production integration, Vercel, Node 24 CI.
- Commands in `package.json`: `dev`, `build`, `typecheck`, `test`, `test:platform`, `lint`, `check:auth`, `db:migrate`.

## Completed
- Status: VERIFIED
- Public menu/order flow, Studio, onboarding, QR, analytics, auth foundation, team invitations, durable role database foundation, and subscription-plan foundation exist on `main`.
- Team invitation lifecycle merged by PR #5 at `161d955be4311a457d5b3573212fd8a1baa21489`.
- Durable roles foundation: `migrations/20260903008000_roles_permissions_foundation.sql`.
- Recent source commits: `8da53358103a2672aac2362423cc95e29ee1814f` (role/platform foundation) and `03fd269cf2a6a3117c8961992b1d5e2b0f6cdfcf` (order-item type fix).

## In Progress
- Status: IN_PROGRESS
- Align application authorization with canonical `access_role` / `branch_scope` while preserving legacy compatibility.

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
- Status: PARTIAL / IN_PROGRESS
- Repository tree is non-truncated; `main` is the canonical branch.
- CI quality workflow covers route-tree generation, typecheck, tests, lint, and production build.
- Quality run `33733157069` for commit `19a6c3721244cdde0ff9e8ad514704ce9bcec555` was queued/in progress at the final audit check; no completion result is claimed.
- Earlier run `33685195512` was documented as SUCCESS but predates the current implementation.
- Vercel status for current implementation reported `failure` with target indicating a Vercel build-rate-limit page; this is not interpreted as a code/build failure.
- Local working-tree `git status`, local uncommitted diffs, and direct local command execution are UNKNOWN because the available interface exposes GitHub repository state rather than a local checkout.

## Known Issues
- Status: VERIFIED
- Durable DB roles (`tenant_owner`, `branch_manager`, `staff`, `editor`) previously were not consumed consistently by application authorization; this session implemented the integration layer.
- Historical Supabase security-advisor notices remain.
- Historical authenticated/cache/editor E2E caveats remain.
- Realtime and tenant/branch-scoped order numbering remain deferred.
- Full current CI completion is UNKNOWN until run `33733157069` finishes.

## Decisions
- Status: VERIFIED
- `main` is the source of truth.
- Preserve legacy `role` semantics for UI compatibility while resolving server authority from canonical durable roles.
- `staff` is least privilege: `menu.read` only.
- Branch scope is derived from trusted membership state and fails closed.
- Only one task may be IN_PROGRESS.

## Session Log
- 2026-09-03 — VERIFIED repository audit completed; continuity system initialized.
- 2026-09-03 — Executed exactly one task: integrated canonical durable role/branch-scope authorization across shared role types, server authorization, team writes, invitation acceptance, and focused regression tests. CI quality run `33733157069` was triggered by the final test commit and was still in progress at the last check. No second feature task started.