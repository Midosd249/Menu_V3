# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.
- Active plan: `PLAN.md` — Platform Growth, Template Ecosystem, and Saudi SEO.
- Superseded plan archive: `PLAN_ARCHIVE_2026-09-03-template-ecosystem.md`.

## Current Position
- T1, T2, and T3 template milestones are DONE / VERIFIED and protected.
- G1 — Public Menu SEO Foundation is DONE / VERIFIED and protected.
- **G2 — Crawl Control and Indexation is DONE / VERIFIED.**
- **G3 — Saudi Local Discovery + Branch SEO is DONE / VERIFIED and CLOSED.**
- **G4 — Arabic/English SEO Architecture is DONE / VERIFIED and CLOSED.**
- **G5 — Template Ecosystem Expansion is IN_PROGRESS.**
- Current atomic milestone: **Specialty Cafe family renderer + routing integration**.

## G5 — Template Ecosystem Expansion — IN_PROGRESS
### Specialty Cafe milestone
- **VERIFIED:** `src/components/templates/specialty-cafe.tsx` provides a dedicated specialty-cafe renderer with a compact cafe hierarchy, barista picks, category navigation, dense menu rows, product detail/modifier selection, cart, and public ordering.
- **VERIFIED:** the renderer is presentation-only and consumes the existing `PublicMenu`, product options, locale, analytics, and ordering contracts.
- **VERIFIED:** `src/routes/m.$slug.tsx` now routes the `specialty-cafe` template family to `SpecialtyCafeTemplate` while preserving `contemporary-restaurant` and legacy fallback routing.
- **VERIFIED:** `src/lib/theme/registry.test.ts` locks `coffee` to the `specialty-cafe` family.
- **VERIFIED:** Typecheck, repository tests, lint, and production build have passed in GitHub Actions run `33802971758` through the production-build stage.
- **IN_PROGRESS:** Playwright installation and Browser Template QA are still running in the same GitHub Actions run; the milestone is not yet closed.
- **BLOCKED:** the Vercel status for commit `17955813a3a601cc7d26cf12b94cd7b3dbf841c1` reports provider `build-rate-limit`; no source workaround is being introduced.

## G4 — Arabic/English SEO Architecture — CLOSED
### Implementation
- **VERIFIED:** public menu search validation accepts only `ar` or `en` locale values.
- **VERIFIED:** locale resolution is data-driven and falls back to Arabic when the English variant is not actually available.
- **VERIFIED:** English public variants use `?lang=en`; Arabic remains the default canonical path.
- **VERIFIED:** available English variants emit reciprocal absolute `hreflang` links for `ar` and `en`.
- **VERIFIED:** unavailable English variants emit no fabricated alternate links and are `noindex, follow` while resolving to the Arabic canonical.
- **VERIFIED:** titles, descriptions, Open Graph locale, canonical URL, and Restaurant schema follow the effective locale.
- **VERIFIED:** public language switching updates only the locale query parameter and preserves existing search state.
- **VERIFIED:** parent menu routes suppress duplicate head metadata when a branch child owns the canonical route.
- **VERIFIED:** `src/lib/menu/seo.test.ts` covers locale availability, resolution, reciprocal alternates, missing English data, Saudi local SEO, and missing-menu noindex behavior.
- **VERIFIED:** the G4 TypeScript regression in `src/components/lang-toggle.tsx` was fixed and the resulting CI run passed.

## Protected Completed Work
- Level 0: DONE / VERIFIED.
- Level 1: DONE / VERIFIED.
- Level 2: IMPLEMENTED / historical partial verification; do not rebuild.
- Level 3: DONE / VERIFIED.
- Team invitation lifecycle: DONE / VERIFIED.
- Durable roles and branch scope: DONE / VERIFIED.
- Client onboarding idempotency: DONE / VERIFIED.
- Subscription foundation and entitlement enforcement: DONE / VERIFIED.
- Repository agent contract: DONE / VERIFIED.
- T1 template architecture contract: DONE / VERIFIED.
- T2 shared semantic menu presentation primitives: DONE / VERIFIED.
- T3 flagship template: DONE / VERIFIED.
- G1 Public Menu SEO Foundation: DONE / VERIFIED.
- G2 Crawl Control and Indexation: DONE / VERIFIED.
- G3 Saudi Local Discovery + Branch SEO: DONE / VERIFIED.
- G4 Arabic/English SEO Architecture: DONE / VERIFIED.

## Known Issues / Risks
- **UNKNOWN:** production canonical origin for JSON-LD remains relative because no verified application-level canonical public origin has been configured.
- **UNKNOWN:** Search Console/indexation state until separately inspected.
- **BLOCKED:** Vercel provider build-rate-limit for the current G5 commit; repository CI remains the verification source until the provider accepts a build.
- Existing lint warnings remain but are not errors and were not introduced by G4.

## Session Log
- 2026-09-03 — Resumed G5 from repository evidence after closing G4.
- 2026-09-03 — Implemented dedicated Specialty Cafe template renderer with compact cafe hierarchy, barista picks, category navigation, product details/modifiers, cart, and public ordering.
- 2026-09-03 — Integrated `specialty-cafe` family routing in `src/routes/m.$slug.tsx` without changing legacy theme fallbacks.
- 2026-09-03 — Added registry regression coverage for the `coffee` → `specialty-cafe` family contract.
- 2026-09-03 — GitHub Actions run `33802979434` passed route-tree generation, Typecheck, Tests, Lint, and Production build; Playwright installation and Browser Template QA remained in progress at the stopping point.
- 2026-09-03 — Vercel provider status reported `build-rate-limit` for commit `17955813a3a601cc7d26cf12b94cd7b3dbf841c1`; no source workaround introduced.

## Exact Remaining Work
- **G5 Specialty Cafe milestone:** finish Playwright installation and Browser Template QA for the current commit; close the milestone only after the full quality workflow passes.
- **G5 remaining families:** Bakery/Dessert, Fast Casual/QSR, Fine Dining/Hospitality, and Small Menu remain TODO.
