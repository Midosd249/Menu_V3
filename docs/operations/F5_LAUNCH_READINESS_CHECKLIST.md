# F5.7 — Evidence-Based Launch Readiness Checklist

**Status:** COMPLETE WITH EXPLICIT BLOCKERS — documentation-only assessment.  
**Date:** 2026-11-03  
**Repository baseline:** `main` at `4eed82ffddebf7d37f8818413672d465a37af9f2` (PR #425 merge).  
**Owner model:** one human Platform Owner/operator. Internal AI workflows are not human responders, operators, or customer-facing staff.  
**Scope:** assess repository-backed product and operating readiness; identify hard gates and missing evidence. This checklist does not authorize launch, customer onboarding, production changes, database operations, or deployment.

## 1. Executive decision

**LAUNCH READINESS: BLOCKED — NOT READY FOR FIRST REAL CUSTOMER / COMMERCIAL LAUNCH.**

Two explicit gates prevent a positive readiness decision:

1. **F3 — Backup, Restore & Disaster Recovery: DEFERRED BY OWNER — NOT DONE.** The repository records this as a mandatory pre-commercial gate. A successful isolated restore, integrity/compatibility validation, Storage-object recovery coverage, and approved RPO/RTO have not been established.
2. **F5.3 — Tenant/Branch Creation and Ownership Verification: DEFERRED BY OWNER — OPEN RISK.** A potential cross-tenant side-effect path in `src/lib/menu/owner.ts` `saveBranch` remains unremediated; runtime exploitability is unverified. This is not a security acceptance or proof of safety.

Additional launch-critical evidence remains UNKNOWN, including the currently deployed Production commit/health, a verified end-to-end production smoke test, current backup entitlement/inventory, persistent alert delivery, and the complete deployment environment contract.

This document records readiness evidence and gaps. It does not turn a proposed checklist item into a shipped feature or waive any owner decision.

## 2. Evidence rules

- **VERIFIED:** supported by current repository source, migrations, tests, merged documentation, or a directly observed CI result. State the evidence and its scope.
- **INFERRED:** a reasonable operational conclusion from verified evidence; not proof of a deployed capability.
- **PROPOSED:** a recommended control or manual owner action that is not established as an existing product capability.
- **UNKNOWN:** current evidence does not establish the claim.
- **BLOCKED:** the named gate or missing authorization/evidence prevents safe progression.

A passing GitHub CI run verifies only the tested commit and workflow scope. It does not prove Production deployment, production configuration, customer outcomes, provider-side backups, or real-device behavior. A merged document is not proof that an operational process has been rehearsed.

For each future item marked complete, retain: evidence link or artifact, exact commit/environment, date/time, scope, operator, result, and limitations. Never store passwords, tokens, raw secrets, payment-card data, or unnecessary customer personal data in the checklist.

## 3. Verified product capability inventory

The following is a repository-defined capability inventory, not a claim that every capability was freshly exercised in Production during F5.7.

| Area | Repository-backed capability | Status / operating boundary |
|---|---|---|
| Discovery | Public marketing, pricing, theme-preview surfaces, and published email/WhatsApp contact links. | **VERIFIED in repository.** No CRM, lead pipeline, appointment/demo booking, or automated follow-up is established. |
| Registration | Self-service signup with email-verification handling and server-side workspace provisioning. | **VERIFIED in repository.** Account creation is distinct from menu completion, publication, and paid activation. |
| Workspace | Tenant owner membership and a main branch are provisioned by the repository-defined flow. | **VERIFIED in repository.** Production application state was not queried for this checklist. |
| Restaurant setup | Studio brand, branch, menu/import, preview, and explicit publish workflows. | **VERIFIED in repository.** Restaurant owner remains responsible for accurate content and approval. |
| Guest access | Published public menu and branch QR sharing; optional table-specific QR/order context exists. | **VERIFIED in repository.** A table QR is not an authentication or tenant-authorization credential. |
| Team | Owner-created invitations with role/branch scope and verified-email acceptance. | **VERIFIED in repository.** Invitation links are manually shared; do not claim automated invitation email delivery. |
| Commercial plans | Free/Growth/Pro catalog and server/database entitlement enforcement. Platform Owner can administer plan, trial, status, freeze, invoice, and audit operations. | **VERIFIED in repository.** Never trust client-supplied entitlement or price. |
| Invoices and payments | Platform Owner can issue invoice records; customer billing surface is review/print and upgrade request is manual. | **VERIFIED limitation:** invoice issuance is not payment collection or proof of payment. No payment provider, online checkout, automatic charge, payment webhook, or payment-success state is established. |
| Customer communication | Published email and WhatsApp contact routes; manual owner-operated communication SOP. | **VERIFIED as contact links.** Delivery, monitoring, response time, ticketing, SLA, status page, and automated notifications are not established. |
| Support intake | Proposed manual intake register, internal P1–P4 triage, evidence fields, and bilingual templates. | **PROPOSED operating practice only.** No in-product support inbox, ticketing system, support CRM, staffed rota, backup responder, or guaranteed SLA is established. |
| Booking / external integrations | No current evidence in the inspected F5 journey establishes appointment booking or third-party operational integrations. | **UNKNOWN / NOT ESTABLISHED.** Do not market or promise these capabilities. |
| Monitoring / alerting | Historical F4 work documents log-source inspection and incident procedures. | **UNKNOWN for continuous monitoring and persistent alert delivery.** A sampled log query or runbook is not an alerting service. |

### 3.1 Explicit capability exclusions

Until independently implemented and verified, customer-facing material and operator conversations must not claim:

- online payments, automatic billing/collection, payment reconciliation, or paid status inferred from an invoice;
- appointment, reservation, or demo booking;
- CRM, ticketing, automated support intake, case assignment, or customer-success automation;
- automated email/SMS/WhatsApp broadcasts or invitation delivery;
- a status page, continuous monitoring, persistent alerting, 24/7 coverage, response SLA, or guaranteed restoration time;
- a verified disaster-recovery capability or tested customer-data restore;
- any integration not demonstrated by current code/configuration and a successful scoped test.

## 4. Mandatory pre-commercial gates

| Gate | Current evidence | Required closure evidence | Current status |
|---|---|---|---|
| F3 — Backup, Restore & Disaster Recovery | F3 discovery record identifies unknown project-specific backup plan, backup inventory/retention, PITR, independent Storage-object backup, isolated restore, and RPO/RTO. Owner deferred F3. | Owner-authorized, isolated restore; integrity and application compatibility checks; Storage object recovery coverage; dependency review; measured recovery evidence; documented retention and owner-approved RPO/RTO. No Production restore. | **BLOCKED — DEFERRED BY OWNER — NOT DONE.** |
| F5.3 — Tenant/branch ownership | Read-only discovery recorded a potential `saveBranch` cross-tenant side-effect path. | Separately authorized test-first remediation, affected-row/ownership enforcement as appropriate, adversarial cross-tenant and cross-branch regression tests, and review of server-side authorization/data boundaries. | **BLOCKED — DEFERRED BY OWNER — OPEN RISK.** |
| Production deployment identity | Current Production deployment commit and health were not directly established in F5.7. Merge/CI is not deployment evidence. | Read-only Vercel deployment record showing Production target, exact deployed SHA, READY state, aliases, and relevant runtime health evidence; reconcile with intended `main` SHA. | **UNKNOWN.** |
| Production smoke / real-device QA | CI browser checks are isolated test evidence; no real-device Production QA artifact was captured for this task. | Owner-authorized smoke test on the actual Production URL/device matrix after a verified release, covering signup/login, tenant boundary, menu publication, public guest flow, QR/order path where enabled, and support contact routes. | **UNKNOWN.** |
| Environment and secrets contract | README states the complete environment contract is not centralized and is partially UNKNOWN. No secret values were inspected. | Inventory required variable names by runtime, target, and purpose; verify presence/rotation/least privilege through approved secret-management UI without copying values into Git/chat; document missing items. | **BLOCKED / UNKNOWN.** |
| Operational monitoring | F4 evidence does not establish a persistent alert destination or continuous coverage. | Define and test owner-visible detection for service availability, application errors, auth/security events, database health/capacity, and provider incidents; name an accountable human response path. | **UNKNOWN.** |
| Support readiness | F5.5/F5.6 document manual contact and proposed support practice; no ticketing/SLA/backup responder. | Verify mailbox/WhatsApp access and delivery in a controlled non-customer test; choose and protect any private manual register; document owner availability and realistic limitations. Do not promise SLA. | **PARTIALLY DOCUMENTED; operational verification UNKNOWN.** |
| Commercial/legal readiness | Repository contains a plan catalog and invoice controls; no payment collection. Legal, tax, privacy, and contract review status was not established by F5.7. | Owner review of current terms/privacy disclosures, customer agreement, invoice/tax obligations, data retention/deletion, and jurisdiction-specific requirements with qualified advice where needed. | **UNKNOWN.** |

**No first real customer, customer-owned data, or commercial launch may proceed while F3 remains deferred.** F5.3 remains a separate open security risk and must not be represented as accepted or safe.

## 5. Pre-launch checklist — complete only with attached evidence

### A. Product and customer journey
- [ ] Confirm the exact customer-facing scope and exclusions in writing.
- [ ] Verify current signup, email verification, owner workspace provisioning, and account recovery behavior.
- [ ] Verify owner-controlled brand/branch/menu setup, preview, and explicit publish.
- [ ] Verify public menu URL and branch QR destination; verify table QR/order flow only if it is part of the offer.
- [ ] Verify product availability/options and server-authoritative price/entitlement behavior for the promised plan.
- [ ] Verify team invitation acceptance and least-privilege role/branch assignment if team access is offered.
- [ ] Confirm Arabic and English content quality for the actual restaurant's supplied content; do not assume translation completeness.
- [ ] Obtain restaurant-owner approval of names, prices, descriptions, images, contact/location details, and publication.

### B. Security, privacy, and data integrity
- [ ] Close the F5.3 ownership/isolation gate with adversarial evidence.
- [ ] Review auth/session and critical server-side authorization paths.
- [ ] Confirm no client-supplied tenant, branch, role, entitlement, identity, or price is trusted.
- [ ] Confirm tenant and branch boundaries for reads, writes, invitations, orders, exports, and administrative actions.
- [ ] Confirm secret values are not present in repository, logs, screenshots, or support evidence.
- [ ] Define minimum data collection, access, retention, deletion, and incident evidence handling.
- [ ] Review privacy/terms/customer agreement and applicable obligations with qualified advice.

### C. Recovery and service continuity
- [ ] Complete F3 and record a successful isolated restore.
- [ ] Verify database and Storage object recovery independently.
- [ ] Record backup source, timestamp, retention, encryption/custody, integrity check, and restore compatibility.
- [ ] Approve realistic RPO/RTO based on measured evidence; do not invent targets.
- [ ] Rehearse recovery and rollback boundaries without touching Production.
- [ ] Name the human owner for recovery decisions and supplier escalation.

### D. Release and Production
- [ ] Confirm release commit, CI checks, reviewed diff, and rollback plan.
- [ ] Confirm current Production deployment is READY and its deployed SHA matches the approved release SHA.
- [ ] Confirm domain aliases and HTTPS/TLS behavior.
- [ ] Verify Production runtime logs/health and persistent alert delivery.
- [ ] Run the approved real-device smoke test on Arabic/English and relevant mobile browsers.
- [ ] Verify public menu, account access, Studio, ordering/QR (if offered), and support contact routes.
- [ ] Confirm no unintended Preview/Production database target or migration side effect.
- [ ] Record exact result, timestamp, environment, device/browser, and evidence.

### E. Commercial and support operations
- [ ] Confirm the offered plan, price, limits, trial terms, and manual invoice/payment boundary.
- [ ] Explain that an issued invoice is not proof of payment and that online collection is not established.
- [ ] Verify the published contact channels in a controlled test.
- [ ] Establish a private, access-controlled manual intake record only if the owner chooses to use one.
- [ ] Define the sole owner's realistic availability and escalation path; do not imply staffed 24/7 support or SLA.
- [ ] Confirm who approves customer content, publication, plan changes, and incident communications.
- [ ] Record customer acceptance of product limitations and the agreed first operational milestone.

## 6. Release decision record

A launch decision must be one of:

- **READY:** every mandatory gate is closed with direct evidence; remaining risks are explicitly reviewed and owner-approved; production and customer journey evidence is current.
- **READY WITH EXPLICIT LIMITATIONS:** only when no mandatory gate remains open and the owner has documented each limitation and its customer impact.
- **BLOCKED:** any mandatory gate is open, evidence is missing, or the proposed offer depends on an unsupported capability.

**F5.7 decision on 2026-11-03: BLOCKED.** F3 is deferred/not done; F5.3 is deferred/open risk; current Production deployment/health and several operational controls are UNKNOWN. This is not permission to launch, onboard, collect customer-owned data, or deploy.

## 7. Research basis and repository evidence

### Repository sources
- `docs/operations/F5_SALES_TO_ACTIVATION_JOURNEY.md` — actual sales-to-activation and product capability boundaries.
- `docs/operations/F5_OWNER_LED_CUSTOMER_ONBOARDING_SOP.md` — owner-led onboarding and F3 gate.
- `docs/operations/F5_PLATFORM_SUBSCRIPTION_AND_INVOICE_OPERATIONS_SOP.md` — Platform Owner commercial controls and invoice limitations.
- `docs/operations/F5_CUSTOMER_COMMUNICATIONS_MAINTENANCE_AND_INCIDENT_SOP.md` — manual communications and unsupported notification/SLA boundaries.
- `docs/operations/F5_SUPPORT_INTAKE_SEVERITY_AND_EVIDENCE_SOP.md` — proposed intake/triage and privacy boundaries.
- `docs/operations/F3_BACKUP_RESTORE_DISCOVERY.md` — project-specific recovery unknowns and F3 acceptance gate.
- `docs/operations/PRODUCTION_SAFE_OPERATIONS.md` and `docs/operations/MIGRATION_RUNBOOK.md` — release, migration, rollback, and recovery safety constraints.
- `README.md` — stack, verification commands, deployment separation, and incomplete environment contract.
- `AGENTS.md`, `docs/automatic-specialist-routing.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, and `docs/FINALIZATION_ROADMAP.md` — repository authority and continuity.

### External primary guidance
These sources inform the structure of the checklist only. They do not establish that Menuun implements any control.

- NIST, *Cybersecurity Framework 2.0: Small Business Quick-Start Guide*, SP 1300: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.1300.pdf — asset inventory, backup/recovery responsibilities, restoration integrity, and incident recovery communication.
- CISA, *Cybersecurity Performance Goals 2.0*: https://www.cisa.gov/cybersecurity-performance-goals-2-0-cpg-2-0 — asset inventory, vulnerability management, change management, backup/restoration, and protected log collection.
- CISA, *Safe Software Deployment: How Software Manufacturers Can Ensure Reliability for Customers*: https://www.cisa.gov/sites/default/files/2024-10/safe-software-deployment-how-software-manufacturers-can-ensure-reliability-for-customers-508c.pdf — detection/reporting, escalation, rollback, recovery, root-cause review, and customer notification planning.

## 8. F5.7 acceptance and limitations

- [x] Current repository-backed product capabilities and explicit exclusions are recorded.
- [x] Payment, booking, integration, support automation, monitoring, and recovery claims are not overstated.
- [x] F3 and F5.3 gates are preserved as mandatory/open, not accepted or closed.
- [x] Production deployment and health remain UNKNOWN where no direct current evidence was obtained.
- [x] Checklist includes evidence requirements, accountable owner, and release decision criteria.
- [x] No customer contact, customer data, application/runtime change, database operation, migration, settings/secrets change, or deployment occurred.

**F5.7 STATUS: COMPLETE WITH EXPLICIT BLOCKERS — documentation-only.**

**EXACT NEXT TASK: F6.1 — Reconfirm auth/session/authorization paths for critical operations.** Keep F3 as a mandatory pre-commercial gate and F5.3 as an open risk; do not start a launch or deployment.


---

## 9. Production deployment evidence update — 2026-11-12

The original F5.7 decision dated 2026-11-03 remains historically correct for the evidence available at that time. The following read-only deployment evidence was obtained after PR #429 merged:

- **VERIFIED Production deployment:** Vercel deployment `dpl_84mgticAAEAW8wskM8BqWPnMCzTw`.
- **VERIFIED state/target:** `READY`, target `production`.
- **VERIFIED deployed commit:** `a28810a1c75035f0c843ecf09cb1c2f9b49199bd`, branch `main`.
- **VERIFIED aliases:** `www.menuun.com`, `menuun.com`.
- **VERIFIED merge:** PR #429 merged at `a28810a1c75035f0c843ecf09cb1c2f9b49199bd`; the connected Git/Vercel integration automatically produced the Production deployment.
- **UNKNOWN:** post-merge GitHub Actions workflow results for the merge SHA; real-device/browser smoke test; signup/login, tenant isolation, Studio, published menu, QR/order, and customer-contact journey health on the deployed Production version.
- **No database migration, database mutation, or customer-data change** was performed as part of the continuity reconciliation.

**Updated gate:** Production deployment identity is no longer UNKNOWN; it is VERIFIED as READY on the merge SHA. Production smoke/real-device QA remains UNKNOWN. Overall launch readiness remains **BLOCKED** because F3 is deferred/not done and F5.3 remains an open risk. Deployment READY does not authorize onboarding a real restaurant or waive either mandatory gate.
