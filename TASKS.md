# TASKS

## Current State — 2026-09-18

- VERIFIED: `main` = `e8677a9d20c19ab03eff84d39358a66918b932b2`.
- VERIFIED: PR #179 is CLOSED / MERGED at `18ca4f243b39640ebd7ed77541b268240b54cefd`.
- VERIFIED: PR #180 is CLOSED / MERGED at `e8677a9d20c19ab03eff84d39358a66918b932b2`.
- VERIFIED: this task is documentation-only; no runtime code or deployment configuration changed.
- UNKNOWN: physical real-device Production QA for latest `main`.

## PH Lifecycle## PH Lifecycle

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

Do not start Payment Provider Integration or Commercial Launch without explicit owner authorization. Do not invent PH-07.

## PH-01 — CLOSED / VERIFIED / MERGED

PR #170: `fix: retire legacy customer approval and request flows`

Merge commit: `7e91778bfafa67b24efd1edf4387e1f3014fae9d`

### Acceptance state
- New customer: Home → Registration → secure workspace provisioning → Studio.
- Existing customer: Home → Login → email OR phone + password → existing workspace / Studio.
- New customers no longer depend on manual approval/request gating.
- `/admin/users` remains the server-authorized customer-control surface.
- Legacy Leads and Service Requests are retired from the active Platform Admin lifecycle surface.
- Tenant/branch isolation, fail-closed provisioning, auth, authorization, and server-side trust boundaries remain protected.

### Verification provenance
- GitHub confirms PR #170 merged into `main` at `7e91778...`.
- Manus reported successful Quality and W9 Orders QA gates.
- Manus reported the remaining local TypeScript/baseUrl check was a local toolchain/version mismatch rather than an application failure.

## Homepage Runtime Fix — CLOSED / VERIFIED / MERGED

PR #172: `fix: prevent homepage React.Children.only crash`

Merge commit: `8050d2f08a2904f5ee2d9085454c47bdba601392`

### Acceptance state
- Public homepage signup CTAs no longer crash when `Button asChild` contains a Link plus an icon.
- Radix `Slottable` keeps the Link as the slotted interactive element while preserving sibling content.
- Regression contract covers the homepage multi-child `asChild` pattern.
- No backend, database, authentication, RLS, tenant isolation, pricing, theme renderer, or deployment configuration changes were introduced.

### Verification
- GitHub Actions Quality run `35266109690` — SUCCESS.
- Typecheck — SUCCESS.
- Full repository tests — SUCCESS.
- Lint — SUCCESS.
- Production build — SUCCESS.
- Public all-theme browser QA — SUCCESS.
- Studio browser QA — SUCCESS.
- Platform Admin browser QA — SUCCESS.
- W9 Orders QA run `35266109691` — SUCCESS.
- Physical production device QA — UNKNOWN / release-stage pending.

## Completed Strategic Tasks

- P0 Public Order Hardening — CLOSED / VERIFIED.
- P1 Production/Continuity Hardening — CLOSED / VERIFIED.
- P2 Growth & Differentiation — CLOSED / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir Theme Hardening — CLOSED / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for implementation; outcome pending meaningful real exposure.
- R7 evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- W7.1–W7.12 — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope; existing draft PR history remains separate.

## R10 — DEFERRED / NOT STARTED

Do not begin R10 without explicit authorization.

## Production / Commercial Readiness

- Repository-side implementation through the completed PH lifecycle plus the homepage runtime fix is present in `main`.
- Physical Android/iOS production QA remains UNKNOWN / release-stage pending.
- Current production environment-variable values remain UNKNOWN from repository evidence.
- Do not use Vercel as the development iteration loop.

## Protected Scope

- Essential, Editorial, Noir, Heritage/Taste, and Gallery.
- Public menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls.
- Quick Add, Item Notes, Cart, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow.
- Do not repeat completed work without current reproducible regression evidence.

## Historical Next Task

No new implementation task is authorized by this continuity update. Await the owner's next explicitly scoped request.


## Platform Admin Customer Notifications — DONE / VERIFIED / MERGED

Main: 18ca4f243b39640ebd7ed77541b268240b54cefd

### Verified decision
- New customer registration is now self-serve and direct.
- Legacy approval/request notifications are intentionally not restored.
- /admin/orders remains useful for actual restaurant order operations and must not be removed.

### Implementation scope
- Add a server-authorized Platform Admin notification source based on newly created tenant/workspace records.
- Poll every 10 seconds while Platform Admin is open.
- Show unread badge, recent-customer notification center, in-app toast, and optional browser/device notifications.
- Link notifications to /admin/users.
- Persist last-read timestamp locally to avoid repeated alerts.

### Acceptance state
- New self-serve customer → visible in Platform Admin notification center.
- New customer while Admin is open → badge/toast appears without manual refresh, subject to polling interval.
- Optional browser notification can be enabled by the owner.
- Existing orders surface remains intact.
- No legacy approval/request flow is restored.

### Verification
- Focused contract tests required.
- Typecheck, full tests, lint, and production build required before merge.
- Production deployment is not part of this implementation task.

### Exact next task
Complete verification, create PR, and review CI. Do not remove order-management surfaces.


## 2026-09-18 — Repository Continuity & Stale-PR Reconciliation

### Current Git History
- VERIFIED: PR #179 → `18ca4f243b39640ebd7ed77541b268240b54cefd`.
- VERIFIED: PR #180 → `e8677a9d20c19ab03eff84d39358a66918b932b2`.

### Stale PR Classification Against Current `main`
- PR #161 — OBSOLETE: PH-01.4 existing-customer-login work is already implemented/completed in current `main`; the open branch is historical and diverged.
- PR #174 — SUPERSEDED: homepage login-entrypoint behavior is already present on current `main` through later merged work and protected by the current homepage contract test.
- PR #176 — SUPERSEDED: its documentation-only reconciliation targets an older state and is superseded by PR #179/#180 and this synchronized state.

### Scope Boundary
Documentation-only reconciliation. No runtime code, themes, auth, payments, deployment, or refactoring changes.

## Exact Next Task
Owner must explicitly authorize the next atomic task. Do not infer PH-07, Payment Provider Integration, Commercial Launch, or R10.
