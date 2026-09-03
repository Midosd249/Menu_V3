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
- SEO/discoverability remains prioritized before broad template expansion.
- Current atomic task: **G1 — Public Menu SEO Foundation.**

## Verified Product Foundation
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.
- Public routes: `/m/$slug` and `/m/$slug/$branch`.
- `PublicMenu` contains tenant/branch data, bilingual content, branding, city/country, currency, hours, categories, products, availability, modifiers, dietary/allergen fields, phone/WhatsApp and maps data.
- Public data access requires active/published tenant and active selected branch.
- Existing public analytics record visits, product views, QR scans and WhatsApp interactions.
- T3 `contemporary-restaurant` remains additive; legacy `PublicMenuView` remains protected.

## Current Implementation — G1
- Added `src/lib/menu/seo.ts` for page-specific Arabic metadata and truthful Restaurant JSON-LD.
- Added server loaders/head metadata to both public menu routes.
- Added `src/lib/menu/seo.test.ts` and registered the focused test.
- No database schema, auth, authorization, ordering, or theme contract changes were introduced for G1.

## Verification Evidence
- VERIFIED: historical quality run `33743739709` passed all existing quality steps.
- VERIFIED: browser gate run `33744076308` failed at `Start built preview`; earlier quality steps and Playwright installation passed.
- VERIFIED: G1 CI run `33744710145` reached Typecheck and failed with evidence-backed route typing errors in both public menu routes.
- VERIFIED: fixed those exact typing issues in commits `d6fc598eaed372a42c351bd0cd913675e4ae3776` and `735cfe01dcf9a40e70e411c296c0349a6b3c97cc`: typed search validation and safe loader-result narrowing; removed unsupported `location` access from `head`.
- UNKNOWN: post-fix GitHub Actions quality result; the available GitHub connector exposes the prior run but not a new push-triggered run yet.
- BLOCKED: Vercel status for current commits reports `Deployment rate limited — retry in 24 hours`; live deployment cannot be used as G1 verification until the platform rate limit clears.
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
- BLOCKED/OPEN: CI browser gate cannot currently start the repository preview helper in its existing form.
- BLOCKED: Vercel deployment is rate-limited for 24 hours according to the current commit status.
- UNKNOWN: deterministic screenshot baselines, live production behavior, custom-domain canonical origin, Search Console/indexation data, production content quality, and holiday-hour data.
- VERIFIED: G1 did not introduce database/schema/auth changes.

## Session Log
- 2026-09-03 — Audited repository continuity, routes, public data contract, templates, analytics, CI and deployment evidence.
- 2026-09-03 — Researched Saudi restaurant/delivery competitors and official Google/TanStack/SDAIA guidance.
- 2026-09-03 — Archived the superseded template-only plan and created the unified growth/Saudi SEO active plan.
- 2026-09-03 — Implemented G1 public-menu SSR metadata/schema foundation.
- 2026-09-03 — CI exposed public-route TypeScript inference errors; fixed only those errors and pushed commits `d6fc598e` and `735cfe01`.
- 2026-09-03 — Vercel deployment status became rate-limited; no production verification was claimed.

## Exact Next Task
- **G1 — obtain post-fix CI quality evidence (and, when the Vercel rate limit clears, inspect deployed HTML/head); fix only evidence-backed failures, then document and stop. Do not start G2 automatically.**
