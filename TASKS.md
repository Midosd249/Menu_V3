# TASKS

## Current
- **M1 — Canonical platform-admin authorization: IN_PROGRESS.** Code is implemented and the Node test-runner import defect is fixed; full CI verification is running/pending.

## Queue
1. **Current verification:** Complete GitHub Actions quality verification for the platform-admin test fix. If green, close M1; if not, fix only the verified failure.
2. TODO / UNBLOCKED after M1 verification: Establish ownership and migration contract for `public.website_projects` and `public.service_requests`; do not create tables blindly.
3. TODO: Independently verify Vercel deployment, production environment, Supabase schema/migrations, auth, and public route rendering.
4. TODO: Re-verify critical authenticated, tenant/branch, onboarding, team invitation, subscription, ordering, and public-menu journeys end-to-end.
5. TODO: Improve observability and business-specific failure UX.
6. TODO: Later commercial/product expansion including refined service workflows, subscription UX, payments, AI, and domain/visibility capabilities.

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
- DONE / VERIFIED: Level 4C subscription entitlement enforcement for default subscription provisioning/backfill and branch/product/active-team-member limits.

## Current Task Scope
- Objective: make `platform-admin.server.test.ts` execute successfully under the repository's Node test runner without importing the server module's Vite alias dependency.
- Changed: `src/lib/auth/platform-admin-config.ts`, `src/lib/auth/platform-admin.server.ts`, `src/lib/auth/platform-admin.server.test.ts`.
- Acceptance: the focused test loads directly under Node, server authorization behavior remains unchanged, and the full quality gate passes.

## Verification Evidence
- VERIFIED: `npm install` previously passed after the dependency-range correction.
- VERIFIED: current code fix is committed on `main` as `3a6aa0b45535b2151612b6cfa04dccc626eac9b0`.
- VERIFIED: CI run `33740748856` reached Install successfully and began route-tree generation.
- IN_PROGRESS: final result for run `33740748856` is not yet available.
- UNKNOWN: final Tests, Typecheck, Lint, and Production build results until the current quality run completes.
