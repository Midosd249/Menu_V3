## 2026-09-22 — Signal Table QR Image Priority — CLOSED / VERIFIED
- VERIFIED: PR #245 was merged into `main` as `8adde6f57063f3d4117465f4130cc134b48b5cd8`.
- VERIFIED: the existing responsive `srcset`/`sizes` delivery contract is preserved.
- VERIFIED: `MenuMedia` now accepts explicit `fetchPriority` without changing fallback behavior.
- VERIFIED: Editorial / Signal Table promotes only the first two Featured images and only the first two product images in the initial unfiltered category view to eager/high priority; the remaining product images stay lazy.
- VERIFIED: PR #245 Quality run #2260 passed; W9 Orders QA #488 passed; Vercel PR preview status passed.
- VERIFIED: no database, auth, RLS, tenant-data, order, subscription, or theme-architecture changes were introduced.
- UNKNOWN: physical QR/device waterfall and LCP evidence for the real `saudi-shopping-world` tenant.
- UNKNOWN: Production deployment of `8adde6f57063f3d4117465f4130cc134b48b5cd8`; current main Vercel status was still pending at continuity update time.

# PROJECT STATE

## Identity
- Status: RELEASE_STAGE_VERIFIED_WITH_DEVICE_QA_PENDING.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Verified Position — 2026-09-22
- VERIFIED: canonical `main` HEAD is `8adde6f57063f3d4117465f4130cc134b48b5cd8`.
- VERIFIED: PR #245 Signal Table QR image-priority remediation is merged; PR #235 RLS remediation and PR #236 continuity reconciliation remain merged.
- VERIFIED: GitHub Quality #2260 passed; W9 Orders QA #488 passed.
- UNKNOWN: Production deployment for `8adde6f57063f3d4117465f4130cc134b48b5cd8`; no manual deployment was triggered.
- VERIFIED: Production root returned HTTP 200.
- VERIFIED: valid-format nonexistent public menu returned HTTP 404.
- VERIFIED: no runtime error clusters were found in the selected last-1-hour Production window.
- VERIFIED: the seven audited server-only tables remain RLS-enabled with no client policies and server-side access verified.
- UNKNOWN: physical Android/iOS/QR/device QA for current `main`.
- REMAINING SECURITY WARNINGS: one mutable function `search_path` warning and one Auth leaked-password-protection warning remain separate scoped findings.

## Current Release Boundary
Production identity and basic HTTP/runtime release verification are now closed for current `main`. Physical Android/iOS/QR/device QA is the only active release-stage evidence gap. Separate Supabase warnings are documented and are not silently changed.

## Current Verified Position — 2026-09-20
- VERIFIED: GitHub `main` is now at `be7b79e5dec7d569aed1828e4376f57a8cbf9507` after merged PR #223.
- VERIFIED: PR #223 `redesign: replace Editorial with Canva-derived Canvas menu` was merged with squash after GitHub Quality and W9 Orders browser checks passed.
- VERIFIED: Quality run for PR #223 passed route generation, typecheck, full tests, W7.4–W7.10 contracts, lint, production build, Playwright installation, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, performance diagnostics, and cleanup.
- VERIFIED: W9 Orders browser QA for PR #223 passed.
- VERIFIED: the previous Editorial/Atelier presentation was replaced rather than incrementally patched.
- VERIFIED: the new Editorial Canvas system is data-driven and preserves tenant/branch data, search, category filtering, product details/options, cart/order, analytics, bilingual routing, and existing server-side trust boundaries.
- VERIFIED: `src/theme-editorial-atelier.css` was retired and replaced by `src/theme-editorial-canvas.css`.
- VERIFIED: Editorial now uses the owner-supplied warm-paper/ink/lime/copper visual direction, with mobile-safe product geometry and explicit Arabic/LTR wrapping rules.
- UNKNOWN: physical Android/iOS rendering and QR camera evidence for this newly merged theme.
- UNKNOWN: current Production deployment identity for `be7b79e5dec7d569aed1828e4376f57a8cbf9507`; no Production deployment was requested or performed in this task.

## PH Lifecycle — Completed

PH-01 through PH-06 are completed historical milestones. No additional PH milestone is currently defined.

## PH-01 — Self-Serve Customer Lifecycle — CLOSED / VERIFIED / MERGED
PR: #170
Merge commit: `7e91778bfafa67b24efd1edf4387e1f3014fae9d`

### Customer lifecycle contract
- New customer: Home → Registration → secure workspace provisioning → Studio.
- New customers do not depend on a manual approval/request queue before entering the product.
- Existing customer: Home → Login → email OR phone + password → existing workspace / Studio.
- Platform Admin customer control remains centered on `/admin/users` and is server-authorized.
- Tenant and branch isolation, fail-closed provisioning, authentication, authorization, and server-side trust boundaries remain protected.

