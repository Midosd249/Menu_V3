# Session — 2026-09-06 — W15 Growth, Analytics, and Experimentation

## Current position
W15 is CLOSED / VERIFIED on branch `w15-growth-analytics-experimentation`. Quality Gate `34053348446` passed all required steps. The branch is ready for merge after the continuity-state update receives its final gate.

## Objective
Turn existing verified analytics into a measurable growth loop without adding tracking infrastructure, weakening tenant isolation, or fabricating conversion data.

## Research first
Reviewed current product-analytics and experimentation guidance from Amplitude and Google Analytics. The implementation follows the repository's existing event model instead of importing a third-party SDK.

## Completed
- Added `src/lib/menu/growth.ts` with denominator-safe directional event ratios.
- Added `src/lib/menu/growth.test.ts` and included it in the default test suite.
- Upgraded `src/routes/studio/analytics.tsx` with a bilingual Growth Loop section and opportunity guidance.
- Preserved the existing four-event taxonomy: `visit`, `qr_scan`, `product_view`, `whatsapp`.
- Explicitly labeled event ratios as operational ratios rather than unique-user conversion rates.
- Added W15 evidence and experimentation policy in `docs/growth-w15-analytics-experimentation.md`.
- Advanced `PLAN.md`, `PROJECT_STATE.md`, and `TASKS.md` to W16 as the exact next task.
- Preserved dependency versions; the only package-script change is inclusion of the new growth test.

## Security / integrity
- No new analytics SDK.
- No IP or fingerprint collection.
- No new database migration.
- No cross-tenant aggregation.
- No client-only business truth.
- No fake A/B test.

## Experimentation decision
The current event schema has no experiment exposure/variant property. Therefore production A/B testing remains explicitly not-ready rather than pretending that client-side variant assignment is measurable. The first future experiment should be a reversible CTA hierarchy test once an exposure/variant contract exists.

## Verification
- Quality Gate `34053348446`: Install, route generation, Typecheck, Tests, Lint, Production build, Playwright Chromium, all-theme Browser Template QA, performance upload, and preview shutdown — PASS.
- Growth regression suite — PASS inside `npm test`.
- W14 regression suite — PASS inside `npm test`.

## Exact next task
W16 — QA, Browser/Device, and Release.
