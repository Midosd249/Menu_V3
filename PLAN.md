# PLAN — Menu V3 Active Delivery Strategy

## Executive Summary
- Status: IN_PROGRESS
- The previous roadmap is archived in `PLAN_ARCHIVE_2026-09-03.md` and is no longer authoritative.
- `main` remains the repository source of truth.
- The project is not being restarted. Completed Level 0–4C work remains protected where repository and CI evidence supports it.
- Fresh audit found the highest-risk bottleneck is **platform-control integrity and reproducibility**, not a missing product feature: platform admin authorization is implemented through two inconsistent server paths, while `platform.ts` also references database objects not represented in the repository migration set.
- The first atomic task is therefore to make platform-admin authorization consistent with the durable `menu_v3.platform_admins` authority while preserving the existing server-configured bootstrap fallback. This is security-sensitive, small, reversible, and unblocked.

## Verified Repository State
- `VERIFIED`: repository `Midosd249/Menu_V3`, branch `main`.
- `VERIFIED`: React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target.
- `VERIFIED`: Level 0 Foundation, Level 1 Theme Engine, Level 3 Ordering, team invitations, durable roles/branch scope, onboarding idempotency, and subscription entitlement enforcement are present in repository history.
- `VERIFIED`: durable platform admin authority exists as `menu_v3.platform_admins` with `menu_v3.is_platform_admin(text)` in `migrations/20260903008000_roles_permissions_foundation.sql`.
- `VERIFIED`: `src/lib/menu/admin.ts` and `src/lib/menu/platform.ts` previously implemented different platform-admin checks; `platform.ts` queried an unreferenced `platform_operators` relation, while `admin.ts` used only environment ID/email allowlists.
- `VERIFIED`: `platform.ts` queries `public.website_projects` and `public.service_requests`; no matching repository migration was found by GitHub code search. Their live existence/ownership is therefore `UNKNOWN`, and this is a separate reproducibility task.
- `VERIFIED`: repository CI has repeatedly passed route generation, typecheck, tests, lint, and production build for prior completed milestones.
- `UNKNOWN`: live Supabase schema/data state, Vercel deployment state, and local working-tree execution state are not directly available in this GitHub-only session.

## Product / Architecture Position
Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant SaaS for digital menus and restaurant operations. The current architecture already separates public menu/customer behavior from authenticated owner/studio/admin behavior and uses server-side authorization plus database constraints. The next work must strengthen the existing product before adding AI, payments, or domain-dependent commercial features.

## Completed — Do Not Reopen
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / partially historically verified; do not rebuild.
- Level 3: DONE / VERIFIED in repository continuity.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding ownership/idempotency: DONE / VERIFIED for its defined scope.
- Subscription-plan foundation: DONE / VERIFIED.
- Subscription entitlement enforcement: DONE / VERIFIED for default subscription provisioning and branch/product/active-team-member limits.
- Existing `/admin`, Studio, server integration, migrations, compatibility paths, and public application flows are protected unless a later task proves a targeted correction is required.

## Fresh Audit Findings
### 1. Platform authorization inconsistency — `VERIFIED`
`src/lib/menu/admin.ts` and `src/lib/menu/platform.ts` do not share the same authority. The durable database authority already exists, so maintaining a second `platform_operators` path creates an avoidable authorization/data-contract split.

### 2. Platform dashboard schema reproducibility gap — `VERIFIED / UNKNOWN`
`platform.ts` depends on `public.website_projects` and `public.service_requests`, but those relations are not represented by the repository migration inventory found during the audit. Whether they are intentional external/legacy Supabase objects is `UNKNOWN`. They must not be invented or migrated blindly; the next schema task must first establish ownership and compatibility.

### 3. Production/deployment state — `UNKNOWN`
Passing GitHub CI does not prove Vercel runtime health or live Supabase migration state. Deployment verification is a separate gate.

### 4. Application-level entitlement UX — `VERIFIED`
Database enforcement exists, but several mutation paths still map generic database failures to generic `unavailable` UI errors. This is valuable UX work after the security/data-contract gate, not before it.

### 5. Historical E2E/security-advisor/realtime/order-numbering items — `VERIFIED`
These remain real follow-up areas but are lower priority than establishing one authoritative platform-control/data boundary.

## Goals
1. Establish one trustworthy, server-side platform authorization boundary.
2. Make every platform dashboard data dependency explicit, reproducible, and compatible with the actual production schema.
3. Prove deployment/runtime/database health independently of CI.
4. Re-verify critical authenticated, tenant, branch, public-menu, and owner workflows end-to-end.
5. Improve operational observability and user-facing failure states.
6. Only then expand commercial/product capabilities such as refined subscription UX, service workflows, payments, AI, or domain automation.

## Non-Goals
- No rewrite or rebuild of Menu V3.
- No removal of completed Level 0–4C functionality.
- No speculative replacement of Supabase, TanStack Start, Better Auth, PostgreSQL, or Vercel.
- No AI, payment, domain, or unrelated marketing work during the foundation/security gate.
- No blind creation of production tables whose ownership/schema contract is not established.

## Architecture Decisions
- `menu_v3.platform_admins` and `menu_v3.is_platform_admin(text)` are the durable platform-admin authority.
- Existing environment ID/email allowlists remain a controlled bootstrap/fallback mechanism for compatibility until production admin records are explicitly verified; they must not be replaced by an invented identity.
- Platform authorization must be enforced at server-function/data boundaries, not only route UI. This follows TanStack Start's server-function guidance and OWASP deny-by-default/server-side authorization guidance.
- Security-definer database functions remain tightly scoped, schema-qualified/restricted, and non-public where they cross privilege boundaries.
- Platform project/service tables will not be created or changed until their production ownership and migration history are established.

