# Theme Preview Consistency Audit — 2026-09-09

## Request
Audit the public QR rendering and Design Studio theme preview surfaces together, fix any verified mismatch, and preserve the existing theme identities and completed visual refinements.

## Evidence labels
- VERIFIED — confirmed directly from repository source or CI evidence.
- INFERRED — derived from verified source relationships.
- PROPOSED — recommendation not yet runtime-proven.
- UNKNOWN — runtime evidence unavailable.
- BLOCKED — verification prevented by an external/environment constraint.

## Design Agent workflow
**DISCOVER → AUDIT → DIAGNOSE → IMPLEMENT → REAL-DATA TEST → VISUAL REVIEW → FUNCTIONAL REVIEW → VERIFY → DOCUMENT**

## Verified finding
The public QR route and theme gallery use the canonical `ThemeRenderer` mapping, while `src/routes/studio/preview.tsx` previously handled only Heritage and Contemporary directly and fell back to `PublicMenuView` for other families. This caused Studio Preview to diverge from the canonical Gallery/QR presentation for Gallery, Noir, and other family-backed themes.

## Fix
- `src/routes/studio/preview.tsx` now uses `ThemeRenderer` for every selected theme.
- The route still applies `MenuThemeController` so theme tokens are initialized before rendering.
- Existing preview menu data and theme query handling remain unchanged.
- No theme definition, product logic, ordering logic, auth, data model, or deployment configuration was changed.

## Cross-theme audit
Canonical catalog currently contains exactly five themes:
- Essential
- Editorial
- Noir
- Taste / Heritage
- Gallery

`ThemeRenderer` is the single presentation map for these themes. This is now shared by Studio Preview and the theme gallery preview surface.

## Visual risk review
- **VERIFIED:** Gallery's recent hero/header composition remains scoped to Gallery.
- **VERIFIED:** Noir retains its dedicated dark cinematic stylesheet and fine-dining family.
- **VERIFIED:** Taste/Heritage remains mapped to `TasteTemplate` and was not modified.
- **VERIFIED:** Editorial remains mapped to `ContemporaryRestaurantTemplate`.
- **VERIFIED:** Essential remains mapped to `SmallMenuTemplate`.
- **VERIFIED:** No new fixed/sticky shell was introduced by this fix.
- **UNKNOWN:** physical-device screenshots and QR scan rendering are not available from the repository connector environment.

## Acceptance criteria
1. Studio Preview and theme-gallery preview resolve the same theme to the same canonical renderer.
2. Gallery and Noir no longer fall back to `PublicMenuView` in Studio Preview.
3. Existing theme-specific CSS remains loaded globally and theme-scoped.
4. Existing Gallery/Taste/Noir visual work is preserved.
5. No unrelated product behavior changes.
6. A regression test prevents Studio Preview from reintroducing direct per-family fallbacks.

## Verification
- Source inspection: VERIFIED.
- Canonical renderer inspection: VERIFIED.
- Studio Preview regression test updated: VERIFIED in repository source.
- Full local command execution: BLOCKED because the current execution environment cannot resolve `github.com`; CI is the authoritative executable verification path for this repository.
- Physical Android/QR visual verification: UNKNOWN until the new build is deployed and scanned.

## Exact next action
After CI passes, deploy the latest `main` through the normal release-only workflow and visually compare `/studio/preview?theme=gallery` and `/studio/preview?theme=noir` against their public/QR equivalents on a real Android viewport. Do not change theme styling unless runtime evidence identifies a remaining discrepancy.
