# W16 Android Remediation Audit — 2026-09-09

## Request classification
- QA / Browser / Device / Accessibility / Visual regression remediation.
- Research level: **Focused/Deep**, using repository, live production public menu, Supabase data, CI, and W3C accessibility guidance.

## Canonical test fixture
Use the live published tenant `mndy-alwtnya` / branch `main-branch` — «مقهى زهر النعناع» / Mint Blossom Café — as the canonical W16 test fixture because the owner explicitly identified it as the complete/current experience.

Live production evidence confirms:
- published and active
- theme: `essential`
- 7 categories
- 26 products
- 26 available products
- 0 missing product image URLs
- `public_content_version`: 118

The older `nafas` tenant remains in the database with 5 categories and 12 products. It is not used as the canonical W16 visual fixture.

## Owner-provided Android failures
- RTL: FAIL
- Mixed RTL/LTR: FAIL
- Long content: FAIL
- Images: FAIL
- Categories: FAIL
- Product Details: FAIL
- Sticky/Floating UI: FAIL
- Safe Area: FAIL
- QR: FAIL
- TalkBack: PASS
- LTR, Quick Add, Item Notes, Cart, Order Flow: PASS

## Reported visual defects and remediation
### Essential
- Reported missing white halo around language control.
- Added stable `.menu-lang-toggle` hook and Essential-specific white outline/halo.

### Editorial
- Reported last image appearing only after interaction.
- Public menu `DishMedia` now promotes Editorial images to `loading="eager"` and high fetch priority while preserving lazy/low-priority behavior for other themes.
- Reported Arabic long-name word splitting such as `بالجبن`.
- Added word-boundary-safe wrapping and removed the 14ch presentation cap for Editorial product headings.

### Noir
- Reported white opening-hours background with white text.
- Added a Noir-specific dark opening-hours surface, readable foreground colors, muted text treatment, and accent icon treatment.

### Gallery
- Reported incomplete bottoms on image/name/price/description cards.
- Added stable full-height card/content rules and removed clipping from the content region.

### Global
- Removed the legacy Editorial `VOL. 03 — THE TABLE` label from the active refinement layer.
- Added mobile bottom-action safe-area padding and focus scroll clearance.
- QR generator now uses configured production public origin via `getPublicOrigin()` rather than blindly encoding the current Preview/local browser origin.

## QR/data finding
The live canonical production QR route for `mndy-alwtnya/main-branch` returns the current published tenant data, including the 7 current categories and 26 current products. Therefore no data migration or tenant-data overwrite was performed as part of this W16 remediation.

The owner-reported mismatch with another restaurant is treated as a fixture-selection/QR provenance issue until that specific QR payload is identified. The canonical W16 fixture is intentionally `mndy-alwtnya` per owner instruction.

## Protected scope
- No database schema changes.
- No auth/authorization changes.
- No tenant/branch isolation changes.
- No ordering/cart behavior changes.
- No new theme.
- No P0/P1/P2 rework.
- No dependency upgrades.
- No intentional production deployment.

## Verification status
CI for the remediation branch has completed the early quality gates successfully in the current run:
- route tree: PASS
- typecheck: PASS
- tests: PASS
- lint: PASS
- production build: PASS
- Playwright installation/browser QA: still in progress at the time of this audit.

Direct Android retest remains required after the remediation is released. iPhone, VoiceOver, and Opera remain unavailable/unknown.

## W16 closure rule
Do not mark W16 `DONE / VERIFIED` until the owner re-runs the Android production QR matrix against `mndy-alwtnya/main-branch` and confirms the reported visual/interaction failures are resolved. If a defect remains, capture the exact device/browser/viewport and screenshot and open a new atomic remediation pass.
