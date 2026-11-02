# F4 — Release, Monitoring & Incident Operations

**Date:** 2026-11-02  
**Status:** IN_PROGRESS — F4.1 read-only operational baseline  
**Repository base:** main 848d4acdd3b184c24142d1e77fc0c9af55f20eab  
**Scope:** operational evidence and documentation only. No application code, database schema, settings, secrets, deployments, alerts, or customer data were changed.

## 1. Phase boundary

F4 establishes an affordable, repeatable way to detect service degradation, identify the affected release/dependency, contain incidents, recover safely, and record evidence. It must use existing capabilities first and avoid paid upgrades or noisy CI/deployment activity.

F3 remains **DEFERRED BY OWNER — NOT DONE**. F4 does not waive F3. F3 must be completed before the first real customer, real customer-owned data, or commercial launch, whichever occurs first. No backup, restore, PITR, or paid recovery action is included here.

## 2. Repository baseline — VERIFIED

- docs/operations/PRODUCTION_SAFE_OPERATIONS.md already defines environment separation, release checklist, application rollback vs database recovery, monitoring signal classes, incident record fields, and risk classes.
- docs/release-only-vercel-workflow.md is the canonical release policy. Do not duplicate or weaken it.
- F2 has separated application build from explicit database migration execution. F4 must preserve that boundary.
- Historical runtime observations in the operations runbook are explicitly not current incidents; do not relabel them without fresh evidence.

## 3. Connected platform snapshot — VERIFIED, read-only, 2026-11-02

### Supabase project

- Project ref: ublxptcqefujkbeepylc.
- Region: ap-northeast-2.
- Project status at inspection: ACTIVE_HEALTHY.
- PostgreSQL: 17.11.
- Organization plan returned by the connected account: free.
- The project status is a platform snapshot, not proof that every application route or customer journey is healthy.

### Recent log-source activity

A read-only aggregation over the available last-24-hour log window returned:

| Source | Events | Latest event (UTC) |
|---|---:|---|
| edge_logs | 6 | 2026-11-02 03:41:30 |
| postgres_logs | 30 | 2026-11-02 01:41:46 |
| postgrest_logs | 7 | 2026-11-02 00:01:12 |
| storage_logs | 4 | 2026-11-02 03:41:30 |

The query establishes that these sources returned events, not that requests succeeded or failed. It did not include full messages or customer identifiers. No auth_logs or function_edge_logs rows were returned in the focused result; this is not proof of no Auth/function activity or health.

### Supabase advisor snapshot

- Security advisor returned one warning: **Leaked Password Protection Disabled**. This is a verified advisor finding; no setting was changed. Route to a separate F6 security decision after checking current Auth configuration, impact, and compatibility.
- Security advisor also returned 40 informational rls_enabled_no_policy findings across menu_v3 tables. These findings require context: a custom schema with no client-facing grants may intentionally have no policies. Do not add policies or disable RLS based on the lint label alone.
- Performance advisor returned 19 unindexed-FK findings and 13 multiple-permissive-policy warnings, alongside unused-index notices. These are review candidates, not authorization for schema/index changes. Workload, query plans, schema ownership, and current code paths must be checked before any remediation.

## 4. Vercel observability constraints — VERIFIED from official documentation

- Basic Vercel Observability is documented as available on all plans; Observability Plus provides additional metrics, limits, and retention.
- Vercel runtime-log retention is plan-dependent; the official runtime-log page currently lists Hobby retention as one hour. Confirm the actual Vercel team/project plan before relying on this value operationally.
- Vercel Alerts are documented for Pro and Enterprise with Observability Plus. Do not design F4 around paid alerts or assume email/webhook alerting is available on the current account.
- Official production rollback guidance requires confirming the issue, rolling back to an eligible prior deployment, verifying recovery, and then investigating. Hobby rollback eligibility is more limited than Pro/Enterprise; check the actual available deployment before acting.
- No Vercel Usage/Billing page was inspected in this task. Exact current Vercel plan, remaining quota, alert entitlement, and production log retention for this project remain UNKNOWN.

## 5. Proposed low-cost operating model

1. **Release identity:** record intended main SHA, production deployment ID, deployment state, and observed production alias after each authorized release.
2. **Daily lightweight check:** inspect Supabase project status and a small, fixed window of aggregated error/connection signals; inspect Vercel production deployment state and recent runtime errors when available. Record observation time and exact window.
3. **On-demand incident check:** correlate timestamp, route/service, deployment ID/SHA, error class, and dependency. Avoid collecting request bodies, tokens, full URLs with query strings, or customer PII.
4. **Capacity watch:** inspect Supabase Database Reports (CPU, memory, disk, database size, connections) where available. Capture values and timestamps; do not infer exhaustion without confirmed limits and comparable history.
5. **Rollback:** use only an eligible, known-good production deployment after confirming blast radius and database compatibility. A Vercel rollback does not reverse SQL migrations or restore data.
6. **Incident record:** create docs/incidents/<incident-id>.md only for material incidents; use the template in PRODUCTION_SAFE_OPERATIONS.md.
7. **Cost guard:** no new vendor, paid plan, observability upgrade, external log drain, or always-on automation without an explicit cost/benefit decision from the owner.

These are **PROPOSED** operating steps, not automated monitoring or configured alerts.

## 6. F4 acceptance criteria

- [ ] Inventory current Vercel production deployment identity and actual plan/observability entitlements using direct account evidence.
- [ ] Establish a minimal repeatable Supabase health/log check with exact UTC windows, thresholds, and explicit clear / finding / unable to assess outcomes.
- [ ] Establish a minimal Vercel production log/deployment check compatible with actual plan retention and usage limits.
- [ ] Define severity, detection, triage, containment, owner decision, recovery, verification, and incident closure steps.
- [ ] Verify rollback eligibility and document the application-vs-database recovery boundary without executing a rollback.
- [ ] Define privacy-safe evidence retention and avoid PII/secrets in logs and incident records.
- [ ] Update continuity docs and verify the final documentation diff.
- [ ] No paid dependency, production mutation, deployment, or backup/restore action is introduced without separate explicit approval.

## 7. Current UNKNOWN / BLOCKED

- Vercel team plan, production log retention, current usage/quota, alert entitlements, and eligible rollback target were not inspected.
- Supabase event counts alone do not classify errors; status/level field mapping and useful alert thresholds need an evidence-backed focused check.
- No persistent monitoring schedule or alert destination is configured or verified by this task.
- No browser, customer-journey, or real-device health check was run.
- No active production incident is established by this snapshot.

## 8. Sources

- Vercel Observability: https://vercel.com/docs/observability
- Vercel runtime logs: https://vercel.com/docs/logs/runtime
- Vercel alerts: https://vercel.com/docs/alerts
- Vercel production rollback: https://vercel.com/docs/deployments/rollback-production-deployment
- Supabase Observability: https://supabase.com/docs/guides/observability
- Supabase Reports: https://supabase.com/docs/guides/observability/reports
- Supabase detection checks: https://supabase.com/docs/guides/observability/detecting

## 9. Exact next task

Complete F4.1: inspect Vercel account/project deployment and usage evidence read-only, then design and document the smallest repeatable free-tier health/error check. Do not deploy, change settings, add paid services, or start scheduled automation.
