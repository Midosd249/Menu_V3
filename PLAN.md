# PLAN — Menu V3 Active Delivery Strategy

## Executive Summary
- Status: IN_PROGRESS / BLOCKED
- The previous roadmap is archived in `PLAN_ARCHIVE_2026-09-03.md` and is no longer authoritative.
- `main` remains the repository source of truth.
- The project is not being restarted. Completed Level 0–4C work remains protected where repository and CI evidence supports it.
- Fresh audit found the highest-risk bottleneck is **platform-control integrity and reproducibility**, not a missing product feature: platform admin authorization had two inconsistent server paths, while `platform.ts` also references database objects not represented in the repository migration set.
- M1 was implemented, but the release verification gate exposed a separate pre-existing package-install blocker: npm cannot resolve `@radix-ui/react-toggle-group@^1.3.8`. M1 therefore remains `IN_PROGRESS / BLOCKED` and is not marked DONE.

## Verified Repository State
- `VERIFIED`: repository `Midosd249/Menu_V3`, branch `main`.
- `VERIFIED`: React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target.
- `VERIFIED`: Level 0 Foundation, Level 1 Theme Engine, Level 3 Ordering, team invitations, durable roles/branch scope, onboarding idempotency, and subscription entitlement enforcement are present in repository history.
- `VERIFIED`: durable platform admin authority exists as `menu_v3.platform_admins` with `menu_v3.is_platform_admin(text)` in `migrations/20260903008000_roles_permissions_foundation.sql`.
- `VERIFIED`: `src/lib/menu/admin.ts` and `src/lib/menu/platform.ts` previously implemented different platform-admin checks; `platform.ts` queried an unreferenced `platform_operators` relation, while `admin.ts` used only environment ID/email allowlists.
- `VERIFIED`: `platform.ts` queries `public.website_projects` and `public.service_requests`; no matching repository migration was found by GitHub code search. Their live existence/ownership is `UNKNOWN`, and this is a separate reproducibility task.
- `VERIFIED`: historical GitHub CI runs passed the full quality pipeline for completed milestones.
- `UNKNOWN`: live Supabase schema/data state, Vercel deployment state, and local working-tree execution state.

## Product / Architecture Position
Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant SaaS for digital menus and restaurant operations. The current architecture already separates public menu/customer behavior from authenticated owner/studio/admin behavior and uses server-side authorization plus database constraints. The next work must strengthen the existing product before adding AI, payments, or domain-dependent commercial features.

## Completed — Do Not Reopen
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / partially historically verified; do not rebuild.
- Level 3: DONE / VERIFIED.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding ownership/idempotency: DONE / VERIFIED for its defined scope.
- Subscription-plan foundation: DONE / VERIFIED.
- Subscription entitlement enforcement: DONE / VERIFIED for default subscription provisioning and branch/product/active-team-member limits.
- Existing `/admin`, Studio, server integration, migrations, compatibility paths, and public application flows are protected unless a later task proves a targeted correction is required.

## Fresh Audit Findings
### 1. Platform authorization inconsistency — `VERIFIED`, implementation corrected
`src/lib/menu/admin.ts` and `src/lib/menu/platform.ts` did not share one authority. The durable database authority already existed, so maintaining `platform_operators` created an avoidable authorization/data-contract split. Both paths now use the same helper and durable database function, with the existing environment bootstrap fallback preserved.

### 2. Platform dashboard schema reproducibility gap — `VERIFIED / UNKNOWN`
`platform.ts` depends on `public.website_projects` and `public.service_requests`, but those relations are not represented by the repository migration inventory found during the audit. Whether they are intentional external/legacy Supabase objects is `UNKNOWN`. They must not be invented or migrated blindly.

