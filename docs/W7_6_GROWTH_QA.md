# W7.6 Growth Workspace QA

Status: IMPLEMENTATION IN PROGRESS — current-head verification pending.

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

| Viewport | Direction | Surface | Required checks |
|---|---|---|---|
| 390×844 | RTL/LTR | `/studio/growth` | hierarchy, contextual tabs, state visibility, focus, overflow |
| 430×932 | RTL | `/studio/growth` | content geometry, actions, no page overflow |
| 768×1024 | RTL | `/studio/growth` | tablet hierarchy and navigation geometry |
| 1280×800 | RTL | `/studio/growth` | desktop workspace hierarchy and contextual navigation |

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

## Regression boundary

W7.6 must not modify production database/schema, Supabase, RLS, authentication, authorization/permission model, subscriptions/entitlements, AI provider/business logic, orders business logic, public menu behavior, Platform Admin, dependencies/package manager, route URL structure, merge, or deployment.

## CI fixture boundary

The established temporary PGlite fixture is created only inside GitHub Actions, used for Studio browser QA, and removed during workflow cleanup. No temporary fixture SQL file is committed.

## Release boundary

W7.6 is not merged or deployed by this task. Physical real-device QA remains release-stage evidence after a coherent verified release batch reaches `main`.