# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main
- VERIFIED: canonical `main` is `39793ecaa51d64dfa34df7a632fd0c956f4c7268`; this is also the A.1 audit baseline.
- VERIFIED: PR #179 is merged at `18ca4f243b39640ebd7ed77541b268240b54cefd`.
- VERIFIED: PR #180 is merged at `e8677a9d20c19ab03eff84d39358a66918b932b2` and is the current continuity closeout.
- VERIFIED: A.2 is implemented on branch `feat/a2-minimal-journey-instrumentation-2026-09-18` at `fb3b27218fcd8f732b0a2472ff72b2420e067b02`.
- VERIFIED: PR #191 is CLOSED / SUPERSEDED by PR #192.
- VERIFIED: GitHub Quality `35340567488` and W9 Orders QA `35340567487` both passed on the final head.
- VERIFIED: no production deployment or synthetic traffic was used.
- UNKNOWN: physical real-device Production QA for the latest `main`.
- UNKNOWN: current Production environment-variable values.

## PH Lifecycle — Completed

PH-01 through PH-06 are completed historical milestones. No additional PH milestone is currently defined.

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

The current Activation workstream is closed; the repository is awaiting the owner's next explicitly scoped task.

## A.1 Closeout — VERIFIED
- Audit-only task completed.
- Audit: `docs/audits/2026-09-18-a1-customer-journey-event-truth-audit.md`.
- No runtime implementation, migration, UI redesign, or deployment.
- Main gaps: search/category/add-to-cart measurement and authoritative event → order linkage.
- Existing `menu_events`, Owner Analytics, Growth, Reports, R2–R9, and R6 experiment contracts remain protected.

## A.2 — CLOSED / VERIFIED BY CI
- Added `search`, `category_view`, and `add_to_cart` to the canonical `menu_events` event contract.
- Added tenant-scoped `category_id` storage and server-side category ownership validation.
- Added 30-minute duplicate suppression for `search`.
- Instrumented `PublicMenuView`, Taste/Heritage, Editorial, Specialty Cafe, and Fast Casual renderers.
- Added focused regression tests.
- Preserved R6, existing analytics consumers, themes, order flow, and tenant/branch boundaries.
- CI Quality and W9 Orders QA passed.

## A.3 — CLOSED / VERIFIED BY CI — Server-Controlled Anonymous Session → Order Attribution
- Implemented the approved server-issued opaque cookie + tenant-bound session model.
- Canonical `menu_events` uses server-resolved session identity; client event payloads no longer carry `sessionId`.
- Public orders attach nullable `anonymous_session_id` only from a valid tenant-bound server session.
- Composite database foreign key enforces tenant/session consistency.
- Existing order validation, pricing, rate limiting, idempotency, R9 boundaries, and public themes were preserved.
- GitHub Quality run `35353500574` passed after the final R6 experiment-session alignment correction.
- GitHub W9 Orders QA run `35353500533` passed.
- No production deployment occurred.
- Vercel PR status failed due to the connected account's build/deployment rate limit; no retry was performed.

## Exact Next Task
**A.5 — Public Shareability / Deep-Link Audit.**

Do not deploy or begin Release Evidence automatically. A.5 is the next explicitly authorized atomic task.
