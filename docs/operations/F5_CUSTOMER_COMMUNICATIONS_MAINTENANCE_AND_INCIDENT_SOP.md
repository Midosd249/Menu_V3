# F5.5 — Customer Communication for Planned Maintenance and Incidents

**Status:** IMPLEMENTED ON BRANCH — documentation-only; PR pending.  
**Date:** 2026-11-03  
**Scope:** Owner-operated, evidence-based customer communication for planned maintenance and service/security incidents.  
**Owner model:** One human Platform Owner/operator is accountable for incident decisions and customer-facing statements. Internal AI workflows are not human responders or spokespeople.

## 1. Purpose and boundaries

This procedure defines how Menuun communicates clearly and safely when planned maintenance may affect customers or when a service incident is suspected or confirmed.

It does not create a status page, notification system, ticketing system, SLA, on-call rota, CRM, mailing list, or automated incident communications. It does not establish legal or regulatory notification deadlines. Those obligations depend on the facts, affected jurisdictions, contracts, and qualified legal advice.

**Mandatory gates**
- **F3 — Backup, Restore & Disaster Recovery:** DEFERRED BY OWNER — NOT DONE. This remains a mandatory gate before the first real customer, customer-owned data, or commercial launch. This SOP does not waive it.
- **F5.3 — Tenant/Branch Creation and Ownership Verification:** DEFERRED BY OWNER — OPEN RISK. The potential `saveBranch` cross-tenant side-effect path remains unremediated and runtime exploitability is unverified. This SOP does not accept, remediate, or close that risk.
- No real customer was contacted and no live incident or maintenance event was initiated to prepare this document.

## 2. Verified communication channels and capability boundaries

| Channel/capability | Evidence | Operational status |
|---|---|---|
| Public support email | `src/components/marketing-footer.tsx` renders a `mailto:` link to the published Menuun support address; F5.1 records the same channel. | VERIFIED as a published contact channel. Delivery monitoring, mailbox access controls, and response time are not established by this source. |
| Public WhatsApp contact | `src/components/marketing-footer.tsx` renders the configured WhatsApp contact link; F5.1 records it as a manual contact path. | VERIFIED as a published contact channel. Bulk notification, delivery/read receipts, and message retention controls are not established. |
| Customer-specific contact list / CRM | No current source evidence establishes an in-product contact list or CRM. | UNKNOWN / NOT ESTABLISHED. Maintain any necessary operator contact record privately and with data minimisation. |
| Status page / incident banner / in-product broadcast | No current source evidence establishes these capabilities. | NOT ESTABLISHED. Do not promise or refer customers to them. |
| Automated email/SMS/WhatsApp notifications | No current source evidence establishes automated incident or maintenance notifications. | NOT ESTABLISHED. Communications are manually owner-operated. |
| Ticketing, case number, SLA, 24/7 on-call | F5.1 explicitly records these as not established. | NOT ESTABLISHED. Never promise guaranteed response or restoration times. |

The public contact values must be read from the current UI/source at the time of use; do not copy private contact data into public GitHub documentation or incident records. The source code is evidence that links are rendered, not proof that a message was delivered or read.

## 3. Roles and approval

| Responsibility | Accountable party | Rule |
|---|---|---|
| Incident/maintenance lead | Platform Owner/operator | Confirms scope, evidence, severity, containment decision, and whether communication is needed. |
| Customer-facing spokesperson | Platform Owner/operator | Sends only approved, fact-checked messages through verified channels. |
| Technical investigation | Platform Owner/operator using repository/platform evidence | Keeps technical evidence separate from public wording; does not speculate about root cause or impact. |
| Legal/regulatory assessment | Qualified counsel / relevant authority where required | Determines applicable notification duties; this SOP is not legal advice. |

For this owner-operated product, the same person may hold the operational roles. Do not imply that a separate communications or support team exists.

## 4. Planned maintenance procedure

### 4.1 Decide whether notice is needed

