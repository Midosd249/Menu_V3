# R8.4 — Evidence-based Upsell + R8.5 — Restaurant Discovery

Date: 2026-09-13
Status: IMPLEMENTATION_IN_PROGRESS
Base: `5007c696179d09820418839a06cd2da3f4713a18`

## Scope

R8.4 and R8.5 are implemented as a single repository milestone without changing R6/R7 semantics or rebuilding completed intelligence features.

## R8.4 — Evidence-based Upsell

- Candidate evidence uses real product-view sessions from `menu_events`.
- Basket evidence uses real submitted orders from `orders` + `order_items`, split into non-cancelled basket co-occurrence and completed-order co-occurrence.
- Weak evidence is filtered before owner review.
- Candidate pairs are deterministic and tenant/branch scoped.
- Owner approval is explicit and server-authorized.
- Approved recommendations are stored separately from menu content; they do not mutate products.
- Public exposure is limited to owner-approved, currently available pairs.
- Public impressions/clicks are recorded as observational `menu_events`.
- Owner measurement reports impressions, clicks, and subsequent pair-containing orders for the last 30 days.
- No causal or statistical significance claim is made.

## R8.5 — Restaurant Discovery

- Existing public branch routes remain canonical discovery URLs.
- Published active branches remain sitemap entries.
- Arabic/English alternate sitemap links remain reciprocal.
- Public menu SEO now exposes a structured `Restaurant` plus nested `Menu` / `MenuSection` / `MenuItem` representation.
- Available menu items expose visible price, currency, availability, descriptions, and calories when present.
- Branch-local business markup remains conditional on verified Saudi location data; no location is invented.
- Canonical and robots behavior remains locale/preview aware.
- Existing `robots.txt` continues to advertise `/sitemap.xml` and protect private Studio/admin paths.
- No `llms.txt` was added because current Google documentation does not require it for Search; AI readability is improved through crawlable page content and structured data instead.

## Research basis

Primary references reviewed:

- Google Search Central — LocalBusiness structured data.
- Google Search Central — canonicalization and sitemap guidance.
- Google Search Central — Search appearance / AI features guidance.
- Schema.org — Restaurant, Menu, MenuSection, MenuItem and Offer.
- Toast — online ordering upsell and menu pairing workflows.
- Square — digital menu and online-order discovery practices.

## Protected boundaries

- No automatic menu mutation.
- No automatic upsell activation.
- No price invention.
- No tenant/branch bypass.
- No auth or subscription weakening.
- No synthetic traffic.
- R7 remains open and non-blocking.
- Vercel is not used as the development loop.

## Verification target

Required before merge:

- route generation
- typecheck
- tests
- lint
- production build
- Playwright/browser quality gates
- SEO contract tests
- migration consistency review
- diff review
