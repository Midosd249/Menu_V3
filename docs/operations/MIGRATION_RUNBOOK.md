# Menuun Database Migration Runbook

**Status:** F2 implementation baseline — 2026-11-02  
**Canonical runner:** `scripts/migrate.mjs`  
**Canonical ledger:** `menu_v3._migrations`  
**Decision:** Preserve ADR-0001; do not switch to the Supabase CLI migration ledger as part of this procedure.

## Safety boundary

- `npm run build` creates application artifacts only. It never invokes `db:migrate`.
- `npm run db:migrate` is an explicit operator action. It is not part of Vercel build/deployment.
- The migration runner refuses to run when `VERCEL=1` or `VERCEL_ENV` is present, including Preview and Production build contexts.
- Every explicit run requires `MIGRATION_TARGET` (`local`, `staging`, or `production`) and an exact expected database host, database name, and username.
- Production additionally requires `MIGRATION_CONFIRM_PRODUCTION=APPLY_PRODUCTION_MIGRATIONS`.
- The connection URL/password is never printed by the runner.
- A PostgreSQL advisory lock serializes concurrent invocations using this runner. Every migration and its ledger insert remain in the existing transaction.

## Required environment

Set these values in the controlled operator environment; never commit them:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` (or one of the supported PostgreSQL URL aliases) | Actual connection URL |
| `MIGRATION_TARGET` | Explicit `local`, `staging`, or `production` target |
| `MIGRATION_EXPECTED_HOST` | Exact PostgreSQL URL hostname |
| `MIGRATION_EXPECTED_DATABASE` | Exact database name from the URL path |
| `MIGRATION_EXPECTED_USER` | Exact decoded database username |
| `MIGRATION_CONFIRM_PRODUCTION` | Required production phrase; omit for local/staging |

All three expected identity fields must match the parsed connection URL. This is particularly important for pooled Supabase connections, where the hostname alone may be shared and the username may encode the project reference.

## Controlled procedure

1. Confirm the intended target and obtain the correct connection details from the authorized secret store.
2. Confirm a recent, usable backup/recovery point appropriate to the migration risk. Do not assume that a backup exists or that a restore has been tested.
3. Review the exact pending migration filenames and SQL. Confirm ordering, preconditions, lock/downtime impact, compatibility with the currently deployed application, and a forward-fix/recovery plan.
4. Set all required environment variables in a trusted shell. Do not run this command from a Vercel build, Preview, or deployment environment.
5. Run `npm run db:migrate` once. The runner logs the target identity without exposing the URL/password, then serializes execution and records applied filenames in `menu_v3._migrations`.
6. Capture the command result, applied migration names, target identity (host/database/user only), timestamp, and operator decision in the release record.
7. Verify the expected schema state with read-only catalog queries and run the application compatibility checks before proceeding with a release.

### Staging example

Use the exact values for the isolated staging database. The following is a placeholder template, not a configured target:

```sh
MIGRATION_TARGET=staging \
MIGRATION_EXPECTED_HOST='<staging-host>' \
MIGRATION_EXPECTED_DATABASE='<database-name>' \
MIGRATION_EXPECTED_USER='<database-user>' \
DATABASE_URL='<staging-postgresql-url>' \
npm run db:migrate
```

### Production example

Production execution is deliberately manual and requires the exact confirmation phrase:

```sh
MIGRATION_TARGET=production \
MIGRATION_EXPECTED_HOST='<production-host>' \
MIGRATION_EXPECTED_DATABASE='<database-name>' \
MIGRATION_EXPECTED_USER='<database-user>' \
MIGRATION_CONFIRM_PRODUCTION=APPLY_PRODUCTION_MIGRATIONS \
DATABASE_URL='<production-postgresql-url>' \
npm run db:migrate
```

Do not paste real connection strings into chat, Git, issue comments, logs, or documentation.

## Environment and deployment policy

- Vercel Git deployments are disabled by default for all branches.
- `main` remains the production deployment branch.
- `preview/*` is the explicit opt-in namespace for a Preview deployment when a real preview is needed and its database environment is independently confirmed safe.
- Other development branches (`feat/*`, `fix/*`, `docs/*`, `chore/*`, and unclassified branches) do not automatically create Vercel deployments.
- This repository configuration controls Git-triggered deployments only; it does not prevent an authorized operator from manually deploying through Vercel.
- No staging Supabase project or protected migration environment was proven to exist during F2. Do not claim staging migration execution until an isolated target is identified and tested.

## Non-goals and prohibitions

- Do not run migrations automatically during build, Preview, or Production deployment.
- Do not run `supabase db push`, `supabase migration repair`, or rewrite the custom ledger as a shortcut.
- Do not edit an already-applied migration; create a corrective migration.
- Do not assume application rollback reverses a database migration.
- Use Expand → Migrate/Backfill → Switch → Contract for schema changes that must coexist across application versions.
- This runbook does not authorize a production migration or deployment.
