# F5.6 — Support Intake, Severity, Response Ownership, and Evidence Capture

**Status:** COMPLETE WITH EXPLICIT LIMITATIONS — PR #424 merged at `5941b8e9b13583760150ccc94f005061c552ce0f`. Exact PR-head Quality `41704014621` and W9 `41704014491` SUCCESS on `60c5300b04407edc1e62334f343f7ad051c8774c`.  
**Baseline:** `main` at `5232e99cc5382a02d5b0322641403d9c528f1513`.  
**Date:** 2026-11-03  
**Owner model:** one human Platform Owner/operator. Internal AI workflows are not human responders, support agents, or customer-facing spokespeople.

## 1. Purpose and boundaries

Define a repeatable, privacy-conscious way to receive, record, classify, investigate, route, update, and close customer support reports using only currently verified Menuun contact surfaces and owner-operated procedures.

This SOP does not create or imply an in-product support inbox, ticketing system, CRM, case-management feature, automated intake, staffed support team, on-call rota, response SLA, 24/7 coverage, or guaranteed resolution time. A private manual register described below is a **PROPOSED operator practice**, not a shipped product capability.

**Commercial and security gates remain unchanged:**
- **F3 — Backup, Restore & Disaster Recovery:** DEFERRED BY OWNER — NOT DONE. Mandatory before first real customer/customer-owned data/commercial launch.
- **F5.3 — Tenant/Branch Creation and Ownership Verification:** DEFERRED BY OWNER — OPEN RISK. The potential `saveBranch` cross-tenant side-effect path remains unremediated; runtime exploitability is unverified. This SOP does not accept or close it.
- No customer was contacted and no live support case was created while preparing this document.

## 2. Evidence labels

- **VERIFIED:** directly supported by current source, migration, test, or merged repository evidence.
- **INFERRED:** operational interpretation of verified evidence; not a product feature.
- **PROPOSED:** recommended manual practice for the sole owner; not currently automated or contractual.
- **UNKNOWN:** not established by inspected evidence; do not promise it.
- **BLOCKED:** cannot safely proceed until the named dependency or authorization is satisfied.

## 3. Verified intake channels and capability inventory

| Channel/capability | Current evidence | Status and limit |
|---|---|---|
| Public support email | `src/components/marketing-footer.tsx` renders a `mailto:` link using the configured Menuun contact address. | VERIFIED as a published contact route. Mailbox access, monitoring, delivery, retention, and response time are not established by the footer source. |
| Public WhatsApp | The same footer builds a `wa.me` link from the configured WhatsApp number. | VERIFIED as a published contact route. Delivery/read receipts, business-hours coverage, backup access, and retention controls are not established. |
| Customer relationship workspace | `src/components/studio-customers-workspace.tsx` is a restaurant-side customer/guest workspace with guest profiles, loyalty, feedback, and campaign drafts. | VERIFIED as a restaurant customer-data surface; it is NOT a Menuun platform support-ticket queue or support CRM. |
| Platform Admin users/subscriptions | `src/routes/admin/users.tsx` manages platform users, subscriptions, invoices, account state, and related audit views. | VERIFIED as administration capability; no customer support ticket lifecycle or support case assignment is established. |
| Historical customer request tables/flows | `migrations/20260910010000_platform_customer_requests.sql` created a legacy request table. `migrations/20260917160000_retire_legacy_customer_request_flows.sql` explicitly retires old request/approval flows and deletes legacy request records. | Historical schema evidence only. Do not describe the retired flow as active support intake. |
| Ticketing / support CRM / automated intake | No current active implementation was established in the inspected routes, components, migrations, or F5 SOPs. | UNKNOWN / NOT ESTABLISHED. |
| SLA / 24×7 support / on-call coverage | No approved service commitment or staffed rota was found in current F5 documentation. | UNKNOWN / NOT ESTABLISHED. Never promise response or restoration deadlines. |
| Status page / automated email, SMS, or WhatsApp notifications | F5.5 explicitly says these are not established. | NOT ESTABLISHED. |

