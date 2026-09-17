# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main — 2026-09-18
- VERIFIED: `main` = `8939474e705459e7e5757d93b053593a2ee1d4b2`.
- VERIFIED: PR #175 is merged and fixes the public homepage login entrypoint.
- VERIFIED: Quality run `35275468483` passed.
- VERIFIED: W9 Orders QA run `35275468364` passed.
- BLOCKED / NON-BLOCKING: PR #175 Vercel deployment was rate-limited by the known free daily deployment quota; no retry was performed.

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

## Homepage Login Entrypoint — CLOSED / VERIFIED / MERGED
PR #175 — `fix: make public homepage use login entrypoint`

- Merge commit: `8939474e705459e7e5757d93b053593a2ee1d4b2`.
- The homepage header now exposes a stable `/login` entrypoint for all visitors.
- Auth-state-dependent `SignedIn` / `SignedOut` Studio gating was removed from the homepage header.
- Existing `/login` email/phone + password and signup mode were preserved.
- A contract test protects the stable login entrypoint.
- No auth logic, tenant/RLS, pricing, database, payment-provider, or deployment configuration changes were introduced.
- VERIFIED: Quality run `35275468483` passed all configured route, typecheck, test, contract, lint, build, browser QA, and diagnostic stages.
- VERIFIED: W9 Orders QA `35275468364` passed.
- UNKNOWN: physical real-device Production QA for latest `main`.

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
- W8 Internal Visual System — DONE / VERIFIED for implemented scope.

## R10
STATUS: DEFERRED / NOT STARTED.
Do not begin R10 without explicit authorization.

## Production / Release Readiness
- VERIFIED: repository-side product work through PH-06 plus the homepage login-entrypoint fix is present in `main`.
- UNKNOWN: physical Android/iOS production QA.
- UNKNOWN: current production environment-variable values.
- BLOCKED / NON-BLOCKING: Vercel deployment for PR #175 was rejected by the free daily deployment quota.
- Do not use Vercel as the development iteration loop.

## Exact Next Task
Await the owner's next explicitly scoped task. No payment-provider work, commercial-launch work, PH-07 work, or R10 work is authorized automatically.
