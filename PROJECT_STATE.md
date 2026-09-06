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
- **W6 Typography Evidence & Decision — CLOSED / VERIFIED.**

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

## Typography Decision — W6
- VERIFIED: repository search found no explicit current IBM Plex, Noto, Tajawal, Cairo, Mada, Amiri, or other named font dependency.
- VERIFIED: IBM Plex Sans Arabic + IBM Plex Sans is the selected default shared typography system.
- VERIFIED: Noto Sans Arabic + Noto Sans is Alternate 1.
- VERIFIED: Tajawal is Alternate 2.
- VERIFIED: IBM Plex is OFL-1.1, supports Arabic, is designed for UI environments, and provides web WOFF/WOFF2/subset delivery through the official project.
- VERIFIED: Noto Arabic is maintained by the Noto project and OFL-1.1; official Noto documentation recommends Noto Sans Arabic UI for constrained UI.
- VERIFIED: Tajawal is an OFL-1.1 modern Arabic/Latin family with seven weights.
- PROPOSED implementation: self-host and subset the smallest required IBM Plex Arabic/Latin weights; do not add the IBM npm package solely for font delivery because its package documentation includes telemetry.
- UNKNOWN until implementation benchmark: final payload, CLS/font-swap behavior, and visual fit against every existing theme at runtime.
- Decision record: `docs/design-intelligence.md` under `Typography Decision — 2026-09-06`.

## Current Design Strategy
- The five-theme system is not the current design focus.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

## Exact Next Task
### W6-01 — Typography Implementation
Objective: introduce IBM Plex Sans Arabic + IBM Plex Sans as the shared typography foundation, self-hosted and subsetted, without changing theme architecture.

Acceptance criteria:
- use official font assets/licensing;
- no new dependency;
- smallest required weight set;
- shared semantic typography roles remain intact;
- Arabic/English/mixed-direction/SAR/phone/URL samples render without clipping or bidi defects;
- responsive typography checked at small mobile, mobile, tablet, and desktop;
- font loading and layout-shift impact measured;
- existing five themes remain structurally unchanged;
- typecheck/tests/lint/build and applicable browser/performance checks pass;
- update continuity files and stop.

Risks: excessive payload, font swap/CLS, unintended theme coupling, weight mismatch, mixed-direction regressions.

Verification commands: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, applicable Playwright/template QA, and typography/performance inspection.
