# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential and Editorial remain protected; Noir is the single active refinement task.
- Heritage and Gallery remain queued and untouched.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.

## Current Atomic Task
### Theme 3 — Noir premium refinement — IN_PROGRESS

**Objective:** refine the existing dark `noir` public-menu theme within the `fine-dining-hospitality` family using evidence-backed visual, functional, accessibility, performance, SEO, and Saudi-market principles.

**Files expected to change:**
- `src/theme-noir.css`
- `src/components/templates/fine-dining-hospitality.tsx` only if a verified presentation defect requires it
- `docs/template-audits/noir-premium-refinement.md`
- continuity/design documentation required by the quality gate

**Change boundary:** do not modify the other themes, database, migrations, dependencies, CI/CD, Vercel configuration, authentication, authorization, subscriptions, or shared business behavior. Shared changes are allowed only when a verified backward-compatible defect directly blocks Noir.

## Audit findings and decisions
- **VERIFIED:** `noir` is Premium and maps to `fine-dining-hospitality`.
- **VERIFIED:** current Noir uses a cinematic dark hero, sticky category navigation, and structured horizontal product cards.
- **VERIFIED:** shared public-menu owns supported cart/order, product detail/modifiers, search/category navigation, language, and configured customer actions.
- **UNKNOWN:** screenshot-reported circular product cards are not present in the current source reviewed; do not change them speculatively.
- **UNKNOWN:** Opera white-background behavior cannot be reproduced without a browser session.
- **UNKNOWN:** initial old-theme flash cannot be root-caused without first-paint/browser evidence. Do not mask it with timeouts.
- **Design decision:** retain the structured card system and refine hierarchy, spacing, typography, media stability, and action prominence instead of introducing a new composition without evidence.

## Research
- W3C WCAG 2.2 — target size and focus guidance.
- Google Search Central — LocalBusiness structured data and canonical public-page principles.
- web.dev — responsive images, aspect ratio, and layout-shift guidance.
- Saudi/MENA public examples — Al Qaima, Nasj Menu, TableGreet for QR/mobile/bilingual/menu principles.
- Detailed findings recorded in `docs/design-research-log.md`.

## Acceptance criteria
1. Noir remains recognizably cinematic, dark, and premium.
2. Restaurant/branch identity and configured tagline have clear hierarchy without invented business copy.
3. Product names and SAR prices are readable and stable with long Arabic/English/mixed text.
4. Images and missing-image fallbacks do not destabilize layout.
5. Sticky/category, search, product detail, cart/order, language, and configured customer actions remain usable and correctly prioritized.
6. No unsupported customer action is introduced.
7. Focus and reduced-motion behavior remain accessible.
8. No visual layer obscures content or traps input.
9. SEO/canonical behavior and business truth remain unchanged.
10. All relevant quality gates are run when the repository runtime is available; unavailable browser/device evidence is explicitly recorded as UNKNOWN/BLOCKED.

## Release policy
- Do not push incomplete refinement work as a release batch.
- Keep implementation state separate from deployment state.
- Do not claim DEPLOYED without real deployment evidence.

## Exact next task
Implement the scoped Noir refinement, then run typecheck/tests/lint/build/template QA/performance audit where the runtime is available and review the final diff before updating milestone status.
