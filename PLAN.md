# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### G7.3 — Premium Theme Commercialization & Billing UX — NEXT

**Objective:** connect the new Premium theme value to the existing subscription/upgrade surface without inventing a payment provider.

### Acceptance criteria
1. Design Studio is plan-aware and clearly distinguishes Free from Premium.
2. Premium themes remain previewable before payment.
3. Free-plan users receive a clear upgrade CTA when attempting to publish Premium.
4. Active/trialing non-free users can publish Premium themes.
5. Expired/inactive users are fail-closed server-side and receive an actionable upgrade/renewal path.
6. Client messaging and server entitlement use the same subscription source of truth.
7. Existing billing contract is audited before any provider-specific implementation.
8. End-to-end verification covers Free, Starter and Pro behavior.

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
- Menu Author themes: https://menuauthor.com/themes
- MENU TIGER templates: https://www.menutiger.com/features/website-and-menu-templates
- Popmenu website design: https://get.popmenu.com/solutions/website-design
- Maintained open-source UI/motion references were reviewed for reusable patterns; proprietary layouts/assets were not copied.
- CSS scroll-linked motion is progressive enhancement and is guarded by feature support.
- `prefers-reduced-motion` is supported.

## Deployment
- **VERIFIED:** feature branch had successful Vercel Preview deployments.
- **UNKNOWN:** post-merge production deployment for `39bae026425a4a1c9fe32e9b06934deb777b5407` was not yet visible in the Vercel deployment listing at the time this state was updated.

## Stop condition
Do not start G7.3 until the current merged Premium Theme System is fully recorded and production deployment status is verified. Do not claim production updated without a deployment tied to the merged commit.
