# Heritage / Taste — Canva-Parity Replacement Audit

## Status
- `VERIFIED_LOCALLY` equivalent build evidence is available on branch `feat/taste-canva-parity` through Vercel preview build `READY` for commit `a7066677693e7689789de641b764baa229f91c43`.
- ThemeKey remains `heritage` for compatibility; the visual implementation is replaced by the Taste presentation.
- Main is intentionally unchanged; merge is deferred until visual/device acceptance.

## Request classification
- Major public-menu theme redesign and integration.
- Research level: Focused.
- Design workflow: repository-first Design Agent methodology.

## Reference evidence
- User supplied the public Taste Canva site URL and a full-page mobile screenshot.
- User supplied the HTML/Tailwind implementation as the intended structural reference.
- Canva connector could not directly open the supplied `my.canva.site` URL as a Canva design share URL; the public URL also could not be fetched by the web reader. The supplied screenshot and code therefore remain the direct reference evidence for implementation.

## VERIFIED repository findings
- `heritage` remains a canonical ThemeKey and is routed through the contemporary restaurant family.
- The previous Heritage visual renderer was the shared `ContemporaryRestaurantTemplate`; this branch replaces that presentation with a dedicated `TasteTemplate` while keeping the ThemeKey stable.
- The shared public order path is `submitPublicOrder`; no new ordering backend was introduced.
- Public action links remain capability/data driven through `PublicActionLinks`.
- Quick Add is already retired by the repository's shared presentation layer; this replacement does not add a new quick-add control.
- Theme bootstrap and existing public/branch preview routes remain intact.

## Implemented direction
- New `TasteTemplate` mirrors the supplied reference information architecture: top navigation, image hero, sticky search/categories, featured dishes, borderless editorial product rows, offer section, hours/branches/information cards, customer actions, allergy footer, floating cart, product detail sheet, cart sheet, and order confirmation.
- Heritage now selects `TasteTemplate` on public menu, public theme preview, and authenticated Studio preview.
- `theme-heritage.css` is replaced with a scoped Taste visual system instead of adding another historical cascade layer.
- Product descriptions are not line-clamped or card-clipped; price is a separate bottom element in the product copy area.
- Product rows use stable 4:3 media and no surrounding card frame.
- RTL swaps media/copy columns without changing semantic order.
- Hours render from the real branch-hours data and branches/maps render from real branch data.
- Customer actions remain data/capability driven.
- A regression contract test was added and the existing Heritage hardening test was updated to the new Taste contracts.

## What is deliberately not copied
- No proprietary Canva assets, hidden source code, private design metadata, or non-public branding was copied.
- The supplied public visual principles and user-provided code structure are transformed into the existing Menu V3 architecture.

## Acceptance criteria
- Heritage visually follows the supplied Taste direction rather than the previous Heritage treatment.
- Existing public menu data, ordering, options, cart, analytics, language routing, branch selection, and tenant isolation remain on the existing paths.
- No Quick Add button is introduced.
- Arabic RTL and English LTR remain supported.
- Product text and price remain readable for long names/descriptions and SAR values.
- Mobile, tablet, and desktop layouts remain structurally stable.
- Theme preview and Studio preview both render the new Taste template.

## Verification results
- `VERIFIED:` Vercel preview build for the final branch commit completed successfully with `READY` state; build logs report `Build Completed in /vercel/output`.
- `VERIFIED:` previous intermediate build failure caused by an accidental missing `nitro` dependency was corrected; current package retains the repository's original dependency versions plus the intended Taste regression test entry.
- `VERIFIED:` branch is 0 commits behind `main` at the final comparison point.
- `NOT RUN:` direct local `npm run typecheck`, `npm test`, `npm run lint`, and `npm run qa:template` execution was not available in this environment.
- `NOT RUN:` physical-device/browser visual QA and real QR-camera scan were not available through the connected tools.
- `BLOCKED:` protected Vercel preview could be built successfully, but direct authenticated page rendering could not be inspected through the Vercel fetch surface; the preview URL is provided for manual inspection.

## UNKNOWN / BLOCKED
- Direct Canva design inspection is unavailable for the supplied `my.canva.site` URL through the connected Canva design API.
- Physical-device pixels and QR-camera scanning require user/device evidence.
- Production deployment is intentionally not part of this implementation iteration.
