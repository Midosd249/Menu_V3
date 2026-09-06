# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Backend Identity (VERIFIED — 2026-09-06)
- Supabase project ref: `ublxptcqefujkbeepylc`.
- Supabase URL: `https://ublxptcqefujkbeepylc.supabase.co`.
- Supabase region: `ap-northeast-2` (Seoul).
- Supabase status: `ACTIVE_HEALTHY` at last verification.
- Menu V3 canonical database schema: `menu_v3`.
- Menu V3 is separated from legacy application data by schema boundary; legacy `public` tables are not the canonical Menu V3 surface.
- Canonical infrastructure reference: `docs/project-infrastructure.md`.

## Current Position
- G1–G7.2 completed work remains protected.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery — protected; browser/device closure remains separately tracked where noted.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- External Theme Preview QR Mode — DONE / VERIFIED.
- Shared Public Menu Rendering Stabilization — VERIFIED.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED; implementation is incremental.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6 Typography Evidence & Decision — CLOSED / VERIFIED.
- W6-01 Typography Implementation — CLOSED / VERIFIED; corrected Fontsource CDN delivery passed full Quality Gate.
- W7 Color / Surface / Contrast System — CLOSED / VERIFIED.
- W8 Imagery and Art Direction — CLOSED / VERIFIED; final Quality Gate passed.
- W9 Motion and Interaction — CLOSED / VERIFIED; final Quality Gate `34010117079` passed all required steps.
- W10 Accessibility and RTL Quality — CLOSED / VERIFIED; final Quality Gate `34010619265` passed all required steps.
- W11 SEO, Local Discovery, and Shareability — IMPLEMENTED / QUALITY GATE PENDING.

## Protected Completed Work
- Existing themes, public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls are not reopened without evidence.
- No sixth theme is created as a substitute for product/design strategy.

## Runtime Evidence — P0 Public Content Propagation
- VERIFIED: live Supabase database contains `menu_v3.tenants.public_content_version`.
- VERIFIED: live `menu_v3` has revision triggers for tenants, branches, branch hours, categories, products, product variants, modifier groups, modifier options, and product-modifier links.
- VERIFIED: trigger functions explicitly target `menu_v3` and use `search_path = menu_v3, pg_temp`.
- VERIFIED: representative live Owner-side writes incremented the published tenant revision.
- VERIFIED: separate tenant revisions remained isolated during live mutation checks.
- VERIFIED: `src/lib/db.ts` sets `search_path` to `menu_v3,public` and `src/lib/menu/public.ts` versions its process-local cache key by tenant, branch, and revision.
- VERIFIED: browser menu-content caching is absent; browser storage is limited to anonymous analytics session identity.
- VERIFIED: canonical migration was corrected to explicitly target `menu_v3`; repair migration was applied to the live database.
- VERIFIED: GitHub Actions Quality run `34007481599` completed successfully for the P0 closure commit.
- UNKNOWN: direct authenticated Owner UI -> Public HTTP response cache behavior has not been exercised in an interactive authenticated browser session in this environment.

## W11 SEO / Local Discovery / Shareability — Implementation Evidence
- VERIFIED: public-menu canonical URLs are absolute production URLs.
- VERIFIED: Arabic is the canonical default locale; English alternates are emitted only when tenant and branch English names both exist.
- VERIFIED: Arabic/English alternates are reciprocal and use absolute URLs.
- VERIFIED: preview theme variants remain `noindex, nofollow`.
- VERIFIED: missing public menus remain `noindex, nofollow`.
- VERIFIED: public Restaurant structured data is tenant/branch scoped and does not fabricate location data when required Saudi fields are incomplete.
- VERIFIED: public share metadata includes `og:url`, `og:site_name`, `og:title`, `og:description`, locale, and Twitter card/image metadata where an image exists.
- VERIFIED: `/robots.txt` excludes private/control surfaces and advertises `/sitemap.xml`.
- VERIFIED: `/sitemap.xml` is generated server-side from active, published tenants and active branches only.
- VERIFIED: sitemap emits English variants only when real English tenant/branch names exist.
- VERIFIED: no new runtime dependency or database schema migration was introduced.
- VERIFIED: discovery regression tests exist in `src/lib/menu/seo-discovery.test.ts`; public SEO tests were extended in `src/lib/menu/seo.test.ts`.
- VERIFIED: implementation contract is recorded in `docs/seo-local-discovery-shareability.md`.
- UNKNOWN: final GitHub Quality run for the current W11 head has not yet completed.

## Current Design Strategy
- The five-theme system is not the current design focus; themes remain protected.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

## Exact Next Task
### W11 Quality Closure
Objective: verify the current W11 implementation through the repository Quality Gate and close only if all checks pass.

Scope:
- typecheck, tests, lint, production build;
- Playwright/template QA;
- robots/sitemap response checks;
- canonical/hreflang/schema validation;
- performance inspection.

Acceptance criteria:
- full Quality Gate passes;
- no cross-tenant metadata exposure;
- only eligible public routes are discoverable;
- no fabricated locale or location claims;
- no unrelated regression.

Risks: dependency/install failure, server middleware typing/build issues, malformed XML, incorrect production-origin resolution.

Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, applicable Playwright/template QA, structured-data validation, sitemap/robots checks, and performance inspection.
