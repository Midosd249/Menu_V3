# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery milestones are protected; browser/device closure remains separately tracked.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED; implementation is being introduced incrementally.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6 Typography Evidence & Decision — CLOSED / VERIFIED.
- **W6-01 Typography Implementation — IN PROGRESS / BLOCKED on binary asset transfer.**

## Canonical Backend Identity
- VERIFIED (2026-09-06): Menu V3 uses Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: Supabase URL is `https://ublxptcqefujkbeepylc.supabase.co`, region `ap-northeast-2` (Seoul), status `ACTIVE_HEALTHY` at verification.
- VERIFIED: Menu V3 canonical database schema is `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary; legacy `public` tables are not the default Menu V3 canonical surface.
- Canonical infrastructure record: `docs/project-infrastructure.md`.

## Current Strategic Direction
Build Menu V3 as a distinctive `Premium Arabic-first Restaurant Presence Platform`: live menu + branded web presence + direct customer action + owner operations + local discoverability, while preserving existing architecture and completed theme work.

## Master Design Strategy
Complete roadmap: `docs/design-strategy-master-plan.md`.

### Workstreams
- W0 Evidence, measurement, product positioning.
- W1 Brand positioning and content system.
- W2 Marketing website/homepage.
- W3 Public customer menu.
- W4 Owner Studio/admin UX.
- W5 Shared design system.
- W6 Typography.
- W7 Color and brand tokens.
- W8 Imagery and art direction.
- W9 Motion and interaction.
- W10 Accessibility and RTL quality.
- W11 SEO/local discovery/shareability.
- W12 Performance and reliability.
- W13 Trust, security, and data ownership.
- W14 Pricing, packaging, and commercial UX.
- W15 Growth, analytics, and experimentation.
- W16 QA, browser/device, and release.

## Completed P0 — Runtime Public Content Propagation
- VERIFIED: migration applied to intended live database.
- VERIFIED: revision column and trigger set exist in `menu_v3`.
- VERIFIED: representative Owner-side mutations increment revision.
- VERIFIED: tenant isolation for revision mechanism.
- VERIFIED: public cache key includes tenant, branch, and revision.
- VERIFIED: no browser menu-content cache exists.
- VERIFIED: focused regression coverage passes in CI.
- VERIFIED: GitHub Actions Quality run `34007481599` completed successfully for commit `a43052b0f1c2ce8c64a00c852dd30f863783aa95`; typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA, performance baseline upload, and cleanup all passed.
- UNKNOWN: direct authenticated Owner UI -> Public HTTP cache behavior remains unexercised in an interactive authenticated browser session.

## Completed W6 — Typography Evidence & Decision
- VERIFIED: repository typography inventory found no explicit named font dependency that must be preserved.
- VERIFIED: eight candidates were evaluated: IBM Plex Sans Arabic + IBM Plex Sans, Noto Sans Arabic + Noto Sans, Tajawal, Mada, Amiri, Noto Kufi Arabic, Lemonada, and Changa.
- VERIFIED: authoritative/open-source evidence was checked for licensing and web-delivery characteristics.
- VERIFIED: IBM Plex Sans Arabic + IBM Plex Sans selected as the default shared typography system.
- VERIFIED: Noto Sans Arabic + Noto Sans selected as Alternate 1.
- VERIFIED: Tajawal selected as Alternate 2.
- VERIFIED: decision, candidate matrix, benchmark content, rejection criteria, and implementation boundary are recorded in `docs/design-intelligence.md`.
- PROPOSED: self-host/subset the smallest required IBM Plex Arabic/Latin weight set; do not add the IBM npm font package solely for font delivery because its package documentation includes telemetry.
- UNKNOWN until final implementation benchmark: final payload, font-swap/CLS behavior, and visual fit across every theme.

## Current W6-01 Progress
- VERIFIED: shared semantic typography contract is implemented in `src/typography.css`.
- VERIFIED: root document loads the shared typography stylesheet before theme styles.
- VERIFIED: IBM Plex Sans Arabic and IBM Plex Sans are requested at weights 400/500/600/700.
- VERIFIED: regression coverage exists in `scripts/typography-contract.test.mjs` and is included in the default test suite.
- VERIFIED: no new font package dependency was added.
- BLOCKED: official WOFF2 binaries cannot currently be transferred into the repository through the available GitHub connector because binary blobs are not accepted by the connector's file transfer path.
- Required remaining work: add official local WOFF2 assets, replace Google Fonts runtime loading with local `@font-face`, then run all quality/performance/browser checks.
- Status detail: `docs/typography-implementation-status.md`.

## Exact Current Task
### W6-01 — Complete self-hosted typography delivery

**Objective:** transfer the official IBM Plex Sans Arabic + IBM Plex Sans WOFF2 assets into the repository, replace runtime Google Fonts loading with local `@font-face` declarations, and verify the full typography implementation without changing theme architecture.

**Acceptance criteria:**
- official font assets/licensing are present locally;
- local `@font-face` covers only the required weights;
- Google Fonts runtime loading is removed;
- no new dependency;
- shared semantic typography roles remain intact;
- Arabic/English/mixed-direction/SAR/phone/URL samples render without clipping or bidi defects;
- responsive typography checked at small mobile, mobile, tablet, and desktop;
- font loading and layout-shift impact measured;
- existing five themes remain structurally unchanged;
- typecheck/tests/lint/build and applicable browser/performance checks pass;
- update continuity files and stop.

**Risks:** binary asset transfer, excessive payload, font swap/CLS, unintended theme coupling, weight mismatch, mixed-direction regressions.

**Verification commands:** `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, applicable Playwright/template QA, and typography/performance inspection.

## Protected Work
- Existing five-theme implementation.
- Shared public-menu behavior and customer actions.
- Authentication, authorization, tenant/branch isolation.
- Existing migrations/schema unless evidence proves a requirement.
- Release-only Vercel workflow.
- Existing visual/functional quality system.

## Research Governance
- Material research is recorded in `docs/design-research-log.md` and the persistent design-intelligence reference.
- Use official standards for accessibility, i18n, web platform, SEO, and font licensing.
- Competitors are pattern evidence, not assets or implementation sources.
- Label conclusions `VERIFIED`, `INFERRED`, `PROPOSED`, or `UNKNOWN`.
- Only one atomic task may be active at a time.
