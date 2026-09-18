# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main
- VERIFIED: `main` is `a5cda50e7ebfbd708fc11cc8b060e5134ddef4c6` as verified from GitHub on 2026-09-18.
- VERIFIED: PR #179 is merged at `18ca4f243b39640ebd7ed77541b268240b54cefd`.
- VERIFIED: PR #180 is merged at `e8677a9d20c19ab03eff84d39358a66918b932b2` and is the current continuity closeout.
- VERIFIED: this reconciliation changes documentation only; no runtime code or deployment configuration is changed.
- UNKNOWN: physical real-device Production QA for the latest `main`.
- UNKNOWN: current Production environment-variable values.

## PH Lifecycle — Completed / Deferred Boundary

```text
PH-01 Self-Serve Registration → Workspace → Studio       DONE / VERIFIED / MERGED
PH-02 Customer Lifecycle Visibility                      DONE / VERIFIED / MERGED
PH-03 Subscription Plans + Paid 14-Day Trial             DONE / VERIFIED / MERGED
PH-04 Platform Admin Subscription & Account Control     DONE / VERIFIED / MERGED
PH-05 Invoice Generation + WhatsApp Sharing              DONE / VERIFIED / MERGED
PH-06 Commercial Activation                               DONE / VERIFIED / MERGED

Payment Provider Integration                              NOT STARTED / DEFERRED
Commercial Launch                                         NOT STARTED / DEFERRED
```

The owner has explicitly decided NOT to implement Payment Provider Integration or Commercial Launch now. Do not create a PH-07 placeholder and do not start either deferred area without explicit authorization.

## PH-01 — Self-Serve Customer Lifecycle — CLOSED / VERIFIED / MERGED

PR #170 — `fix: retire legacy customer approval and request flows`

Merge commit:
`7e91778bfafa67b24efd1edf4387e1f3014fae9d`

### Final contract
- New customer: Home → Registration → secure workspace provisioning → Studio.
- Existing customer: Home → Login → email OR phone + password → existing workspace / Studio.
- New customer access no longer depends on manual approval/request gating.
- `/admin/users` remains the server-authorized customer-control surface.
- Legacy Leads and Service Requests are retired from the active lifecycle/admin surface.
- Tenant isolation, branch isolation, server authorization, fail-closed provisioning, and security boundaries remain protected.

### Documentation / verification provenance
- GitHub directly verifies PR #170 merged at `7e91778...`.
- Manus reported successful repository Quality gates, W9 Orders QA, and Vercel deployment for the completed batch.
- A local TypeScript/baseUrl check was reported by Manus as a local toolchain/version mismatch; official CI was the authoritative quality gate for the merged implementation.

## Homepage Runtime Fix — CLOSED / VERIFIED

PR #172 — `fix: prevent homepage React.Children.only crash`

- Root cause: `Button asChild` received a `Link` plus a sibling `ArrowUpLeft` icon; Radix Slot requires `Slottable` for this multi-child composition pattern.
- Fix: `src/components/ui/button.tsx` now preserves the first child as the slotted interactive element and preserves trailing sibling content using `Slottable`.
- Regression protection: `tests/public-pages-themes-contract.test.mjs` verifies the homepage pattern and Button `Slottable` contract.
- VERIFIED: Quality run `35266109690` passed typecheck, full tests, lint, production build, public all-theme browser QA, Studio browser QA, Platform Admin browser QA, performance/diagnostic stages, and cleanup.
- VERIFIED: W9 Orders QA run `35266109691` passed.
- VERIFIED: merge commit `8050d2f08a2904f5ee2d9085454c47bdba601392` is on `main`.
- UNKNOWN: physical real-device Production QA for the latest `main`.

## Completed Strategic Milestones
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for implementation; outcome pending meaningful real exposure.
- R7 initial evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir theme hardening — CLOSED / VERIFIED / MERGED.
- W7.1–W7.12 — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope; existing draft PR history remains separate and protected.

## R10
STATUS: DEFERRED / NOT STARTED.

Do not begin R10 without explicit authorization.

## Production / Release Readiness
- VERIFIED: repository-side product work through PH-06 plus the homepage runtime fix is present in `main`.
- UNKNOWN: physical Android/iOS production QA.
- UNKNOWN: current production environment-variable values.
- Do not use Vercel as the development iteration loop.

## Product Direction
Menu V3 remains a premium Arabic-first restaurant platform:

```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
→ Experiments
→ Guest Relationships
→ Self-Serve Customer Lifecycle
```

The product is intentionally paused before payment-provider integration and commercial launch.

## Historical Next Task
Await the owner's next explicitly scoped task. No payment provider work, commercial-launch work, or PH-07 work is authorized by this plan.


## 2026-09-18 — Platform Admin Customer Notifications

- VERIFIED: current main = 18ca4f243b39640ebd7ed77541b268240b54cefd.
- VERIFIED: direct self-serve signup is active; new customers are provisioned into their workspace without the retired approval/request queue.
- VERIFIED: /admin/orders remains a real operational order-management surface and is separate from customer onboarding.
- DONE / VERIFIED / MERGED: Platform Admin new-customer notification center is merged into main.
- Scope: notification bell + unread badge + in-app toast + recent customers + optional browser notifications, backed by server-authorized polling.
- Not in scope: Supabase Realtime migration, push infrastructure, customer lifecycle redesign, order removal, payment-provider work, commercial launch, or PH-07.
- Exact next task: verify the focused notification change, create the PR, and stop before unrelated work.


## 2026-09-18 — Repository Continuity & Stale-PR Reconciliation

### Current Git History
- VERIFIED: PR #179 → `18ca4f243b39640ebd7ed77541b268240b54cefd`.
- VERIFIED: PR #180 → `e8677a9d20c19ab03eff84d39358a66918b932b2`.

### Stale PR Classification Against Current `main`
- PR #161 — CLOSED / OBSOLETE. Its PH-01.4 existing-customer-login scope is already implemented/completed in current `main`; the branch was historical and diverged.
- PR #174 — CLOSED / SUPERSEDED. Its homepage login-entrypoint scope is already represented by later merged work on current `main` and regression protection.
- PR #176 — CLOSED / SUPERSEDED. It was a documentation reconciliation for an older state and is superseded by PR #179/#180 and this synchronized continuity state.

### Scope Boundary
Documentation-only reconciliation. No runtime code, themes, auth, payments, deployment, or refactoring changes.

## Exact Next Task
Owner authorization is required for the next atomic task; do not infer PH-07, Payment Provider Integration, Commercial Launch, or R10.


## 2026-09-18 — Stale PR Closure and Main Reconciliation
- VERIFIED: GitHub `main` at reconciliation start was `a5cda50e7ebfbd708fc11cc8b060e5134ddef4c6`.
- VERIFIED: PR #161, #174, and #176 were closed as obsolete/superseded.
- VERIFIED: documentation-only scope; no runtime code or deployment configuration changes.
- UNKNOWN: physical real-device Production QA for the latest main.
- Exact next task: owner authorization for the next atomic task only.
