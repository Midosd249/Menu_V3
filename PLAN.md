# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Task
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- Superseded plan archived as `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.
- Completed T1/T2/T3 template work is preserved; this reassessment changes priority, not history.
- **Current atomic task:** G1 — Public Menu SEO Foundation: server-render published public menu content and add accurate page metadata plus Restaurant structured data.

## Reassessment

### VERIFIED — repository
- Stack: React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase, Vercel, Node 24 CI.
- `PublicMenu` exposes tenant/branch identity, Arabic/English names and descriptions, branding, city/country, currency, hours, categories, products, availability, variants/modifiers, dietary labels, allergens, phone, WhatsApp and maps data.
- Public routes are `/m/$slug` and `/m/$slug/$branch`.
- `getPublicMenu` selects only active/published tenants and active branches.
- T1/T2/T3 are complete and protected; `contemporary-restaurant` is additive and legacy `PublicMenuView` remains available.
- Existing analytics include visits, product views, QR scans and WhatsApp interactions plus owner analytics by language/product/category/branch.
- Root metadata is generic rather than restaurant-specific.
- No repository `robots.txt` route or `sitemap.xml` route was found.
- No public-menu canonical link or Restaurant/LocalBusiness JSON-LD was present before G1.
- English is currently a UI language state, not a separate crawlable URL variant; emitting `hreflang` now would be misleading.
- Public menu content was primarily fetched after client hydration before G1; SSR is a high-value improvement for crawlability and non-JS clients.
- Current model has no verified cuisine, latitude/longitude, rating/review, price-range or special-holiday-hours fields. These must not be invented.

### VERIFIED — current CI evidence
- Browser quality run `33744076308` failed at `Start built preview`; Playwright installation and all previous quality steps passed. The preview helper exited under CI. This remains a separate QA/infrastructure issue and is not treated as template failure.

### INFERRED
- Public-page discoverability is a higher-leverage risk than the number of templates. SEO infrastructure should precede broad family expansion.
- Branch pages can capture local intent, but only useful, complete, active branches should be indexable.

### PROPOSED
- Public menus become real restaurant landing pages: visible text, unique Arabic-first metadata, stable canonical URLs, social previews and truthful Restaurant structured data.
- SEO derives from `PublicMenu`; templates remain presentation-only.
- Local terms are used only when supplied by actual restaurant data.

### UNKNOWN
- Production custom-domain/canonical-origin policy.
- Production tenant/branch count and content quality.
- Search Console/indexation status and organic query data.
- Final analytics/privacy processing requirements.
- Whether production data contains holiday exceptions not exposed by the public contract.

## Saudi-market findings

### VERIFIED external
- Foodics offers branded web presence/custom web names or domains, branch/menu management, QR ordering, Arabic/English, payments and reporting. https://www.foodics.com/online-features/ https://www.foodics.com/online/
- Jahez is a Saudi restaurant-delivery platform emphasizing restaurant variety, ordering, tracking, payments and Saudi coverage. https://portal.jahez.net/index-en.html
- HungerStation provides location-oriented Saudi restaurant discovery and categories such as fast food, Arabic, desserts, Japanese, breakfast, Asian and pastries, including Riyadh, Jeddah, Makkah, Khobar and Dammam. https://hungerstation.com/sa-ar/restaurants
- Keeta operates in Saudi Arabia and emphasizes restaurant choice, delivery, tracking and restaurant technology. https://www.keeta-global.com/SA/en
- Taker evidence identifies a Riyadh/Saudi online-ordering product for branded restaurant websites/apps and kiosk use. https://play.google.com/store/apps/details?id=com.newtakerkiosk.www
- iMenu is a multilingual QR menu product with branch pricing and restaurant examples, but the reviewed public positioning is MENA/Libya-oriented rather than clearly Saudi-specialized. https://imenu.ly/?lang=en

### INFERRED opportunity
- Do not compete with Jahez/HungerStation/Keeta on logistics or marketplace network effects.
- Do not turn Menu V3 into a POS replacement for Foodics/Taker.
- Differentiate on **owned discoverable restaurant web presence + Arabic-first UX/SEO + Saudi local discovery + premium behavioral templates + direct conversion**.

### PROPOSED Saudi defaults
- Arabic-first RTL and English when supplied.
- SAR and Saudi phone conventions where applicable.
- City/branch/address/hours/maps/phone/WhatsApp surfaced from verified data.
- Mobile-first performance and culturally appropriate typography/layout.
- Google Business Profile compatibility through stable public URLs and complete business details; do not claim Menu V3 manages GBP.

## Unified SEO strategy

### Technical
- Dynamic title and meta description from visible restaurant/branch content.
- Stable canonical URL per indexable public page.
- `robots.txt` and XML sitemap containing only indexable public URLs.
- `noindex` for missing/unpublished/private content; never rely on robots.txt alone for exclusion.
- Query-string branch URLs must not create competing indexable duplicates.
- Safe 404/redirect behavior when slugs change.

### Arabic/English
- Do not emit `hreflang` until real AR/EN URL variants exist.
- Future variants must self-reference and reciprocally reference each other, use fully qualified URLs, unique content/metadata, and correct `lang`/`dir`.
- Arabic metadata must be native and page-specific, not literal keyword translations.

### Local SEO
- Use `Restaurant`/most-specific `LocalBusiness` type for physical restaurant pages.
- Use truthful address, phone, image/logo, weekly hours, currency and menu URL where available.
- Do not invent cuisine, ratings, reviews, geo coordinates, reservations or holiday hours.

### Content
- Menu categories/items remain visible textual content, not image-only content.
- No keyword stuffing, fake location pages, thin pages or autogenerated misleading claims.
- Faceted/filter URLs are non-indexable by default.

## Template + public experience contract

Every template family must preserve semantic headings, crawlable meaningful links, truthful metadata/schema, useful image alt text, mobile-first behavior, Arabic RTL, long-text robustness, accessible controls/focus/keyboard behavior, reduced motion, responsive media and shared conversion analytics.

Families:
1. Specialty Coffee / Cafe
2. Bakery / Dessert
3. Fast Casual / QSR
4. Contemporary Restaurant — DONE / VERIFIED
5. Fine Dining / Hotel / Hospitality
6. Small Menu / Food Truck / Single Concept

Legacy theme keys remain protected until replacement families pass acceptance gates.

## Analytics, conversion, growth

### VERIFIED
Existing event vocabulary: `visit`, `product_view`, `qr_scan`, `whatsapp`; owner analytics include visits, unique sessions, product views, QR scans, WhatsApp clicks, language, top products, categories and branches.

### PROPOSED
Build one acquisition-to-conversion funnel: search/social/QR visit → category/product discovery → order/cart or contact action. Keep template metrics shared. Add Search Console measurement and compare template/branch performance through controlled rollout.

## Saudi privacy/trust

### VERIFIED external
Saudi PDPL applies to personal-data processing relating to individuals in the Kingdom and is supported by implementing and transfer regulations from SDAIA. https://dgp.sdaia.gov.sa/wps/portal/pdp/knowledgecenter/details/PDPL/ https://dgp.sdaia.gov.sa/wps/portal/pdp/knowledgecenter/details/PDPL2/

### PROPOSED
Minimize analytics data, document purpose/retention/access/transfer/processor controls, and do not claim PDPL compliance until implementation and legal/privacy review are complete.

## Unified milestones

### G1 — Public Menu SEO Foundation
- **Objective:** SSR published public menu content and add accurate title, description, canonical, Open Graph and Restaurant JSON-LD.
- **Business value:** Immediate crawlability/discoverability improvement and stronger social sharing.
- **Repository evidence:** public menu was client-fetch driven; root metadata was generic; public-menu canonical/JSON-LD was absent.
- **Dependencies:** existing `PublicMenu` and public routes.
- **Likely files:** `src/routes/m.$slug.tsx`, `src/routes/m.$slug.$branch.tsx`, `src/lib/menu/seo.ts`, focused tests.
- **Acceptance:** useful menu content during SSR; unique truthful metadata; schema matches visible data; missing menus are `noindex`; existing renderer/order behavior preserved.
- **Verification:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, CI and generated HTML/head inspection.
- **Risks:** server data availability and canonical origin policy.
- **Status:** IN_PROGRESS.
- **Rollback:** revert only G1 route/helper/test changes.

### G2 — Crawl Control and Indexation
- **Objective:** add `robots.txt`, dynamic sitemap, indexability filters, canonical/redirect policy and tests.
- **Business value:** coherent crawl/indexation at scale.
- **Dependencies:** G1 and stable URL rules.
- **Acceptance:** sitemap contains only indexable published URLs; private/unpublished content is excluded; branch query duplication is controlled.
- **Status:** TODO.

### G3 — Saudi Local Discovery + Branch SEO
- **Objective:** safe branch/city landing-page strategy from complete branch data.
- **Business value:** local-intent discovery and Maps/GBP support.
- **Dependencies:** G1/G2 and verified branch data quality.
- **Acceptance:** only complete useful branches are indexable; address/hours/phone/map/menu relationships are truthful.
- **Status:** TODO.

### G4 — Arabic/English SEO Architecture
- **Objective:** real URL-level locale variants only when independent AR/EN content exists.
- **Business value:** native Arabic search-intent coverage and correct bilingual discovery.
- **Dependencies:** G1/G2 and localization contract.
- **Acceptance:** unique content/metadata, reciprocal hreflang, consistent canonicals, correct `lang`/`dir`, RTL/LTR verification.
- **Status:** TODO.

### G5 — Template Ecosystem Expansion
- **Objective:** build remaining behavioral families under the common SEO/accessibility/performance contract.
- **Business value:** restaurant-type differentiation without fragmented infrastructure.
- **Dependencies:** G1–G4 plus browser QA.
- **Acceptance:** each family has distinct hierarchy, crawlable content, schema compatibility, Arabic/English robustness, conversion actions and responsive/accessibility evidence.
- **Status:** TODO.

### G6 — Performance + Media
- **Objective:** evidence-based image/font/JS budgets and optimization for Saudi mobile users.
- **Business value:** faster public menus and stronger UX/search performance.
- **Dependencies:** representative fixtures and SSR.
- **Acceptance:** no avoidable media layout shift; below-fold images lazy-load; critical media prioritized; payloads and Core Web Vitals measured.
- **Status:** TODO.

### G7 — Analytics, Search Console, Growth, Rollout
- **Objective:** connect acquisition, branch/template performance and conversion into a controlled growth loop.
- **Business value:** measurable revenue impact.
- **Dependencies:** G1–G6 and privacy review.
- **Acceptance:** consistent funnel metrics, Search Console measurement, template comparison, branch reporting, privacy-reviewed analytics, staged rollout and rollback.
- **Status:** TODO.

## Research and standards
- Google Search Essentials: https://developers.google.com/search/docs/essentials
- Google JavaScript SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google title links: https://developers.google.com/search/docs/appearance/title-link
- Google snippets: https://developers.google.com/search/docs/appearance/snippet
- Google canonicalization: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Google sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google localized versions/hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Schema.org Restaurant: https://schema.org/Restaurant
- TanStack document head: https://tanstack.com/router/latest/docs/guide/document-head-management
- SDAIA PDPL: https://dgp.sdaia.gov.sa/wps/portal/pdp/knowledgecenter/details/PDPL/

## Quality gates
Before DONE: published menus still work; private/unpublished data cannot be indexed; tenant/branch isolation is intact; Arabic/RTL/mobile behavior is tested where relevant; metadata is truthful and non-duplicated; structured data matches visible content; sitemap/canonical/robots behavior is verified where relevant; performance and accessibility are reviewed; tests/docs/state are updated; no proprietary content/assets are copied; every changed line belongs to the atomic task.

## Exact Current Task
**G1 — Verify the current public-menu SEO implementation in CI, fix only evidence-backed failures, then document and stop. Do not start G2 automatically.**
