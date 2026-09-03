# PLAN — Menu V3 Active Delivery Strategy

## Executive Summary
- Status: IN_PROGRESS / verification pending.
- `main` is the repository source of truth.
- Previous roadmap remains archived as `PLAN_ARCHIVE_2026-09-03.md`.
- Completed Level 0–4C work remains protected.
- Current foundation priority is platform-control integrity, reproducible verification, and explicit production data contracts before feature expansion.

## Current Verified State
- `VERIFIED`: React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.
- `VERIFIED`: durable platform-admin authority exists as `menu_v3.platform_admins` with `menu_v3.is_platform_admin(text)`.
- `VERIFIED`: platform admin server paths use the shared helper in `src/lib/auth/platform-admin.server.ts`.
- `VERIFIED`: the Node test runner uses `--experimental-strip-types` and does not resolve the Vite `@/` alias used by the server module.
- `VERIFIED`: the current fix isolates `isPlatformAdminConfigured` in `src/lib/auth/platform-admin-config.ts`, so the focused Node test no longer imports the server module.
- `VERIFIED`: current CI run `33740748856` reached Install successfully before the latest documentation commits; final verification of the fix remains pending on the latest `main` state.

## Product / Architecture Understanding
Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS for restaurants and cafes. Existing architecture separates public menu/customer flows from authenticated owner/studio/admin surfaces and uses server-side authorization, tenant/branch boundaries, database migrations, and subscription entitlements. The project should evolve incrementally without replacing these foundations.

## Completed Work — Protected
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historically partially verified; do not rebuild.
- Level 3: DONE / VERIFIED.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED for its defined scope.
- Subscription-plan foundation: DONE / VERIFIED.
- Subscription entitlement enforcement: DONE / VERIFIED for default provisioning/backfill and branch/product/active-team-member limits.
- Repository agent contract: DONE / VERIFIED.

## Problems and Risks
1. `VERIFIED`: platform authorization had inconsistent server paths; corrected with a shared helper while retaining the existing configured fallback.
2. `VERIFIED`: the original platform-admin focused test imported a server module containing the Vite `@/lib/db` alias, causing Node test-runner resolution failure.
3. `VERIFIED`: the pure configuration helper is now separated from that server boundary; final quality verification is pending.
4. `VERIFIED / UNKNOWN`: `platform.ts` references `public.website_projects` and `public.service_requests`, but repository migration ownership is not established. Live ownership is UNKNOWN.
5. `UNKNOWN`: live Supabase schema/data state and Vercel runtime state.

## Goals
1. Close the platform authorization verification gate.
2. Establish reproducible platform schema/data contracts.
3. Independently verify production deployment, database, authentication, and critical user journeys.
4. Improve observability and business-specific failure states.
5. Only then expand commercial/product capabilities.

## Non-Goals
- No project restart or foundation rewrite.
- No reopening completed milestones without evidence of regression.
- No speculative framework/dependency replacement.
- No blind creation of production tables.
- No unrelated refactors or feature expansion during the foundation gate.

## Architecture Decisions
- `menu_v3.platform_admins` / `menu_v3.is_platform_admin(text)` is the durable platform-admin authority.
- Existing configured ID/email fallback remains a controlled bootstrap compatibility mechanism until live durable-admin population is verified.
- Node-focused tests should import alias-free pure modules where possible; server modules remain responsible for server-only dependencies and authorization.
- Production data relations are not to be invented until repository ownership and live schema are established.

## Research and References
- PostgreSQL function-security guidance: https://www.postgresql.org/docs/current/perm-functions.html — use restrictive `search_path` and controlled privileges for `SECURITY DEFINER` functions.
- PostgreSQL trigger documentation: https://www.postgresql.org/docs/current/trigger-definition.html — trigger behavior is relevant when database enforcement is evaluated.
- Supabase security-definer guidance: https://supabase.com/docs/guides/database/functions — secure `search_path` and privilege management are required when crossing privilege boundaries.
- OWASP Authorization Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html — server-side, deny-by-default authorization and authorization testing.
- TanStack Start server functions: https://tanstack.com/start/latest/docs/framework/react/guide/server-functions — server functions are server-side data/API boundaries and authorization must not rely only on UI.
- Research is used only where relevant; no new framework or dependency is justified by the current task.

