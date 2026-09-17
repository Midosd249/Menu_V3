# Session — PH Lifecycle Continuity Recovery + PH-04

Date: 2026-09-17

## Request classification / workflows

- Classification: continuity recovery + milestone implementation.
- Workflows: Repository-first, Continuity, GitHub implementation, Security/Auth review, Subscription/Entitlement review, QA/Release discipline.
- Research level: Focused.
- Scope boundary: restore the PH plan/status record, preserve previous work, implement PH-04 only.

## Recovered lifecycle record

The original plan was `docs/PH_SELF_SERVE_CUSTOMER_LIFECYCLE_PLAN.md` and defined:

- PH-01 Self-Serve Registration → Workspace → Studio
  - PH-01.1 Entry Surface Audit
  - PH-01.2 Registration Contract
  - PH-01.3 Secure Workspace Provisioning
  - PH-01.4 Existing Customer Login
  - PH-01.5 Studio Setup Guidance
  - PH-01.6 New Customer Platform Admin Visibility
  - PH-01.7 Remove/Bypass Legacy Approval Dependency Safely
  - PH-01.8 Verification Gate
- PH-02 Customer Lifecycle Visibility in Platform Admin
- PH-03 Subscription Plans + Paid 14-Day Trial
- PH-04 Platform Admin Subscription & Account Control
- PH-05 Invoice Generation + WhatsApp Sharing

Prior continuity also recorded the product rules: Free has no trial; paid plans receive a 14-day trial after paid-plan selection; PH-05 owns invoice + WhatsApp; subscription/account status must remain separate.

## Evidence reconciliation

VERIFIED:
- PH-01.2 is merged in PR #159.
- PH-01.3 is merged in PR #160.
- Current main contains subscription-plan and tenant-subscription foundations.
- Current main contains Platform Admin account controls including phone verification and freeze/unfreeze.
- Current main contains commercial pricing/packaging documentation and server-side entitlement boundaries.

USER-CONFIRMED / RECOVERED:
- PH-01.5 through PH-01.8 were treated as completed in the user's prior continuity.
- PH-02 and PH-03 were treated as completed in the user's prior continuity.

KNOWN EXCEPTION:
- PR #161 (PH-01.4) is not merged in the currently verified GitHub state and has a browser-selector CI failure. This record does not silently mark that PR as merged. It remains a separate verification exception while PH-04 work proceeds from the current `main` baseline.

## PH-04 implementation

PH-04 is explicitly limited to:

- PH-04.1 plan control;
- PH-04.2 trial control;
- PH-04.3 account freeze/unfreeze;
- PH-04.4 subscription status control;
- PH-04.5 audit log;
- PH-04.6 verification gate.

All administrative mutations are server-authorized and validated. Audit records include admin identity, target, tenant, action, reason, before state, after state, and timestamp. Direct client access to the audit table is revoked.

## Files changed in this milestone

- `docs/PH_SELF_SERVE_CUSTOMER_LIFECYCLE_PLAN.md`
- `docs/sessions/2026-09-17-ph-lifecycle-continuity-recovery-and-ph-04.md`
- `migrations/20260917120000_ph04_platform_admin_subscription_controls.sql`
- `src/lib/menu/platform-subscriptions.ts`
- `src/routes/admin/users.tsx`
- `tests/ph-04-platform-admin-subscription-controls.test.mjs`
- `package.json`

## Verification plan

Required before merge:

- `npm install --no-audit --no-fund`
- `npm run typecheck`
- `npm test`
- `npm run test:platform`
- `npm run lint`
- `npm run build`
- `npm run check:auth`
- `npm run db:migrate`
- browser/admin QA for `/admin/users` subscription controls
- final diff/security review

No production deployment is authorized by this milestone.

## Status

IMPLEMENTATION_IN_PROGRESS

Deployment: NOT DEPLOYED.

Next action: run CI quality gates on this branch, inspect failures, correct only PH-04 defects, then create/review one PR. Stop after PH-04 verification; do not start PH-05.