Before communicating:
1. Identify the exact service or capability affected (for example, public menus, Studio, ordering, or account access).
2. Confirm the maintenance is intentional and approved by the owner.
3. Establish the expected start and end window, expressed in **Asia/Riyadh** local time and with the date.
4. Identify affected customer segments using a verified, access-controlled source. Do not guess recipients.
5. Determine whether the work is expected to cause downtime, degraded performance, read-only behavior, or no customer-visible impact.
6. Define a safe workaround only if it has been tested or otherwise verified.
7. Decide how customers will receive a completion or delay update.

If impact, timing, or recipients cannot be established, do not send a confident blanket notice. Resolve the uncertainty or send a narrowly scoped holding message that states what is known and what remains unknown.

### 4.2 Send the notice

The notice should include:
- Clear subject/purpose: planned maintenance.
- Date and start/end time with timezone.
- Affected service(s) and expected customer-visible impact.
- Any action the customer should take, or an explicit statement that no action is required.
- A statement that the window is an estimate if completion is not guaranteed.
- The published support contact for questions.

Send only to customers reasonably believed to be affected, through an appropriate verified channel. Do not claim an automated notification or delivery receipt.

### 4.3 During and after maintenance

- If the window changes, notify affected recipients with the new expected window and the reason only when verified.
- If maintenance becomes an incident, switch to the incident procedure below.
- After completion, verify the affected critical path before saying service is restored.
- Send a completion notice with actual completion time and any remaining limitation.
- Record the notice, audience basis, timestamps, verified impact, and outcome in a private operator record.

## 5. Incident communication procedure

### 5.1 Establish the facts before wording

Use the F4 runbook and `docs/operations/PRODUCTION_SAFE_OPERATIONS.md`:
1. Record detection time in UTC and the local customer-facing time when useful.
2. Identify affected service/routes, deployment SHA, and the evidence source.
3. Distinguish a confirmed incident from a suspected issue, expected authorization denial, isolated diagnostic error, or **UNABLE TO ASSESS** result.
4. Determine the affected customer/tenant scope only from verified evidence.
5. Record what is known, what is unknown, what is not impacted (only if verified), and what action customers should take.
6. Preserve relevant evidence without copying secrets, tokens, credentials, payment data, or unnecessary personal data.
7. Decide whether immediate customer communication is warranted. For security incidents, coordinate communication with containment/investigation so the message does not expose exploit details or undermine response actions.

Do not wait for a complete root-cause analysis before issuing a useful holding statement when customers are materially affected. Equally, do not invent a cause, affected count, data exposure, restoration estimate, or assurance that no data was affected.

### 5.2 Initial customer update

Include:
- Acknowledgement that an issue is being investigated or that an incident is confirmed.
- The service/capability affected and verified impact.
- Start/detection time or the earliest confirmed time.
- Known customer action or an explicit statement that no action is currently required.
- What the operator is doing at a high level.
- The time of the next update, only if the operator can reasonably meet it; otherwise state that another update will be sent when material information is verified.

Use a timestamped update. Keep the first message short and actionable.

### 5.3 Continuing updates

- Maintain one private incident record as the internal source of truth.
- Reconcile every customer-facing statement against that record before sending.
- Timestamp each update and distinguish new facts from unchanged status.
- Explain the current impact, mitigation, workaround, and next step where verified.
- If there is no new information, do not fabricate progress; provide an update only when useful or when a previously promised update time arrives.
- Avoid public disclosure of tenant names, personal information, internal URLs, raw logs, vulnerability details, or security controls that could assist an attacker.

A public status page is not currently established. Do not imply that a status page or broadcast channel exists.

### 5.4 Resolution and follow-up

Before declaring recovery:
1. Verify the relevant critical path and affected capability.
2. Confirm the observed failure signal has cleared or is sufficiently contained.
3. Record any residual limitations and whether customer action remains necessary.
4. State the verified restoration time; do not claim all customers are unaffected unless evidence supports that conclusion.
5. Send a concise resolution update to the affected audience.
6. Create/update the material incident record under `docs/incidents/` without customer-identifying data.
7. Track prevention actions with an owner and status.

A deployment marked READY alone is not proof that the customer journey is restored.

## 6. Security and privacy safeguards

