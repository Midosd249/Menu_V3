# W7.7 Customers Workspace QA

## Status
`DONE / VERIFIED` — 2026-09-15.

## Contract checks

1. `/studio/guests` remains the existing Customers route.
2. The route delegates presentation to `StudioCustomersWorkspace` only.
3. Existing `getGuestRelationshipOverview` is the only customer relationship source used.
4. Server-side auth, owner/admin authorization, tenant scope, and branch authorization remain unchanged.
5. Loading, empty, error, permission-denied, and populated states are explicit.
6. Loyalty, Campaigns, Feedback, and Retention are represented only from existing R9 aggregate data.
7. No standalone Loyalty/Campaigns/Feedback/Retention links are rendered.
8. No customer list/detail/search/filter flow is invented where no current data source exists.
9. No fake customer records, counts, spend, orders, loyalty, campaigns, feedback, ratings, retention, segments, cohorts, CLV, churn, or recommendations are added.
10. Arabic RTL and English LTR remain supported.
11. Keyboard focus and semantic state/accessibility structure are covered.
12. Existing Studio Shell/Home/Menu/Growth and public/Platform Admin behavior remain outside the W7.7 implementation scope.

## Browser matrix

| Viewport | Direction | Surface | Result |
|---|---|---|---|
| 390×844 | RTL/LTR | `/studio/guests` | PASS — hierarchy, refresh focus, no overflow; mobile nav behavior |
| 430×932 | RTL | `/studio/guests` | PASS — content geometry, no overflow |
| 768×1024 | RTL | `/studio/guests` | PASS — section/card geometry, no overflow |
| 1280×800 | RTL | `/studio/guests` | PASS — Customers active state, workspace hierarchy, no overflow |

## CI browser setup

W7.7 reused the established CI-only PGlite Studio fixture pattern. No temporary fixture SQL file is committed and no production schema is changed.

## Accessibility basis

W7.7 keeps the existing internal design-system touch-target/focus contract and validates narrow-screen overflow so the fixed Studio navigation does not create a hidden-content regression.

## Verification record — 2026-09-15

- Final run: `34914024416` / run 1597.
- Implementation HEAD verified: `a89cc5110175d633ac6f3379fdb1ce6ce27fd4fa`.
- Route generation and generated route freshness: PASS.
- Typecheck: PASS.
- Repository tests: PASS (266 tests).
- W7.4/W7.5/W7.6/W7.7 focused contracts: PASS.
- Lint: PASS.
- Production build: PASS.
- Playwright runtime and Chromium: PASS.
- Public all-theme browser QA: PASS.
- Studio Shell/Home/Menu/Growth/Customers browser QA: PASS; five Studio browser tests passed.
- Performance baseline: PASS.
- Diagnostics and cleanup: PASS.
- The Customers test reached the real `/studio/guests` application in the CI fixture environment; it was not a static component-only assertion.
- The desktop active navigation assertion runs only at 1280×800; mobile navigation is checked at 390×844.
- RTL/LTR, keyboard focus, overflow, and unsupported relationship-link absence all passed.

## Regression boundary

Explicitly outside W7.7:
- production database/schema;
- Supabase and RLS;
- authentication and authorization;
- subscription/entitlement logic;
- AI provider/business logic;
- orders business logic;
- public menu rendering and ordering behavior;
- Platform Admin;
- dependencies/package manager;
- route URL restructuring;
- merge/deployment.

Physical real-device QA remains `UNKNOWN / release-stage only` until a coherent verified release batch reaches `main`.
