# PLAN — Menu V3 Active Delivery Strategy

## Executive Summary
- Status: IN_PROGRESS.
- `main` is the repository source of truth.
- Previous roadmap remains archived as `PLAN_ARCHIVE_2026-09-03.md`.
- Completed Level 0–4C work remains protected.
- Active initiative: Template Ecosystem Redesign.
- The immediate objective is to create reusable presentation infrastructure before building a structurally distinct flagship template.

## Current Verified State
- `VERIFIED`: React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.
- `VERIFIED`: eight existing `ThemeKey` values are preserved.
- `VERIFIED`: all current public menus and theme previews use the shared `PublicMenuView` renderer.
- `VERIFIED`: `src/lib/theme/registry.ts` contains theme tokens, layout metadata, capabilities, and preview metadata.
- `VERIFIED`: `src/lib/menu/types.ts` already contains bilingual menu content, categories, products, variants, modifiers, availability, images, dietary labels, allergens, calories, branding, branches, and hours.
- `VERIFIED`: `package.json` already provides TypeScript, ESLint, Vite, Playwright, tests, lint, typecheck, and build commands.
- `UNKNOWN`: production traffic distribution by restaurant segment and complete screenshot-regression coverage.

## Product and Architecture Understanding
Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS. Public menus consume canonical tenant/branch/menu data; authenticated Studio/Admin surfaces manage that data. Templates are presentation-only and must not own authorization, pricing, availability, tenant boundaries, or ordering rules.

## Completed Work — Protected
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historical partial verification; do not rebuild.
- Level 3: DONE / VERIFIED.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED for its defined scope.
- Subscription-plan foundation: DONE / VERIFIED.
- Subscription entitlement enforcement: DONE / VERIFIED for default provisioning/backfill and branch/product/active-team-member limits.
- Repository agent contract: DONE / VERIFIED.
- Platform-admin authorization consistency: implementation completed; historical final verification remains preserved as unfinished work.
- T1 template architecture contract: IMPLEMENTED / verification pending.
- T2 shared semantic menu presentation primitives: IMPLEMENTED / verification pending.

## Problems and Risks
1. `VERIFIED`: eight named themes share the same primary React renderer.
2. `VERIFIED`: current visual variation is largely token/layout/CSS-driven and does not prove structural template diversity.
3. `INFERRED`: the main template bottleneck is the missing boundary between canonical menu content and family-specific composition.
4. `UNKNOWN`: production visual behavior and screenshot-regression coverage.
5. `VERIFIED`: T1 and T2 are designed to be additive; existing public rendering remains intact.

## Goals
1. Protect live menu behavior and existing theme keys.
2. Establish a reusable semantic presentation layer.
3. Build one flagship family as a real end-to-end vertical slice.
4. Validate Arabic/English, RTL, mobile/desktop, long content, missing images, availability, modifiers, and pricing.
5. Establish accessibility, performance, and visual-regression gates.
6. Expand only to genuinely different restaurant families after the flagship proves the architecture.

## Non-Goals
- No project restart or foundation rewrite.
- No deletion of existing theme keys in the first rollout.
- No payment/auth/authorization/order-backend redesign.
- No arbitrary page-builder customization system.
- No new database fields without a proven data requirement.
- No unrelated Studio/Admin refactor.

## Architecture Decisions
- `PublicMenu` remains the canonical content contract.
- Template families own presentation and layout composition only.
- Existing `ThemeKey` values remain backwards compatible.
- New template infrastructure coexists with the legacy renderer until acceptance gates pass.
- Shared semantic primitives are reusable; family composition must be structurally distinct.
- Existing dependencies are reused; no new UI framework is justified.

## Research and References
- `VERIFIED`: Toast online-ordering guidance emphasizes menu visibility, search, section navigation, and branded ordering. Application: discovery and navigation are core conversion surfaces. https://support.toasttab.com/en/article/Getting-Started-Online-Ordering
- `VERIFIED`: Square menu guidance separates customer-facing menus from internal organization and supports visibility by location/channel. Application: rendering must respect canonical menu/branch data and remain presentation-only. https://squareup.com/help/us/en/article/6424-create-menus-with-square-for-restaurants
- `VERIFIED`: GloriaFood emphasizes photos, modifiers, dietary/allergen information, responsive ordering, and web presentation. Application: use rich existing data without making every family image-heavy. https://www.gloriafood.com/online-ordering-system-for-restaurants
- `VERIFIED`: Radix documents keyboard/focus/accessibility primitives. Application: prefer semantic controls and existing interaction conventions. https://www.radix-ui.com/primitives/docs/overview/accessibility
- `VERIFIED`: W3C WAI-ARIA APG documents menu-button and menubar semantics. Application: template navigation must preserve semantic roles, labels, states, and keyboard behavior. https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ and https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- `VERIFIED`: web.dev recommends lazy loading below-fold images and responsive image sizing while prioritizing critical media. Application: template media primitives distinguish critical and deferred images. https://web.dev/learn/performance/image-performance and https://web.dev/learn/design/responsive-images
- `VERIFIED`: open-source reference `danishfareed/restaurant-digital-menu` demonstrates a React restaurant-menu implementation but does not cover Menu V3's multi-tenant, RTL, ordering, and template requirements. https://github.com/danishfareed/restaurant-digital-menu

## Template Ecosystem Redesign — Active Plan

