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
- Essential, Editorial, Noir, Heritage, and Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- External Theme Preview QR Mode — DONE / VERIFIED.
- Shared Public Menu Rendering Stabilization — VERIFIED.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED; implementation is incremental.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6 Typography Evidence & Decision — CLOSED / VERIFIED.
- W6-01 Typography Implementation — CLOSED / VERIFIED.
- W7 Color / Surface / Contrast System — CLOSED / VERIFIED.
- W8 Imagery and Art Direction — CLOSED / VERIFIED.
- W9 Motion and Interaction — CLOSED / VERIFIED; final Quality Gate `34010117079` passed all required steps.
- W10 Accessibility and RTL Quality — CLOSED / VERIFIED; final Quality Gate `34010619265` passed all required steps.
- W11 SEO, Local Discovery, and Shareability — CLOSED / VERIFIED; final Quality Gate `34013074378` passed all required steps.
- W12-01 Public Menu Hydration Performance — IMPLEMENTED / QUALITY GATE PENDING.

## Protected Completed Work
- Existing themes, public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls are not reopened without evidence.
- No sixth theme is created as a substitute for product/design strategy.

## W11 Closure Evidence
- VERIFIED: public-menu canonical URLs are absolute production URLs.
- VERIFIED: Arabic is the canonical default locale; English alternates are emitted only when real English tenant and branch names exist.
- VERIFIED: Arabic/English alternates are reciprocal and absolute.
- VERIFIED: preview and missing public menus are noindex.
- VERIFIED: Restaurant structured data is tenant/branch scoped and does not fabricate incomplete Saudi location data.
- VERIFIED: public share metadata includes canonical/Open Graph/Twitter fields where supported by visible data.
- VERIFIED: `/robots.txt` excludes private/control surfaces and advertises `/sitemap.xml`.
- VERIFIED: `/sitemap.xml` is server-generated from active, published tenants and active branches only.
- VERIFIED: W11 Quality run `34013074378` passed install, route generation, typecheck, 123 tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance audit/upload, and preview shutdown.

## W12-01 Public Menu Hydration Performance
- Objective: remove avoidable duplicate client data fetching during SSR hydration without changing freshness, tenant isolation, routing, or theme behavior.
- VERIFIED: `src/routes/m.$slug.tsx` now skips the mount-time `getPublicMenu` request when `initialMenu` is already supplied by the route loader.
- VERIFIED: hydrated `initialMenu` is written to the existing anonymous session cache.
- VERIFIED: the existing client-only loading path remains unchanged when `initialMenu` is unavailable.
- VERIFIED: regression coverage was added to `scripts/quality-workflow.test.mjs`.
- VERIFIED: implementation contract is recorded in `docs/performance-public-menu.md`.
- UNKNOWN: no production RUM measurement is available in this repository to quantify the avoided request count for real users.

## Current Design Strategy
- The five-theme system is not the current design focus; themes remain protected.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

## Exact Next Task
### W12 Quality Closure for W12-01
Objective: verify the public-menu hydration optimization through the repository Quality Gate and close W12-01 only if all checks pass.

Scope:
- typecheck, tests, lint, production build;
- Playwright/template QA across all themes;
- performance audit;
- regression review for public-menu loader/cache behavior.

Acceptance criteria:
- full Quality Gate passes;
- no duplicate hydration fetch when SSR `initialMenu` exists;
- client-only fallback remains functional;
- no cross-tenant or stale-cache regression;
- no unrelated changes.

Risks: loader/client hydration mismatch, accidental freshness regression, cache-key regression, browser behavior differences.

Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, Playwright/template QA, and performance audit.
