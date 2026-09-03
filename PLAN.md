# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- Superseded plan archived as `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.
- Completed T1/T2/T3 template work is preserved.
- G1 — Public Menu SEO Foundation is **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation is **DONE / VERIFIED**.
- **Current section:** G3 — Saudi Local Discovery + Branch SEO.

## G1 Status — CLOSED
- **VERIFIED:** Public-menu SSR metadata/schema implementation is complete and protected.
- **VERIFIED:** CI run `33763072784` passed all G1 quality gates.
- **VERIFIED:** Production `/m/nafas` and `/m/nafas/olaya` return SSR menu content with route-specific SEO metadata.
- **VERIFIED:** Production missing-menu output is `noindex, nofollow`.
- **VERIFIED:** Duplicate branch canonical/JSON-LD emission was fixed and rechecked in production.

## G2 Status — CLOSED
### Objective
Establish deterministic crawler controls so only intentionally published public menu pages can be discovered/indexed, while unavailable/unpublished content is excluded without harming valid public pages.

### Implementation Evidence
- **VERIFIED:** `src/lib/seo/crawl.ts` provides deterministic robots.txt and XML sitemap builders with XML escaping, origin normalization, and duplicate-path elimination.
- **VERIFIED:** `server/middleware/grok-pwa.ts` serves `/robots.txt` and `/sitemap.xml` through the existing Nitro middleware.
- **VERIFIED:** sitemap SQL selects only active/published tenants and active branches.
- **VERIFIED:** robots allows public pages, disallows private application surfaces, and declares `/sitemap.xml`.
- **VERIFIED:** unavailable public-menu routes emit `noindex, nofollow`.
- **VERIFIED:** regression coverage protects crawler behavior and sitemap eligibility.

### Final Verification Evidence
- **VERIFIED:** GitHub Actions run `33769708337` passed route-tree generation, Typecheck, Tests (66/66), Lint, Production build, Playwright installation, Browser Template QA, and preview cleanup.
- **VERIFIED:** Vercel production deployment `dpl_4VUKHziJn8B3nwVTUG6mjiFksihS` is `READY`.
- **VERIFIED:** live `/robots.txt` returns HTTP 200 with expected crawl rules and sitemap declaration.
- **VERIFIED:** live `/sitemap.xml` returns HTTP 200 with `application/xml; charset=utf-8`.
- **VERIFIED:** live sitemap is valid XML and contains four absolute unique URLs: `/m/mndy-alwtnya`, `/m/mndy-alwtnya/main-branch`, `/m/nafas`, `/m/nafas/olaya`.
- **VERIFIED:** the live URL set is consistent with the repository eligibility contract; automated tests cover active/published tenant and active branch filtering.

### G2 Acceptance Criteria
- **PASS:** deterministic robots surface without accidental `/m/*` blocking.
- **PASS:** deterministic valid sitemap containing only indexable public URLs.
- **PASS:** unavailable/unpublished routes excluded from sitemap and non-indexable.
- **PASS:** canonical policy remains consistent between normal and branch routes.
- **PASS:** regression tests cover eligible/ineligible entries and crawler controls.
- **PASS:** G1 behavior remains intact.
- **PASS:** CI/browser quality workflow remains green.

**G2 is CLOSED.** Do not reopen it unless new evidence demonstrates a regression.

## G3 — Saudi Local Discovery + Branch SEO
- **Status:** IN_PROGRESS.
- **Objective:** build a safe, evidence-driven Saudi local-discovery SEO layer around verified city and branch data, increasing local search relevance without creating thin, duplicate, or fabricated location pages.