### Legacy retirement
- Legacy Leads / Service Requests are removed from the active Platform Admin customer lifecycle surface.
- The previous approval/request gating dependency was retired rather than merely hidden.
- Legacy request-record/trigger cleanup included in PR #170 is recorded as completed in the PR scope.
- No replacement approval queue was introduced.

### Platform Admin
- `/admin/users` remains the supported customer-control surface.
- Legacy Service Requests / Leads are not the customer lifecycle control surface.
- Admin navigation and route behavior were corrected and verified during the PR work.

### Verification
- VERIFIED BY MANUS REPORT: Quality gates passed for the final PH-01 batch.
- VERIFIED BY MANUS REPORT: W9 Orders QA passed.
- VERIFIED FROM GITHUB: merge commit is verified.
- Manus reported that a prior local TypeScript/baseUrl check failed because of a local toolchain/version mismatch; official CI was the authoritative quality gate for the merged batch.

## Completed Protected Product Work
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
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for activation/measurement implementation; outcome remains pending meaningful real exposure.
- R7 evidence review — IN PROGRESS / NON-BLOCKING while exposure remains insufficient.
- R8.1–R8.5 Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir theme hardening — CLOSED / VERIFIED / MERGED.
- W7.1–W7.12 internal product experience work — CLOSED / VERIFIED for implemented scope; physical Android/iOS QA remains release-stage evidence.
- W8 Internal Visual System — DONE / VERIFIED for implemented scope; its draft PR history remains protected separately.

## Production / Release Gates
- VERIFIED: GitHub `main` contains the PH-01 merge and protected prior work.
- VERIFIED: GitHub `main` now contains PR #172 homepage runtime fix.
- UNKNOWN: physical real-device Production QA for the latest `main`.
- UNKNOWN: current Production environment-variable values.
- BLOCKED / NON-BLOCKING: the PR #172 Vercel deployment attempt was rate-limited by the known free daily deployment quota; no retry was performed.
- Do not use Vercel as an iteration loop or trigger unnecessary deployment retries.

## Current Strategic Direction
The current Activation workstream is closed; the repository is awaiting the owner's next explicitly scoped task.

```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
→ Experiments
→ Guest Relationships
→ Customer Self-Serve Lifecycle
→ Existing implemented commercial/admin capabilities
```

Do not turn the product into a generic AI chatbot, POS, accounting system, or autonomous restaurant operator.

## Continuity Rule
At the end of every atomic task:
1. reconcile Git head against GitHub `main`;
2. distinguish implementation, CI, deployment, and device evidence;
3. update continuity files when canonical state changes;
4. record exactly one next authorized task;
5. never infer authorization for deferred payment/commercial work.

