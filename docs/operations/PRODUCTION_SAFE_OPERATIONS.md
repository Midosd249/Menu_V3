F2 UPDATE — 2026-11-02

F2 implementation is in progress on `feat/f2-production-safe-migrations`. The build command is now artifact-only on this branch; explicit PostgreSQL migrations require target identity, are blocked inside Vercel, require an extra production confirmation, and use a non-blocking advisory lock. Git-triggered Vercel deployments are opt-in for `main` and `preview/*`. No production migration, merge, or deployment has been performed. See `docs/operations/MIGRATION_RUNBOOK.md`. CI and actual Vercel behavior remain pending.

---

# Menuun Production-Safe Operations — Baseline Runbook

**Program:** F-Series / F2–F4 foundation  
**Status:** DOCUMENTED BASELINE — procedures requiring validation are marked PROPOSED or UNKNOWN.  
**Baseline date:** 2026-11-02  
**Canonical policy:** `docs/release-only-vercel-workflow.md`

## 1. Purpose

Protect active restaurant customers and production data while the owner continues development. This document consolidates the operating sequence and identifies controls that still require implementation or evidence.

This document does not authorize a deployment, migration, database mutation, rollback, restore, or CI rerun.

## 2. Environment separation

The operational model should distinguish:

- **Local development:** coding, local database fixtures, unit/integration tests, and local browser QA.
- **Preview:** temporary deployment used only when local verification cannot prove a platform/environment-specific behavior.
- **Production:** customer-serving environment. Changes only through an intentional release batch.

**VERIFIED policy:** Local-first QA and release-only Vercel workflow are already documented in `docs/release-only-vercel-workflow.md`.

**UNKNOWN:** Whether a separate, production-like staging Supabase project is provisioned and safe to use. The F2 runner supports an explicit staging target, but this does not prove a staging project exists. Do not assume Preview automatically receives an isolated database.

**PROPOSED control:** Treat every database URL as production-sensitive. Preview must not receive production database credentials unless a narrowly approved, documented reason exists. The safer default is no database migration capability in application build jobs.

## 3. Build is not a migration command

### F2 implementation — branch evidence, CI pending
- The F1 baseline build invoked `npm run db:migrate`; this historical behavior and the prior Preview migration side effect remain recorded above.
- On the F2 branch, `build` generates artifacts only and no longer invokes the PostgreSQL runner.
- `db:migrate` is a separate operator command. It requires `MIGRATION_TARGET`, `MIGRATION_EXPECTED_HOST`, `MIGRATION_EXPECTED_DATABASE`, and `MIGRATION_EXPECTED_USER`, all matched against the parsed URL before a connection is opened.
- The runner rejects Vercel build/deployment contexts; Production additionally requires `MIGRATION_CONFIRM_PRODUCTION=APPLY_PRODUCTION_MIGRATIONS`.
- A non-blocking PostgreSQL advisory lock prevents two invocations of this runner from applying concurrently. Each SQL file and ledger insert remain transactional.
- Existing PGlite runtime migration behavior is unchanged.
- Focused regression tests assert build separation, missing/mismatched target rejection, Vercel rejection, production confirmation, Vercel Git deployment policy, and advisory-lock wiring.
- Final-head local/sandbox and GitHub CI verification remain pending. No real migration was run.

For the operator procedure and environment requirements, see [MIGRATION_RUNBOOK.md](./MIGRATION_RUNBOOK.md). The expected identity values must be obtained independently from the authorized environment configuration; do not derive them by blindly copying the same connection URL being checked.

## 4. Migration operating procedure

### 4.1 Preflight — required before any migration
1. Identify the exact task and business reason.
2. Inspect current `main`, branch diff, migration files, runner, and all call sites.
3. Confirm target environment and project identity from safe, non-secret evidence.
4. Confirm the canonical migration mechanism and ledger.
5. List pending migrations in exact order.
6. Read each migration fully; identify destructive DDL, data rewrites, locks, long-running operations, triggers, grants, RLS, and dependencies.
7. Verify a current recovery point appropriate to the risk.
8. Test against a local disposable database or isolated staging database.
9. Confirm compatibility with the currently serving application version.
10. Define expected result, verification query, stop conditions, and recovery/forward-fix plan.
11. Obtain explicit owner approval for production execution.

