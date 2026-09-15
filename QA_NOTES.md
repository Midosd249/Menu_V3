# QA Notes

## Root route — 2026-09-02

The Arabic landing page rendered visibly at both 1280×800 and 390×844. The automated smoke test reported HTTP 200, no console or page errors, and no horizontal overflow at either viewport.

Visual review confirmed a coherent Arabic RTL hierarchy, readable controls, and an intentionally stacked mobile hero layout. No overlaps, clipped controls, or horizontal scrolling were observed on the root route.

## Public menu route (`/m/nafas`) — 2026-09-02

The public menu rendered at both 1280×800 and 390×844 with no horizontal overflow or runtime errors. The RTL hierarchy, restaurant header, language toggle, search control, category filter, and product cards appeared usable.

Visual review identified that the demo product cards were using abstract color-block fallbacks rather than the packaged food imagery. This does not create a runtime error, but it weakens the intended commercial menu presentation and should be corrected by validating the seeded image URLs and the image rendering path.

## Public menu after handoff merge — 2026-09-02

After applying the pending `0003_demo_images.sql` migration and its packaged `/public/demo` assets, the desktop and 390px mobile menu now display appropriate food imagery for featured and list products. The public menu remained free of horizontal overflow, console errors, and page errors. The mobile layout maintains two-column featured cards and readable product rows without clipping.

## Owner studio smoke check — 2026-09-02

In the auth-disabled, no-external-database QA mode, onboarding successfully created and published the isolated test restaurant. The mobile studio snapshot rendered the owner dashboard with the expected restaurant, branch, item count, health card, and mobile navigation. The initial desktop smoke capture retained a loading state while the mobile capture completed; this requires a deliberate readiness-based browser check rather than treating the fixed-delay smoke screenshot as conclusive.

## Owner studio readiness — 2026-09-02

A readiness-based check confirmed that the owner studio becomes fully usable on both 1280×800 and 390×844 after initial data loading. Visual review confirmed the desktop sidebar and the mobile bottom navigation, including correct RTL labels and readable overview cards. The earlier loading-only desktop capture was timing-sensitive, not a persistent UI failure.

## Production preview — 2026-09-02

The production preview initially failed because PGLITE runtime files were not copied into the server function output. After adding the targeted build step, production preview started successfully. Automated and visual checks on the root route at both 1280×800 and 390×844 confirmed visible content, no console or page errors, and no horizontal overflow.

## Production public menu — 2026-09-02

The production preview served `/m/nafas` successfully at 1280×800 and 390×844. Its PGLite fallback loaded the menu migrations, the demo image backfill, and the packaged food assets. Both automated and visual checks found visible RTL content, complete product imagery, no console or page errors, and no horizontal overflow.

## W7.1 — Internal Experience Architecture — 2026-09-14

- VERIFIED: W7.1 is analysis/architecture only; no UI implementation was performed.
- VERIFIED: current `main` baseline used for audit is `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: historical owner Studio readiness evidence remains useful as a baseline for W7.2.
- UNKNOWN: current rendered Studio/Admin visual behavior was not re-captured in W7.1.
- VERIFIED: W7.1 produced source sweep, IA audit, route map, and wireframe documents.
- BLOCKED: Mobbin direct MCP inspection was unavailable/paid; no inaccessible visual evidence was treated as fact.

## W7.2 — Internal Design System Foundation — 2026-09-15

- VERIFIED: route-independent reusable primitives were added in `src/components/internal-design-system.tsx`.
- VERIFIED: W7.2 does not mount the new navigation primitives, alter existing Studio navigation, migrate pages, modify routes, or edit generated files.
- VERIFIED: `tests/internal-design-system-contract.test.mjs` was added for static contract coverage.
- VERIFIED: GitHub Actions run `34898237425` passed route generation/freshness, typecheck, tests, lint, and production build.
- ACCEPTED: W7.2 verification gate passed.

## W7.3 — Studio Shell Transformation — 2026-09-15

- VERIFIED: `src/components/studio-shell.tsx` uses W7.2 `WorkspaceNavigation` and `MobileBottomNav`.
- VERIFIED: desktop primary workspaces are Home, Menu, Orders, Growth, Customers, Settings.
- VERIFIED: contextual groups only expose real routes; Reports remains intentionally excluded from Studio navigation.
- VERIFIED: mobile primary is Home, Menu, Orders, Growth, More; More is permission-filtered and Escape closes it.
- VERIFIED: accepted CI run `34905256209` passed route generation, freshness, typecheck, 266 tests, lint, production build, Playwright/Chromium, public all-theme browser QA, performance audit, Studio Shell browser QA, artifact upload, and cleanup.
- VERIFIED: the Studio browser step actually served `http://127.0.0.1:8082/studio` and the W7.3 test passed.
- ACCEPTED: W7.3 is DONE / VERIFIED. Physical real-device QA remains release-stage evidence.