## 2026-09-18 — A.3 Implementation — CLOSED / VERIFIED
- VERIFIED: runtime implementation is on `feat/a3-session-order-attribution-2026-09-18`.
- VERIFIED: final implementation head before squash merge is `e1d406edb4def53355d7e6c623b70108a5940a9d`.
- VERIFIED: canonical `main` is `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: no production deployment was performed.
- VERIFIED: GitHub Quality run `35344719541` and W9 Orders QA run `35353500533` passed.

## 2026-09-17 — Homepage Runtime Regression — CLOSED / VERIFIED
- VERIFIED: PR #172 fixed the public homepage `React.Children.only` crash.
- VERIFIED: root cause was multi-child `Button asChild` composition: `Link` plus trailing `ArrowUpLeft` icon.
- VERIFIED: `src/components/ui/button.tsx` now uses Radix `Slottable` for multi-child `asChild` composition.
- VERIFIED: `tests/public-pages-themes-contract.test.mjs` contains regression protection.
- VERIFIED: Quality run `35266109690` and W9 Orders QA `35266109691` passed.
- VERIFIED: merge commit is `8050d2f08a2904f5ee2d9085454c47bdba601392`.
- UNKNOWN: physical real-device Production QA for the latest main.
- Durable incident record: `docs/project-memory/2026-09-17-homepage-react-children-only.md`.

## A.1 — Customer Journey & Event Truth Audit — CLOSED / VERIFIED
- VERIFIED: audit completed against repository baseline `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27` and live Supabase.
- VERIFIED: no runtime code, schema, auth/RLS, theme, or deployment changes were made.
- VERIFIED: audit: `docs/audits/2026-09-18-a1-customer-journey-event-truth-audit.md`.
- VERIFIED: A.2 implementation is on branch `feat/a2-minimal-journey-instrumentation-2026-09-18` at `fb3b27218fcd8f732b0a2472ff72b2420e067b02`.
- VERIFIED: PR #191 is CLOSED / SUPERSEDED by PR #192.
- VERIFIED: A.2 adds canonical `search`, `category_view`, and `add_to_cart` events to `menu_events` with tenant-scoped category validation/storage.
- VERIFIED: GitHub Quality run `35340567488` passed; W9 Orders QA run `35340567487` passed.
- VERIFIED: no production deployment or synthetic traffic was used.
- VERIFIED: remaining gaps are authoritative event → order linkage, cart-open measurement, and the existing `menu_events.session_id` nullability mismatch.
- BLOCKED: Supabase security advisor reports RLS disabled on six live tables; separate security task required.
- UNKNOWN: physical Production device QA, current Production environment values, sufficient real R6 exposure.

## A.2 — Minimal Journey Instrumentation — CLOSED / VERIFIED BY CI
- Scope was limited to search/category/add-to-cart measurement.
- Canonical `menu_events` was extended; no parallel analytics stream was introduced.
- Existing tenant/branch validation, product ownership validation, R6 experiment semantics, Owner Analytics, Growth, Reports, R2–R9, and public-menu architecture were preserved.
- Focused regression coverage was added for the server contract and all live public renderer families.
- Quality and W9 Orders CI passed on the final head.

## A.3 — Server-Controlled Anonymous Session → Order Attribution — CLOSED / VERIFIED BY CI
- VERIFIED: implementation branch `feat/a3-session-order-attribution-2026-09-18`.
- VERIFIED: final implementation head before squash merge is `e1d406edb4def53355d7e6c623b70108a5940a9d`.
- VERIFIED: canonical `main` is `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: PR #192 is CLOSED / MERGED at `42f0a7e3caf8939b28672685ac2d578578c9d90c`.
- VERIFIED: server-issued `__Host-menu_v3_sid` is opaque, HttpOnly, Secure, SameSite=Lax, host-only, bounded, and server-validated.
- VERIFIED: canonical `menu_events` now receives the server-resolved session; public event calls no longer accept client-supplied `sessionId`.
- VERIFIED: public orders attach `anonymous_session_id` only from a valid server-issued tenant-bound session.
- VERIFIED: tenant/session consistency is enforced by a composite foreign key at the database boundary.
- VERIFIED: historical orders/events remain untouched; no retroactive relinking was introduced.
- VERIFIED: existing order validation, pricing, rate limiting, idempotency, and status-event flow remain protected.
- VERIFIED: GitHub Quality run `35353500574` passed after the final R6 experiment-session alignment correction.
- VERIFIED: GitHub W9 Orders QA run `35353500533` passed.
- VERIFIED: typecheck, full tests, lint, production build, public all-theme browser QA, Studio browser QA, Platform Admin browser QA, and performance stages passed in Quality.
- VERIFIED: no production deployment occurred.
- UNKNOWN: physical real-device QA and live production cookie behavior.
- BLOCKED / NON-BLOCKING: Vercel PR status failed because the connected Vercel account hit its build/deployment rate limit; no retry was performed.

## Exact Next Task
**Owner visual/device QA of the merged Editorial Canvas theme — inspect the Arabic mobile menu first (360–430px), then desktop and English LTR, with QR entry, search/category, product details/options, cart/order, and fixed-cart coverage.**

Do not deploy to Production automatically and do not begin another redesign until this QA is reviewed.

## 2026-09-18 — A.4 International Boundary Audit — CLOSED / VERIFIED
- VERIFIED: A.4 was authorized explicitly and audited against canonical `main` at `1cb3cce08f544e295ab550fa70e8123bf2fc7b1a`.
- VERIFIED: audit record: `docs/audits/2026-09-18-a4-international-boundary-audit.md`.
- VERIFIED: no runtime, schema, auth, RLS, theme, or deployment changes were made.
- VERIFIED: Menu V3 is Saudi-first but not fundamentally Saudi-architected; tenant country/currency are represented as data, while several formatting and lifecycle seams remain Saudi-bound.
- VERIFIED: largest technical gap identified is inconsistent explicit time-zone handling; reusable currency formatting also remains SAR-specific.
- VERIFIED: Saudi self-serve phone onboarding is an intentional commercial/security boundary and was not broadened.
- VERIFIED: external i18n research covered W3C Internationalization, Unicode CLDR, and JavaScript Intl guidance.
- UNKNOWN: local runtime/browser/device behavior for any future implementation derived from A.4.
- BLOCKED: no blocker for the audit itself; production deployment was not part of A.4.


