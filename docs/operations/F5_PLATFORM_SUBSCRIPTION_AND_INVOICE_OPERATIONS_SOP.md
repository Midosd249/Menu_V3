# F5.4 — Platform Subscription, Account & Invoice Operations

**Status:** IMPLEMENTED ON BRANCH — PENDING REVIEW AND CI  
**Date:** 2026-11-03  
**Scope:** Evidence-backed operating procedure for existing Platform Owner controls. Documentation only; no subscription, account, invoice, customer, database, or production operation was executed.  
**Repository baseline:** `main` immediately before this branch was created; last independently verified merge checkpoint: `216810951925b338e63da0b3415a9ba15f022551` (PR #420).  
**Owner model:** one human Platform Owner/operator. This procedure does not imply a billing team, automated payment collection, or customer-success staff.

## 1. Purpose and hard boundaries

Document the actual controls available to the Platform Owner for:
- assigning a subscription plan;
- selecting monthly or annual billing interval;
- extending or ending a trial;
- changing subscription status;
- freezing or unfreezing a customer owner account;
- issuing and reviewing a platform subscription invoice;
- reviewing administrative before/after audit records.

This procedure documents controls already present in the repository. It does not add product functionality or authorize real customer operations.

### Mandatory gates

- **F3 — Backup, Restore & Disaster Recovery:** DEFERRED BY OWNER — NOT DONE. This remains a mandatory gate before onboarding the first real customer, accepting customer-owned data, or commercial launch. Do not use this SOP to bypass that gate.
- **F5.3 — Tenant/Branch Creation and Ownership Verification:** DEFERRED BY OWNER — OPEN RISK. Read-only discovery identified a potential cross-tenant side-effect path in `src/lib/menu/owner.ts` `saveBranch`. Runtime exploitability is not established. This task is not closed, and this deferral is not a security acceptance or remediation. Do not perform branch ownership changes or treat branch controls as verified safe on the strength of this SOP.
- No real customer data, production mutation, database migration, subscription change, account freeze, invoice issuance, or deployment was used to prepare this document.

## 2. Evidence-backed capability inventory

| Capability | Current implementation evidence | Verified boundary |
|---|---|---|
| Subscription search and summary | `src/lib/menu/platform-subscriptions.ts`, `getPlatformSubscriptions`; `src/routes/admin/users.tsx` | Platform Owner-only server function; searches tenant name, slug, owner name/email; returns plan, status, usage, trial dates and account freeze state. |
| Plan assignment | `changePlatformSubscriptionPlan` | Active plan required; current branch/product/team usage must fit the target plan; transaction locks subscription row and writes before/after audit in the same transaction. |
| Billing interval | `setPlatformBillingInterval` | Monthly/annual only; Free cannot be annual; transaction and audit record. |
| Trial | `managePlatformTrial` | Free cannot have a trial; extension requires a future ISO datetime; ending a trial sets status to `past_due` and trial end to now. |
| Subscription status | `setPlatformSubscriptionStatus` | Allowed values: `active`, `trialing`, `past_due`, `cancelled`, `suspended`; trialing requires a non-Free plan and a future trial end. |
| Owner account freeze | `setPlatformAccountFrozen` | Separate from subscription status; prevents freezing the current Platform Owner or another Platform Owner; freezes the user and deletes existing sessions; state change and audit are transactional. |
| Invoice issue/list | `src/lib/menu/platform-billing.ts`, `issuePlatformInvoice`, `getPlatformInvoices` | Platform Owner-only; validates amount/date range and active plan; creates an `issued` invoice with a sequential number and creator identity. |
| Subscription audit | `getPlatformSubscriptionAudit` | Platform Owner-only; returns the latest 100 records for a tenant, including action, reason, before/after state and timestamp. |

The administrative subscription functions use `authMiddleware` plus `requirePlatformAdmin`; client-supplied tenant/user identifiers are selectors, not proof of permission. The server performs the Platform Owner check.

## 3. Current commercial catalog

The canonical display catalog is `src/lib/menu/commercial-catalog.ts`; the server/database entitlement boundary remains authoritative.

| Plan code | Display name | Monthly SAR | Annual SAR | Branches | Products | Team members |
|---|---|---:|---:|---:|---:|---:|
| `free` | Free / مجاني | 0 | 0 | 1 | 20 | 2 |
| `starter` | Growth / نمو | 49 | 490 | 3 | 300 | 10 |
| `pro` | Pro / احترافي | 149 | 1490 | 10 | Unlimited | 25 |

Do not quote a plan feature, entitlement, discount, tax treatment, or commercial promise that is not present in the current catalog and applicable server enforcement. Pro's unlimited-product behavior is explicitly preserved in the entitlement implementation; it does not mean unlimited branches or team members.

## 4. Standard operating procedure

### Stage A — Locate and verify the target workspace

1. Open the Platform Admin users/subscriptions surface at `/admin/users`.
2. Search by the restaurant/workspace name, slug, or owner identity.
3. Verify the exact workspace name, slug, owner name/email and tenant record before taking any action.
4. Review the current plan, status, billing interval, trial end, branch/product/team counts and account-frozen state.
5. Stop if the target is ambiguous, the owner/workspace relationship is uncertain, or the subscription record is missing. Do not guess a tenant ID or use a customer-provided ID as authorization.

**Exit gate:** the intended workspace and owner are unambiguously identified from the server-returned Platform Admin record.

### Stage B — Assign or change the plan

1. Confirm the target plan code is one of the currently active catalog plans.
2. Compare current usage against the target plan limits before changing the plan.
3. Do not downgrade when current branch, product or team-member usage exceeds the target limits. The server rejects this with a conflict response.
4. Select the target plan in the Platform Admin subscription control and review the returned updated summary.
5. Confirm the resulting plan, status, trial date and billing interval.

Implementation behavior:
- The server locks the tenant subscription row inside `sql.transaction`.
- It validates the target plan is active and checks existing usage against its limits.
- A Free plan change sets status to `active`, clears the trial end and resets interval to monthly.
- A non-Free plan change preserves an existing `trialing` status; otherwise it sets status to `active`.
- The state change and `plan_changed` before/after audit event are committed together.

**Stop:** if the current subscription row is unavailable, the plan is inactive, or usage exceeds the target limits. Do not delete data or branches to force a downgrade.

### Stage C — Set the billing interval

1. Confirm the selected plan and the intended billing interval.
2. Choose `monthly` or `annual`.
3. Do not select annual for Free; the server rejects that combination.
4. Confirm the updated summary and the `billing_interval_changed` audit event.

The interval control changes subscription metadata. It does not collect money, charge a payment method, or prove payment.

### Stage D — Extend or end a trial

**Extend**
1. Confirm the workspace is on a non-Free plan.
2. Obtain the approved new end date from the owner/operator decision record.
3. Enter a valid ISO datetime strictly in the future.
4. Confirm the returned `trialEndsAt` and `trialing` status.

**End**
1. Confirm the decision and reason.
2. Use the explicit end-trial action.
3. Verify the returned status is `past_due` and the trial end is set to the current time.

Important distinctions:
- Free cannot have a trial.
- The UI accepts an ISO datetime for extension; do not enter an ambiguous locale-formatted date.
- Ending a trial is not the same as setting `cancelled` or `suspended`.
- Trial expiry is also enforced at the database entitlement boundary: an expired trial (including a missing end timestamp) is reverted to active Free before the guarded resource write is evaluated against Free limits. If the active Free plan is unavailable, the write fails closed.
- Do not manually edit subscription rows or bypass the server control.

### Stage E — Change subscription status

Allowed statuses are:
- `active`
- `trialing`
- `past_due`
- `cancelled`
- `suspended`

Before changing status:
1. Confirm the reason and intended operational effect.
2. If selecting `trialing`, verify the plan is not Free and the existing trial end is in the future. The server rejects invalid trial activation.
3. Apply the status change and confirm the returned summary.
4. Review the `subscription_status_changed` audit record.

Do not treat `cancelled`, `suspended`, or `past_due` as interchangeable. The code exposes distinct persisted states; a complete customer-facing policy for each status is not established by this document.

### Stage F — Freeze or unfreeze the owner account

Account freeze is separate from subscription status.

1. Confirm the exact owner account associated with the intended workspace.
2. Record the operational reason and obtain the required owner decision.
3. Use the subscription panel's Platform Owner account freeze control.
4. Confirm the warning that current sessions will be revoked.
5. Verify the returned account-frozen state and the `account_frozen` or `account_unfrozen` audit entry.

Verified behavior of `setPlatformAccountFrozen`:
- Requires Platform Owner authorization.
- Refuses to freeze the current Platform Owner or another Platform Owner.
- Updates the user's `banned` state and reason.
- Deletes the target user's existing sessions when freezing.
- Writes the account state change and audit event in one transaction.

Do not confuse this with the separate generic account-list `setPlatformUserBan` path. The latter is a distinct handler and is not the audited subscription-panel workflow described above. Freezing an account does not itself change the subscription plan or subscription status.

### Stage G — Issue and review an invoice

1. Confirm the target workspace and owner again.
2. Select an active plan for the invoice.
3. Verify the amount in SAR and the billing period dates against the approved commercial agreement.
4. Ensure the end date is later than the start date.
5. Add only necessary notes; do not include passwords, tokens, payment-card data or unnecessary personal information.
6. Issue the invoice and record the generated invoice number.
7. Review the invoice details before printing or sharing it.
8. If using WhatsApp, review the generated message and recipient context before sending it manually.

Verified invoice behavior:
- The server requires Platform Owner authorization.
- Amount must be finite, between SAR 0 and SAR 1,000,000.
- Period start/end must be valid dates and end must be after start.
- The selected plan must be active.
- Invoice numbers use the database sequence and an `INV-YYYYMM-######` pattern.
- The invoice record stores tenant, plan snapshot, amount, currency, interval, period, status, issue time, creator and notes.
- Invoice status is created as `issued`.
- The invoice is retrievable through the Platform Owner invoice list.

**Critical financial boundary:** issuing an invoice is not payment collection, settlement, reconciliation, or proof that the customer paid. The invoice/WhatsApp copy explicitly says it is not proof of payment or electronic collection. The repository migration states that no payment provider, automatic charge, webhook, or payment-status logic is introduced. Do not mark a customer as paid based only on an issued invoice or a WhatsApp message.

No invoice cancellation/void operating procedure is established by the inspected Platform Owner invoice endpoints. Do not invent a void action or manually mutate invoice rows; escalate any correction requirement for a separately verified task.

### Stage H — Review the audit trail and close the operator record

For plan, billing interval, trial, subscription status and subscription-panel account freeze changes:
1. Open the tenant's administrative audit view.
2. Review the action, actor, target, tenant, reason, before state, after state and timestamp.
3. Confirm the audit record matches the intended action.
4. If the state changed but the corresponding audit record is absent or inconsistent, stop further changes and escalate. The transaction is intended to keep the mutation and audit insert atomic.
5. Keep any owner-side operational record minimal and access-restricted.

The audit table `platform_admin_subscription_audit` is created with RLS enabled and direct privileges revoked from `anon` and `authenticated`. The server-side Platform Owner endpoint is the intended read path. The audit record is distinct from an invoice record: invoice creator/timestamp fields do not replace the before/after administrative audit.

Invoice records currently expose issuer identity and issue metadata; do not claim they are part of the subscription before/after audit stream.

## 5. Operator record — minimum fields

**PROPOSED** private record:
- Workspace reference and verified owner contact.
- Action type and date.
- Before/after plan, interval, trial or status values as applicable.
- Approved reason/decision reference.
- Invoice number, amount, currency and covered period, if issued.
- Audit record confirmation.
- Outstanding question, owner and next action.

Do not store credentials, session tokens, payment-card data, or unnecessary personal information. Do not store customer-specific personal data in GitHub issues, PRs, commits or repository documentation.

## 6. Stop and escalation conditions

Stop the operation when:
- Workspace/owner identity is ambiguous.
- The subscription row or active plan is unavailable.
- Current usage exceeds a proposed downgrade's limits.
- A Free plan is being given an annual interval or trial.
- A trial extension date is missing, invalid or not in the future.
- A status transition violates the server's trial validation.
- The target account is a Platform Owner or the current operator.
- Invoice amount or billing dates conflict with the approved agreement.
- Invoice issuance is being represented as payment received.
- The expected audit record is absent or does not match the action.
- Any unexpected cross-tenant, branch-ownership or authorization behavior is observed.

Never bypass server authorization, directly edit production rows, run a migration, or use a different administrative endpoint to force the requested outcome.

## 7. Acceptance criteria

F5.4 is complete only when:
1. Every documented control maps to current code, UI and/or a registered test.
2. Plan limits, billing interval, trial rules and status values match the current implementation.
3. Subscription mutation/audit atomicity is accurately described.
4. Account freeze is distinguished from subscription status and from the separate generic account-ban handler.
5. Invoice issuance is explicitly distinguished from payment collection and payment confirmation.
6. Unsupported invoice cancellation, payment processing, automated collection, tax compliance and reconciliation are not promised.
7. F3 remains a mandatory pre-commercial gate.
8. F5.3 remains explicitly deferred as an open risk, not silently marked resolved.
9. No real customer data, production mutation, migration, merge or deployment is used to validate the SOP.
10. Continuity records are updated and the final documentation diff is reviewed.

## 8. Repository evidence

- `src/lib/menu/commercial-catalog.ts` — current plan catalog and limits.
- `src/lib/menu/platform-subscriptions.ts` — Platform Owner subscription controls, validation, transactions and audit retrieval.
- `src/routes/admin/users.tsx` — bilingual Platform Admin UI, operator prompts, invoice form and audit display.
- `src/lib/menu/platform-billing.ts` — Platform Owner invoice issuance/listing.
- `src/lib/menu/billing-whatsapp.ts` — invoice WhatsApp text and URL generation; explicit non-payment disclaimer.
- `src/lib/menu/subscriptions.ts` — trial expiry and subscription read/limit behavior.
- `migrations/20260917120000_ph04_platform_admin_subscription_controls.sql` — subscription status constraint and server-only audit table.
- `migrations/20261022090000_enforce_trial_expiry_and_atomic_entitlement.sql` — expired-trial entitlement enforcement and audit action constraint.
- `migrations/20260925130000_platform_admin_invoice_issuance.sql` — invoice notes and sequence; no payment provider/collection logic.
- `tests/ph-04-platform-admin-subscription-controls.test.mjs` — authorization, limits, trial, freeze, audit UI and transactional audit contracts.
- `tests/self-serve-trial.test.mjs` — self-serve trial contracts.
- `package.json` — confirms PH-04 contract test is included in `npm test`.

## 9. Research and limitations

- Repository code, migrations, UI and tests are the primary evidence for Menuun capabilities.
- OWASP Multi-Tenant Security Cheat Sheet was reviewed as supporting context for treating client-supplied tenant identifiers as selectors and binding authorization to verified identity/membership. It does not validate Menuun runtime behavior.
- This is a code/documentation review. No live subscription mutation, invoice issuance, customer communication, runtime browser test, local test run, database query or production check was performed for this SOP.
