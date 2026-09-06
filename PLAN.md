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
- W11 SEO, Local Discovery, and Shareability — CLOSED / VERIFIED; final Quality Gate passed in run `34013074378`.
- W12-01 Public Menu Hydration Performance — CLOSED / VERIFIED; final Quality Gate passed in run `34013861903`.
- W12-02 Public Menu Resource & Bundle Efficiency — CLOSED / VERIFIED for the current low-risk resource-efficiency slice; Quality Gate run `34014895325` passed all required steps.

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

## Completed W11 — SEO, Local Discovery, and Shareability
- VERIFIED: public-menu canonical URLs are absolute production URLs.
- VERIFIED: reciprocal Arabic/English `hreflang` only when real English tenant + branch names exist.
- VERIFIED: stable Open Graph/Twitter metadata where visible data supports it.
- VERIFIED: Restaurant structured data remains tenant/branch scoped and does not fabricate location information.
- VERIFIED: `/robots.txt` excludes private/control routes and advertises `/sitemap.xml`.
- VERIFIED: `/sitemap.xml` is server-generated from active + published tenants and active branches only.
- VERIFIED: English sitemap variants are emitted only when real English names exist.
- VERIFIED: no unpublished/inactive tenant or branch is emitted.
- VERIFIED: preview and missing public menus remain noindex.
- VERIFIED: no new dependency or schema migration was introduced.
- VERIFIED: discovery regression coverage exists in `src/lib/menu/seo-discovery.test.ts` and `src/lib/menu/seo.test.ts`.
- VERIFIED: final Quality run `34013074378` passed install, route generation, typecheck, 123 tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance audit/upload, and preview shutdown.
- Evidence record: `docs/seo-local-discovery-shareability.md`.

## Completed W12-01 — Public Menu Hydration Performance
- Objective: remove avoidable duplicate client data fetching during SSR hydration without changing freshness, tenant isolation, routing, or theme behavior.
- VERIFIED: `src/routes/m.$slug.tsx` skips the mount-time `getPublicMenu` request when `initialMenu` is supplied by the route loader.
- VERIFIED: hydrated `initialMenu` is written to the existing anonymous session cache.
- VERIFIED: the existing client-only loading path remains unchanged when `initialMenu` is unavailable.
- VERIFIED: regression coverage was added to `scripts/quality-workflow.test.mjs`.
- VERIFIED: implementation contract is recorded in `docs/performance-public-menu.md`.
- VERIFIED: final Quality Gate `34013861903` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- UNKNOWN: no production RUM measurement is available to quantify the avoided request count for real users.

## Completed W12-02 — Public Menu Resource & Bundle Efficiency
- Objective: reduce avoidable public-menu resource startup cost using verified architecture/build evidence and the smallest safe change.
- VERIFIED: audited root resource loading, typography delivery, public-menu route, theme CSS loading, and `scripts/performance-audit.mjs`.
- VERIFIED: the public menu's critical font origin is `https://cdn.jsdelivr.net` under the established Fontsource typography contract.
- VERIFIED: `src/routes/__root.tsx` now warms that critical cross-origin connection with `preconnect` using anonymous CORS mode and provides `dns-prefetch` fallback.
- VERIFIED: `scripts/quality-workflow.test.mjs` protects the connection-hint ordering contract.
- VERIFIED: no runtime dependency, Supabase/schema, tenant/cache, hydration, or theme behavior changed.
- VERIFIED: theme CSS remains globally available because the current preview/theme architecture relies on immediate theme availability; route-level stylesheet injection was deliberately rejected for this slice because it would add first-paint/FOUC and switching risk without stronger deployment evidence.
- VERIFIED: no arbitrary JS/CSS budget was introduced; the repository continues to measure resource transfer and Core Web Vitals through the existing performance audit.
- VERIFIED: Quality Gate `34014895325` passed install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- Evidence record: `docs/performance-public-menu-resources.md`.

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

## Exact Next Task
### W12-03 — Reliability and Failure-Path Audit
Objective: inspect public-menu and critical application failure behavior under timeout, upstream failure, malformed/partial data, cache miss, retry, navigation interruption, and dependency degradation; improve only evidenced failure-path weaknesses without changing successful-path architecture.

Acceptance criteria:
- critical failure states remain understandable and actionable in Arabic and English;
- no unhandled rejection or infinite retry loop;
- no stale/cross-tenant cache exposure;
- timeout/retry behavior remains bounded;
- browser and automated regression coverage exists for every changed failure path;
- full Quality Gate passes;
- no unrelated changes.

Verification: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, Playwright/template QA, performance audit, and targeted failure-path tests.
