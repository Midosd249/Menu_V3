# Menuun Brand Assets

## Source of truth

The files under `source/` are the owner-supplied Canva exports and are the visual source of truth for the Menuun mark.

- `source/menuun-reference.svg` — original Canva SVG export.
- `source/menuun-reference.png` — original Canva PNG export.
- Do not redraw, recolor, simplify, trace, or AI-regenerate the mark.
- Do not replace the supplied artwork with generated alternatives.
- Any runtime integration must reference these approved assets or an exact, byte-preserving derivative.

## Verified source audit

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

1. Keep the original SVG and PNG in `source/` unchanged.
2. Prefer SVG for scalable UI usage when the supplied rendering is appropriate.
3. Prefer PNG when a raster asset is required and the supplied PNG matches the required treatment.
4. If a derivative is required, create it as a separate named asset and document exactly what changed.
5. Never overwrite the source files with optimized, traced, compressed, recolored, or AI-generated replacements.
6. Do not wire the logo into application UI as part of this brand-asset preparation task.

## Current scope

This directory establishes the approved Menuun visual source and its typography/color usage contract. Application header, favicon, metadata, public-menu, landing-page, and runtime branding integration remain separate atomic tasks.
