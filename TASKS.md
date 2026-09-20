# CURRENT TASK STATE — 2026-09-20

## Current Position

- `main` HEAD: `a2e5e17178c4095f8a61def2af3e0eef8074f4fa`.
- PR #215: merged.
- Homepage live digital-menu implementation: `DONE`.
- Manus quality verification: owner-reported passed.
- Owner manual QA: owner-reported passed.
- GitHub PR Vercel status: success.
- Current Production deployment match: `UNKNOWN`.
- Physical device/QR/print-preview evidence: `UNKNOWN`.

## Exact Next Task

**Release-stage verification of current `main` at `a2e5e17178c4095f8a61def2af3e0eef8074f4fa`, followed by physical Android/iOS/QR/theme/order/RTL smoke QA, including QR single-print and multi-copy print-preview checks.**

## Not Next

- No new homepage redesign.
- No theme rebuild.
- No product/category deep-link expansion.
- No native Web Share implementation.
- No Payment Provider / Commercial Launch / PH-07 / R10 work as a prerequisite.

## Later Non-Blocking / Separate Work

- R7 evidence review remains dependent on meaningful real exposure.
- Six RLS-disabled live tables remain a separate security/data task from the A.2 audit.
# TASKS

## Current State — 2026-09-18

- VERIFIED: release-stage operational verification completed against verified main b78b69ea0921571a1ca454c30ca81a43e5cf20b5 before this documentation batch.
- VERIFIED: Vercel Production deployment was READY and matched GitHub commit b78b69ea0921571a1ca454c30ca81a43e5cf20b5 at verification time.
- VERIFIED: production root returned HTTP 200.
- VERIFIED: invalid public menu probe returned HTTP 404.
- VERIFIED: invalid branch variant returned HTTP 404.
- VERIFIED: no error/fatal runtime logs were found for the checked production deployment in the inspected 2-hour window.
- VERIFIED: production theme-testing override is hard-disabled server-side in production; no code change is justified.
- UNKNOWN: exact production environment-variable secret values.
- UNKNOWN / EXTERNAL: physical Android/iOS production QA.

## PH Lifecycle — Completed

PH-01 through PH-06 are completed historical milestones. No additional PH milestone is currently defined.

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

## A.1 — CLOSED / VERIFIED
- Customer Journey & Event Truth Audit completed.
- Audit: `docs/audits/2026-09-18-a1-customer-journey-event-truth-audit.md`.
- No runtime/schema/deployment changes.
- Verified gaps: search/category/add-to-cart measurement and direct anonymous session → order linkage.
- Live RLS-disabled tables are recorded as a separate security blocker.

## A.2 — CLOSED / VERIFIED BY CI
- Search measurement added with session-level duplicate protection.
- Category selection measurement added with tenant-scoped `category_id` validation/storage.
- Add-to-cart measurement added to all active public renderer families.
- Focused regression coverage added.
- Existing analytics, R6, order, theme, and security boundaries preserved.

## A.3 — CLOSED / VERIFIED BY CI — Server-Controlled Anonymous Session → Order Attribution
- Implementation complete on `feat/a3-session-order-attribution-2026-09-18`.
- Final head: `3dfda5e9b4dc93f4f33855595993e1ce568210a5`.
- PR #192 is CLOSED / MERGED at `42f0a7e3caf8939b28672685ac2d578578c9d90c`.
- Server-controlled `__Host-menu_v3_sid`, tenant-bound `anonymous_sessions`, server-side event attribution, and tenant-safe order attribution are implemented.
- Client-supplied canonical event session IDs are removed.
- Quality run `35344719541` and W9 Orders QA run `35353500533` passed.
- No production deployment occurred.
- Vercel preview status is rate-limit failure only; no retry was performed.

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
- VERIFIED: PR #196 merged to `main`: `b98e3e1ae832c389157de2205979be4801fce63b`.
- VERIFIED: `server/middleware/seo-discovery.ts` is the sole active discovery owner; `src/lib/seo/crawl.ts` was removed and `grok-pwa.ts` no longer handles robots/sitemap.
- VERIFIED: public tenant and branch routes now throw `notFound()` for `not_found` menu resolution.
- VERIFIED: Quality `35363323737` and W9 Orders QA `35363323728` passed.
- VERIFIED: final PR diff was reviewed before merge.
- BLOCKED / NON-BLOCKING: Vercel rate limit; no deployment/retry.
- UNKNOWN: direct production HTTP 404 verification and physical device QA.

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


