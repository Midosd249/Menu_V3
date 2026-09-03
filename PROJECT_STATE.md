# PROJECT_STATE

## Identity
- Status: IN_PROGRESS
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Current HEAD: `3a6aa0b45535b2151612b6cfa04dccc626eac9b0`.
- Product: Menu V3, an Arabic-first bilingual multi-tenant digital-menu SaaS.

## Current Position
- Status: IN_PROGRESS
- Previous Level 0–4C completed work remains protected and is not being reopened.
- Previous roadmap was superseded and archived as `PLAN_ARCHIVE_2026-09-03.md`.
- New active strategy is in `PLAN.md`.
- M1 platform-admin authorization implementation is now corrected for the Node test runner by isolating its pure environment-config helper from the server module's Vite alias dependency.
- Verification is pending on GitHub Actions run `33740748856`.

## Verified Stack
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.

## Completed / Protected
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historical partial verification; do not rebuild.
- Level 3: DONE / VERIFIED in repository continuity.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED for owner uniqueness and concurrent-request reconciliation.
- Subscription-plan foundation: DONE / VERIFIED.
- Subscription entitlement enforcement: DONE / VERIFIED for default provisioning/backfill and branch/product/active-team-member limits.
- Existing `/admin`, Studio, server integrations, migrations, public flows, and compatibility paths remain protected.

## Current Task
- Status: IN_PROGRESS
- Task: **Fix `platform-admin.server.test.ts` for the Node test runner and complete the quality verification gate.**
- Root cause: the test imported `platform-admin.server.ts`, which imports the Vite alias `@/lib/db`; the Node test runner does not resolve that alias.
- Fix: extracted the pure `isPlatformAdminConfigured` environment helper into `src/lib/auth/platform-admin-config.ts`; the server module reuses/re-exports it and the Node test imports the alias-free module directly.
- Security intent: no authorization behavior changed; only testability/module boundaries were adjusted.

## Verification
- VERIFIED: npm install and prior typecheck/build gates had passed after the dependency-range correction.
- VERIFIED: implementation is committed on `main` as `3a6aa0b45535b2151612b6cfa04dccc626eac9b0`.
- IN_PROGRESS: GitHub Actions quality run `33740748856` is executing against the corrected test import.
- VERIFIED: CI reached Install successfully and began route-tree generation on run `33740748856`.
- UNKNOWN: final Tests, Typecheck, Lint, and Production build results until the run completes.

## Important Paths
- `AGENTS.md`
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`
- `SESSION_PROTOCOL.md`
- `PLAN_ARCHIVE_2026-09-03.md`
- `src/lib/auth/platform-admin.server.ts`
- `src/lib/auth/platform-admin-config.ts`
- `src/lib/auth/platform-admin.server.test.ts`
- `src/lib/menu/admin.ts`
- `src/lib/menu/platform.ts`
- `migrations/20260903008000_roles_permissions_foundation.sql`
- `.github/workflows/quality.yml`
- `package.json`

## Known Issues / Risks
- IN_PROGRESS: CI verification of the current fix.
- VERIFIED: platform dashboard still has an unresolved schema ownership/reproducibility gap for `website_projects` and `service_requests`.
- UNKNOWN: live production database/deployment state.
- VERIFIED: historical entitlement UI error mapping, E2E caveats, Supabase security-advisor notices, realtime, and order-numbering follow-up areas remain.

## Session Log
- 2026-09-03 — Archived the superseded plan as `PLAN_ARCHIVE_2026-09-03.md` and created the replacement active strategy in `PLAN.md`.
- 2026-09-03 — Fresh audit selected platform authorization consistency as the first atomic task because it is security-sensitive, high-value, unblocked, and smaller/safer than blind platform-schema migration.
- 2026-09-03 — Implemented canonical platform-admin authorization across `admin.ts` and `platform.ts`, preserving the existing server-configured ID/email fallback and adding focused regression coverage.
- 2026-09-03 — Verification exposed a Node test-runner module-resolution defect in `platform-admin.server.test.ts`.
- 2026-09-03 — Fixed the test-runner defect by isolating the alias-free platform-admin configuration helper and started quality run `33740748856`.

## Exact Next Task
- **Complete the current GitHub Actions quality verification for the platform-admin test fix; if green, mark M1 DONE and select the next unblocked task from `PLAN.md`. If not green, fix only the verified failure.**
