# P1.8 — Performance Gates Audit

**Date:** 2026-10-03  
**Branch:** `perf/p1-8-performance-gates-2026-10-03`  
**Implementation head:** `dfbecb52d765169668c48184215f24a031719a48`  
**Status:** CLOSED / VERIFIED — measurement infrastructure extended; no numeric runtime budget enforced

## Scope

P1.8 turns the existing performance targets into repeatable evidence without inventing thresholds. The existing Playwright audit now records:

- initial navigation request count captured from Playwright request events
- DOMContentLoaded/load timing
- document transfer/encoded/decoded HTML bytes
- JS, image, font, and CSS transfer/request evidence
- long-task count and main-thread blocking duration where supported
- optional client-side transition evidence via `PERFORMANCE_AUDIT_TRANSITION_SELECTOR`
- LCP/CLS/INP fields when the browser exposes them

The gate remains report-only for numeric budgets. This is intentional: the repository now has repeatable measurements, but production-equivalent route-specific baselines are not yet sufficient to justify hard thresholds.

## Verified CI Evidence

GitHub Quality run **#2860** passed all available quality stages, including:

- typecheck
- full test suite
- contract suites
- lint
- production build
- browser template QA
- Menuun brand browser QA
- golden 30-product performance fixture
- Studio browser QA
- Platform Admin browser QA
- browser performance baseline upload

GitHub W9 Orders QA **#979** also passed.

### Controlled preview measurement

Artifact: `g6-performance-baseline`

- HTTP status: 200
- viewport: 390×844
- initial requests: **103**
- resource entries: **102**
- DOMContentLoaded: **771.7ms**
- load event: **1291.2ms**
- first paint: **776ms**
- first contentful paint: **776ms**
- LCP: **UNKNOWN/null in this headless measurement**
- CLS: **0**
- long tasks: **0**
- JS: 40 requests / 48,957 transferred bytes
- images: 10 requests / 698,815 transferred bytes
- fonts: 6 requests / 226,752 transferred bytes
- HTML: 1 request / 6,661 transferred bytes
- client transition: **NOT CONFIGURED**

This preview route is not treated as proof that the public-menu request target is met or missed; it is a controlled evidence point for the existing preview harness.

### Golden 30-product fixture

Artifact: `phase6-golden-performance-baseline`

Current canonical fixture:

- initial requests: **32**
- resource entries: **31**
- DOMContentLoaded: **28.4ms**
- load event: **29.3ms**
- first paint / first contentful paint: **44ms**
- LCP: **UNKNOWN/null in this headless measurement**
- CLS: **0**
- long tasks: **0**
- document transfer: **20,587 bytes**
- image requests after full scroll: **31**
- initial image requests before full scroll: **10**

The fixture is useful for regression comparison but is not a production-network benchmark.

## Decisions

1. **No numeric CI budget was added.** The current evidence spans different controlled fixtures and does not yet establish a production-equivalent baseline for every target.
2. **No caching was added.** P1.8 is measurement/gating infrastructure, not a cache design task.
3. **No bundle/chunk configuration was changed.** P1.7 already established that speculative manual chunking is not justified.
4. **No runtime/auth/RLS/database/schema behavior was changed.**
5. **Client transition measurement is supported but remains UNKNOWN until a real transition selector/flow is configured in the harness.**
6. **LCP remains UNKNOWN in the current headless environment.** It is recorded as nullable rather than fabricated.
7. **Existing DB/API evidence from P1.5/P1.6 remains the source for representative server-side query measurements; P1.8 does not duplicate those reads without a new measurement need.**

## Research Basis

Playwright documents request/response event instrumentation for browser network measurement. The Long Tasks API exposes UI-thread tasks of 50ms or more, but browser support is not universal; the audit therefore records support state rather than assuming availability.

## Acceptance

- [x] Repeatable initial request count captured.
- [x] DCL/load timing captured.
- [x] HTML/JS/CSS/image/font transfer evidence captured.
- [x] Main-thread long-task evidence captured where supported.
- [x] Optional client-transition measurement path implemented.
- [x] LCP/CLS/INP recorded without fabricating unsupported values.
- [x] Regression contract added to `scripts/quality-workflow.test.mjs`.
- [x] Quality #2860 passed.
- [x] W9 Orders QA #979 passed.
- [x] Final implementation diff is limited to measurement infrastructure/tests.
- [ ] Client-transition numeric baseline remains UNKNOWN.
- [ ] Production/real-device LCP remains UNKNOWN.
- [ ] Hard numeric budgets remain intentionally unintroduced.

## Exact Next Task

**P1.9 — Real-route performance evidence and budget decision**

Use the new measurement surface on representative public-menu and ordinary client-transition flows. Only after stable repeated evidence exists should hard numeric regression budgets be proposed.

Deployment: **NOT_PERFORMED**.
