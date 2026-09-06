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
- Supabase status at verification: `ACTIVE_HEALTHY`.
- Menu V3 canonical database schema: `menu_v3`.
- Menu V3 is separated from legacy application data by schema boundary; legacy `public` tables are not the canonical Menu V3 surface.
- Canonical infrastructure reference: `docs/project-infrastructure.md`.

## Current Position
- G1–G7.2 completed work remains protected.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery — protected; browser/device closure remains separately blocked where noted.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- External Theme Preview QR Mode — DONE / VERIFIED.
- Shared Public Menu Rendering Stabilization — VERIFIED.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED as documentation; implementation not started.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- **P0 Public Content Propagation — CLOSED / VERIFIED.**

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
- VERIFIED: GitHub Actions Quality run `34007481599` for commit `a43052b0f1c2ce8c64a00c852dd30f863783aa95` completed successfully. All quality steps passed, including typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA, performance baseline upload, and cleanup.
- VERIFIED: the focused cache regression test passed in CI after the lint/regex correction.
- UNKNOWN: direct authenticated Owner UI -> Public HTTP response cache behavior has not been exercised in an interactive authenticated browser session in this environment.

## Current Design Strategy
- The five-theme system is not the current design focus.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

## Exact Next Task
### W6 — Typography Evidence & Decision
Objective: perform the evidence-based Arabic-first typography decision using repository usage, current design contract, performance constraints, mixed Arabic/Latin readability, numeric/bidi behavior, and authoritative font/licensing evidence. Do not change application code until the decision is documented and acceptance criteria are defined.

Acceptance criteria:
- shortlist and compare candidate Arabic/Latin font systems;
- verify licensing/availability and web delivery implications;
- assess Arabic headings/body, Latin, numbers, SAR, and mixed bidi cases;
- select one default and up to two alternates with rationale;
- record decision and sources in the design research log/plan;
- define the smallest implementation task separately;
- no theme rewrite and no unrelated application changes.
