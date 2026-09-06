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
- W8 Imagery and Art Direction — CLOSED / VERIFIED; final Quality Gate passed in run `34010117079`.
- W9 Motion and Interaction — CLOSED / VERIFIED; final Quality Gate passed in run `34010117079`.
- **W10 Accessibility and RTL Quality — READY TO START.**

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
- VERIFIED: no new runtime dependency was introduced; existing package versions were preserved.
- VERIFIED: no Supabase schema, tenant data model, or protected theme was modified.
- UNKNOWN: tenant-specific focal-point metadata is not currently part of the canonical data model and was intentionally not introduced in W8.
- VERIFIED: final production browser/performance gate passed in Quality run `34010117079`.
- Evidence record: `docs/image-art-direction.md`.

## Completed W9 — Motion and Interaction
- VERIFIED: `src/motion.css` centralizes duration, easing, distance, scale, and compatibility aliases.
- VERIFIED: public-menu product sheet, cart drawer, and overlay entrance choreography are deterministic and RTL-aware.
- VERIFIED: reduced-motion behavior removes movement/press scaling while preserving state feedback.
- VERIFIED: coarse-pointer hover movement is disabled.
- VERIFIED: `scripts/motion-contract.test.mjs` protects the motion contract and is part of `npm test`.
- VERIFIED: no new runtime dependency or Supabase/schema change was introduced.
- VERIFIED: the pre-existing invalid `@radix-ui/react-popover` range was aligned to the lockfile's installable `^1.1.12` after CI proved it blocked installation; no package upgrade was introduced.
- VERIFIED: Quality run `34010117079` passed install, typecheck, 112 tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- Evidence record: `docs/motion-implementation.md`.

## Exact Current Task
### W10 — Accessibility and RTL Quality

**Objective:** perform a focused accessibility, RTL/LTR, mixed-direction, keyboard, touch-target, focus, semantics, and screen-reader quality pass across the shared public menu and owner-facing critical flows without reopening protected theme architecture.

**Scope:**
- audit semantic HTML, accessible names, landmarks, headings, form labels, dialog semantics, live regions, and status announcements;
- verify keyboard navigation and focus visibility/containment for search, categories, product details, cart, modifiers, language switching, and owner-critical controls;
- verify WCAG 2.2 target size and focus-not-obscured behavior;
- audit Arabic RTL, English LTR, and mixed Arabic/Latin/numeric content including prices, phone numbers, URLs, and product names;
- verify bidi isolation and direction-sensitive icons/layout;
- test long Arabic/English labels, wrapping, clipping, overflow, and sparse/dense content;
- verify reduced-motion remains intact after accessibility changes;
- add regression coverage and run full Quality Gate plus applicable browser checks.

**Acceptance criteria:**
- evidence-based accessibility/RTL contract documented;
- critical customer and owner flows keyboard-usable;
- accessible names/landmarks/headings/forms/dialogs are correct;
- focus is visible and not obscured by fixed UI;
- touch targets satisfy the repository's adopted WCAG target policy;
- Arabic RTL, English LTR, and mixed-direction content remain stable;
- no regression to five protected themes;
- regression coverage exists;
- full Quality Gate passes.

**Risks:** accessibility regressions, RTL mirroring errors, mixed-direction numeric corruption, focus traps, touch-target regressions, theme-specific overrides leaking into shared semantics.

**Verification commands:** `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, applicable Playwright/template QA, accessibility checks, RTL/LTR checks, and performance inspection.

## Protected Work
- Existing five-theme implementation.
- Shared public-menu behavior and customer actions.
- Authentication, authorization, tenant/branch isolation.
- Existing migrations/schema unless evidence proves a requirement.
- Release-only Vercel workflow.
- Existing visual/functional quality system.

## Research Governance
- Material research is recorded in `docs/design-research-log.md` and persistent task evidence documents.
- Use official standards for accessibility, i18n, web platform, SEO, and font licensing.
- Competitors are pattern evidence, not assets or implementation sources.
- Label conclusions `VERIFIED`, `INFERRED`, `UNKNOWN`, `BLOCKED`, or `PROPOSED`.
- Only one atomic task may be active at a time.
