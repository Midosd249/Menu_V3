## 2026-11-03 — F5.7 launch-readiness checklist and PR #425 continuity closeout

- **VERIFIED:** PR #425 merged at `4eed82ffddebf7d37f8818413672d465a37af9f2`; exact PR head `5a536c91c0ac1bca59bf00251f52fa0b520ce4e9`.
- **VERIFIED exact-head CI:** Quality `41709298338` SUCCESS and W9 Orders QA `41709298244` SUCCESS on exact PR head.
- **F5.7 DELIVERABLE:** `docs/operations/F5_LAUNCH_READINESS_CHECKLIST.md` — evidence-backed capability inventory, hard pre-commercial gates, evidence checklist, and release decision criteria.
- **READINESS:** BLOCKED. F3 remains DEFERRED BY OWNER — NOT DONE; F5.3 remains DEFERRED BY OWNER — OPEN RISK; Production deployment/health and several operational controls remain UNKNOWN.
- **RESEARCH:** repository-first plus official NIST SP 1300 and CISA Cybersecurity Performance Goals 2.0 / Safe Software Deployment guidance. External guidance informs checklist domains only, not Menuun feature claims.
- **SAFETY:** documentation-only; no customer contact/data, application/runtime, database/migration, settings/secrets, billing, Production, or deployment operation.
- **EXACT NEXT TASK:** F6.1 — Reconfirm auth/session/authorization paths for critical operations. No launch/deployment.

---

## 2026-11-03 — F5.4 merge and F5.5 customer communications SOP implementation

- **VERIFIED:** PR #421 merged into `main` at `9fcea58af77bb86bb5d2cefcc2d6c5fa5272a2cc`; exact PR head `bb1881b21fb34944ae82e93434ec805ef625221e`; base `216810951925b338e63da0b3415a9ba15f022551`.
- **VERIFIED exact-head CI:** Quality run `41577752976` SUCCESS and W9 Orders QA run `41577752967` SUCCESS on exact PR head `bb1881b21fb34944ae82e93434ec805ef625221e`.
- **VERIFIED diff:** seven documentation files only; no runtime code, schema, migration, customer data, subscription/account/invoice operation, settings/secrets, or deployment changes.
- **POST-MERGE CI:** no PR-triggered workflow runs were returned for merge SHA `9fcea58af77bb86bb5d2cefcc2d6c5fa5272a2cc`; post-merge CI remains UNKNOWN. No Vercel deployment was requested or performed.
- **F5.3:** remains DEFERRED BY OWNER — OPEN RISK; the potential `saveBranch` cross-tenant side-effect path is not remediated or runtime-verified.
- **IMPLEMENTED ON BRANCH:** F5.5 SOP `docs/operations/F5_CUSTOMER_COMMUNICATIONS_MAINTENANCE_AND_INCIDENT_SOP.md` on `docs/f5-5-customer-communications-2026-11-03`. It documents existing email/WhatsApp channels, planned maintenance notices, incident updates/resolution, privacy safeguards, owner approval, and Arabic/English templates. It does not claim a status page, SLA, CRM, ticketing, or automated broadcast.
- **RESEARCH:** repository-first evidence plus CISA/FBI/international partners' 2026-09-02 service-provider communications guidance via Exa. Guidance informs process only, not Menuun capability or legal obligations.
- **SAFETY:** no customer was contacted; no incident/maintenance operation, customer-data collection, database mutation, migration, billing operation, or deployment occurred.
- **EXACT NEXT ACTION:** verify F5.5 exact-head Quality/W9 and review the full diff; create the F5.5 PR only after successful checks.

---

## 2026-11-03 — F5.3 owner deferral and F5.4 subscription operations SOP submitted for review

