# W7.5 Menu Workspace

Status: IMPLEMENTATION IN PROGRESS — browser QA pending final CI.

## Purpose

Turn `/studio/menu` into a focused Menu Workspace for day-to-day menu operations without creating a new backend product or changing the route URL.

The workspace answers:

- What do guests currently see?
- Is the menu published or in draft state?
- Which real menu data needs attention?
- What can be changed quickly?
- Where are options, import, preview, QR, and availability controls?

## Reused existing sources

- `useStudio()` for tenant, branch, category, product, health, and publication context.
- Existing `saveProduct`, `saveCategory`, `toggleProduct`, `deleteProduct`, and `deleteCategory` server actions.
- Existing `generateMenuAi` and `runMenuQa` flows.
- Existing image compression/upload behavior.
- Existing permission and authorization boundaries inside the server actions.
- Existing `/studio/options`, `/studio/import`, `/studio/preview`, and `/studio/qr` routes.

No new database query, schema, migration, RLS policy, auth rule, permission, subscription, or business-data source was introduced.

## Workspace structure

1. Workspace header with restaurant/branch context and existing Add Item/Add Category actions.
2. Real menu summary: item count, category count, unavailable item count, publication state, and attention state.
3. Contextual tools: Options, Import, Preview, QR.
4. Searchable item list with category and availability filters.
5. Existing item edit/delete/availability flows.
6. Existing category edit/delete flow.
7. Existing AI-assisted item draft workflow and review-first Menu QA.

## Data honesty

The workspace does not invent completeness percentages, health scores, revenue, orders, customer metrics, availability, import results, QR state, or publication claims. Counts and states are derived from `useStudio()` data already used by the existing Menu surface.

Empty, error, loading, and permission behavior remains tied to existing Studio/server behavior. Filtered empty states explicitly distinguish between no matching items and no categories.

## Interaction and accessibility

- Arabic-first RTL presentation with LTR switching through the existing language system.
- Mixed Arabic/English product names use directional isolation where needed.
- SAR prices remain tabular and use the existing formatter.
- Search, category filters, availability filters, action links, tables, and buttons have semantic labels/focus behavior.
- Desktop/tablet uses a readable table; mobile keeps the table in an intentional horizontal scroll area rather than creating page overflow.
- No new modal/drawer system was introduced; existing `Sheet` flows remain in use.

## Explicit non-goals

- No route URL restructuring.
- No drag-and-drop builder.
- No public-menu redesign.
- No Platform Admin work.
- No Growth, Customers, mobile-wide, or final visual QA work.
- No database/schema changes.
- No dependency additions.

## Verification

Focused contract and browser tests are added under `tests/w7-5-menu-workspace.test.mjs` and `tests/w7-5-menu-workspace-browser.spec.ts`.

The quality workflow runs route generation/freshness, typecheck, repository tests, W7.4/W7.5 contracts, lint, production build, public browser QA, Studio Shell/Home/Menu browser QA, and performance audit.

Final W7.5 status must remain pending until the current-head CI run completes successfully.