## W7.4 — Studio Home — 2026-09-15

- VERIFIED: W7.4 began only after W7.3 browser acceptance passed.
- VERIFIED: `/studio/` now renders the focused `StudioHome` component.
- VERIFIED: Home uses only existing data sources and includes loading/error/empty/populated, RTL/LTR, keyboard focus, semantic progress, and responsive states.
- VERIFIED: no fake revenue, orders, guests, conversion rates, recommendations, charts, rankings, or sample numbers were added.
- VERIFIED: final-head W7.4 quality/browser verification was completed before W7.5 began.

## W7.5 — Menu Workspace — 2026-09-15

- VERIFIED: W7.5 Menu Workspace is DONE / VERIFIED at pre-reconciliation HEAD `193912be0a2fa9c7fadcd70995108a4ec9166722`.
- VERIFIED: final CI run `34908577942` passed route generation, generated freshness, typecheck, 266 repository tests, W7.4/W7.5 focused tests, lint, production build, Playwright/Chromium, public all-theme QA, Studio Shell/Home/Menu browser QA, performance audit, diagnostics, and cleanup.
- VERIFIED: browser matrix covered 390×844, 430×932, 768×1024, and 1280×800, RTL/LTR, contextual link reachability, search focus, availability filtering, and no horizontal page overflow.
- VERIFIED: no production database/schema, Supabase, RLS, auth, permissions, subscriptions, AI provider/business logic, orders business logic, public menu behavior, Platform Admin, dependencies, merge, or deployment changed.
- UNKNOWN: physical real-device QA remains pending release-stage work only.

## W7.6 — Growth Workspace — 2026-09-15

- VERIFIED: W7.6 is DONE / VERIFIED at HEAD `3fe58decd1f0c39806bd037e717778c4d58d01ab`.
- VERIFIED: final current-head quality run `34910495789` passed route generation/freshness, typecheck, 266 repository tests, W7.4/W7.5/W7.6 focused contracts, lint, production build, Playwright/Chromium, public all-theme browser QA, Studio Shell/Home/Menu/Growth browser QA, performance audit, diagnostics, and cleanup.
- VERIFIED: Growth uses existing sources only and does not invent metrics, charts, impact, ROI, conversion, experiment results, or production sample data.
- VERIFIED: the initial W7.6 current-head browser issue was only a W7.3 More-sheet test selector defect; correction changed no runtime behavior.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

## W7.7 — Customers Workspace — 2026-09-15

- VERIFIED: current-head CI run `34914024416` / run 1597 passed against implementation HEAD `a89cc5110175d633ac6f3379fdb1ce6ce27fd4fa`.
- VERIFIED: route generation/freshness, typecheck, 266 repository tests, W7.4/W7.5/W7.6/W7.7 focused tests, lint, production build, Playwright runtime/Chromium, public all-theme browser QA, Studio Shell/Home/Menu/Growth/Customers browser QA, performance baseline, diagnostics, and cleanup passed.
- VERIFIED: Customers browser QA reached `/studio/guests` in the real application with the CI PGlite fixture and auth-disabled local mode; five Studio browser tests passed.
- VERIFIED: 390×844, 430×932, 768×1024, and 1280×800 were covered; desktop Customers active navigation was asserted only at 1280×800; mobile navigation was asserted at 390×844; RTL/LTR, focus, overflow, and unsupported relationship links passed.
- VERIFIED: final correction was test-only and scoped the desktop active-nav assertion to desktop; no runtime Customers behavior changed.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

## W7.8 — Platform Admin Information Architecture and Admin Shell — 2026-09-15

