# Menu V3 — Self-Serve Customer Lifecycle Plan

Status: ACTIVE PLAN
Last continuity recovery: 2026-09-17

## Operating rule

Only one PH milestone may be `IN_PROGRESS` at a time. Completed work is preserved; later phases must not be started automatically.

## Lifecycle

`ابدأ مجانًا` → Account Registration → Workspace Setup/Provisioning → Studio → Plan/Trial lifecycle → Platform Admin control → Invoice/WhatsApp.

New self-serve registration does not use the retired `self_serve_registration_grants` path. Workspace provisioning is server-authoritative and tenant-isolated.

## Phase map

### PH-01 — Self-Serve Registration → Workspace → Studio

- PH-01.1 Entry Surface Audit — DONE / VERIFIED
- PH-01.2 Registration Contract — DONE / VERIFIED / PR #159 merged
- PH-01.3 Secure Workspace Provisioning — DONE / VERIFIED / PR #160 merged
- PH-01.4 Existing Customer Login — IMPLEMENTED, PR #161 currently open with a browser-selector CI failure requiring final gate review
- PH-01.5 Studio Setup Guidance — RECORDED AS COMPLETED IN PRIOR CONTINUITY
- PH-01.6 New Customer Platform Admin Visibility — RECORDED AS COMPLETED IN PRIOR CONTINUITY
- PH-01.7 Remove/Bypass Legacy Approval Dependency Safely — RECORDED AS COMPLETED IN PRIOR CONTINUITY
- PH-01.8 Verification Gate — RECORDED AS COMPLETED IN PRIOR CONTINUITY

The PR #161 verification exception is preserved explicitly and must not be hidden by this recovery record.

### PH-02 — Customer Lifecycle Visibility in Platform Admin

RECORDED AS COMPLETED IN PRIOR CONTINUITY. Existing repository evidence includes Platform Admin customer/account surfaces and guarded account operations.

### PH-03 — Subscription Plans + Paid 14-Day Trial

RECORDED AS COMPLETED IN PRIOR CONTINUITY.

The current repository also contains the subscription foundation (`subscription_plans`, `tenant_subscriptions`, server-side entitlement checks, and commercial UX). Current `main` remains the code source of truth for the actual configured catalog; historical conversation pricing must not be treated as current code unless verified.

Historical product decision recorded in the lifecycle plan:
- Free: no trial.
- Paid plans: 14-day trial after paid-plan selection.
- Annual discount: deferred to PH-03 commercial/billing decision where applicable.
- Invoice + WhatsApp: PH-05.

### PH-04 — Platform Admin Subscription & Account Control

STATUS: DONE / VERIFIED / MERGED

Merged PR: #163
Merge commit: `f98f1f6efdf6feac200eeb679fb947dd030d39a5`

Scope completed:

1. **PH-04.1 — Plan Control**
   - Platform Owner can change an active tenant subscription plan.
   - Server validates the requested active plan and current resource usage before allowing a downgrade.
   - Client input never grants entitlement.

2. **PH-04.2 — Trial Control**
   - Extend a paid-plan trial to a validated future timestamp.
   - End a paid-plan trial safely.
   - Free plan cannot be placed into trialing state.

3. **PH-04.3 — Account Freeze / Unfreeze**
   - Platform Owner can freeze/unfreeze a customer account.
   - Freezing revokes current sessions.
   - Platform Owner accounts cannot be frozen by this path.

4. **PH-04.4 — Subscription Status Control**
   - Controlled states: `trialing`, `active`, `past_due`, `cancelled`, `suspended`.
   - Trialing requires a paid plan and a future trial end.

5. **PH-04.5 — Audit Log**
   - Every PH-04 mutation records admin user, target user/tenant, action, reason, before state, after state, and timestamp.
   - Audit data is RLS-enabled and direct client access is revoked.

6. **PH-04.6 — Verification Gate**
   - Typecheck, tests, lint, build, route generation, migration-related coverage, and browser QA passed in Quality Run `35179073375`.
   - W9 Orders QA passed in run `35179073395`.
   - A focused serializability defect found by CI was corrected before merge.
   - No production deployment is part of PH-04 implementation.

### PH-05 — Invoice Generation + WhatsApp Sharing

STATUS: IN_PROGRESS

Scope activated by owner authorization on 2026-09-17.

#### PH-05.1 — Invoice ledger and immutable subscription snapshot
- Add tenant-scoped invoice records with server-generated invoice numbers.
- Snapshot plan code/name, SAR amount, and billing period at issuance so later plan changes do not rewrite historical invoices.
- Keep invoice status limited to `issued` / `void`.
- Do not infer or record payment completion without a verified payment provider.

#### PH-05.2 — Owner billing workspace
- Add `/studio/billing` for owner/admin roles.
- Read the current subscription and tenant-owned invoice history through server-authorized membership context.
- Issue an invoice only for a paid `active` or `past_due` subscription.
- Free, trialing, cancelled, and suspended states do not create invoices through this path.

#### PH-05.3 — Printable invoice and WhatsApp click-to-chat
- Provide an on-screen invoice document with browser print support.
- Provide owner-reviewed WhatsApp click-to-chat using `https://wa.me/?text=` only.
- Message explicitly states that the invoice is issued and is not proof of payment or electronic collection.
- No autonomous outbound messaging and no WhatsApp Business API dependency are introduced.

#### PH-05.4 — Verification gate
- Add focused invoice/WhatsApp contract tests.
- Run route generation, typecheck, full tests, lint, production build, migration/schema checks, auth/security checks, and relevant browser QA.
- Keep Vercel outside the development loop; deployment is a separate release-stage concern.

## Security boundaries

- Customer billing reads and mutations require authenticated server context plus an active owner/admin tenant membership.
- Tenant identity is resolved server-side; the billing client never supplies a tenant id.
- Plan, price, invoice amount, and subscription state are read from server-side database records.
- Historical invoices store a server-generated snapshot and cannot be rewritten through the customer UI.
- Invoice data has RLS enabled and no direct client grants/policies are added.
- No payment gateway, automatic charging, webhook-driven payment state, or payment-success claim is introduced in PH-05.

## Release boundary

LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER/VISUAL QA → TESTS → CI QUALITY GATES → DIFF REVIEW → ONE RELEASE BATCH → MAIN → ONE PRODUCTION DEPLOYMENT → REAL-DEVICE QA.

Vercel must not be used as the normal PH-05 development loop. If its free-tier deployment quota remains blocked, PH-05 implementation and GitHub verification continue without deployment retries.

## Current deployment note

PH-04 was merged to `main`, but production deployment is **NOT VERIFIED**. The earlier Vercel deployment attempt on PR #163 was blocked by the free-tier deployment rate limit (`api-deployments-free-per-day`). PH-05 does not require a Vercel deployment to continue implementation or CI verification.
