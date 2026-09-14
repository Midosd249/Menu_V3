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
- VERIFIED: existing historical owner Studio readiness evidence at 1280×800 and 390×844 remains useful as a baseline for W7.2.
- UNKNOWN: current rendered Studio/Admin visual behavior was not re-captured in W7.1.
- UNKNOWN: current browser/device behavior of the internal shell requires a fresh W7.2 browser QA pass after implementation.
- VERIFIED: W7.1 produced architecture/reference documents only: `docs/W7_SOURCE_SWEEP.md`, `docs/W7_1_IA_AUDIT.md`, `docs/W7_1_ROUTE_MAP.md`, `docs/W7_1_WIREFRAMES.md`.
- BLOCKED: Mobbin direct MCP inspection was unavailable/paid; no inaccessible visual evidence was treated as fact.

## W7.2 — Internal Design System Foundation — 2026-09-15

- VERIFIED: route-independent reusable primitives were added in `src/components/internal-design-system.tsx`.
- VERIFIED: W7.2 does not mount the new navigation primitives, alter existing Studio navigation, migrate pages, modify routes, or edit generated files.
- VERIFIED: existing `Input`, utility class composition, and current token vocabulary are reused; no dependency was added.
- VERIFIED: `tests/internal-design-system-contract.test.mjs` was added for static contract coverage.
- VERIFIED: GitHub Actions run `34898237425` executed `npx vite build --mode development` successfully and generated Growth + Guests in the route tree.
- VERIFIED: generated artifact freshness check passed and generator-produced `src/routeTree.gen.ts` was committed as `0b4057bbfabadff156fd7f2fd48ecf1e1d8c118d`.
- VERIFIED: typecheck, tests, lint, and production build passed in run `34898237425`.
- ACCEPTED: W7.2 verification gate passed for its defined acceptance criteria.
- PENDING_BROWSER_QA: browser/device QA was not required to accept the route-independent W7.2 foundation and remains required for W7.3 shell completion.

## W7.3 — Studio Shell Transformation — 2026-09-15

- VERIFIED: `src/components/studio-shell.tsx` now uses W7.2 `WorkspaceNavigation` and `MobileBottomNav`.
- VERIFIED: desktop primary workspaces are Home, Menu, Orders, Growth, Customers, Settings.
- VERIFIED: contextual groups only expose real routes: Menu, Growth, Customers, Appearance/Publishing, Settings.
- VERIFIED: Brand and Design are contextualized under Appearance; QR and Preview under Publishing.
- VERIFIED: Growth exposes existing Growth, Intelligence, Intelligence Actions, Analytics, and Reports routes.
- VERIFIED: Customers exposes existing Guests/Retention functionality without inventing standalone Loyalty/Campaigns/Feedback/Retention routes.
- VERIFIED: mobile primary is Home, Menu, Orders, Growth, More.
- VERIFIED: existing `settings.write` and `team.write` gates remain applied.
- VERIFIED: `/admin` remains outside Studio navigation.
- VERIFIED: no page content, route URLs, data fetching, backend, Supabase, RLS, auth, permissions contract, subscriptions, AI, orders, or public-menu logic was intentionally changed.
- PENDING_CI_VERIFICATION: W7.3 shell changes require a fresh CI run after the latest branch commits.
- PENDING_BROWSER_QA: 390/430px, tablet, desktop, RTL/LTR, keyboard/focus, long tenant names, mixed-direction labels, URLs/phones/dates/SAR, and stacking/overflow checks remain.

## W7.3 QA gate

Required before W7.3 completion:
- `npx vite build --mode development` with committed generated route tree.
- Typecheck.
- Tests including `tests/w7-3-studio-shell.test.mjs`.
- Lint.
- Production build.
- Desktop grouped navigation QA.
- 390px and 430px mobile QA.
- Tablet QA.
- RTL/LTR and mixed Arabic/English QA.
- Keyboard/focus and `aria-current` semantics.
- Long restaurant names and mixed-direction content.
- URLs, phone numbers, dates, SAR values.
- No horizontal overflow, clipped labels, inaccessible actions, or broken stacking.
- Confirm no forbidden files changed and no Platform Admin/public-menu/backend behavior was touched.
