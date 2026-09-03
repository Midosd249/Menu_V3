# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.
- Active plan: `PLAN.md` — Platform Growth, Template Ecosystem, and Saudi SEO.
- Superseded plan archive: `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.

## Current Position
- T1, T2, and T3 template milestones are DONE / VERIFIED and protected.
- G1 — Public Menu SEO Foundation is DONE / VERIFIED and protected.
- **G2 — Crawl Control and Indexation is DONE / VERIFIED.**
- **G3 implementation is complete and repository verification is green; final production deployment verification is BLOCKED by Vercel build-rate limiting.**
- **Current atomic task:** finish G3 by verifying a production deployment built from the current `main` commit after the provider rate limit clears, then close G3. Do not start G4.

## G2 — Crawl Control and Indexation — CLOSED
### Implementation
- **VERIFIED:** `src/lib/seo/crawl.ts` provides deterministic `robots.txt` and XML sitemap builders with XML escaping, origin normalization, and duplicate-path elimination.
- **VERIFIED:** `server/middleware/grok-pwa.ts` serves `/robots.txt` and `/sitemap.xml` through the existing Nitro middleware.
- **VERIFIED:** sitemap database selection requires `tenants.is_active = true`, `tenants.is_published = true`, and `branches.is_active = true`, ordered deterministically.
- **VERIFIED:** sitemap output uses absolute URLs and optional `lastmod` values.
- **VERIFIED:** robots allows public pages, disallows private application surfaces, and declares `/sitemap.xml`.
- **VERIFIED:** public-menu routes enforce active/published tenant state and emit `noindex, nofollow` for missing/unavailable menu data.
- **VERIFIED:** branch routes own their canonical and Restaurant JSON-LD metadata; the parent route suppresses duplicate branch metadata.
- **VERIFIED:** `scripts/quality-workflow.test.mjs` covers robots behavior, sitemap rendering/deduplication, and the published/active sitemap SQL contract.
- **VERIFIED:** the route-id typecheck regression in `src/routes/m.$slug.tsx` is corrected by comparing the route id as a string.
- **VERIFIED:** duplicate-path sitemap handling was corrected in `e0a007a4a45362494d26ff801a833708b17d4fb7`.

### Verification Evidence
- **VERIFIED:** GitHub Actions run `33769708337` passed route-tree generation, Typecheck, Tests (66/66), Lint, Production build, Playwright installation, Browser template QA, and preview cleanup.
- **VERIFIED:** Browser template QA passed on mobile, tablet, and desktop with RTL, Arabic document language, no horizontal overflow, zero runtime console errors, accessibility-name checks, and reduced-motion support.
- **VERIFIED:** Vercel production deployment `dpl_4VUKHziJn8B3nwVTUG6mjiFksihS` is `READY` and was used for live crawler verification.
- **VERIFIED:** production aliases include `menu-v3-kohl.vercel.app`, `menu-v3-midosd2s-projects.vercel.app`, and `menu-v3-git-main-midosd2s-projects.vercel.app`.
- **VERIFIED:** live `/robots.txt` returns HTTP 200 with `Allow: /`, private-surface disallows for `/admin`, `/studio`, `/owner`, `/onboarding`, `/login`, `/invite`, and `/api/`, plus a `Sitemap` declaration.
- **VERIFIED:** live `/sitemap.xml` returns HTTP 200 with `Content-Type: application/xml; charset=utf-8`.
- **VERIFIED:** live sitemap is valid XML in the expected `<urlset>` form and contains four absolute URLs with no duplicate paths: `/m/mndy-alwtnya`, `/m/mndy-alwtnya/main-branch`, `/m/nafas`, and `/m/nafas/olaya`.
- **VERIFIED:** the live sitemap URL set is consistent with the repository contract that includes only active/published tenants and active branches; automated regression coverage verifies the eligibility predicate.
- **VERIFIED:** unavailable public-menu routes emit `noindex, nofollow` and are not represented in the verified live sitemap set.

## G3 — Saudi Local Discovery + Branch SEO
### Implementation
- **VERIFIED:** repository schema provides tenant `city`/`country`, branch name/address/Maps URL/phone/activity, and branch hours.
- **VERIFIED:** current production payload for `/m/nafas/olaya` contains `country=SA`, `city=الرياض`, branch name, Arabic/English address, Maps URL, phone, and branch hours.
- **VERIFIED:** `src/lib/menu/seo.ts` now gates local location markup on `country=SA`, non-empty verified city, branch name, and Arabic address.
- **VERIFIED:** eligible branch schema emits `PostalAddress` from verified fields only and emits `hasMap` only when the stored Maps URL is absolute HTTP(S).
- **VERIFIED:** `src/lib/menu/seo.test.ts` covers eligible Saudi branch data and incomplete location data.
- **VERIFIED:** G3 does not create a new city-directory URL family, preserving existing public menu canonical ownership and avoiding thin/doorway pages.
- **VERIFIED:** full repository quality workflow run `33782244590` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser Template QA, and preview cleanup for commit `6982c586fb0455405f04ea1625c494638bf7b1d6`.
- **VERIFIED:** the final G3 code diff against the G2 baseline is limited to `src/lib/menu/seo.ts` and `src/lib/menu/seo.test.ts`.

### Verification Blocker
- **BLOCKED:** Vercel project `menu-v3` reports production deployment `dpl_BfbtHk39MdNakPrVEZzdHAhZWoqB`, built from `5dd7549d534f2003e2fc95563fbfd4ebee6c81d5`.
- **VERIFIED:** GitHub Vercel status for current commit `54e6b68c9e7177f3d21565bc00cfcc6f508894d9` is `failure` with target `https://vercel.com/midosd2s-projects?upgradeToPro=build-rate-limit`, directly identifying the provider build-rate-limit as the deployment blocker.
- **VERIFIED:** commit `5dd7549d534f2003e2fc95563fbfd4ebee6c81d5` is the G3 pre-change baseline; comparing it to G3 implementation commit `6982c586fb0455405f04ea1625c494638bf7b1d6` shows four commits ahead and only `src/lib/menu/seo.ts` plus `src/lib/menu/seo.test.ts` changed.
- **VERIFIED:** an attempted direct Vercel deployment without files was rejected by the deployment API; no speculative or incomplete deployment was created.
- **UNKNOWN:** when the Vercel build-rate limit will clear and whether the current project plan permits another production build.
- **BLOCKED:** production structured-data verification cannot be honestly marked complete until a deployment containing the G3 source changes is READY.

