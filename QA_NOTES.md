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

The production preview initially failed because PGLite runtime files were not copied into the server function output. After adding the targeted build step, production preview started successfully. Automated and visual checks on the root route at both 1280×800 and 390×844 confirmed visible content, no console or page errors, and no horizontal overflow.

## Production public menu — 2026-09-02

The production preview served `/m/nafas` successfully at 1280×800 and 390×844. Its PGLite fallback loaded the menu migrations, the demo image backfill, and the packaged food assets. Both automated and visual checks found visible RTL content, complete product imagery, no console or page errors, and no horizontal overflow.
