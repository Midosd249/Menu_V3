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
- **W8 Imagery and Art Direction — CLOSED / VERIFIED at contract and implementation-layer level; final production browser/performance run remains explicitly UNKNOWN until CI completes.**
- **W9 Motion and Interaction — READY TO START.**

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

## Completed W8 — Imagery and Art Direction
- VERIFIED: `docs/image-art-direction.md` defines image roles, art direction, responsive delivery, fallbacks, accessibility, licensing, provenance, and theme-specific direction.
- VERIFIED: dish/card imagery uses a 4:3 default framing rule; brand/editorial imagery uses 16:9 or 3:2 according to surface.
- VERIFIED: focal-point and mobile focal-point hooks are implemented in `src/image-art-direction.css`.
- VERIFIED: shared image CSS is loaded from `src/routes/__root.tsx` before theme styles.
- VERIFIED: existing public-menu dish media retains lazy loading, async decoding, and low fetch priority for non-critical media.
- VERIFIED: `scripts/image-art-direction-contract.test.mjs` protects the new contract and is part of `npm test`.
- VERIFIED: no new runtime dependency was introduced; package versions were preserved.
- VERIFIED: no Supabase schema, tenant data model, or protected theme was modified.
- UNKNOWN: tenant-specific focal-point metadata is not currently part of the canonical data model and was intentionally not introduced in W8.
- UNKNOWN: final production browser/performance result for the latest W8 commit until the new Quality run completes.
- Evidence record: `docs/image-art-direction.md`.

## Exact Current Task
### W9 — Motion and Interaction

**Objective:** create a restrained, premium motion system that improves hierarchy, feedback, orientation, and perceived quality without introducing motion sickness, blocking interaction, harming accessibility, or compromising mobile performance.

**Scope:**
- audit existing transitions, drawers, dialogs, buttons, cart interactions, theme previews, loading states, and route changes;
- define motion tokens for duration, easing, distance, scale, and opacity;
- define interaction feedback for hover, focus, press, selection, success, error, and loading;
- define entrance/exit choreography for mobile drawers, sheets, and overlays;
- preserve immediate feedback for primary customer actions;
- support `prefers-reduced-motion` and avoid essential information conveyed only by animation;
- avoid layout-affecting animation where transform/opacity can achieve the same result;
- define motion budgets for mobile and low-power devices;
- add regression coverage for the motion contract;
- run full Quality Gate and applicable browser/performance checks.

**Acceptance criteria:**
- evidence-based motion contract documented;
- motion tokens are centralized and theme-compatible;
- key interactions have consistent feedback;
- reduced-motion behavior is explicit and verified;
- no avoidable layout-shift or interaction-blocking animation;
- five protected themes remain visually distinct;
- regression coverage exists;
- full Quality Gate passes.

**Risks:** excessive motion, accessibility regressions, jank on low-end mobile devices, theme inconsistency, interaction delays.

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
