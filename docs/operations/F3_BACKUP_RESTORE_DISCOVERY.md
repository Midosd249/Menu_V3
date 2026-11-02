# F3 — Backup, Restore & Disaster Recovery Discovery

**Date:** 2026-11-02  
**Repository main:** `848d4acdd3b184c24142d1e77fc0c9af55f20eab`  
**Supabase project:** `ublxptcqefujkbeepylc`  
**Classification:** F3.1 — Backup Inventory (read-only)  
**Status:** IN_PROGRESS — initial evidence captured; owner reports Free plan; account-specific backup inventory remains open.

## 1. Scope and safety

This document records the first evidence pass only. No backup was restored, no PITR setting was changed, no project was cloned, no migration or DDL/DML was run, and no production data was modified. The Supabase SQL used in this pass was a read-only query against Storage bucket metadata.

## 2. Verified environment identity

| Item | Evidence |
|---|---|
| Supabase project ref | `ublxptcqefujkbeepylc` |
| Project state | `ACTIVE_HEALTHY` |
| PostgreSQL | Major version 17; reported version 17.11.0.002 |
| Region | `ap-northeast-2` |
| Main application release | Vercel Production READY on main SHA `848d4acdd3b184c24142d1e77fc0c9af55f20eab` |

**USER-REPORTED:** owner states the Supabase subscription is Free. **UNKNOWN:** the connected `get_project` metadata response does not independently expose the billing plan, PITR activation, or backup inventory.

## 3. Backup inventory

| Capability | Current finding | Evidence status |
|---|---|---|
| Supabase daily database backups | Supabase documentation says automatic daily backups apply to Pro, Team and Enterprise plans; Free has no automatic daily backups | VERIFIED platform policy; project entitlement UNKNOWN |
| Daily backup retention | Pro 7 days; Team 14 days; Enterprise up to 30 days | VERIFIED platform policy; project plan/retention UNKNOWN |
| PITR | Paid add-on; requires at least Small compute; worst-case documented RPO 2 minutes | VERIFIED platform policy; project activation/retention UNKNOWN |
| Actual latest backup timestamps | Not returned by connected Supabase project metadata/tools | UNKNOWN / BLOCKED |
| Backup-list Management API | Official docs expose a project database-backups endpoint; no matching connected connector action was available and no access token was read | BLOCKED pending owner-authorized read-only access |
| Existing manual/off-site exports | No current artifact or external backup inventory verified in this pass | UNKNOWN |
| Previously mentioned manual backup artifact | `menu-v3-full.backup` was referenced in prior project context; its current bytes, date, source project, integrity, encryption, completeness, and restorability were not verified in this session | UNKNOWN |

Official sources:
- Supabase Database Backups: https://supabase.com/docs/guides/platform/backups
- Supabase Pricing: https://supabase.com/pricing
- Supabase Restore to a New Project: https://supabase.com/docs/guides/platform/clone-project



### 3.1 Free-plan, no-upgrade manual database export

Supabase's official Free-plan FAQ confirms there are no automatic daily backups on Free; manual CLI exports are supported. The documented CLI path is to authenticate/link the project from a trusted private machine, then export roles, schema, and data separately. Example commands after linking:

```powershell
npx supabase login
npx supabase link --project-ref ublxptcqefujkbeepylc
npx supabase db dump --linked -f roles.sql --role-only
npx supabase db dump --linked -f schema.sql
npx supabase db dump --linked -f data.sql --use-copy --data-only
```

Run from a private working directory, not this public repository. The CLI's documented dump excludes Supabase-managed schemas (including Auth and Storage); these files do not back up Storage object bytes, Auth users/configuration, Edge Functions, project settings, or secrets. Do not treat these three files as a complete disaster-recovery package. Verify each output exists, record SHA-256 checksums, encrypt the files, and keep copies in at least one private off-site location. Never upload dumps to this public GitHub repository or its Actions artifacts.

**Execution boundary:** these commands were researched but not run from this connected session. The available Supabase connector does not provide pg_dump, Docker, CLI execution, or downloadable backup artifacts. No database credentials were read or requested.

Official references:
- https://supabase.com/kb/faqs/platform/free-plan-backups
- https://supabase.com/docs/reference/cli/supabase-db-dump
- https://supabase.com/docs/guides/deployment/ci/backups

## 4. Storage and media coverage

**VERIFIED from live read-only catalog:** schema `storage` contains the standard bucket/object metadata tables. A single bucket exists: `menu-assets`, configured as public.

**VERIFIED from official Supabase documentation:** database backups do not include the actual object bytes stored through the Storage API. PostgreSQL stores bucket/object metadata, while object bytes live in the Storage backing provider. Restoring a database backup does not recover object bytes deleted after that backup.