## 2026-09-18 — A.5 Public Shareability / Deep-Link Audit — CLOSED / VERIFIED
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
- VERIFIED: PR #196 `fix: unify public discovery and establish route-level 404s` merged into `main` at `b98e3e1ae832c389157de2205979be4801fce63b`.
- VERIFIED: `server/middleware/seo-discovery.ts` is the sole active owner of `/robots.txt` and `/sitemap.xml`; superseded `src/lib/seo/crawl.ts` and PWA ownership were removed.
- VERIFIED: canonical sitemap retains locale-aware branch URLs, reciprocal `hreflang` alternates where English content exists, and deterministic duplicate suppression.
- VERIFIED: both public route variants now throw TanStack Router `notFound()` for `getPublicMenu` `not_found` results.
- VERIFIED: Quality run `35363323737` passed; W9 Orders QA run `35363323728` passed.
- BLOCKED / NON-BLOCKING: Vercel remains rate-limited; no deployment or retry was performed.
- UNKNOWN: direct production HTTP verification of invalid public URLs and physical real-device QA remain release-stage evidence.
- Protected public themes, ordering, analytics, tenant/branch isolation, auth/RLS boundaries, and deployment policy were not redesigned or weakened.

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


## 2026-09-19 — Homepage Redesign + Permanent Innovation Workflow — IMPLEMENTATION IN PROGRESS

- VERIFIED: owner explicitly authorized homepage implementation after the documented planning/approval gate.
- VERIFIED: implementation branch `feat/homepage-redesign-innovation-2026-09-19` is based directly on canonical `main` at `6c0ac3ffef3501698ecc2b93551d7d5f928896cb`.
- VERIFIED: PR #206 is open and targets `main`.
- VERIFIED: homepage runtime scope is limited to `src/routes/index.tsx` and `src/routes/index.css`, plus focused regression coverage.
- VERIFIED: a permanent `Research, Innovation & Creative Intelligence Agent` was added at `docs/agents/research-innovation-creative-agent.md` and wired into `docs/automatic-specialist-routing.md`.
- VERIFIED: fresh research was recorded in `docs/design-research-log.md`, including current Land-book discovery, W3C Arabic/RTL guidance, and Google page-experience guidance.
- VERIFIED: no database, migrations, auth/RLS, tenant/branch isolation, ordering/cart business logic, theme renderer, or Vercel configuration was changed.
- VERIFIED: no new external homepage asset is required; the implementation uses existing theme previews plus CSS product-proof compositions.
- VERIFIED: illustrative Studio metrics are intentionally non-numeric to avoid presenting fabricated customer data.
- UNKNOWN: local typecheck/lint/build/browser execution; the environment could not resolve GitHub for a local clone.
- UNKNOWN: GitHub Actions Quality run for PR #206; the connector currently reports no workflow run for the head commit.
- BLOCKED / NON-BLOCKING: Vercel status on the branch is failure due to the documented build-rate-limit surface; no deployment/retry was performed.
- Implementation status: `IMPLEMENTATION_IN_PROGRESS` pending quality evidence and final diff review.
- Deployment status: `DEPLOYMENT_BLOCKED` / no deployment performed.

### Exact Next Task

Review PR #206 quality evidence and final diff; if CI/browser gates are clean, prepare the homepage batch for one controlled merge to `main`. Do not deploy automatically.


## 2026-09-19 — Homepage Redesign + Innovation Workflow — VERIFIED / MERGED

- VERIFIED: PR #206 is merged into canonical `main`.
- VERIFIED: merged `main` commit is `0f2f145b64d41f670ee2508582f76e2196b53b67`.
- VERIFIED: `Menu V3 Quality` run #2097 passed: route generation, typecheck, 319 tests, W7 contract suites, lint, production build, Playwright/browser template QA, Studio/Platform Admin responsive browser QA.
- VERIFIED: `Menu V3 W9 Orders QA` run #357 passed.
- VERIFIED: the homepage implementation remains limited to presentation, focused regression coverage, permanent innovation workflow, research record, and continuity documentation; protected backend/auth/RLS/tenant/branch/order/theme boundaries were not changed.
- VERIFIED: permanent `Research, Innovation & Creative Intelligence Agent` is now stored in the repository and wired into specialist routing.
- BLOCKED / NON-BLOCKING: Vercel status remains rate-limited by `api-deployments-free-per-day`; no production deployment was performed.
- UNKNOWN: physical-device production QA for the new homepage and the exact currently deployed production SHA.
- Implementation status: `DONE` for the authorized homepage implementation slice.
- Deployment status: `DEPLOYMENT_BLOCKED` / no deployment performed.

### Exact Next Task

Release-stage production verification of the merged homepage on the permitted deployment window, followed by the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not start another redesign before this verification.

## 2026-09-19 — Commercial Packaging + Arabic Homepage Refinement — CLOSED / VERIFIED

