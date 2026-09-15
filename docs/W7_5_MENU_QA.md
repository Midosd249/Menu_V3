# W7.5 Menu Workspace QA

Status: DONE / VERIFIED

## Browser matrix

| Viewport | Direction | Surface | Verified checks |
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

## Final evidence

- Final current-head quality run: `34908577942` — PASS.
- Route generation/freshness: PASS.
- Typecheck: PASS.
- Repository tests: 266 PASS.
- W7.4/W7.5 focused contracts: PASS.
- Lint: PASS.
- Production build: PASS.
- Playwright runtime/Chromium: PASS.
- Public all-theme browser QA: PASS.
- Studio Shell/Home/Menu browser QA: PASS.
- Performance audit: PASS.
- Diagnostics upload and cleanup: PASS.

No fake production data, fake metrics, fake recommendations, or test backdoors were added.

## Release boundary

W7.5 is DONE / VERIFIED but not merged or deployed. Physical real-device QA remains a release-stage check.