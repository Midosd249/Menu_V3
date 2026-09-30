# 2026-09-30 — PR #327 Public Offers Visibility Verification

## Classification
P0 public-menu visibility + branch/product ordering + release/security verification.

## Verified position
- PR #327 is open and targets `main`.
- Current implementation head: `e620bb43f347bde538575d4c0dac13583f15e4b3`.
- Quality 2634: passed.
- W9 Orders QA 792: passed.
- db4f23b: Vercel READY Preview only, not Production.
- A later READY Preview for `52a7bb70e14ac99a77a2c0befcd4a3efdd52f809` served the published menu `mndy-alwtnya` with both active offers present in SSR `productOffers`.

## Data evidence
- Canonical Supabase project: `ublxptcqefujkbeepylc`.
- Published tenant: `mndy-alwtnya`.
- Active offers: one `sale_price` offer for Om Ali and one BOGO offer for Cheese Beef Burger.
- Both products are available and featured.
- Public query filters by tenant, ordered public product IDs, active flag, and current time window.

## Root cause and fix
The original public data path already loaded offers, but the public renderer did not consume `productOffers` consistently. PR #327 now passes active offers into the public rendering path and product details, with bilingual labels, old/new pricing, BOGO fallback, and server-authoritative checkout pricing.

## Security finding
Supabase currently reports RLS disabled on `menu_v3.branch_category_order`, `menu_v3.branch_product_order`, and `menu_v3.product_offers`. Added migration `20260930023000_menu_ordering_offers_rls.sql` enables RLS on all three. No direct production data mutation was performed.

## Deployment
- Production: NOT DEPLOYED.
- Vercel new deployment requests are currently blocked by the `api-deployments-free-per-day` / build-rate-limit.
- Do not retry randomly.

## Exact next action
Merge PR #327 after final diff review, then perform one controlled Production deployment when the Vercel gate is available.


## Continuation update — 2026-09-30
- VERIFIED: current PR head is `f81c4f58eae49917c3602c8ae55ead22588e2709`.
- VERIFIED: Quality #2635 and W9 Orders QA #793 passed.
- VERIFIED: live Supabase now reports RLS enabled on all three protected tables; the earlier note in this document that RLS was disabled is superseded by this later direct inspection.
- BLOCKED: Vercel remains rate-limited for new deployments with `api-deployments-free-per-day`; no Production deployment is claimed.
- EXACT NEXT ACTION: wait for the Vercel release gate, then re-check statuses, merge PR #327, and execute one controlled Production deployment.
