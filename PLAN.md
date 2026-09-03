# PLAN — Menu V3 Active Delivery Strategy

## Executive Summary
- Status: IN_PROGRESS.
- `main` is the repository source of truth.
- Previous roadmap remains archived as `PLAN_ARCHIVE_2026-09-03.md`.
- Completed Level 0–4C work remains protected.
- The current highest-value product initiative is a template ecosystem redesign based on the existing public-menu renderer, theme registry, and real menu data contract.
- The legacy platform-foundation work remains preserved and is not deleted; final verification of the earlier platform-admin task is deferred while this explicitly selected template task is executed.

## Current Verified State
- `VERIFIED`: React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.
- `VERIFIED`: `src/lib/theme/types.ts` defines eight theme keys.
- `VERIFIED`: `src/lib/theme/registry.ts` stores theme tokens, layout metadata, capabilities, and preview metadata.
- `VERIFIED`: `src/components/public-menu.tsx` is the shared public-menu renderer and already handles product details, modifiers, ordering/cart UI, search, branch information, WhatsApp, and language switching.
- `VERIFIED`: `src/components/menu-theme-controller.tsx` applies a selected theme through `data-menu-theme` attributes; it does not switch to a separate React template renderer.
- `VERIFIED`: `src/routes/themes.tsx` and `src/routes/themes/preview.tsx` provide theme selection and preview using the same `PublicMenuView` renderer.
- `VERIFIED`: `src/routes/m.$slug.tsx` renders published menus through the same public renderer.
- `VERIFIED`: `src/styles.css` contains most theme-specific visual differences through selectors over the shared renderer.
- `VERIFIED`: `src/lib/menu/types.ts` already exposes tenant branding, branches, hours, categories, products, variants, modifiers, dietary labels, allergens, calories, availability, featured state, and bilingual content.
- `VERIFIED`: `package.json` already includes Playwright, TypeScript, ESLint, Vite, and the repository's existing quality commands.
- `UNKNOWN`: exact production traffic distribution by restaurant segment and the completeness of current screenshot-regression infrastructure.

## Product / Architecture Understanding
Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS. Public menus consume canonical tenant/branch/menu data while authenticated Studio/Admin surfaces manage that data. The template layer should remain presentation-focused and must not own authorization, pricing, availability, or tenant boundaries.

## Completed Work — Protected
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historically partially verified; do not rebuild.
- Level 3: DONE / VERIFIED.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED for its defined scope.
- Subscription-plan foundation: DONE / VERIFIED.
- Subscription entitlement enforcement: DONE / VERIFIED for default provisioning/backfill and branch/product/active-team-member limits.
- Repository agent contract: DONE / VERIFIED.
- Platform-admin authorization consistency: implementation completed; final quality verification remains preserved as unfinished historical work and is not deleted.

## Problems and Risks
1. `VERIFIED`: current themes are registered as eight named themes but share one primary React public-menu renderer.
2. `VERIFIED`: layout variation is constrained to a small metadata vocabulary and CSS selectors, limiting genuine structural differentiation.
3. `VERIFIED`: current preview renders the same `PublicMenuView` with a theme attribute, so visual comparison does not yet prove separate template structures.
4. `INFERRED`: the main template-system bottleneck is the lack of a semantic renderer/family boundary between canonical menu content and visual composition.
5. `UNKNOWN`: current visual-regression coverage and production behavior across real restaurant content.
6. `UNKNOWN`: production schema/deployment state for unrelated platform surfaces; do not expand this initiative into those areas.

## Goals
1. Protect existing public-menu behavior and data.
2. Establish a reusable semantic template/family contract.
3. Build one flagship family as a complete vertical slice on the existing `PublicMenu` data contract.
4. Validate realistic Arabic/English mobile and desktop content.
5. Establish accessibility, performance, and visual-regression gates.
6. Expand only to genuinely different families after the flagship proves the architecture.

## Non-Goals
- No project restart or foundation rewrite.
- No deletion of existing theme keys in the first rollout.
- No payment, authentication, authorization, or ordering-backend redesign.
- No arbitrary page-builder/CSS customization system.
- No new database fields unless a proven template requirement cannot be represented by existing data.
- No unrelated Studio/Admin refactor.

