# CURRENT VERIFIED RELEASE POSITION — 2026-09-22 — PHASE 8 CLOSED / VERIFIED

- VERIFIED: owner completed the physical Android/iOS/QR production preview and confirmed the image-performance remediation is functioning correctly.
- VERIFIED: Phase 0–7 were already CLOSED; no runtime reimplementation was required.
- VERIFIED: Production deployment `dpl_2Ypk1yKSpW4JBMMR5DjkTq2uyZqp` is READY and targets production.
- VERIFIED: deployed Production commit was `488b982e93185caf6908d4b7bf56699952f65463`.
- VERIFIED: GitHub Quality/W9 evidence passed for the release closeout.
- VERIFIED: production root returned HTTP 200 with Arabic RTL output and no selected last-24-hour runtime error clusters.
- VERIFIED: owner physical preview found no blocking regression in the tested production experience.
- UNKNOWN: no additional device-side numeric LCP/waterfall measurements were captured as structured repository artifacts.
- Deployment status: DEPLOYED / VERIFIED.
- Implementation status: DONE.

## EXACT NEXT TASK

**No further work is authorized for this remediation. Phase 0–8 are CLOSED. Stop and wait for the next explicitly scoped task.**

# CURRENT PERFORMANCE REMEDIATION POSITION — 2026-09-22

- VERIFIED: canonical `main` HEAD is `99a526dc875c1ad5bf50367632f78108681454af`.
- VERIFIED: Phase 0 Evidence Lock — CLOSED.
- VERIFIED: Phase 1 Shared Image Delivery — COMPLETE / MERGED.
- VERIFIED: Phase 2 Responsive Public Media — COMPLETE / MERGED.
- VERIFIED: Phase 3 Branding / Cover Decoupling — COMPLETE / MERGED.
- VERIFIED: Phase 4 Featured Presentation Bound — COMPLETE / MERGED.
- VERIFIED: Phase 5 Public HTML / SSR Payload Reduction — COMPLETE / MERGED.
- VERIFIED: Phase 5 core merge is `45552759054f11b4b37a89caacf73c795040a955`; Phase 5 evidence instrumentation is `99a526dc875c1ad5bf50367632f78108681454af`.
- VERIFIED: Quality #2297 passed for the Phase 5 implementation; W9 Orders QA #512 passed.
- VERIFIED: Quality #2299 passed for the Phase 5 SSR document-metrics instrumentation; W9 Orders QA #518 passed.
- VERIFIED: public loader no longer serializes whole tenant/branch/category/product rows via `to_jsonb(table)`; it uses explicit public projections.
- VERIFIED: public tenant lifecycle fields not required by the browser are no longer returned in `PublicTenant`.
- VERIFIED: empty `productOptions` entries are no longer created for every product. A 30-product empty-options structural payload drops from 1,411 bytes to 2 bytes, a measured 1,409-byte reduction before HTML/script overhead.
- VERIFIED: the existing SSR `initialMenu` hydration path remains intact; no new duplicate public-menu fetch was introduced.
- VERIFIED: the performance audit now records document transfer, encoded response, and decoded/uncompressed document bytes.
- VERIFIED: CI G6 audit for the existing Editorial theme-preview fixture at 390×844 recorded document transfer 7,805 bytes, encoded 7,505 bytes, decoded 7,505 bytes. This is a CI fixture, not the real 30-item customer reproduction.
- UNKNOWN: direct post-change HTML size/LCP/waterfall for the real `saudi-shopping-world` tenant because Phase 5 was not deployed to Production and the CI fixture is not that tenant.
- UNKNOWN: physical Android/iOS/QR waterfall and LCP.
- Deployment status: NOT_PERFORMED.

## EXACT NEXT TASK

**Phase 6 — Golden Performance Fixture.**

Create a deterministic, repository-owned 30-item public-menu fixture matching the real performance characteristics needed for this remediation, then use the Phase 5 document metrics to establish repeatable HTML/document-transfer/image-request baselines. Do not re-implement Phase 1–5 unless the fixture proves a regression.


## Performance Remediation — Current Position — 2026-09-22

