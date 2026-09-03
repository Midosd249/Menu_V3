# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- **G3 — Saudi Local Discovery + Branch SEO: DONE / VERIFIED / CLOSED.**
- **G4 — Arabic/English SEO Architecture: DONE / VERIFIED / CLOSED.**
- **Current section:** G5 — Template Ecosystem Expansion.

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

## G4 — Arabic/English SEO Architecture — CLOSED
- **Status:** DONE / VERIFIED.
- **Objective:** provide real URL-level Arabic/English variants for existing public menu routes, with synchronized locale rendering and SEO metadata, without fabricating unavailable translations.
- **VERIFIED:** public menu routes validate `lang=ar|en` and resolve the effective locale from actual menu data.
- **VERIFIED:** English is considered available only when the required English tenant and branch names exist; otherwise an English request falls back to Arabic and is marked non-indexable.
- **VERIFIED:** English public variants use `?lang=en`; Arabic remains the canonical default path.
- **VERIFIED:** available English variants emit reciprocal `hreflang="ar"` and `hreflang="en"` links using absolute URLs.
- **VERIFIED:** unavailable English variants emit no fabricated hreflang links and use the Arabic canonical with `noindex, follow` for the requested unavailable locale.
- **VERIFIED:** public SEO titles, descriptions, Open Graph locale, canonical URLs, and Restaurant schema are generated from the effective locale.
- **VERIFIED:** public language switching preserves the existing query string and changes only the locale parameter.
- **VERIFIED:** branch child routes suppress parent duplicate canonical/alternate/schema head output.
- **VERIFIED:** `src/lib/menu/seo.test.ts` covers Arabic defaults, real English variants, reciprocal alternates, missing English data, Saudi local SEO, and missing-menu noindex behavior.
- **VERIFIED:** GitHub Actions run `33801648459` for commit `4cb283ab8037506374f9711788cd0e576207e260` passed route-tree generation, Typecheck, Tests (69/69), Lint, Production build, Playwright installation, Browser Template QA, and preview cleanup.
- **VERIFIED:** Browser QA passed mobile, tablet, and desktop with HTTP 200, RTL, Arabic document language, no horizontal overflow, accessibility-name checks, zero runtime console errors, and reduced-motion support.
- **VERIFIED:** the G4 TypeScript regression was fixed in `src/components/lang-toggle.tsx` without changing the locale contract.
- **INFERRED:** production deployment of the G4 commit was not independently available for live SEO-head inspection because the Vercel provider status reported a `build-rate-limit` failure; repository CI and browser-preview gates passed completely.

## Research / Design Sources
- **VERIFIED:** Google Search Central LocalBusiness guidance: https://developers.google.com/search/docs/appearance/structured-data/local-business
- **VERIFIED:** Google Search Central canonicalization guidance: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- **VERIFIED:** Google Search Central canonical implementation guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- **VERIFIED:** Google Search Central localized versions guidance: https://developers.google.com/search/docs/specialty/international/localized-versions

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: TODO.
- G6 — Performance + Media: TODO.
- G7 — Analytics, Search Console, Growth, Rollout: TODO.
