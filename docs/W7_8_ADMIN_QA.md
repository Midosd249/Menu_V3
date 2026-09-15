# W7.8 Platform Admin QA

## Status
`PENDING_CURRENT_HEAD_VERIFICATION`

## Required contract checks
1. Existing `/admin` route remains unchanged.
2. Existing 12 tab identifiers remain reachable.
3. Grouped navigation maps only real implemented capabilities.
4. Active state uses accessible `aria-current="page"`.
5. Existing Admin actions and data hooks remain unchanged.
6. Platform Admin authorization remains server-side and unchanged.
7. No fake Admin destinations or platform metrics are added.
8. Overview uses real platform data only.
9. Loading/error/empty/permission-denied/unavailable states remain explicit or are presentation-only refinements over existing states.
10. Security, Platform Health, and Configuration are not exposed as dead or fake destinations.
11. Arabic RTL structure, keyboard focus, and responsive geometry remain usable.
12. W7.7 Customers and existing Studio/public behavior remain regression-protected.

## Browser matrix

| Viewport | Direction | Surface | Required checks |
|---|---|---|---|
| 390×844 | RTL | `/admin` | grouped navigation, active semantics, no horizontal overflow |
| 430×932 | RTL | `/admin` | grouped navigation, content geometry, no overflow |
| 768×1024 | RTL | `/admin` | grouped navigation, tab reachability, no overflow |
| 1280×800 | RTL | `/admin` | full grouped shell, all existing tabs reachable, focus, active state |

## CI browser authorization
The browser job uses the existing `VITE_AUTH_ENABLED=false` development user semantics and the existing `PLATFORM_ADMIN_USER_IDS` configuration contract for `dev-user`. No application test backdoor, secret, migration, or authorization bypass is introduced.

## Quality commands
- `npx vite build --mode development`
- generated route freshness check
- `npm run typecheck`
- `npm test`
- W7.4 focused contract tests
- W7.5 focused contract tests
- W7.6 focused contract tests
- W7.7 focused contract tests
- W7.8 focused contract tests
- `npm run lint`
- `npm run build`
- Playwright runtime + Chromium
- public all-theme browser QA
- Studio Shell/Home/Menu/Growth/Customers browser QA
- Platform Admin browser QA
- performance audit and diagnostics where configured

## Protected boundary
No production database/schema, Supabase, RLS, authentication, authorization/permissions, subscriptions/entitlements, AI provider/business logic, orders business logic, public menu behavior, Studio business logic, dependency changes, merge, or deployment are allowed in W7.8.

## Route architecture boundary
W7.8 keeps all Admin work inside `/admin`. Real route splitting is explicitly deferred to W7.9.
