# W14 — Pricing, Packaging, and Commercial UX

## Objective

Make Menu V3 commercially legible without inventing payment capabilities, gating the protected theme catalog, exposing private tenant data, or changing the existing public-menu architecture.

## Repository evidence

The existing subscription foundation is already the source of truth for plan limits and prices:

- `free`: 0 SAR/month, 1 branch, 50 products, 3 team members.
- `starter`: 99 SAR/month, 3 branches, 300 products, 10 team members.
- `pro`: 199 SAR/month, 10 branches, 1,000 products, 25 team members.
- The database entitlement boundary already rejects writes when an active/trialing subscription exceeds its plan limit.
- The five protected themes are `essential`, `editorial`, `noir`, `heritage`, and `gallery`.
- The theme migration contains no subscription-based theme entitlement, so W14 does not invent one.

## External market scan — 2026-09-06

The review focused on current Saudi/MENA restaurant-menu SaaS and comparable global products. The useful pattern is not to copy a competitor's feature list, but to understand the commercial anchor:

- **Nasj Menu:** free tier plus low-cost paid tiers; its current public pricing shows SAR 19/month Starter and SAR 49/month Pro. This supports a low-friction free-to-paid funnel.
- **TableGreet Saudi:** current public pricing shows Free and Pro at SAR 105/month, with advanced operational features used as the paid-value anchor.
- **TableQR Saudi:** current public pricing shows SAR 1,800/year for a managed Signature offer and SAR 4,500/year for a fully managed Concierge offer. This demonstrates a separate service/concierge value layer rather than only software limits.
- **E-Menu Saudi:** current public pricing shows SAR 69/month Business and SAR 89/month Enterprise, with branch support and integrations used as higher-tier packaging.
- **Menu 1000:** current public material shows a free plan and localized KSA pricing starting at SAR 59/month; multi-branch capability is positioned at enterprise level.
- **TableQR / global managed-menu references:** higher prices are justified by setup, content work, support, custom design, and ongoing managed updates rather than simply by adding arbitrary visual themes.

## Product decision

W14 keeps the existing five-theme catalog available across plans. Packaging is based on operational scale already represented in the subscription schema:

1. number of active branches;
2. number of menu products;
3. number of active team members.

This is the smallest defensible commercial boundary because the product already enforces those limits server-side.

## UX decision

- `/pricing` is public, bilingual, and explicit about limits.
- The page does **not** show a fake checkout or imply that a payment gateway exists.
- The page states that current upgrades are handled by direct request.
- The authenticated Studio overview shows the current plan and usage against limits.
- Upgrade discovery is available from the Studio subscription card and the pricing page.
- No subscription record, tenant identifier, owner identifier, or other private tenant data is emitted by the public pricing route.

## Security decision

Commercial UI is presentation only. It does not grant entitlements.

The existing database trigger remains the final write boundary, and the authenticated subscription view resolves the tenant through the authenticated user's active membership before reading the subscription.

## Verification contract

Changed commercial behavior is protected by `src/lib/menu/commercial.test.ts`. The new test is included in `npm test`.

Full release verification remains the repository Quality Gate: typecheck, tests, lint, build, browser/template QA, and final diff review.

## Sources reviewed

- https://nasjmenu.sa/
- https://tablegreet.com/ar-sa/pricing
- https://tableqr.co/digital-menu/saudi-arabia-ar/
- https://e-menu.masarat.com.sa/
- https://menu1000.com/restaurants/
- https://tableqr.co/pricing/

These sources were used for market context only; Menu V3 pricing remains governed by its own verified database subscription catalog.
