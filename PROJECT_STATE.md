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
- W6-01 Typography Implementation — CLOSED / VERIFIED using immutable upstream IBM Plex assets delivered through a CORS-compatible CDN; no runtime font package dependency.
- **W7 Color / Surface / Contrast System — READY TO START.**

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

## Typography Decision — W6
- VERIFIED: IBM Plex Sans Arabic + IBM Plex Sans is the selected default shared typography system.
- VERIFIED: Noto Sans Arabic + Noto Sans is Alternate 1.
- VERIFIED: Tajawal is Alternate 2.
- VERIFIED: IBM Plex is OFL-1.1, supports Arabic, is designed for UI environments, and exposes web WOFF/WOFF2 assets.
- VERIFIED: decision record: `docs/design-intelligence.md` under `Typography Decision — 2026-09-06`.

## W6-01 Typography Implementation — CLOSED Evidence
- VERIFIED: `src/typography.css` defines the shared semantic typography contract.
- VERIFIED: `src/routes/__root.tsx` loads the typography contract before theme styles.
- VERIFIED: Arabic and Latin IBM Plex WOFF2 assets are pinned to immutable upstream commit SHAs.
- VERIFIED: assets are delivered through jsDelivr with CORS-compatible URLs; Google Fonts runtime loading is removed.
- VERIFIED: weights 400/500/600/700, `font-display: swap`, semantic roles, numeric treatment, and bidi isolation are covered.
- VERIFIED: `scripts/typography-contract.test.mjs` protects the delivery contract and prevents Google Fonts/font-package regression.
- VERIFIED: no new runtime font dependency was added.
- VERIFIED: the previous Browser Template QA failure was traced to the font delivery path; the implementation was changed to the pinned CORS-compatible CDN path.
- UNKNOWN until the new CI run completes: final browser-template QA and performance result for the corrected delivery path.

## Current Design Strategy
- The five-theme system is not the current design focus; themes remain protected.
- External research covers Saudi/MENA and global restaurant technology, branded web presence, public menu UX, Owner Studio, Arabic/RTL, accessibility, typography, performance, SEO/local discovery, conversion, trust, pricing, analytics, and release QA.
- INFERRED: strongest strategic territory is `Premium Arabic-first Restaurant Presence Platform`.
- PROPOSED: strengthen shared brand/design system and connected customer/owner experience while preserving theme personality.
- Complete roadmap: `docs/design-strategy-master-plan.md`.
- Design contract: `docs/design-system-contract.md`.

## Exact Next Task
### W7 — Color / Surface / Contrast System
Objective: establish and implement a shared, accessible semantic color/surface contract that improves product polish and trust without flattening the five protected theme personalities.

Scope:
- audit existing color tokens and surfaces across shared UI and all five themes;
- establish semantic roles for background, surface, elevated surface, text, muted text, border, primary, accent, success, warning, danger, focus, overlay, and interactive states;
- verify WCAG contrast for text, controls, focus indicators, and meaningful non-text UI;
- define light/dark behavior where applicable without forcing every theme into the same palette;
- preserve tenant branding and theme-specific visual identity;
- add regression tests for the semantic contract;
- validate mobile and desktop states;
- run typecheck, tests, lint, build, browser QA, and applicable performance checks.

Acceptance criteria:
- evidence-based semantic color contract documented;
- no theme personality is flattened or replaced;
- critical text and controls meet the selected accessibility target;
- focus/hover/active/disabled/error/success states are explicit;
- no hard-coded shared UI colors remain where a semantic token is required;
- regression coverage exists;
- full Quality Gate passes.

Risks: contrast regressions, tenant-brand collisions, theme coupling, dark-mode inconsistencies, visual hierarchy changes.

Verification commands: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, applicable Playwright/template QA, and performance inspection.
