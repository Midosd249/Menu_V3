# W7.2 — Internal Design System Foundation

## Status
- Implementation status: `IMPLEMENTATION_IN_PROGRESS` pending local/CI execution verification.
- Scope: route-independent reusable internal workspace primitives only.
- Branch: `w7-2-internal-design-system`.
- No merge and no deployment.

## Route Generation Gate

`PENDING_LOCAL_VERIFICATION`

Verified facts:
- `src/routes/studio/growth.tsx` exists and declares `/studio/growth`.
- `src/routes/studio/guests.tsx` exists and declares `/studio/guests`.
- `src/routeTree.gen.ts` currently does not include those route imports.
- CI uses the TanStack/Vite build command below to generate the route tree.
- The current execution environment previously failed to clone/run the repository because GitHub DNS/network access was unavailable.
- This is not labeled as a runtime failure, configuration error, or route-generation drift.

Required verification command:

```bash
npx vite build --mode development
```

Until that command succeeds in a real local or CI environment, do not edit `src/routeTree.gen.ts`, `src/routes/studio/growth.tsx`, `src/routes/studio/guests.tsx`, `vite.config.ts`, router configuration, route registration, or any generated file. Growth and Guests must not be added to primary navigation before this verification succeeds.

## Implemented Foundation

The route-independent foundation is intentionally presentation-focused and consumes the existing token vocabulary and UI primitives:

- `InternalShell`
- `WorkspaceNavigation`
- `WorkspaceHeader`
- `PageHeader`
- `MobileBottomNav`
- `SectionHeader`
- `StatusBadge`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `PermissionDeniedState`
- `SearchField`
- `FilterBar`
- `DataTable`
- `MetricRow`
- `InsightCard`
- `ActionCard`

The components accept content/data through props and do not perform navigation, authorization, data fetching, mutations, or business logic.

## Accessibility / RTL Contract

- Uses logical `start`/`end` positioning for directional controls where applicable.
- Uses `text-start` rather than hard-coded left/right alignment.
- Navigation controls expose labels and `aria-current` for active state.
- Interactive controls retain visible `focus-visible` rings and minimum touch-friendly heights.
- Loading uses `role="status"` and `aria-live="polite"`.
- Errors and permission denial use `role="alert"`.
- Data tables are horizontally scrollable rather than forcing narrow columns on mobile.
- Content is caller-supplied, so Arabic, English, mixed-direction strings, SAR values, phone numbers, URLs, dates, and long restaurant/item names remain test inputs for consuming surfaces.

## Responsive Intent

The foundation is designed for 390px and 430px mobile widths, tablet layouts, and desktop workspaces. Desktop navigation is hidden below `lg`; the mobile navigation component is separately reusable and is not mounted into production routes by W7.2.

## Explicit Non-Goals

W7.2 does not:
- redesign or migrate Home, Menu, Growth, or Customers;
- split `admin.tsx`;
- add/remove/change navigation links;
- modify routes or generated route files;
- modify Studio navigation behavior;
- change Admin tabs;
- change Supabase, database, RLS, auth, permissions, subscriptions, AI, orders, or business logic;
- add dependencies or UI frameworks;
- deploy or merge.

## Reuse / Deliberate Omissions

Existing `src/components/ui/input.tsx`, `src/components/ui/button.tsx`, and `src/lib/utils.ts` are reused. Existing `src/components/state-panel.tsx` was inspected and its state patterns informed the new route-independent variants; it was not replaced or deleted.

`DetailPanel` and `ConfirmDialog` were not introduced because W7.2 did not find an existing reusable Radix dialog/drawer pattern that satisfies the requested reuse constraint without creating a parallel modal system. They remain future W7.3+ work after the existing dialog/drawer foundation is identified and verified.

## Verification Position

- Repository/tool inspection: `VERIFIED`.
- Component source added: `VERIFIED` from GitHub branch.
- Route-generation execution: `PENDING_LOCAL_VERIFICATION`.
- Local typecheck/lint/tests/build: `PENDING_LOCAL_VERIFICATION` because this environment cannot execute the repository.
- Browser/visual/accessibility QA: `PENDING_LOCAL_VERIFICATION`.
- Generated route file edited: `NO`.
- Navigation behavior changed: `NO`.
- Page migration performed: `NO`.

## Safe W7.3 Use

After successful route-generation verification, these primitives are safe candidates for W7.3 Studio Shell work. W7.3 must still integrate them incrementally, preserve current navigation behavior until route evidence is resolved, and keep Growth/Guests out of primary navigation until route generation is verified.