## Architecture Decisions
- `PublicMenu` remains the canonical content contract unless evidence proves a missing field.
- Template families own presentation and layout composition; they do not own data access or business rules.
- Existing `ThemeKey` values remain backwards compatible during migration.
- New template infrastructure should coexist with the current renderer until visual, accessibility, performance, and regression acceptance is proven.
- Shared semantic primitives should be reusable across families; family composition should be structurally distinct.
- Existing dependencies should be reused; no new UI framework is justified by the current evidence.

## Research and References
- **VERIFIED external — Toast:** current online-ordering documentation emphasizes menu visibility, popular items/upsells, search, mobile section navigation, and branded ordering pages. Application: menu navigation and discovery are conversion-critical infrastructure. Sources: https://support.toasttab.com/en/article/Getting-Started-Online-Ordering and https://support.toasttab.com/en/article/Online-Ordering-FAQ
- **VERIFIED external — Square:** menu documentation separates customer-facing menus from internal categories and supports location/channel visibility, hours, item visibility, branded ordering profiles, and QR ordering. Application: template rendering must respect existing menu/branch visibility and remain presentation-only. Sources: https://squareup.com/help/us/en/article/6424-create-menus-with-square-for-restaurants and https://squareup.com/help/us/en/article/8566-set-up-an-online-ordering-profile
- **VERIFIED external — GloriaFood:** emphasizes photo-rich menus, modifiers, nutritional/allergen information, responsive ordering, and website presentation. Application: templates should exploit rich existing item metadata without requiring all concepts to be image-heavy. Source: https://www.gloriafood.com/online-ordering-system-for-restaurants
- **VERIFIED external — Radix:** accessible primitives cover focus management, keyboard navigation, labels, and RTL-aware interaction patterns. Application: reuse existing accessible patterns rather than inventing bespoke interaction semantics. Source: https://www.radix-ui.com/primitives/docs/overview/accessibility
- **VERIFIED external — W3C WAI-ARIA APG:** menu and menu-button patterns define semantics, labels, state, and keyboard expectations. Application: navigation and interactive template controls must preserve semantic HTML and correct focus behavior. Sources: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ and https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- **VERIFIED external — web.dev:** below-fold images should generally be lazy-loaded while truly critical imagery should be prioritized; responsive image sizing reduces transfer and decoding cost. Application: template media rules must distinguish critical hero media from product media. Sources: https://web.dev/learn/performance/image-performance and https://web.dev/learn/design/responsive-images
- **VERIFIED external — open source:** `danishfareed/restaurant-digital-menu` demonstrates a React restaurant-menu architecture, but its scope is materially below Menu V3's multi-tenant, RTL, ordering, and template requirements. Source: https://github.com/danishfareed/restaurant-digital-menu

## Template Ecosystem Redesign — Active Plan

### Strategic outcome
Create a presentation system where a family is defined by information hierarchy, navigation behavior, product composition, density, imagery, and conversion intent—not by a color palette applied to one generic layout.

### Milestone T1 — Template architecture contract
- **Status:** IN_PROGRESS.
- **Goal:** introduce a family-level template contract that can coexist with the existing `ThemeKey` registry and `PublicMenu` renderer.
- **Reason for priority:** this is the smallest architectural change that unblocks genuine structural templates while preserving all existing public menus.
- **Repository evidence:** current theme definitions contain tokens/layout/capabilities, while all public previews and published menus still render through `PublicMenuView`.
- **Dependencies:** existing theme registry and public menu types only.
- **Likely files:** `src/lib/theme/types.ts`, `src/lib/theme/registry.ts`, `src/lib/theme/index.ts`, focused theme tests, and later renderer modules.
- **Acceptance criteria:** every current theme has an explicit family classification; family identifiers are type-safe; existing theme keys and resolution remain unchanged; a deterministic family lookup is available to future renderers; no public menu behavior changes.
- **Verification:** `npm install --no-audit --no-fund`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.
- **Risks:** incorrect classification could create migration confusion; mitigate by keeping current theme keys and treating family mapping as metadata only in this milestone.

### Milestone T2 — Shared semantic menu primitives
- **Status:** TODO.
- **Goal:** extract reusable, accessible presentation primitives without changing canonical data or business rules.
- **Reason:** reduces duplication while allowing genuinely different family compositions.
- **Dependencies:** T1.
- **Likely files:** `src/components/menu/*`, public menu integration, tests.
- **Acceptance:** primitives handle long content, missing images, price/modifier metadata, RTL, focus, and responsive behavior without owning business logic.
- **Verification:** unit tests, typecheck, lint, build, accessibility/manual checks.