### Proposed Template Families
1. `specialty-cafe` — coffee/cafe; compact discovery, product-forward, fast scanning.
2. `bakery-dessert` — bakery/dessert; image-led, visual grouping, premium product cards.
3. `fast-casual` — burger/pizza/QSR; high density, rapid ordering, prominent prices/actions.
4. `contemporary-restaurant` — modern casual/full-service; balanced editorial hierarchy and richer descriptions.
5. `fine-dining-hospitality` — fine dining/hotel/catering; immersive storytelling, restrained density, premium media.
6. `small-menu` — food trucks/pop-ups; extremely direct navigation, compact list/grid, minimal friction.

Families are intentionally different in information hierarchy, density, navigation, imagery, and conversion intent—not merely colors.

### Milestone T1 — Template architecture contract
- **Status:** IMPLEMENTED / verification pending.
- **Purpose:** create a type-safe family boundary while preserving existing theme keys and rendering.
- **Priority:** smallest reversible architectural boundary that enables structural templates.
- **Evidence:** current registry has eight themes but one shared renderer.
- **Dependencies:** existing theme registry and menu types.
- **Implemented:** six typed families, eight theme classifications, deterministic `getThemeFamily()`, focused registry tests.
- **Acceptance:** family mapping is type-safe/deterministic; legacy theme resolution unchanged; no public rendering change.
- **Verification:** `npm install --no-audit --no-fund`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.

### Milestone T2 — Shared semantic menu presentation primitives
- **Status:** IMPLEMENTED / verification pending.
- **Purpose:** provide reusable semantic building blocks for future family renderers without changing menu data or business rules.
- **Priority:** prevents duplicated accessibility/responsive/media/price behavior when structural templates are introduced.
- **Evidence:** `PublicMenuView` currently owns product media and presentation patterns inside a large shared renderer.
- **Dependencies:** T1 family boundary and existing `Product`/`PublicMenu` types.
- **Implemented:** `MenuMedia`, `MenuPrice`, `MenuBadge`, `MenuSection`, `MenuProductCard`; exported through `src/components/menu/index.ts`.
- **Acceptance:** primitives are semantic, keyboard-safe, responsive, RTL-compatible through inherited direction, robust to long content and missing images, and free of authorization/business logic.
- **Verification:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, plus manual browser checks when available.

### Milestone T3 — Flagship vertical template
- **Status:** TODO.
- **Purpose:** prove a genuinely distinct family renderer using the existing `PublicMenu` contract.
- **Priority:** delivers the first visible product-quality replacement and validates the architecture before scaling.
- **Dependency:** T1 + T2 verification.
- **Likely files:** family renderer modules, public-menu integration boundary, preview route, styles, fixture content.
- **Acceptance:** structurally distinct from legacy renderer; real Arabic/English content; responsive; RTL; long names; missing images; modifiers; availability; featured items; clear prices/actions.
- **Verification:** Playwright if available, manual visual review, accessibility, lint/typecheck/build/tests.

### Milestone T4 — Visual, accessibility, and performance gates
- **Status:** TODO.
- **Purpose:** make visual quality reproducible rather than subjective.
- **Dependency:** T3.
- **Acceptance:** representative screenshots/locales/viewports; keyboard/focus checks; reduced-motion review; image loading verified; no critical layout regressions.

### Milestone T5 — Family expansion
- **Status:** TODO.
- **Purpose:** implement only genuinely different restaurant families.
- **Dependency:** T4.
- **Acceptance:** each family has a documented target, hierarchy, density, navigation, media strategy, and distinct composition.

### Milestone T6 — Legacy migration and bounded customization
- **Status:** TODO.
- **Purpose:** map legacy theme keys safely and expose controlled customization.
- **Dependency:** T4 + T5.
- **Acceptance:** legacy keys remain valid; migration is reversible; customization cannot break accessibility/layout envelopes.

### Milestone T7 — Production rollout
- **Status:** TODO.
- **Purpose:** staged release, performance/analytics comparison, rollback readiness, and retirement decisions only after evidence.
- **Dependency:** T6.
- **Acceptance:** live-safe rollout, verified critical journeys, measurable performance, documented rollback.

## Rollback / Recovery
- Revert only template-foundation commits if verification fails.
- Do not delete legacy themes, renderer paths, or public menu data.
- Keep legacy rendering available until T6/T7 acceptance.

## Verification State
- `VERIFIED`: T1 family contract exists and preserves the eight `ThemeKey` values.
- `VERIFIED`: T2 primitive source provides semantic media, price, badge, section, and product-card building blocks with no data/business ownership.
- `IN_PROGRESS`: quality verification for the combined T1/T2 foundation.
- `UNKNOWN`: production visual behavior and screenshot coverage.

## Progress Log
- 2026-09-03 — Audited theme registry, public renderer, preview flow, menu data contract, package tooling, and recent repository history.
- 2026-09-03 — Researched Toast, Square, GloriaFood, Radix, WAI-ARIA, web.dev, and an open-source React menu reference; recorded transferable principles.
- 2026-09-03 — Created `docs/template-system-strategy.md`.
- 2026-09-03 — Implemented T1 family metadata and regression coverage.
- 2026-09-03 — Implemented T2 shared semantic presentation primitives in `src/components/menu/primitives.tsx` and exports in `src/components/menu/index.ts`.
- 2026-09-03 — Updated `TASKS.md` and `PROJECT_STATE.md` to track T1 + T2 as one current foundation execution scope.

## Exact Current Task
- **Complete the GitHub Actions quality gate for the combined T1/T2 template foundation.** If green, mark the foundation DONE and select T3; if a failure appears, fix only that verified failure.