- VERIFIED: canonical `main` HEAD after Phase 4 continuity closeout is `93c2d8a7f4524986346f4439b5f829cb51308a95`.
- VERIFIED: Phase 0 is CLOSED.
- VERIFIED: Phase 1 is COMPLETE / MERGED.
- VERIFIED: Phase 2 is COMPLETE / MERGED.
- VERIFIED: Phase 3 is COMPLETE / MERGED at `fb4c5dba311d5f77c3bcb943f13e35cb92ab8584`.
- VERIFIED: Phase 4 is COMPLETE / MERGED at `aa1ac6ba942228e8ad2e32f6c76b485b4706ea78`.
- VERIFIED: Quality #2282 passed; W9 Orders QA #507 passed.
- VERIFIED: Phase 4 bounds dedicated Featured presentation to 6 items without changing stored `isFeatured` truth or normal product discovery.
- VERIFIED: Vercel preview status is rate-limit failure only; no Production deployment was performed.
- UNKNOWN: real-device waterfall/LCP and Production performance for the 30-item golden tenant.

## Exact Next Task

**Phase 5 — Public HTML / SSR Payload Reduction for the 30-item `saudi-shopping-world` golden case.**

Do not repeat Phase 1–4. Measure first, then reduce only unnecessary SSR/HTML payload while preserving deterministic hydration, SEO/structured data, and public-menu behavior.


# CURRENT CONTINUITY SNAPSHOT — 2026-09-22

- VERIFIED: Canonical branch: `main`.
- VERIFIED: Current `main` HEAD: `b5e5e0f7fa000b1451b605e2fb9b484cde690170`.
- VERIFIED: Phase 4 merge commit `aa1ac6ba942228e8ad2e32f6c76b485b4706ea78` is the runtime/code parent of current `main`.
- VERIFIED: Phase 4 Quality #2282 and W9 Orders QA #507 passed.
- VERIFIED: Phase 4 was not deployed to Production; current Production identity/performance for this new head is UNKNOWN.
- UNKNOWN: real-device waterfall/LCP for the 30-item golden tenant.
- VERIFIED: 7-table RLS remediation remains applied and verified.
- UNKNOWN: Physical Android/iOS/QR/device QA.
- REMAINING SECURITY WARNINGS: one mutable function `search_path` warning and one Auth leaked-password-protection warning remain separate from the closed RLS task.

## Exact Next Task