- Use only the minimum customer and contact information necessary to reach affected recipients.
- Verify recipient identity and relevance before sharing incident-specific details.
- Never request or send passwords, OTPs, session tokens, raw QR tokens, API keys, payment-card data, full connection strings, or unredacted logs.
- Do not include customer PII, tenant-specific details, private screenshots, or message transcripts in GitHub issues, PRs, commits, or public documentation.
- Do not send a broad message about a suspected data breach until the affected data, population, and approved disclosure scope have been assessed.
- For suspected compromise of an email or messaging channel, do not trust that channel to communicate sensitive incident details. Use an independently verified alternate contact method if one is available; availability of a backup channel is currently **UNKNOWN**.
- Preserve evidence and coordinate customer messaging with containment. Do not publish technical details that could expose another tenant or facilitate exploitation.
- Regulatory, contractual, and statutory notification requirements are **UNKNOWN until assessed for the specific incident**. Escalate to qualified counsel; do not derive legal deadlines from this SOP.

## 7. Message templates

Templates are starting points, not proof that an event occurred. Replace every bracketed field with verified facts. Remove any sentence that cannot be substantiated.

### 7.1 Planned maintenance — Arabic

**الموضوع: إشعار صيانة مجدولة لخدمات Menuun**

نود إشعاركم بإجراء صيانة مجدولة على [الخدمة/الميزة المتأثرة] يوم [التاريخ] من [وقت البداية] إلى [وقت النهاية] بتوقيت الرياض.

قد تتأثر [الخدمة المحددة] خلال هذه الفترة على النحو التالي: [الأثر المؤكد]. [لا يلزم منكم أي إجراء / الإجراء المطلوب: …].

سنرسل تحديثاً إذا تغيرت نافذة الصيانة، ونؤكد اكتمالها بعد التحقق من عودة الخدمة المتأثرة.

للاستفسارات: استخدموا قناة التواصل المنشورة لدى Menuun.

### 7.2 Planned maintenance — English

**Subject: Scheduled Menuun maintenance notice**

We plan to perform maintenance affecting [service/capability] on [date], from [start time] to [end time] Arabia Standard Time (Riyadh).

The expected customer impact is: [verified impact]. [No action is required / Please take this action: …].

We will share an update if the maintenance window changes and confirm completion after verifying the affected service.

For questions, use Menuun's published contact channel.

### 7.3 Incident holding update — Arabic

**الموضوع: تحديث بشأن مشكلة في [الخدمة]**

نحقق حالياً في [وصف مختصر ومحايد للمشكلة] التي قد تؤثر في [الخدمة/النطاق المتحقق منه] منذ [الوقت والتاريخ والمنطقة الزمنية].

**المؤكد حتى الآن:** [حقائق متحققة].  
**ما زال قيد التحقق:** [نقاط غير محسومة].  
**الإجراء المطلوب منكم:** [إجراء مؤكد / لا يلزم إجراء حالياً].

نعمل على التحقق والمعالجة، وسنشارك التحديث التالي [وقت محدد يمكن الالتزام به / عند توفر معلومات مؤكدة مهمة].

### 7.4 Incident holding update — English

**Subject: Update on an issue affecting [service]**

We are investigating [brief neutral description] that may affect [verified service/scope] as of [time, date, and timezone].

**Confirmed so far:** [verified facts].  
**Still being investigated:** [unknowns].  
**What you need to do:** [verified action / no action is currently required].

We are investigating and working on mitigation. The next update will be shared [at a time we can meet / when material information is verified].

### 7.5 Resolution update — Arabic

**الموضوع: تحديث — استعادة [الخدمة]**

تم التحقق من استعادة [الخدمة/الميزة المتأثرة] عند [الوقت والتاريخ والمنطقة الزمنية].  
**الأثر الذي تم التحقق منه:** [وصف موجز].  
**ما إذا كان يلزم إجراء منكم:** [الإجراء / لا يلزم إجراء].

[أي قيود متبقية أو متابعة لازمة، إن وجدت]. سنواصل متابعة المؤشرات ذات الصلة وفق الأدلة المتاحة.

### 7.6 Resolution update — English