## Ordered Milestones
### M1 — Platform authorization consistency
- Status: IN_PROGRESS / verification pending.
- Purpose: one canonical platform-admin server authority.
- Priority: security-sensitive and foundational; prevents divergent privilege decisions.
- Evidence: durable DB authority existed while `admin.ts` and `platform.ts` previously used different paths.
- Tasks: share durable authorization helper; preserve bootstrap fallback; make focused test Node-compatible; run full quality gate.
- Dependencies: none beyond existing repository tooling.
- Acceptance: both server paths use the shared helper; no `platform_operators`; focused test passes under Node; full quality gate passes.
- Verification: `npm install --no-audit --no-fund`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` and CI equivalent.

### M2 — Platform schema contract and migration reproducibility
- Status: TODO.
- Purpose: establish ownership and migration history for `website_projects` and `service_requests` before any schema change.
- Priority: data integrity and deployment reproducibility.
- Evidence: current platform code references these relations without matching audited repository migrations.
- Acceptance: ownership is proven; fresh migration path agrees with production contract; no guessed/destructive migration.

### M3 — Production deployment/runtime gate
- Status: TODO.
- Purpose: verify Vercel runtime, environment configuration, Supabase connectivity/migrations, auth, and public route rendering.

### M4 — Critical end-to-end journeys
- Status: TODO.
- Purpose: verify public menu, onboarding, Studio, tenant/branch scope, invitations, subscription limits, ordering, and admin journeys.

### M5 — Observability and failure UX
- Status: TODO.
- Purpose: improve safe operational signals and business-specific error handling after correctness gates pass.

### M6 — Commercial/product expansion
- Status: TODO.
- Purpose: later refine service workflows, subscription UX, payments, AI, and domain/visibility capabilities only after foundations are proven.

## Current Atomic Task
- Status: IN_PROGRESS.
- **Fix `platform-admin.server.test.ts` so it executes under the Node test runner without importing the server module's Vite alias dependency, then complete the quality gate.**
- Root cause: the test imported `platform-admin.server.ts`, which imports `@/lib/db`; Node does not resolve that alias.
- Fix: `src/lib/auth/platform-admin-config.ts` contains the pure environment helper; `platform-admin.server.ts` reuses/re-exports it; the focused test imports the alias-free module.
- Risk: low; authorization behavior is unchanged.

## Rollback / Recovery
- Revert only the focused helper/test boundary if verification reveals incompatibility.
- Do not remove the durable authorization check or weaken the server authorization fallback.
- Preserve all completed milestones.

## Verification State
- `VERIFIED`: implementation commits exist on `main`.
- `VERIFIED`: dependency installation passed on the earlier quality run after the dependency-range correction.
- `IN_PROGRESS`: quality run `33740748856` was executing the corrected test import and had passed Install; later documentation commits triggered subsequent CI runs.
- `UNKNOWN`: final quality result for the latest repository state until its CI run completes.

## Progress Log
- 2026-09-03 — Superseded roadmap archived as `PLAN_ARCHIVE_2026-09-03.md`.
- 2026-09-03 — Fresh audit selected platform authorization consistency as the first foundation task.
- 2026-09-03 — Implemented shared platform-admin authorization and focused regression coverage.
- 2026-09-03 — Resolved the Node test-runner module-resolution defect by isolating the pure configuration helper.
- 2026-09-03 — Started CI verification; Install passed and route-tree generation began.

## Exact Next Task
- **Complete the current GitHub Actions quality verification. If green, mark M1 DONE; if not, fix only the verified failure.**
