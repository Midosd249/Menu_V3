# PLAN — Menu V3 Active Delivery Strategy

## Executive Summary
- Status: IN_PROGRESS.
- `main` is the repository source of truth.
- Previous roadmap is preserved as `PLAN_ARCHIVE_2026-09-03.md`.
- Completed Level 0–4C work remains protected.
- Active initiative: Template Ecosystem Redesign.
- T1 and T2 are DONE / VERIFIED. The next task is T3, the first structurally distinct flagship template family.

## Current Verified State
- `VERIFIED`: React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.
- `VERIFIED`: eight existing `ThemeKey` values are preserved.
- `VERIFIED`: all current public menus and theme previews use the shared `PublicMenuView` renderer.
- `VERIFIED`: theme registry contains tokens, layout metadata, capabilities, preview metadata, and now a type-safe `TemplateFamily` boundary.
- `VERIFIED`: `src/lib/menu/types.ts` contains bilingual content, categories, products, variants, modifiers, availability, images, dietary labels, allergens, calories, branding, branches, and hours.
- `VERIFIED`: `package.json` provides tests, typecheck, lint, build, Playwright, TypeScript, and Vite.
- `UNKNOWN`: production traffic distribution by restaurant segment and complete screenshot-regression coverage.

## Product and Architecture Understanding
Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS. Public menus consume canonical tenant/branch/menu data; authenticated Studio/Admin surfaces manage that data. Template code is presentation-only and must not own authorization, pricing, availability, tenant boundaries, or ordering rules.

## Completed Work — Protected
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historical partial verification; do not rebuild.
- Level 3: DONE / VERIFIED.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED.
- Subscription-plan foundation: DONE / VERIFIED.
- Subscription entitlement enforcement: DONE / VERIFIED.
- Repository agent contract: DONE / VERIFIED.
- Platform-admin authorization consistency: implementation completed; historical final verification remains preserved.
- T1 template architecture contract: DONE / VERIFIED.
- T2 shared semantic menu presentation primitives: DONE / VERIFIED.

## Problems and Risks
- `VERIFIED`: eight themes currently share the main React renderer.
- `VERIFIED`: structural variation is constrained by metadata and CSS rather than distinct family composition.
- `INFERRED`: the main template bottleneck is the boundary between canonical menu content and family-specific composition.
- `UNKNOWN`: production visual behavior and screenshot-regression coverage.

## Goals
1. Protect existing public-menu behavior and data.
2. Use reusable semantic primitives as the common foundation.
3. Build one complete flagship family as a real vertical slice.
4. Validate Arabic/English, RTL, mobile/desktop, long content, missing images, availability, modifiers, pricing, accessibility, and performance.
5. Expand only after the flagship proves the architecture.

## Non-Goals
- No project restart or foundation rewrite.
- No deletion of legacy theme keys.
- No payment/auth/authorization/order-backend redesign.
- No arbitrary page-builder customization.
- No new database fields without a proven requirement.
- No unrelated Studio/Admin refactor.

## Architecture Decisions
- `PublicMenu` remains the canonical content contract.
- Template families own presentation and layout composition only.
- Existing `ThemeKey` values remain backwards compatible.
- New template infrastructure coexists with the legacy renderer until acceptance gates pass.
- Shared primitives are reusable; family composition must be structurally distinct.
- Existing dependencies are reused; no new UI framework is justified.

## Research and References
- `VERIFIED`: Toast online ordering guidance emphasizes visibility, search, section navigation, and branded ordering. Application: discovery/navigation are core conversion surfaces. https://support.toasttab.com/en/article/Getting-Started-Online-Ordering
- `VERIFIED`: Square menu guidance supports customer-facing organization, location/channel visibility, hours, and QR ordering. Application: templates remain presentation-only and respect canonical menu visibility. https://squareup.com/help/us/en/article/6424-create-menus-with-square-for-restaurants
- `VERIFIED`: GloriaFood emphasizes photos, modifiers, dietary/allergen information, responsive ordering, and web presentation. Application: use rich existing data without forcing every family to be image-heavy. https://www.gloriafood.com/online-ordering-system-for-restaurants
- `VERIFIED`: Radix documents keyboard/focus accessibility primitives. Application: reuse semantic interaction patterns. https://www.radix-ui.com/primitives/docs/overview/accessibility
- `VERIFIED`: W3C WAI-ARIA APG documents menu-button/menubar semantics. Application: navigation controls must preserve semantic roles, labels, state, and keyboard behavior. https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ and https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- `VERIFIED`: web.dev recommends lazy loading below-fold imagery and responsive sizing while prioritizing critical media. Application: shared media primitives distinguish eager and deferred images. https://web.dev/learn/performance/image-performance and https://web.dev/learn/design/responsive-images
- `VERIFIED`: `danishfareed/restaurant-digital-menu` is a useful React reference but does not cover Menu V3's multi-tenant, RTL, ordering, and template requirements. https://github.com/danishfareed/restaurant-digital-menu