**UNKNOWN:** current object count/size, object-versioning state, independent object export/replication, lifecycle policy, retention, and tested object restore. Bucket metadata alone is not proof of media backup coverage.

Official sources:
- Supabase Database Backups: https://supabase.com/docs/guides/platform/backups
- Supabase Storage Schema: https://supabase.com/docs/guides/storage/schema/design
- Supabase Backup and Restore using the CLI: https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore

## 5. Restore options and material hazards

### Restore to a new Supabase project

Supabase documents this as a paid-plan feature requiring physical backups. The clone includes database schema/data, roles/permissions/users and Auth records. It does **not** copy Storage object bytes or settings, Edge Functions, Auth settings/API keys, Realtime settings, database extensions/settings, or read replicas; these require separate reconstruction.

**Critical hazard:** this is a binary restore. Enabled extensions capable of external operations (for example `pg_net`, `pg_cron`, wrappers) may begin running as soon as restore completes. Supabase warns that these cannot be disabled before the binary restore. The extension/job inventory must therefore be reviewed before choosing this path.

### Logical restore to a separately created project

This offers more control over what is restored and can avoid automatically carrying over external jobs, but requires a carefully designed dump/restore procedure. Supabase documentation notes that a logical restore does not automatically carry over the encryption root key; Vault secrets/encrypted columns require separate key handling. Do not perform this without an explicit recovery design and authorization.

**NEVER:** restore over Production during testing.

Official sources:
- https://supabase.com/docs/guides/platform/clone-project
- https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore

## 6. Proposed recovery objectives — not approved

| Metric | Proposed initial target | Status / caveat |
|---|---|---|
| Database RPO | 24 hours without PITR; up to 2 minutes only if PITR is confirmed enabled and healthy | PROPOSED; daily-backup availability and PITR must be verified |
| Database RTO | 4 hours for service restoration using an isolated restore/controlled cutover | PROPOSED; no restore duration has been measured |
| Storage media RPO | 24 hours only after a separate object backup mechanism is selected and verified | PROPOSED; currently UNKNOWN |
| Storage media RTO | 8 hours pending measured export/restore throughput | PROPOSED; untested |

These are planning targets, not existing guarantees. Owner approval and a real isolated restore exercise are required before they become service objectives. Supabase restore duration depends on database size and WAL activity; no exact RTO is guaranteed by these proposed values.

## 7. Open evidence register

1. Verify Supabase organization plan and the source project's actual backup entitlement.
2. Retrieve actual daily backup list, timestamps, and retention without invoking restore.
3. Verify whether PITR is enabled, its configured retention, and its billing impact.
4. Inventory Storage object count/size and choose an independent object backup/export strategy.
5. Locate and validate the previously mentioned `menu-v3-full.backup` artifact (if still available), plus any other manual/off-site database and media backups; record date, source identity, checksums, encryption, custody and restore compatibility.
6. Inspect extensions, cron jobs, webhooks and external-effect triggers before selecting a binary clone path.
7. Identify a separately isolated recovery project and confirm cost, region, access boundaries and no Production aliases/credentials.
8. Execute one authorized isolated restore and validate schema, custom migration ledger, critical relationships, representative queries, tenant/branch isolation, Auth, and media references.
9. Measure recovery time and reconcile RPO/RTO proposals with owner-approved business requirements.

## 8. F3 completion gate

F3 remains **NOT DONE** until backup mechanisms and retention are evidenced; recovery dependencies are understood; an isolated restore succeeds; restored database integrity and tenant/branch boundaries are validated; media recovery is tested; practical incident runbooks are complete; RPO/RTO are explicitly classified and owner-approved; and continuity files are updated.

## 9. Owner decision — deferred

As of 2026-11-02, the owner confirms all current accounts/restaurants are private test fixtures and there are no real customers or customer-owned production datasets. F3 execution is therefore **DEFERRED BY OWNER — NOT DONE**.

Deferred until the pre-commercial gate: manual database exports, backup automation, Storage/Auth recovery implementation, paid plan/PITR upgrades, paid recovery infrastructure, and isolated restore drills. No cost, project, backup, restore, or production mutation is authorized now.

F3 must be resumed and completed before the first real customer, before storing real customer-owned data, or before commercial launch, whichever occurs first. The existing F3 completion gate in Section 8 remains unchanged and mandatory. Prior discovery remains research evidence only; it does not establish an actual backup or successful restore. The menu-v3-full.backup artifact remains unverified.

## 10. Next phase

F4 Release, Monitoring & Incident Operations is active. F4 must use existing/free capabilities and does not remove or weaken the F3 pre-commercial gate.
