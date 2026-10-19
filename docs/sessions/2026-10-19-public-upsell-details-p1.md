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
- Added `src/lib/menu/public-menu-events.ts` as a typed browser event bridge, including one pending product ID so a click is not lost if the lazy template has not registered its listener yet.
- Replaced scroll-only action with a product-details request carrying `recommendedProductId`; kept the existing single `upsell_click` call unchanged.
- Added listeners to all three canonical details owners. Each resolves the ID against the currently visible product set before calling the existing open handler.
- Added `tests/public-upsell-details.test.mjs` and registered it in `npm test`.
- Updated continuity and learned-problems documents to record the task state.

## Verification
- GitHub source inspection and branch diff are available.
- Local tests, TypeScript, lint, build, and browser QA have not run because this session has no repository checkout or terminal execution tool.
- Initial PR head `1f93485034926084605b8c18b51192d0a390df50`: route generation, TypeScript, `npm test`, contract tests, lint, and production build passed. Quality browser QA setup failed at dependency installation with `ETARGET` for `@typescript-eslint/type-utils@8.72.0`; W9 Orders QA failed similarly for `@typescript-eslint/parser@8.72.0` before browser tests.
- Latest branch head `d0c3d267687d2694c3814ae9bc4c6761ca566533` has no associated GitHub Actions run, so the pending-click refinement is not yet verified by CI. Local checks and browser QA remain unavailable because there is no repository checkout/terminal tool in this session. Vercel preview status is pending; no production deployment occurred.

## Risk and release state
- No database/schema changes, secrets, deployment settings, or production data touched.
- No merge or production deployment authorized.
- Exact next action: once npm can resolve the missing package versions, trigger and inspect Quality and W9 on the latest PR head, review the final diff, update continuity with actual evidence, then stop for owner review. Do not merge or deploy.
