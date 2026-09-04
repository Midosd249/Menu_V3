# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 1 Essential is DONE / VERIFIED / MERGED.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Theme 2 — Editorial Visual Refinement — IN_PROGRESS

**Objective:** turn `editorial` into a premium, art-directed hospitality experience that feels like a contemporary food magazine: strong cover composition, display typography, asymmetric rhythm, image-conscious product presentation, tactile controls and polished detail surfaces — without changing menu data, business rules, routes, or entitlement behavior.

### Design decision
Editorial is intentionally different from Essential. It uses paper/editorial tones, serif-led Latin display typography with the existing Arabic font fallback, chapter markers, long rules, controlled asymmetry, irregular card geometry, cover-like hero treatment and restrained progressive motion. The implementation is isolated in `src/theme-editorial.css` and loaded after shared theme layers. No new dependency or content schema is introduced.

### Acceptance criteria
1. Editorial has a recognizable identity beyond color changes: cover composition, typography, rhythm, asymmetry, surfaces, geometry, media treatment and interaction language.
2. Header, hero/brand treatment, category navigation, product cards, product details, cart, forms and utility states belong to one editorial system.
3. Arabic RTL and English LTR remain correct at narrow mobile, tablet and desktop widths with no horizontal overflow.
4. Existing menu data, ordering, availability, analytics, SEO, tenant isolation and Premium entitlement behavior remain unchanged.
5. Keyboard focus, touch targets, contrast and reduced-motion behavior remain accessible.
6. Motion is progressive and never required for comprehension or layout.
7. Repository quality gates and all-theme browser QA pass.
8. Final diff is limited to Editorial presentation and required continuity documentation.

## Completed Theme Refinement Work
- `essential` — Free — DONE / VERIFIED / MERGED as `cdc591bec58eea0f3b0d2985ed7581b4effc9dcb`.
- `editorial` — Premium — IN_PROGRESS.
- `noir` — Premium — TODO.
- `heritage` — Premium — TODO.
- `gallery` — Premium — TODO.

**VERIFIED:** exactly five public themes; one Free and four Premium.
**VERIFIED:** Premium publishing remains server-authorized using the existing subscription model.
**VERIFIED:** legacy keys normalize safely to the five-key catalog.

## Research basis
- Competitor research established that premium restaurant themes work best as complete visual systems rather than color skins.
- Menu Author, MENU TIGER, Popmenu and FineDine were reviewed for menu composition, branding and image-led hospitality patterns.
- Maintained UI/motion references informed progressive CSS effects, responsive composition and accessible focus treatment.
- No proprietary competitor assets or copied layouts are introduced.

## Verification
- Planned commands: `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, `npm run check:auth`.
- CI must additionally cover route-tree generation, browser QA across all five themes, responsive/RTL checks, console errors, overflow and performance.
- Vercel is intentionally excluded from code verification because the platform is currently rate limited and the user will deploy manually.

## Deployment
- **BLOCKED:** Vercel deployment is externally rate limited; this is not treated as a code failure.
- **UNKNOWN:** production deployment state after the user's manual Vercel action.

## Stop condition
Do not begin Theme 3 until Theme 2 is fully verified, reviewed and merged. Do not begin G7.3 until the five-theme refinement sequence is complete unless the user explicitly changes the order.
