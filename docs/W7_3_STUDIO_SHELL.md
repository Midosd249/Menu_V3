# W7.3 — Studio Shell Transformation

Status: DONE / VERIFIED

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

`More` opens a real, permission-filtered destination sheet and Escape closes it. No fake destinations are rendered.

## Guardrails
- No route URL changes.
- No page redesign as part of W7.3.
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

## Final CI Evidence
- Accepted W7.3 browser run: `34905256209`
- PR: `#146`
- Accepted run completed successfully.
- Route generation: PASS.
- Generated route freshness: PASS.
- Typecheck: PASS.
- Tests: PASS — 266/266.
- Lint: PASS — 0 errors; existing warnings only.
- Production build: PASS.
- Playwright runtime + Chromium: PASS.
- Public all-theme browser QA: PASS.
- Performance audit: PASS and artifact uploaded.
- Studio Shell browser QA: PASS — actual `/studio` reached; 1 W7.3 browser test passed in 10.2s.
- Diagnostics upload and cleanup: PASS.

## Browser Acceptance
The accepted W7.3 browser test covered 1280×800, 390×844, 430×932, and 768×1024; Arabic RTL; supported English LTR; active navigation; no dead destinations; Reports exclusion; Platform Admin exclusion; keyboard focus; More sheet; Escape close; and no horizontal overflow.

The CI workflow created a temporary PGlite fixture only inside the runner. It added missing compatibility columns and seeded `demo-nafas`/`dev-user`, then removed the fixture on step exit. No production migration was committed.

Physical real-device QA remains a release-stage check and is not implied by this CI result.
