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
- The strategic roadmap was reassessed against the repository and Saudi market; SEO/discoverability is now prioritized before broad template expansion.
- Current atomic task: **G1 — Public Menu SEO Foundation.**

## Verified Product Foundation
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.
- Public routes: `/m/$slug` and `/m/$slug/$branch`.
- `PublicMenu` contains tenant/branch data, bilingual content, branding, city/country, currency, hours, categories, products, availability, modifiers, dietary/allergen fields, phone/WhatsApp and maps data.
- Public data access requires the tenant to be active and published and the selected branch to be active.
- Existing public analytics record visits, product views, QR scans and WhatsApp interactions.
- T3 `contemporary-restaurant` remains additive; legacy `PublicMenuView` remains protected.

## Strategic SEO Audit
- VERIFIED: root metadata was generic before G1.
- VERIFIED: no repository `robots.txt` route was found.
- VERIFIED: no repository `sitemap.xml` route was found.
- VERIFIED: no public-menu canonical or Restaurant JSON-LD was present before G1.
- VERIFIED: English is a UI state rather than a distinct crawlable URL variant; `hreflang` is therefore deferred.
- INFERRED: server-rendered public menu content is the highest-value first SEO improvement because it reduces dependence on post-hydration rendering and creates a reusable public-page foundation.
- UNKNOWN: production custom-domain canonical-origin policy, Search Console/indexation state, production tenant content quality, and holiday-hour data.

## Saudi Positioning
- VERIFIED external research: Foodics has direct online ordering, web presence, branches, QR, bilingual support and reporting; Jahez, HungerStation and Keeta emphasize consumer restaurant discovery/delivery; Taker provides branded restaurant ordering; iMenu provides multilingual QR menus.
- INFERRED: Menu V3 should not compete on delivery logistics or become a POS replacement.
- PROPOSED: differentiate through owned discoverable restaurant web presence, Arabic-first SEO/RTL, Saudi local branch discovery, premium behavioral templates, and direct conversion.

## Current Implementation — G1
- Added `src/lib/menu/seo.ts` for page-specific Arabic metadata and truthful Restaurant JSON-LD.
- Added server loaders to public menu routes so published menu data can be rendered as route loader data during SSR.
- Added canonical, description, Open Graph and robots metadata for public menu routes.
- Missing public menu route responses receive `noindex, nofollow` metadata.
- Added `src/lib/menu/seo.test.ts` and registered it in the repository test command.
- No database schema, auth, tenant authorization, ordering, or theme contract changes were introduced for G1.

## Verification Evidence
- VERIFIED: historical repository quality run `33743739709` passed before the SEO reassessment.
- VERIFIED: browser gate run `33744076308` failed only at `Start built preview`; Playwright installation and all previous checks passed. This remains a separate preview-process issue.
- IN_PROGRESS: CI run `33744481336` for the G1 implementation/restored package state is running.
- UNKNOWN: G1 CI result until run `33744481336` completes.
- UNKNOWN: live production metadata/head behavior until a deployed G1 build is directly inspected.

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

## Known Issues / Risks
- BLOCKED/OPEN: CI browser gate cannot currently start the repository preview helper in its existing form; no browser visual success may be claimed until this is fixed or a supported deployed preview is used.
- UNKNOWN: deterministic screenshot baselines.
- UNKNOWN: live production visual behavior after the latest route/SEO changes.
- UNKNOWN: production custom-domain canonical origin.
- UNKNOWN: Search Console and organic traffic data.
- VERIFIED: G1 did not introduce database/schema/auth changes.

## Session Log
- 2026-09-03 — Audited repository continuity, routes, public data contract, templates, analytics, CI and deployment evidence.
- 2026-09-03 — Researched Saudi restaurant/delivery competitors and official Google/TanStack/SDAIA guidance.
- 2026-09-03 — Archived the superseded template-only plan and created the unified growth/Saudi SEO active plan.
- 2026-09-03 — Selected G1 as the first unblocked high-value task and implemented public-menu SSR metadata/schema foundation.
- 2026-09-03 — CI run `33744481336` is the pending verification gate for G1.

## Exact Next Task
- **G1 — Finish verification of the public-menu SEO foundation using CI run `33744481336`; fix only evidence-backed failures, update continuity state, and stop. Do not start G2 automatically.**
