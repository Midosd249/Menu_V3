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

## Implementation
- **VERIFIED:** isolated `src/theme-noir.css` provides the complete Noir art direction.
- **VERIFIED:** `src/routes/__root.tsx` loads the stylesheet without changing route behavior.
- **INFERRED:** existing menu DOM contracts provide the intended targets for the presentation layer; no template component was changed.

## Verification
- Planned repository gates: `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, `npm run check:auth`.
- CI must additionally cover route-tree generation, browser QA across all five themes, responsive/RTL checks, console errors, overflow and performance.
- **VERIFIED:** GitHub source inspection confirms the implementation is presentation-only at the source level.
- **UNKNOWN:** local command execution and browser QA are not available through the current GitHub connector.

## Deployment
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **VERIFIED:** Vercel has READY Theme 1/Theme 2 preview deployments.
- **BLOCKED:** Vercel deployment is rejected by the account Hobby build-rate limit; GitHub status points to Vercel's `upgradeToPro=build-rate-limit` target.
- **UNKNOWN:** production deployment for the current Theme 3 branch/main until deployment is unblocked.

## Stop condition
Do not begin Theme 4 until Theme 3 is fully verified, reviewed and merged. Do not begin G7.3 until the five-theme refinement sequence is complete unless the user explicitly changes the order.
