# Themes 3–5 Public Menu Visual Refinement Audit

## Scope
- **Themes:** `noir`, `heritage`, `gallery`
- **Routes:** `/m/$slug`, `/m/$slug/$branch`, `/themes/preview?theme=<key>`, `/studio/preview?theme=<key>` where supported
- **Date:** 2026-09-07
- **Scope boundary:** presentation, layout, image, theme coherence, RTL/LTR, and visual regression protection only.
- **Protected:** data model, auth/authz, subscriptions, tenant/branch isolation, customer-action semantics, CI/CD, Vercel configuration, environment variables, and deployment behavior.

## Evidence
### VERIFIED
- `MENU_THEMES` defines the five canonical themes; themes 3–5 in registry order are `noir`, `heritage`, and `gallery`.
- Noir already has a dedicated refinement layer and a route-level theme bootstrap script.
- The supplied screenshots are 695×1536 mobile captures. Exact physical device/browser identity is UNKNOWN.
- The supplied Noir screenshots show strong visual identity but also enough evidence to preserve the theme while preventing an incorrect/stale presentation layer from appearing during hydration.
- Heritage has a dedicated theme stylesheet and hardening layer, but its material/light identity needed a stronger final composition pass.
- Gallery has a dedicated image-led stylesheet, but the outer bakery brand header was not using theme-specific semantic hooks for precise first-screen typography/logo positioning.
- The root document previously mounted an unconfigured `MenuThemeController`, while the public-menu route also mounts a route-selected controller and supplies a server-generated theme bootstrap script. This creates two theme owners during hydration and can cause a transient fallback theme to paint before the route-selected theme wins.

### INFERRED
- Removing the root-level unconfigured controller is the smallest architecture-safe correction because public menu routes already own the selected theme and the server head already bootstraps its tokens.
- Heritage benefits more from disciplined material surfaces and spacing than from additional ornament.
- Gallery's first-screen problem is best addressed by compact brand hierarchy and stable semantic hooks, without changing the image catalogue behavior.

### PROPOSED
- Continue browser/device pixel QA for all three themes before declaring visual closure.
- Keep the final release batch separate from deployment verification.

### UNKNOWN
- Exact physical device/browser rendering after the new main commit.
- Whether any Vercel deployment automatically follows the main-branch updates; no deployment was intentionally invoked by this task.

## Theme 3 — Noir
### Findings
- **HIGH / VERIFIED:** route-selected theme bootstrap already exists, but the root document also mounted an unconfigured theme controller that defaults to `essential` when no explicit theme is supplied.
- **MEDIUM / VERIFIED:** this creates competing theme ownership during initial client hydration.
- **PROPOSED:** make the route-selected controller the sole runtime owner for public menu theme state by removing only the root-level unconfigured mount.

### Acceptance
- No root controller without a selected theme.
- Public route continues to use `createThemeBootstrapScript(activeTheme, ...)`.
- Noir hardening remains loaded after the Noir refinement layers.
- No product/order/customer-action behavior changes.

## Theme 4 — Heritage
### Findings
- **HIGH / VERIFIED:** Heritage is a distinct theme but shares the contemporary renderer; visual identity therefore depends heavily on its scoped presentation layer.
- **HIGH / VERIFIED:** existing hardening already corrected hero/logo and card geometry, but the final composition needed stronger light-material surfaces and tighter information rhythm.
- **MEDIUM / INFERRED:** excessive section spacing and weak surface separation can make the menu feel unfinished even when card geometry is stable.

### Design decisions
- Warm parchment canvas with dark ink and restrained terracotta/bronze accents.
- Light product surfaces rather than dark inherited surfaces.
- Tighter section rhythm.
- Stable 4:3 media and horizontal cards.
- No new ornament, no new interactions, no new business logic.

## Theme 5 — Gallery
### Findings
- **HIGH / VERIFIED:** Gallery is an image-led `bakery-dessert` theme with a separate public brand header outside the shared `menu-public-shell`.
- **MEDIUM / VERIFIED:** the brand header used generic utility classes, making first-screen logo/title positioning less deterministic than the theme-specific menu surface.
- **MEDIUM / INFERRED:** compacting the brand block gives the visual catalogue earlier first-screen presence while preserving the existing image grid.

### Design decisions
- Add semantic Gallery-only classes to the existing brand header.
- Bound logo size and use `object-fit: contain`.
- Keep long names wrapping instead of clipping.
- Preserve RTL/LTR alignment explicitly.
- Remove unnecessary top padding before the public menu.
- Keep the existing portrait image grid and product interaction semantics unchanged.

## Real-data visual matrix
The following scenarios are required for final browser closure:
- Arabic-only, English-only, and bilingual content.
- Mixed-direction names and labels.
- Long restaurant/category/product names.
- Short and long SAR prices.
- Missing images and mixed image ratios.
- Missing descriptions.
- Available and sold-out products.
- Sparse and dense categories.
- One and many categories.
- Configured and absent contact/location/social actions.
- Cart/order enabled and disabled where supported.
- Small, standard, and large mobile; tablet; desktop where supported.

## Verification
- Repository-level source/test contracts added for the Gallery hardening and root theme-controller regression.
- Full local typecheck/lint/build/browser QA: **UNKNOWN in this connector environment** because no runnable repository workspace is available here.
- GitHub branch/main file state: **VERIFIED** through repository content and commit APIs.
- Deployment: **NOT CLAIMED**.

## Rollback
Revert only these presentation/test changes:
- `src/routes/__root.tsx`
- `src/components/templates/bakery-dessert.tsx`
- `src/theme-heritage-hardening.css`
- `src/theme-gallery-hardening.css`
- `tests/gallery-browser-hardening.test.mjs`
- `package.json` test registration
- this audit document

No database, auth, ordering, or deployment rollback is required.
