# F4 — Release, Monitoring & Incident Operations

**Date:** 2026-11-02  
**Status:** IN_PROGRESS — F4.1 and F4.2 COMPLETE WITH EXPLICIT LIMITATIONS; F4.3 is next  
**Repository base:** main `848d4acdd3b184c24142d1e77fc0c9af55f20eab`  
**Scope:** read-only platform inspection and operational documentation. No application code, database schema, platform settings, secrets, deployments, alerts, or customer data were changed.

## 1. Phase boundary

F4 establishes an affordable, repeatable way to detect service degradation, identify the affected release/dependency, contain incidents, recover safely, and record evidence. It uses existing/free capabilities first and avoids paid upgrades or unnecessary CI/deployment activity.

F3 remains **DEFERRED BY OWNER — NOT DONE**. F4 does not waive F3. F3 must be completed before the first real customer, real customer-owned data, or commercial launch, whichever occurs first. No backup, restore, PITR, or paid recovery action is included here.

## 2. Repository baseline — VERIFIED

- `docs/operations/PRODUCTION_SAFE_OPERATIONS.md` already defines environment separation, release checklist, application rollback vs database recovery, monitoring signal classes, incident record fields, and risk classes.
- `docs/release-only-vercel-workflow.md` is the canonical release policy. Do not duplicate or weaken it.
- F2 separates application build from explicit database migration execution. F4 preserves that boundary.
- Historical runtime observations in the operations runbook are not current incidents; do not relabel them without fresh evidence.

## 3. Connected platform snapshot — VERIFIED, read-only, 2026-11-02

### Supabase

- Project ref: `ublxptcqefujkbeepylc`.
- Region: `ap-northeast-2`.
- Project status: `ACTIVE_HEALTHY`.
- PostgreSQL: `17.11`.
- Connected organization plan: **Free**.
- The platform status is not proof that every application route or customer journey is healthy.

A read-only aggregation over the inspected last-24-hour window returned:

| Source | Events | Latest event (UTC) |
|---|---:|---|
| edge_logs | 6 | 2026-11-02 03:41:30 |
| postgres_logs | 30 | 2026-11-02 01:41:46 |
| postgrest_logs | 7 | 2026-11-02 00:01:12 |
| storage_logs | 4 | 2026-11-02 03:41:30 |

These are activity counts only. They do not establish success/error rates. The focused result did not return `auth_logs` or `function_edge_logs`; that is not proof of no activity or health.

### Supabase advisor disposition

- The owner explicitly directed that the **Leaked Password Protection Disabled** advisor warning be permanently excluded from active F4/F6 work because the feature is unavailable on the current Free plan and no paid upgrade is authorized. **Disposition: OWNER-ACCEPTED PLAN LIMITATION — CLOSED / DO NOT REOPEN** unless the owner changes the plan/decision. Do not repeatedly surface it as an open task or blocker. This disposition does not claim the feature is enabled.
- The advisor's 40 informational `rls_enabled_no_policy` findings remain contextual review items; do not add policies or disable RLS based on the lint label alone.
- Performance advisor findings (19 unindexed-FK, 13 multiple-permissive-policy warnings, and unused-index notices) remain review candidates, not authorization for schema/index changes.

## 4. Vercel account, deployment and observability — VERIFIED

### Account and project

- Team: `midosd2s-projects` (`team_4qTUNnhDhAW00uQId6JvETf4`).
- Team plan: **Hobby (Free)**, verified through connected Vercel team/deployment context.
- Project: `menu-v3` (`prj_ydfrFBE7ZJVmuNnCOTv3WjWkhuH1`), linked to `Midosd249/Menu_V3`.
- Official Hobby documentation lists **one hour** of runtime-log retention. This is the plan-level documented limit, not a claim that older logs can be retrieved.

### Current Production identity

- Deployment: `dpl_6RFG7Ycb4XLxnWTwwYhmGQUhmas3`.
- State/target: `READY` / `production`.
- Git ref/SHA: `main` / `848d4acdd3b184c24142d1e77fc0c9af55f20eab`.
- Production aliases include `www.menuun.com` and `menuun.com`.
- The deployment SHA matches the verified main SHA recorded for PR #415 closeout.

