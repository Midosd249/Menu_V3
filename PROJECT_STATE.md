# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Verified Position — 2026-09-18
- VERIFIED: `main` is `8939474e705459e7e5757d93b053593a2ee1d4b2`.
- VERIFIED: PR #175 is CLOSED / MERGED.
- VERIFIED: PR #175 makes the public homepage use a stable `/login` entrypoint for both anonymous and authenticated visitors.
- VERIFIED: Quality run `35275468483` completed SUCCESS.
- VERIFIED: W9 Orders QA run `35275468364` completed SUCCESS.
- VERIFIED: no authentication, authorization, tenant/RLS, pricing, database, or payment-provider changes were introduced by PR #175.
- BLOCKED / NON-BLOCKING: Vercel status for PR #175 failed only because the known free daily deployment quota was exceeded (`api-deployments-free-per-day`); no retry was performed.
- UNKNOWN: physical real-device Production QA for the latest `main`.

## PH Lifecycle — Current Decision
The owner has explicitly decided to stop before payment-provider integration and commercial launch. Do not implement either unless explicitly authorized in a future task.

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

## PR #175 — Public Homepage Login Entrypoint — CLOSED / VERIFIED / MERGED
- PR: #175 `fix: make public homepage use login entrypoint`.
- Merge commit: `8939474e705459e7e5757d93b053593a2ee1d4b2`.
- Head before merge: `a2ecc9015f63fe90a28237d7a20f83991225ed48`.
- VERIFIED: homepage header no longer switches between Login and Studio based on auth state.
- VERIFIED: homepage header now always links to `/login`.
- VERIFIED: existing `/login` email/phone + password flow and signup mode were preserved.
- VERIFIED: regression contract prevents the homepage from returning to `SignedIn`/`SignedOut` Studio gating.
- VERIFIED: Quality run `35275468483` passed route generation, typecheck, tests, W7.4–W7.10 contracts, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin browser QA, performance diagnostics, and cleanup.
- VERIFIED: W9 Orders QA run `35275468364` passed.

## Protected Product Work
- G1–G7.2 — CLOSED / VERIFIED.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for implementation; outcome pending meaningful real exposure.
- R7 evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir theme hardening — CLOSED / VERIFIED / MERGED.
- W7.1–W7.12 internal product experience work — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope.

## R10
STATUS: DEFERRED / NOT STARTED.
Do not begin R10 until the owner explicitly authorizes it.

## Production / Release Gates
- VERIFIED: `main` contains PR #175 and all protected prior work.
- VERIFIED: repository CI quality and W9 Orders QA passed for PR #175.
- BLOCKED / NON-BLOCKING: PR #175 Vercel deployment was rejected by the free daily deployment quota; no retry was performed.
- UNKNOWN: physical real-device Production QA for the latest `main`.
- UNKNOWN: current Production environment-variable values.
- Do not use Vercel as an iteration loop or trigger unnecessary deployment retries.

## 2026-09-18 — Homepage Login Entrypoint — CLOSED / VERIFIED
PR #175 corrected the public homepage entry behavior without changing authentication logic. The public homepage now consistently directs visitors to `/login`; the existing login/signup flow remains the authentication boundary.

## Exact Next Task
Await the owner's next explicitly scoped task. Payment Provider Integration, Commercial Launch, and R10 remain deferred and must not be started automatically.