**Subject: Resolved — [service] availability update**

We verified that [affected service/capability] was restored at [time, date, and timezone].  
**Verified impact:** [brief description].  
**Customer action:** [action / no action is required].

[Describe any remaining limitation or follow-up, if applicable.] We will continue to review the relevant signals based on the available evidence.

## 8. Private operator communication record

**PROPOSED** restricted record; do not store it in the public repository:
- Internal incident/maintenance reference.
- Detection/approval/notice/update/resolution timestamps (UTC plus Riyadh time when useful).
- Affected service and verified customer/tenant scope.
- Evidence references, deployment SHA/ID, and source/time window.
- Confirmed facts, unknowns, and explicitly ruled-out impact (only when evidenced).
- Audience selection basis and channel used.
- Exact message version sent, with personal data removed where possible.
- Customer action/workaround and next update commitment.
- Containment/recovery decision and post-recovery verification.
- Follow-up owner and due date.

Keep access limited and apply a retention/deletion practice appropriate to the operational purpose. No customer-specific record or contact list is created by this task.

## 9. Stop and escalation conditions

Stop or escalate before sending when:
- The recipient list or affected tenant scope is ambiguous.
- The incident is suspected but the proposed message states it is confirmed.
- Root cause, data impact, or restoration time is not verified but the message asserts it.
- The message contains credentials, tokens, PII, raw logs, or sensitive security detail.
- A customer is asked to perform an unsafe workaround or disclose secrets.
- The communication channel may be compromised.
- A legal, contractual, or regulatory notification question arises.
- The message would imply an SLA, status page, automated notification, or support team that is not established.
- The service is not verified restored but the message declares resolution.

## 10. Acceptance criteria

F5.5 is complete only when:
1. Every customer communication channel is mapped to current repository evidence and its limitations.
2. Planned-maintenance notice, change/delay update, and completion steps are defined.
3. Incident initial, continuing, and resolution communication steps are defined.
4. The owner/operator approval and spokesperson responsibility are explicit.
5. Confirmed facts are separated from unknowns and unverified impact.
6. Security/privacy safeguards prohibit credential, token, PII, and exploit-detail leakage.
7. Arabic and English templates are available and avoid unsupported commitments.
8. No SLA, status page, CRM, ticketing, automated broadcast, or legal deadline is invented.
9. F3 remains a mandatory pre-commercial gate and F5.3 remains an open deferred risk.
10. No real customer was contacted, no production operation was performed, and no customer data was added to the repository.
11. Continuity is updated, final diff reviewed, and applicable exact-head CI succeeds.

## 11. Repository and external references

Repository evidence:
- `src/components/marketing-footer.tsx` — current public email and WhatsApp contact links.
- `docs/operations/F5_SALES_TO_ACTIVATION_JOURNEY.md` — actual manual contact/support boundary; no CRM, ticketing, SLA, or automated customer-success handoff established.
- `docs/operations/F5_OWNER_LED_CUSTOMER_ONBOARDING_SOP.md` — support handoff, privacy-safe evidence collection, owner accountability, and escalation.
- `docs/operations/F4_RELEASE_MONITORING_INCIDENT_OPERATIONS.md` — incident detection, impact scoping, containment, recovery verification, and incident record.
- `docs/operations/PRODUCTION_SAFE_OPERATIONS.md` — canonical incident record fields and release/incident safeguards.
- `docs/FINALIZATION_ROADMAP.md` — F5.5 package definition.

External research informs communication practice, not Menuun product capabilities or legal obligations:
- CISA, FBI and international partners, **Communicating Under Pressure: Best Practices for Service Providers** (2026-09-02): https://www.cisa.gov/resources-tools/resources/communicating-under-pressure-best-practices-service-providers
- CISA guide emphasizes clear roles/approval, one source of truth, actionable customer instructions, honest disclosure of known/unknown facts, and timestamped updates. Adapted here as process guidance for a single-owner operation; no separate team or status page is implied.

**Execution boundary:** documentation-only. No customer messages, maintenance, incident response, production changes, database operations, migrations, deployment, or external writes were performed.