## Template Ecosystem Redesign — Active Plan

### Proposed Families
1. `specialty-cafe` — compact, fast-scanning cafe experience.
2. `bakery-dessert` — image-led, visual product grouping.
3. `fast-casual` — high-density, fast ordering and prominent prices/actions.
4. `contemporary-restaurant` — balanced editorial hierarchy for modern restaurants.
5. `fine-dining-hospitality` — immersive, restrained, story-led presentation.
6. `small-menu` — direct, low-friction food truck/pop-up experience.

### Milestone T1 — Template architecture contract
- **Status:** DONE / VERIFIED.
- **Purpose:** create a type-safe family boundary while preserving existing theme keys and rendering.
- **Implemented:** six `TemplateFamily` identifiers, eight theme classifications, deterministic `getThemeFamily()`, focused tests.
- **Verification:** GitHub Actions run `33742263927` passed install, route generation, typecheck, tests, lint, and production build.

### Milestone T2 — Shared semantic menu presentation primitives
- **Status:** DONE / VERIFIED.
- **Purpose:** provide reusable semantic building blocks for future family renderers without changing data or business rules.
- **Implemented:** `MenuMedia`, `MenuPrice`, `MenuBadge`, `MenuSection`, `MenuProductCard`; exported through `src/components/menu/index.ts`.
- **Acceptance:** semantic HTML, responsive layout, long-content wrapping, missing-image fallback, RTL-compatible inherited direction, no business-rule ownership.
- **Verification:** GitHub Actions run `33742271561` passed install, route generation, typecheck, tests, lint, and production build.

### Milestone T3 — Flagship vertical template
- **Status:** IN_PROGRESS.
- **Purpose:** build the first genuinely structurally distinct family using the existing `PublicMenu` contract.
- **Priority:** first visible product-quality replacement and architecture proof before family expansion.
- **Dependencies:** T1 + T2.
- **Selected family:** `contemporary-restaurant`, because it is the broadest balanced family and exercises descriptions, imagery, categories, featured items, pricing, modifiers, and bilingual content without requiring extreme assumptions about one restaurant segment.
- **Likely files:** new family renderer under `src/components/menu/`, additive integration boundary, theme mapping, preview integration, focused fixtures/tests, and scoped styles.
- **Acceptance:** structurally distinct from legacy renderer; real Arabic/English content; mobile/desktop; RTL; long names; missing images; modifiers; availability; featured items; clear prices/actions; legacy themes remain available.
- **Verification:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`; Playwright/manual visual checks where the existing harness supports them.
- **Risks:** accidental coupling to business rules or legacy rendering; mitigate with an additive renderer boundary and no data/schema changes.

### Milestone T4 — Visual, accessibility, and performance gates
- **Status:** TODO.
- **Purpose:** make quality reproducible with screenshots and interaction/performance checks.
- **Dependencies:** T3.
- **Acceptance:** representative locales/viewports; keyboard/focus; reduced motion; image loading; no critical layout regressions.

### Milestone T5 — Family expansion
- **Status:** TODO.
- **Purpose:** implement only genuinely different restaurant families after T3/T4 evidence.
- **Dependencies:** T4.
- **Acceptance:** each family has distinct hierarchy, density, navigation, media strategy, and documented segment.

### Milestone T6 — Legacy migration and bounded customization
- **Status:** TODO.
- **Purpose:** map legacy keys to proven family implementations and expose safe customization.
- **Dependencies:** T4 + T5.
- **Acceptance:** legacy keys remain valid; migration is reversible; customization cannot break accessibility/layout envelopes.

### Milestone T7 — Production rollout
- **Status:** TODO.
- **Purpose:** staged release, performance/analytics comparison, rollback readiness, and retirement only after evidence.
- **Dependencies:** T6.
- **Acceptance:** live-safe rollout, verified critical journeys, measurable performance, documented rollback.

## Rollback / Recovery
- Revert only template-foundation/family commits if verification fails.
- Do not delete legacy themes, renderer paths, or public menu data.
- Keep legacy rendering available until T6/T7 acceptance.

## Verification State
- `VERIFIED`: T1 and T2 implementation and quality gates passed.
- `IN_PROGRESS`: T3 flagship template implementation.
- `UNKNOWN`: production visual behavior and screenshot coverage.

## Progress Log
- 2026-09-03 — Audited theme registry, public renderer, preview flow, menu data contract, package tooling, and repository history.
- 2026-09-03 — Researched Toast, Square, GloriaFood, Radix, WAI-ARIA, web.dev, and an open-source React menu reference.
- 2026-09-03 — Created `docs/template-system-strategy.md`.
- 2026-09-03 — Implemented and verified T1 family contract.
- 2026-09-03 — Implemented and verified T2 semantic menu presentation primitives.
- 2026-09-03 — Updated state files to close T1/T2 and select T3.

## Exact Current Task
- **T3 — Build the first structurally distinct `contemporary-restaurant` family renderer using the existing `PublicMenu` contract.**
