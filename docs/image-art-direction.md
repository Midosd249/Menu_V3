# Image Art Direction — W8

## Status
- W8 is the active design-system workstream.
- Five protected themes remain unchanged in structure and personality.
- This document is the implementation contract for hospitality imagery, not a requirement to replace tenant-owned assets with stock imagery.

## Product position
Menu V3 should read as a premium Arabic-first hospitality presence platform. Imagery is therefore treated as product content with a clear hierarchy, not decoration added after layout.

## Image roles

### 1. Dish / product imagery
- Primary subject: the actual sellable item.
- Preferred framing: close, appetizing, uncluttered, natural light or controlled editorial lighting.
- Default ratio: 4:3 for card media; 1:1 only when the surrounding component is explicitly square.
- `object-fit: cover` is the default; focal point must be configurable when the subject is not centered.
- Never crop away the product's defining feature.
- Do not use generic food photography as a substitute for a tenant's real product when tenant content exists.

### 2. Brand / restaurant imagery
- Primary subject: atmosphere, identity, hospitality, or signature experience.
- Preferred framing: wide editorial compositions with negative space for copy.
- Default ratio: 16:9 or 3:2 depending on the surface.
- Use `object-position` deliberately; never rely on a random crop for a hero.

### 3. Branch imagery
- Show recognizable physical context only when it helps customers choose or visit a branch.
- Keep location imagery subordinate to the brand and menu.
- Do not expose private or sensitive location information through imagery.

### 4. Product / marketing screenshots
- Use real UI captures from the current product version.
- Keep device framing consistent.
- Do not use competitor screenshots, logos, or copied creative.

## Responsive delivery
- Every meaningful image must reserve stable geometry before it loads.
- Use explicit width/height or an equivalent aspect-ratio container.
- `loading="lazy"` is the default below the fold.
- Above-the-fold hero/LCP media may use eager loading only when it is actually the LCP candidate.
- `decoding="async"` is the default for non-critical imagery.
- Use responsive `sizes`/`srcset` when the image pipeline can provide variants; never send a desktop-sized asset to a narrow mobile card without a reason.
- Prefer modern compressed formats where the asset pipeline supports them, while retaining a safe browser fallback.

## Fallbacks
- A missing image must preserve the component's geometry and visual hierarchy.
- Never show a broken-image icon as the designed fallback.
- A neutral semantic surface is preferable to fabricated food imagery.
- Fallbacks must remain compatible with all five themes.

## Accessibility
- Meaningful food, restaurant, branch, and product imagery gets concise alt text in the active language.
- Alt text should identify the subject, not repeat surrounding UI copy.
- Decorative imagery uses empty alt text (`alt=""`) and must not be announced by assistive technology.
- Never place essential information only inside an image.

## Art direction by theme
- Essential: clarity, appetite, restraint.
- Editorial: composition, whitespace, magazine-like storytelling.
- Noir: controlled contrast, dramatic crop, minimal visual noise.
- Heritage: warmth, material texture, cultural authenticity without stereotypes.
- Gallery: image-led presentation, disciplined grids, strong focal points.

These are directional constraints, not five separate image systems. Shared performance and accessibility rules remain universal.

## Licensing and provenance
- Tenant-uploaded imagery remains tenant-owned content.
- New product assets must have a documented source or explicit generation/ownership basis.
- Do not ship competitor-owned photography, logos, screenshots, or copied campaign creative.
- Generated artwork may be used for generic brand surfaces only when it does not falsely represent a real restaurant, product, person, or location.

## Implementation contract
- Centralize future image behavior in a reusable media primitive rather than repeating ad-hoc `<img>` rules.
- Keep image URLs data-driven and tenant-scoped.
- Do not alter the canonical `menu_v3` storage/data model solely for visual polish.
- Avoid adding an image-processing dependency until the existing asset path is proven insufficient.

## QA gates
1. Geometry is stable before image decode.
2. Mobile payload is not unnecessarily desktop-sized.
3. Focal point remains correct at narrow and wide breakpoints.
4. Meaningful images have useful alt text; decorative images remain silent.
5. Missing images retain layout and theme personality.
6. No unlicensed third-party creative is introduced.
7. All five protected themes pass visual regression.
8. Performance checks show no avoidable LCP/CLS regression.
