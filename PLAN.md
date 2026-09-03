# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- **Current section:** G3 — Saudi Local Discovery + Branch SEO.

## G3 — Saudi Local Discovery + Branch SEO
- **Status:** BLOCKED at final production verification.
- **Objective:** improve local relevance using only verified tenant/branch location data without creating thin, duplicate, or fabricated location pages.

### Repository Data Audit
- **VERIFIED:** `tenants` provides `city`, `country`, publication/activity state, business names, and descriptive/tagline fields.
- **VERIFIED:** `branches` provides branch names, Arabic/English addresses, Google Maps URL, phone, and activity state.
- **VERIFIED:** `branch_hours` provides weekday/open/close/closed state.
- **VERIFIED:** the public-menu loader exposes only active branches under active + published tenants.
- **VERIFIED:** production `/m/nafas/olaya` contains `country=SA`, `city=الرياض`, branch name, Arabic/English address, Maps URL, phone, and branch hours.
- **INFERRED:** no verified latitude/longitude, postal code, explicit region, cuisine taxonomy, price range, or review aggregates are available in the current public data contract. These must not be fabricated.

### G3 Design Decision
- **VERIFIED:** the safest current G3 slice is branch-level local SEO on the existing canonical public menu routes, not a new city-directory URL family.
- **PROPOSED:** defer city landing pages until the repository has enough verified location entities and genuinely distinct directory content to avoid thin/doorway pages.
- **VERIFIED:** public-menu URL ownership is unchanged.
- **VERIFIED:** local eligibility requires Saudi country plus non-empty verified city, branch name, and Arabic address.
- **VERIFIED:** eligible branch schema emits only verified `PostalAddress` fields and an absolute stored Maps URL as `hasMap` when available.
- **VERIFIED:** incomplete location data does not emit the location `address` block.

### Implementation Evidence
- **VERIFIED:** `src/lib/menu/seo.ts` implements deterministic Saudi-location eligibility and guarded local address markup.
- **VERIFIED:** `src/lib/menu/seo.ts` emits `hasMap` only for an absolute HTTP(S) Maps URL already stored on the branch.
- **VERIFIED:** `src/lib/menu/seo.test.ts` covers complete Saudi branch data and incomplete location data.
- **VERIFIED:** G3 source diff against the G2 baseline is limited to `src/lib/menu/seo.ts` and `src/lib/menu/seo.test.ts`.
- **VERIFIED:** GitHub Actions run `33782244590` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser Template QA, and preview cleanup for commit `6982c586fb0455405f04ea1625c494638bf7b1d6`.

### Research / Design Sources
- **VERIFIED:** Google Search Central LocalBusiness guidance: https://developers.google.com/search/docs/appearance/structured-data/local-business
- **VERIFIED:** Google Search Central canonicalization guidance: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- **VERIFIED:** Google Search Central canonical implementation guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- **VERIFIED:** Google Search Central guidance requires structured data to describe the visible page content and recommends the most specific LocalBusiness subtype possible.
- **VERIFIED:** Google canonicalization guidance favors a single representative URL for duplicate/similar content and treats `rel=canonical` and sitemap inclusion as signals rather than absolute rules.

### Non-goals
- Do not invent cities, branches, addresses, coordinates, opening hours, ratings, or business claims.
- Do not create hundreds of thin city pages merely for keyword coverage.
- Do not change public menu URL ownership.
- Do not start G4 locale architecture, G5 template expansion, G6 performance/media, or G7 growth analytics in this task.

### Acceptance Criteria
- Every indexable local page is backed by verified branch/tenant data.
- Local URLs have deterministic canonical ownership and do not duplicate public menu routes.
- Metadata and structured data use only verified fields.
- Empty/incomplete location data produces no indexable local page.
- Tests cover eligibility, missing data, duplicate boundaries, and canonical behavior.
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and applicable Browser QA remain successful.

### Final Verification Blocker
- **BLOCKED:** Vercel project `menu-v3` currently reports production deployment `dpl_BfbtHk39MdNakPrVEZzdHAhZWoqB`, built from the no-op commit `5dd7549d534f2003e2fc95563fbfd4ebee6c81d5`, not the current G3 commit chain.
- **BLOCKED:** the new incomplete-location guard and `hasMap` behavior therefore have not been proven on the current production deployment.
- **UNKNOWN:** why the Vercel Git integration has not created a deployment for the later G3 commits.
- **Next action:** verify/trigger the Vercel production deployment from the current `main` commit, fetch `/m/nafas/olaya`, confirm the expected structured data, then close G3. Do not begin G4.

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **BLOCKED at final production verification**.
- G4 — Arabic/English SEO Architecture: TODO.
- G5 — Template Ecosystem Expansion: TODO.
- G6 — Performance + Media: TODO.
- G7 — Analytics, Search Console, Growth, Rollout: TODO.
