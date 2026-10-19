# Public Upsell Product Details P1 — 2026-10-19

## Scope
Fix the public upsell button so it opens the recommended product in the existing details flow. Do not redesign public menus, change order rules, modify data schema, merge, or deploy.

## Verified baseline
- Repository: `Midosd249/Menu_V3`
- Base `main`: `310495dcef34a6629dfee4bdd8d190c7a3b9e292`
- Root cause: `src/components/public-upsell-panel.tsx` records `upsell_click` and scrolls to the page top, but does not request product details.
- Public details owners: shared `PublicMenuView`, Editorial `SignalTableTemplate`, and Heritage `TasteTemplate`. Noir/Gallery reuse the shared renderer; Essential uses it directly.
- Existing details handlers already record `product_view`, pass the selected product's options and offer, and enforce required modifier groups before adding to cart.

## Implementation on branch
- Added `src/lib/menu/public-menu-events.ts` as a small typed browser event bridge.
- Replaced scroll-only action with a product-details request carrying `recommendedProductId`; kept the existing single `upsell_click` call unchanged.
- Added listeners to all three canonical details owners. Each resolves the ID against the currently visible product set before calling the existing open handler.
- Added `tests/public-upsell-details.test.mjs` and registered it in `npm test`.
- Updated continuity and learned-problems documents to record the task state.

## Verification
- GitHub source inspection and branch diff are available.
- Local tests, TypeScript, lint, build, and browser QA have not run because this session has no repository checkout or terminal execution tool.
- GitHub Actions Quality is required before merge. Any pending or failed check must be inspected; do not claim success until the final PR head's checks pass.

## Risk and release state
- No database/schema changes, secrets, deployment settings, or production data touched.
- No merge or production deployment authorized.
- Exact next action: run the draft PR's Quality gates, review final diff and checks, update continuity with actual evidence, then stop for owner review.