The current public contact values are configuration details, not a reason to copy the email address or phone number into this SOP, GitHub issues, or public incident records. Re-read the current footer before using either route; the presence of a link does not prove delivery or active monitoring.

## 4. Intake procedure — PROPOSED manual operation

When a report arrives through a verified public channel:

1. Acknowledge receipt without promising a response or resolution deadline.
2. Establish whether the sender is a restaurant owner, authorized staff member, guest, prospect, or unknown reporter. Verify identity through an appropriate existing account/contact context before disclosing tenant-specific information.
3. Capture only the minimum facts needed to understand and investigate the report.
4. Separate the reporter's observations from facts independently verified by the operator.
5. Assign a temporary internal reference in the private register, if one is maintained. Do not call it a product-generated ticket number.
6. Classify severity using Section 5. If impact or scope is unclear, mark **UNABLE TO ASSESS** and investigate safely; do not automatically classify uncertainty as low severity.
7. Assign the Platform Owner/operator as accountable owner. No backup responder is currently established.
8. Record the next action and update commitment only if the owner can reasonably meet it.
9. Link relevant evidence using restricted references; do not copy raw secrets, tokens, or customer data into GitHub.
10. Close only after the closure criteria in Section 9 are met.

### Minimum manual intake fields — PROPOSED

- Internal reference and received timestamp (UTC; Riyadh local time may be added for customer communication).
- Intake channel (email / WhatsApp / other verified route) and reporter category.
- Customer/tenant reference only when necessary; prefer an internal opaque identifier over a business name in operational notes.
- Affected product area, route, feature, and environment (production / preview / unknown).
- User-visible symptom, first observed time, recurrence, and reproducibility.
- Expected versus actual behavior.
- Scope estimate and evidence basis; explicitly mark unverified counts.
- Severity, confidence, status, accountable owner, next action, and next update time if committed.
- Restricted evidence references, relevant deployment/commit identifier, and redaction status.
- Resolution, verification evidence, customer update, and closure timestamp.

Do not collect passwords, OTPs, session cookies, access tokens, API keys, full payment-card data, full connection strings, raw QR secrets, identity documents, or unrelated personal data.

## 5. Severity and urgency — PROPOSED internal triage model

The following P1–P4 levels are a proposed internal prioritization vocabulary for a sole-owner operation. They are **not** a contractual SLA, a product feature, a CISA/NIST severity scale, or a promise of staffed response.

| Level | Working definition | Examples (illustrative, not exhaustive) | Initial handling |
|---|---|---|---|
| **P1 — Critical** | Credible active security compromise, cross-tenant data exposure, widespread production outage, or material risk to customer data/service integrity. | Suspected unauthorized access across tenants; confirmed sensitive data exposure; broad inability to access core menus/orders. | Stop routine work. Preserve evidence, assess containment with F4 runbook, avoid destructive changes, and consider qualified security/legal escalation. Customer communication follows F5.5 and verified scope. |
| **P2 — High** | Major customer-facing capability impaired for one or more customers, or a credible security/data-integrity concern whose scope is not yet known. | A restaurant cannot publish or receive orders; suspected tenant-specific unauthorized access; repeated order loss/duplication signal. | Prioritize investigation after P1; determine scope, workaround, and whether incident process applies. |
| **P3 — Normal** | Limited functional defect with a viable workaround and no current evidence of security or data-integrity impact. | Isolated Studio control malfunction; non-critical menu display defect affecting a narrow flow. | Record, reproduce safely, assess affected version and workaround, then schedule corrective work. |
| **P4 — Low / Request** | General question, usage guidance, feature request, cosmetic suggestion, or issue with no demonstrated service impairment. | How-to question; enhancement request; minor wording preference. | Acknowledge and record the request; no delivery commitment without separate prioritization. |

### Impact and urgency assessment