- **OWNER DECISION:** defer F5.3 for now and continue with the next independent F5 work package. F5.3 is recorded as DEFERRED BY OWNER — OPEN RISK, NOT COMPLETE. The potential `saveBranch` cross-tenant side-effect path remains unremediated; runtime exploitability is not established. This decision is not security acceptance or proof of safety.
- **VERIFIED REPOSITORY BASIS:** `platform-subscriptions.ts` exposes Platform Owner-only plan, billing interval, trial, status, account-freeze and audit functions; `platform-billing.ts` exposes Platform Owner-only invoice issue/list; `commercial-catalog.ts` defines Free/Starter/Pro limits and prices; PH-04 tests cover the principal authorization, validation and audit contracts.
- **IMPLEMENTED ON BRANCH:** `docs/f5-4-platform-subscription-operations-2026-11-03` adds `docs/operations/F5_PLATFORM_SUBSCRIPTION_AND_INVOICE_OPERATIONS_SOP.md` and updates continuity records. PR #421 is OPEN / READY FOR REVIEW / NOT MERGED. Documentation only.
- **IMPORTANT LIMIT:** invoices are issued records, not payment collection or proof of payment. The repository has no payment provider/automatic charge/webhook/payment-status behavior in the invoice migration. No invoice void workflow was found in the inspected Platform Owner invoice endpoints.
- **F3:** remains DEFERRED BY OWNER — NOT DONE and continues to block real-customer onboarding/customer-owned data/commercial launch.
- **RESEARCH:** repository-first review of current code, migrations, UI and tests; Exa reviewed OWASP multi-tenant guidance for the still-open F5.3 risk context. No live customer or production operation.
- **VERIFICATION:** source and test contracts inspected remotely; no local checkout/terminal execution, live subscription operation, invoice issuance, database query, merge or deployment. Exact-head Quality/W9 are the required PR verification gates; their run IDs and outcomes are recorded in PR #421.
- **EXACT NEXT ACTION:** review the complete branch diff, create/inspect the PR, then verify Quality and W9 on its exact final PR head. Do not merge or deploy automatically.

---

## 2026-11-03 — F5.2 final closure

- **VERIFIED:** PR #419 merged; exact PR head `710cc3aad35a745ce0545617fc507c64b7cb13db`; merge/main SHA `76e6e13dba919211885270bca4e09bbfa5b7bfc1`.
- **VERIFIED exact-head CI:** Quality run `41564124218` SUCCESS; W9 Orders QA run `41564124226` SUCCESS. Both runs are associated with the exact final PR head.
- **VERIFIED diff:** seven documentation files only; no application code, workflow/configuration, database/schema/migration, secrets/settings, customer data, or billing changes.
- **VERIFIED post-merge workflow lookup:** no PR-triggered runs were returned for merge SHA `76e6e13dba919211885270bca4e09bbfa5b7bfc1`; post-merge main CI remains UNKNOWN (not rerun).
- **DEPLOYMENT:** no Vercel deployment was requested or verified; Production status UNKNOWN.
- **SAFETY:** no customer onboarding, customer-owned data, production mutation, migration, Supabase/Vercel settings change, or deployment.
- **F3:** DEFERRED BY OWNER — NOT DONE; the pre-commercial recovery gate remains mandatory.
- **NEXT:** F5.3 read-only discovery began; it identified a potential cross-tenant side-effect risk in `saveBranch`. Follow-up remediation is a separately scoped task; no product/security implementation was authorized by this F5.2 closeout.

---

## 2026-11-03 — F5.1 merge and F5.2 SOP implementation checkpoint (historical; superseded by closeout below)