- VERIFIED: PR #208 merged into `main` at `df2569e92e25380c6fc4957eba8b2d96353bd1f9`.
- VERIFIED: Free commercial limit is now 20 products, 1 branch, and 2 team members.
- VERIFIED: Growth remains 49 SAR/month, 490 SAR/year, 3 branches, 300 products, and 10 team members.
- VERIFIED: Pro remains 149 SAR/month, 1,490 SAR/year, 10 branches, unlimited products, and 25 team members.
- VERIFIED: plan-specific commercial feature packaging is now represented by `COMMERCIAL_PLAN_FEATURES` and surfaced on the public homepage and `/pricing`.
- VERIFIED: the homepage no longer exposes the Pro `Number.MAX_SAFE_INTEGER` sentinel; Pro is displayed as unlimited products.
- VERIFIED: Arabic homepage menu proof was refined to restaurant-native wording: `كبسة لحم نجدية`, a specific culinary description, and a more natural second dish example.
- VERIFIED: two owner-supplied homepage image paths are wired with CSS fallbacks:
  - `public/homepage/menu-cover.webp`
  - `public/homepage/menu-dish.webp`
- VERIFIED: database migration `migrations/20260919050000_commercial_packaging_correction.sql` updates the Free limits at the server/database boundary.
- VERIFIED: server-side subscription fallback values were aligned to 20 products / 2 team members.
- VERIFIED: Quality run #2103 passed typecheck, tests, W7 contract suites, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin browser QA, and responsive QA.
- VERIFIED: W9 Orders QA run #361 passed.
- VERIFIED: the first Quality run #2102 failed only because one existing commercial test still expected the old Free team limit of 3; the test was corrected and run #2103 passed.
- UNKNOWN: the two final owner artwork files have not been added to the repository yet.
- UNKNOWN: direct production deployment identity for `df2569e92e25380c6fc4957eba8b2d96353bd1f9` is not claimed by this task; no Vercel deployment was intentionally triggered.
- Implementation status: `DONE`.
- Deployment status: `UNKNOWN` / no deployment performed by this task.

### Exact Next Task

Owner supplies the two final homepage images and places them at the documented paths, then perform one controlled release verification against the merged `main` commit. Do not redesign the homepage again.


## 2026-09-19 — Homepage Realistic Visuals — CLOSED / VERIFIED

- VERIFIED: PR #213 `feat: add realistic homepage menu and analytics visuals` merged into canonical `main`.
- VERIFIED: merge commit: `ccf25a80f9f3f6000cebed8c2b3d8162edfd3f24`.
- VERIFIED: homepage visual assets were added by the merged PR, including the menu cover/dish imagery, realistic analytics preview, and five theme preview WebP assets.
- VERIFIED: homepage source wiring changed in `src/routes/index.tsx` and `src/routes/index.css`; protected backend/auth/RLS/tenant/branch/order boundaries were not part of the PR diff.
- VERIFIED: PR head had successful Vercel status before merge; no unresolved review threads were present.
- UNKNOWN: physical-device visual QA of the merged homepage.
- UNKNOWN: exact current Vercel Production deployment commit.
- Implementation status: `DONE`.
- Deployment status: `UNKNOWN` / no production deployment performed by this task.

### Exact Next Task

Release-stage verification of merged `main` for the homepage, followed by the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix. Do not automatically begin another homepage redesign.


## 2026-09-20 — Live Digital Menu Homepage Closeout — VERIFIED

- VERIFIED FROM GITHUB: PR #215 `feat: publish live digital menu homepage` is CLOSED / MERGED into `main`.
- VERIFIED FROM GITHUB: merge commit is `a2e5e17178c4095f8a61def2af3e0eef8074f4fa`.
- VERIFIED FROM GITHUB: PR #215 changed only `src/routes/index.tsx` and `src/routes/index.css`.
- VERIFIED FROM GITHUB: the homepage phone mockup was replaced by a live digital-menu presentation containing restaurant identity, status/location, categories, product cards, search/cart affordances, order CTA, and bilingual AR/EN content.
- VERIFIED FROM GITHUB: the merged commit has a successful Vercel status on the PR.
- REPORTED BY MANUS / OWNER: Manus performed its quality verification and the owner independently tested the resulting homepage. These are owner-reported/manual evidence, not a substitute for direct CI or production evidence where those are still UNKNOWN.
- VERIFIED FROM PR #215: the implementation report states local typecheck, 25 contract tests, and production build passed before merge.
- VERIFIED FROM GITHUB: no unresolved review threads or submitted review blockers are present on PR #215.
- UNKNOWN: direct current Vercel Production deployment identity for `a2e5e17178c4095f8a61def2af3e0eef8074f4fa` is not established by the available GitHub evidence.
- UNKNOWN: physical Android/iOS production verification of the latest `main`, including QR scanning, theme rendering, ordering, RTL/LTR, and print preview.
- NON-BLOCKING: R7 experiment evidence remains pending meaningful real exposure.
- SEPARATE SECURITY WORK: the historical A.2 record still identifies six live RLS-disabled tables as a separate security/data task; this was not changed by PR #215.
- DEFERRED BY OWNER DIRECTION: Payment Provider, Commercial Launch, PH-07, and R10 are not prerequisites for the current activation/release sequence.

