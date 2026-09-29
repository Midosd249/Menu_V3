# Menuun Brand Assets

## Source of truth for the current production package

The newly supplied Menuun vectors are authoritative for the production derivatives in `final/`. The earlier Canva exports remain preserved historical/reference assets; they are not inputs to these derivatives.

- `source/image_3_cb1978.svg` — transparent primary production artwork.
- `source/image_2_eadc7f.svg` — background-bearing visual comparison reference.
- `source/menuun-reference.svg` and `source/menuun-reference.png` — earlier Canva exports, preserved unchanged as historical/reference assets.
- Do not redraw, recolor, simplify, trace, or AI-regenerate the supplied artwork.
- Do not replace either set of supplied source files.
- Any later runtime integration must use a documented production asset from `final/` or a separately reviewed derivative; do not silently substitute or modify a source.

## Verified current source audit

- Both newly supplied SVGs are archived byte-identically to their received files.
- `image_3_cb1978.svg` contains 9 main artwork paths and is genuinely transparent.
- `image_2_eadc7f.svg` contains 15 main artwork paths and includes its cream background.
- Each source also contains a separate lower-right group with 12 paths (21 total in the transparent source; 27 total in the background reference). It renders as a small stray bar in the previews, is preserved in both archives, and is omitted only from documented production derivatives.

## Previous Canva source audit (historical)

- Repository: `Midosd249/Menu_V3`
- Main HEAD at audit: `03f51b401b326a1b95164ec7a985ce9405f25ce1`
- SVG blob: `90add3bb35196454dd865df0dc2d629dcdbe9023`
- PNG blob: `73eae179178ba843606d97cc1f172a0facd6f4a8`
- SVG canvas: `2000 × 2000`
- SVG viewBox: `0 0 1500 1499.999933`
- SVG structure: 34 paths, 3 embedded PNG image elements, no live `<text>` nodes.
- The supplied SVG contains Canva C2PA provenance metadata. Preserve that provenance in the source file.
- The visible artwork uses `#222222` in the supplied SVG; the embedded source imagery contains the approved dark/orange mark treatment.

## Typography system

The logo artwork itself is outlined/embedded, so the following fonts are **brand-system guidance**, not instructions to rebuild the supplied logo:

- Latin heading/display: **Space Grotesk 700**
- Arabic brand/accent: **Cairo 700**
- Arabic/UI body: **IBM Plex Sans Arabic 400**

These choices were checked with the connected Font Pairing tool and match the existing Menuun design direction.

## Approved brand palette

- Charcoal: `#0F1115`
- Ember Orange: `#FF5A1F`
- Digital Mint: `#1FD1A5`
- Saffron: `#FFC53D`
- Cream: `#FFF7ED`

The palette is a system reference only. Do not alter the supplied logo artwork to force these colors.

## Asset handling rules

1. Keep all supplied source files in `source/` unchanged.
2. Use `final/` for the production variants prepared from the new transparent vector.
3. Prefer SVG for scalable usage when the supplied rendering is appropriate.
4. If another derivative is required, create a separately named asset and document exactly what changed.
5. Never overwrite source files with optimized, traced, compressed, recolored, or AI-generated replacements.
6. Do not wire the logo into application UI as part of this brand-asset preparation task.

## Current scope

This directory preserves the earlier Canva source contract and records the newer vector artwork and its production derivatives. Application header, favicon, metadata, public-menu, landing-page, and runtime branding integration remain separate atomic tasks.