- **VERIFIED:** PR #418 merged at `1cdf33335a1be9e1a7885c405418b9d646e844df`; final PR head `5dfad2399e2956e60baae6462d5d222aece957d9`; base `2c7f6fe6ff134466d43fe5c1fd166548c6aa9dd4`.
- **VERIFIED CI:** PR Quality `41543919157` and W9 Orders QA `41543919245` succeeded on the exact PR head. Post-merge main Quality `41547643428` succeeded on the merge SHA. The Supabase Preview check was successful; this is not Production deployment evidence.
- **IMPLEMENTED ON BRANCH:** `docs/f5-2-owner-led-onboarding-sop-2026-11-03` adds `docs/operations/F5_OWNER_LED_CUSTOMER_ONBOARDING_SOP.md` and reconciles F5 continuity documents. This is an owner-led process SOP grounded in F5.1 verified capabilities; no product feature is added.
- **RESEARCH:** Exa reviewed ICO data protection by design/data minimisation and FTC business information security guidance; restaurant-tech vendor checklists were treated only as non-authoritative process examples.
- **SAFETY:** no real customer onboarding or customer-owned data; no application code, database/schema/migration, Supabase/Vercel settings, secrets, billing operation, deployment, or rollback.
- **F3:** remains DEFERRED BY OWNER — NOT DONE and blocks real-customer/commercial launch.
- **HISTORICAL:** intermediate branch checkpoint. Final exact-head verification and merge are recorded in the closeout entry above.
- **EXACT NEXT ACTION:** F5.3 — read-only discovery and documentation of tenant/branch creation and ownership verification.

F2 UPDATE — 2026-11-02

- **IMPLEMENTED ON BRANCH:** `feat/f2-production-safe-migrations`, based on F1 architecture commit `b42229bcab316f1d85d2ff189754ec56ad434c15`.
- **CHANGE:** application build no longer invokes the custom PostgreSQL migration runner.
- **SAFETY:** explicit migration target plus exact host/database/user match; Vercel execution is rejected; Production requires a confirmation phrase; concurrent runner invocations are serialized by PostgreSQL advisory lock.
- **DEPLOYMENT CONTROL:** `vercel.json` uses `**: false` as the minimatch default, with `main: true` and `preview/*: true` exceptions.
- **VERCEL EVIDENCE:** the initial `*` wildcard did not match the slash-containing feature branch and created Preview `dpl_CMdCq6E2gEz3UR2bjJN782UMDHUj` (READY) for commit `5ce4a7108c9adb383931af0557375be78caf5884`. Build logs show the artifact-only build command and no migration-runner output. The wildcard was corrected; no additional deployment was observed for the corrected HEAD. PR-triggered behavior remains pending.
- **PRESERVED:** PGlite runtime migrations, `menu_v3._migrations`, and per-file transactions. No SQL migration or database was changed.
- **VERIFICATION:** local/sandbox execution is blocked; GitHub Quality/W9 remain pending exact-head verification; do not claim success until both run on the final PR head. No production migration, merge, or Production deployment occurred.

---
## 2026-11-03 — F4.3 incident runbook and simulated rehearsal closeout

- **VERIFIED:** PR #417 branch `docs/f4-3-incident-rehearsal-2026-11-02`, final head `102e24e343e6add57e53d49a0908b78c7bfa974e`; base `main` `41e5c36e434051f9668887974739870354706bd6`; 12 commits ahead / 0 behind.
- **VERIFIED CI ON EXACT HEAD:** Quality run `41523483447` SUCCESS; W9 Orders QA run `41523483512` SUCCESS. Quality job passed typecheck, tests, lint, production build and applicable browser QA; conditional P1.9 route-graph-only steps were skipped. W9 isolated PGLite Orders browser QA passed.
- **VERIFIED DIFF:** eight documentation files only, 225 additions / 38 deletions; no runtime code/config/schema changes. Remote compare reviewed.
- **STATUS:** F4.3 documentation and fictional tabletop complete with explicit operational limitations. PR #417 remains OPEN / NOT MERGED; no merge or deployment was performed.
- **SAFETY:** no manual CI reruns, production fault injection, database/platform mutation, backup/restore, deployment or rollback.
- **NEXT:** await explicit owner decision on PR #417; no subsequent phase starts automatically.

# Menuun Development History — Evidence Register

**Program:** F-Series  
**Purpose:** Preserve major product and engineering milestones without relying on chat memory.  
**Baseline:** 2026-11-02  
**Rule:** This is a curated milestone register, not a claim to reproduce every commit. Git history remains authoritative.

