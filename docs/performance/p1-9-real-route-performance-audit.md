# P1.9 — Real-Route Performance Evidence Audit

**Date:** 2026-10-04  
**Status:** `VERIFIED_LOCAL_BUILD_PARTIAL`  
**Branch:** `perf/p1-9-real-route-evidence-2026-10-04`  
**Scope:** measurement and evidence only; no production deployment, schema, auth, or UI behavior change.

## Decision

The local production build is healthy, but the P1.9 acceptance budget is **not claimable as passed**. The representative public-menu route exceeds the request budget and client-transition budget, while production-host, real-device, and runtime query-plan evidence are unavailable in this sandbox.

No speculative optimization was retained. A trial of the officially supported TanStack Start option `router.autoCodeSplitting` produced identical build assets, HTML preloads, and waterfall counts, so it was reverted rather than presented as an improvement.

## Measurement protocol

- Build: `npm run build` (passed; full Nitro/Vercel build, including PGlite assets).
- Runtime: `npx vite preview --host 0.0.0.0 --port 8081` serving the completed build.
- Browser: local system Chromium driven by Playwright; 390×844 viewport; five runs per route.
- Warm-cache control: a fresh page per run; no attempt to manufacture a warm-cache result.
- Routes:
  - `/m/nafas` (Arabic public menu)
  - `/m/nafas?lang=en` (English public menu)
  - `/m/nafas/olaya` (representative branch route)
- Interaction: click the real `EN` language button on `/m/nafas` and wait for the URL transition.
- Captured: request events, failed requests, console errors, DCL/load timing, resource timing, CSS/JS/image/font counts, long tasks, CLS, and transition request count/duration.

Development-server measurements were discarded from the budget decision because Vite HMR module requests inflate the route graph. They remain relevant only as a diagnostic signal; the numbers below are from the production preview.

## Results (5 runs per route)

| Route | Initial requests (median) | DCL median / p75 | Load median / p75 | JS transfer median | CSS requests | Images | Fonts | Failed requests | Console errors |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/m/nafas` | 101 | 2,624 / 2,908 ms | 2,625 / 4,697 ms | 46,903 B | 18 | 10 | 8 | 0 | 0 |
| `/m/nafas?lang=en` | 104 | 2,199 / 2,468 ms | 3,051 / 3,511 ms | 46,903 B | 18 | 8 | 8 | 0 | 0 |
| `/m/nafas/olaya` | 102 | 2,266 / 2,271 ms | 3,466 / 3,586 ms | 46,903 B | 18 | 8 | 5 | 0 | 0 |

### Client transition

Arabic `/m/nafas` → English via the real language control:

- 5/5 transitions changed the URL to `/m/nafas?lang=en`.
- Requests: **9 every run**.
- Duration: **1,064–1,083 ms**, median **1,074 ms**.
- No failed requests or console errors.

This does not meet a strict `<8` transition-request budget; the result is **FAILED against that budget**, while functional correctness is verified.

### Core Web Vitals and runtime evidence

- CLS: `0` in all captured samples.
- Long tasks: `0` captured in all samples.
- LCP: `UNKNOWN` in this harness; the browser did not expose a usable LCP entry during the capture window. It is not reported as a pass.
- Production-host latency: `UNKNOWN`; localhost preview is not a production-host measurement.
- Real-device measurements: `UNKNOWN`; no physical-device or remote-device harness is available here.
- Runtime `EXPLAIN (ANALYZE, BUFFERS)` / query-plan evidence: `UNKNOWN`; no authorized production/staging database connection was available. No index or query change is justified from this run.

## Root-cause evidence

The built HTML for `/m/nafas` contained **28 `modulepreload` links**. The generated route tree imports all top-level and nested route files, including Admin and Studio routes. A representative preview waterfall reached approximately 100 initial requests, with many route-graph JavaScript resources plus 18 CSS resources. This is a concrete route-graph cost, not a Vite-HMR artifact.

The repository already has route-level source organization, but this build did not produce a measurable reduction when the supported `tanstackStart({ router: { autoCodeSplitting: true } })` option was trialled. The build output and asset names remained unchanged, so the option was removed. Any deeper route-graph refactor needs a separate, explicitly scoped implementation and regression review; it should not be smuggled into a measurement milestone.

## Acceptance matrix

| Evidence category | Result | Claim allowed |
|---|---|---|
| Representative public route | Captured locally on production preview | Yes, local only |
| Branch route | Captured locally on production preview | Yes, local only |
| Arabic → English transition | 9 requests, ~1.07 s | Functional pass; budget fail |
| Request budget `<15` | 101–104 initial requests | **Fail** |
| Transition budget `<8` | 9 requests | **Fail** |
| LCP budget | Not observable in harness | **Unknown** |
| CLS budget | 0 | Local pass |
| Long-task budget | 0 | Local pass |
| Production host | Not available | **Unknown** |
| Real device | Not available | **Unknown** |
| Query plan/runtime DB | Not authorized/available | **Unknown** |

## Verification performed

- `npm run build` — passed.
- Preview readiness for `/m/nafas` — HTTP 200.
- Five-run Chromium capture on each representative route — completed.
- Failed-request count — zero across all route samples.
- Console errors — zero across all production-preview route samples.
- Git diff review — only this audit document is retained for the focused P1.9 evidence PR.

## Sources

- TanStack Start routing: https://tanstack.com/start/latest/docs/framework/react/guide/routing
- TanStack Router automatic code splitting: https://tanstack.com/router/latest/docs/guide/automatic-code-splitting
- TanStack Router code splitting: https://tanstack.com/router/latest/docs/guide/code-splitting
- TanStack Router Vite installation: https://tanstack.com/router/latest/docs/installation/with-vite
- Vite production build and chunking: https://vite.dev/guide/build
- PostgreSQL EXPLAIN: https://www.postgresql.org/docs/current/using-explain.html
- Supabase query optimization: https://supabase.com/docs/guides/database/query-optimization

## Exact next step

Do not mark P1.9 `DONE`. The next performance slice should be a separately reviewed route-graph reduction: identify why non-public route chunks are emitted/preloaded for the public menu, then re-run this exact five-run protocol. Production-host, real-device, and query-plan gates remain separate evidence requirements.
