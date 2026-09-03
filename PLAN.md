# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- Superseded plan archived as `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.
- Completed T1/T2/T3 template work is preserved; SEO/discoverability remains the priority before broad template expansion.
- **Current section:** G1 — Public Menu SEO Foundation.

## G1 Status

### VERIFIED
- `src/lib/menu/seo.ts` provides page-specific Arabic metadata and truthful Restaurant JSON-LD from verified `PublicMenu` fields.
- `src/routes/m.$slug.tsx` validates the optional `branch` search parameter and consumes it through typed `loaderDeps`.
- `src/routes/m.$slug.$branch.tsx` provides branch-specific metadata and canonical output.
- `src/lib/menu/seo.test.ts` covers title, canonical, Restaurant schema, SAR, opening hours and missing-menu noindex behavior.
- Historical quality run `33743739709` passed all existing quality gates.
- Historical run `33744076308` passed Typecheck, Tests, Lint, Production build and Playwright installation; it failed only at `Start built preview`.
- The historical preview failure was traced to recursive invocation of `npm run preview` from the `preview.mjs` helper.
- Commits `9e4368ac545fc155480d89ccf172d7d70b46746e`, `ebef098356e805d246d54a7c4dd6dc0ac6d63000` and `73d0e13375de54ccf49ae9fdab703c836ce60b28` contain the evidence-backed public-route typing fixes.
- Commit `298ffe21f98cb17a9147c27b3cd222f8f4f7453f` changes only the CI preview start step to launch `vite preview` directly with readiness polling, removing the recursive helper path.

### UNKNOWN / BLOCKED
- UNKNOWN: post-fix CI result for the latest commits, including browser template QA.
- BLOCKED: Vercel deployment status is rate-limited for 24 hours, so live deployment cannot currently be used to inspect generated production HTML/head.
- UNKNOWN: live production canonical origin, Search Console/indexation state and production content quality.

## Strategic Reassessment

### VERIFIED — repository
- Stack: React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase, Vercel, Node 24 CI.
- `PublicMenu` exposes tenant/branch identity, Arabic/English names and descriptions, branding, city/country, currency, hours, categories, products, availability, variants/modifiers, dietary labels, allergens, phone, WhatsApp and maps data.
- Public routes are `/m/$slug` and `/m/$slug/$branch`.
- `getPublicMenu` selects only active/published tenants and active branches.
- T1/T2/T3 are complete and protected; `contemporary-restaurant` is additive and legacy `PublicMenuView` remains available.
- Existing analytics include visits, product views, QR scans and WhatsApp interactions plus owner analytics by language/product/category/branch.
- Root metadata is generic rather than restaurant-specific.
- No repository `robots.txt` route or `sitemap.xml` route was found.
- English is currently a UI language state, not a separate crawlable URL variant; emitting `hreflang` now would be misleading.
- Current model has no verified cuisine, latitude/longitude, rating/review, price-range or special-holiday-hours fields. These must not be invented.

### INFERRED
- Public-page discoverability is a higher-leverage risk than the number of templates. SEO infrastructure should precede broad family expansion.
- Branch pages can capture local intent, but only useful, complete, active branches should be indexable.

### PROPOSED
- Public menus become real restaurant landing pages: visible text, unique Arabic-first metadata, stable canonical URLs, social previews and truthful Restaurant structured data.
- SEO derives from `PublicMenu`; templates remain presentation-only.
- Local terms are used only when supplied by actual restaurant data.

## Unified milestones

### G1 — Public Menu SEO Foundation
- **Objective:** SSR published public menu content and add accurate title, description, canonical, Open Graph and Restaurant JSON-LD.
- **Status:** IN_PROGRESS — implementation is complete; final CI/browser evidence and live deployment inspection remain unavailable.
- **Acceptance:** useful menu content during SSR; unique truthful metadata; schema matches visible data; missing menus are `noindex`; existing renderer/order behavior preserved.
- **Verification:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, CI/browser QA and generated HTML/head inspection.

### G2 — Crawl Control and Indexation
- **Status:** TODO. Do not start until G1 is verified/closed.
- **Objective:** add `robots.txt`, dynamic sitemap, indexability filters, canonical/redirect policy and tests.

### G3 — Saudi Local Discovery + Branch SEO
- **Status:** TODO.
- **Objective:** safe branch/city landing-page strategy from complete branch data.

### G4 — Arabic/English SEO Architecture
- **Status:** TODO.
- **Objective:** real URL-level locale variants only when independent AR/EN content exists.

### G5 — Template Ecosystem Expansion
- **Status:** TODO.
- **Objective:** build remaining behavioral families under the common SEO/accessibility/performance contract.

### G6 — Performance + Media
- **Status:** TODO.
- **Objective:** evidence-based image/font/JS budgets and optimization for Saudi mobile users.

### G7 — Analytics, Search Console, Growth, Rollout
- **Status:** TODO.
- **Objective:** connect acquisition, branch/template performance and conversion into a controlled growth loop.

## Research and standards
- Google Search Essentials.
- Google JavaScript SEO.
- Google title links, snippets and canonicalization.
- Google sitemaps and localized versions/hreflang.
- Google LocalBusiness structured data.
- Schema.org Restaurant.
- TanStack Router document head and data-loading guidance.
- SDAIA PDPL guidance.

## Exact Current Section Exit Criteria
**G1 is not marked DONE until post-fix CI passes Typecheck, Tests, Lint, Production build and Browser QA, and a deployed build can be inspected for the generated HTML/head when the Vercel rate limit clears. Do not start G2 before G1 is closed.**
