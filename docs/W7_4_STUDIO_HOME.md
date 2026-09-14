# W7.4 Studio Home

## Scope

Studio Home / Overview only. The implementation replaces the previous feature-directory presentation with an Arabic-first Premium Operational Workspace while preserving existing routes, server functions, authorization, data models, and business logic.

## Product Questions

Home is structured to answer:

1. What is happening now?
2. What needs attention?
3. How is the restaurant performing?
4. What should happen next?

## Real Data Sources

- `useStudio()` — tenant, role, branches, products, categories, and the existing `MenuHealth` model.
- `getOwnerAnalytics({ days: 7 })` — existing OwnerAnalytics metrics only.
- `getOrdersDashboard({})` — existing tenant-scoped operational order data only.
- `buildMenuGrowthAdvisor(snapshot, analytics)` — existing deterministic/evidence-bound growth intelligence only.

No new database query, schema, API, metric, recommendation engine, or business rule was introduced.

## Home Sections

- Time-aware Arabic/English greeting with tenant and current branch context.
- Needs attention from existing `health.attention`, filtered by existing role permissions.
- Current performance: visits, product views, sessions, WhatsApp clicks for the existing seven-day analytics range.
- Recent operational activity: the latest existing orders, with honest empty/error/loading states.
- Menu health: the existing health score, passing checks, available products, active categories, and active branches.
- Growth opportunity: an existing advisor action/insight, or a neutral Growth link when evidence is insufficient.
- One contextual primary action derived from the current actionable state.

## State Rules

- Loading is explicit.
- Server/data errors are explicit.
- Empty operational activity is explicit.
- No attention state is explicit.
- Growth does not fabricate a recommendation when evidence is insufficient.
- Permission-sensitive attention actions are filtered before rendering.

## Visual Rules

- Arabic-first RTL; English remains supported through the existing language control.
- Reuses W7.2 `PageHeader`, `SectionHeader`, `MetricRow`, `StatusBadge`, `InsightCard`, `ActionCard`, `EmptyState`, `LoadingState`, and `ErrorState`.
- No generic gradient hero.
- No glassmorphism.
- No feature-directory Home.
- No fabricated dashboard numbers.
- Responsive at 390px, 430px, tablet, and desktop.
- Logical headings, keyboard focus, semantic progress state, and accessible labels are preserved.

## Explicit Non-Goals

No changes to Menu, Growth, Customers, Orders, Settings, Platform Admin, auth, permissions, subscriptions, AI, orders business logic, public menu, Supabase, RLS, database schema, dependencies, route URLs, merge, or deployment.
