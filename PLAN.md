# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery milestones are protected; browser/device closure remains separately tracked.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- Design Intelligence & Product Experience Research — CLOSED / VERIFIED at planning level.
- Shared Design System Contract — BASELINE ESTABLISHED / VERIFIED; implementation is incremental.
- P0-01 Canonical Content & Publishing Model Audit — CLOSED / VERIFIED.
- P0 Public Content Propagation — CLOSED / VERIFIED.
- W6 Typography Evidence & Decision — CLOSED / VERIFIED.
- W6-01 Typography Implementation — CLOSED / VERIFIED.
- **W7 Color / Surface / Contrast System — READY TO START.**

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
- VERIFIED: GitHub Actions Quality run `34007481599` completed successfully for the P0 closure commit.
- UNKNOWN: direct authenticated Owner UI -> Public HTTP cache behavior remains unexercised in an interactive authenticated browser session.

## Completed W6 — Typography Evidence & Decision
- VERIFIED: eight candidates were evaluated with authoritative/open-source evidence.
- VERIFIED: IBM Plex Sans Arabic + IBM Plex Sans selected as the default shared typography system.
- VERIFIED: Noto Sans Arabic + Noto Sans is Alternate 1; Tajawal is Alternate 2.
- VERIFIED: decision record is maintained in `docs/design-intelligence.md`.

## Completed W6-01 — Typography Implementation
- VERIFIED: shared semantic typography contract is implemented in `src/typography.css`.
- VERIFIED: root document loads typography before theme styles.
- VERIFIED: IBM Plex Sans Arabic and IBM Plex Sans weights 400/500/600/700 are declared with `@font-face`.
- VERIFIED: each WOFF2 URL is pinned to an immutable IBM Plex upstream commit SHA and delivered through jsDelivr for browser-compatible CORS.
- VERIFIED: Google Fonts runtime loading and preconnects were removed.
- VERIFIED: `scripts/typography-contract.test.mjs` covers pinned delivery, semantic weights, bidi isolation, numeric treatment, and no font-package dependency.
- VERIFIED: no new runtime dependency was added.
- VERIFIED: the prior Browser Template QA failure was isolated to the font delivery path; the corrected pinned CDN path is now the implementation.
- UNKNOWN until the new CI run completes: browser-template QA and performance result for the corrected path.
- Implementation status: `docs/typography-implementation-status.md`.

## Exact Current Task
### W7 — Color / Surface / Contrast System

**Objective:** establish and implement a shared, accessible semantic color/surface contract that improves product polish and trust without flattening the five protected theme personalities.

**Scope:**
- audit existing shared color tokens and surfaces across all five themes;
- establish semantic roles for background, surface, elevated surface, text, muted text, border, primary, accent, success, warning, danger, focus, overlay, and interactive states;
- verify WCAG contrast for text, controls, focus indicators, and meaningful non-text UI;
- define light/dark behavior where applicable without forcing every theme into one palette;
- preserve tenant branding and theme-specific visual identity;
- add regression tests for the semantic contract;
- validate mobile and desktop states;
- run typecheck, tests, lint, build, browser QA, and applicable performance checks.

**Acceptance criteria:**
- evidence-based semantic color contract documented;
- no theme personality is flattened or replaced;
- critical text and controls meet the selected accessibility target;
- focus/hover/active/disabled/error/success states are explicit;
- no hard-coded shared UI colors remain where a semantic token is required;
- regression coverage exists;
- full Quality Gate passes.

**Risks:** contrast regressions, tenant-brand collisions, theme coupling, dark-mode inconsistencies, visual hierarchy changes.

**Verification commands:** `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, applicable Playwright/template QA, and performance inspection.

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
