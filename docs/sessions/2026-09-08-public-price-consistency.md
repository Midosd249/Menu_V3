# Public Price Consistency — 2026-09-08

## Classification
- Visual/public-menu refinement.
- Scope: price hierarchy, placement, bidi safety, and cross-theme consistency.
- No pricing logic, data, ordering, authentication, authorization, tenant isolation, routing, or subscription behavior changed.

## Evidence used
- User-provided mobile screenshots showing inconsistent price placement in public-menu cards.
- Current repository source and theme layers on `main`.
- `src/components/public-menu.tsx` verified as the shared public-menu renderer for the standard menu flow.
- Essential theme styling used as the restrained visual reference.
- Editorial, Heritage, and Noir already have dedicated price treatments; the new layer preserves those systems and only hardens bidi/number-flow behavior.
- Public-menu design research confirms the primary scan anchors should remain the product name and price, with descriptions visually quieter.

## Implementation
- Added `src/theme-price-consistency.css` as a final presentation layer.
- Loaded it after the existing theme and Quick Add refinement layers in `src/routes/__root.tsx`.
- Standard public-menu cards now use a stable name / description / price hierarchy.
- Featured cards use the same compact price hierarchy without introducing a pill or decorative price badge.
- Prices use LTR direction, Unicode bidi isolation, no-wrap, and tabular numerals.
- Quick Add and options controls are explicitly excluded from price selectors.
- Added `tests/public-menu-price-consistency.test.mjs` to guard the presentation contract.

## Verification
- Branch preview deployment completed successfully on Vercel before merge.
- Production deployment for merged `main` commit completed successfully.
- Vercel build logs reached `Build Completed in /vercel/output [16s]` with no build errors.
- Production runtime error aggregation returned no runtime errors in the queried 30-minute window.
- Production public menu `/m/nafas?src=qr` returned HTTP 200 and included the new `theme-price-consistency` stylesheet in the rendered document.
- Real-device visual confirmation remains the user's responsibility; source/deployment verification cannot prove physical-device pixels.

## Release identity
- Repository: `Midosd249/Menu_V3`
- Branch: `main`
- Merge commit: `bfe819d1f7eea38e4550e4235f66b13187382f1c`
- Vercel project: `menu-v3`
- Vercel project ID: `prj_ydfrFBE7ZJVmuNnCOTv3WjWkhuH1`
- Production deployment: `dpl_8Ms3SwVWXmPndGAd7uPLsz67KbMq`
- Production status: `READY`
- Production domain: `menu-v3-kohl.vercel.app`

## Remaining QA
- UNKNOWN: physical-device rendering across all supported viewport sizes.
- UNKNOWN: camera QR scanning on physical devices.
- UNKNOWN: manual screen-reader output.
- UNKNOWN: Opera-specific rendering.
