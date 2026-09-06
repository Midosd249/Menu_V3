# Session — 2026-09-06 — W14 Pricing, Packaging, and Commercial UX

## Current position
W14 is CLOSED / VERIFIED on the milestone branch `w14-pricing-commercial-ux`. The branch is ready for merge to `main` after final review.

## Research first
A focused current market scan was completed before implementation across Saudi/MENA and global digital-menu products. The scan showed a wide price range and two useful commercial anchors: low-friction self-serve software and higher-priced managed/concierge service. Evidence and links are recorded in `docs/commercial-w14-pricing.md`.

## Objective
Implement the smallest evidence-backed commercial UX layer without reopening protected public-menu, theme, auth, authorization, tenant-isolation, or deployment foundations.

## Completed
- Added client-safe commercial catalog matching the verified database subscription plan values.
- Added bilingual public `/pricing` route with explicit operational limits.
- Kept all five protected themes available across plans; no artificial theme entitlement was introduced.
- Added authenticated Studio subscription summary with active-branch, item, and active-team usage against plan limits.
- Added regression tests for commercial catalog values and invariants.
- Added W14 commercial research/decision record.
- Updated `PLAN.md`, `PROJECT_STATE.md`, and `TASKS.md` to close W14 and advance the exact next task to W15.

## Files changed
- `src/lib/menu/commercial-catalog.ts`
- `src/lib/menu/commercial.ts`
- `src/lib/menu/commercial.test.ts`
- `src/routes/pricing.tsx`
- `src/routes/studio/index.tsx`
- `package.json`
- `docs/commercial-w14-pricing.md`
- `PLAN.md`
- `PROJECT_STATE.md`
- `TASKS.md`
- `docs/sessions/2026-09-06-w14-pricing-commercial-ux.md`

## Verification
- VERIFIED: GitHub Actions Quality run `34052577671` passed Install, route generation, Typecheck, Tests, Lint, Production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- VERIFIED: Vercel status for W14 head commit `d1bfd7ea1d7cbd225bde923850827cd25f80b064` is `success`.
- VERIFIED: commercial regression suite is included in `npm test`.
- VERIFIED: no new runtime dependency was introduced and the package manifest was restored to the repository baseline except for the new test entry.

## Known limits
- UNKNOWN: payment collection, automated billing, invoices, refunds, and webhook-driven subscription transitions are not implemented.
- UNKNOWN: no production conversion baseline exists yet for the new pricing surface.

## Exact next task
W15 — Growth, Analytics, and Experimentation.

Objective: turn the existing verified analytics and commercial surfaces into a measurable growth loop without weakening privacy, tenant isolation, performance, or the public-menu customer experience.
