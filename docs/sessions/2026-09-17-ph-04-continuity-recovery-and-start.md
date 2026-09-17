# PH-04 — Continuity Recovery and Start

Date: 2026-09-17
Repository: `Midosd249/Menu_V3`
Canonical branch: `main`
Working branch: `codex/ph-04-platform-admin-subscription-control`

## Request Classification

- Classification: PH-04 — Platform Admin Subscription & Account Control.
- Workflows: Principal Engineer continuity recovery, repository-first lifecycle audit, authentication/authorization review, subscription/data-boundary review, Platform Admin UX, migration/security review, CI/browser verification planning.
- Research level: `Focused`.
- Design Agent: not required for public-menu themes; this is an internal Platform Admin control surface.

## Scope Boundary

Complete PH-04 only:

1. Plan control.
2. Trial extension/end control.
3. Account freeze/unfreeze.
4. Subscription-state control.
5. Immutable-style append-only audit records for administrative mutations.
6. Admin control UI and verification.

Do not start PH-05. Do not redesign public themes. Do not add payment integration or automatic charging. Do not mutate production data.

## Recovered Continuity

The original PH plan was recovered from PR #158. It defines:

- PH-01: Self-Serve Registration → Workspace → Studio.
- PH-02: Customer Lifecycle Visibility in Platform Admin.
- PH-03: Subscription Plans + Paid 14-Day Trial.
- PH-04: Platform Admin Subscription & Account Control.
- PH-05: Invoice Generation + WhatsApp Sharing.

The original plan file was absent from current `main`; it has been restored on this working branch as `docs/PH_SELF_SERVE_CUSTOMER_LIFECYCLE_PLAN.md`.

The user confirms PH-01 through PH-03 were completed and work stopped at PH-04. Repository evidence was reconciled rather than assumed:

- `VERIFIED`: current `main` is `a9ea0add9989c3949e94d1efd10065176790456f`.
- `VERIFIED`: PR #159 contains the merged PH-01.2 registration contract.
- `VERIFIED`: PR #160 is merged into current `main` and implements secure PH-01.3 provisioning.
- `UNKNOWN / CI-GATED`: PR #161 PH-01.4 is still open in the current GitHub state; its Quality run previously failed at the Studio browser stage and was re-run. It must not be falsely marked merged until the new run passes and the PR is actually merged.
- `USER-CONFIRMED`: PH-02 and PH-03 were completed in prior work.
- `VERIFIED GAP`: current `main` does not contain the recovered PH-03 commercial catalog state: `src/lib/menu/commercial-catalog.ts` and `migrations/20260903025817_subscription_plans.sql` still show `99 / 199` and the legacy trial initialization. This is recorded as a reconciliation gap, not silently rewritten during PH-04.
- `VERIFIED`: current Platform Admin already has a `/admin/subscriptions` workspace backed by server-side Platform Admin authorization and subscription aggregates.
- `VERIFIED`: current subscription states are `trialing`, `active`, `past_due`, and `cancelled`.
- `UNKNOWN`: current Vercel Production serving state and production environment values; no Vercel deployment is required for this implementation task.

## Vercel Continuity

The repository contains a release-only Vercel discipline. The current session does not claim a Production deployment. The previous Vercel/quota concern is recorded as a release constraint, not as evidence of a current deployment state.

No intentional Vercel Preview or Production deployment is triggered by PH-04 implementation.

## PH-04 Design Contract

### Plan Control

- Only an authenticated Platform Admin can request a plan change.
- Server derives the actor from the verified session.
- Tenant is validated on the server.
- Only active subscription plans are selectable.

### Trial Control

- Trial extension is bounded to 1–30 days per operation.
- Extension is allowed only while the subscription is `trialing`.
- Ending a trial records `trial_ends_at = now()` and changes the current subscription to `cancelled`; no data is deleted.

### Freeze / Unfreeze

- Account status is separate from subscription status: `active`, `frozen`, `blocked`.
- Freeze sets the tenant account to `frozen` and disables its active flag without deleting data.
- Unfreeze restores `active` account state.

### Subscription State Control

- Current schema states are authoritative: `trialing`, `active`, `past_due`, `cancelled`.
- Setting `trialing` requires a future trial end date.
- No payment provider or automatic charging is introduced.

### Audit

Each mutation records:

- actor user id;
- tenant id;
- action;
- before state;
- after state;
- timestamp.

No password, token, secret, or authentication credential is recorded.

## Implementation Started

Added on this branch:

- `migrations/20260917120000_platform_admin_subscription_control.sql`
  - account status model;
  - PH-04 audit table and index;
  - server/database-authoritative mutation function;
  - fixed `search_path` and restricted function execution.
- `src/lib/menu/admin-subscriptions.ts`
  - Platform Admin authorization;
  - authoritative subscription listing;
  - validated mutation server functions.
- `src/components/admin-subscription-control.tsx`
  - Arabic-first Platform Admin control surface;
  - search, plan/status controls, trial controls, freeze/unfreeze, confirmations, loading/error states.
- `src/routes/admin/$workspace.tsx`
  - routes the existing `subscriptions` workspace to the PH-04 control surface without duplicating the Admin shell.

## Verification Plan

Run through CI because the current connected execution surface does not provide a repository-local command runner:

- route generation / generated route tree check;
- `npm run typecheck`;
- `npm test`;
- `npm run test:platform`;
- `npm run lint`;
- `npm run build`;
- `npm run check:auth`;
- migration/schema verification;
- focused PH-04 contract tests;
- Platform Admin browser QA at mobile and desktop widths;
- auth/tenant isolation regression review;
- final diff review.

## Acceptance Criteria

- Non-admin authenticated users cannot execute PH-04 mutations.
- Client cannot select actor identity or bypass tenant validation.
- Plan changes affect only the requested tenant subscription.
- Trial extension/end obey current state rules.
- Freeze/unfreeze preserves data and is distinct from subscription state.
- Every successful mutation creates an audit record with before/after state.
- Failed mutations do not create false success state.
- Admin UI is reachable through the existing `/admin/subscriptions` workspace.
- No public menu/theme behavior changes.
- No production deployment is claimed.

## Status

- Implementation: `IMPLEMENTATION_IN_PROGRESS`.
- Deployment: `UNKNOWN / NOT PERFORMED`.
- PH-05: `TODO / NOT STARTED`.

## Exact Next Action

Add focused PH-04 contract/browser coverage, then run/review CI gates and final diff. Do not start PH-05.