## 2026-09-19 — Homepage Redesign + Innovation Workflow — IN PROGRESS

- VERIFIED: owner authorized implementation of the prepared homepage redesign.
- VERIFIED: PR #206 `feat: redesign homepage and add permanent innovation research workflow` is open.
- VERIFIED: homepage proof now covers guest journey, restaurant presence/themes, Studio/control, intelligence/growth framing, Arabic/English/mixed-direction proof, pricing, FAQ, and CTA.
- VERIFIED: permanent innovation research workflow added and connected to specialist routing.
- VERIFIED: protected backend/auth/theme/business boundaries remain untouched.
- UNKNOWN: local typecheck/lint/build/browser verification.
- UNKNOWN: GitHub Actions Quality run for PR #206; no workflow run is currently visible through the connector.
- BLOCKED / NON-BLOCKING: Vercel build-rate-limit status; no deployment or retry.
- Implementation status: `IMPLEMENTATION_IN_PROGRESS`.
- Deployment status: `DEPLOYMENT_BLOCKED` / not deployed.

### Exact Next Task

Review PR #206 quality evidence and final diff; if clean, prepare one controlled merge to `main` without deploying.


## 2026-09-19 — Homepage Redesign + Innovation Workflow — COMPLETE

- VERIFIED: PR #206 merged into `main` at `0f2f145b64d41f670ee2508582f76e2196b53b67`.
- VERIFIED: Quality run #2097 passed.
- VERIFIED: W9 Orders QA run #357 passed.
- VERIFIED: permanent Research, Innovation & Creative Intelligence workflow is now part of the repository routing contract.
- BLOCKED / NON-BLOCKING: Vercel deployment remains blocked by the free daily deployment limit; no deployment was performed.
- Implementation status: `DONE`.
- Deployment status: `DEPLOYMENT_BLOCKED`.

### Exact Next Task

Release-stage production verification of the merged homepage, then physical Android/iOS/QR/theme/order/RTL smoke QA.

## 2026-09-19 — Commercial Packaging + Arabic Homepage Refinement — CLOSED / VERIFIED

- VERIFIED: PR #208 merged into `main` at `df2569e92e25380c6fc4957eba8b2d96353bd1f9`.
- VERIFIED: Free = 20 products / 1 branch / 2 team members.
- VERIFIED: Growth = 49 SAR monthly / 490 SAR annual / 300 products / 3 branches / 10 team members.
- VERIFIED: Pro = 149 SAR monthly / 1,490 SAR annual / unlimited products / 10 branches / 25 team members.
- VERIFIED: plan-specific feature packaging is surfaced in homepage and `/pricing`.
- VERIFIED: Pro unlimited display no longer exposes the numeric sentinel.
- VERIFIED: Arabic menu examples were refined using Saudi restaurant-native wording after competitor research.
- VERIFIED: image slots are wired to `public/homepage/menu-cover.webp` and `public/homepage/menu-dish.webp`.
- VERIFIED: Quality #2103 passed all configured quality/browser stages.
- VERIFIED: W9 Orders QA #361 passed.
- UNKNOWN: final owner artwork files are not yet present.
- UNKNOWN: production deployment of this merged commit has not been performed/verified by this task.

## Exact Next Task

**Owner image placement + one controlled release verification for `df2569e92e25380c6fc4957eba8b2d96353bd1f9`.**

Do not begin another homepage redesign or commercial packaging redesign before this release verification is complete.


## 2026-09-19 — Homepage Realistic Visuals — CLOSED / VERIFIED

- VERIFIED: PR #213 `feat: add realistic homepage menu and analytics visuals` merged into `main`.
- VERIFIED: merge commit: `ccf25a80f9f3f6000cebed8c2b3d8162edfd3f24`.
- VERIFIED: expected homepage assets are present in the merged PR diff, including `public/homepage/menu-cover.webp`, `public/homepage/menu-dish.webp`, and `public/homepage-analytics-real.png`, plus the new theme preview assets.
- VERIFIED: `src/routes/index.tsx` and `src/routes/index.css` were the application source files changed by the homepage visual implementation.
- VERIFIED: PR head had successful Vercel status before merge; no unresolved review threads were reported.
- UNKNOWN: physical Android/iOS visual verification after merge.
- UNKNOWN: direct current Production deployment identity.
- Implementation status: `DONE`.
- Deployment status: `UNKNOWN` / no production deployment performed by this task.

## Exact Next Task

**Release-stage verification of `main` after PR #213, then physical Android/iOS/QR/theme/order/RTL smoke QA.**