### Exact Next Task

**Release-stage verification of current `main` at `a2e5e17178c4095f8a61def2af3e0eef8074f4fa`, followed by the prepared physical Android/iOS/QR/theme/order/RTL smoke matrix, including QR single-print and multi-copy print-preview checks.**

Do not start another homepage redesign, theme redesign, product/category deep-link work, or native Web Share work before this release/device evidence is closed.


## 2026-09-20 — Public Menu Reliability / Brand Social / Image Contract — VERIFIED / READY TO MERGE

- VERIFIED: implementation branch `fix/public-menu-social-images-performance-2026-09-20` final head `b3bbf92c3fbaef52511162f2b340ea179878603d`.
- VERIFIED: Double Espresso uses repository-owned `/homepage/menu-dish.webp`; public menu removes the redundant tenant lookup while preserving server session/tenant boundaries.
- VERIFIED: Studio supports Website, Instagram, Snapchat, Facebook, and TikTok tenant links with server-side safe URL handling.
- VERIFIED: branch maps are already supported by `/studio/branches`; Brand now explicitly links to that surface and explains why map data is branch-scoped.
- VERIFIED: image uploads use a 450,000-character client/server contract with adaptive WebP compression.
- VERIFIED: local recognizable social SVG marks are used without a runtime/CDN dependency.
- VERIFIED: GitHub Quality `35477401543` passed all configured quality/browser/performance stages; W9 Orders QA `35477401542` passed.
- VERIFIED: Vercel status for the final head is success; PR #217 has no unresolved review threads or submitted reviews.
- UNKNOWN: Production deployment identity and physical Android/iOS/QR/device evidence.
- Implementation status: `PUSHED` / `VERIFIED_LOCALLY` equivalent evidence is supplied by CI; not yet merged.
- Deployment status: `UNKNOWN` / no Production deployment by this task.

### Exact Next Task

**Merge PR #217 once at verified head `b3bbf92c3fbaef52511162f2b340ea179878603d`, then verify resulting `main` and release-stage Production/device evidence.**

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


## 2026-09-20 — Editorial Atelier Replacement
- Main baseline: `5f7932df3cdf212cbf2f154b65c9c8abdf7cc2c2`.
- Branch: `redesign/editorial-atelier-premium-2026-09-20`.
- Prototype: `https://menu-v3-atelier-editorial-h5h7es.v2.appdeploy.ai/`.
- Decision: replace Editorial visual ownership with Atelier while preserving ThemeKey `editorial` and the existing renderer/business behavior.
- Protected systems untouched: auth, DB/RLS, orders, analytics, tenant/branch isolation, SEO architecture, deployment configuration.
- UNKNOWN: CI/browser/device verification until branch checks complete.

### Exact Next Task
**Run GitHub Quality/browser QA for the Atelier branch, review the diff, then perform physical Android Editorial QA before merge.**



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

### Exact Next Task
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

### Exact Next Task
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

### Exact Next Task
**Run the repository quality suite and browser visual QA for this branch at 320/375/430px Arabic RTL plus English LTR, then review the final diff and merge one coherent fix if all gates pass.**


## 2026-09-21 — SIGNAL TABLE Mobile Language / Selection Cleanup — VERIFIED / READY_TO_MERGE

- VERIFIED: PR #230 is open with head `8bbd22f28fc160359223a2902b6ae7c2ba944645`.
- VERIFIED: root cause of the missing mobile language control was the Editorial mobile rule `.signal-topbar-lang{display:none}`; it has been removed.
- IMPLEMENTED: SIGNAL TABLE now renders a dedicated bilingual language control with 🇸🇦 / 🇬🇧 target-language flags, accessible naming, preserved query state, and a mobile-safe target.
- IMPLEMENTED: the obsolete “Editor's selection / Start with these” block and hero “Signature selection” product overlay were removed; the hero now uses the configured restaurant cover or the existing identity fallback.
- IMPLEMENTED: dead SIGNAL TABLE featured-selection CSS was removed.
- VERIFIED: GitHub Quality run #2202 (`35552996462`) passed all stages, including typecheck, full tests, lint, production build, all-theme browser QA, Studio browser QA, Platform Admin/W7.10 browser QA, and performance diagnostics.
- VERIFIED: GitHub W9 Orders QA run #442 (`35552996512`) passed.
- VERIFIED: final PR diff is limited to 5 task-scoped files; no unresolved review threads remain.
- VERIFIED: Vercel status for the final PR head is successful preview/status evidence only.
- UNKNOWN: physical Android/iOS QA and current Production deployment identity for the final head.
- Deployment status: NOT_RELEASED.