## 2026-11-02 — F4.2 Supabase log classification

- **VERIFIED:** Connected read-only Logs Explorer query returned eight sources and their event counts; source-native keys were mapped in the F4 operations record.
- **VERIFIED:** PostgreSQL `parsed.error_severity` / `parsed.sql_state_code`, Edge `response.status_code`, and Storage/Realtime `level` were present in sampled records.
- **FINDING:** one PostgreSQL ERROR, SQLSTATE `42803`, command `SELECT`, at `2026-11-01T23:20:38.823Z`; message excerpt indicates GROUP BY projection issue. Application origin/impact UNKNOWN; not a confirmed customer incident.
- **VERIFIED CI on pre-F4.2 head:** Quality `41477117064` SUCCESS and W9 Orders QA `41477117274` SUCCESS on `8d945e30fdf9b6cda44f27eb5d298f6374916210`.
- **OWNER-REPORTED:** application check completed successfully; separate from platform log evidence.
- **NEXT:** F4.3 non-destructive incident-response tabletop validation.


## 2026-11-02 — F1/F2 merged and Production deployment verified; F3 opened

- **VERIFIED:** PR #415 merged F1 architecture baseline and F2 production-safe build/migration boundary.
- **Feature head:** `9b077e5f4f3177b4f7f537e8b4e66b203960533b`.
- **Merge/main SHA:** `848d4acdd3b184c24142d1e77fc0c9af55f20eab`.
- **CI:** Quality `41381209308` SUCCESS and W9 Orders QA `41381209270` SUCCESS on the exact feature head.
- **Production:** Vercel deployment `dpl_6RFG7Ycb4XLxnWTwwYhmGQUhmas3`, READY, target production, deployed commit equals main SHA; aliases `www.menuun.com` and `menuun.com`.
- **F3 discovery:** Supabase project metadata and Storage catalog inspected read-only; account-specific backup/PITR status not exposed by connected tools. Details and official platform limitations are in `docs/operations/F3_BACKUP_RESTORE_DISCOVERY.md`.
- **Safety:** no SQL migration, production data mutation, PITR activation, restore, project clone, or deployment was performed in F3 discovery.

## 1. How to maintain this history

For each material milestone, record:

- Date (UTC where known).
- Phase/feature identifier.
- PR number and title.
- Tested code SHA.
- Merge SHA.
- Main SHA after merge, if verified.
- CI run IDs and exact result.
- Deployment ID/SHA/state only when directly verified.
- Database migration names and target only when evidenced.
- Owner-side browser/device confirmation separately from automated evidence.
- Remaining UNKNOWN/BLOCKED items.
- Links to incident reports, ADRs, and detailed task closeouts.

Never infer merge from an open PR, deployment from a green Vercel check, or real-device success from CI.

## 2. Verified baseline milestones

### 2026-10-23 — QR table ordering
- **VERIFIED:** PR #411, `feat(orders): connect public menu to table QR ordering`, is merged.
- **Merge SHA:** `f6e888ded688ba682b3c5862719b76adb96a5f21`.
- **Tested head recorded in PR:** `d38f6e2265de861d1a63cc614aa37b595b692b3a`.
- **CI evidence recorded in PR:** Quality run `39902102483` PASS; W9 Orders QA run `39902102479` PASS.
- **Scope recorded:** server-side opaque token resolution, tenant/branch validation, trusted table ID persistence, table-aware idempotency, Studio table management, token rotation, table labels, private/no-store behavior for token-bound pages, and regression coverage.
- **Database side effect:** PR record states migration `20261023120000_restaurant_tables_and_qr_tokens.sql` had already been applied to the connected Supabase project by a prior Vercel Preview build. This must remain visible in the database change history; do not claim Preview was database-isolated for that run.
- **Limitation:** PR record explicitly does not claim real-device QA or prove that production serves the merged commit.

