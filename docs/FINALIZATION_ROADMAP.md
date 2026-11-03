# F-Series Architecture, Operations & Continuity Roadmap

## Current verified checkpoint — 2026-11-03

- **LAST VERIFIED MERGE CHECKPOINT:** PR #420 merge commit `216810951925b338e63da0b3415a9ba15f022551`. The GitHub connector confirmed the merge commit and branch existence; it did not expose a direct current `main` ref SHA during this session.
- **F5.1:** COMPLETE; PR #418 merged.
- **F5.2:** COMPLETE WITH EXPLICIT LIMITATIONS; PR #419 merged at `76e6e13dba919211885270bca4e09bbfa5b7bfc1`. SOP: `docs/operations/F5_OWNER_LED_CUSTOMER_ONBOARDING_SOP.md`.
- **F5.2 EXACT-HEAD CI:** Quality `41564124218` SUCCESS and W9 Orders QA `41564124226` SUCCESS on exact PR head `710cc3aad35a745ce0545617fc507c64b7cb13db`.
- **F5.3:** DEFERRED BY OWNER — OPEN RISK. Potential cross-tenant side-effect path in `saveBranch` remains unremediated and runtime exploitability unverified; this is not accepted as safe or closed.
- **F5.4:** documentation-only SOP implementation in progress on `docs/f5-4-platform-subscription-operations-2026-11-03`; deliverable `docs/operations/F5_PLATFORM_SUBSCRIPTION_AND_INVOICE_OPERATIONS_SOP.md`.
- **F4:** F4.1/F4.2/F4.3 complete with explicit limitations; PR #417 merged. No F4.4 work package is defined.
- **F3:** DEFERRED BY OWNER — NOT DONE; mandatory before first real customer/customer-owned data/commercial launch.
- **SAFETY:** F5.4 documentation only; no customer data, application/database mutation, migration, settings/secrets change, subscription/account/invoice operation, billing collection, deployment, or rollback.
- **DEPLOYMENT:** UNKNOWN unless directly verified through Vercel.
- **EXACT NEXT ACTION:** review the F5.4 documentation diff and verify Quality/W9 on the exact final PR head; do not merge or deploy without owner decision.

**Phase ID convention:** `F` means **Finalization**; `F0` is the program charter and baseline, and `F1`–`F7` are the ordered finalization phases. These IDs are permanent and are not product release versions.  
**Document ID:** F0  
**Status:** ACTIVE — F5 commercial customer operations  
**Product:** Menuun / Menu V3  
**Repository:** `Midosd249/Menu_V3`  
**Canonical branch:** `main`  
**Language:** Arabic-first product; repository engineering documentation is maintained in English.  
**Last repository verification for this baseline:** 2026-11-03  
**Verified main SHA at F4.3 start (2026-11-02):** `41e5c36e434051f9668887974739870354706bd6`

> This roadmap is the durable execution contract for the F-Series. It is not evidence that every phase is complete. A phase becomes complete only when its acceptance criteria, evidence, continuity updates, and review are recorded.

---

## 1. Mission and outcome

Establish a maintainable, evidence-backed engineering and operational foundation that allows the sole human owner/developer to continue Menuun from any new chat or development session without relying on conversational memory, while protecting live restaurants and their data during ongoing development and releases.

The target operating model must make it possible to:

1. Understand the current system architecture and the location of its critical responsibilities.
2. Trace important architectural decisions, product milestones, incidents, and releases to repository evidence.
3. Add or change features without unknowingly duplicating existing capabilities or violating established boundaries.
4. Develop and verify changes away from production.
5. deploy one intentional, coherent release batch after appropriate gates.
6. Apply database changes deliberately, with forward/backward compatibility and a separately controlled migration step.
7. Recover from application, deployment, or database incidents using documented and tested procedures.
8. Distinguish implementation, CI, deployment, runtime, and customer-side evidence.
9. Resume work from any new conversation using the repository as the source of truth.

**Non-goal:** This program is not a general rewrite, redesign, feature expansion, broad cleanup, or automatic reopening of previously completed audits. Existing working systems must be preserved unless new evidence demonstrates a defect.

## 2. Authority and evidence rules

### 2.1 Source-of-truth hierarchy

Use this order when facts conflict:

1. Current source code, configuration, migrations, and runtime behavior.
2. Current Git history, branch/PR state, CI runs, and deployment evidence.
3. Current repository documentation and recorded decisions.
4. Authoritative platform/framework documentation.
5. Chat history and remembered context.

