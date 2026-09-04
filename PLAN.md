# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 2 Editorial and Theme 3 Noir remain completed and protected.
- Theme 1 Essential is the single active refinement task; Theme 4 Heritage must not begin yet.
- Authentication reconciliation and live authentication verification remain completed.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and remains mandatory.

## Current Atomic Task
### Theme 1 — Essential refinement — IN_PROGRESS

**Objective:** refine the existing Essential theme only. Improve visual hierarchy, typography, copy positioning, icon/action hierarchy, responsive behavior, RTL/LTR resilience, accessibility, performance, SEO-safe presentation, and preview safety while preserving the existing menu data/business contract and all other themes.

**Files changed for this task:**
- `src/theme-essential.css`
- `src/lib/theme/registry.ts`
- `docs/template-brief-essential.md`
- `docs/design-research-log.md`
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`

**Research/design decision:** keep Essential as quiet everyday hospitality rather than pushing it toward a premium visual family. Use warm paper, ink, restrained terracotta, strong Arabic-first hierarchy, compact horizontal product cards, tactile category navigation, and lightweight effects. Saudi-market references consistently emphasize bilingual mobile clarity, current availability, SAR, branch context, food imagery, and fast access; these are treated as usability constraints, not as copied visual designs.

## Refinement acceptance criteria
1. `essential` remains the same ThemeKey, Free tier, and `small-menu` family.
2. No new theme is created and no other existing theme is changed.
3. Existing cart/order, search, category, WhatsApp, phone, map/location, language, product-details, and modifier behavior is preserved.
4. Long Arabic/English/mixed-direction content does not create avoidable overflow or price wrapping.
5. Interactive targets remain practical and keyboard focus remains visible.
6. Sticky navigation does not obscure focused content.
7. Preview mode cannot hide Essential sections through scroll-linked animation or stacking traps.
8. Visual styling remains lightweight and does not add dependencies or decorative runtime overhead.
9. Public SEO/business truth remains controlled by existing route/data logic; no invented structured-data facts are introduced.
10. Browser/device screenshots and real interaction evidence are required before the milestone is marked DONE.

## Completed implementation work
- **VERIFIED:** created the Essential-specific design brief before material refinement.
- **VERIFIED:** recorded current W3C accessibility guidance and Saudi-market research in the research log.
- **VERIFIED:** refined Essential CSS with stronger touch targets, long-text/bidi resilience, price wrapping protection, sticky navigation spacing, and preview visibility protection.
- **VERIFIED:** refined only Essential's catalog description/promise/tags to better match its quiet everyday hospitality concept.
- **VERIFIED:** requested Adobe Express design workflow was invoked; it returned no usable design artifact, so no external asset was introduced.

## Verification state
- **VERIFIED:** repository source and theme architecture inspected before edits.
- **VERIFIED:** current public-menu behavior surface inspected for the required interaction inventory.
- **UNKNOWN:** authenticated browser/device rendering, screenshots, pixel comparison, post-hydration inspection, and real-device interaction execution are not available in the current agent environment.
- **UNKNOWN:** repository commands cannot be executed because no mounted checkout/runtime is available here.
- **BLOCKED:** full Essential milestone closure requires browser/device evidence plus repository quality commands.

## Theme Sequence
- Theme 1 — Essential — refinement IN_PROGRESS; do not reopen other themes.
- Theme 2 — Editorial — DONE / VERIFIED / MERGED.
- Theme 3 — Noir — DONE / VERIFIED / MERGED.
- Theme 4 — Heritage — TODO after Essential and the required preview QA gate.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Exact next task
Run Essential browser/device QA and repository quality gates. Verify post-hydration visibility, mobile/desktop responsive behavior, Arabic RTL, English LTR, mixed-direction content, long text, missing/low-quality images, sold-out, modifiers, sparse/dense categories, search, category navigation, cart/order, WhatsApp, phone, map/location, language, icons, focus, and safe-area behavior. Correct only evidence-backed Essential issues, then update continuity and stop. Do not begin Heritage.