### Exact Next Task

**Merge PR #230 once, verify the resulting `main` SHA, then perform the single authorized Vercel Production deployment and record the direct Production deployment identity before real-device QA.**


## 2026-09-21 — Focused Public UX / WhatsApp / Footer Pass
- VERIFIED: current task scope is recorded in docs/sessions/2026-09-21-focused-public-ux-whatsapp-footer.md.
- IMPLEMENTED: homepage demo data/media bilingual correction, Essential/Noir Featured geometry hardening, structured WhatsApp cart-order messaging/click tracking, and shared marketing/account footer.
- BLOCKED: plan-specific WhatsApp entitlement gating is deferred because the current public-menu contract does not expose a server-authoritative WhatsApp feature entitlement; no unsafe client-side gate was introduced.
- UNKNOWN: local quality commands and physical-device visual QA; GitHub PR CI/browser verification remains required.

### Exact Next Task
Run the repository Quality/test/typecheck/lint/build and browser visual verification for this branch at 320/375/430px Arabic RTL and English LTR, review the final diff, resolve only task-scoped failures, then stop.


## 2026-09-21 — Focused Public UX Follow-up — IMPLEMENTATION_IN_PROGRESS
- VERIFIED: implementation branch `feat/focused-public-whatsapp-footer-2026-09-21` is based on `main` `91b7e8e6d6b3e5e9be2070a203c501b77bde7feb`.
- IMPLEMENTED: Essential/Noir Featured cards now have explicit theme-owned title/price/copy hierarchy and a stable `#featured-heading` anchor.
- IMPLEMENTED: WhatsApp ordering is explicitly described in Free, Growth, and Pro commercial plan copy; no entitlement gate or database change was introduced.
- IMPLEMENTED: signup no longer collects brand name; `/onboarding` remains the single brand/workspace setup step.
- UNKNOWN: final CI for this follow-up until GitHub checks complete; physical Android/iOS QA remains release-stage evidence.

### Exact Next Task
Run and review the final GitHub Quality/W9 checks for the follow-up, then merge PR #232 once if all gates pass. Do not deploy automatically from this implementation task.

## Final verification — 2026-09-21
- VERIFIED: PR #232 final verified head is `6047080fcfa3e289d89538b6f28d520bbdfc7328`.
- VERIFIED: GitHub Quality #2216 passed and GitHub W9 Orders QA #454 passed.
- VERIFIED: Vercel PR status is SUCCESS preview evidence only; no Production deployment was triggered.
- BLOCKED: server-authoritative plan-specific WhatsApp entitlement remains intentionally deferred.
- UNKNOWN: physical Android/iOS QA remains release-stage evidence.

### Exact Next Task
Merge PR #232 once, verify resulting `main` SHA, then execute the single authorized Production deployment and record direct Production identity before real-device QA.

## 2026-09-22 — Main Stabilization / Security Task Reconciliation

- VERIFIED: canonical `main` is `84e0509da7de908aac3c863b093101ad4961aa81`; PR #232 is merged.
- VERIFIED: GitHub reports Vercel SUCCESS for this commit.
- UNKNOWN: direct Vercel Production deployment identity/match for this commit; no Production claim is made.
- VERIFIED: live Supabase advisor currently reports 7 RLS-disabled `menu_v3` tables: `public_order_rate_limits`, `public_order_idempotency`, `lead_onboarding`, `ai_request_rate_limits`, `menu_upsell_recommendations`, `guest_profiles`, and `anonymous_sessions`.
- VERIFIED: historical continuity records referring to six RLS-disabled tables are stale relative to the current live Supabase state.
- VERIFIED: a dedicated security task was created as GitHub Issue #233.
- VERIFIED: no RLS remediation SQL was applied; this is intentionally blocked until effective exposure, grants, and application paths are proven.
- UNKNOWN: physical Android/iOS/QR/device QA.

