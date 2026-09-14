# W7.5 Menu Workspace QA

Status: PENDING_CURRENT_HEAD_CI

## Browser matrix

| Viewport | Direction | Surface | Required checks |
|---|---|---|---|
| 390×844 | RTL/LTR | `/studio/menu` | header, filters, actions, search, overflow, focus |
| 430×932 | RTL | `/studio/menu` | content geometry, actions, no page overflow |
| 768×1024 | RTL | `/studio/menu` | tablet table/filter geometry |
| 1280×800 | RTL | `/studio/menu` | desktop table, workspace hierarchy, contextual tools |

## Focused contract checks

- Existing Studio Menu route remains `/studio/menu`.
- Menu Workspace uses `useStudio()` and existing menu actions.
- Real item/category/availability data only.
- No fabricated health score, completeness percentage, revenue, order, customer, or import metric.
- Only verified real destinations are surfaced: Options, Import, Preview, QR.
- No Reports/Growth/Customers destinations are duplicated into the Menu Workspace.
- Empty category and filtered-item states are explicit.
- Semantic labels and keyboard focus contracts exist.

## CI browser setup

The browser suite reuses the established CI-only PGlite fixture from W7.3/W7.4. The temporary migration adds only missing compatibility columns and the deterministic `demo-nafas`/`dev-user` fixture. It is created and removed inside the workflow and is never committed or applied to production.

## Regression boundary

The following are explicitly outside W7.5:

- production database/schema;
- Supabase and RLS;
- authentication and authorization;
- subscription/entitlement logic;
- AI provider/business logic;
- orders business logic;
- public menu rendering and ordering behavior;
- Platform Admin;
- dependencies/package manager;
- deployment/merge.

## Current evidence

Contract tests, typecheck, lint, and production build have passed in current CI attempts. Final W7.5 acceptance remains blocked until the current branch-head Studio browser QA passes for W7.3, W7.4, and W7.5 together.