### 4.2 Apply
- Only one authorized migration runner/operator at a time.
- Never run migrations as a side effect of ordinary application build.
- Never run a migration against an ambiguous database URL.
- Preserve transaction boundaries and runner semantics.
- Do not manually edit the production ledger to force success.
- Do not re-run a partially failed migration until actual database state is inspected.
- Never use Supabase CLI migration commands against the custom ledger without a separately approved migration transition plan.

### 4.3 Post-migration
- Confirm the expected ledger row(s).
- Confirm expected schema objects and constraints.
- Confirm grants, RLS, and policies have not widened unexpectedly.
- Run focused data-integrity checks.
- Run the relevant application tests/smoke checks.
- Record exact target, migration names, timestamp, result, and evidence.
- Keep the previous application compatible until the release decision allows contract cleanup.

## 5. Schema compatibility — Expand/Contract

For changes that may overlap with active traffic or old/new application versions:

1. **Expand:** add nullable columns/tables/indexes or compatible structures without removing the old path.
2. **Deploy compatibility code:** application supports both schema shapes.
3. **Backfill:** if needed, update data in bounded, restartable, observable batches.
4. **Switch:** route reads/writes to the new representation.
5. **Observe:** check errors, data consistency, query performance, and customer flows.
6. **Contract:** remove old columns/constraints only in a later release after no active code depends on them.

Do not bundle expand and destructive contract in one deployment unless the compatibility analysis proves it safe and the owner explicitly approves the risk.

## 6. Production release checklist

### Before merge
- [ ] Exact task and customer impact are documented.
- [ ] Current main SHA and PR base/head are verified.
- [ ] Final PR head has applicable Quality and W9 checks.
- [ ] Typecheck, tests, lint, build, auth/security, migration fixture, and browser checks ran where applicable.
- [ ] No check is reported as passed unless it ran and passed.
- [ ] Final diff reviewed; no unrelated changes/secrets.
- [ ] Database changes are separately identified; no hidden migration in build.
- [ ] Backup/recovery point confirmed where data risk requires it.
- [ ] Rollback/forward-fix decision is documented.
- [ ] Vercel Usage/Billing constraints checked before any deployment decision.
- [ ] One coherent release batch is ready.

### Release
1. Merge the verified batch to `main`.
2. Record the merge SHA.
3. Allow or trigger only the intended production deployment according to the existing release workflow.
4. Verify Vercel deployment state and deployed commit SHA directly.
5. Do not infer production state from CI or Preview.
6. Avoid random retries; inspect the failure and changed condition first.

### After deployment
- [ ] Confirm production deployment is READY and SHA matches intended main release.
- [ ] Check public menu and relevant authenticated critical flows.
- [ ] Perform real-device QA when the change affects user-visible behavior.
- [ ] Inspect runtime errors and logs for the release window.
- [ ] Confirm database/migration state if applicable.
- [ ] Observe the release before closing.
- [ ] Update continuity and release evidence.

## 7. Application rollback vs database recovery

These are separate operations.

### Application rollback
- Confirm a real production regression.
- Identify an eligible previous production deployment from Vercel.
- Verify target deployment and commit before action.
- Record reason, target, operator, and result.
- Verify production after rollback.
- Remember that deployment rollback may not restore environment variables/configuration.

### Database recovery
- Do not assume Vercel rollback reverses SQL.
- Prefer a forward fix when an additive, backward-compatible migration has already been applied and data is intact.
- For destructive or corrupting data changes, follow the isolated restore/recovery plan.
- Never restore over production as an exploratory test.
- Preserve the original database and evidence until recovery is validated.

## 8. Backup and restore procedure — design baseline

**UNKNOWN:** Current plan-level backup/PITR coverage, retention, and successful restore evidence were not established in this documentation task.

### Inventory
Record:
- Supabase project and region.
- Plan and backup/PITR entitlement.
- Automated backup frequency and retention.
- Point-in-time recovery window if available.
- Manual dump/export process, format, version, and encryption.
- Storage location, access control, and retention.
- Whether object storage/assets are included.
- Recovery dependencies and secret/configuration recovery process.