### 3. CI install blocker — `VERIFIED / BLOCKED`
Quality run `33739876850` failed before tests/typecheck/lint/build during `npm install` with `ETARGET: No matching version found for @radix-ui/react-toggle-group@^1.3.8`. Current npm registry evidence shows the package on the `1.1.x` stable line. The dependency range existed before this task and is therefore recorded as a separate blocker rather than silently folded into M1.

### 4. Production/deployment state — `UNKNOWN`
Passing GitHub CI does not prove Vercel runtime health or live Supabase migration state. Deployment verification is a separate gate.

### 5. Application-level entitlement UX — `VERIFIED`
Database enforcement exists, but several mutation paths still map generic database failures to generic `unavailable` UI errors. This is valuable UX work after the security/data-contract gate.

### 6. Historical E2E/security-advisor/realtime/order-numbering items — `VERIFIED`
These remain follow-up areas but are lower priority than establishing one authoritative platform-control/data boundary and a reproducible build.

## Goals
1. Establish one trustworthy, server-side platform authorization boundary.
2. Restore a reproducible dependency/build gate.
3. Make every platform dashboard data dependency explicit, reproducible, and compatible with the actual production schema.
4. Prove deployment/runtime/database health independently of CI.
5. Re-verify critical authenticated, tenant, branch, public-menu, and owner workflows end-to-end.
6. Improve operational observability and user-facing failure states.
7. Only then expand commercial/product capabilities.

## Non-Goals
- No rewrite or rebuild of Menu V3.
- No removal of completed Level 0–4C functionality.
- No speculative replacement of Supabase, TanStack Start, Better Auth, PostgreSQL, or Vercel.
- No AI, payment, domain, or unrelated marketing work during the foundation/security gate.
- No blind creation of production tables whose ownership/schema contract is not established.

## Architecture Decisions
- `menu_v3.platform_admins` and `menu_v3.is_platform_admin(text)` are the durable platform-admin authority.
- Existing environment ID/email allowlists remain a controlled bootstrap/fallback mechanism until production admin records are explicitly verified.
- Platform authorization is enforced at server-function/data boundaries, not only route UI, following TanStack Start and OWASP guidance.
- Security-definer database functions remain tightly scoped, schema-qualified/restricted, and non-public where they cross privilege boundaries.
- Platform project/service tables will not be created or changed until their production ownership and migration history are established.
- Dependency repairs are separate atomic tasks when a pre-existing install failure blocks verification; do not hide such repairs inside unrelated feature work.

## Research / References
- `VERIFIED`: PostgreSQL function-security guidance recommends restrictive `search_path` handling and controlled execute privileges for `SECURITY DEFINER` functions. citeturn0search2turn0search3
- `VERIFIED`: Supabase guidance similarly recommends secure `search_path` for security-definer functions and restricted execution. citeturn0search0turn0search6
- `VERIFIED`: OWASP recommends server-side authorization, deny-by-default, least privilege, and authorization tests. citeturn0search1turn0search4
- `VERIFIED`: TanStack Start documents server functions as server-side API boundaries and requires private server functions to authorize independently of route UI. citeturn1search0turn1search1
- `VERIFIED`: current npm registry evidence identifies `@radix-ui/react-toggle-group` stable releases in the `1.1.x` line; the requested `1.3.8` range is not resolvable. citeturn2search0turn2search5
- Tradeoff: keeping the existing env fallback avoids an irreversible admin lockout if the live durable-admin table has not yet been populated; the canonical DB lookup is now the first authority and the undocumented `platform_operators` dependency is removed.

## Ordered Milestones
### M1 — Platform authorization consistency
- Status: IN_PROGRESS / BLOCKED
- Objective: use the durable `menu_v3.is_platform_admin` authority from every platform-admin server path while preserving existing configured bootstrap access.
- Files: `src/lib/auth/platform-admin.server.ts`, `src/lib/menu/admin.ts`, `src/lib/menu/platform.ts`, `src/lib/auth/platform-admin.server.test.ts`, `package.json`.
- Acceptance: both admin surfaces use the same server helper; no `platform_operators` dependency remains; unauthorised users remain denied; configured ID/email fallback remains compatible; focused tests are included.
- Implementation: COMPLETE.
- Verification: BLOCKED at CI install by `@radix-ui/react-toggle-group@^1.3.8`; tests/typecheck/lint/build did not execute in the observed run.

