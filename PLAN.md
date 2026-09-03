# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- **G3 — Saudi Local Discovery + Branch SEO: DONE / VERIFIED / CLOSED.**
- **Current section:** G4 — Arabic/English SEO Architecture.

## G3 — Saudi Local Discovery + Branch SEO — CLOSED
- **Status:** DONE / VERIFIED.
- **Objective:** improve local relevance using only verified tenant/branch location data without creating thin, duplicate, or fabricated location pages.
- **VERIFIED:** repository schema provides tenant `city`/`country`, branch name/address/Maps URL/phone/activity, and branch hours.
- **VERIFIED:** `src/lib/menu/seo.ts` implements deterministic Saudi-location eligibility and guarded local address markup.
- **VERIFIED:** eligible branch schema emits `PostalAddress` from verified fields only and emits `hasMap` only for an absolute HTTP(S) Maps URL already stored on the branch.
- **VERIFIED:** `src/lib/menu/seo.test.ts` covers complete Saudi branch data and incomplete location data.
- **VERIFIED:** G3 does not create a new city-directory URL family, preserving existing public menu canonical ownership and avoiding thin/doorway pages.
- **VERIFIED:** GitHub Actions run `33782244590` passed route-tree generation, Typecheck, Tests, Lint, Production build, Playwright installation, Browser Template QA, and preview cleanup for commit `6982c586fb0455405f04ea1625c494638bf7b1d6`.
- **VERIFIED:** Vercel production deployment `dpl_CPvXFBZgh439e94rUHCJf3GFwWBC` is READY and was built from current `main` commit `e7ac56dcd1730d2cdaf648830199647bf8909f7f`.
- **VERIFIED:** production `/m/nafas/olaya` returns HTTP 200 with `lang="ar"`, `dir="rtl"`, Saudi `PostalAddress`, absolute Google Maps `hasMap`, canonical path `/m/nafas/olaya`, and `robots=index, follow`.

## G4 — Arabic/English SEO Architecture
- **Status:** IN_PROGRESS — current atomic task.
- **Objective:** audit the existing locale model and public URL contract, then implement only real URL-level locale variants with native metadata, reciprocal hreflang, and correct `lang`/`dir` when both versions actually exist.
- **Scope:** existing public menu routes and locale data only; preserve tenant/branch isolation and canonical ownership.
- **Non-goals:** do not invent translated pages that do not exist, do not create duplicate URL families, do not alter G5 template scope, and do not weaken indexing/crawl controls.
- **Acceptance criteria:**
  - Every emitted locale URL corresponds to a real available locale variant.
  - Arabic and English pages use correct document `lang` and `dir` values.
  - Locale alternates are reciprocal and point to absolute canonical URLs when both variants exist.
  - Canonical ownership remains deterministic and non-duplicative.
  - Missing locale variants do not receive fabricated hreflang links.
  - Existing G1/G2/G3 SEO behavior remains intact.
  - Tests cover locale selection, canonical/hreflang boundaries, and missing-variant behavior.
- **Verification:** run the repository's applicable test, typecheck, lint, build, and Browser QA gates after implementation; inspect the final diff and production behavior when a deployment is available.

## Research / Design Sources
- **VERIFIED:** Google Search Central LocalBusiness guidance: https://developers.google.com/search/docs/appearance/structured-data/local-business
- **VERIFIED:** Google Search Central canonicalization guidance: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- **VERIFIED:** Google Search Central canonical implementation guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- **TODO:** research current Google Search Central guidance for multilingual sites and hreflang before implementation.

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **IN_PROGRESS**.
- G5 — Template Ecosystem Expansion: TODO.
- G6 — Performance + Media: TODO.
- G7 — Analytics, Search Console, Growth, Rollout: TODO.