## Research / References
- `VERIFIED`: PostgreSQL function-security guidance recommends restrictive `search_path` handling and controlled execute privileges for `SECURITY DEFINER` functions. Applied to the existing durable admin function. citeturn0search2turn0search3
- `VERIFIED`: Supabase guidance similarly recommends secure `search_path` for security-definer functions and restricted execution. citeturn0search0turn0search6
- `VERIFIED`: OWASP recommends server-side authorization, deny-by-default, least privilege, and authorization tests. citeturn0search1turn0search4
- `VERIFIED`: TanStack Start documents server functions as server-side API boundaries and explicitly says private server functions must authorize independently of route UI. citeturn1search0turn1search1
- Tradeoff: keeping the existing env fallback avoids an irreversible lockout if the live `platform_admins` table has not yet been populated; canonical DB lookup becomes the first authority and removes the undocumented `platform_operators` dependency.

## Ordered Milestones
### M1 — Platform authorization consistency
- Status: IN_PROGRESS
- Objective: use the durable `menu_v3.is_platform_admin` authority from every platform-admin server path while preserving existing configured bootstrap access.
- Files: `src/lib/auth/platform-admin.server.ts`, `src/lib/menu/admin.ts`, `src/lib/menu/platform.ts`, `src/lib/auth/platform-admin.server.test.ts`, `package.json`.
- Acceptance: both admin surfaces use the same server helper; no `platform_operators` dependency remains; unauthorised users remain denied; configured ID/email fallback remains compatible; focused tests are included.
- Verification: focused auth test, full test suite, typecheck, lint, build, and CI.

### M2 — Platform schema contract and migration reproducibility
- Status: TODO
- Objective: establish whether `website_projects` and `service_requests` are canonical Menu V3 data, external legacy data, or dead references; then make the smallest evidence-backed correction.
- Files: `src/lib/menu/platform.ts`, relevant migrations, platform/admin tests/docs only after schema ownership is proven.
- Acceptance: fresh migration path and production schema contract agree; no guessed tables or destructive migration.
- Verification: migration test, typecheck, test suite, build, and production schema evidence when available.

### M3 — Production deployment and runtime gate
- Status: TODO
- Objective: independently verify Vercel runtime, environment configuration, Supabase connectivity, migration state, auth, and public route rendering.
- Acceptance: deployed app serves expected routes; auth and database boundaries operate against intended production resources; failures are classified as code/config/platform.
- Verification: Vercel deployment evidence, browser smoke/E2E, Supabase migration/schema evidence.

### M4 — Critical user journeys / E2E
- Status: TODO
- Objective: verify public menu, owner onboarding, Studio, branch scope, team invitation, subscription limits, and ordering flows against the hardened architecture.
- Acceptance: authenticated/unauthenticated and cross-tenant cases fail or succeed correctly; mobile/RTL critical paths remain usable.

### M5 — Observability and UX failure states
- Status: TODO
- Objective: replace generic failure messaging where business-specific states are already known, and establish useful safe operational signals without leaking sensitive data.
- Acceptance: entitlement failures, auth failures, and dependency failures are distinguishable to users/operators without exposing internals.

### M6 — Commercial/product expansion
- Status: TODO
- Objective: refine service/project workflows, subscription UX, payments, AI, domain/visibility features only after foundation gates pass.

## Current Atomic Task
- Status: IN_PROGRESS
- **Canonicalize platform-admin authorization across admin and platform server functions.**
- Objective: remove the undocumented `platform_operators` authority and route both server paths through the durable `menu_v3.is_platform_admin` check, retaining the existing server-configured ID/email fallback for compatibility.
- Risk: low and reversible; primary risk is accidental lockout if fallback is removed, so fallback is intentionally preserved.
- Acceptance and verification are defined under M1.

## Rollback / Recovery
- All changes are additive or targeted file-level corrections.
- If the canonical lookup fails because production migration state is incomplete, retain the environment fallback and classify the live mismatch as `UNKNOWN`/`BLOCKED`; do not weaken tenant authorization or invent schema.
- Revert only the current task's commits if verification exposes a regression; never reset unrelated history.

## Assumptions / Confidence
- `VERIFIED`: durable platform admin table/function exists in repository migration history.
- `VERIFIED`: both admin server modules are private-data server boundaries.
- `INFERRED`: the application database role can execute the existing restricted `menu_v3.is_platform_admin` function because the same connection is already used for repository server-side DB operations; live grant state remains `UNKNOWN`.
- `UNKNOWN`: live population of `menu_v3.platform_admins` and live existence/ownership of `public.website_projects` / `public.service_requests`.
- `PROPOSED`: M2 should be schema reconciliation, not blind table creation.

## Progress Log
- 2026-09-03 — Archived superseded plan as `PLAN_ARCHIVE_2026-09-03.md`.
- 2026-09-03 — Fresh audit identified platform authorization inconsistency and a platform dashboard migration/reproducibility gap as the highest-value foundation risks.
- 2026-09-03 — Started M1: canonical platform-admin authorization. Added shared server helper, updated both admin server modules, and added focused fallback normalization coverage.

## Exact Next Task
- After M1 is VERIFIED: **M2 — establish the ownership and migration contract for `website_projects` and `service_requests` before changing their schema.**