Do not start another homepage redesign or replace these visuals again unless verification identifies a concrete defect.


## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — VERIFIED / READY TO MERGE

### Scope
- Double Espresso theme-preview image reliability.
- Public customer QR/menu loading path efficiency.
- Studio Website + Instagram + Snapchat + Facebook + TikTok registration.
- Permanent image payload-size contract for logo/cover/product uploads.
- Recognizable social brand marks and theme-compatible action presentation.
- Explicit Studio discoverability for branch-scoped map management.

### Branch
`fix/public-menu-social-images-performance-2026-09-20`

### Verification
- VERIFIED: final head `b3bbf92c3fbaef52511162f2b340ea179878603d`.
- VERIFIED: Quality `35477401543` passed typecheck, 319/319 tests, W7.4–W7.10 contracts, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, and performance/cleanup stages.
- VERIFIED: W9 Orders QA `35477401542` passed.
- VERIFIED: Vercel status is success.
- VERIFIED: no PR reviews or unresolved review threads.
- VERIFIED: map URL capability exists at `/studio/branches`; `/studio/brand` now links directly to it without duplicating branch data.
- UNKNOWN: Production deployment identity and physical-device QA.

### Exact Next Task
Merge PR #217 once, verify the resulting `main` SHA, then perform release-stage Production and physical Android/iOS/QR/theme/order/RTL smoke QA.

## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — MERGED / RELEASE-STAGE PENDING

- VERIFIED: PR #217 merged successfully into `main` at `679f72aca993f5a8001ef5f158877b2c48b79265` from verified head `e82d2652a1cc9f4d69f1e73ff9efc6dbf9a8a98b`.
- VERIFIED: Quality rerun `35477790515` completed successfully; typecheck, tests, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup all passed.
- VERIFIED: PR #217 had no unresolved review threads and no submitted reviews.
- VERIFIED: GitHub reports Vercel status `pending` for merged `main`; this is not Production deployment evidence.
- UNKNOWN: direct Production deployment identity/status and physical Android/iOS/QR/theme/order/RTL verification.
- Implementation status: `PUSHED` / merged to `main`.
- Deployment status: `UNKNOWN` / release-stage verification pending.

### Exact Next Task

**Release-stage verification of `main` at `679f72aca993f5a8001ef5f158877b2c48b79265`, then the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not start another redesign or feature task before this evidence is closed.**


## 2026-09-20 — Release Verification — PRODUCTION DEPLOYED / DEVICE QA PENDING

- VERIFIED: canonical `main` is `1fcb287072c47746e5f0a7a4a376a87783ab74e5` after continuity PR #218.
- VERIFIED: Vercel Production deployment `dpl_21u9f1K7ninyd6JBi5ayrJJ8TekF` is `READY`, target `production`, and is built from `main` commit `1fcb287072c47746e5f0a7a4a376a87783ab74e5`.
- VERIFIED: GitHub Vercel status for `main` is `success`.
- VERIFIED: Production runtime-error aggregation reports no runtime errors in the selected last-1-hour window.
- VERIFIED: PR #217 implementation is therefore present in a Vercel Production deployment; no additional deployment was intentionally triggered.
- UNKNOWN: physical Android/iOS QR scanning, all-theme visual rendering, ordering, RTL/LTR, and QR print-preview evidence on real devices.
- NOTE: direct deployment URL fetch is protected by Vercel authentication, so no anonymous HTTP page-content verification was claimed from that check.

### Exact Next Task

**Physical Android/iOS production QA — execute the prepared QR/theme/order/RTL smoke matrix, including QR single-print and multi-copy print-preview checks, against `main` `1fcb287072c47746e5f0a7a4a376a87783ab74e5`.**


## 2026-09-20 — Editorial Atelier Replacement — IN PROGRESS
- VERIFIED: branch `redesign/editorial-atelier-premium-2026-09-20` created from current main.
- VERIFIED: AppDeploy prototype is ready with no frontend/backend errors.
- IMPLEMENTED: Atelier is the new single-owner Editorial presentation direction.
- BLOCKED: repository CI/browser and real-device evidence remain outstanding.

### Exact Next Task
**Run GitHub Quality/browser checks, review the final diff, then test Atelier Editorial on a real Android viewport using the owner's failing cases.**



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

### Exact Next Task
**Physical Android QA of merged Atelier Editorial — repeat the owner's failing Arabic/English mobile cases and verify QR/public-menu rendering, RTL/LTR, title/price geometry, fixed actions, search/categories, cart/order, and configured external actions.**
