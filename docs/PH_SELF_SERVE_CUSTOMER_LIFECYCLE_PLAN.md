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

STATUS: IN_PROGRESS

Scope:

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
   - Typecheck, tests, lint, build, auth/security checks, migration checks, browser QA, and final diff review.
   - No production deployment is part of PH-04 implementation.

### PH-05 — Invoice Generation + WhatsApp Sharing

TODO. Do not start automatically after PH-04.

## Security boundaries

- Platform Admin mutations require authenticated server context plus Platform Owner authorization.
- Tenant/account identity is resolved server-side.
- Subscription limits remain enforced by the database/application authorization boundary.
- No client-supplied plan, tenant, user, role, entitlement, or price is trusted.
- No payment gateway is invented in PH-04.
- PH-05 invoice/WhatsApp delivery is outside this milestone.

## Release boundary

LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER/VISUAL QA → TESTS → CI QUALITY GATES → DIFF REVIEW → ONE RELEASE BATCH → MAIN → ONE PRODUCTION DEPLOYMENT → REAL-DEVICE QA.

PH-04 must stop after its verification gate. No PH-05 work is started automatically.
