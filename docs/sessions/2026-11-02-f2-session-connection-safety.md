# F2 Session Connection Safety Follow-up — 2026-11-02

## Classification

F2 — Production-Safe Build & Migration Boundary. Focused correction discovered during recovery/review; this does not repeat or replace the existing F1/F2 implementation.

## Verified prior work

- PR #415 is open against `main`; original inspected head was `283e8e803fe6bdcdd8a0ae03b406d16509bfb122`.
- GitHub Quality run `41376988561` succeeded on that exact original head. Typecheck, npm tests, lint, production build, all-theme browser QA, brand browser QA, Studio browser QA, and Platform Admin browser QA completed successfully.
- W9 Orders QA run `41376988586` succeeded on that exact original head.
- One Vercel Preview exists for the first F2 code commit `5ce4a7108c9adb383931af0557375be78caf5884`, deployment `dpl_CMdCq6E2gEz3UR2bjJN782UMDHUj`, state READY, target null. No deployment exists for original PR head `283e8e803fe6bdcdd8a0ae03b406d16509bfb122`.
- The project config allows Git deployments for `main` and `preview/*`, while `**: false` suppresses other branches. Official Vercel docs specify minimatch branch patterns and that an unspecified branch defaults to enabled.
- No merge, Production deployment, database migration, schema change, or secret access occurred.

## New issue found

The runner uses session-level PostgreSQL advisory locks and session-level `SET search_path`. Supabase documents that transaction-mode pooling does not preserve session-level advisory locks or `SET` state between transactions. The earlier runner accepted any PostgreSQL URL and did not distinguish transaction pooling.

This was a real safety gap: a transaction-pooler URL could invalidate the runner's lock and session assumptions.

## Focused correction applied

- `scripts/migration-safety.mjs`: require explicit `MIGRATION_CONNECTION_MODE=direct|session`; require exact expected port; reject standard Supabase transaction pooler port `6543`.
- `scripts/migrate.mjs`: log the declared mode and validated port without exposing credentials.
- `scripts/migration-safety.test.mjs`: add regression coverage for missing/invalid mode, port mismatch, and Supabase transaction-pooler rejection.
- `docs/operations/MIGRATION_RUNBOOK.md`: require direct or session mode and explain the session-state constraint.
- Added ADR-0003 to preserve the decision and source evidence.

## Research

- Supabase official connection guide: https://supabase.com/docs/guides/database/connecting-to-postgres
- PostgreSQL official advisory-lock documentation: https://www.postgresql.org/docs/current/explicit-locking.html
- Vercel official Git configuration: https://vercel.com/docs/project-configuration/git-configuration

## Verification status

- **VERIFIED:** original F2 PR head Quality and W9 passed before this focused correction.
- **PENDING:** Quality and W9 must rerun on the latest corrected PR head.
- **NOT RUN:** no local execution was available in this connected session.
- **NOT PERFORMED:** no database connection, migration, merge, or Production deployment.
- **UNKNOWN:** actual Supabase connection mode configured for any operator environment; staging database existence; backup/restore readiness.

## Exact next action

Verify GitHub Quality and W9 on the final updated PR #415 head, then review the final diff and stop without merge or Production deployment.
