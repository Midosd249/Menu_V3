# Deployment and Release Topology

**Status:** F2 implementation baseline — 2026-11-02  
**Repository main SHA:** `e5d7c89a73718f35e7accbae7933af36c366bbc1`  
**F1/F2 working branch:** `feat/f2-production-safe-migrations`

## Hosting
- Vercel is the hosting/release platform.
- `vercel.json` declares region `icn1`.
- TanStack Start is integrated with Vite and Nitro (see `vite.config.ts`).
- The Vercel project is named `menu-v3`; observed production domains include `www.menuun.com` and `menuun.com`.
- Current Production serving SHA remains UNKNOWN; a READY Preview is not production evidence.

## Build commands
- `build`: `with-app-env.mjs vite build` followed by `ensure-pglite-asset.mjs`.
- `db:migrate`: explicit `node scripts/migrate.mjs` operator command; it is not called by `build`.
- `build:dev`: Vite development-mode build.
- `typecheck`: `tsc --noEmit`.
- `check:auth`: `scripts/check-auth-invariant.mjs`.
- `test`: repository Node test suite, including migration safety contracts.

## Database selection and migration boundary
- `src/lib/db.ts` selects PostgreSQL when a supported PostgreSQL URL exists; otherwise it uses PGlite.
- PGlite's existing runtime migration path remains unchanged.
- The explicit PostgreSQL migration runner uses `migrations/` and `menu_v3._migrations`; each migration and its ledger insert remain transactional.
- Before opening a connection, the runner requires `MIGRATION_TARGET`, `MIGRATION_EXPECTED_HOST`, `MIGRATION_EXPECTED_DATABASE`, and `MIGRATION_EXPECTED_USER`, and checks all three identity values against the parsed connection URL.
- The runner rejects Vercel contexts (`VERCEL=1` or any `VERCEL_ENV`). Production additionally requires `MIGRATION_CONFIRM_PRODUCTION=APPLY_PRODUCTION_MIGRATIONS`.
- A PostgreSQL advisory lock serializes this runner's concurrent invocations. It fails rather than waiting when another runner holds the lock.
- Connection URLs/passwords are not printed. See [Migration Runbook](../operations/MIGRATION_RUNBOOK.md) and [ADR-0002](../decisions/ADR-0002-build-migration-separation.md).

## Vercel Git deployment policy
- `vercel.json` configures Git deployments as opt-in.
- `main` is enabled for the Production branch.
- `preview/*` is the explicit opt-in namespace for Preview deployments.
- All other branches are disabled by the wildcard default.
- This policy applies to Git-triggered deployments; manual Vercel deployments remain a separate authorized action.
- The actual effect on the next PR must be confirmed from Vercel events. Configuration source alone is not proof that Vercel skipped a deployment.

## Environment separation and limitations
- Exact Preview vs Production database target remains UNKNOWN; secret values were not inspected.
- A separate staging Supabase project and protected migration environment remain UNKNOWN.
- No automated migration workflow is configured; production migrations remain separate manual operator actions.
- Backup retention, PITR entitlement, and successful restore evidence remain UNKNOWN.
- No F2 migration was run against Supabase or any production database.

## Release-only policy
Follow `docs/release-only-vercel-workflow.md`: local development and QA → CI quality gates → diff review → one coherent release batch → main → one Production deployment → real-device QA. Preview is exception-only.

## Release evidence discipline
A Git commit, green CI run, Preview READY, or HTTP 200 is not individually proof of current Production. Record deployment ID, target, state, and serving commit SHA for each authorized release.