Repository documentation is durable context, not permission to ignore contradictory code or runtime evidence. Reconcile stale documents when discovered.

### 2.2 Evidence labels

Every material statement in architecture, operations, audit, and continuity documents must use one of these labels:

- **VERIFIED** — directly supported by current code/configuration, Git, a successful test/run, a live read-only query, or authoritative platform evidence. Include the exact file/path, SHA, run ID, query scope, or source where useful.
- **INFERRED** — a reasoned conclusion from verified facts, not directly proven. State the basis and confidence.
- **PROPOSED** — a recommended future design or control that has not been implemented or approved.
- **UNKNOWN** — evidence is insufficient or was not collected.
- **BLOCKED** — verification or implementation cannot proceed because of a named dependency, permission, environment, decision, or platform constraint.

Do not convert UNKNOWN into VERIFIED through repetition. Do not call a configured backup a tested recovery path until a restore has actually succeeded.

### 2.3 Status separation

Keep these statuses distinct:

- `IMPLEMENTATION_IN_PROGRESS`
- `VERIFIED_LOCALLY`
- `READY_TO_PUSH`
- `PUSHED`
- `DEPLOYED`
- `DEPLOYMENT_BLOCKED`
- `IMPLEMENTATION_BLOCKED`
- `DONE`

CI success does not prove production deployment. Preview READY does not prove production deployment. HTTP 200 does not prove full customer-flow correctness. A merged commit does not prove that production serves it.

## 3. Permanent invariants — never weaken these to make work easier

### Product and customer invariants
- Menuun remains Arabic-first, bilingual, mobile-first, and multi-tenant.
- The public restaurant menu remains the primary customer-facing experience.
- Existing themes, ordering, subscriptions, onboarding, team, analytics, SEO, and menu-intelligence capabilities are preserved.
- Do not invent a restaurant capability or expose a customer action unless the capability and its configuration are verified.
- Existing customers must not be exposed to partially migrated schema, incompatible application versions, or experimental behavior.

### Security and data invariants
- Authentication and authorization remain server-side.
- Never trust client-provided user identity, tenant, branch, role, privilege, entitlement, price, or table identity.
- Tenant and branch isolation must be enforced by trusted server/database boundaries.
- Preserve RLS, grants, database constraints, validation, auditability, privacy, and secret boundaries.
- Fail closed when trusted context is missing or ambiguous.
- Never use production customer data as an uncontrolled development fixture.
- Never run a destructive migration, rollback, data rewrite, or restore against production without an explicit, evidence-backed procedure and owner authorization.

### Engineering and release invariants
- One atomic task per execution session by default.
- Smallest safe change; no unrelated rewrites or speculative abstractions.
- `main` remains stable and deployable.
- Local development and QA are the default; Vercel is a release platform, not a routine visual iteration tool.
- One intentional production deployment per coherent release batch where possible.
- Do not rerun failed CI or deployment jobs without inspecting the exact SHA, failed step, logs, and changed condition/hypothesis.
- Never expose credentials, environment values, access tokens, or private customer information in documentation.

## 4. F-Series phase map

The F identifiers are permanent phase IDs. They are not sprint numbers, release versions, or proof of completion.

| Phase | Name | Primary outcome | Depends on | Current status (verified 2026-11-03) |
|---|---|---|---|---|
| **F0** | Continuity & Program Charter | One authoritative roadmap, phase rules, evidence model, and cross-chat handoff | Current Git/repository evidence | DONE |
| **F1** | Verified Architecture Baseline | Accurate C4-style system/container/component views, data flows, integrations, trust boundaries, and code map | F0 | DONE — merged in PR #415 |
| **F2** | Production-Safe Build & Migration Boundary | Remove unintended database migration side effects from ordinary builds; define explicit migration execution and compatibility controls | F1; migration runner understanding | DONE — merged in PR #415 |
| **F3** | Backup, Restore & Disaster Recovery | Inventory backup coverage and prove a safe isolated restore procedure | F1, F2, provider capabilities | DEFERRED BY OWNER — NOT DONE; mandatory pre-commercial gate |
| **F4** | Release, Monitoring & Incident Operations | One release checklist, rollback/forward-fix rules, monitoring signals, incident records, and post-release observation | F1, F2; F3 remains a pre-commercial gate | DONE WITH EXPLICIT LIMITATIONS — F4.1/F4.2/F4.3 complete; PR #417 merged |
| **F5** | Commercial Customer Operations | Repeatable owner-led restaurant onboarding, account setup, support, and customer-safe change communication | F1, F4; product capabilities verified | IN_PROGRESS — F5.1/F5.2 complete; F5.3 deferred by owner as an open risk; F5.4 in progress |
| **F6** | Security, Isolation & Reliability Assurance | Evidence-backed assurance of auth, tenant/branch boundaries, secrets, data access, and operational resilience | F1–F4 | PLANNED; risk-based, not a blanket re-audit |
| **F7** | Architecture Evolution & Governance | ADR lifecycle, technical debt decisions, architecture drift checks, and recurring continuity maintenance | F1–F6 | PLANNED |