### 2026-10-23 — Essential language selector
- **VERIFIED:** main's latest inspected commit `5a84d31282383e191472bcd3fc7d5b62417e90ca` is titled `fix(theme): repair Essential language selector state rules (#413)`.
- **VERIFIED:** prior commit `5ea83557946ed4b73ba8552175b9c795bfd5b813` addressed selector contrast.
- **Scope:** scoped selector state/contrast rules and regression contracts, as described by commit messages.
- **Limitation:** this history entry does not make a new visual/device claim beyond the recorded Git evidence and owner-side confirmations held separately.

### 2026-10-22 — Subscription lifecycle remediation
- **VERIFIED in Git history:** commits include `9c575927be4d3ef08fa37dca0e0d89ce8e9beae9` for trial expiry and atomic admin audit changes, followed by `74ddc7af44e0472e132416496579b523c847f6a0` for trials with missing expiry timestamps.
- **Scope from commit descriptions:** expiry handling, transactional audit behavior, and regression contract.
- **Limitation:** consult the PR and exact workflow runs before making a new verification claim.

### 2026-10-21 — Team invitation recovery
- **VERIFIED in Git history:** commit `624764b789c7ad2bb228871f8c1fe908bfa28db5` records invitation-context recovery after email verification.
- **Scope from commit description:** preserve invitation context through signup/verification and recover access safely.
- **Limitation:** current behavior should be treated as implemented history, not re-tested by this history document.

### 2026-10-16 — Pricing contrast and CI debugging
- **VERIFIED:** repository contains `docs/incidents/PR-402-pricing-contrast-and-ci-debugging.md`.
- **Purpose:** detailed retrospective of multiple CI/browser causes, fixes, and prevention rules.
- **Rule:** read this incident report before changing the same test/runner/browser infrastructure.

## 3. Current repository checkpoint — verified 2026-11-02

- **VERIFIED:** `main` HEAD `848d4acdd3b184c24142d1e77fc0c9af55f20eab`.
- **VERIFIED:** PR #415 is merged at that SHA; F0, F1 and F2 are DONE.
- **VERIFIED:** exact F2 feature-head Quality/W9 runs succeeded (IDs above).
- **VERIFIED:** Production deployment `dpl_6RFG7Ycb4XLxnWTwwYhmGQUhmas3` is READY on the same SHA.
- **ACTIVE:** F3.1 read-only backup inventory.
- **UNKNOWN:** account-specific backup schedule/retention, PITR, Storage object backups, manual exports, isolated restore readiness, approved RPO/RTO.

## 4. Architecture and operational evolution

This section is a living register. Add an entry when an architectural decision or operating rule changes materially.

| Date | Decision/change | Evidence | Status |
|---|---|---|---|
| 2026-11-02 | Establish F-Series roadmap and phase IDs | F0 documentation branch; reconciled in F3 continuity PR | DONE |
| Historical | Release-only Vercel policy | `docs/release-only-vercel-workflow.md`, `AGENTS.md` | Existing repository policy |
| Historical | Custom migration runner and ledger | `scripts/migrate.mjs`, PR #415, ADR-0002 | Existing custom runner retained; F2 safety boundary DONE |

## 5. Do not repeat without evidence

- Do not reopen completed QR table ordering, Essential selector, invitation, subscription, or theme work merely because an old continuity file says it is pending.
- Do not re-run broad visual audits without a concrete new scope or regression.
- Do not repeat CI retries without inspecting exact SHA, failed step, logs, and changed conditions.
- Do not create another generic architecture document if F1 has already produced a maintained equivalent.
- Do not treat provider advisor notices as confirmed vulnerabilities without analyzing exposure and access paths.
- Do not repeat production database inspections or mutations without a concrete question and read-only-first approach.

## 6. Next history entries

Future entries should link to:
- PR and merge commit.
- Relevant test/CI runs.
- Migration ledger evidence where relevant.
- Production deployment evidence where relevant.
- Incident/ADR/architecture docs.
- Owner-side verification, clearly separated from automated checks.

### 2026-11-02 — F4.3 incident runbook validation and simulated rehearsal

