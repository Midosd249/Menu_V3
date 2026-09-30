# 2026-09-30 — Menu ordering, Offers, and public-menu verification audit

## Scope
PR #327 Parts A+B+C, with focus on public offer visibility and release identity.

## Evidence
- VERIFIED: current main at task start was `4f53e397fac357b7dcada23d6a3e069d8fc64aa7`.
- VERIFIED: current PR #327 head is `e620bb43f347bde538575d4c0dac13583f15e4b3`.
- VERIFIED: Quality 2634 and W9 Orders QA 792 passed.
- VERIFIED: Vercel Preview `dpl_5NHEMk8ujdBSpAgwqDL87r2qRiPR` is READY for `db4f23b34f94300765d2aa7338d77ab8945c2b67`.
- VERIFIED: Vercel Preview `52a7bb70e14ac99a77a2c0befcd4a3efdd52f809` reached READY and served `mndy-alwtnya`.
- VERIFIED: canonical Supabase project `ublxptcqefujkbeepylc` contains two active `menu_v3.product_offers` rows for the published tenant.
- VERIFIED: preview SSR payload for `mndy-alwtnya` contains `productOffers` for both active offers, proving database → public query → serialization is connected on the preview deployment.

## Findings
- VERIFIED: `getPublicMenu` queries active, currently valid offers for the exact public product set.
- VERIFIED: `public-menu.tsx` consumes `menu.productOffers?.[selected.id]` and passes the offer into product details; the shared public pricing/badge path is used by featured/category rendering.
- VERIFIED: all-theme browser QA, tests, typecheck, lint, build, and W9 Orders QA passed on the current head.
- VERIFIED: historical order pricing remains server-authoritative and snapshot-based.
- FIXED: RLS migration added for `branch_category_order`, `branch_product_order`, and `product_offers`.
- UNKNOWN: direct physical Android/iOS QA.
- BLOCKED: canonical Supabase currently reports RLS disabled on the three new tables until the new migration is applied; Vercel release is also currently rate-limited.

## Release boundary
No Production deployment has been made for PR #327.

## Exact next action
Merge PR #327 after final diff review; then perform exactly one controlled Production deployment when Vercel permits it.