### Runtime observation

- Vercel grouped runtime-error query: no runtime error clusters returned for the selected last-24-hour window.
- Vercel production runtime-log query: no `error`, `fatal`, or `warning` records returned in the selected 50-minute window (`2026-11-02T15:07:54Z` to `2026-11-02T15:57:54Z`).
- These are bounded query results, not proof of zero user-facing defects, successful journeys, or complete observability.

### Rollback candidate

- A previous Production deployment was directly inspected: `dpl_9zAvoGqWWNcQAAHdX8shg9TwcbYn`, state `READY`, commit `e5d7c89a73718f35e7accbae7933af36c366bbc1`.
- Vercel marked it as a rollback candidate in the Production deployment list. No rollback was executed.
- Before any real rollback, re-check candidate eligibility, intended target, current incident, and database/migration compatibility. A Vercel rollback does not reverse SQL migrations or restore data.

### Plan and quota limits

- Hobby is confirmed. The official Vercel plan documentation describes its included resource limits and pause behavior when limits are exceeded.
- Exact current consumed/remaining quota for this team/project was **not available through the connected read-only actions used in this task**. Do not infer remaining quota from plan tier or deployment count. Inspect the Vercel Usage dashboard manually before any release/deployment decision, as required by `AGENTS.md`.
- No paid Alerts/Observability Plus or persistent alert destination is configured or verified. Do not rely on paid alerting.

## 5. Minimal free-tier operational check — PROPOSED, repeatable

Run manually when reviewing operations and immediately after an authorized release. Record UTC observation time, exact windows, project/team identifiers, deployment ID/SHA, and the outcome. Do not retain tokens, request bodies, full query-string URLs, or customer PII.

| Check | Clear | Finding | Unable to assess |
|---|---|---|---|
| Supabase project status | API reports `ACTIVE_HEALTHY` | Any explicit non-healthy/paused/error state | API unavailable, stale, or ambiguous |
| Supabase logs | Sources queried and no explicit error signal found using a validated severity filter | Explicit database/API/storage/auth error signal with timestamp and source | Only aggregate activity counts are available, severity mapping is unverified, or query failed |
| Vercel Production identity | Latest Production deployment is `READY` and its Git SHA matches intended `main` release SHA | Deployment failed/blocked or SHA/alias differs unexpectedly | Deployment metadata unavailable or intended release SHA not established |
| Vercel runtime errors | No error clusters returned in the selected window | One or more error clusters returned; inspect recurrence, route, deployment, and impact | Query unavailable, outside retention, or time window unclear |
| Vercel runtime logs | No warning/error/fatal records returned in the selected window | Relevant warning/error/fatal records returned and correlated | No logs returned but source/time/retention filters are uncertain |

**Threshold discipline:** do not turn event counts into failure rates. Do not classify a zero-row log query as healthy if the query's source, severity mapping, or retention window is unknown. For every row, report exactly one of CLEAR / FINDING / UNABLE TO ASSESS.

### Snapshot result for this inspection

- Supabase project status: **CLEAR** at inspection time (`ACTIVE_HEALTHY`).
- Supabase log severity/error classification: **UNABLE TO ASSESS** from the preserved aggregate counts alone.
- Vercel Production identity: **CLEAR** — READY and SHA matched `main`.
- Vercel grouped runtime errors: **CLEAR for the queried 24-hour window** — no clusters returned.
- Vercel warning/error/fatal logs: **CLEAR for the queried 50-minute window** — no records returned.
- Remaining Vercel quota: **UNABLE TO ASSESS** — exact Usage dashboard values were not returned by connected tools.

## 6. Incident handling — existing runbook retained

Use `docs/operations/PRODUCTION_SAFE_OPERATIONS.md` as the canonical incident and release procedure. Minimum sequence:

