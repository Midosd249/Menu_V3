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
- PENDING_LOCAL_VERIFICATION: route generation has not yet executed in a real local/CI environment.
- PENDING_LOCAL_VERIFICATION: typecheck, lint, repository tests, build, browser/visual QA, and RTL/device QA could not execute in the current environment.
- Required command: `npx vite build --mode development`.
- The route-generation mismatch is not classified as runtime failure, configuration error, or drift until the required command succeeds.
- `DetailPanel` and `ConfirmDialog` were not created because no existing reusable project Radix dialog/drawer pattern was established that meets the W7.2 reuse constraint.
- Growth and Guests must not be added to primary navigation until route-generation verification succeeds.
- No database, RLS, auth, permissions, subscriptions, AI, orders, public menu, deployment, or merge changed.

## W7.2 QA gate preview

Before W7.2 can be marked complete, verify at minimum:
- 390px RTL owner shell with Home/Menu/Orders/Growth/More.
- Desktop grouped navigation and branch context.
- Arabic/English/mixed-direction content, SAR values, URLs, phone numbers and dates.
- Keyboard focus order and visible focus.
- Dialog/drawer/detail-panel focus management.
- No horizontal overflow at 390px.
- Existing permission-filtered navigation remains consistent with server authorization.
- Route generation, typecheck, lint, build and relevant Playwright/browser checks.
- No regression to public-menu themes.
