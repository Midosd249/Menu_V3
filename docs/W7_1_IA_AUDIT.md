# W7.1 IA Audit

**Status:** ANALYSIS COMPLETE / IMPLEMENTATION NOT STARTED

## Evidence position

- `VERIFIED` current branch used for audit: `main`.
- `VERIFIED` current main SHA: `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- `VERIFIED` commit message: `fix: mount nutrition disclosure on QR public menu route (#145)`.
- `VERIFIED` W7.1 working branch: `w7-1-ia-audit`.
- `VERIFIED` no application UI, route, schema, auth, RLS, subscription, deployment or merge change is part of this audit.

## Scope

W7.1 audits the current Owner Studio and Platform Admin information architecture and defines a safe blueprint for W7.2. It preserves existing business logic and capabilities.

### Explicit non-goals

- No page redesign.
- No route changes.
- No route splitting.
- No `admin.tsx` refactor.
- No styling changes.
- No component implementation.
- No dependency changes.
- No database/schema/migration changes.
- No authentication/authorization/RLS changes.
- No subscription/entitlement changes.
- No public-menu/theme changes.
- No deployment, merge or production release.

## Major findings

### 1. Studio navigation is capability-flat

`VERIFIED`: `src/components/studio-shell.tsx` exposes a flat primary list containing Overview, Menu, Menu Intelligence, Item Options, Branches, Brand, Design, QR, Analytics, Team & Permissions and Settings. The shell separately exposes Preview and public-menu access, while its mobile primary list is Home, Menu and Design plus More.

`INFERRED`: the navigation reflects implementation history more than owner mental models. Menu Intelligence, Item Options, QR, Analytics, Brand and Design are all valid capabilities but should not all compete as top-level jobs.

`PROPOSED`: organize the existing capabilities into Home, Menu, Orders, Growth, Customers and Settings, with Appearance and Publishing as coherent subdomains.

### 2. Growth and Customers exist in code but are not surfaced by the current shell

`VERIFIED`: `src/routes/studio/growth.tsx` implements R8 growth behavior and `src/routes/studio/guests.tsx` implements R9 guest relationships.

`VERIFIED`: current `StudioShell` does not include `/studio/growth` or `/studio/guests` in `NAV`.

`INFERRED`: this creates discoverability debt and makes completed product capabilities feel hidden.

`PROPOSED`: Growth and Customers become first-class workspaces.

### 3. Generated route tree is inconsistent with source route files

`VERIFIED`: `src/routeTree.gen.ts` exposes Studio child routes including analytics, branches, brand, design, import, intelligence, intelligence-actions, menu, options, orders, preview, qr, reports, settings and team, but does not expose `growth` or `guests`.

`VERIFIED`: the source files `src/routes/studio/growth.tsx` and `src/routes/studio/guests.tsx` export TanStack routes.

`UNKNOWN`: whether the generated tree is intentionally stale until a route-generation/build step or represents a real runtime defect.

`PROPOSED`: W7.2 begins with local route generation and direct route verification before any navigation change. Do not hand-edit generated route output.

### 4. Admin is a tab-driven monolith

`VERIFIED`: `src/routes/admin.tsx` declares `type Tab = "overview" | "tenants" | "orders" | "clients" | "branches" | "leads" | "projects" | "requests" | "subscriptions" | "analytics" | "activity" | "system"` and keeps the active tab in React state.

`VERIFIED`: the route is registered only as `/admin` in `createFileRoute`.

`INFERRED`: tab changes are not independently represented as first-class URLs, so browser history, refresh persistence, deep links, bookmarks, and external linking are weaker than true nested routes.

`PROPOSED`: move toward deep-linkable resource routes only in a later implementation task, preserving existing business functions and authorization contracts.

## Current Studio sitemap — verified source inventory

```text
/studio
├── /studio/analytics
├── /studio/branches
├── /studio/brand
├── /studio/design
├── /studio/import
├── /studio/intelligence
├── /studio/intelligence-actions
├── /studio/menu
├── /studio/options
├── /studio/orders
├── /studio/preview
├── /studio/qr
├── /studio/reports
├── /studio/settings
├── /studio/team
├── /studio/growth        [source route exists; generated route tree mismatch]
└── /studio/guests        [source route exists; generated route tree mismatch]
```

## Current Studio capability classification

| Capability | Current evidence | W7.1 classification |
|---|---|---|
| Overview | `/studio` | KEEP as Home destination; REDESIGN later |
| Menu | `/studio/menu` | KEEP; contextualize inside Menu |
| Menu Intelligence | `/studio/intelligence` | MOVE to Menu or Growth depending signal/job; proposed Menu health + Growth insights split |
| Intelligence Actions | `/studio/intelligence-actions` | MOVE to Growth → Actions |
| Item Options | `/studio/options` | MOVE to Menu → Options |
| Branches | `/studio/branches` | MOVE to Settings → Branches; branch context remains visible globally |
| Brand | `/studio/brand` | MERGE conceptually into Appearance |
| Design | `/studio/design` | MERGE conceptually into Appearance |
| QR | `/studio/qr` | MOVE to Publishing |
| Analytics | `/studio/analytics` | MOVE to Growth → Analytics / Measure |
| Team & Permissions | `/studio/team` | MOVE to Settings → Team & Permissions |
| Settings | `/studio/settings` | SPLIT conceptually into Restaurant + Publishing; keep current route until later route implementation |
| Growth | `/studio/growth` | KEEP as Growth anchor; REDESIGN later |
| Guests | `/studio/guests` | KEEP as Customers anchor; REDESIGN later |
| Reports | `/studio/reports` | MOVE to Growth → Reports / Measure |
| Import | `/studio/import` | MOVE to Menu → Import |
| Preview | `/studio/preview` | CONTEXTUALIZE under Publishing and Menu editing |
| Orders | `/studio/orders` | KEEP as first-class operational workspace |

## Proposed Studio sitemap

```text
/studio                              Home
├── Menu
│   ├── Items
│   ├── Categories
│   ├── Options
│   ├── Import
│   └── Availability
├── Orders
├── Growth
│   ├── Overview
│   ├── Intelligence
│   ├── Recommendations
│   ├── Actions
│   ├── Analytics
│   ├── Experiments
│   └── Reports
├── Customers
│   ├── Guests
│   ├── Loyalty
│   ├── Campaigns
│   ├── Feedback
│   └── Retention
└── Settings
    ├── Restaurant
    ├── Appearance
    ├── Branches
    ├── Team & Permissions
    ├── Publishing
    ├── Subscription
    └── Advanced
```

`PROPOSED`: not every proposed child requires a new route immediately. W7.2 should reuse current routes where possible and introduce nested route structure only when it materially improves deep linking and task clarity.

## Home information rules

`PROPOSED` Home is an operational command surface, not a capability directory.

It should answer, in order:

1. What is happening now?
2. What needs attention?
3. How is the restaurant doing?
4. What should I do next?

### Home content priority

1. Branch/restaurant context and publication state.
2. Immediate operational attention: new/open orders, critical menu issues, unresolved actions.
3. Small set of decision-grade metrics, not a KPI wall.
4. Recent operational activity.
5. Menu health summary.
6. One or two evidence-backed growth opportunities.
7. Secondary shortcuts only when tied to a job.

### Anti-capability-directory rules

- Never list every feature as a card.
- Never show twenty independent KPI cards.
- Never use AI/growth language to decorate ordinary operational facts.
- Every Home action must answer a user need, not advertise a feature.
- If no action is supported by evidence, show a calm verified state instead of inventing urgency.

## Menu workspace rules

`PROPOSED`: Menu is the primary content-management workspace.

- Items: core catalog editing and availability.
- Categories: organization and ordering.
- Options: modifiers/variants already supported by current product logic.
- Import: existing import flow, surfaced contextually.
- Availability: existing availability behavior, not a new inventory system.
- Menu Intelligence: surface health/completeness and relevant findings near editing context, while deeper evidence belongs in Growth.
- Preview: accessible from editing and Publishing, not a permanent primary nav item.
- Item details should favor side panels on desktop where editing can remain in context; full page is reserved for long, multi-section editing.

## Growth rules — Observe → Understand → Act → Measure

`VERIFIED`: current Growth source already implements an evidence-first loop and owner-controlled actions.

`PROPOSED` standard:

1. **Observe** — verified traffic, menu health, item/category signals, guest/order evidence.
2. **Understand** — explain what the signal means and its confidence/evidence state.
3. **Act** — owner-approved recommendation/action routed to an existing supported destination.
4. **Measure** — report the resulting signal; do not claim causality without evidence.

Growth must not become an autonomous marketing system or a second analytics product.

## Customers workspace rules

`VERIFIED`: R9 source route already covers guest CRM, loyalty, campaigns, feedback and retention at the owner-controlled scope.

`PROPOSED`: Customers should be visible as a first-class workspace. The landing view should summarize relationship health and provide routes to the existing R9 capabilities. No autonomous outbound messaging, rewards or predictive claims.

## Appearance consolidation rules

`PROPOSED`: Brand + Design should read as one owner task: "How should my restaurant look?"

Group:
- identity/name/tagline/logo
- colors
- typography
- theme
- layout/presentation controls
- live preview

Do not expose the five public themes as internal navigation skins. They remain public-menu presentation systems.

## Publishing consolidation rules

`VERIFIED`: QR, Preview and publishing state already exist in current routes.

`PROPOSED`: Publishing becomes the operational answer to "Is my menu live and ready to share?"

Group:
- publish/unpublish state
- public menu URL
- preview
- QR by branch
- share/copy/print
- language availability
- publishing readiness checklist

Publishing must not duplicate business data or change authorization semantics.

## Platform Admin — current sitemap

`VERIFIED`: `/admin` is the route and its tab inventory is:

```text
/admin
├── overview
├── tenants
├── orders
├── clients
├── branches
├── leads
├── projects
├── requests
├── subscriptions
├── analytics
├── activity
└── system
```

`VERIFIED`: `/admin/onboarding` is a separate route.

## Proposed Platform Admin sitemap

```text
/admin
├── Overview
├── Customers
│   ├── Restaurants
│   ├── Clients
│   └── Branches
├── Commerce
│   ├── Orders
│   ├── Subscriptions
│   └── Service Requests
├── Sales
│   ├── Leads
│   └── Projects
├── Intelligence
│   ├── Analytics
│   └── Activity
└── System
    ├── Security
    ├── Platform Health
    └── Configuration
```

`PROPOSED`: Platform Admin Overview answers "How is the platform doing?" and must remain distinct from Owner Home, which answers "How is my restaurant doing?"

## Side-panel candidates

`PROPOSED` side panels are for inspect/edit tasks where context should remain visible.

| Entity | Side panel use | Full page when |
|---|---|---|
| Item | quick inspect/edit, availability, options summary | long multi-section editor, import, complex item authoring |
| Order | status, customer/order summary, operational actions | large operational queue, reporting, historical search |
| Guest | profile, recent activity, loyalty/feedback summary | full CRM list, campaign management, retention analysis |
| Branch | status, hours, contact and quick settings | branch setup with many configuration sections |
| Lead | contact, status, notes, next action | full pipeline/lead reporting |
| Restaurant/Tenant | health, subscription, branches, activity summary | full tenant administration with multiple resource tabs |

## Cases requiring a full page

`PROPOSED` full page is preferred for:
- dense tables with filters/sort/pagination
- long forms with multiple logical sections
- analytics/reporting requiring sustained comparison
- menu editing where users need broad category/item context
- settings with security/permissions consequences
- publishing workflows requiring multi-step readiness review
- mobile contexts where a panel would create nested-scroll complexity

## Mobile navigation rules

`PROPOSED` at approximately 390px:

- Top bar: restaurant/branch context, notification access, menu trigger.
- Bottom nav: Home, Menu, Orders, Growth, More.
- More: Customers, Appearance, Branches, Team, Settings, Publishing, secondary tools.
- Never shrink desktop sidebar into five tiny labels.
- Important actions remain reachable without relying on hover.
- Bottom navigation must reserve content space and respect safe-area insets.

## Desktop navigation rules

`PROPOSED`:

- Sidebar with grouped workspaces, not a flat feature inventory.
- Restaurant/branch switcher in shell header.
- Current workspace and child page visibly active.
- Breadcrumbs only when hierarchy exceeds one meaningful level.
- Secondary actions belong in page headers/toolbars, not permanent navigation.
- Keep Preview/Open Menu/notifications accessible as utilities without competing with primary jobs.

## Deep-link and authorization risks of current Admin tabs

`VERIFIED`: tab state lives in React state under `/admin`.

`INFERRED` risks:
- browser refresh returns to the default tab instead of preserving a tab URL
- browser history does not represent tab transitions as route states
- bookmarks cannot target an Admin resource tab directly
- external links cannot safely target a specific Admin resource state
- route-level analytics and authorization boundaries are less explicit
- direct navigation to a resource cannot independently establish the intended route contract

`PROPOSED`: nested routes should be introduced only after mapping each tab's loader/data/permission dependencies. Server authorization remains authoritative; navigation visibility is never the security boundary.

## Differentiation from Toast and Square

`VERIFIED`: Toast emphasizes centralized operational order management and structured menu reporting. Square centralizes menu/channel/location management and distinguishes menu organization from operational categories.

`INFERRED`: Menu V3 should not compete by adding POS breadth or copying restaurant-platform complexity. Its differentiation can be the quality of the owner workspace: Arabic-first information scent, branch-aware context, evidence-first growth, and hospitality-specific language/hierarchy.

`PROPOSED`: differentiation = **clarity + Arabic-first operations + hospitality character + evidence-backed action**, using existing capabilities rather than new backend features.

## Internal Design System preview — architecture only

`PROPOSED` W7.2 shared vocabulary:

- `InternalShell`
- `PageHeader`
- `WorkspaceHeader`
- `WorkspaceNavigation`
- `Breadcrumbs`
- `SectionHeader`
- `StatCard`
- `MetricRow`
- `DataTable`
- `FilterBar`
- `SearchField`
- `StatusBadge`
- `EmptyState`
- `InsightCard`
- `ActionCard`
- `DetailPanel`
- `ConfirmDialog`
- `CommandMenu`
- `MobileBottomNav`
- `WorkspaceSwitcher`
- `BranchSwitcher`

These names are an architecture vocabulary only. No components were created in W7.1.

## Handoff criteria for W7.2

W7.2 is ready only when:

1. Route generation has been run locally and the `growth`/`guests` mismatch is explained with direct evidence.
2. Every existing Studio/Admin capability is mapped in `W7_1_ROUTE_MAP.md`.
3. No current business logic is duplicated during shell work.
4. Existing permission predicates remain server-authoritative.
5. Desktop and 390px mobile navigation rules are agreed.
6. RTL/LTR logical-property strategy is explicit.
7. Side-panel vs full-page decisions are implemented only where the route/data model supports them.
8. Existing public-menu themes remain untouched.
9. Relevant tests are identified before implementation.
10. W7.2 remains one atomic implementation task and does not automatically expand into R10 or production release.
