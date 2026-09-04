# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Theme 1 — Essential Visual Refinement — IN_PROGRESS

**Objective:** turn `essential` into the strongest possible Free theme: a deliberately art-directed hospitality experience with a recognizable identity, premium-level polish, excellent Arabic/English RTL behavior, and disciplined performance — without changing menu data, business rules, routes, or entitlement behavior.

### Acceptance criteria
1. Essential has a coherent visual identity beyond color changes: composition, hierarchy, surfaces, geometry, media treatment, spacing and interaction language.
2. Header, hero, category navigation, product cards, product details, cart, forms and utility states belong to one visual system.
3. Arabic RTL and English LTR remain correct at narrow mobile, tablet and desktop widths with no horizontal overflow.
4. Existing menu data, ordering, availability, analytics, SEO, tenant isolation and entitlement behavior remain unchanged.
5. Keyboard focus, touch targets, contrast and reduced-motion behavior remain accessible.
6. Motion is restrained, progressive and does not become a performance dependency.
7. Repository quality gates and all-theme browser QA pass.
8. Final diff is limited to Theme 1 presentation and required continuity documentation.

## Completed — Premium Theme System 8 → 5
- `essential` — Free.
- `editorial` — Premium.
- `noir` — Premium.
- `heritage` — Premium.
- `gallery` — Premium.

**VERIFIED:** exactly five public themes; one Free and four Premium.

**VERIFIED:** Premium themes are coordinated visual systems, not color variations: layout rhythm, typography, image treatment, surfaces, geometry, hero composition, product presentation, hover depth and motion personality all differ.

**VERIFIED:** legacy theme keys migrate safely and normalize to the five-key catalog.

**VERIFIED:** Premium publishing is server-authorized using the existing subscription model.

**VERIFIED:** browser QA covers all five themes across mobile/tablet/desktop with zero horizontal overflow, zero unnamed buttons/links and zero runtime console errors.

**VERIFIED:** GitHub Actions quality run #455 passed typecheck, 78 tests, lint, production build, performance audit and all-theme browser QA.

**VERIFIED:** PR #8 was squash-merged into `main` as `39bae026425a4a1c9fe32e9b06934deb777b5407`.

## Research basis
- Competitor research established that a theme should behave as a complete visual system rather than a color skin.
- Menu Author, MENU TIGER and Popmenu were reviewed for restaurant theme/layout patterns.
- Maintained open-source UI/motion references were reviewed; proprietary layouts/assets were not copied.
- MDN guidance supports progressive use of modern CSS effects and container-aware responsive design where appropriate.
- W3C guidance supports explicit, visible keyboard focus indicators.
- `prefers-reduced-motion` remains mandatory for motion enhancements.

## Deployment
- **VERIFIED:** feature branch had successful Vercel Preview deployments for the previous five-theme system.
- **UNKNOWN:** Vercel preview for the current Theme 1 branch is currently blocked by the platform deployment rate limit; GitHub status reports retry in 24 hours.
- **UNKNOWN:** post-merge production deployment for `39bae026425a4a1c9fe32e9b06934deb777b5407` remains unverified.

## Commercial sequence after Theme 1
1. Theme 1 — Essential.
2. Theme 2 — Editorial.
3. Theme 3 — Noir.
4. Theme 4 — Heritage.
5. Theme 5 — Gallery.
6. Premium commercialization and billing UX after the five theme experiences are individually refined.

## Stop condition
Do not begin Theme 2 until Theme 1 is verified, reviewed and merged. Do not begin G7.3 until the five-theme visual refinement sequence is complete unless an explicit product decision changes this order.
