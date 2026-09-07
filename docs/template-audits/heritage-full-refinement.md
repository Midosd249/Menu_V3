# Heritage — Full Visual / Layout / Image / Theme Refinement Audit

## Status
- Theme: `heritage`
- Template family: `contemporary-restaurant`
- Public routes: `/m/$slug` and `/m/$slug/$branch`
- Preview: `/themes/preview?theme=heritage`
- Scope: Heritage presentation only
- Implementation: VERIFIED
- Production deployment: NOT DEPLOYED intentionally

## Evidence
- **VERIFIED:** supplied 695×1536 mobile screenshot shows an oversized white logo block, dominant cover imagery, dense kicker metadata, and weak first-screen menu utility.
- **VERIFIED:** Heritage uses dedicated `.editorial-hero`, `.editorial-hero-media`, `.editorial-hero-shade`, `.editorial-hero-inner`, `.editorial-brand-row`, and `.editorial-brand-logo` presentation classes.
- **VERIFIED:** existing Heritage styling did not explicitly bound/isolate the brand logo and contained inherited asymmetric card geometry.
- **INFERRED:** the oversized logo effect is amplified by the light background of the supplied logo asset.
- **UNKNOWN:** exact physical device/browser identity from the screenshot.

## Refinement decisions
- Keep cover imagery as a restrained supporting material layer.
- Bound the brand logo and use `object-fit: contain`.
- Reduce mobile hero height and improve identity hierarchy.
- Preserve the shared `contemporary-restaurant` renderer and its interaction ownership.
- Stabilize product cards with one horizontal geometry and `4 / 3` media.
- Stabilize featured media with `4 / 3` geometry.
- Remove inherited alternating radii/transforms from Heritage presentation.
- Preserve RTL/LTR and bidi-safe Latin/numeric values.
- Preserve existing MenuMedia fallback and all ordering/customer-action behavior.

## Protected scope
No changes to database/schema, migrations, authentication, authorization, subscriptions, tenant isolation, branch isolation, dependencies, CI/CD, Vercel configuration, environment variables, routing, or product/order logic.

## Acceptance criteria
- Logo remains bounded and does not behave as hero media.
- Hero exposes menu utility earlier on mobile.
- Product and featured cards have stable geometry across image ratios and item counts.
- Long Arabic/English content does not create intentional overflow.
- RTL/LTR and SAR presentation remain stable.
- Existing actions, product dialog, cart, and ordering semantics remain unchanged.
- Heritage hardening is scoped to `data-menu-theme="heritage"`.
- Relevant automated quality gates remain green.

## Integration note
Heritage implementation changes were integrated directly into the canonical `main` after Noir had already been merged. The integration used the current `main` tree as the base so the Heritage changes were layered onto the newer Noir state rather than replacing it.