Assess each report against:
- **Functional impact:** which core customer activity is blocked or degraded?
- **Information impact:** is data exposed, altered, lost, duplicated, or unavailable?
- **Scope:** one user, one tenant, multiple tenants, or unknown?
- **Recoverability:** is a safe workaround available and verified?
- **Time sensitivity:** is the issue active, recurring, escalating, or contained?
- **Confidence:** confirmed, suspected, or unable to assess?

Severity may be raised as evidence changes. Do not lower severity solely because a reporter is unresponsive or because a workaround exists if security/data-integrity risk remains. When unsure between two levels, use the higher provisional level until impact is clarified. Record the rationale and timestamp.

## 6. Ownership, escalation, and status

| Responsibility | Accountable party | Rule |
|---|---|---|
| Intake and triage | Platform Owner/operator | Reviews verified channels when available; monitoring frequency is UNKNOWN and no response-time promise is made. |
| Case owner / investigation coordinator | Platform Owner/operator | One accountable owner per report; records decisions and next action. |
| Technical investigation | Platform Owner/operator using repository/platform evidence | Use least-privilege, read-only inspection first; follow F4 incident runbook for incidents. |
| Customer-facing communication | Platform Owner/operator | Send only fact-checked updates through a verified channel, following F5.5. |
| Security/legal specialist | Qualified external professional when needed | Availability and engagement arrangements are UNKNOWN; do not imply an established retainer. |

Suggested internal states (**PROPOSED**): `NEW` → `TRIAGED` → `INVESTIGATING` → `WAITING_ON_REPORTER` / `MITIGATING` → `RESOLVED_PENDING_VERIFICATION` → `CLOSED`. A report may be marked `DUPLICATE` or `NOT_REPRODUCED` with evidence and rationale. These are manual register labels, not application states.

Escalate immediately to the F4 incident process when there is credible security compromise, cross-tenant exposure, material data loss/corruption, broad production outage, or unexplained privileged activity. For legal/regulatory notification questions, preserve facts and consult qualified counsel; this SOP does not set legal deadlines.

## 7. Evidence capture and privacy safeguards

### Evidence record — PROPOSED

For each material issue, preserve:
- Detection/receipt timestamp and timezone.
- Reporter-described symptom, clearly distinguished from operator observations.
- Environment, affected feature/route, application version, deployment ID/SHA when known.
- Relevant request/correlation identifier, sanitized error code, and narrow time window.
- Reproduction steps using synthetic or owner-controlled test data where possible.
- Expected/actual result, impact assessment, confidence, severity rationale.
- Actions taken, approvals, outcomes, and the operator who performed them.
- Evidence location, access restrictions, integrity/retention handling where appropriate.
- Customer update versions and closure verification.

### Privacy and security rules

- Collect the minimum information needed; avoid copying customer content or personal data when a reference is sufficient.
- Redact email addresses, phone numbers, names, tokens, cookies, authorization headers, QR secrets, IP addresses where not needed, and other identifiers before sharing evidence.
- Never place credentials, tokens, unredacted logs, customer screenshots, or tenant-specific private data in public GitHub issues, PRs, commits, or repository documentation.
- Do not ask a customer to send passwords, OTPs, API keys, or payment credentials.
- Use restricted, access-controlled storage for any private evidence register. Its actual storage location, access controls, retention period, and backup are **UNKNOWN** until selected and verified.
- Preserve original evidence when an incident may require investigation; work from a sanitized copy for sharing. Do not alter/delete relevant logs or records to make an issue appear resolved.
- Avoid destructive tests or production experiments. Reproduce in isolated test data/environments where possible.
- Do not disclose one tenant's information to another tenant or confirm another customer's presence/impact.

## 8. Relationship to existing operations

