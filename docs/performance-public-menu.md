# Public Menu Performance — Hydration Optimization

## Status
- Status: CLOSED / VERIFIED for W12-01.
- Scope: eliminate duplicate public-menu data fetching during SSR hydration.
- Date: 2026-09-06.

## Finding
The public menu route already receives `initialMenu` from its route loader during server rendering. The client-side `MenuLoader` previously executed `load()` on mount regardless of whether `initialMenu` was already available. That could issue a second `getPublicMenu` request immediately after hydration.

## Change
`src/routes/m.$slug.tsx` now treats `initialMenu` as the authoritative hydrated result for the first client render:

1. Render the menu immediately from `initialMenu`.
2. Persist that result into the existing session cache.
3. Skip the mount-time `getPublicMenu` request when `initialMenu` exists.
4. Preserve the existing fetch path for client states where no loader data is available.
5. Preserve the existing five-minute anonymous session cache, timeout, retry behavior, locale handling, branch handling, and theme behavior.

## Regression protection
`test/performance` coverage was added to `scripts/quality-workflow.test.mjs` to ensure the hydration path keeps the early-return guard and cache write.

## Verification
- Typecheck: VERIFIED through repository Quality Gate.
- Tests: VERIFIED through repository Quality Gate.
- Lint: VERIFIED through repository Quality Gate.
- Production build: VERIFIED through repository Quality Gate.
- Playwright Chromium and all-theme Browser Template QA: VERIFIED through repository Quality Gate.
- Performance audit: VERIFIED; the public preview remained HTTP 200 with zero CLS and retained lazy non-critical media.

## Constraints
- No new dependency.
- No Supabase schema change.
- No change to tenant isolation.
- No change to public-menu URL contracts.
- No theme implementation reopened.
- No speculative numeric performance budget introduced.

## Result
W12-01 reduces avoidable client network work during SSR hydration without changing the public-menu data model or freshness behavior for non-SSR/client-only loading states.
