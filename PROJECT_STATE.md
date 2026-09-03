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
- Current section: **G1 — Public Menu SEO Foundation.**

## Verified Product Foundation
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.
- Public routes: `/m/$slug` and `/m/$slug/$branch`.
- `PublicMenu` contains tenant/branch data, bilingual content, branding, city/country, currency, hours, categories, products, availability, modifiers, dietary/allergen fields, phone/WhatsApp and maps data.
- Public data access requires active/published tenant and active selected branch.
- Existing public analytics record visits, product views, QR scans and WhatsApp interactions.
- T3 `contemporary-restaurant` remains additive; legacy `PublicMenuView` remains protected.

## G1 Implementation
- `src/lib/menu/seo.ts` provides page-specific Arabic metadata and truthful `Restaurant` JSON-LD from verified `PublicMenu` fields only.
- `src/lib/menu/seo.test.ts` covers Arabic title, canonical, Restaurant schema, SAR currency, opening hours and missing-menu noindex behavior.
- `src/routes/m.$slug.tsx` validates the optional `branch` search parameter and uses typed `loaderDeps`; its head emits title, description, robots, Open Graph, canonical and JSON-LD.
- `src/routes/m.$slug.$branch.tsx` emits branch-specific metadata, canonical and JSON-LD and preserves the existing menu renderer/order behavior.
- Public menu loaders provide `initialMenu` to preserve server-rendered content while the existing client refresh/cache path remains active.
- No database schema, auth, authorization, ordering, subscription or theme-contract changes were introduced by G1.

## Verification Evidence
- VERIFIED: historical quality run `33743739709` passed all existing quality steps.
- VERIFIED: run `33744076308` reached Typecheck, Tests, Lint, Production build and Playwright installation successfully; its only failure was `Start built preview`.
- VERIFIED: root cause of the preview failure was recursive invocation: CI ran `npm run preview`, while `preview` itself ran `node scripts/preview.mjs restart`, which spawned `npm run preview` again and terminated early.
- VERIFIED: run `33744710145` reached Typecheck and exposed exact public-route typing errors; those were fixed before the current preview fix.
- VERIFIED: commits `9e4368ac545fc155480d89ccf172d7d70b46746e` and `ebef098356e805d246d54a7c4dd6dc0ac6d63000` narrowed the public-menu loader results and corrected typed search handling.
- VERIFIED: commit `73d0e13375de54ccf49ae9fdab703c836ce60b28` supplied explicit empty search objects to existing public-menu links after generated route typing required the parameter.
- VERIFIED: commit `298ffe21f98cb17a9147c27b3cd222f8f4f7453f` changed only the CI `Start built preview` step to launch `vite preview` directly with readiness polling, avoiding the recursive helper path. The diff is limited to `.github/workflows/quality.yml`.
- UNKNOWN: post-fix GitHub Actions result for the latest commits; the available connector exposes historical runs and commit data but not the new push-triggered run reliably.
- BLOCKED: Vercel status for current commits is still rate-limited for 24 hours; live deployment cannot currently be used for verification.
- UNKNOWN: live production HTML/head output, custom-domain canonical origin, Search Console/indexation state and production content quality.
- UNKNOWN: browser QA after the CI preview-process fix until a post-fix run completes.

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
- UNKNOWN: post-fix CI completion, including browser template QA.
- BLOCKED: Vercel deployment is rate-limited for 24 hours according to the current deployment status.
- UNKNOWN: live production metadata/head behavior until a deployed G1 build is directly inspected.
- UNKNOWN: canonical origin when the application is served through a custom domain; G1 intentionally does not invent an origin.
- VERIFIED: G1 did not introduce database/schema/auth changes or alter existing public menu/order contracts.

## Session Log
- 2026-09-03 — Audited repository continuity, routes, public data contract, templates, analytics, CI and deployment evidence.
- 2026-09-03 — Researched Saudi restaurant/delivery competitors and official Google/TanStack/SDAIA guidance.
- 2026-09-03 — Archived the superseded template-only plan and created the unified growth/Saudi SEO active plan.
- 2026-09-03 — Implemented G1 public-menu SSR metadata/schema foundation.
- 2026-09-03 — CI exposed public-route TypeScript inference errors; fixed only those errors and pushed commits `9e4368ac545fc155480d89ccf172d7d70b46746e`, `ebef098356e805d246d54a7c4dd6dc0ac6d63000` and `73d0e13375de54ccf49ae9fdab703c836ce60b28`.
- 2026-09-03 — Audited the historical preview failure and fixed the CI recursion in `298ffe21f98cb17a9147c27b3cd222f8f4f7453f`.
- 2026-09-03 — Vercel deployment remained rate-limited; no production verification was claimed.

## Exact Remaining Work
- **G1 — obtain post-fix CI evidence for Typecheck, Tests, Lint, Production build and Browser QA. When the Vercel rate limit clears, inspect deployed HTML/head. Only after those checks pass may G1 be marked DONE / VERIFIED. Do not start G2 automatically.**