1. **Detect and classify:** record UTC time, affected service/route, severity, first/last seen, and evidence source. Avoid PII and secrets.
2. **Scope impact:** correlate the deployment ID/SHA, route, Supabase source, recurrence, and customer-visible symptoms. Distinguish expected authorization denials from actual access-control defects.
3. **Contain:** stop risky release/migration retries; do not mutate production data as an exploratory step.
4. **Owner decision:** choose rollback only when the target is currently eligible and database compatibility is verified; otherwise prefer a safe forward fix or explicitly mark blocked.
5. **Recover and verify:** verify the same failing signal and critical path after containment. Deployment READY alone is not application-health proof.
6. **Close:** create an incident record under `docs/incidents/` for material incidents, capture root cause/prevention, and update continuity.

Severity and escalation thresholds that require application-specific baselines remain part of F4.2; do not invent numeric thresholds from the current sparse log sample.

## 7. F4.1 completion and acceptance

- [x] Direct Vercel team plan and project identity inspected.
- [x] Current Production deployment ID/state/SHA/aliases verified.
- [x] Previous Production rollback candidate identified and inspected without executing rollback.
- [x] Vercel runtime-error and filtered runtime-log windows inspected.
- [x] Free-tier observability constraints researched against official documentation.
- [x] Repeatable free-tier check and CLEAR / FINDING / UNABLE TO ASSESS outcomes documented.
- [x] Owner's Leaked Password Protection disposition recorded as closed and excluded from active work.
- [x] No paid dependency, production mutation, deployment, backup, restore, or PITR action introduced.

**F4.1 STATUS: COMPLETE WITH EXPLICIT LIMITATIONS.** Exact remaining Vercel quota is unavailable through the connected read-only actions and remains UNKNOWN; this does not block the read-only operational baseline. Usage must be inspected manually before any deployment decision.

## 8. Current UNKNOWN / NOT CLAIMED

- Exact consumed/remaining Vercel resource quota.
- Supabase log severity mapping and error-rate classification from the aggregate query.
- Persistent monitoring schedule or alert destination; none is configured/verified.
- Real browser, customer-journey, or real-device health. No such check was run in F4.1.
- No active Production incident is established by this snapshot.

## 9. Official sources

- Supabase password security / plan availability: https://supabase.com/docs/guides/auth/password-security
- Supabase pricing and feature matrix: https://supabase.com/pricing
- Supabase Observability and Logs Explorer: https://supabase.com/docs/guides/observability
- Supabase Reports: https://supabase.com/docs/guides/observability/reports
- Supabase detection checks: https://supabase.com/docs/guides/observability/detecting
- Vercel Hobby plan and limits: https://vercel.com/docs/plans/hobby
- Vercel account plans: https://vercel.com/docs/plans
- Vercel Observability: https://vercel.com/docs/observability
- Vercel runtime logs: https://vercel.com/docs/logs/runtime
- Vercel alerts: https://vercel.com/docs/alerts
- Vercel production rollback: https://vercel.com/docs/deployments/rollback-production-deployment

## 10. Exact next task

**F4.2 — Validate Supabase log severity/error classification and define evidence-backed incident thresholds.** Keep this read-only; use actual log fields and existing plan limits, preserve the owner's closed warning disposition, and do not add paid services, scheduled automation, deployments, settings changes, or database mutations.


---

# F4.2 — Supabase Log Severity & Incident Threshold Validation

**Observed at:** 2026-11-02T20:11:00Z (UTC)  
**Project:** `ublxptcqefujkbeepylc` — Supabase Free, region `ap-northeast-2`  
**Method:** Connected Supabase unified Logs / ClickHouse; read-only queries only; default maximum observation window 24 hours.  
**Status:** COMPLETE WITH EXPLICIT SOURCE LIMITATIONS.

## 1. Verified log inventory

The live `SELECT source, count(), max(timestamp) ... GROUP BY source` query returned:

| Source | Events | Latest timestamp (UTC) |
|---|---:|---|
| `edge_logs` | 6 | 2026-11-02 03:41:30 |
| `pgbouncer_logs` | 82 | 2026-11-02 19:41:59 |
| `postgres_logs` | 30 | 2026-11-02 01:41:46 |
| `postgrest_logs` | 7 | 2026-11-02 00:01:12 |
| `realtime_logs` | 2 | 2026-11-02 03:41:30 |
| `storage_logs` | 4 | 2026-11-02 03:41:30 |
| `supavisor_logs` | 78 | 2026-11-02 01:58:27 |
| `workflow_run_logs` | 20 | 2026-11-02 03:41:33 |