- **F4:** technical incident detection, impact assessment, containment, recovery, and incident records remain governed by `docs/operations/F4_RELEASE_MONITORING_INCIDENT_OPERATIONS.md` and `docs/operations/PRODUCTION_SAFE_OPERATIONS.md`. F5.6 is not a replacement incident runbook.
- **F5.2:** onboarding support handoff and owner accountability remain governed by `docs/operations/F5_OWNER_LED_CUSTOMER_ONBOARDING_SOP.md`.
- **F5.5:** customer maintenance/incident notices and bilingual templates remain governed by `docs/operations/F5_CUSTOMER_COMMUNICATIONS_MAINTENANCE_AND_INCIDENT_SOP.md`. F5.6 defines intake/triage; F5.5 defines outward communication.
- **Platform Admin:** user/subscription/invoice administration is not a support case system. Do not turn admin notes or subscription audit rows into an undocumented ticket queue.
- **Historical customer request migrations:** the retired legacy request flow is not active support intake.

## 9. Resolution and closure criteria

A report may be closed only when:
1. The issue is resolved, answered, declined, or otherwise dispositioned with a recorded rationale.
2. The reporter/customer has received an appropriate update when a response is warranted and a verified contact route is available.
3. The relevant user journey or technical behavior has been rechecked using suitable evidence; a deployment marked READY alone is not proof of recovery.
4. Any remaining limitation, workaround, or follow-up is documented.
5. Security/data-impact uncertainty has been explicitly recorded and escalated rather than silently treated as resolved.
6. Evidence is stored in the approved restricted location with unnecessary sensitive data removed.
7. Any product defect is transferred to the engineering backlog without embedding customer secrets or personal data.
8. The closure timestamp, outcome, and accountable owner are recorded.

If the reporter cannot be reached, record the attempted channel and outcome; do not claim customer confirmation.

## 10. Bilingual intake and response templates

Templates are reusable starting points. Replace bracketed fields only with verified information; remove any unsupported sentence.

### 10.1 Intake acknowledgement — Arabic

> شكرًا لتواصلك مع Menuun. استلمنا بلاغك بشأن [وصف مختصر]. سنراجع المعلومات المتاحة ونحدد الخطوة المناسبة. لا يمثل هذا الرد تأكيدًا لسبب المشكلة أو موعدًا محددًا للحل. إذا أمكن، أرسل وصفًا للخطوات التي أدت إلى المشكلة ووقت حدوثها، مع تجنب إرسال كلمات المرور أو رموز التحقق أو مفاتيح الوصول أو بيانات الدفع.

### 10.2 Intake acknowledgement — English

> Thank you for contacting Menuun. We have received your report about [brief description]. We will review the available information and determine the appropriate next step. This acknowledgement does not confirm the root cause or promise a resolution time. If possible, share the steps that led to the issue and when it occurred. Do not send passwords, verification codes, access keys, or payment credentials.

### 10.3 Request for safe evidence — Arabic

> لمساعدتنا في التحقق، يرجى تزويدنا بوقت حدوث المشكلة، والخطوات التي سبقتها، واسم الصفحة أو الميزة المتأثرة، ورسالة الخطأ بعد إخفاء أي بيانات شخصية أو رموز وصول. لا ترسل كلمة المرور أو رمز OTP أو ملفات تحتوي على مفاتيح سرية أو بيانات دفع.

### 10.4 Request for safe evidence — English

> To help us investigate, please provide the time of the issue, the steps immediately before it, the affected page or feature, and the error message after removing personal details and access tokens. Do not send passwords, OTPs, secret keys, or payment data.

### 10.5 Status update — Arabic

> تحديث بشأن بلاغك [المرجع الداخلي إن وجد]: ما تحققنا منه حتى الآن هو [حقائق مؤكدة]. ما زال قيد التحقق هو [نقاط غير محسومة]. الإجراء الحالي هو [إجراء مؤكد]. لا يوجد حتى الآن موعد مؤكد للحل؛ سنشارك تحديثًا عند توفر معلومة مهمة تم التحقق منها.

### 10.6 Status update — English

