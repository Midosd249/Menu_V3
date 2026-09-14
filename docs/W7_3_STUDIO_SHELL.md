# W7.3 — Studio Shell Transformation

Status: IMPLEMENTATION_IN_PROGRESS

## Scope
- Transform only the owner-facing Studio application shell/navigation.
- Preserve existing route URLs, page implementations, permissions, data fetching, business logic, and backend behavior.
- Reuse W7.2 `WorkspaceNavigation` and `MobileBottomNav` primitives.
- Keep Platform Admin separate.

## Navigation model
Primary desktop workspaces:
- Home → `/studio`
- Menu → `/studio/menu`
- Orders → `/studio/orders`
- Growth → `/studio/growth`
- Customers → `/studio/guests`
- Settings → `/studio/settings` (permission-gated)

Contextual groups expose only real existing routes allowed by the current repository navigation contract:
- Menu: `/studio/menu`, `/studio/options`, `/studio/import`
- Growth: `/studio/growth`, `/studio/intelligence`, `/studio/intelligence-actions`, `/studio/analytics`
- Customers: `/studio/guests`
- Appearance & Publishing: `/studio/brand`, `/studio/design`, `/studio/qr`, `/studio/preview`
- Settings: `/studio/branches`, `/studio/team`, `/studio/settings`

`/studio/reports` remains a real route but is intentionally not exposed in Studio navigation because the current repository contract explicitly keeps Reports out of Studio navigation while retaining the route for the reporting workflow.

Non-existent concepts such as standalone Categories, Loyalty, Campaigns, Feedback, Retention, Restaurant, Subscription, and Advanced routes are not rendered as dead links.

## Mobile
Primary bottom navigation is:
- Home
- Menu
- Orders
- Growth
- More

`More` opens a real, permission-filtered destination sheet. No fake destinations are rendered.

## Guardrails
- No route URL changes.
- No page redesign.
- No Platform Admin navigation refactor.
- No database/Supabase/RLS/auth/permissions/subscription/AI/orders/public-menu logic changes.
- No dependencies added.
- No generated-file hand edits.

## Accessibility / RTL
- Uses logical `border-e`, `start/end`, and existing semantic focus tokens.
- Navigation exposes `aria-current="page"` for active destinations.
- Interactive navigation targets remain at least 44px high.
- Arabic-first labels are provided with English counterparts through the existing language system.
- Mixed-direction content remains inside existing shell/page typography rather than being rewritten by the shell.

## Verification
Required before W7.3 completion:
- route generation
- generated route artifact freshness
- typecheck
- tests
- lint
- production build
- existing navigation/component contract tests
- browser/visual QA of the Studio shell itself

The existing CI browser job validates public theme/template behavior; it does not constitute Studio-shell browser QA. Browser/device status therefore remains `PENDING_BROWSER_QA` until the shell is actually exercised.