Counts are activity, not request volume, success rate, or uptime. The source timestamps are not uniformly fresh; do not infer that an old latest event means the source is broken.

## 2. Verified source-specific fields

A read-only inventory of `mapKeys(log_attributes)` and grouped field values established:

| Source | Observed classification field | What can be classified | Limitation |
|---|---|---|---|
| `postgres_logs` | `parsed.error_severity`, `parsed.sql_state_code`, `parsed.command_tag` | PostgreSQL severity and SQLSTATE | Reliable for rows where these parsed fields are populated; do not generalize to other sources. |
| `edge_logs` | `response.status_code` | HTTP response status | No normalized severity field was present in sampled rows. |
| `storage_logs` | `level` | Service level | Four observed rows had `info`; sample is small. |
| `realtime_logs` | `level` | Service level | Two observed rows had `info`; sample is small. |
| `supavisor_logs` | no normalized severity key in sampled rows | Inspect event text and context manually | Do not treat missing level as INFO or CLEAR. |
| `pgbouncer_logs` | no normalized severity key in sampled rows | Inspect event text and context manually | Routine TLS/new-connection/server-lifetime messages appeared; not a complete health proof. |
| `postgrest_logs` | no normalized severity key in sampled rows | Source/message-specific investigation | No severity field was identified in the sample. |
| `workflow_run_logs` | no normalized severity key in sampled rows | Source/message-specific investigation | No severity field was identified in the sample. |

Supabase Logs Explorer documents source-specific log tables and filtering by Level (success/warning/error), Status (HTTP status or PostgreSQL SQLSTATE), and Log Type. The unified Logs API query exposed the concrete keys above for this project. The UI's generic filter labels must not be assumed to map to one universal `log_attributes['level']` field across every source.

## 3. Verified error observation

The PostgreSQL severity query found:

- 29 rows with `parsed.error_severity = LOG`.
- 1 row with `parsed.error_severity = ERROR`.
- No `FATAL` or `PANIC` row in the inspected result.
- The single ERROR was at `2026-11-01T23:20:38.823Z`, SQLSTATE `42803`, command tag `SELECT`.
- Its message excerpt: `column "c.oid" must appear in the GROUP BY clause or be used in an aggregate function`.

**Disposition: FINDING — isolated SQL query error; production application impact UNKNOWN.** SQLSTATE 42803 indicates a grouping error in a SELECT. The available log evidence does not establish whether this came from an operator/diagnostic query or an application path. No matching application request or customer impact was established. Do not call this a confirmed customer-facing incident, and do not silently discard it. If repeated or correlated with an application route, investigate the query origin and fingerprint.

Edge rows observed in the sample all had HTTP status `200`. Storage and Realtime rows sampled had `level=info`. These observations do not establish full-stack health or cover all time periods.

## 4. Evidence-backed classification rules

Use source-native fields, not guessed universal severity:

1. PostgreSQL: classify using `parsed.error_severity`; capture `parsed.sql_state_code`, timestamp, command tag, and a privacy-safe message fingerprint. Treat `ERROR`, `FATAL`, and `PANIC` as findings requiring triage; `FATAL`/`PANIC` are immediate high-priority escalation candidates.
2. Edge: classify `response.status_code`; 5xx is a server-side finding. 4xx is not automatically an incident: distinguish expected authentication/authorization, validation, rate-limit, and unavailable-resource outcomes from unexpected defects.
3. Storage/Realtime: use their observed `level` field when present. Missing level means `UNABLE TO ASSESS`, not healthy.
4. PgBouncer/Supavisor/PostgREST/workflow logs: no common severity field was verified in this sample. Use source-specific message review and correlation; absent severity is not a clear result.
5. Empty query results: only `CLEAR` when source coverage, time range, retention, and the relevant source-native classification field are all verified. Otherwise return `UNABLE TO ASSESS`.

