# PLAN — Menu V3 Active Delivery Strategy

## Executive Summary
- Status: IN_PROGRESS.
- `main` is the repository source of truth.
- Active initiative: Template Ecosystem Redesign.
- T1, T2, and T3 are DONE / VERIFIED.
- Current task: T4 — reproducible visual, accessibility, responsive, and performance gates for the flagship family.

## Verified State
- `VERIFIED`: React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Better Auth, PostgreSQL/PGlite-ready data layer, Supabase integration, Vercel target, Node 24 CI.
- `VERIFIED`: eight existing `ThemeKey` values remain unchanged.
- `VERIFIED`: T3 `contemporary-restaurant` is an additive renderer using the existing `PublicMenu` contract; legacy `PublicMenuView` remains available.
- `VERIFIED`: T3 repository quality run `33743105967` passed install, route generation, typecheck, tests, lint, and production build.
- `VERIFIED`: T3 Vercel deployment `dpl_9esaw9UjgAz4NmM3BsDXGBhqz9Tx` is READY.
- `UNKNOWN`: complete screenshot baseline history and browser execution in the current agent environment.

## Architecture Guardrails
- `PublicMenu` remains canonical.
- Template families own presentation only; no authorization, pricing, availability, tenant boundaries, or order rules move into templates.
- Existing `ThemeKey` compatibility and legacy rendering remain protected until later migration gates.
- Reuse existing dependencies; no new UI framework.

## Completed Milestones
### T1 — Template architecture contract
- DONE / VERIFIED. Six type-safe `TemplateFamily` identifiers and deterministic family lookup.
- Quality run `33742263927` passed.

### T2 — Shared semantic menu presentation primitives
- DONE / VERIFIED. `MenuMedia`, `MenuPrice`, `MenuBadge`, `MenuSection`, `MenuProductCard`.
- Quality run `33742271561` passed.

### T3 — Flagship vertical template
- DONE / VERIFIED. Dedicated `contemporary-restaurant` renderer with bilingual content, search/category discovery, featured products, availability, modifiers, cart/order flow, branch navigation, hours, and public actions.
- Integrated additively into `src/routes/m.$slug.tsx` and `src/routes/themes/preview.tsx`.
- Quality run `33743105967` passed; Vercel deployment is READY.

## Current Task — T4
**Objective:** make quality checks reproducible at browser level before expanding to additional families.

**Files:**
- `scripts/template-qa.mjs`
- `package.json`
- later, CI workflow only if browser execution is proven compatible with the repository environment.

**Implemented:**
- `npm run qa:template`.
- Existing Playwright dependency is reused.
- Checks 390x844, 768x1024, and 1440x900.
- Checks HTTP success, RTL/language, horizontal overflow, accessible names for buttons/links, visible headings, runtime console/page errors, and reduced-motion emulation.
- Accepts a deployed preview/local URL through CLI or `TEMPLATE_QA_URL`.

**Acceptance:**
1. Browser gate executes successfully against a real flagship preview.
2. No critical runtime, RTL, responsive-overflow, or basic accessible-name regression.
3. Visual baseline strategy is documented before claiming pixel-regression coverage.
4. Performance findings are evidence-based; no speculative optimization.

**Risks:**
- Preview data can depend on Supabase/runtime environment.
- Browser binaries may be unavailable in the current agent sandbox.
- Pixel baselines require a stable fixture and deterministic media, not live production data.

## Next Milestones
- T5: expand only after T4 evidence, with genuinely different family composition.
- T6: controlled legacy-key migration and bounded customization.
- T7: staged production rollout, analytics/performance comparison, rollback readiness.

## Research / Standards
- Toast: online ordering discovery, visibility, search, and section navigation.
- Square: customer-facing menus, hours, channels, QR ordering, multi-location concerns.
- GloriaFood: photos, modifiers, dietary/allergen information, responsive ordering.
- Radix and WAI-ARIA APG: semantic interaction, focus, keyboard, accessible names.
- web.dev: responsive images, lazy loading, critical media priority.

## Rollback
- Revert only T4 QA additions if they fail; preserve T1–T3 and legacy renderer.
- Do not remove legacy themes or alter menu data/schema for this task.

## Exact Current Task
- **T4 — Execute and harden the browser quality gate for the `contemporary-restaurant` family; do not start T5 until T4 is verified or explicitly blocked.**
