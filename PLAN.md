# Platform Growth, Template Ecosystem, and Saudi SEO — Active Plan

## Status and Current Section
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`; `main` is the source of truth.
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- **Current section:** G7 — Analytics, Search Console, Growth, Rollout.
- **Current atomic task:** G7 audit of existing analytics/search-console/growth surfaces and selection of the first rollout task.

## G7 — Analytics, Search Console, Growth, Rollout — IN_PROGRESS
### Audit result — 2026-09-04
- **VERIFIED:** `src/routes/studio/analytics.tsx` exposes an authenticated owner analytics surface with 7/30-day ranges, visits, sessions, product views, QR scans, WhatsApp clicks, language split, daily series, top products, and category rankings.
- **VERIFIED:** `src/lib/menu/owner.ts` implements `getOwnerAnalytics` behind `authMiddleware` and scopes all analytics queries to the authenticated tenant membership.
- **VERIFIED:** `migrations/0002_menu_v3.sql` defines `menu_events` with tenant, branch, product, event type, language, session, and timestamp fields plus tenant/session indexes.
- **VERIFIED:** `src/lib/menu/public.ts` implements validated public event recording for `visit`, `product_view`, `qr_scan`, and `whatsapp`, including publication/activity checks and duplicate suppression for recent visit/QR events.
- **VERIFIED:** `src/components/public-menu.tsx` records public visits/QR scans and product views using the existing guest session identifier; owner preview does not emit public analytics events.
- **VERIFIED:** `src/lib/menu/seo.ts` and `src/lib/seo/crawl.ts` contain the existing SEO metadata, localized alternate, robots, and sitemap-generation contracts used by the completed G1–G4 work.
- **VERIFIED:** no Google Search Console integration, verification-token configuration, or Search Console API surface is present in the repository tree.
- **VERIFIED:** no separate growth/marketing automation surface is present in the repository tree beyond existing public SEO, leads, analytics, and menu functionality.
- **VERIFIED:** the latest `main` commit is `a45c18bc6dd4164903d745e71778e599e617a47f` (`docs(g6): close performance and media task queue`).
- **VERIFIED:** GitHub reports a Vercel status failure caused by provider `build-rate-limit`; this is external to the repository and does not prove a code failure.
- **UNKNOWN:** current production Search Console ownership/indexation data because no connected Search Console account or production deployment evidence is available through the repository.
- **UNKNOWN:** whether the intended production domain has been finalized outside the repository configuration.

### G7 guardrails
- Preserve G1–G6 contracts.
- Do not add Google credentials, external analytics dependencies, or provider-specific configuration without an explicit atomic task and security review.
- Treat existing first-party `menu_events` analytics as the current analytics source of truth.
- Do not infer Search Console performance or indexing state from repository code alone.

## First rollout task selected
- **G7.1 — Production analytics integrity hardening:** add focused regression coverage for the existing public event/owner analytics contract, especially tenant isolation, invalid product handling, duplicate visit/QR suppression, and the 7/30-day range behavior, without changing the existing event model or adding dependencies.
- **Reason:** analytics already exists and is directly testable from repository code; hardening its trust boundary is lower-risk and more actionable than introducing a new external Search Console integration before production-domain ownership is verified.

## Research / Design Sources
- **VERIFIED:** Google Search Central LocalBusiness guidance: https://developers.google.com/search/docs/appearance/structured-data/local-business
- **VERIFIED:** Google Search Central canonicalization guidance: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- **VERIFIED:** Google Search Central canonical implementation guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- **VERIFIED:** Google Search Central localized versions guidance: https://developers.google.com/search/docs/specialty/international/localized-versions
- **PROPOSED:** G7.1 should remain first-party and dependency-free; after analytics integrity is verified, a separate task can address Search Console ownership/submission using the finalized production domain and official Google guidance.

## Unified milestones
- G1 — Public Menu SEO Foundation: **DONE / VERIFIED**.
- G2 — Crawl Control and Indexation: **DONE / VERIFIED**.
- G3 — Saudi Local Discovery + Branch SEO: **DONE / VERIFIED / CLOSED**.
- G4 — Arabic/English SEO Architecture: **DONE / VERIFIED / CLOSED**.
- G5 — Template Ecosystem Expansion: **DONE / VERIFIED / CLOSED**.
- G6 — Performance + Media: **DONE / VERIFIED / CLOSED**.
- G7 — Analytics, Search Console, Growth, Rollout: **IN_PROGRESS**.
