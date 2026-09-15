# W7.7 Customers Workspace QA

## Status
`PENDING_CURRENT_HEAD_VERIFICATION`

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

| Viewport | Direction | Surface | Required checks |
|---|---|---|---|
| 390×844 | RTL/LTR | `/studio/guests` | workspace hierarchy, refresh focus, no overflow |
| 430×932 | RTL | `/studio/guests` | content geometry, no overflow |
| 768×1024 | RTL | `/studio/guests` | section/card geometry, no overflow |
| 1280×800 | RTL | `/studio/guests` | Customers active state, workspace hierarchy, no overflow |

## CI browser setup

W7.7 reuses the established CI-only PGlite Studio fixture pattern. No temporary fixture SQL file is committed and no production schema is changed.

## Accessibility basis

W3C WCAG 2.2 requires minimum pointer target sizing and requires focused components not to be entirely hidden by author-created content. W7.7 keeps the existing internal design-system touch-target/focus contract and validates narrow-screen overflow so the fixed Studio navigation does not create a hidden-content regression.

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

## Verification record

The final QA record must be updated after the current-head GitHub Actions run with:
- run number and head SHA;
- route generation/freshness;
- typecheck;
- repository test count;
- W7.7 focused contracts;
- lint;
- production build;
- Playwright/Chromium;
- public all-theme browser QA;
- Studio Shell/Home/Menu/Growth/Customers browser QA;
- performance audit and diagnostics where configured;
- final diff review.

Physical real-device QA remains `UNKNOWN / release-stage only` until a coherent verified release batch reaches `main`.
