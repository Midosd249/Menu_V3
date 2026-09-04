# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 1 Essential is DONE / VERIFIED / MERGED.
- Theme 2 Editorial is DONE / VERIFIED / MERGED.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Theme 3 — Noir Visual Refinement — IN_PROGRESS

**Objective:** turn `noir` into a premium cinematic fine-dining experience: deep layered surfaces, controlled glow, dramatic typography, immersive media, quiet cards, luxurious spacing and polished details — without changing menu data, business rules, routes, or entitlement behavior.

### Acceptance criteria
1. Noir has a recognizable identity beyond dark colors: layered surfaces, cinematic contrast, typography, geometry, media treatment, spacing and interaction language.
2. Header, hero/brand treatment, category navigation, product cards, product details, cart, forms and utility states belong to one coherent fine-dining system.
3. Arabic RTL and English LTR remain correct at narrow mobile, tablet and desktop widths with no horizontal overflow.
4. Existing menu data, ordering, availability, analytics, SEO, tenant isolation and Premium entitlement behavior remain unchanged.
5. Keyboard focus, touch targets, contrast and reduced-motion behavior remain accessible.
6. Motion is progressive and never required for comprehension or layout.
7. Repository quality gates and all-theme browser QA pass.
8. Final diff is limited to Noir presentation and required continuity documentation.

## Completed Theme Refinement Work
- `essential` — Free — DONE / VERIFIED / MERGED as `cdc591bec58eea0f3b0d2985ed7581b4effc9dcb`.
- `editorial` — Premium — DONE / VERIFIED / MERGED as `fe8b791ec891e1163005d5b2bf23e10b38d90928`.
- `noir` — Premium — IN_PROGRESS.
- `heritage` — Premium — TODO.
- `gallery` — Premium — TODO.

## Verification
- Theme 2 CI run #465 passed typecheck, tests, lint, production build, all-theme browser QA and performance baseline.
- Planned commands for Theme 3: `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, `npm run check:auth`.
- CI must additionally cover route-tree generation, browser QA across all five themes, responsive/RTL checks, console errors, overflow and performance.
- Vercel is excluded from code verification because the platform is currently rate limited and the user will deploy manually.

## Deployment
- **BLOCKED:** Vercel deployment is externally rate limited; this is not treated as a code failure.
- **UNKNOWN:** production deployment state after the user's manual Vercel action.

## Stop condition
Do not begin Theme 4 until Theme 3 is fully verified, reviewed and merged. Do not begin G7.3 until the five-theme refinement sequence is complete unless the user explicitly changes the order.