> Update on your report [internal reference, if applicable]: we have verified [confirmed facts]. The following remains under investigation: [unknowns]. The current action is [verified action]. There is no confirmed resolution time at this stage; we will share a further update when material information has been verified.

### 10.7 Resolution update — Arabic

> تم التحقق من معالجة [المشكلة/الميزة] بتاريخ [التاريخ والوقت والمنطقة الزمنية] من خلال [اختبار أو دليل مختصر]. الأثر المتبقي، إن وجد: [التفاصيل]. يرجى إبلاغنا إذا استمرت المشكلة عبر قناة التواصل المنشورة.

### 10.8 Resolution update — English

> We verified the resolution of [issue/feature] at [date, time, and timezone] using [brief test or evidence]. Any remaining impact is: [details]. If the issue continues, please contact us through the published contact channel.

## 11. Acceptance criteria and explicit limitations

F5.6 is complete only when:
1. Current contact channels and their limits are grounded in current source.
2. Retired request flows and unrelated customer/admin workspaces are not misrepresented as ticketing.
3. A manual intake record and minimum-data fields are defined as proposed practice.
4. Severity/urgency levels are explicitly proposed internal triage, not SLA or product capability.
5. One human accountable owner and unknown backup coverage are explicit.
6. Evidence capture, redaction, privacy, access, and retention unknowns are documented.
7. Escalation integrates with F4; outward communication integrates with F5.5.
8. Arabic and English templates are available without unsupported commitments.
9. F3 and F5.3 gates remain unchanged.
10. No customer, production, database, migration, or deployment operation occurs.
11. Continuity, diff review, and exact-head CI evidence are recorded.

## 12. Research and repository references

### Repository evidence

- `src/components/marketing-footer.tsx` — published email and WhatsApp links; values intentionally not reproduced here.
- `src/components/studio-customers-workspace.tsx` — restaurant-side guest/customer workspace; not a Menuun support CRM.
- `src/routes/admin/users.tsx` — Platform Admin user/subscription/invoice management; no support case lifecycle established.
- `migrations/20260910010000_platform_customer_requests.sql` — historical customer request table.
- `migrations/20260917160000_retire_legacy_customer_request_flows.sql` — explicitly retires legacy customer request/approval flows.
- `docs/operations/F5_SALES_TO_ACTIVATION_JOURNEY.md` — actual contact and self-service boundaries.
- `docs/operations/F5_OWNER_LED_CUSTOMER_ONBOARDING_SOP.md` — owner-led handoff, privacy and escalation.
- `docs/operations/F5_CUSTOMER_COMMUNICATIONS_MAINTENANCE_AND_INCIDENT_SOP.md` — customer-facing incident/maintenance communication.
- `docs/operations/F4_RELEASE_MONITORING_INCIDENT_OPERATIONS.md` and `docs/operations/PRODUCTION_SAFE_OPERATIONS.md` — incident response and safe operational handling.

### External primary guidance

- NIST, **SP 800-61 Rev. 3 — Incident Response Recommendations and Considerations for Cybersecurity Risk Management** (final, 2025-04-03): https://csrc.nist.gov/pubs/sp/800/61/r3/final. Used for lifecycle integration, analysis, prioritization, tracking, response, recovery, and lessons learned.
- CISA, **National Cyber Incident Scoring System (NCISS)**: https://www.cisa.gov/topics/cyber-threats-and-response/incident-response/cisa-national-cyber-incident-scoring-system-nciss. Used only as context that severity depends on impact dimensions and entity context; Menuun's proposed P1–P4 model is not CISA's scoring system.
- CISA, **Federal Incident Notification Guidelines**: https://www.cisa.gov/federal-incident-notification-guidelines. Used for evidence-field inspiration (functional impact, information impact, recoverability, detection time, scope, and contact point); its federal reporting requirements do not apply automatically to Menuun.

**Execution boundary:** documentation-only. No customer contact, live case, production inspection, database operation, migration, application change, billing/account action, deployment, or external customer-data write was performed.
