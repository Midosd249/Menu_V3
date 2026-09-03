# TASKS

## Current Section
- **G7 — Analytics, Search Console, Growth, Rollout: TODO.**

## Unified Queue
1. **G4 — Arabic/English SEO Architecture:** DONE / VERIFIED / CLOSED.
2. **G5 — Template Ecosystem Expansion:** DONE / VERIFIED / CLOSED.
3. **G6 — Performance + Media:** DONE / VERIFIED / CLOSED.
4. **G7 — Analytics, Search Console, Growth, Rollout:** TODO.

## G6 Closure Evidence
- DONE / VERIFIED: audited public-menu media and preserved native `loading="lazy"`.
- DONE / VERIFIED: added `decoding="async"` and `fetchPriority="low"` to non-critical product media.
- DONE / VERIFIED: added a regression test protecting the media scheduling contract.
- DONE / VERIFIED: added reproducible browser performance measurement using the existing Playwright dependency and local production preview.
- DONE / VERIFIED: CI quality run `33812307525` passed typecheck, 76 tests, lint, production build, browser measurement, artifact upload, and mobile/tablet/desktop Browser Template QA.
- DONE / VERIFIED: captured and retained the first baseline artifact `g6-performance-baseline`.
- DONE / VERIFIED: baseline identified image transfer as the dominant initial transfer class: 1,465,595 bytes across 6 image requests in the clean CI browser profile.
- DONE / VERIFIED: no new runtime image/font dependency or speculative storage URL transformation was introduced.
- BLOCKED: Vercel provider `build-rate-limit` prevents provider-specific CDN/cache measurement; local CI measurement is sufficient for G6 closure.

## Exact Next Task
- **G7 Analytics, Search Console, Growth, Rollout:** audit the existing analytics/search-console/growth surfaces, identify the first atomic rollout task, and verify it without changing completed G1–G6 contracts.