- **VERIFIED base:** main `41e5c36e434051f9668887974739870354706bd6`; work isolated on `docs/f4-3-incident-rehearsal-2026-11-02`.
- **Scope:** documentation-only F4.3. Added incident classification, source/field reconciliation, missing-telemetry rules, proposed-threshold discipline, conditional rollback decision gate, and fictional owner tabletop.
- **Current evidence:** Supabase ACTIVE_HEALTHY; 267 events in eight sources; top-level severity_text populated in the sample; one PostgreSQL ERROR SQLSTATE 42803 remains uncorrelated; no Edge 5xx matches. Vercel runtime error query returned no clusters for 24h; latest Production deployment READY on main SHA 41e5c36e.
- **Safety:** no production fault injection, deployment, rollback, DB mutation, migration, settings/secrets change, backup/restore, paid upgrade, or manual CI rerun.
- **Status:** documentation/rehearsal complete; final PR checks pending. No F4.4/F5/F6 work started.


---

## 2026-11-03 — F5.1 actual sales-to-activation journey

- **VERIFIED baseline:** main `2c7f6fe6ff134466d43fe5c1fd166548c6aa9dd4`; work isolated on `docs/f5-1-sales-activation-journey-2026-11-03`.
- **DELIVERABLE:** `docs/operations/F5_SALES_TO_ACTIVATION_JOURNEY.md` maps the current hybrid owner-assisted discovery / self-serve activation path from repository source and migrations.
- **VERIFIED product boundaries:** no in-product CRM/lead pipeline, demo booking, support ticketing/SLA, online checkout, automatic payment collection, or payment-success state is claimed. New workspace provisioning, menu publication, QR sharing, team invitations, and owner-operated billing are separately documented.
- **CONTINUITY CORRECTION:** `docs/CUSTOMER_LIFECYCLE_ACCESS_POLICY.md` marked as a historical 2026-09-16 snapshot because the later self-serve lifecycle retirement record and current source supersede its manual-approval flow.
- **F4 closeout:** PR #417 CLOSED / MERGED at main SHA `2c7f6fe6ff134466d43fe5c1fd166548c6aa9dd4`; exact PR-head Quality `41526431191` and W9 `41526431206` succeeded on `7cf724eb7bbfdf7808935fa045e36a08b5732f6c`. Post-merge main CI remains UNKNOWN.
- **SAFETY:** no application code, DB/schema/migration, customer data, production settings, secrets, billing, deployment, or manual CI rerun changed/performed.
- **F3:** remains DEFERRED BY OWNER — NOT DONE; no real-customer onboarding or commercial launch.
- **STATUS:** F5.1 COMPLETE WITH EXPLICIT LIMITATIONS. Exact next task: F5.2 owner-led operating procedure. No F5.2 work started.


## 2026-11-03 — F5.5 customer communications SOP merged and verified

- **VERIFIED MAIN:** PR #422 merged at `0593f3f21a8fcf7ed1836a1b5ee87731b7454408`; exact PR head `61e6b1db277753902a562d6ed4152d90172c5a62`.
- **VERIFIED EXACT-HEAD CI:** Quality run `41579747196` SUCCESS and W9 Orders QA run `41579747129` SUCCESS on the exact PR head. Quality steps passed typecheck, tests, lint, production build, template/browser checks and Studio/Platform Admin browser QA; W9 Orders browser QA passed.
- **VERIFIED DIFF:** seven documentation-only files in PR #422; no runtime code, schema, migrations, customer data, billing, settings/secrets, or deployment changes.
- **RESEARCH:** repository-first review and Exa search of official CISA/FBI/international guidance published 2026-09-02. Guidance used for process principles only, not as legal advice or evidence of product capability.
- **UNKNOWN:** no PR-triggered workflow runs were returned for merge SHA `0593f3f21a8fcf7ed1836a1b5ee87731b7454408`; post-merge CI remains UNKNOWN.
- **DEPLOYMENT:** NOT PERFORMED.
- **EXACT NEXT TASK:** F5.6 — define support intake, severity, response ownership, and evidence capture.


