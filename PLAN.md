# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Task
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- Superseded plan archived as `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.
- Completed T1/T2/T3 template work is preserved; SEO/discoverability remains the priority before broad template expansion.
- **Current atomic task:** G1 — Public Menu SEO Foundation verification.

## G1 Progress

### VERIFIED
- `src/lib/menu/seo.ts` provides page-specific Arabic metadata and truthful Restaurant JSON-LD.
- `src/routes/m.$slug.tsx` and `src/routes/m.$slug.$branch.tsx` load public menu data on the server and expose dynamic head metadata.
- `src/lib/menu/seo.test.ts` covers title, canonical, Restaurant schema, SAR, opening hours and missing-menu noindex behavior.
- Historical quality run `33743739709` passed all existing quality gates.
- CI run `33744710145` exposed exact TypeScript errors in the two public menu routes; those errors were fixed in commits `d6fc598e` and `735cfe01`.
- TanStack Router guidance confirms `loaderDeps` is the correct mechanism for search-param loader dependencies and `head` receives `loaderData`/`params`, not `location`. citeturn0search0turn1search5

### Current targeted fix
- `/m/$slug` now validates the `branch` search parameter and consumes it through typed `loaderDeps`; the component uses typed `Route.useSearch()`.
- Both public route heads safely narrow `FnResult<PublicMenu>` with the `"data" in loaderData` check before reading `data`.
- `/m/$slug` canonical remains the stable pathname canonical for the query-string variant; branch-specific canonical is provided by `/m/$slug/$branch`. This keeps query URLs from creating a second canonical path while avoiding unsupported `head` context access.

### UNKNOWN / BLOCKED
- UNKNOWN: post-fix GitHub Actions result. The available GitHub connector has not exposed a new push-triggered run for commits after `735cfe01`.
- BLOCKED: Vercel status for current commits is `Deployment rate limited — retry in 24 hours`; live deployment cannot currently be used for verification.
- UNKNOWN: live production HTML/head output, custom-domain canonical origin, Search Console/indexation state and production content quality.
- BLOCKED/OPEN: the existing CI browser gate previously failed at `Start built preview`; no browser visual success may be claimed until that preview-process issue is resolved or a supported deployed preview is available.

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
- Public menu content was primarily fetched after client hydration before G1; SSR is a high-value improvement for crawlability and non-JS clients.
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
- **Status:** IN_PROGRESS — implementation complete; verification is blocked on post-fix CI evidence and Vercel deployment rate limit.
- **Acceptance:** useful menu content during SSR; unique truthful metadata; schema matches visible data; missing menus are `noindex`; existing renderer/order behavior preserved.
- **Verification:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, CI and generated HTML/head inspection.

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

## Exact Current Task
**G1 — obtain post-fix CI quality evidence and, when the Vercel rate limit clears, inspect deployed HTML/head; fix only evidence-backed failures, then document and stop. Do not start G2 automatically.**
