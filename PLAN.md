# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main
- VERIFIED: `main` is `8050d2f08a2904f5ee2d9085454c47bdba601392` as verified from GitHub on 2026-09-17.
- VERIFIED: PR #172 is merged and fixes the public homepage `React.Children.only` runtime crash.
- VERIFIED: Quality and W9 Orders QA passed for PR #172.
- VERIFIED: no backend, database, authentication, RLS, tenant-isolation, pricing, theme-renderer, or deployment-configuration changes were introduced by the fix.

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

## Homepage Runtime Fix — CLOSED / VERIFIED
- PR #172 — `fix: prevent homepage React.Children.only crash`.
- Root cause: `Button asChild` received a `Link` plus a sibling `ArrowUpLeft` icon; Radix Slot requires a slottable child for multi-child composition.
- Final solution: `Button` uses `Slottable` with the first child as the interactive slotted element and preserves trailing content.
- Regression contract added to `tests/public-pages-themes-contract.test.mjs`.
- GitHub Actions Quality run `35266109690` passed all configured gates.
- GitHub Actions W9 Orders QA run `35266109691` passed.
- Merge commit: `8050d2f08a2904f5ee2d9085454c47bdba601392`.
- Vercel PR deployment was rate-limited by the known free daily deployment quota; it was not retried.

## Completed Strategic Milestones
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for implementation; outcome pending meaningful real exposure.
- R7 initial evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- W7.1–W7.12 — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope; existing draft PR history remains separate and protected.

## R10
STATUS: DEFERRED / NOT STARTED.

Do not begin R10 without explicit authorization.

## Production / Release Readiness
- VERIFIED: repository-side product work through the completed PH lifecycle plus the homepage runtime fix is present in `main`.
- VERIFIED: CI quality and W9 Orders QA passed for the homepage fix.
- UNKNOWN: physical Android/iOS production QA for the latest `main`.
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

## Exact Next Task
Await the owner's next explicitly scoped task. No payment provider work, commercial-launch work, or PH-07 work is authorized by this plan.