## Protected Completed Work
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historical partial verification; do not rebuild.
- Level 3: DONE / VERIFIED.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED.
- Subscription foundation and entitlement enforcement: DONE / VERIFIED.
- Repository agent contract: DONE / VERIFIED.
- T1 template architecture contract: DONE / VERIFIED.
- T2 shared semantic menu presentation primitives: DONE / VERIFIED.
- T3 flagship template: DONE / VERIFIED.
- G1 Public Menu SEO Foundation: DONE / VERIFIED.
- G2 Crawl Control and Indexation: DONE / VERIFIED.

## Known Issues / Risks
- **UNKNOWN:** production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin has been configured.
- **UNKNOWN:** Search Console/indexation state until separately inspected.
- Existing lint warnings remain but are not errors and were not introduced by G3.

## Session Log
- 2026-09-03 — Audited repository continuity, routes, public data contract, templates, analytics, CI and deployment evidence.
- 2026-09-03 — Researched Saudi restaurant/delivery competitors and official Google/TanStack/SDAIA guidance.
- 2026-09-03 — Archived the superseded template-only plan and created the unified growth/Saudi SEO active plan.
- 2026-09-03 — Implemented G1 public-menu SSR metadata/schema foundation.
- 2026-09-03 — Fixed typed public-menu links and Browser QA URL handling.
- 2026-09-03 — Fixed CI preview recursion and preview process lifetime handling.
- 2026-09-03 — Isolated and fixed PGlite runtime asset placement and production-only migration isolation; CI run `33763072784` passed all quality gates.
- 2026-09-03 — Inspected live Vercel production HTML/head and fixed duplicate branch canonical/JSON-LD emission.
- 2026-09-03 — Re-inspected production `/m/nafas` and `/m/nafas/olaya`; G1 CLOSED.
- 2026-09-03 — Resumed G2 from repository evidence; confirmed crawl-control implementation already existed but its regression coverage had been reverted.
- 2026-09-03 — Restored and expanded G2 regression coverage and corrected the typecheck regression found in `src/routes/m.$slug.tsx`.
- 2026-09-03 — Committed focused G2 changes as `2c40efee3c58264606d5e6e6b8cfe74e29e7a109`.
- 2026-09-03 — Fixed sitemap duplicate-path handling in `e0a007a4a45362494d26ff801a833708b17d4fb7`; GitHub Actions run `33769708337` passed every repository quality gate.
- 2026-09-03 — Verified READY Vercel production deployment and live `/robots.txt`.
- 2026-09-03 — Verified live `/sitemap.xml` over the public `menu-v3-kohl.vercel.app` alias: HTTP 200, XML content type, four absolute unique URLs, and expected public menu/branch paths.
- 2026-09-03 — Closed G2 after all repository and live crawler-surface acceptance criteria passed.
- 2026-09-03 — Implemented G3 branch-level Saudi local SEO eligibility and regression tests; GitHub Actions run `33782244590` passed all quality gates.
- 2026-09-03 — Confirmed Vercel production remains on the G3 pre-change baseline.
- 2026-09-03 — Confirmed current GitHub Vercel status is a provider `build-rate-limit` failure; no source workaround is appropriate.
- 2026-09-03 — Created a fresh documentation commit to retry the Vercel Git trigger; Vercel still reports the build-rate-limit failure.

## Exact Remaining Work
- **Current atomic task:** finish G3 only after the Vercel build-rate limit clears: trigger/verify a production deployment from current `main`, fetch `/m/nafas/olaya`, confirm the Saudi `PostalAddress` and `hasMap` output plus no regressions, then close G3.
- **Do not start G4, G5, G6, or G7 in the same task.**