**Physical Android/iOS/QR/theme/order/RTL smoke QA for current `main` `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.**

## Protected / Not Next

- Do not start another theme, homepage redesign, or unrelated feature.
- Do not reopen the completed 7-table RLS remediation without new evidence.
- Do not start Payment Provider / Commercial Launch / PH-07 / R10 prerequisite work.
- Treat the two remaining Supabase warnings as separate scoped security tasks.

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

## Historical Next Task
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

## Historical Next Task
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

### Historical Next Task

Review PR #206 quality evidence and final diff; if clean, prepare one controlled merge to `main`. Production deployment remains a separate release-stage action.


## 2026-09-19 — Homepage Implementation Slice — COMPLETE

- VERIFIED: PR #206 merged into `main` at `0f2f145b64d41f670ee2508582f76e2196b53b67`.
- VERIFIED: Quality run #2097 passed and W9 Orders QA run #357 passed.
- VERIFIED: homepage redesign and permanent innovation workflow are now in canonical `main`.
- BLOCKED / NON-BLOCKING: Vercel deployment is still rate-limited; no deployment was performed.

### Historical Next Task

Release-stage production verification of the merged homepage, then physical Android/iOS/QR/theme/order/RTL smoke QA.

## 2026-09-19 — Homepage Realistic Visuals — CLOSED / VERIFIED

- VERIFIED: PR #213 `feat: add realistic homepage menu and analytics visuals` was merged into canonical `main`.
- VERIFIED: merge commit: `ccf25a80f9f3f6000cebed8c2b3d8162edfd3f24`.
- VERIFIED: PR #213 changed only homepage presentation/assets: realistic menu cover/dish imagery, realistic Studio analytics preview, theme preview imagery, and related homepage wiring in `src/routes/index.tsx` / `src/routes/index.css`.
- VERIFIED: GitHub combined status for PR head reported `Vercel: success` before merge.
- VERIFIED: PR diff was ahead of the prior `main` by 2 commits and included the expected homepage asset/source changes.
- UNKNOWN: physical-device visual QA of the merged homepage.
- UNKNOWN: current Vercel Production deployment identity for merge commit `ccf25a80f9f3f6000cebed8c2b3d8162edfd3f24`.
- Implementation status: `DONE`.
- Deployment status: `UNKNOWN` / no production deployment performed by this task.

### Historical Next Task

Release-stage verification of the merged homepage when the deployment window is available, followed by the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not redesign the homepage again before verification.


## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — VERIFIED / READY TO MERGE

- VERIFIED: implementation is complete on branch `fix/public-menu-social-images-performance-2026-09-20`.
- VERIFIED: final head `b3bbf92c3fbaef52511162f2b340ea179878603d`.
- VERIFIED: GitHub Quality run `35477401543` passed typecheck, full tests (319/319), W7.4–W7.10 contracts, lint, production build, Playwright/Chromium, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup.
- VERIFIED: W9 Orders QA run `35477401542` passed.
- VERIFIED: Vercel status for final head is `success`.
- VERIFIED: final diff and PR #217 were reviewed; no unresolved review threads or submitted reviews.
- VERIFIED: branch map links remain branch-scoped in `/studio/branches`; Brand now provides an explicit navigation link to `Manage branches & map` instead of duplicating branch location data.
- UNKNOWN: Production deployment identity and physical Android/iOS/QR/device evidence until release-stage verification.

### Historical Next Task

Merge PR #217 once using the verified head `b3bbf92c3fbaef52511162f2b340ea179878603d`, then verify the resulting `main` SHA and release-stage Production/device evidence.

## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — MERGED / RELEASE-STAGE PENDING

- VERIFIED: PR #217 merged successfully into `main` at `679f72aca993f5a8001ef5f158877b2c48b79265` from verified head `e82d2652a1cc9f4d69f1e73ff9efc6dbf9a8a98b`.
- VERIFIED: Quality rerun `35477790515` completed successfully; typecheck, tests, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup all passed.
- VERIFIED: PR #217 had no unresolved review threads and no submitted reviews.
- VERIFIED: GitHub reports Vercel status `pending` for merged `main`; this is not Production deployment evidence.
- UNKNOWN: direct Production deployment identity/status and physical Android/iOS/QR/theme/order/RTL verification.
- Implementation status: `PUSHED` / merged to `main`.
- Deployment status: `UNKNOWN` / release-stage verification pending.

### Historical Next Task

**Release-stage verification of `main` at `679f72aca993f5a8001ef5f158877b2c48b79265`, then the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not start another redesign or feature task before this evidence is closed.**


## 2026-09-20 — Release Verification — PRODUCTION DEPLOYED / DEVICE QA PENDING

- VERIFIED: canonical `main` is `1fcb287072c47746e5f0a7a4a376a87783ab74e5` after continuity PR #218.
- VERIFIED: Vercel Production deployment `dpl_21u9f1K7ninyd6JBi5ayrJJ8TekF` is `READY`, target `production`, and is built from `main` commit `1fcb287072c47746e5f0a7a4a376a87783ab74e5`.
- VERIFIED: GitHub Vercel status for `main` is `success`.
- VERIFIED: Production runtime-error aggregation reports no runtime errors in the selected last-1-hour window.
- VERIFIED: PR #217 implementation is therefore present in a Vercel Production deployment; no additional deployment was intentionally triggered.
- UNKNOWN: physical Android/iOS QR scanning, all-theme visual rendering, ordering, RTL/LTR, and QR print-preview evidence on real devices.
- NOTE: direct deployment URL fetch is protected by Vercel authentication, so no anonymous HTTP page-content verification was claimed from that check.

### Historical Next Task

**Physical Android/iOS production QA — execute the prepared QR/theme/order/RTL smoke matrix, including QR single-print and multi-copy print-preview checks, against `main` `1fcb287072c47746e5f0a7a4a376a87783ab74e5`.**


## 2026-09-20 — Editorial Atelier Replacement — IN PROGRESS
- VERIFIED: main baseline is `5f7932df3cdf212cbf2f154b65c9c8abdf7cc2c2`.
- VERIFIED: owner screenshots show unresolved Editorial runtime defects after PR #220.
- VERIFIED: AppDeploy Atelier prototype is ready.
- IMPLEMENTED: old Editorial presentation files were replaced by `src/theme-editorial-atelier.css`; legacy shared Editorial selectors are being removed.
- UNKNOWN: GitHub Quality/browser/device verification.

### Historical Next Task
**Run GitHub Quality/browser checks for `redesign/editorial-atelier-premium-2026-09-20`, review the diff, then perform real-device Editorial Arabic/English QA before merge.**



## 2026-09-20 — Editorial Atelier Replacement — CLOSED / VERIFIED / MERGED

- VERIFIED: PR #221 `redesign: replace Editorial with Atelier premium system` was merged into `main`.
- VERIFIED: merge commit / current `main` HEAD at implementation closeout: `bff4a03be234f3d011f35c935cc0ee57746b5a2d`.
- VERIFIED: the prior Editorial presentation stack was replaced by the scoped `src/theme-editorial-atelier.css` owner while ThemeKey `editorial` and the existing `contemporary-restaurant` renderer were preserved.
- VERIFIED: legacy Editorial presentation files `src/theme-editorial.css` and `src/theme-editorial-hardening.css` were removed; Editorial selectors were removed from shared legacy layers.
- VERIFIED: Quality run `35490043010` succeeded on retry attempt 2, including typecheck, tests, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin browser QA, and performance/diagnostic stages.
- VERIFIED: W9 Orders QA run `35489610007` succeeded on the Atelier implementation head before merge.
- VERIFIED: PR #221 had no unresolved review threads.
- VERIFIED: GitHub combined status for the implementation merge commit is successful; Vercel reports success for `bff4a03be234f3d011f35c935cc0ee57746b5a2d`.
- UNKNOWN: whether that successful Vercel deployment is the current Production deployment identity versus a non-production deployment; no direct Production identity was established here.
- UNKNOWN / EXTERNAL: physical Android/iOS QA of the merged Atelier public menu, including QR scanning and real-device typography, remains unverified.
- Note: the first Quality attempt failed in an unrelated Studio responsive Playwright run with an execution-context-destroyed navigation race; the failed job was rerun without code changes and passed completely.

### Historical Next Task
**Physical Android QA of merged Atelier Editorial — repeat the owner's failing Arabic/English mobile cases and verify QR/public-menu rendering, RTL/LTR, title/price geometry, fixed actions, search/categories, cart/order, and configured external actions.**


## 2026-09-20 — SIGNAL TABLE Public Menu Redesign — IMPLEMENTATION_IN_PROGRESS

- VERIFIED: owner explicitly authorized the SIGNAL TABLE redesign execution.
- VERIFIED: task baseline main SHA: `6544be33126b13501b15b483ec56e997eaa44117`.
- VERIFIED: existing ThemeRenderer / contemporary-restaurant family is the presentation boundary; no new public-menu data/order/auth architecture was introduced.
- IMPLEMENTED: `src/components/templates/signal-table.tsx` and `src/theme-signal-table.css` provide the new scoped presentation owner.
- IMPLEMENTED: Editorial theme now renders through `SignalTableTemplate`; obsolete Canvas presentation stylesheet is removed.
- IMPLEMENTED: Signature Stage, cuisine rail, menu stream, focused detail, conditional Order Bar, RTL/LTR direction handling, and existing configured actions are preserved within the current contracts.
- IMPLEMENTED: no decorative product/category numbering or CSS counters exist in the new presentation.
- VERIFIED: Font Pairing and Color Designer were used for typography/palette validation only; no paid/unknown-cost dependency was introduced.
- UNKNOWN: local command execution, GitHub Quality/browser result, physical-device visual QA, accessibility/performance evidence, and production deployment identity.
- Deployment status: UNKNOWN / not deployed by this implementation step.

### Historical Next Task
**Run GitHub Quality/browser/accessibility/performance verification for the SIGNAL TABLE branch, review the complete diff, resolve failures, then create the single coherent PR.**


### Verification Update — PR #226
- VERIFIED: PR #226 is open with current head `46ef771378fe77f62e24c83daff68c2c84ad0a71`.
- IN_PROGRESS: GitHub Quality run `35529179532` (#2160) and W9 Orders QA run `35529179546` (#403).
- UNKNOWN: final CI conclusions, physical-device visual QA, and production deployment identity.
- Exact Next Task: **Review Quality #2160 and W9 #403 to completion, resolve failures, then perform the final diff/release gate for PR #226.**


## 2026-09-20 — SIGNAL TABLE Final Verification Gate

- VERIFIED: PR #226 head is `edf6ae157c9ce81e8d8148c2616058579ba6d91f`.
- VERIFIED: GitHub Quality run #2169 completed successfully after one transient Studio browser navigation failure was rerun.
- VERIFIED: W9 Orders QA run #412 completed successfully.
- VERIFIED: Quality included typecheck, full tests, lint, production build, browser template QA, Studio/Platform browser QA, responsive QA, and performance baseline steps; all completed successfully on the final rerun.
- VERIFIED: no unresolved pull-request review threads remain.
- VERIFIED: Vercel status for the final head is successful; this is preview/status evidence only, not Production deployment evidence.
- VERIFIED: final implementation enforces no product/category numbering and no CSS counters.
- UNKNOWN: physical Android/iOS device QA and Production deployment identity.
- Implementation status: READY_TO_MERGE.
- Deployment status: NOT_RELEASED.

### Historical Next Task
**Merge PR #226 once, verify the resulting `main` SHA, then stop. Production deployment and physical-device QA remain release-stage work and are not to be started automatically.**


## 2026-09-20 — SIGNAL TABLE Mobile Product Card Structural Remediation

- VERIFIED: current `main` before this task is `fb4dc99b1d8275cde9fddbd8256f3f3046285496`.
- VERIFIED: the supplied screenshot demonstrates a public-menu mobile product-card failure in the SIGNAL TABLE presentation.
- VERIFIED: current source had a `signal-product-topline` that placed title and price in competing grid columns; this violated the required hierarchy.
- VERIFIED: current source also used a proportional media track and absolute quick-add positioning.
- IMPLEMENTED: product-card DOM now keeps image + protected text column, with title → description → price in normal document flow.
- IMPLEMENTED: media is fixed `92px × 92px` on mobile; text column is explicitly shrinkable; title and description are clamped to two lines; price is isolated and non-wrapping.
- IMPLEMENTED: featured-card information flow was aligned to title → description → price as well.
- IMPLEMENTED: quick-add/options are in-flow rather than absolutely overlaid.
- IMPLEMENTED: targeted regression contracts now assert the structural hierarchy and reject the obsolete topline.
- UNKNOWN: local execution of npm commands and physical browser/device screenshots because this session does not have the repository working tree/browser runtime.
- Deployment: NOT_REQUESTED / NOT_PERFORMED.

### Historical Next Task
**Run the repository quality suite and browser visual QA for this branch at 320/375/430px Arabic RTL plus English LTR, then review the final diff and merge one coherent fix if all gates pass.**


## 2026-09-21 — SIGNAL TABLE Mobile Language / Selection Cleanup — READY_TO_MERGE

- VERIFIED: PR #230 head `8bbd22f28fc160359223a2902b6ae7c2ba944645`.
- VERIFIED: Quality #2203 and W9 #443 passed.
- VERIFIED: mobile language visibility defect was caused by an explicit mobile `display:none` rule and is corrected.
- IMPLEMENTED: language control, selection/hero cleanup, dead CSS cleanup, and regression coverage.
- UNKNOWN: physical device evidence and Production deployment identity.

### Historical Next Task
**Merge PR #230 once, verify `main`, then execute the single authorized Production deployment and record its verified SHA/identity.**


## 2026-09-21 — Focused Public UX / WhatsApp / Footer Pass
- VERIFIED: current task scope is recorded in docs/sessions/2026-09-21-focused-public-ux-whatsapp-footer.md.
- IMPLEMENTED: homepage demo data/media bilingual correction, Essential/Noir Featured geometry hardening, structured WhatsApp cart-order messaging/click tracking, and shared marketing/account footer.
- BLOCKED: plan-specific WhatsApp entitlement gating is deferred because the current public-menu contract does not expose a server-authoritative WhatsApp feature entitlement; no unsafe client-side gate was introduced.
- UNKNOWN: local quality commands and physical-device visual QA; GitHub PR CI/browser verification remains required.

### Historical Next Task
Run the repository Quality/test/typecheck/lint/build and browser visual verification for this branch at 320/375/430px Arabic RTL and English LTR, review the final diff, resolve only task-scoped failures, then stop.


## 2026-09-21 — Focused Public UX Follow-up — IMPLEMENTATION_IN_PROGRESS
- VERIFIED: task is scoped to Featured card information hierarchy, all-plan WhatsApp messaging, and duplicate brand-name removal from signup.
- IMPLEMENTED: explicit Featured title/price classes and theme-owned surfaces for Essential/Noir; no new theme or z-index workaround.
- IMPLEMENTED: WhatsApp ordering copy added to every commercial plan and core feature list.
- IMPLEMENTED: signup brand-name field removed from account creation; onboarding remains the single collection point.
- UNKNOWN: final CI for this follow-up until the current PR checks complete; physical-device evidence remains release-stage.

### Historical Next Task
Review PR #232 final checks and diff, merge once if green, then perform one release deployment and real-device QA.

## Final verification — 2026-09-21
- VERIFIED: PR #232 final verified head is `6047080fcfa3e289d89538b6f28d520bbdfc7328`.
- VERIFIED: GitHub Quality #2216 passed and GitHub W9 Orders QA #454 passed.
- VERIFIED: Vercel PR status is SUCCESS preview evidence only; no Production deployment was triggered.
- BLOCKED: server-authoritative plan-specific WhatsApp entitlement remains intentionally deferred.
- UNKNOWN: physical Android/iOS QA remains release-stage evidence.

### Historical Next Task
Merge PR #232 once, verify resulting `main` SHA, then execute the single authorized Production deployment and record direct Production identity before real-device QA.


## 2026-09-22 — RLS Security Remediation — CLOSED / VERIFIED

- VERIFIED: PR #235 merged into `main` at `33bd3ea43bee5112de0d3b8d513cd1aea3a86e92`.
- VERIFIED: the repository migration `20260922080000_harden_server_only_rls_tables.sql` was applied successfully to Supabase.
- VERIFIED: all seven audited tables have RLS enabled, no client policies, and no `anon`/`authenticated` table privileges.
- VERIFIED: server-side `postgres` reads succeeded for all seven tables.
- VERIFIED: GitHub Quality #2224 and W9 Orders QA #460 passed.
- VERIFIED: Issue #233 closed.
- UNKNOWN: direct Production deployment identity and physical-device QA.


## 2026-09-22 — Release Verification — PRODUCTION VERIFIED / DEVICE QA PENDING

- VERIFIED: `main` is `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.
- VERIFIED: Vercel Production deployment `dpl_4TFFTfLKJSFJtojrthNS85gjNWGe` is READY and targets that exact `main` commit.
- VERIFIED: production root HTTP 200.
- VERIFIED: valid-format nonexistent public menu HTTP 404.
- VERIFIED: no runtime error clusters in the selected last-1-hour production window.
- UNKNOWN: physical Android/iOS/QR/device QA.