### Isolated restore drill — PROPOSED
1. Select a known recovery point.
2. Create a separate isolated restore target.
3. Restore without touching production.
4. Verify schema and migration-ledger consistency.
5. Verify representative tenants, branches, menus, products, orders, subscriptions, memberships, and audit records using privacy-safe checks.
6. Verify storage/object references where applicable.
7. Start the application against the isolated target with test credentials.
8. Run auth, tenant-isolation, public-menu, and representative operational smoke tests.
9. Record restore duration, missing elements, manual steps, and exact recovery point.
10. Destroy the isolated test target only after evidence is safely recorded and access is revoked.

A backup is not a tested recovery process until this drill succeeds.

### Recovery objectives
- **RPO:** UNKNOWN — owner approval required.
- **RTO:** UNKNOWN — owner approval required.
- Do not set these values by assumption.

## 9. Monitoring and alert triage

Track these classes, subject to the actual observability capabilities available:

| Signal | Why it matters | Triage rule |
|---|---|---|
| Production deployment state/SHA | Confirms intended release is live | Compare Vercel deployment SHA to main release SHA |
| Runtime error groups | Detects customer-visible failures | Correlate count, recurrence, route, deployment, and safe user context |
| Authorization denials | May be expected or may indicate permission mismatch | Do not call every Forbidden event a defect; verify role, permission, operation, and recurrence |
| Public menu availability | Core customer discovery | Check representative published menu paths and latency |
| Order failures/duplicates | Customer and restaurant operations | Inspect server validation, idempotency, and persisted state |
| DB connectivity/latency | Core application dependency | Inspect connection errors, saturation, and query latency |
| Migration failures | Can block releases or leave partial state | Stop retries; inspect ledger and actual schema first |
| External timeouts | Can degrade integrations | Distinguish transient timeout from persistent dependency failure |
| Quota/build limits | Can block deployment | Check actual Usage/Billing; do not retry randomly |

### Existing runtime observations — historical, not a current incident
A prior seven-day Vercel runtime inspection recorded several authorization-denial groups and one sitemap auth-query timeout. Their customer impact/root cause was not established. They must not be described as confirmed defects or as current unresolved incidents without a fresh query.

## 10. Incident response template

Create a separate incident record under `docs/incidents/` when a material production incident occurs.

Required fields:
- Incident ID, severity, detected time, resolved time.
- Affected service/route/tenant scope (avoid PII).
- Deployment ID and commit SHA.
- Customer impact and duration.
- Detection source and evidence.
- Timeline of actions.
- Containment and recovery choice.
- Whether database/schema/data changed.
- Root cause and contributing factors.
- Verification after recovery.
- Customer communication, if applicable.
- Prevention actions with owner and status.
- Related PR, tests, ADR, and runbook updates.

Never include secrets, tokens, full connection strings, or unnecessary customer-identifying data.

## 11. Change risk classes

| Class | Examples | Minimum controls |
|---|---|---|
| R0 — Documentation-only | Architecture docs, ADRs, continuity | Link/source check, diff review, no runtime claim |
| R1 — Low-risk app change | Isolated copy/UI change | Local checks, relevant tests, visual QA if applicable, CI |
| R2 — Critical journey | Auth, orders, subscriptions, public menu | Full relevant regression, security/data-boundary review, CI |
| R3 — Database/schema | Migration, trigger, grants, RLS, data rewrite | Migration preflight, isolated DB test, compatibility, recovery point, explicit approval |
| R4 — Production/release/platform | Vercel config, secrets, production deploy/rollback | Release checklist, exact target evidence, owner authorization, post-change verification |

Classification may be raised when blast radius or uncertainty is higher. Never lower it merely to avoid a gate.

## 12. Official operational references

- Supabase Database Migrations: https://supabase.com/docs/guides/deployment/database-migrations
- Supabase Managing Environments: https://supabase.com/docs/guides/deployment/managing-environments
- Supabase Deployment: https://supabase.com/docs/guides/deployment
- Supabase CLI migration reference: https://supabase.com/docs/reference/cli/supabase_migration
- Vercel Deployments: https://vercel.com/docs/deployments
- Vercel Instant Rollback: https://vercel.com/docs/instant-rollback
- Vercel Managing Deployments: https://vercel.com/docs/deployments/managing-deployments
- PostgreSQL documentation: https://www.postgresql.org/docs/current/

Vendor documentation describes vendor-managed workflows. It does not authorize replacing the repository's current custom migration runner or ledger.