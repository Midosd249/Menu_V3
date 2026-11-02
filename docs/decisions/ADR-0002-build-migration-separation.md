# ADR-0002 — Separate Application Builds from Database Migrations

- **Status:** Accepted for implementation in F2
- **Date:** 2026-11-02
- **Decision owner:** Menuun sole human owner
- **Related:** ADR-0001, `package.json`, `scripts/migrate.mjs`, `scripts/migration-safety.mjs`, `vercel.json`

## Context

The prior `build` script ran Vite, prepared the PGlite asset, and then invoked `npm run db:migrate`. Vercel automatically creates Git deployments for pushes unless deployment creation is explicitly disabled. Historical repository evidence records a Preview build applying a migration to the connected Supabase database. The exact Preview and Production database URL values are not inspected and must remain UNKNOWN.

## Decision

1. Application builds generate artifacts only and never invoke the PostgreSQL migration runner.
2. Database migrations remain on the existing repository custom runner and `menu_v3._migrations` ledger (ADR-0001).
3. Migration execution is a separately invoked operator command requiring an explicit target and exact expected host/database/user identity.
4. The runner refuses all Vercel build/deployment contexts. Production additionally requires an exact operator confirmation phrase.
5. PostgreSQL advisory locking serializes concurrent invocations of this runner; each migration and its ledger insert remain transactional.
6. Git-triggered Vercel deployments are opt-in: `main` is enabled for Production and `preview/*` is enabled for explicit Preview exceptions. All other branches are disabled by default.
7. No automatic production migration workflow is introduced until backup/recovery, protected environment approval, and actual target identity are independently verified.

## Consequences

- Vercel Preview/Production builds no longer mutate the database through the package build command.
- Existing PGlite runtime migration behavior remains unchanged.
- Operators must supply the expected target identity for every explicit migration run.
- The current project has no verified isolated staging target; staging remains an operational prerequisite, not an assumed resource.
- Production migrations remain a manual, separately authorized action.
- The Vercel preview namespace provides a controlled exception without triggering deployments for every feature/docs branch.

## Alternatives considered

- Keep migrations in build: rejected because builds are triggered by Git pushes and deployment environments may have database credentials.
- Switch to Supabase CLI migration history: rejected because ADR-0001 preserves the custom ledger and migration semantics; no adoption plan was requested or verified.
- Automatically migrate on merge to main: deferred until protected environments, backup readiness, and exact target mapping are verified.
