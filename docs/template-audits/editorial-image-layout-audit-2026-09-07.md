# Editorial Image & Card Layout Audit — 2026-09-07

## Scope
- Theme: `editorial`
- Template family: `contemporary-restaurant`
- Surface: public menu and theme preview
- Focus: image distribution, card balance, mobile scanability, theme coherence
- Protected: Essential, Editorial identity, Noir, Heritage, Gallery, data/auth/subscription/tenant architecture

## Evidence

### VERIFIED — screenshot evidence
The supplied mobile screenshot shows a severe first-product composition problem:
- the first visible product image is separated from its product name/price by a large empty vertical region;
- the image treatment is visually inconsistent with the following product cards;
- the first card consumes disproportionate vertical space and interrupts menu scanning;
- the composition weakens the intended Editorial hierarchy because image, product name, price, and description do not read as one unit.

### VERIFIED — repository evidence
- `src/theme-editorial-hardening.css` already enforced stable `4 / 3` media geometry but did not neutralize the legacy oversized first-card height.
- `src/theme-refinements.css` contains a mobile Editorial rule that gives every `3n + 1` card a `min-height` of `25rem`.
- `src/routes/__root.tsx` loads the legacy refinement layers before `theme-editorial.css` and `theme-editorial-hardening.css`; the final hardening layer is therefore the correct scoped location for the compatibility correction.
- Existing Editorial hardening already establishes safe-area clearance, mixed-direction handling, stable image sizing, and reduced-motion behavior.
- Existing Editorial brief requires stable image ratios, readable scan order, and no layout-dependent visual treatment.

## Diagnosis

### VERIFIED
The dominant defect is not the source image itself. It is the interaction between the legacy Editorial first-card height rule and the current product-card architecture. The oversized mobile height creates an image-led block whose content is pushed away from the media, producing the apparent "floating image" seen in the screenshot.

### INFERRED
The same legacy asymmetric treatment can make odd-numbered cards feel visually inconsistent even when their source images have acceptable dimensions. The Editorial personality should come from typography, rhythm, hierarchy, and controlled lead composition rather than arbitrary card height.

## Refinement applied

### VERIFIED
`src/theme-editorial-hardening.css` now:
- explicitly resets Editorial product-card `min-height` to `0`;
- preserves a stable two-column product layout on mobile;
- uses a controlled media column of approximately 33–34% on small screens;
- locks product media to `4 / 3` with `object-fit: cover`;
- vertically centers the card copy against the media block without creating artificial whitespace;
- disables transform-based card drift;
- keeps featured imagery on a consistent `4 / 3` geometry, including the previous lead-card portrait exception;
- collapses the featured composition to one stable column on small screens.

## Design decision

**PROPOSED → VERIFIED implementation:** Editorial should feel premium through **controlled editorial rhythm**, not through oversized cards. The product scan unit is:

**image → product name → price → short description**

These elements must remain visually connected. Images should be large enough to identify the dish but never so large that they become the dominant object over the product information.

Target mobile behavior:
- image width: roughly one-third of the card;
- media ratio: `4 / 3`;
- copy vertically centered against the media block;
- no arbitrary `25rem` first-card height;
- consistent spacing between cards;
- long Arabic/English names wrap safely;
- SAR price remains isolated and non-wrapping.

## Theme coherence review

### VERIFIED
The correction preserves Editorial's existing identity:
- typography remains the primary expressive layer;
- quiet rules and restrained asymmetry remain available at larger widths;
- imagery remains important but controlled;
- the five-theme system is unchanged;
- no sixth theme or alternate renderer is introduced.

### VERIFIED — protected themes
No Essential, Noir, Heritage, or Gallery stylesheet or implementation was changed by this refinement.

## Verification

- `tests/editorial-browser-hardening.test.mjs` now protects the stable mobile card geometry and the removal of the legacy oversized-height effect.
- Browser/device visual verification of the new commit is **UNKNOWN** in this connector environment and must be performed through the repository's browser QA workflow before claiming final visual closure.
- Vercel deployment is intentionally not triggered for this visual iteration.

## Evidence labels
- `VERIFIED`: screenshot defect, repository selector interaction, scoped CSS correction, test contract, protected-theme non-change.
- `INFERRED`: oversized legacy treatment is the primary causal mechanism behind the observed vertical imbalance.
- `PROPOSED`: Editorial visual rule that imagery should support, not overpower, product scanability.
- `UNKNOWN`: final rendered pixels on a physical device after this commit.
- `BLOCKED`: none for implementation; browser/device proof remains pending.

## Exact next task
Run the repository's Editorial/all-theme browser QA against this commit, inspect the resulting mobile and desktop screenshots, and fix only any remaining evidence-backed Editorial image/card defects before the final W17-Q release gate.
