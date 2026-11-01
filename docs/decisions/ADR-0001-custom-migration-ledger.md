# ADR-0001 — Preserve the Repository Custom Migration Ledger

- **Status:** Accepted (existing repository decision recorded)
- **Date recorded:** 2026-11-02
- **Decision owner:** Menuun sole human owner
- **Program:** F-Series
- **Related:** `scripts/migrate.mjs`, `migrations/`, `menu_v3._migrations`, F2

## Context

Menuun currently has a repository-managed PostgreSQL migration runner at `scripts/migrate.mjs`.

**VERIFIED from source at baseline:**
- The runner reads SQL migration files from `migrations/`.
- It connects using the first available supported PostgreSQL connection-string environment variable.
- It creates/uses schema `menu_v3`.
- It creates/uses `menu_v3._migrations` as its applied-migration ledger.
- It checks recorded migration names and applies pending files in order.
- Each migration file and its ledger insert are wrapped in a transaction.
- The `package.json` build script invokes `npm run db:migrate` after the application build and PGlite asset step.

Existing repository continuity records explicitly state that `menu_v3._migrations` plus the custom runner is the operational migration chain. Supabase CLI migration history may be inspected for audit/evidence, but is not the canonical ledger under that decision.

Supabase's official CLI uses a separate table, `supabase_migrations.schema_migrations`, for CLI-managed migrations. The existence of that table does not make it interchangeable with the repository custom ledger.

## Decision

Preserve the repository custom migration runner and `menu_v3._migrations` as the canonical operational migration mechanism unless the owner explicitly approves a separately researched migration-system transition.

Do not:
- Run `supabase db push` against production as a shortcut.
- Run `supabase migration repair` to align histories without proving the actual schema and intended ledger semantics.
- Delete, rename, reorder, or rewrite applied migration files.
- Treat the Supabase CLI ledger as authoritative for custom-runner migrations.
- Apply schema changes through the dashboard and leave the repository migration history inconsistent.

## Consequences

### Positive
- Existing migration execution semantics remain stable.
- Git-tracked SQL and the custom ledger remain the source of applied migration identity.
- The team avoids accidentally running the same SQL through two independent migration mechanisms.

### Risks and required controls
- Build currently invokes the migration runner. This is a separate production-safety defect to address in F2.
- Runner concurrency/locking and target-environment identity require deeper verification in F2.
- Custom runner behavior must be tested against disposable local database fixtures.
- Supabase CLI history may be incomplete or divergent and must not be used to infer custom-runner state.

## Migration-system change process

If a future migration-system transition is proposed:

1. Inventory all migration files and both history tables.
2. Read current schema and applied state from the actual target.
3. Determine how each migration maps to the proposed system.
4. Design a non-destructive baseline/adoption procedure.
5. Test against a clone or isolated staging database.
6. Verify no migration is accidentally re-applied or skipped.
7. Document rollback and recovery.
8. Obtain explicit owner approval.
9. Execute as a dedicated high-risk task, never bundled into an unrelated feature.

## References

- Repository runner: `scripts/migrate.mjs`
- Migration directory: `migrations/`
- Supabase migrations guide: https://supabase.com/docs/guides/deployment/database-migrations
- Supabase CLI migration reference: https://supabase.com/docs/reference/cli/supabase_migration