### Current Exact Next Task
**Physical Android/iOS/QR/theme/order/RTL smoke QA for current `main` `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.**


## 2026-09-22 — Release Verification — PRODUCTION VERIFIED / DEVICE QA PENDING

- VERIFIED: canonical `main` is `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.
- VERIFIED: Vercel Production deployment `dpl_4TFFTfLKJSFJtojrthNS85gjNWGe` is READY, target `production`, and built from `main` commit `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.
- VERIFIED: production alias `menu-v3-kohl.vercel.app` returned HTTP 200 for the root.
- VERIFIED: a valid-format nonexistent public menu slug returned HTTP 404 in Production.
- VERIFIED: Vercel reports no runtime error clusters in the selected last-1-hour production window.
- UNKNOWN: physical Android/iOS/QR/device QA.
- REMAINING SECURITY WARNINGS: `menu_v3.sync_guest_profile_from_order` mutable `search_path` and Supabase Auth leaked-password protection remain separate scoped findings.

### Current Exact Next Task
**Physical Android/iOS/QR/theme/order/RTL smoke QA for current `main` `d6e2b6e9ed13dda4a7cd82d82d4205137a4ef5e0`.**
## 2026-09-22 — Public Menu Image Performance Remediation — IN_PROGRESS

- VERIFIED: live reproduction identified a media-delivery bottleneck rather than a primary PostgreSQL query bottleneck.
- VERIFIED: the durable root-cause/remediation plan is `docs/performance/2026-09-22-public-menu-image-performance-remediation.md`.
- VERIFIED: Phase 1 branch is `perf/saudi-menu-image-delivery-2026-09-22`; PR #239 is open.
- IMPLEMENTED: safe Unsplash normalization, optimized public product media, lazy Studio thumbnails, and removal of Editorial all-product prefetch.
- UNKNOWN: Quality #2232 and W9 #464 final results.
- UNKNOWN: physical Android/browser network waterfall and LCP for the real tenant reproduction.

### Current Exact Next Task
**Review PR #239 Quality/W9 to completion, fix only task-scoped failures, then run final diff/performance review for Phase 1.**


### Verification Update — Phase 1 CI attempt
- VERIFIED: GitHub Quality run #2232 and W9 Orders QA #464 reached the new Phase 1 code and failed before full verification because `src/lib/menu/image.ts` contained an accidental literal \\n marker at line 62.
- VERIFIED: the failure was isolated from application logic and corrected in commit `8347a3204f501f6a08a085616a3e2cea10e00882`.
- UNKNOWN: CI rerun for the corrected head has not yet completed/appeared through the connected GitHub workflow surface.
- Exact Next Task: **Obtain the corrected-head CI result; if green, perform final diff review and Phase 1 performance verification; if red, fix only the reported Phase 1 issue.**


## 2026-09-22 — Final Phase 1 Continuity Update

**Public Menu Image Performance Phase 1 is VERIFIED COMPLETE. PR #239 merged as `c33d3b308b76776ec69c65abec7221f534850317`. Quality #2242 and W9 #474 passed. Exact next task: Phase 2 — Public Image Geometry and Responsive Delivery. Production deployment is NOT claimed. Real-device waterfall/LCP remains UNKNOWN.**


## 2026-09-22 — Public Menu Image Performance Phase 2 — IMPLEMENTATION COMPLETE / VERIFICATION BLOCKED

- VERIFIED: Phase 1 is already merged on main at a5073612d162d6d7d6776de6df9e422c1d6dc43e; Phase 2 branch starts directly from that SHA.
- VERIFIED: PR #241 is open against main.
- IMPLEMENTED: responsive width-descriptor srcset generation for known Unsplash URLs, with safe passthrough for arbitrary/data/blob sources.
- IMPLEMENTED: semantic media width profiles across the protected public-menu/theme surfaces, including product-card, featured-card, detail/dialog, hero/cover, and logo roles.
- IMPLEMENTED: shared/public media now emits sizes only with responsive width candidates; existing lazy/async/low-priority behavior is preserved.
- IMPLEMENTED: regression coverage for responsive source selection and updated media contracts.
- VERIFIED: no database, auth, RLS, tenant data, ordering, subscription, or deployment configuration changes.
- UNKNOWN: GitHub Quality/W9 workflow results for PR #241 are not yet exposed through the connected workflow surface; current combined status is Vercel PENDING.
- UNKNOWN: real-device 320/375/390/430px waterfall/LCP and production performance for the new head.
- Deployment status: NOT_PERFORMED.

### Exact Next Task
**Complete PR #241 verification, resolve only task-scoped failures, review the final diff, merge once if all required gates are green, verify the resulting main SHA, then stop. Do not deploy Production automatically.**


## 2026-09-22 — Public Menu Image Performance Phase 2 — VERIFIED COMPLETE

- VERIFIED: PR #241 merged once by squash as `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: resulting `main` SHA is `9c262f43970384ba71faab67f88d74fd62672bc3`.
- VERIFIED: Quality #2256 passed and W9 Orders QA #486 passed for final PR head `41f07720621486472cdf04053fdf06f53add7f3e`.
- VERIFIED: Vercel PR preview status is SUCCESS; no Production deployment was performed by this task.
- VERIFIED: final implementation is limited to responsive image source generation, public/theme media geometry profiles, regression contracts, and continuity updates.
- UNKNOWN: physical-device waterfall/LCP and Production performance for the 30-item customer test menu.

### Exact Next Task
**Run the dedicated real-device/public-menu performance evidence pass for the 30-item Saudi shopping world test menu, measuring Studio and QR/public-menu image waterfalls plus LCP at 320/375/390/430px.**