## 5. Proposed incident thresholds — NOT historical guarantees

These are operational proposals for a low-volume, owner-operated test environment; no SLA or automated alert is claimed:

| Signal | Triage | Incident escalation |
|---|---|---|
| PostgreSQL `PANIC` or `FATAL` | Immediate | P1 candidate immediately; verify recurrence/service impact. |
| Unexpected PostgreSQL `ERROR` | Investigate every occurrence and SQLSTATE/fingerprint | P2 candidate if repeated (3+ same fingerprint within 5 minutes), affects a critical application path, or blocks data operations. |
| HTTP 5xx from Edge/API | Investigate each occurrence and correlate route/deployment | P2 candidate for 3+ same-route 5xx within 5 minutes, or one confirmed critical-path outage. |
| Storage/Realtime explicit error level | Investigate every occurrence | Escalate when repeated or a required public-menu/media/order capability is impaired. |
| PgBouncer/Supavisor/PostgREST/workflow message without normalized severity | Manual source-specific triage | Escalate only after confirming connection/API/function impact; do not infer severity from a keyword alone. |
| No events / missing logs | Check source, time window and retention | `UNABLE TO ASSESS` unless independent health evidence exists. |

These thresholds are proposed, not calibrated from a statistically representative baseline. The project currently has owner-created test data and low/uneven event volume; do not calculate error percentages from these samples.

## 6. Free-plan constraints and operating cadence

- Supabase Free documentation currently lists 1 day of API/database log retention and 1 GB included log ingestion. Confirm actual usage in the dashboard; do not infer remaining quota from this limit.
- Log query usage has a separate included allowance and is not billed by query volume according to the official usage guide; query overuse may cause rate limiting/shorter retention when enforcement applies.
- Supabase Log Drains are Pro/Team/Enterprise only; do not design the Free-tier process around Log Drains.
- Use the connected Logs Explorer manually during an investigation and immediately after an authorized release. Do not add scheduled polling, paid destinations, or persistent alert infrastructure in this phase.
- Vercel Hobby runtime logs have a documented 1-hour retention window. Correlate Vercel deployment ID/SHA and request evidence while still within retention.

## 7. Current snapshot outcome

| Area | Result |
|---|---|
| Supabase project status | Previously verified `ACTIVE_HEALTHY`; platform status alone is not app health. |
| PostgreSQL severity mapping | **VERIFIED** for `parsed.error_severity` and SQLSTATE in sampled rows. One isolated ERROR found; impact UNKNOWN. |
| Edge HTTP status | **VERIFIED** for `response.status_code`; six sampled responses were 200. |
| Storage/Realtime level | **VERIFIED** for `level`; sampled events were INFO. |
| PgBouncer/Supavisor/PostgREST/workflow severity | **UNABLE TO ASSESS** from a common normalized field; source-specific manual review required. |
| Overall application health | **UNABLE TO ASSESS** from logs alone; owner reports a separate successful application check, recorded separately from platform evidence. |

## 8. Safety and non-actions

No SQL writes, schema/RLS/index changes, migrations, advisor changes, secret access, backup/restore, PITR, billing changes, alert configuration, deployment, rollback, or CI rerun was performed for F4.2.

## 9. Official references

- Supabase Logs in Studio: https://supabase.com/docs/guides/observability/logs
- Supabase Logs Explorer: https://supabase.com/docs/guides/telemetry/logs
- Supabase Manage Logs Usage: https://supabase.com/docs/guides/platform/manage-your-usage/logs
- Supabase Log Drains: https://supabase.com/docs/guides/observability/log-drains
- Vercel Runtime Logs: https://vercel.com/docs/logs/runtime


## 11. Exact next task

**F4.3 — Incident response runbook validation and owner-operated rehearsal (non-destructive).** Reconcile the existing runbook with the verified source-specific signals and proposed thresholds; rehearse classification and rollback decision-making using a simulated incident only. Do not trigger production faults, rollback, deployment, or database mutation.
