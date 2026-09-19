# Menu V3 — Active Plan

## Status
- Status: RELEASE_STAGE_VERIFIED_WITH_DEVICE_QA_PENDING.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Release-Stage Evidence
- VERIFIED: release-stage verification was completed against verified main b78b69ea0921571a1ca454c30ca81a43e5cf20b5 before this documentation batch.
- VERIFIED: Production deployment was READY and matched GitHub commit b78b69ea0921571a1ca454c30ca81a43e5cf20b5 at verification time.
- VERIFIED: production root HTTP 200.
- VERIFIED: invalid public menu HTTP 404.
- VERIFIED: invalid branch variant HTTP 404.
- VERIFIED: no error/fatal runtime logs were found for the checked production deployment in the inspected 2-hour window.
- VERIFIED: production theme-testing override is disabled by server-side `VERCEL_ENV=production` guard; no code removal is justified.
- UNKNOWN: exact production environment-variable secret values.
- UNKNOWN / EXTERNAL: physical Android/iOS QA.

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

## Release Evidence — 2026-09-18 — IN_PROGRESS / REPOSITORY EVIDENCE ASSEMBLED
- VERIFIED: canonical `main` is `99cc9338257b7ae6125a30579c445504fdfeaaaa` after PR #197 merge.
- VERIFIED: PR #197 is CLOSED / MERGED at `99cc9338257b7ae6125a30579c445504fdfeaaaa`.
- VERIFIED: Quality run `35364239274` passed all configured quality, browser, and performance stages.
- VERIFIED: W9 Orders QA run `35364239435` passed.
- VERIFIED: GitHub combined status for current `main` contains only the Vercel `failure` context caused by the documented build/deployment rate-limit surface; this is not CI Quality failure.
- UNKNOWN: direct Vercel Production deployment identity/configuration for this `main`.
- UNKNOWN: physical real-device production QA.
- UNKNOWN: direct production HTTP 404 verification for invalid public menu URLs.

## Exact Next Task
**Real-device production QA — execute the prepared Android/iOS/QR/theme/order/RTL smoke matrix on a physical device and record the evidence.**

Do not begin product/category deep links or native Web Share automatically.

