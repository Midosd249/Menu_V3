# TASKS

## Current State — 2026-09-17

- VERIFIED: `main` = `8050d2f08a2904f5ee2d9085454c47bdba601392`.
- VERIFIED: PR #172 is CLOSED / MERGED.
- VERIFIED: the public homepage `React.Children.only` runtime regression is fixed.
- VERIFIED: Quality and W9 Orders QA passed for PR #172.
- VERIFIED: Vercel PR deployment was rate-limited by the known free daily deployment quota; no retry was performed.

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

## PH Lifecycle

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

## Protected Scope

- Essential, Editorial, Noir, Heritage/Taste, and Gallery.
- Public menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls.
- Quick Add, Item Notes, Cart, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow.
- Do not repeat completed work without current reproducible regression evidence.

## Exact Next Task

No new implementation task is authorized by this continuity update. Await the owner's next explicitly scoped request.
