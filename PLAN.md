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
- W6-01 Typography Implementation — CLOSED / VERIFIED; corrected Fontsource CDN delivery passed full Quality Gate.
- W7 Color / Surface / Contrast System — CLOSED / VERIFIED.
- **W8 Imagery and Art Direction — READY TO START.**

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
- VERIFIED: exact Fontsource `5.3.0` CDN URLs are used for Arabic and Latin WOFF2 assets.
- VERIFIED: Google Fonts runtime loading and preconnects were removed.
- VERIFIED: `scripts/typography-contract.test.mjs` covers pinned delivery, semantic weights, bidi isolation, numeric treatment, and no font-package dependency.
- VERIFIED: no new runtime dependency was added.
- VERIFIED: the previous Browser Template QA failure was isolated to the old font delivery path; the corrected Fontsource path passed browser QA and performance.
- VERIFIED: GitHub Actions Quality run `34009000701` passed typecheck, tests, lint, production build, all-theme browser QA, performance baseline upload, and preview shutdown.
- Delivery exception: strict local WOFF2 self-hosting remains unclaimed because the available repository connector cannot transfer binary assets; exact versioned CDN delivery is the verified production model.
- Implementation status: `docs/typography-implementation-status.md`.

## Completed W7 — Color / Surface / Contrast System
- VERIFIED: shared semantic color/surface contract is implemented in `src/colors.css`.
- VERIFIED: semantic roles cover canvas, primary/secondary/elevated/inverse surfaces, overlay, content hierarchy, borders, actions, focus, status, disabled, and interactive states.
- VERIFIED: all five protected themes have semantic adapters without replacing theme personalities.
- VERIFIED: success/warning/danger/info remain semantic and theme-independent.
- VERIFIED: default critical palette contrast checks meet the selected WCAG AA targets; the Noir accent is checked against its dark canvas.
- VERIFIED: focus-visible, disabled, placeholder, reduced-motion, and higher-contrast behavior are explicit.
- VERIFIED: the public menu shell and form controls consume semantic surface/content/border roles.
- VERIFIED: regression coverage exists in `scripts/color-contract.test.mjs` and is part of the default test suite.
- VERIFIED: GitHub Actions Quality run `34009000701` passed the complete required gate, including all-theme browser QA and performance baseline.
- Evidence record: `docs/color-system-implementation-status.md`.

## Exact Current Task
### W8 — Imagery and Art Direction

**Objective:** make hospitality quality immediately visible through a disciplined, premium image/art-direction system without weakening performance, accessibility, or the five protected theme personalities.

**Scope:**
- audit current image usage, placeholders, screenshots, avatars, food/product imagery, branch imagery, and marketing surfaces;
- research high-quality hospitality/editorial image patterns and current web-platform guidance;
- define art direction for hero, menu items, restaurants, branches, Owner Studio previews, and product screenshots;
- define aspect-ratio, crop, focal-point, object-position, and responsive sizing rules;
- define missing/poor-image fallbacks that preserve layout and brand hierarchy;
- define responsive image delivery, compression, loading priority, and stable geometry rules;
- define Arabic-first alt-text/content rules and decorative-image handling;
- preserve tenant ownership and never introduce unlicensed competitor imagery or copied creative assets;
- add regression coverage for image dimensions/fallback/accessibility contracts where the current architecture supports it;
- run full Quality Gate plus applicable browser/performance checks.

**Acceptance criteria:**
- evidence-based imagery/art-direction contract documented;
- no protected theme is flattened or replaced;
- critical public-menu and marketing images have explicit sizing/crop/fallback behavior;
- responsive image loading does not introduce avoidable layout shift;
- meaningful images have accessible alternative text and decorative images are not announced;
- no unlicensed or competitor-owned creative is introduced;
- regression coverage exists for the chosen contracts;
- full Quality Gate passes.

**Risks:** image licensing, visual inconsistency, CLS/performance regressions, poor Arabic content context, over-art-directed themes, oversized mobile payloads.

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