### Phase completion rule

A phase can be marked `DONE` only when all of the following are true:

1. Its scope and acceptance criteria are satisfied.
2. Its claims are supported by evidence and correctly labeled.
3. All relevant code/configuration changes have been reviewed, if any.
4. Applicable verification has run; unavailable checks are recorded with reason and residual risk.
5. The final diff is reviewed.
6. Relevant continuity, architecture, decision, and history documents are updated.
7. No unresolved UNKNOWN/BLOCKED item is hidden.
8. Exactly one next phase/task is named.
9. No unrelated next task is started automatically.

## 5. F0 — Continuity & Program Charter

### Objective
Make the F-Series self-describing and resumable independently of ChatGPT memory.

### Deliverables
- `docs/FINALIZATION_ROADMAP.md` — this phase map, scope, sequence, acceptance criteria, and operating rules.
- `docs/architecture/README.md` — architecture documentation index and evidence policy.
- `docs/architecture/SYSTEM_OVERVIEW.md` — verified high-level system boundary and current architecture facts/unknowns.
- `docs/operations/PRODUCTION_SAFE_OPERATIONS.md` — release, migration, rollback, incident, and recovery operating contract.
- `docs/history/DEVELOPMENT_HISTORY.md` — evidence-backed milestone history and rules for future entries.
- `docs/decisions/ADR-0001-custom-migration-ledger.md` — record the repository's existing migration-ledger decision without changing it.
- Update `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, and the README documentation index.

### Acceptance criteria
- F0 phase IDs and their meanings are unambiguous.
- The roadmap explains all phases, dependencies, gates, and stop conditions.
- Current facts are distinguished from inferred/proposed architecture.
- The stale QR-ordering continuation state is reconciled against the merged PR and current main.
- No runtime, database, CI, or deployment behavior changes are included in F0.

## 6. F1 — Verified Architecture Baseline

### Objective
Describe what exists today, not what a generic SaaS architecture ought to contain.

### F5.1 result — COMPLETE WITH EXPLICIT LIMITATIONS

The current discovery/contact → signup → self-serve workspace → brand/branch → menu → preview → publish → QR → staff access → support/billing journey is documented in `docs/operations/F5_SALES_TO_ACTIVATION_JOURNEY.md`. The map is based on current repository code/migrations, not on real customer interviews or observed production conversions. No CRM, online payment, support ticketing, automated handoff, or dedicated demo workflow is claimed. The legacy manual-approval lifecycle document is marked historical/superseded.

### Work packages

**F1.1 System context**
- Identify Menuun, restaurant owners/staff, restaurant customers, platform owner/admin, and external systems.
- Identify external systems only where code/configuration proves an integration.
- Document system responsibilities and explicit out-of-scope systems.

**F1.2 Container/runtime view**
- Verify frontend/server runtime, routing, build tooling, hosting, database connectivity, authentication provider, and background/edge execution if any.
- Record runtime entry points, deployment artifacts, regions, and environment boundaries from code/platform evidence.
- Do not infer microservices, queues, caches, or services from package names alone.

**F1.3 Component/code map**
- Map routes, domain modules, server functions, shared libraries, UI workspaces, and tests to their responsibilities.
- Identify public menu, Studio, Owner, Admin, onboarding, subscription, order, team, analytics, SEO, and intelligence boundaries only after source inspection.
- Include file paths and important ownership boundaries.

**F1.4 Data architecture**
- Inventory schemas, tables, views, functions, triggers, constraints, indexes, RLS, grants, and migration files.
- Map tenant, branch, user, membership, restaurant, product, order, and subscription relationships from actual DDL and code.
- Record data ownership, retention/deletion semantics, audit trails, and sensitive data classes where verifiable.
- Explicitly document both migration-history systems and their roles.

**F1.5 Auth and trust boundaries**
- Trace identity establishment, session validation, permission checks, tenant/branch resolution, and server-side data access.
- Map authorization to routes and mutations.
- Record trust boundaries and fail-closed behavior.
- Never publish secrets or sensitive implementation values.

**F1.6 Integration map**
- List only verified integrations, their direction, purpose, auth mechanism category, data exchanged, failure mode, and operational owner.
- Environment variable names may be documented when safe and verified; never record values.
- Mark unused, dormant, or uncertain integrations UNKNOWN rather than assuming they are active.

**F1.7 Deployment/data-flow diagrams**
- Create C4-style context, container, component, deployment, and selected dynamic/data-flow diagrams as evidence allows.
- Use Mermaid or another repository-supported text format. Keep diagrams version-controlled and reviewable.
- Diagrams must not claim details that have not been inspected.

### F1 acceptance criteria
- A new developer can locate the entry points and critical boundaries without guessing.
- Every diagram has a source/date/evidence note.
- Security, tenant/branch, database, and deployment boundaries are explicit.
- All important unknowns are listed with the evidence needed to resolve them.
- Architecture documentation matches current code and tests.

## 7. F2 — Production-Safe Build & Migration Boundary (DONE)

### Objective
Ensure ordinary application builds do not silently mutate a live database, and ensure database changes are explicit, reviewed, and compatible with active application versions.

### Baseline fact
**HISTORICAL F1 BASELINE, superseded by F2:** `package.json` originally coupled `build` to `npm run db:migrate`; repository history records a prior Preview migration side effect. PR #415 removed build-time migration execution. The current explicit migration boundary is defined by the merged F2 implementation and `docs/operations/MIGRATION_RUNBOOK.md`.

**VERIFIED COMPLETE — PR #415:** build/migration separation, explicit target identity guard, Vercel-context rejection, production confirmation, non-blocking advisory-lock serialization, opt-in Vercel Git deployment configuration, regression tests, and operator runbook were merged. Exact feature-head Quality/W9 succeeded; Production is READY on the merge SHA. No production SQL migration was executed as part of F2.

### Work packages
- F2.1 Map every build/deploy path and identify where `build`, `db:migrate`, and database environment variables are invoked.
- F2.2 Define build as an artifact-generation operation with no database mutation.
- F2.3 Define a separately invoked migration operation with explicit target identity, environment guard, operator approval, logs, and failure behavior.
- F2.4 Confirm the actual custom migration runner, schema, ledger, ordering, transaction semantics, and locking/concurrency behavior.
- F2.5 Preserve the custom migration chain unless a separately researched and approved migration strategy supersedes it.
- F2.6 Ensure Preview/local builds cannot accidentally point at production credentials.
- F2.7 Add tests proving build scripts do not invoke production migrations and migration commands fail closed when target context is missing/ambiguous.
- F2.8 Define staging/test execution and a production approval gate compatible with current account plan and CI budget.
- F2.9 Add migration preflight: pending files, target project identity, current ledger, schema preconditions, backup/recovery point, expected lock/downtime, and rollback/forward-fix plan.
- F2.10 Record the exact applied migration names and target environment after execution.

### Migration compatibility rule
Use **Expand → Migrate/Backfill → Switch → Contract** for changes that must coexist with old and new application versions:

1. Expand with additive schema changes.
2. Deploy code that tolerates both old and new schema shapes.
3. Backfill in bounded, observable, restartable batches if needed.
4. Switch reads/writes to the new shape.
5. Observe production behavior.
6. Remove old schema only in a later release after compatibility is proven.

Never assume an application rollback reverses a database migration. Never edit an already-applied migration to repair production; create a corrective migration.

### F2 acceptance criteria
- Build is demonstrably side-effect-free with respect to database schema/data.
- Migration execution is explicit and target-safe.
- The canonical migration ledger is documented and protected.
- Tests cover command wiring and critical guard behavior.
- Preview and production database targets cannot be confused silently.
- The change is verified locally and through applicable CI before release.

## 8. F3 — Backup, Restore & Disaster Recovery (DEFERRED BY OWNER — NOT DONE)

### Objective
Know what can be recovered, from which point in time, by whom, and how long recovery takes.

### Work packages
- F3.1 Inventory Supabase plan, backup schedule, retention, PITR availability, project region, and owner access.
- F3.2 Inventory application-level exports/dumps, storage assets, configuration, secrets recovery process, and Git history.
- F3.3 Define recovery objectives: RPO (maximum acceptable data loss) and RTO (maximum acceptable recovery time). These values require owner approval; do not invent them.
- F3.4 Document backup creation, encryption, access, storage location, retention, and deletion policy without exposing credentials.
- F3.5 Restore into an isolated target first; never overwrite production as the initial validation.
- F3.6 Verify schema/migration parity, auth, tenant boundaries, representative restaurant/menu/order/subscription records, storage references, and application startup.
- F3.7 Record restore duration, missing data, manual steps, and the verified recovery point.
- F3.8 Schedule periodic restore drills at a frequency approved by the owner and supported by the plan/budget.

### F3 acceptance criteria
- Backup coverage and retention are evidenced, not assumed.
- At least one isolated restore succeeds and is documented before calling recovery tested.
- RPO/RTO are explicitly approved or remain UNKNOWN.
- Restore access is limited and secrets are handled safely.
- Recovery instructions can be followed without depending on chat history.

## 9. F4 — Release, Monitoring & Incident Operations

### Objective
Make releases predictable and detect customer impact quickly.

### Release lifecycle
`LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER/VISUAL QA → TESTS → CI QUALITY GATES → FINAL DIFF REVIEW → ONE RELEASE BATCH → MERGE TO MAIN → ONE PRODUCTION DEPLOYMENT → REAL-DEVICE/PRODUCTION QA → OBSERVATION → CONTINUITY CLOSEOUT`

### Required release record
- Release ID and scope.
- Main commit SHA and PR references.
- Relevant test/CI run IDs and exact tested SHA.
- Migration plan, pending migration names, target identity, and migration result (or explicit “none”).
- Backup/recovery-point reference when data risk requires it.
- Vercel deployment ID, state, URL, and deployed commit SHA.
- Production smoke/critical-flow checks and real-device result when performed.
- Monitoring window and observed errors.
- Rollback or forward-fix decision and exact target, if used.
- UNKNOWN/BLOCKED items.

### Monitoring signals
Define and verify availability of:
- Deployment/build failures.
- Runtime error groups and error rates.
- Authentication/authorization denials (distinguishing expected denials from defects).
- Public menu availability and latency.
- Order creation failures/duplicates and critical order lifecycle transitions.
- Database connectivity, latency, saturation, connection exhaustion, and migration failures.
- Subscription/entitlement enforcement failures.
- External integration timeouts.
- Resource/quota/build-rate limits.

Do not interpret a single authorization denial or one timeout as a confirmed customer defect without identity-safe correlation and recurrence/context analysis.

### Incident procedure
1. Detect and record time, affected deployment/commit, scope, and evidence.
2. Assess customer impact and data/security risk.
3. Contain safely; pause further rollout or destructive jobs.
4. Choose rollback, forward-fix, or data recovery based on the failure layer.
5. Preserve logs and relevant evidence without copying secrets/PII into Git.
6. Verify critical customer flows and data integrity after recovery.
7. Communicate factual status to affected customers when required.
8. Write a blameless incident record with root cause, contributing factors, impact, resolution, and prevention.
9. Update tests/runbooks/ADRs only where the incident reveals a durable lesson.

### Rollback distinction
- **Application rollback:** return to an eligible prior production deployment.
- **Database recovery:** a separate, much higher-risk operation.
- **Forward-fix:** often safer than reverting a migrated schema when the migration is additive and backward-compatible.
- Vercel rollback is not proof of database rollback and may not revert environment configuration.

### F4 acceptance criteria
- A release can be traced from PR to exact production deployment.
- The rollback/forward-fix decision tree is explicit.
- Runtime signals and expected-vs-unexpected error interpretation are documented.
- An incident can be recorded and handed off without hidden context.

## 10. F5 — Commercial Customer Operations

### Objective
Enable the owner to onboard and support real restaurants while minimizing operational disruption.

### Work packages
- F5.1 Document the actual sales-to-activation journey using existing product capabilities only.
- F5.2 Define owner-led discovery/demo, restaurant data collection, menu setup, preview/review, publish, QR handover, staff access, and support handoff.
- F5.3 Document tenant/branch creation and ownership verification.
- F5.4 Document plan assignment, trial expiry, manual plan/status changes, freeze/unfreeze, invoice issuance, and audit trail using verified current controls.
- F5.5 Define safe customer communication for planned maintenance and incidents.
- F5.6 Define support intake, severity, response ownership, and evidence capture.
- F5.7 Establish a launch checklist that validates only configured capabilities and does not promise unsupported payments, booking, integrations, or automation.

### F5.3 owner deferral and F5.4 execution note

F5.3 is currently **DEFERRED BY OWNER — OPEN RISK**, not complete. The potential `saveBranch` cross-tenant side-effect path remains unremediated and runtime exploitability is unverified. The owner has directed that work continue with the next independent F5 package; this is not security acceptance or proof of safety.

F5.4 — Platform Subscription, Account & Invoice Operations — is being documented from existing Platform Owner controls. It does not authorize live customer operations while F3 remains deferred, and it does not resolve F5.3.

### F5 acceptance criteria
- A restaurant can be onboarded using a repeatable documented process.
- No step requires sharing internal credentials or weakening tenant boundaries.
- Customer-facing promises map to verified product behavior.
- Subscription and account changes are auditable.

## 11. F6 — Security, Isolation & Reliability Assurance

This phase is evidence-driven and risk-based. It is not a mandate to re-audit every completed feature or remediate every provider advisor notice.

### Work packages
- F6.1 Reconfirm auth/session/authorization paths for critical operations.
- F6.2 Verify tenant and branch isolation using adversarial cross-tenant and cross-branch tests.
- F6.3 Review public endpoints, input validation, rate limiting, abuse controls, and data exposure.
- F6.4 Review RLS, grants, SECURITY DEFINER functions, search paths, triggers, and server-side database access as a coherent access model.
- F6.5 Review secrets and environment-variable boundaries.
- F6.6 Prioritize findings by demonstrated exploitability, exposure, impact, and remediation risk.
- F6.7 Record accepted risks and owner decisions.

### F6 acceptance criteria
- Critical boundaries have direct test/query/code evidence.
- No permission or RLS change is made solely to silence an advisor.
- All remediation preserves least privilege and fail-closed behavior.
- Unverified areas remain explicitly UNKNOWN.

## 12. F7 — Architecture Evolution & Governance

### Architecture Decision Records (ADRs)
Create an ADR when a decision materially affects system structure, security, data, integration contracts, dependencies, deployment, or operational behavior.

Each ADR contains:
- ID and title.
- Status: Proposed, Accepted, Superseded, or Rejected.
- Date and decision owner.
- Context/problem.
- Constraints and evidence.
- Decision.
- Alternatives considered.
- Consequences/trade-offs.
- Security/data/operational impact.
- Supersedes/superseded-by references.

Accepted ADRs are append-only historical decisions. Change direction by creating a new ADR that supersedes the old one; do not silently rewrite the old rationale.

### Architecture drift
At meaningful milestones, compare code/configuration with the architecture docs. Update docs when reality changes; do not change code merely to match stale diagrams.

### F7 acceptance criteria
- Important decisions have durable records.
- Superseded decisions remain discoverable.
- Architecture docs and current code do not materially drift without an explicit UNKNOWN note.
- Every completed task leaves one precise next action.

## 13. Execution order and dependency gates

1. Complete F0 documentation and reconcile continuity.
2. Perform F1 read-only architecture discovery. No code changes until the current architecture and gaps are evidenced.
3. Execute F2 as a separate code/configuration task only after the migration runner and all build/deploy entry points are mapped.
4. Execute F3 backup/restore inventory and isolated restore validation.
5. Complete F4 release/monitoring/incident playbooks using actual platform capabilities.
6. Execute F5 customer operations using only verified product behavior.
7. Run F6 targeted assurance based on real risk and new evidence.
8. Establish F7 ongoing governance.

Do not bundle F1–F7 into one oversized implementation PR. Each phase may contain multiple atomic tasks, each with its own acceptance criteria and closeout.

## 14. Required task protocol for every new chat/session

Before meaningful work:

1. Read `AGENTS.md`, this roadmap, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, and relevant architecture/operations/decision/history documents.
2. Verify default branch, current main SHA, recent commits, open relevant PRs, branch diffs, and CI/deployment evidence as needed.
3. Confirm the exact F-phase and atomic task currently authorized.
4. Check whether the capability/document already exists before adding or changing anything.
5. Run the Research & Connected-Tools preflight at the appropriate depth.
6. State classification, workflows, research level, scope, risks, acceptance criteria, and verification plan before edits.
7. Change only files required by the task.
8. Run relevant checks and report exact results.
9. Review the final diff and update continuity.
10. Stop. Do not start the next task automatically.

If the user asks to continue from another chat, retrieve current state from Git and repository documents; never reconstruct state from conversational recollection alone.

## 15. Definition of done for the overall F-Series

The F-Series is complete only when:
- F0–F7 have explicit completion records or consciously accepted, documented deferrals.
- Architecture documentation accurately reflects current code and platform configuration.
- Build and migration responsibilities are safely separated and verified.
- A database restore has been successfully tested in isolation.
- Release, rollback, monitoring, and incident procedures are actionable and evidence-backed.
- Customer onboarding/support procedures reflect actual product capabilities.
- Security and tenant-isolation assurance is evidence-based.
- ADRs and development history preserve decisions and lessons.
- The repository alone is sufficient to resume work without chat memory.

## 16. Baseline known facts and open questions

### VERIFIED at baseline
- Repository: `Midosd249/Menu_V3`; default branch: `main`.
- Main SHA: `5a84d31282383e191472bcd3fc7d5b62417e90ca`.
- Latest inspected commit repairs Essential language-selector state rules.
- QR table-ordering PR #411 is merged; merge commit `f6e888ded688ba682b3c5862719b76adb96a5f21`. Its PR record reports Quality and W9 passing on tested head `d38f6e2265de861d1a63cc614aa37b595b692b3a`; this is historical CI evidence, not current production verification.
- `package.json` build invokes `npm run db:migrate` after the Vite build and PGlite asset step.
- `scripts/migrate.mjs` uses a repository-specific migration runner and `menu_v3._migrations` ledger.
- The repository continuity history explicitly records a prior Vercel Preview build applying migration `20261023120000_restaurant_tables_and_qr_tokens.sql` to the connected Supabase project.
- `docs/release-only-vercel-workflow.md` already defines local-first QA, one coherent release batch, separate deployment evidence, quota handling, and rollback boundaries.
- `AGENTS.md` defines the owner as the sole human owner/developer and agents as internal workflows.
- Supabase official docs describe their own CLI ledger `supabase_migrations.schema_migrations`; the repository's custom runner uses a different ledger. Do not mix these mechanisms.

### UNKNOWN / requires F1 or later evidence
- Full current C4 component and deployment architecture.
- Complete current route/server-function-to-data-flow map.
- Current exact inventory of tables, views, functions, triggers, grants, RLS policies, and storage objects.
- Exact production database connection target selected by each Vercel environment; never infer it from an unexposed secret value.
- Current production deployment SHA/state at the time of a future release.
- Current backup retention, PITR entitlement, restore access, and successful restore evidence.
- Approved RPO/RTO.
- Whether a separate staging Supabase project exists and is operationally usable.
- Current Vercel/GitHub plan limits and remaining quotas.

### Explicit caution
This baseline does not assert that all proposed architecture documents or runbooks existed previously. It records the current verified starting point and the next evidence-gathering tasks.

## 2026-11-02 — F4.3 validation and simulated rehearsal closeout

F4.3's documentation and fictional owner rehearsal have been completed on branch `docs/f4-3-incident-rehearsal-2026-11-02`, based on main `41e5c36e434051f9668887974739870354706bd6`. The runbook now distinguishes confirmed/suspected incidents, isolated diagnostic errors, expected 4xx responses, and UNABLE TO ASSESS states; maps top-level `severity_text` separately from nested source-specific fields; and defines a conditional rollback gate. The tabletop covers detection, classification, triage, evidence, escalation, containment, rollback decision, recovery verification, closure, and post-incident records.

**Evidence limits:** Supabase's current query returned 267 events from eight sources and one PostgreSQL SQLSTATE 42803 ERROR whose origin/impact remain UNKNOWN; no Edge 5xx matches were returned. Vercel returned no grouped runtime error clusters in 24 hours and the latest Production deployment is READY on main SHA `41e5c36e434051f9668887974739870354706bd6`. These observations do not establish full application health. Exact Vercel quota and Auth/Function log coverage remain UNKNOWN.

**Status:** documentation/rehearsal complete with explicit limitations; final PR checks pending. No production operation occurred. F3 remains deferred/not done. Do not begin another phase until owner instruction.
