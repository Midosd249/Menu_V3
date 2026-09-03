# PROJECT_STATE

## Identity
- Status: VERIFIED
- Repository: `Midosd249/Menu_V3`
- Default/source-of-truth branch: `main` (VERIFIED)
- Current `main` commit: `03fd269cf2a6a3117c8961992b1d5e2b0f6cdfcf` (VERIFIED)
- Product identity: Menu V3; Arabic-first, bilingual, mobile-first multi-tenant digital-menu SaaS (VERIFIED from repository documentation).

## Current Position
- Status: VERIFIED
- Level 0 Foundation & Audit: CLOSED.
- Level 1 Theme Engine Hardening: CLOSED.
- Level 2 Menu Experience & Product System: IMPLEMENTED; historical verification caveats remain.
- Level 3 Restaurant Operations / Ordering: CLOSED in repository documentation.
- Level 4 Client SaaS & Commercial Platform: IN PROGRESS.
- Important finding: the Level 4 durable authorization migration introduces canonical `access_role` and `branch_scope`, while application authorization still reads legacy `role` / `member_branch_access`. This is a verified integration gap.

## Stack
- Status: VERIFIED
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGLite-ready data layer, Supabase production integration, Vercel deployment, Node 24 CI.
- Package scripts include `typecheck`, `test`, `test:platform`, `lint`, `build`, and `check:auth`.

## Completed
- Status: VERIFIED
- Public menu and ordering flow, Studio routes, onboarding, QR, analytics, authentication foundation, team invitations, durable role/authorization database foundation, subscription-plan database foundation, and Level 3 ordering hardening are present in `main`.
- Team invitation lifecycle was merged through PR #5 at merge commit `161d955be4311a457d5b3573212fd8a1baa21489`.
- Recent `main` commits include `8da53358103a2672aac2362423cc95e29ee1814f` (durable tenant roles/platform authorization foundation) and `03fd269cf2a6a3117c8961992b1d5e2b0f6cdfcf` (order item rendering type fix).

## In Progress
- Status: IN_PROGRESS
- Level 4 authorization integration: make server-side application authorization consume canonical durable roles and branch scopes without removing legacy compatibility.

## Do Not Redo
- Status: VERIFIED
- Do not rebuild the application from scratch.
- Do not replace completed public menu, Studio, ordering, authentication, invitation, or subscription foundations.
- Do not remove `/admin`, `server/`, `public/__grok/`, or Grok platform integration files.
- Do not treat documentation claims as runtime proof when current repository evidence disagrees.
- Do not add AI, payments, or domain work before the Level 4 foundation is properly established.

## Important Paths
- `src/lib/auth/authorization.server.ts` — server authorization boundary.
- `src/lib/auth/permissions.ts` — permission matrix.
- `src/lib/menu/types.ts` — shared role/types contract.
- `src/lib/menu/team.ts` — team management mutations/queries.
- `src/lib/menu/team-invitations.ts` — invitation lifecycle.
- `migrations/20260903008000_roles_permissions_foundation.sql` — canonical durable role foundation.
- `migrations/20260903005000_team_invitations.sql` — invitation schema.
- `src/routes/onboarding.tsx` — client onboarding.
- `.github/workflows/quality.yml` — CI quality gate.
- `package.json` — commands/dependencies.

## Commands
- `npm install --no-audit --no-fund`
- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`
- `npm run check:auth`
- `npm run test:platform`

## Verification
- Status: VERIFIED / PARTIAL
- Repository tree is available and non-truncated; current tree SHA is `03fd269cf2a6a3117c8961992b1d5e2b0f6cdfcf`.
- Current `main` has no reported open GitHub issues.
- CI workflow is configured for route-tree generation, typecheck, tests, lint, and production build.
- Historical quality run `33685195512` is documented as SUCCESS, but it predates the current `03fd269...` commit; current-commit workflow lookup returned no run at audit time.
- Vercel/Supabase production verification is documented for the Level 3 checkpoint; no new live deployment was claimed during this audit.
- Local working-tree `git status`, uncommitted local diffs, and local command execution are UNKNOWN because the available GitHub interface exposes repository state, not a local checkout.

## Known Issues
- Status: VERIFIED
- Canonical `access_role` / `branch_scope` database foundation is not yet consumed consistently by `authorization.server.ts` and `team.ts`.
- `Role` currently contains only `owner | admin | editor`, while the canonical database role set also contains `staff`.
- Historical Supabase security-advisor notices remain documented and are not marked resolved.
- Historical authenticated/cache/editor E2E caveats remain.
- True Supabase realtime and tenant/branch-scoped customer order numbering are deferred.
- Current deployment status for commit `03fd269...`: UNKNOWN.

## Decisions
- Status: VERIFIED
- `main` is the repository source of truth.
- Preserve existing architecture and use additive, compatibility-safe changes.
- Canonical durable roles are `tenant_owner`, `branch_manager`, `staff`, and `editor`; the application may expose a compatibility role contract while migrating server authorization.
- Only one task may be IN_PROGRESS.

## Session Log
- 2026-09-03 — VERIFIED audit completed against repository tree, documentation, source, migrations, package manifest, CI workflow, recent history, branches, and PR state. Continuity files initialized. First task identified: integrate application authorization with canonical durable roles/branch scope without rebuilding completed work.
