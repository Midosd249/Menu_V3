# TASKS

## Current
- **M1 — Canonical platform-admin authorization: IN_PROGRESS / BLOCKED.** Code is implemented, but the verification gate is blocked by the repository's dependency-install failure.
- Previous Level 4C subscription entitlement work remains DONE / VERIFIED and is not reopened.

## Queue
1. **BLOCKED:** Resolve `@radix-ui/react-toggle-group@^1.3.8` install failure with the smallest compatible repository-supported version change, then rerun the quality gate.
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
- Objective: route both platform admin server paths through the durable `menu_v3.is_platform_admin` authority while preserving the existing server-configured ID/email fallback.
- Changed: `src/lib/auth/platform-admin.server.ts`, `src/lib/menu/admin.ts`, `src/lib/menu/platform.ts`, `src/lib/auth/platform-admin.server.test.ts`, and the `npm test` script entry in `package.json`.
- Acceptance: one canonical durable authorization path, no `platform_operators` dependency, existing bootstrap compatibility retained, focused test coverage, and full quality verification.

## Verification Evidence
- VERIFIED: implementation commits exist on `main`; current continuity HEAD after documentation is `eca52c7f4ad5bcb2bc15bb78f2628df8c3645b7b`.
- BLOCKED: GitHub Actions quality run `33739876850` failed at `npm install` before tests/typecheck/lint/build because npm could not resolve `@radix-ui/react-toggle-group@^1.3.8`.
- VERIFIED: npm registry evidence shows current stable releases in the `1.1.x` line; `1.3.8` is not an available package version.
- UNKNOWN: why earlier historical CI accepted the old dependency range; this is not guessed or silently changed in M1.