### Exact Next Task
**Physical Android/iOS/QR/theme/order/RTL smoke QA for current `main` `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.**
## 2026-09-22 — Public Menu Image Performance Remediation — IN_PROGRESS

- VERIFIED: root-cause investigation for the `saudi-shopping-world` 30-product reproduction is documented in `docs/performance/2026-09-22-public-menu-image-performance-remediation.md`.
- VERIFIED: Phase 1 implementation branch is `perf/saudi-menu-image-delivery-2026-09-22`.
- IMPLEMENTED: shared Unsplash URL normalization, optimized public product media, lazy Studio thumbnails, and removal of Editorial all-product prefetch.
- IMPLEMENTED: regression coverage in `tests/image-delivery.test.mjs` and updated public-media contract coverage.
- UNKNOWN: final GitHub Quality/W9 results for PR #239; they are currently running.
- UNKNOWN: browser/device network waterfall for the real Android reproduction.
- Exact Next Task: **Review PR #239 Quality/W9 to completion, fix only task-scoped failures, then run final diff/performance review for Phase 1.**


### Verification Update — Phase 1 CI attempt
- VERIFIED: GitHub Quality run #2232 and W9 Orders QA #464 reached the new Phase 1 code and failed before full verification because `src/lib/menu/image.ts` contained an accidental literal \\n marker at line 62.
- VERIFIED: the failure was isolated from application logic and corrected in commit `8347a3204f501f6a08a085616a3e2cea10e00882`.
- UNKNOWN: CI rerun for the corrected head has not yet completed/appeared through the connected GitHub workflow surface.
- Exact Next Task: **Obtain the corrected-head CI result; if green, perform final diff review and Phase 1 performance verification; if red, fix only the reported Phase 1 issue.**


## 2026-09-22 — Final Phase 1 Continuity Update

**Public Menu Image Performance Phase 1 is VERIFIED COMPLETE. PR #239 merged as `c33d3b308b76776ec69c65abec7221f534850317`. Quality #2242 and W9 #474 passed. Exact next task: Phase 2 — Public Image Geometry and Responsive Delivery. Production deployment is NOT claimed.**


## 2026-09-22 — Public Menu Image Performance Phase 2 — IMPLEMENTATION COMPLETE / VERIFICATION BLOCKED

- VERIFIED: Phase 1 is merged on main at a5073612d162d6d7d6776de6df9e422c1d6dc43e2; Phase 2 branch starts directly from that SHA.
- VERIFIED: PR #241 is open against main.
- IMPLEMENTED: responsive srcset width candidates and layout-specific sizes across public media roles; safe passthrough remains for non-transformable sources.
- IMPLEMENTED: regression coverage for responsive source generation and updated media contracts.
- VERIFIED: no database, auth, RLS, tenant-data, ordering, subscription, or deployment configuration changes.
- UNKNOWN: GitHub Quality/W9 results are not yet exposed; current combined status is Vercel PENDING.

### Exact Next Task
**Complete PR #241 verification, resolve only task-scoped failures, review the final diff, merge once if all required gates are green, verify the resulting main SHA, then stop.**


## 2026-09-22 — Public Menu Image Performance Phase 2 — VERIFIED COMPLETE

- VERIFIED: PR #241 merged once by squash as `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: resulting `main` SHA is `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: Quality #2256 passed and W9 Orders QA #486 passed for the final PR head `41f07720621486472cdf04053fdf06f53add7f3e`.
- VERIFIED: Vercel PR preview status is SUCCESS; this is preview evidence only.
- VERIFIED: final diff remains scoped to responsive public image delivery, its contract tests, and continuity documentation; no database, auth, RLS, tenant-data, ordering, subscription, or Production deployment configuration change was introduced.
- UNKNOWN: real-device 320/375/390/430px waterfall/LCP and Production performance for this image-delivery change.
- Deployment status: NOT_PERFORMED by this task.

### Exact Next Task
**Run the dedicated real-device/public-menu performance evidence pass for the 30-item Saudi shopping world test menu, measuring Studio and QR/public-menu image waterfalls plus LCP at 320/375/390/430px. Do not redesign or re-implement Phase 2 unless measured evidence requires it.**


## 2026-09-22 — Public Menu Image Performance Phase 3 — VERIFIED COMPLETE

- VERIFIED: Phase 1 and Phase 2 were already complete and were not reworked.
- VERIFIED: Phase 3 PR #247 merged once by squash as `fb4c5dba311d5f77c3bcb943f13e35cb92ab8584`.
- VERIFIED: public tenant `logo_url` / `cover_url` Base64 media is no longer embedded directly in the public tenant payload; public mapping uses versioned tenant-media URLs.
- VERIFIED: the tenant media endpoint is active/published gated, tenant-scoped, raster-only, cacheable and protected with `nosniff`.
- VERIFIED: Studio tenant media values remain unchanged; no schema, auth, RLS, ordering, subscription, or deployment configuration changes were introduced.
- VERIFIED: GitHub Quality #2276 and W9 Orders QA #503 passed on the final Phase 3 head.
- UNKNOWN: real-device 320/375/390/430px waterfall/LCP for the full 30-item Saudi Shopping World reproduction and Production performance after this merge.
- Deployment status: NOT_PERFORMED by this task.

### Exact Next Task
**Dedicated real-device/public-menu performance evidence pass for the 30-item Saudi Shopping World test menu: measure Studio and QR/public-menu image waterfalls plus LCP at 320/375/390/430px. Do not re-implement Phase 1–3 unless measured evidence requires it.**

## 2026-09-22 — Public Menu Image Performance Remediation — PHASE 8 CLOSED / VERIFIED

- VERIFIED: owner completed the final physical Android/iOS/QR production preview and reported that everything is good.
- VERIFIED: no blocking image-loading, public-menu, Studio, theme, RTL/LTR, or QR regression was reported from the final preview.
- VERIFIED: Phase 0–8 are now closed for this remediation; no Phase 1–7 work was repeated.
- VERIFIED: Production remains deployed from `488b982e93185caf6908d4b7bf56699952f65463` via deployment `dpl_2Ypk1yKSpW4JBMMR5DjkTq2uyZqp`.
- VERIFIED: no runtime code changes were required to close Phase 8 after owner device validation.
- UNKNOWN: structured device-side LCP/waterfall numbers were not captured into repository artifacts; this does not block closure because the owner completed the requested final preview successfully.

### Exact Next Task
**Wait for the next explicitly scoped task. Do not reopen Phase 0–8 or repeat completed performance work without new measured regression evidence.**


# CURRENT VERIFIED AI EXPANSION POSITION — 2026-09-24

- VERIFIED: Phase 1 CLOSED.
- VERIFIED: Phase 2 CLOSED / VERIFIED.
- VERIFIED: all requested credential names and pool sizes are documented and implemented server-side.
- VERIFIED: Quality #2345 passed.
- VERIFIED: W9 Orders QA #553 passed.
- VERIFIED: no secrets, runtime activation, migration, or deployment.
- UNKNOWN: live credential validity until credentials are supplied through the environment/secret store.

## EXACT NEXT TASK

**Phase 3 — execution adapters, beginning with Groq.**



## 2026-09-24 — AI Provider Expansion / Phase 3 Groq Adapter — IMPLEMENTED / LIVE SMOKE PENDING

- VERIFIED: Phase 1 and Phase 2 are closed.
- IMPLEMENTED: `src/lib/menu/ai-groq.ts` provides the dedicated Groq structured execution adapter.
- IMPLEMENTED: `src/lib/menu/ai-providers.ts` preserves the single AI boundary and routes structured Groq calls through the dedicated adapter.
- IMPLEMENTED: Groq uses the official OpenAI-compatible Chat Completions endpoint and `GROQ_API_KEY`.
- IMPLEMENTED: default model `openai/gpt-oss-20b`, configurable through `GROQ_MODEL`.
- IMPLEMENTED: bounded 60-second timeout, normalized errors, best-effort JSON Schema output, prompt-injection boundary, and fail-closed missing credential behavior.
- VERIFIED: Quality #2353 passed.
- VERIFIED: W9 Orders QA #561 passed.
- VERIFIED: Vercel Preview deployment is READY.
- UNKNOWN: live provider smoke and real provider quota/latency/error behavior because the secret value is not accessible to the connected GitHub session.
- Deployment status: Preview READY; Production NOT_PERFORMED.

### Exact Next Task

**Execute one authenticated Groq smoke request against the current Vercel Preview, record valid structured output + failure behavior, then review the final diff. Do not merge or start NVIDIA before that evidence exists.**


# 2026-09-24 — AI Provider Expansion / Phase 3 NVIDIA — IMPLEMENTED / LIVE SMOKE PENDING

- VERIFIED: owner confirmed Groq live smoke succeeds on `main`.
- IMPLEMENTED: NVIDIA structured adapter `src/lib/menu/ai-nvidia.ts` and two-key pool.
- IMPLEMENTED: default `openai/gpt-oss-120b`, optional `NVIDIA_MODEL`, bounded timeout and normalized failures.
- VERIFIED: NVIDIA remains outside multimodal routing.
- VERIFIED: no protected product/security/data boundaries changed.
- UNKNOWN: authenticated live NVIDIA behavior.

Protected / MUST NOT REDO: Groq adapter and smoke; Phase 1 registry; Phase 2 credentials; existing AI routing; Smart Menu Import; public-menu/performance phases 0–8.

## EXACT NEXT TASK
**Run the single authenticated NVIDIA structured-AI smoke on `main` with `AI_PROVIDER=nvidia`; if valid, record evidence and proceed to Cloudflare without unnecessary Vercel deployments.**
