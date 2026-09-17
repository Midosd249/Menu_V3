# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Verified Position — 2026-09-17
- VERIFIED: canonical `main` is `8050d2f08a2904f5ee2d9085454c47bdba601392`.
- VERIFIED: PR #172 is CLOSED / MERGED and fixes the public homepage `React.Children.only` runtime crash.
- VERIFIED: PR #171 continuity reconciliation is already merged before PR #172.
- VERIFIED: PH-01 corrective customer lifecycle work is complete.
- VERIFIED: Payment Provider Integration is NOT STARTED.
- VERIFIED: Commercial Launch is NOT STARTED.
- VERIFIED: no PH-07 milestone is defined or authorized.

## Homepage Runtime Incident — CLOSED / VERIFIED
- Root cause: public homepage signup CTAs passed a `Link` plus a trailing `ArrowUpLeft` icon as multiple direct children of `Button asChild`.
- `Button` uses Radix `Slot`; multi-child composition requires `Slottable` so the interactive Link remains the slotted element.
- Fix: `src/components/ui/button.tsx` now supports the documented Radix multi-child `asChild` composition pattern without changing the homepage route contract.
- Regression protection: `tests/public-pages-themes-contract.test.mjs` verifies the homepage pattern and the Button `Slottable` contract.
- VERIFIED: GitHub Actions Quality run `35266109690` passed typecheck, tests, lint, production build, public theme QA, Studio browser QA, Platform Admin browser QA, performance/diagnostic stages, and cleanup.
- VERIFIED: GitHub Actions W9 Orders QA run `35266109691` passed.
- VERIFIED: PR #172 merged to `main` at `8050d2f08a2904f5ee2d9085454c47bdba601392`.
- UNKNOWN: current physical real-device Production QA for the merged fix.
- BLOCKED / NON-BLOCKING: Vercel PR deployment reported the known free daily deployment limit; no retry was performed and Vercel was not used as the development loop.

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

## Completed Protected Product Work
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for activation/measurement implementation; outcome pending meaningful real exposure.
- R7 evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- W7.1–W7.12 internal product experience work — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope; draft PR history remains protected separately.

## R10
STATUS: DEFERRED / NOT STARTED

Do not begin R10 until the owner explicitly authorizes it.

## Production / Release Gates
- VERIFIED: GitHub `main` contains the homepage runtime fix and protected prior work.
- UNKNOWN: physical real-device Production QA for the latest `main`.
- UNKNOWN: current Production environment-variable values.
- Do not use Vercel as the development iteration loop or trigger unnecessary deployment retries.

## Continuity Rule
At the end of every atomic task:
1. reconcile Git head against GitHub `main`;
2. distinguish implementation, CI, deployment, and device evidence;
3. update continuity files when canonical state changes;
4. record exactly one next authorized task;
5. never infer authorization for deferred payment/commercial work.

## Exact Next Task
Await the owner's next explicitly scoped product task. Payment Provider Integration, Commercial Launch, and any invented PH-07 remain deferred and must not be started automatically.
