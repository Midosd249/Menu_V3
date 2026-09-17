# PH-04 — Browser Fixture Correction

Date: 2026-09-17
Repository: `Midosd249/Menu_V3`
Working branch: `codex/ph-04-platform-admin-subscription-control`
PR: #162

## Request Classification

- Classification: PH-04 — Platform Admin Subscription & Account Control.
- Workflow: repository-first verification, CI failure diagnosis, browser QA fixture correction, continuity update.
- Research level: `Focused`.
- Scope remains PH-04 only. PH-05 is not started.

## Continuity Recovery Record

The recovered lifecycle plan is committed on this branch at `docs/PH_SELF_SERVE_CUSTOMER_LIFECYCLE_PLAN.md`.

Recovered phase map:

- PH-01 — Self-Serve Registration → Workspace → Studio.
- PH-02 — Customer Lifecycle Visibility in Platform Admin.
- PH-03 — Subscription Plans + Paid 14-Day Trial.
- PH-04 — Platform Admin Subscription & Account Control.
- PH-05 — Invoice Generation + WhatsApp Sharing.

The user confirms PH-01 through PH-03 were completed previously and work stopped at PH-04. Repository evidence is preserved separately from that confirmation: PH-01.2 is merged in PR #159, PH-01.3 is merged in PR #160, and PH-01.4 remains CI/merge-gated in PR #161 at the time of this recovery. PH-02 and PH-03 remain `USER-CONFIRMED` historical completion with current-main reconciliation gaps explicitly recorded in the recovered plan.

Commercial direction recorded by the recovered plan:

- Free: `0 SAR/month`.
- Paid tier 1: `49 SAR/month` or `490 SAR/year`.
- Paid tier 2: `149 SAR/month` or `1,490 SAR/year`.
- Pro: unlimited products.
- Free: no paid trial.
- Paid tiers: 14-day trial when selected.

The current main discrepancy (`99 / 199` catalog and legacy trial initialization) is not silently changed inside PH-04.

## PH-04 Implementation Boundary

The active milestone contains only:

1. server-authorized plan control;
2. bounded trial extension/end control;
3. account freeze/unfreeze separate from subscription state;
4. subscription-state control using `trialing`, `active`, `past_due`, `cancelled`;
5. administrative before/after audit records;
6. Platform Admin control UI and browser verification.

No payment provider, automatic charging, invoice generation, WhatsApp sharing, public-menu theme change, or production data mutation is part of this milestone.

## CI Evidence and Root Cause

Quality run `35172011027` on implementation head `7dbf980ed9fae096ce61e157260ac53d13ea4124` completed with `failure`.

Verified from the GitHub Actions job evidence:

- route generation: passed;
- route-tree freshness: passed;
- typecheck: passed;
- repository tests: passed;
- W7.4–W7.10 contract tests: passed;
- lint: passed;
- production build: passed;
- browser template QA: passed;
- Studio browser QA: passed;
- Platform Admin browser QA: failed.

The downloaded browser diagnostics identified the actual fixture problem:

- `menu_v3.lead_onboarding` did not exist when `20260916100000_customer_activation_lifecycle.sql` was applied by the W7.9 browser test fixture.
- The same browser log also showed missing `menu_v3.tenant_subscriptions` and missing `activation_status`, confirming that the Platform Admin fixture had not loaded the lifecycle/subscription prerequisites required by the current Admin runtime.

This is a test-environment migration-order/completeness defect, not evidence that PH-04 runtime authorization was bypassed.

## Correction

Commit `5db5caf0996cfa0e5cbb211e5eb6b7ff68eb71e4` updates `tests/w7-9-admin-routes-browser.spec.ts` so the browser fixture loads the missing `lead_onboarding` prerequisite before the customer activation lifecycle migration, followed by the subscription plan foundation and PH-04 control migration.

The correction does not change runtime business logic or production schema behavior; it makes the existing browser fixture match the dependency order required by the migrations it already applies.

## Verification Plan

1. Re-run the normal GitHub Quality workflow for the new head.
2. Confirm the Platform Admin browser stage passes at mobile and desktop widths.
3. Confirm all previously passing gates remain passing.
4. Review the final diff for tenant isolation, authorization, RLS, migration ordering, and PH-04-only scope.
5. Review PR #162 before any merge.

## Status

- Implementation: `IMPLEMENTATION_IN_PROGRESS`.
- Verification: `BLOCKED_PENDING_CI` after the fixture correction.
- Deployment: `UNKNOWN / NOT PERFORMED`.
- PH-05: `TODO / NOT STARTED`.

## Exact Next Action

Wait for the new Quality/W9 evidence on head `5db5caf0996cfa0e5cbb211e5eb6b7ff68eb71e4`, diagnose only demonstrated failures, then perform final PH-04 diff/PR review. Do not start PH-05.
