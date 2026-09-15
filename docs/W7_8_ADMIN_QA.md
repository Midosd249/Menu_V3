# W7.8 Platform Admin QA

## Status
`DONE / VERIFIED` — 2026-09-15.

## Required contract checks
1. Existing `/admin` route remains unchanged.
2. Existing 12 tab identifiers remain reachable.
3. Grouped navigation maps only real implemented capabilities.
4. Active state uses accessible `aria-current="page"`.
5. Existing Admin actions and data hooks remain unchanged.
6. Platform Admin authorization remains server-side and unchanged.
7. No fake Admin destinations or platform metrics are added.
8. Overview uses real platform data only.
9. Loading/error/empty/permission-denied/unavailable behavior remains explicit or presentation-only over existing state contracts.
10. Security, Platform Health, and Configuration are not exposed as dead or fake destinations.
11. Arabic RTL structure, keyboard focus, and responsive geometry remain usable.
12. W7.7 Customers and existing Studio/public behavior remain regression-protected.

## Browser matrix

| Viewport | Direction | Surface | Result |
|---|---|---|---|
| 390×844 | RTL | `/admin` | PASS — grouped navigation, active semantics, no horizontal overflow |
| 430×932 | RTL | `/admin` | PASS — grouped navigation, content geometry, no overflow |
| 768×1024 | RTL | `/admin` | PASS — grouped navigation, tab reachability, no overflow |
| 1280×800 | RTL | `/admin` | PASS — full grouped shell, all existing tabs reachable, focus, active state |

## CI browser authorization
The browser job uses the existing `VITE_AUTH_ENABLED=false` development-user semantics and the existing `PLATFORM_ADMIN_USER_IDS` configuration contract for `dev-user`. The passing browser run is evidence that the actual `/admin` route reached its authorized Platform Admin presentation state. No application test backdoor, secret, migration, or authorization bypass was introduced.

## Quality results — final current head
- Final run: `34915257732` / run 1601.
- HEAD: `4a4c5963961715e1a7eaec67508255480aff4bb1`.
- Route generation: PASS.
- Generated route freshness: PASS.
- Typecheck: PASS.
- Repository tests: PASS — 266 tests.
- W7.4 focused contracts: PASS.
- W7.5 focused contracts: PASS.
- W7.6 focused contracts: PASS.
- W7.7 focused contracts: PASS.
- W7.8 focused contracts: PASS — 5 tests.
- Lint: PASS; existing repository warnings remained but no lint errors.
- Production build: PASS.
- Playwright runtime: PASS.
- Chromium: PASS.
- Public all-theme browser QA: PASS.
- Studio Shell/Home/Menu/Growth/Customers browser QA: PASS.
- Platform Admin browser QA: PASS.
- Performance baseline: PASS.
- Diagnostics and cleanup: PASS.

## Browser behavior verified
- Group headings are visible.
- Existing tab controls are reachable through grouped navigation.
- Active tab uses `aria-current="page"`.
- Keyboard focus is visible/reachable.
- RTL document structure is preserved.
- No horizontal document overflow at the four required viewports.
- Security, Platform Health, and Configuration are explicitly unavailable and do not become dead links.
- The browser test exercises the real `/admin` application, not a static component render.

## Protected boundary
No production database/schema, Supabase, RLS, authentication, authorization/permissions, subscriptions/entitlements, AI provider/business logic, orders business logic, public menu behavior, Studio business logic, dependency changes, merge, or deployment were changed by W7.8.

## Route architecture boundary
W7.8 keeps all Admin work inside `/admin`. Real route splitting is explicitly deferred to W7.9.

Physical real-device QA remains `UNKNOWN / release-stage only` until a coherent verified release batch reaches `main`.
