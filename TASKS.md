# TASKS

## Current
- **T4 — Visual, accessibility, responsive, and performance gates: IN_PROGRESS.** Establish a reproducible browser QA gate for the flagship template.

## Queue
1. **T4 — Template quality gates:** IN_PROGRESS — browser checks for the flagship public preview across mobile/tablet/desktop, RTL, accessible names, overflow, runtime errors, and reduced-motion support.
2. TODO: Expand to genuinely different restaurant families: specialty cafe, bakery/dessert, fast casual, fine dining/hospitality, and small-menu concepts.
3. TODO: Migrate legacy theme keys to proven family implementations with controlled customization and rollback.
4. TODO: Stage production rollout, compare analytics/performance, and retire legacy renderers only after evidence.

## Completed / Protected
- DONE / VERIFIED: Level 0 Foundation & Audit.
- DONE / VERIFIED: Level 1 Theme Engine Hardening.
- IMPLEMENTED / VERIFIED PARTIALLY: Level 2 Menu Experience & Product System.
- DONE / VERIFIED: Level 3 Restaurant Operations / Ordering.
- DONE / VERIFIED: Team invitation lifecycle via PR #5, merge `161d955be4311a457d5b3573212fd8a1baa21489`.
- DONE / VERIFIED: Durable tenant-role/platform-authorization database foundation.
- DONE / VERIFIED: Subscription-plan database foundation.
- DONE / VERIFIED: Canonical application authorization integration for `access_role` / `branch_scope`.
- DONE / VERIFIED: Repository agent contract in root `AGENTS.md`.
- DONE / VERIFIED: Client onboarding idempotency boundary.
- DONE / VERIFIED: Level 4C subscription entitlement enforcement.
- DONE / VERIFIED: T1 template architecture contract; quality run `33742263927` passed install, route generation, typecheck, tests, lint, and production build.
- DONE / VERIFIED: T2 shared semantic menu presentation primitives; quality run `33742271561` passed install, route generation, typecheck, tests, lint, and production build.
- DONE / VERIFIED: T3 `contemporary-restaurant` family renderer integrated into public route and theme preview; quality run `33743105967` passed all repository quality steps.

## T4 Scope
- Objective: make flagship template quality checks reproducible before expanding the family ecosystem.
- Added `scripts/template-qa.mjs` using the existing Playwright dependency.
- Added `npm run qa:template` entry point.
- Gate checks: HTTP success, RTL/language, horizontal overflow, accessible button/link names, visible headings, runtime console/page errors, and reduced-motion emulation at 390x844, 768x1024, and 1440x900.
- Acceptance: browser-level gate can run against a deployed preview or local build preview; no critical regression is hidden behind unit/build success.

## Verification Evidence
- VERIFIED: T3 quality run `33743105967` completed successfully.
- VERIFIED: Vercel production deployment for T3 commit `0d50842cd09b04d5f3fd2418d5da050c70a402a4` is `READY` (`dpl_9esaw9UjgAz4NmM3BsDXGBhqz9Tx`).
- IN_PROGRESS: T4 browser gate added; execution against a browser-capable environment remains pending.
- UNKNOWN: screenshot pixel baselines and full visual diff history.
- UNKNOWN: live production behavior beyond the verified deployment status.
