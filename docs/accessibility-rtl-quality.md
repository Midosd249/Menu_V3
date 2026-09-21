# W10 — Accessibility and RTL Quality

## Status
- Status: IMPLEMENTATION_IN_PROGRESS until the final GitHub Actions Quality run is verified.
- Scope: shared public menu and owner-critical shared controls.
- Protected: five-theme architecture, tenant/branch isolation, authentication/authorization, routing, migrations, customer actions, and deployment controls.

## Evidence-based contract

### VERIFIED — WCAG 2.2 interaction baseline
- Pointer targets use the repository baseline of at least 24×24 CSS pixels, with approximately 44×44 CSS pixels preferred for important mobile controls where practical.
- Focused controls must not be completely hidden by author-created sticky/fixed UI.
- Modal dialogs must receive focus on open, keep Tab/Shift+Tab within the dialog, support Escape, and return focus to the invoking control when closed.
- Focus indicators remain visible in forced-colors mode and use the shared focus-visible contract.
- Reduced-motion behavior remains independent from accessibility focus/state behavior.

Primary standards evidence: W3C WCAG 2.2 Success Criteria 2.4.11 Focus Not Obscured (Minimum) and 2.5.8 Target Size (Minimum); WAI-ARIA APG Modal Dialog Pattern and Keyboard Interface guidance.

### VERIFIED — Arabic RTL / English LTR / mixed-direction handling
- Root document direction remains route/locale-driven: Arabic is RTL and English is LTR.
- Dynamic restaurant, branch, product, category, tag, allergen, and note content uses `dir="auto"` where direction is data-dependent.
- Prices, order numbers, calories, phone numbers, and time ranges use explicit LTR/bidi isolation where their character order must remain stable inside Arabic text.
- Semantic `<bdi>` is used for dynamic mixed-direction values instead of relying on CSS-only bidi isolation for content semantics.
- Language switching remains URL-aware through the existing `LangToggle` contract; no fabricated English content is introduced.

### VERIFIED — public-menu semantics
- Public menu keeps one semantic `header`, `nav`, `main`, and section-heading hierarchy.
- Category controls expose pressed state.
- Search has a programmatic accessible name.
- Product and cart sheets expose modal semantics and accessible labels.
- Order form fields have explicit labels and appropriate autocomplete/input-direction hints.
- Validation and dynamic status feedback use alert/live-region semantics.
- Decorative icons/backgrounds are hidden from assistive technology.

### VERIFIED — owner-critical surface baseline
- Existing Studio forms use the shared `Field` primitive, which binds visible labels and controls through native label wrapping.
- Shared `Input` and `Textarea` controls provide 44px/11 Tailwind-height inputs and visible focus rings.
- W10 does not introduce a second owner form system or bypass existing authorization/tenant boundaries.

## Implementation

- `src/accessibility.css` — shared focus scroll margins, document scroll padding, bidi primitives, coarse-pointer behavior, forced-colors focus, and reduced-motion compatibility.
- `src/routes/__root.tsx` — loads the accessibility layer before protected theme CSS.
- `src/components/public-menu.tsx` — modal focus management, Escape handling, focus containment, form labels, status/live regions, semantic fieldsets, target-size improvements, and bidi isolation.
- `scripts/accessibility-contract.test.mjs` — regression coverage for the W10 contract.
- `scripts/motion-contract.test.mjs` — retained compatibility coverage after dialog label IDs became unique.
- `package.json` — includes the W10 contract test in the default test suite.

## Research

- W3C WCAG 2.2: Focus Not Obscured and Target Size Minimum.
- W3C WAI-ARIA APG: Modal Dialog Pattern and Keyboard Interface guidance.
- MDN: `<bdi>` and `dir` for bidirectional text; semantic isolation is preferred for dynamic mixed-direction content.

## Verification state

- VERIFIED: TypeScript compilation passed in Quality run `34010505330` before the test failure.
- VERIFIED: 119/120 tests passed in the first W10 run; the only failure was the existing W9 motion contract's expectation of the old static product dialog ID. This was a test-contract compatibility failure, not an application runtime failure.
- VERIFIED: W10 accessibility contract tests passed in that run.
- IN_PROGRESS: rerun of the full Quality Gate after the motion-contract assertion update.
- UNKNOWN: authenticated real-device Owner Studio interaction has not been manually exercised through the connector environment.
- UNKNOWN: automated screen-reader output is not directly observed in this environment.

## Acceptance checklist

- [x] Shared accessibility contract implemented.
- [x] Public dialogs have focus entry, containment, Escape, and focus restoration behavior.
- [x] Public order fields have programmatic labels.
- [x] Mixed Arabic/Latin/numeric values use explicit bidi handling.
- [x] Fixed/sticky UI has focus scroll clearance.
- [x] Target-size baseline is protected by regression tests.
- [x] Reduced motion and forced colors remain covered.
- [x] Owner shared form primitives audited at source level.
- [ ] Full Quality Gate passes after the final test-contract fix.
- [ ] Browser/device RTL/LTR keyboard pass is directly observed and recorded.