### Repository Data Audit
- **VERIFIED:** `tenants` has `city`, `country`, publication/activity flags, business names, and descriptive/tagline fields.
- **VERIFIED:** `branches` has branch names, Arabic/English addresses, Google Maps URL, phone, and activity state.
- **VERIFIED:** `branch_hours` has weekday/open/close/closed state.
- **VERIFIED:** the current public-menu loader exposes only active branches under active + published tenants.
- **VERIFIED:** the live production `/m/nafas/olaya` payload contains `country=SA`, `city=الرياض`, a branch name, Arabic/English address, Maps URL, phone, and seven branch-hour rows.
- **INFERRED:** the existing schema does not provide verified latitude/longitude, postal code, explicit region, cuisine taxonomy, price range, or review aggregates. These fields must not be fabricated or derived loosely for G3 structured data.

### G3 Design Decision
- **VERIFIED:** the safest current G3 slice is **branch-level local SEO on the existing canonical public menu routes**, not a new city-directory URL family.
- **PROPOSED:** city landing pages should remain deferred until the repository has enough verified location entities and genuinely distinct directory content to avoid thin/doorway pages.
- **VERIFIED:** this preserves public-menu URL ownership and avoids creating a second canonical URL for the same menu content.
- **VERIFIED:** `src/lib/menu/seo.ts` now treats a branch as locally eligible only when country is `SA` and verified city, branch name, and Arabic address are present.
- **VERIFIED:** eligible branch schema retains `Restaurant` and emits only verified `PostalAddress` fields; an absolute Maps URL is emitted as `hasMap` when supplied.
- **VERIFIED:** incomplete location data does not emit the location `address` block, preventing unsupported local claims.

### G3 Implementation Evidence
- **VERIFIED:** `src/lib/menu/seo.ts` adds deterministic Saudi-location eligibility and guards LocalBusiness address markup on verified fields.
- **VERIFIED:** `src/lib/menu/seo.ts` adds `hasMap` only for an absolute HTTP(S) Maps URL already stored on the branch.
- **VERIFIED:** `src/lib/menu/seo.test.ts` covers eligible Saudi branch metadata and incomplete location data.
- **VERIFIED:** final diff against the G2 state is limited to `src/lib/menu/seo.ts` and `src/lib/menu/seo.test.ts`.

### Research / Design Sources
- **VERIFIED:** Google Search Central LocalBusiness guidance requires `name` and a physical `address` for LocalBusiness rich-result eligibility, recommends the most specific subtype, and supports `geo`, `menu`, `openingHoursSpecification`, `telephone`, and `url` when the underlying data is available. citeturn1search1
- **VERIFIED:** Google Search Central general structured-data guidance says markup must represent the visible page content and should not be misleading; pages must remain accessible to Googlebot. citeturn1search6
- **VERIFIED:** Google canonicalization guidance treats canonical as a representative URL and recommends making clustered pages sufficiently different to avoid duplicate-content clustering. citeturn0search0turn0search1
- **VERIFIED:** Google Search Central spam guidance warns against doorway pages targeting cities/regions that funnel users to the same usable content. citeturn0search6

### Non-goals
- Do not invent cities, branches, addresses, coordinates, opening hours, ratings, or business claims.
- Do not create hundreds of thin city pages merely for keyword coverage.
- Do not change public menu URL ownership.
- Do not start G4 locale architecture, G5 template expansion, G6 performance/media, or G7 growth analytics in this task.

### Acceptance Criteria
- Every indexable local page is backed by verified branch/tenant data.
- Local URLs have deterministic canonical ownership and do not duplicate public menu routes.
- Metadata and structured data use only verified fields.
- Empty/incomplete location data produces no indexable page.
- Tests cover eligibility, duplicate prevention, missing data, and canonical behavior.
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and applicable Browser QA remain successful.

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **IN_PROGRESS**.
- G4 — Arabic/English SEO Architecture: TODO.
- G5 — Template Ecosystem Expansion: TODO.
- G6 — Performance + Media: TODO.
- G7 — Analytics, Search Console, Growth, Rollout: TODO.

## Exact Current Task
**G3 — Verify the branch-level local SEO slice on the full repository quality workflow and production deployment, then close G3. Do not begin G4.**
