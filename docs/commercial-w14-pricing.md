# W14 — Pricing, Packaging, and Commercial UX

## Objective

Make Menu V3 commercially legible without inventing payment capabilities, gating the protected theme catalog, exposing private tenant data, or changing the existing public-menu architecture.

## Repository evidence before PH-06

The existing subscription foundation was already the source of truth for plan limits and prices, but its configured catalog had drifted from the owner-approved commercial decision. PH-06 reconciles the catalog while preserving the existing architecture and server-side entitlement boundary.

## Canonical commercial decision — PH-06

- `free`: 0 SAR/month, 0 SAR/year, 1 branch, 20 products, 2 team members, no trial.
- `starter` / customer-facing **Growth**: 49 SAR/month, 490 SAR/year, 3 branches, 300 products, 10 team members, 14-day trial.
- `pro`: 149 SAR/month, 1,490 SAR/year, 10 branches, unlimited products, 25 team members, 14-day trial.
- Annual paid pricing is two months free versus twelve monthly payments: 16.67% savings.
- The five protected themes remain available across plans; PH-06 does not introduce a theme entitlement gate.

## Annual billing contract

`tenant_subscriptions.billing_interval` is the server-side interval contract and is limited to `monthly` / `annual`.

Annual pricing is resolved from the same commercial catalog used by the pricing UX. Invoices snapshot `billing_interval` and `amount_sar` at issuance, so later plan/catalog changes cannot rewrite historical invoice amounts.

Existing PH-05 invoices are preserved as monthly historical snapshots.

## Trial contract

- Free is never `trialing` and has no `trial_ends_at`.
- Paid plans may be `trialing` for 14 days after paid-plan selection.
- Platform Admin trial controls remain restricted to paid plans and validated future timestamps.
- PH-06 does not introduce automatic post-trial charging.

## Payment boundary

PH-06 defines a provider-neutral server-side payment contract only. The server derives plan, interval, and amount from the canonical catalog. Client-supplied amount, tenant identity, entitlement, and payment state are never trusted.

No payment provider, checkout session, automatic charging, webhook, or payment-success state is introduced by PH-06.

## Security decision

Commercial UI is presentation only. It does not grant entitlements.

The database entitlement boundary remains the final write boundary. Pro product creation is explicitly unlimited at the database/server entitlement layer; branch and team-member limits remain enforced from the plan catalog.

## UX decision

- `/pricing` is public, bilingual, and explicit about monthly versus annual pricing.
- Annual pricing communicates the two-month saving without implying a payment gateway exists.
- The page states that online payment is not enabled yet and does not show a fake checkout.
- Authenticated Platform Admin subscription controls expose the billing interval through a server-authorized mutation.
- Public pricing does not emit private tenant identifiers or subscription state.

## Verification contract

Changed commercial behavior is protected by:
- `src/lib/menu/commercial.test.ts`
- `src/lib/menu/billing.test.ts`
- `src/lib/menu/payment-boundary.test.ts`
- `tests/ph-06-commercial-activation.test.mjs`

Full release verification remains the repository Quality Gate: route generation, typecheck, tests, lint, production build, browser/template QA, security/auth checks, migration safety, and final diff review.

## External authoritative research

- ZATCA official VAT information confirms the standard VAT rate is 15% for applicable taxable supplies in Saudi Arabia. This is relevant to future tax-invoice/payment implementation but is deliberately **not** converted into PH-06 payment logic or tax claims. citeturn0search0turn0search12

## Market-context sources reviewed previously

- https://nasjmenu.sa/
- https://tablegreet.com/ar-sa/pricing
- https://tableqr.co/digital-menu/saudi-arabia-ar/
- https://e-menu.masarat.com.sa/
- https://menu1000.com/restaurants/
- https://tableqr.co/pricing/

These sources are market context only. Menu V3 pricing is governed by the repository commercial contract above.


## 2026-09-19 — Commercial packaging refinement

- VERIFIED: Free is intentionally limited to 20 products and 2 team members.
- VERIFIED: Growth remains 49 SAR/month, 490 SAR/year, 3 branches, 300 products, 10 team members.
- VERIFIED: Pro remains 149 SAR/month, 1,490 SAR/year, 10 branches, unlimited products, 25 team members.
- PROPOSED / COMMERCIAL UX: feature differentiation is presented as Free → Growth → Pro, with Free focused on menu basics, Growth on Intelligence/Growth/CRM capabilities, and Pro on cross-branch and advanced growth/AI capabilities.
- IMPORTANT: server/database entitlement enforcement remains authoritative; feature-copy changes do not create client-side authorization.
