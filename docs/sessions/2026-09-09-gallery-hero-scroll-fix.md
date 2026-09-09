# Session — Gallery Hero Scroll Fix — 2026-09-09

## Status
- **VERIFIED:** Gallery hero correction is merged to `main` in merge commit `a7a4f847e4356c7533def524b08596c7db983d7c` via PR #45.
- **VERIFIED:** Quality Gate `34308817891` / run `1144` passed all available CI steps: route generation, typecheck, tests, lint, production build, Playwright runtime/Chromium, all-theme Browser Template QA, performance baseline upload, and preview shutdown.
- **VERIFIED:** Gallery-specific regression coverage was added in `tests/gallery-hero-scroll.test.mjs`.
- **VERIFIED:** the fix is scoped to `BakeryDessertTemplate` / `.gallery-canva-reference` and does not modify the shared renderer or other themes.
- **VERIFIED:** Essential, Editorial, Noir, Heritage/Taste, and existing Gallery catalogue/Quick Add behavior remain protected.
- **BLOCKED:** Vercel reported `api-deployments-free-per-day` / build-rate-limit for the merge commit. No random redeploy was attempted.
- **UNKNOWN:** direct real-device pixel confirmation of the new Gallery hero remains pending.

## User evidence
The supplied Android screenshot showed the Gallery home hero visually remaining pinned while lower menu content moved underneath it. The user requested that only the Gallery home/hero be corrected and that the other successful theme work remain untouched.

## Implementation
- Gallery hero header is explicitly forced into normal document flow.
- Viewport positioning properties are cleared.
- Cover layer remains absolute only inside the hero.
- `background-attachment` is explicitly `scroll`.
- Mobile hero height is bounded to a compact range.
- No fixed customer-action controls were changed.

## Continuity protection
- `PublicMenuView` remains the single live Gallery renderer.
- No Theme Registry, theme mapping, data, auth, order, or deployment behavior was changed.
- Heritage/Taste and the other four canonical themes were not reopened or reverted.

## Next task
Real-device verification of the current production menu, including Gallery hero scrolling, safe areas, Arabic RTL, English LTR, mixed-direction content, and fixed customer actions. Do not reopen theme implementation unless a reproducible device defect remains after deployment.