- VERIFIED: final current-head CI run `34915257732` / run 1601 passed.
- VERIFIED: run 1601 belongs to implementation HEAD `4a4c5963961715e1a7eaec67508255480aff4bb1` and checked the PR merge ref against main `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: route generation/freshness, typecheck, 266 repository tests, W7.4/W7.5/W7.6/W7.7/W7.8 focused tests, lint, production build, Playwright runtime/Chromium, public all-theme browser QA, Studio Shell/Home/Menu/Growth/Customers browser QA, Platform Admin browser QA, performance baseline, diagnostics, and cleanup all passed.
- VERIFIED: Platform Admin browser QA exercised the real `/admin` application in the authorized CI development-user state at 390×844, 430×932, 768×1024, and 1280×800.
- VERIFIED: grouped navigation, all existing Admin tabs, active `aria-current` semantics, keyboard focus, RTL structure, and no horizontal overflow passed.
- VERIFIED: no fake Admin metrics, totals, health scores, activity, security events, charts, recommendations, or operator data were added.
- VERIFIED: no production database/schema, Supabase, RLS, auth, permissions, subscriptions, AI provider/business logic, orders business logic, public menu, Studio business logic, dependencies, merge, or deployment changed.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

## W7.9 — Platform Admin Route Architecture / Route Splitting — 2026-09-15

- VERIFIED: final route correction quality run `34925141809` / run 1638 passed all configured quality and browser stages at implementation/test HEAD `db9e2f6a816d6e1d10fc7e37bfaad4c7004a40f0` before continuity reconciliation.
- VERIFIED: the original Platform Admin browser blocker was an `AUTH_DISABLED_FIXTURE_GAP`; the CI-only temporary PostgreSQL service now applies the required compatible existing migrations, creates missing Supabase-compatible roles, and seeds `dev-user` in `menu_v3.platform_admins`. This fixture is runner-local and does not modify production schema or migration files.
- VERIFIED: the only remaining W7.9 browser failure was a test serialization expectation. The actual router URL was `/admin/orders?keep=%221%22`; `URLSearchParams.get("keep")` therefore returns `"1"`. The test now asserts the actual serialized value rather than the unencoded expectation.
- VERIFIED: `/admin` remains Overview/Shell; `/admin/$workspace` is the protected workspace adapter; `setTab(next)` remains intact and URL synchronization is additive through `navigate({ to: ADMIN_ROUTES[next] })`.
- VERIFIED: all real Admin child routes, legacy known-tab normalization, unknown-tab safe fallback, refresh, back/forward, active navigation, responsive geometry, RTL/LTR structure, focus/aria-current, and no-overflow checks passed in the final route-correction run.
- VERIFIED: public all-theme QA and Studio Shell/Home/Menu/Growth/Customers browser QA remained green.
- VERIFIED: no fake Admin data, metrics, charts, health scores, security events, recommendations, or operator sample data were added.
- VERIFIED: no production database/schema, Supabase, RLS, auth, permissions, subscriptions, AI, orders, public menu, Studio business logic, dependencies, Vercel, merge, or deployment changed.
- VERIFIED: continuity documentation for W7.9 has now been reconciled in the canonical project-control and W7.9 audit/architecture/QA records; a final current-head quality run is required to validate this documentation-only reconciliation.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

## W7.10 — Full-Product Mobile and Responsive Pass — 2026-09-15

- VERIFIED: final implementation/test workflow `34932493596` / run 1655 passed all configured route, freshness, typecheck, repository, W7.4–W7.10 contract, lint, production build, Playwright/Chromium, public, Studio, Platform Admin, performance, diagnostics, and cleanup stages at implementation HEAD `16d11eae278641062503c0a6d23d60677e6c7cb3`.
- VERIFIED: the prior Studio readiness failure was test-only: the test waited for `<main>` while the real Studio Shell uses `role="banner"`; the test was corrected without weakening route, viewport, overflow, or accessibility assertions.
- VERIFIED: the prior Studio 320px overflow was real: `scrollWidth=344` and `clientWidth=320`; diagnostics identified the Studio Shell header action group as the source of the width pressure.
- VERIFIED: `src/components/studio-shell.tsx` now makes the mobile header action group width-contained and wrapping-safe (`w-full min-w-0 max-w-full flex-wrap`) and restores compact horizontal behavior from `sm`.
- VERIFIED: `src/components/studio-menu-workspace.tsx` adds narrow-width containment to the Menu header/action row while preserving the existing Import action and behavior.
- VERIFIED: shared WorkspaceHeader stacks on small screens and shared FilterBar actions wrap; no route architecture or business logic changed.
- VERIFIED: public template QA passed all five themes at 320×800, 360×800, 390×844, 430×932, 768×1024, 1024×768, 1280×800, and 1440×900 with no horizontal overflow, accessible-name failures, or runtime console errors.
- VERIFIED: Studio responsive browser QA passed 9 tests; Platform Admin responsive browser QA passed 20 tests.
- VERIFIED: performance audit completed and baseline artifact was uploaded.
- VERIFIED: no protected backend, security, authorization, business logic, dependency, route, Vercel, merge, or deployment area changed.
- UNKNOWN: physical Android/iOS device QA remains `PENDING_RELEASE_STAGE`.

## QA Continuity Rule
Documentation reconciliation is not a substitute for current code validation. Every implementation change receives a new current-head quality/browser verification before DONE.
