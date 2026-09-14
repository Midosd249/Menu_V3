# W7.6 Growth Workspace QA

Status: DONE / VERIFIED

## Contract checks

1. `/studio/growth` remains the existing route.
2. Growth Workspace uses only existing Studio/analytics/intelligence/growth sources.
3. Observe shows real OwnerAnalytics values or an honest no-data state.
4. Understand distinguishes evidence, interpretation, and recommendation.
5. Act shows only existing evidence-bound recommendations and real destination links.
6. Measure shows only recorded outcomes and explicitly labels unavailable/undecided experiment outcomes.
7. No fake revenue, conversion, impact, ROI, trend, chart, experiment result, or production sample data is added.
8. Reports is contextual only; no standalone Experiments route is invented.
9. Existing Studio Shell primary navigation contract remains unchanged.
10. Arabic RTL and English LTR remain supported.
11. Keyboard focus, semantic headings, `aria-current`, labels, loading/error/empty states, and narrow-screen overflow are covered.

## Browser matrix

| Viewport | Direction | Surface | Result |
|---|---|---|---|
| 390×844 | RTL/LTR | `/studio/growth` | PASS |
| 430×932 | RTL | `/studio/growth` | PASS |
| 768×1024 | RTL | `/studio/growth` | PASS |
| 1280×800 | RTL | `/studio/growth` | PASS |

## Browser assertions

- Actual `/studio/growth` route is reached through the existing auth-disabled CI fixture.
- Observe, Understand, Act, and Measure sections are visible.
- Growth contextual navigation reaches only verified routes.
- Reports is present only as contextual Growth navigation.
- No `/studio/experiments` destination is rendered.
- Active Growth destination exposes `aria-current="page"`.
- RTL is present initially; the existing language control switches the page to LTR.
- No horizontal page overflow occurs across the required viewport matrix.
- The refresh action is keyboard reachable and focusable.

## Current-head evidence

- Final current-head CI run: `34910495789` — PASS.
- Route generation/freshness: PASS.
- Typecheck: PASS.
- Repository tests: 266 PASS.
- W7.4 focused contracts: PASS.
- W7.5 focused contracts: PASS.
- W7.6 focused contracts: 10 PASS.
- Lint: PASS; existing repository warnings remain non-blocking and unrelated.
- Production build: PASS.
- Playwright runtime/Chromium: PASS.
- Public all-theme browser QA: PASS.
- Studio Shell/Home/Menu/Growth browser QA: PASS.
- Performance audit: PASS.
- Diagnostics and cleanup: PASS.

## Browser regression resolved during W7.6

A current-head browser run initially failed only because `tests/w7-3-studio-shell-browser.spec.ts` expected the More surface to expose `role=dialog`. Repository inspection confirmed the real More surface is a `fixed inset-0 z-40` container. The test was corrected to target that actual container. The subsequent run passed all four Studio browser specs.

## Regression boundary

W7.6 did not modify production database/schema, Supabase, RLS, authentication, authorization/permission model, subscriptions/entitlements, AI provider/business logic, orders business logic, public menu behavior, Platform Admin, dependencies/package manager, or route URL structure. No merge or deployment occurred.

## CI fixture boundary

The established temporary PGlite fixture is created only inside GitHub Actions, used for Studio browser QA, and removed during workflow cleanup. No temporary fixture SQL file is committed.

## Release boundary

W7.6 is DONE / VERIFIED but not merged or deployed. Physical real-device QA remains release-stage evidence after a coherent verified release batch reaches `main`.