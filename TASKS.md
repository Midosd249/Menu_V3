# TASKS

## Current State — 2026-09-18

- VERIFIED: `main` = `8939474e705459e7e5757d93b053593a2ee1d4b2`.
- VERIFIED: PR #175 is CLOSED / MERGED.
- VERIFIED: public homepage now uses a stable `/login` entrypoint for anonymous and authenticated visitors.
- VERIFIED: Quality run `35275468483` — SUCCESS.
- VERIFIED: W9 Orders QA run `35275468364` — SUCCESS.
- BLOCKED / NON-BLOCKING: Vercel deployment for PR #175 was rate-limited by the known free daily deployment quota; no retry was performed.
- UNKNOWN: physical real-device Production QA for latest `main`.

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

## Homepage Login Entrypoint — CLOSED / VERIFIED / MERGED

PR #175: `fix: make public homepage use login entrypoint`

Merge commit: `8939474e705459e7e5757d93b053593a2ee1d4b2`

### Acceptance state
- Homepage header always provides `/login` rather than switching to a Studio button based on auth state.
- Existing login email/phone + password flow and signup mode remain unchanged.
- Contract coverage prevents regression to `SignedIn` / `SignedOut` homepage gating.
- No backend, database, authentication logic, RLS, tenant isolation, pricing, theme renderer, or deployment configuration changes were introduced.

### Verification
- GitHub Actions Quality run `35275468483` — SUCCESS.
- Route generation — SUCCESS.
- Typecheck — SUCCESS.
- Full repository tests — SUCCESS.
- W7.4–W7.10 contract tests — SUCCESS.
- Lint — SUCCESS.
- Production build — SUCCESS.
- Public all-theme browser QA — SUCCESS.
- Studio browser QA — SUCCESS.
- Platform Admin browser QA — SUCCESS.
- W9 Orders QA run `35275468364` — SUCCESS.
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
- W8 Internal Visual System — DONE / VERIFIED for implemented scope.

## R10 — DEFERRED / NOT STARTED

Do not begin R10 without explicit authorization.

## Protected Scope

- Essential, Editorial, Noir, Heritage/Taste, and Gallery.
- Public menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls.
- Quick Add, Item Notes, Cart, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow.
- Do not repeat completed work without current reproducible regression evidence.

## Exact Next Task

No new implementation task is authorized by this continuity update. Await the owner's next explicitly scoped request.