## 2026-11-03 — F5.6 support intake and evidence SOP

- **CLASSIFICATION:** documentation-only operational procedure.
- **VERIFIED BASE:** `5232e99cc5382a02d5b0322641403d9c528f1513`; branch `docs/f5-6-support-intake-severity-evidence-2026-11-03` created from current main.
- **DELIVERABLE:** `docs/operations/F5_SUPPORT_INTAKE_SEVERITY_AND_EVIDENCE_SOP.md`.
- **EVIDENCE:** public email/WhatsApp links in marketing footer; Studio customer workspace is restaurant guest management; Platform Admin is account/subscription/invoice administration; legacy customer request flow retired by migration.
- **RESEARCH:** Exa official NIST SP 800-61 Rev.3 and CISA NCISS/Federal Incident Notification guidance. Guidance is not a claim of Menuun implementation or local legal applicability.
- **PROPOSED:** manual private intake record, P1–P4 triage, owner accountability, privacy-safe evidence capture, bilingual templates.
- **LIMITS:** ticketing, support CRM, automated intake, SLA, 24/7 coverage, and backup responder remain UNKNOWN / NOT ESTABLISHED.
- **SAFETY:** no customer contact/data, app code, database, migration, billing, production operation, or deployment.
- **F3:** DEFERRED BY OWNER — NOT DONE. **F5.3:** DEFERRED BY OWNER — OPEN RISK.
- **STATUS:** pending exact-head CI, final diff review, and merge.


## 2026-11-03 — F5.6 support intake SOP closeout

- **VERIFIED BASE:** `5232e99cc5382a02d5b0322641403d9c528f1513`; branch `docs/f5-6-support-intake-severity-evidence-2026-11-03`; implementation head before continuity reconciliation `4fc3afd1ef1772e116fa3983912b6d40b8f63ae8`.
- **DELIVERABLE:** `docs/operations/F5_SUPPORT_INTAKE_SEVERITY_AND_EVIDENCE_SOP.md`.
- **VERIFIED EXACT-HEAD CI:** Quality run `41678652745` SUCCESS and W9 Orders QA run `41678652739` SUCCESS on exact implementation head `4fc3afd1ef1772e116fa3983912b6d40b8f63ae8`. Quality passed typecheck, tests, lint, production build, all-theme browser QA, Arabic/English brand browser QA, golden performance fixture, Studio and Platform Admin browser QA. Conditional P1.9 route-graph-only steps were skipped. W9 isolated PGLite Orders browser QA passed.
- **VERIFIED CAPABILITY BOUNDARIES:** published email/WhatsApp links exist; restaurant guest workspace and Platform Admin are not support-ticket systems; legacy customer-request intake was retired. Ticketing, support CRM, automated intake, SLA, 24/7 coverage, backup responder, monitoring frequency and private-register storage remain UNKNOWN / NOT ESTABLISHED.
- **PROPOSED:** owner-operated manual intake register, P1–P4 internal triage, single-owner accountability, evidence fields, privacy safeguards and bilingual templates. These are not product capabilities or SLA.
- **RESEARCH:** official NIST SP 800-61 Rev.3 and CISA NCISS/Federal Incident Notification guidance reviewed via Exa; process context only, not legal advice or proof of Menuun capabilities.
- **SAFETY:** documentation-only. No customer contact/case/data, runtime, database, migration, billing, production operation or deployment.
- **F3:** DEFERRED BY OWNER — NOT DONE. **F5.3:** DEFERRED BY OWNER — OPEN RISK; potential `saveBranch` cross-tenant side-effect path remains unremediated and runtime exploitability unverified.
- **DEPLOYMENT:** NOT PERFORMED.
- **EXACT NEXT TASK:** F5.7 — establish a launch checklist validating only configured capabilities and excluding unsupported payments, booking, integrations and automation. Do not start automatically.