### Milestone T3 — Flagship vertical template
- **Status:** TODO.
- **Goal:** build one complete family, recommended initial target `contemporary-restaurant` unless implementation evidence favors `specialty-cafe`.
- **Reason:** proves the architecture against real customer value before scaling the number of templates.
- **Dependencies:** T1 and T2.
- **Likely files:** new family renderer, theme mapping, public menu integration, preview route, styles, fixture data.
- **Acceptance:** visibly and structurally distinct from the legacy renderer; real menu content; mobile/desktop; Arabic/English; long names; missing images; modifiers; availability; featured items; clear prices/actions.
- **Verification:** Playwright if existing harness supports it, manual visual review, accessibility checks, lint/typecheck/build/tests.

### Milestone T4 — Visual and quality gates
- **Status:** TODO.
- **Goal:** establish deterministic screenshot fixtures and accessibility/performance checks for the flagship.
- **Reason:** attractive UI without regression controls is not production-ready.
- **Dependencies:** T3.
- **Acceptance:** stable screenshots at representative viewport/locale combinations; no critical layout regressions; reduced-motion and keyboard checks; image-loading strategy verified.

### Milestone T5 — Family expansion
- **Status:** TODO.
- **Goal:** add genuinely different families in priority order: `specialty-cafe`, `bakery-dessert`, `fast-casual`, `fine-dining-hospitality`, `small-menu`.
- **Reason:** expand coverage only after the first vertical proves the family architecture.
- **Dependencies:** T4.
- **Acceptance:** each family has a distinct hierarchy/composition and a documented target segment; no cosmetic clones.

### Milestone T6 — Legacy migration and controlled customization
- **Status:** TODO.
- **Goal:** map legacy theme keys to new family implementations where proven and expose bounded customization safely.
- **Reason:** migration should be reversible and should not break published menus.
- **Dependencies:** T4 and T5.
- **Acceptance:** legacy keys remain valid; rollback is possible; customization cannot break accessibility or layout envelopes.

### Milestone T7 — Production rollout
- **Status:** TODO.
- **Goal:** staged rollout, performance verification, analytics comparison, and final retirement decisions for legacy renderers.
- **Reason:** protect live menus and validate real-world behavior before removal.
- **Dependencies:** T6.
- **Acceptance:** live-safe migration, rollback path, verified performance and critical journeys.

## First Atomic Task
- **Status:** IN_PROGRESS.
- **Task:** Establish and test the family-level template contract for the existing theme registry without changing public rendering behavior.
- **Why first:** it directly addresses the verified architectural bottleneck, creates the smallest reusable boundary for future real templates, and is reversible because existing theme keys and CSS rendering remain unchanged.
- **Acceptance:** six family identifiers exist; all eight existing themes map to one family; `getThemeFamily()` is deterministic; legacy theme resolution remains unchanged; focused regression tests pass.

## Rollback / Recovery
- Revert only the family metadata/type/test changes if verification fails.
- Do not delete existing themes, renderer paths, or public menu data.
- Keep legacy theme resolution available until T6/T7 acceptance is complete.

## Verification State
- `VERIFIED`: current repository contains the existing theme registry, public renderer, preview route, and theme controller.
- `VERIFIED`: family contract and registry classification have now been implemented as the first template task.
- `IN_PROGRESS`: quality verification for the current template-family change.
- `UNKNOWN`: production visual behavior until browser/manual validation is completed.

## Progress Log
- 2026-09-03 — Audited the existing theme registry, public renderer, preview flow, menu data contract, package tooling, branches, and recent history.
- 2026-09-03 — Researched Toast, Square, GloriaFood, Radix, WAI-ARIA, web.dev, and an open-source React menu reference; recorded transferable principles and tradeoffs.
- 2026-09-03 — Created `docs/template-system-strategy.md` with the evidence-based template ecosystem strategy.
- 2026-09-03 — Added type-safe template family metadata to the existing theme system without changing public rendering.
- 2026-09-03 — Added focused regression coverage for family mapping and preserved theme-key resolution.

## Exact Next Task
- **Complete the quality gate for the template-family contract. If green, mark T1 DONE and select the next unblocked task from the active template plan; if not green, fix only the verified failure.**