## A.5 — CLOSED / VERIFIED — Public Shareability / Deep-Link Audit
- VERIFIED: A.5 audit completed against canonical `main` at `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: audit record: `docs/audits/2026-09-18-a5-public-shareability-deep-links.md`.
- VERIFIED: public tenant and branch routes are structurally direct-addressable and server-resolved.
- VERIFIED: QR URLs, locale state, canonical URLs, hreflang, theme-preview noindex behavior, tenant/branch isolation, and all-theme route architecture were inspected.
- VERIFIED: competing robots/sitemap implementations exist across `src/lib/menu/seo-discovery.ts` + `server/middleware/seo-discovery.ts` and `src/lib/seo/crawl.ts` + `server/middleware/grok-pwa.ts`.
- GAP: invalid public-menu handling returns an application-level `not_found` result rather than a proven route-level HTTP 404; runtime confirmation is still required.
- GAP: `/m/:slug` has first-active-branch ambiguity for multi-branch tenants; branch-specific sharing is deterministic via `/m/:slug/:branch`.
- DEFERRED: product/category deep links and native Web Share API are growth opportunities, not part of the remediation gate.
- UNKNOWN: current production HTTP behavior for invalid routes because runtime/device execution was not available in this audit.
- Exact next task: **A.5 Remediation — unify public discovery ownership and establish a verified HTTP 404 contract for public menu routes.**


## 2026-09-18 — A.5 Remediation — CLOSED / VERIFIED
- VERIFIED: PR #196 merged into `main` at `b98e3e1ae832c389157de2205979be4801fce63b`.
- VERIFIED: public discovery ownership is unified under `server/middleware/seo-discovery.ts`; superseded `src/lib/seo/crawl.ts` and its `grok-pwa.ts` ownership were removed.
- VERIFIED: both public route variants convert `not_found` to router-level `notFound()`.
- VERIFIED: canonical sitemap behavior preserves locale alternates and deterministic duplicate suppression.
- VERIFIED: Quality run `35363323737` passed; W9 Orders QA run `35363323728` passed.
- BLOCKED / NON-BLOCKING: Vercel remains rate-limited; no deployment was performed.
- UNKNOWN: direct production HTTP 404 verification and physical device QA remain release-stage evidence.

## 2026-09-19 — QR/Public Theme Visual Regression Remediation — CLOSED / VERIFIED
- VERIFIED: PR #201 `fix(themes): close QR visual regressions in Editorial, Noir, and Taste` was merged into `main`.
- VERIFIED: merge commit before this continuity-only commit: `dc4dbe61809d279491e00d7fc276644d3242aa98`.
- VERIFIED: GitHub Quality run `35400889545` passed route generation, typecheck, full tests, W7.4–W7.10 contract tests, lint, production build, Playwright Chromium installation, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup.
- VERIFIED: GitHub W9 Orders browser run `35400889594` passed.
- VERIFIED: focused QR/theme regression contracts passed for Editorial Arabic wrapping/spacing, Noir restaurant cover + shared featured interaction, and Taste restaurant logo rendering.
- VERIFIED: final PR scope was limited to theme presentation/regression coverage; tenant data, ordering, analytics, auth/RLS, subscriptions, SEO architecture, and deployment configuration were not changed.
- VERIFIED: PR had no unresolved review threads; GitHub merge was performed with expected head `5322ade776fb0a91144c9ddd1812d633b827d5db`.
- UNKNOWN: physical Android/iOS QR verification of the merged main, including camera/real-device rendering and actual restaurant-selected media loading.
- UNKNOWN: direct current Vercel Production deployment identity for this newly merged main; no deployment was requested or performed by this task.
- NOTE: the repository Quality browser suite provides automated browser evidence across themes; it does not replace physical-device QR evidence.
- Files changed by PR #201: `package.json`, `src/components/templates/fine-dining-hospitality.tsx`, `src/components/templates/taste.tsx`, `src/routes/__root.tsx`, `src/theme-noir-hardening.css`, `src/theme-qr-final-fixes.css`, `tests/noir-browser-hardening.test.mjs`, `tests/theme-qr-final-fixes.test.mjs`.
- Continuity documentation is being reconciled in this single documentation commit after the verified code merge.

## 2026-09-19 — QR Printing + Editorial Typography + Theme Label Cleanup — CLOSED / VERIFIED

- VERIFIED: PR #203 `fix: restore QR printing, add batch sheets, and finalize Editorial typography` merged into `main` at `d55c6c7b8cc18807b7a20982d803761d8180fc61`.
- VERIFIED: QR single-print reliability was fixed by opening the print browsing context directly from the user click before the asynchronous QR generation step, avoiding the transient-user-activation failure mode of the previous implementation.
- VERIFIED: multi-copy QR printing now accepts 1–40 copies, defaults to 8, uses the exact same branch/menu URL for every copy, and lays out up to 8 codes per printed page in a 2×4 sheet.
- VERIFIED: the Editorial product card now reserves a dedicated title column, keeps the number separate, moves price to its own row, and uses normal Arabic word wrapping instead of character-level fragmentation.
- VERIFIED: active decorative `NOIR / 03`, `N / 03`, and `ISSUE / 03` labels were removed from the active Noir/Editorial presentation layers.
- VERIFIED: focused regression contracts were added for QR print/batch behavior and decorative-label removal.
- VERIFIED: Quality run `35407461902` passed typecheck, full tests, W7.4–W7.10 contract tests, lint, production build, Playwright/Chromium, all-theme browser QA, Studio/Platform Admin browser QA, performance baseline, diagnostics, and cleanup.
- VERIFIED: W9 Orders QA run `35407461827` passed.
- VERIFIED: PR #203 had no unresolved review threads.
- VERIFIED: no database, auth/RLS, ordering, analytics, subscription, SEO architecture, or deployment configuration changes were made.
- UNKNOWN: physical Android/iOS/QR print-preview/device rendering remains unverified.
- UNKNOWN: current Vercel Production deployment identity for this merged main; no Vercel production deployment was performed by this task.
- NOTE: the GitHub browser suite verifies automated browser behavior across all themes; it does not replace physical-device QR scanning/printing evidence.

## Exact Next Task
**Real-device production QA — execute the prepared Android/iOS/QR/theme/order/RTL smoke matrix on a physical device, and include the QR single-print + multi-copy print-preview checks.**

Do not begin product/category deep links or native Web Share automatically.


## 2026-09-19 — Homepage Implementation Slice — IN PROGRESS

- VERIFIED: implementation authorized by owner after the documented homepage execution plan.
- VERIFIED: permanent Research, Innovation & Creative Intelligence workflow is now stored in `docs/agents/research-innovation-creative-agent.md` and routed by `docs/automatic-specialist-routing.md`.
- VERIFIED: PR #206 implements the homepage information architecture around guest journey, restaurant presence, Studio control, Arabic-first proof, pricing, FAQ, and CTA.
- VERIFIED: implementation uses existing `MENU_THEMES` and `COMMERCIAL_PLANS`; no parallel product data or backend contract was introduced.
- VERIFIED: no new external images are required for this slice.
- UNKNOWN: local/browser visual verification and GitHub Quality execution for PR #206.
- BLOCKED / NON-BLOCKING: Vercel remains rate-limited; no deployment was performed.

### Exact Next Task

Review PR #206 quality evidence and final diff; if clean, prepare one controlled merge to `main`. Production deployment remains a separate release-stage action.
