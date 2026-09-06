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
- W10 Accessibility and RTL Quality — CLOSED / VERIFIED; final Quality Gate passed in run `34010619265`.
- **W11 SEO, Local Discovery, and Shareability — IMPLEMENTED / QUALITY GATE PENDING.**

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

## Completed W10 — Accessibility and RTL Quality
- VERIFIED: `src/accessibility.css` provides shared focus scroll margins, document scroll padding, bidi primitives, coarse-pointer behavior, forced-colors focus, and reduced-motion compatibility.
- VERIFIED: root document loads the accessibility layer before protected theme CSS.
- VERIFIED: public product and cart dialogs expose modal semantics, accessible labels, focus entry, Tab/Shift+Tab containment, Escape handling, and focus restoration.
- VERIFIED: public order form controls have programmatic labels, autocomplete hints, appropriate phone/email input direction, and live validation feedback.
- VERIFIED: mixed Arabic/Latin/numeric values use semantic `<bdi>` isolation and `dir="auto"` where direction is data-dependent.
- VERIFIED: fixed/sticky public UI has focus scroll clearance and important mobile controls meet the repository target-size baseline.
- VERIFIED: owner-critical Studio forms were audited at the shared `Field`/`Input` primitive level without introducing a second form system.
- VERIFIED: `scripts/accessibility-contract.test.mjs` protects the W10 contract and is part of the default `npm test` suite.
- VERIFIED: W9 motion contract compatibility was retained after dialog labels became unique.
- VERIFIED: final Quality run `34010619265` passed typecheck, 120 tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- UNKNOWN: direct screen-reader output and authenticated Owner UI keyboard traversal were not manually observed in this connector environment.
- Evidence record: `docs/accessibility-rtl-quality.md`.

## W11 — SEO, Local Discovery, and Shareability — Implementation Complete / Gate Pending

**Objective:** strengthen public-menu discoverability, canonical/locale metadata, restaurant structured data, local discovery signals, share previews, sitemap/robots, QR/deep-link continuity, and indexability without changing protected tenant/auth/theme architecture.

### Implemented
- Absolute production canonical URLs for public menu and branch routes.
- Reciprocal Arabic/English `hreflang` only when real English tenant + branch names exist.
- Stable `og:url`, `og:site_name`, `og:title`, `og:description`, locale, and Twitter card/image metadata.
- Restaurant structured data remains derived from public tenant/branch data and does not fabricate location information.
- `/robots.txt` excludes private/control routes and advertises `/sitemap.xml`.
- `/sitemap.xml` is server-generated from active + published tenants and active branches only.
- English sitemap variants are emitted only when real English tenant/branch names exist.
- Sitemap and robots helpers are pure/testable in `src/lib/menu/seo-discovery.ts`.
- Regression coverage added in `src/lib/menu/seo-discovery.test.ts` and expanded in `src/lib/menu/seo.test.ts`.
- Evidence record: `docs/seo-local-discovery-shareability.md`.

### Security / correctness constraints
- No unpublished or inactive tenant/branch is emitted into the sitemap.
- No owner/admin/studio/private route is emitted.
- Preview theme URLs remain `noindex, nofollow`.
- No session, user, or private tenant data is placed into metadata.
- No fabricated reviews, ratings, coordinates, or unsupported business attributes.
- No new dependency or schema migration.

### Quality closure
- PENDING: current head `1d56aac367d5297051ba07e480f7ceb43116de25` must pass the repository Quality Gate before W11 is marked CLOSED.
- Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, Playwright/template QA, robots/sitemap response checks, canonical/hreflang/schema validation, and performance inspection.

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
