# 2026-09-30 — PR #328 Public Offers Visibility Upgrade

## Classification
Atomic public-menu visibility/UX fix covering Heritage/Mazaq offer rendering and an Offers filter across the five public theme families.

## Verified base
- main: `4a2e48677e3c410e59722445fc860e50d8e73628`
- PR: #328
- final head: `8c9a9e1d6cc25c2375157d9060e93936ba667558`

## Root cause
`ThemeRenderer` routes `heritage` to `TasteTemplate`. Mazaq did not consume the shared `productOffers` pricing path for normal product cards, ProductSheet, or Quick Add. Its Featured presentation had offer-aware logic, which masked the gap.

## Implementation
- Added shared `OFFERS_FILTER_ID` and `getActiveOfferProductIds`.
- Added bilingual `PublicOffersFilter` with toggle-button semantics and a prominent featured-style accent treatment.
- Wired Offers filtering into `PublicMenuView` and the Editorial/Signal Table and Heritage/Mazaq custom rails.
- Mazaq now applies active offer pricing/labels to list cards, details, and simple Quick Add.
- Mazaq hides Featured/Today's Pick while Offers is selected so the filtered state is offers-only.
- Added deterministic regression coverage.

## Theme coverage
- Essential / Small Menu: shared `PublicMenuView`
- Editorial / Signal Table: custom filter rail
- Noir / Fine Dining: shared `PublicMenuView`
- Heritage / Mazaq: custom filter rail and offer rendering
- Gallery / Bakery & Dessert: shared `PublicMenuView`

## Verification
- Quality #2640: SUCCESS.
- W9 Orders QA #797: SUCCESS.
- Typecheck: SUCCESS.
- Tests: SUCCESS.
- Lint: SUCCESS.
- Production build: SUCCESS.
- Browser Template QA — all themes: SUCCESS.
- Browser QA confirmed Heritage/Mazaq across RTL/LTR and all configured viewports.
- Direct populated-offer click-through in the generic browser fixture remains UNKNOWN because that fixture does not seed offers; deterministic tests cover the exact filter condition and Mazaq wiring.
- Vercel check is BLOCKED by build-rate-limit; no deployment was intentionally performed.

## Status
IMPLEMENTATION STATUS: VERIFIED_LOCALLY / READY_FOR_OWNER_REVIEW
DEPLOYMENT STATUS: NOT_DEPLOYED / HOLD FOR OWNER REVIEW

## Exact next action
Owner reviews PR #328. After approval, use the controlled release workflow; do not merge/deploy automatically.
