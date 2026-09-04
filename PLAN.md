# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 1 Essential, Theme 2 Editorial and Theme 3 Noir remain completed milestones; the current task is a refinement pass, not a rebuild.
- Authentication legacy credential reconciliation is DONE / VERIFIED and live sign-in was confirmed by the user after deployment.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Theme 1–3 creative refinement + responsive visual hardening

**Objective:** continue the first-three-theme refinement with a stronger art-direction layer that materially separates Essential, Editorial and Noir while prioritizing mobile-first stability and preserving the shared product architecture.

### Verified repository evidence
1. The five-theme catalog remains `essential`, `editorial`, `noir`, `heritage`, `gallery`.
2. Theme selection is controlled by `MenuThemeController` through `data-menu-theme` and existing CSS tokens.
3. Theme previews use the same `/m/nafas` demo fixture, so visual refinement can remain presentation-only.
4. The previous demo resilience change and authentication correction are protected and must not be reopened.

### Implementation
- **IMPLEMENTED:** added `src/theme-refinements-v2.css` as a second presentation-only layer loaded after the existing theme layers.
- **IMPLEMENTED:** Essential now has a tactile atelier direction with material rings, asymmetric image treatment, restrained interaction lines and scroll-linked reveal where supported.
- **IMPLEMENTED:** Editorial now has a kinetic magazine direction with issue markers, framed imagery, stronger typographic hierarchy, alternating rules and scroll-linked image reveal where supported.
- **IMPLEMENTED:** Noir now has a cinematic light direction with atmospheric grain, spotlight pools, bronze edge lighting, framed cards and scroll-linked cinematic reveal where supported.
- **IMPLEMENTED:** all three themes receive explicit mobile rules that remove desktop offsets, cap image heights, collapse to stable single-column compositions where appropriate, and neutralize hover transforms on touch devices.
- **IMPLEMENTED:** reduced-motion rules disable the enhancement animations while preserving layout and interaction.
- **IMPLEMENTED:** no new package dependency was introduced.

### Research and design decisions
- MDN documents scroll-driven animations as a CSS-based mechanism that can avoid main-thread scroll listeners, while noting that support is not universal. The implementation therefore uses `@supports` as progressive enhancement and retains static fallbacks. citeturn0search0turn0search1turn0search2
- GSAP and Lenis were reviewed as maintained references for advanced scroll and smooth-motion patterns, but no dependency was added in this atomic pass because the existing menu can gain meaningful motion using CSS-only progressive enhancement. citeturn0search8turn1search0turn1search6
- Three.js post-processing and pmndrs/postprocessing were reviewed for future image/effect work such as vignette, bloom, noise and chromatic effects. Those heavier WebGL capabilities remain research inputs rather than dependencies until a concrete theme requires them. citeturn0search9turn1search1
- Codrops current creative tutorials were reviewed for contemporary image distortion, relighting, interactive 3D and parallax patterns. The current pass deliberately stays lighter until live performance is verified on mobile. citeturn1search4turn1search5

### Acceptance criteria
1. Essential, Editorial and Noir remain visibly distinct in composition, imagery, typography and interaction language.
2. Mobile is the primary constraint: no horizontal overflow, destructive fixed heights, or desktop-only offsets.
3. Desktop retains the intended art direction without introducing layout instability.
4. Arabic RTL and English LTR remain structurally valid.
5. Hover effects do not become the only way to discover or operate interactive menu items.
6. Reduced-motion users retain a stable, usable layout.
7. Existing demo lookup, tenant lookup, authentication, ordering and analytics contracts are unchanged.
8. No dependency or secret changes are introduced.
9. CI quality gates pass for the final implementation state before the task is marked DONE.

## Theme Sequence
- Theme 1 — Essential — refinement pass in progress.
- Theme 2 — Editorial — refinement pass in progress.
- Theme 3 — Noir — refinement pass in progress.
- Theme 4 — Heritage — TODO only after final Theme 1–3 live QA.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Stop condition
Stop after this atomic refinement implementation. Do not begin Theme 4. The next task is live mobile/desktop QA after the user deploys the resulting `main` to Vercel.
