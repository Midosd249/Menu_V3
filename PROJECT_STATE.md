# PROJECT_STATE

## Identity
- Status: IN_PROGRESS
- Repository: `Midosd249/Menu_V3`
- Source of truth: `main`
- Current HEAD: `60d417aff45e5b80789e499478c54419e9748732`.
- Product: Menu V3, an Arabic-first bilingual multi-tenant digital-menu SaaS.

## Current Position
- Status: IN_PROGRESS
- Previous Level 0–4C completed work remains protected and is not being reopened.
- Previous roadmap was superseded and archived as `PLAN_ARCHIVE_2026-09-03.md`.
- New active strategy is in `PLAN.md`.
- Fresh audit identified platform authorization consistency and platform schema reproducibility as the highest-value foundation risks.
- M1 platform-admin authorization implementation is complete in code but not yet VERIFIED because the repository CI install gate currently fails on an existing invalid dependency range: `@radix-ui/react-toggle-group@^1.3.8`.

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

## Fresh Audit Findings
- VERIFIED: `menu_v3.platform_admins` and `menu_v3.is_platform_admin(text)` are the durable platform-admin authority in `migrations/20260903008000_roles_permissions_foundation.sql`.
- VERIFIED: `src/lib/menu/admin.ts` and `src/lib/menu/platform.ts` previously used different authorization paths; `platform.ts` referenced `platform_operators`, which has no repository migration/search evidence.
- VERIFIED: `platform.ts` references `public.website_projects` and `public.service_requests`; repository ownership/migration evidence for these relations is absent from the audited migration/search results. Live ownership is UNKNOWN.
- VERIFIED: TanStack Start server functions are data/API boundaries and private functions must authorize independently; OWASP recommends server-side, deny-by-default authorization.
- UNKNOWN: live `platform_admins` population, live platform project/service table ownership, Vercel runtime state, and live Supabase schema state.

## Current Task
- Status: IN_PROGRESS / BLOCKED
- Task: **Canonicalize platform-admin authorization across admin and platform server functions.**
- Implemented: `src/lib/auth/platform-admin.server.ts` provides a shared server-side durable lookup plus existing configured ID/email fallback; `src/lib/menu/admin.ts` and `src/lib/menu/platform.ts` now use the canonical helper; focused normalization test added and included in `npm test`.
- Security intent: remove the undocumented `platform_operators` authority without risking admin lockout before live durable-admin population is verified.

## Verification
- VERIFIED: repository changes were committed on `main` and a GitHub Actions quality run was triggered for the updated branch.
- BLOCKED: latest observed quality run `33739876850` failed during `npm install`, before tests/typecheck/lint/build, with `ETARGET: No matching version found for @radix-ui/react-toggle-group@^1.3.8`.
- INFERRED: this dependency range is a pre-existing repository/package contract because it was present in the audited `package.json` before the task; no dependency upgrade is being smuggled into the current security task.
- VERIFIED: current npm registry evidence shows `@radix-ui/react-toggle-group` releases in the `1.1.x` line, not `1.3.8`.
- UNKNOWN: whether the prior green CI used a different registry/cache/lock state; the current failure must be treated as a real release blocker.

## Important Paths
- `AGENTS.md`
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`
- `SESSION_PROTOCOL.md`
- `PLAN_ARCHIVE_2026-09-03.md`
- `src/lib/auth/platform-admin.server.ts`
- `src/lib/auth/platform-admin.server.test.ts`
- `src/lib/menu/admin.ts`
- `src/lib/menu/platform.ts`
- `migrations/20260903008000_roles_permissions_foundation.sql`
- `.github/workflows/quality.yml`
- `package.json`

## Known Issues / Risks
- BLOCKED: CI verification cannot proceed until the invalid dependency range is resolved in a separate atomic task.
- VERIFIED: platform dashboard still has an unresolved schema ownership/reproducibility gap for `website_projects` and `service_requests`.
- UNKNOWN: live production database/deployment state.
- VERIFIED: historical entitlement UI error mapping, E2E caveats, Supabase security-advisor notices, realtime, and order-numbering follow-up areas remain.

## Session Log
- 2026-09-03 — Archived the superseded plan as `PLAN_ARCHIVE_2026-09-03.md` and created the replacement active strategy in `PLAN.md`.
- 2026-09-03 — Fresh audit selected platform authorization consistency as the first atomic task because it is security-sensitive, high-value, unblocked, and smaller/safer than blind platform-schema migration.
- 2026-09-03 — Implemented canonical platform-admin authorization across `admin.ts` and `platform.ts`, preserving the existing server-configured ID/email fallback and adding focused regression coverage.
- 2026-09-03 — Verification became BLOCKED at CI install: `@radix-ui/react-toggle-group@^1.3.8` cannot be resolved by npm. No second feature task was started.

## Exact Next Task
- **Resolve the verified CI dependency-install blocker for `@radix-ui/react-toggle-group` using the smallest compatible version change, then rerun the full quality gate before marking M1 DONE.**