### M2 — Build/dependency reproducibility
- Status: TODO
- Objective: resolve the verified invalid dependency range using the smallest compatible version change, preserving the current UI/API contract and lockfile consistency.
- Acceptance: clean `npm install` succeeds; no unnecessary dependency upgrades; existing imports remain compatible.
- Verification: `npm install --no-audit --no-fund`, then full quality gate.

### M3 — Platform schema contract and migration reproducibility
- Status: TODO
- Objective: establish whether `website_projects` and `service_requests` are canonical Menu V3 data, external legacy data, or dead references; then make the smallest evidence-backed correction.
- Acceptance: fresh migration path and production schema contract agree; no guessed tables or destructive migration.

### M4 — Production deployment and runtime gate
- Status: TODO
- Objective: independently verify Vercel runtime, environment configuration, Supabase connectivity, migration state, auth, and public route rendering.

### M5 — Critical user journeys / E2E
- Status: TODO
- Objective: verify public menu, owner onboarding, Studio, branch scope, team invitation, subscription limits, and ordering flows against the hardened architecture.

### M6 — Observability and UX failure states
- Status: TODO
- Objective: replace generic failure messaging where business-specific states are already known and establish useful safe operational signals.

### M7 — Commercial/product expansion
- Status: TODO
- Objective: refine service/project workflows, subscription UX, payments, AI, domain/visibility features only after foundation gates pass.

## Current Atomic Task
- Status: BLOCKED after implementation
- **Canonicalize platform-admin authorization across admin and platform server functions.**
- Objective: remove the undocumented `platform_operators` authority and route both server paths through the durable `menu_v3.is_platform_admin` check, retaining the existing server-configured ID/email fallback.
- Risk: low and reversible; fallback intentionally remains to avoid lockout before live durable-admin population is verified.
- Code implementation is complete; verification cannot be claimed until the dependency-install blocker is resolved.

## Rollback / Recovery
- All current code changes are additive/targeted and reversible.
- If the canonical lookup fails because production migration state is incomplete, retain the environment fallback and classify the live mismatch as `UNKNOWN`/`BLOCKED`; do not weaken tenant authorization.
- Resolve the dependency blocker in its own atomic task before re-running M1 verification.

## Assumptions / Confidence
- `VERIFIED`: durable platform admin table/function exists in repository migration history.
- `VERIFIED`: both admin server modules are private-data server boundaries.
- `INFERRED`: the application DB role can execute the existing restricted `menu_v3.is_platform_admin` function; live grant state remains `UNKNOWN`.
- `UNKNOWN`: live population of `menu_v3.platform_admins` and live ownership/existence of `public.website_projects` / `public.service_requests`.
- `PROPOSED`: M3 should be schema reconciliation, not blind table creation.

## Progress Log
- 2026-09-03 — Archived superseded plan as `PLAN_ARCHIVE_2026-09-03.md`.
- 2026-09-03 — Fresh audit identified platform authorization inconsistency and a platform dashboard migration/reproducibility gap as the highest-value foundation risks.
- 2026-09-03 — Implemented M1: shared platform-admin helper, canonical durable DB check in both server paths, preserved configured bootstrap fallback, and added focused regression coverage.
- 2026-09-03 — CI verification exposed a pre-existing install blocker: `@radix-ui/react-toggle-group@^1.3.8` cannot be resolved. M1 was not marked DONE.

## Exact Next Task
- **M2 — resolve the verified `@radix-ui/react-toggle-group@^1.3.8` dependency-install blocker with the smallest compatible version change, then rerun the full quality gate.**
