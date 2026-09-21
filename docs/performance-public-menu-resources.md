# W12-02 — Public Menu Resource & Bundle Efficiency

## Status
- Status: CLOSED / VERIFIED for the current low-risk resource-efficiency slice.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.

## Objective
Reduce avoidable public-menu resource startup latency without changing the protected theme system, public-menu behavior, SSR hydration, tenant isolation, or runtime dependency graph.

## Evidence Review
- The production Quality Gate already measures resource transfer size, decoded size, resource count, JavaScript, images, fonts, cache behavior, LCP, CLS, and INP where supported through `scripts/performance-audit.mjs`.
- The public menu currently declares four Arabic and four Latin IBM Plex font weights through the verified Fontsource CDN contract in `src/typography.css`.
- The root document loads the typography stylesheet before the theme stylesheets, so the font CDN is a critical cross-origin dependency.
- The five protected theme stylesheets are intentionally scoped by `data-menu-theme`. They remain globally available because the existing preview/theme architecture depends on immediate theme switching; converting them to route-level or runtime stylesheet injection would introduce a first-paint/FOUC risk without deployment-specific evidence.

## Implemented
- Added a `preconnect` hint for `https://cdn.jsdelivr.net` with anonymous CORS mode in `src/routes/__root.tsx`.
- Added a matching `dns-prefetch` fallback for browsers that do not use `preconnect`.
- Added regression coverage in `scripts/quality-workflow.test.mjs` to ensure the connection hints remain before the typography stylesheet.

## Why This Is the Smallest Safe Change
MDN documents `preconnect` as a browser hint that can establish DNS/TCP/TLS work before a critical cross-origin request, and specifically notes that anonymous CORS resources such as fonts require `crossorigin` on the preconnect. `dns-prefetch` is retained as a lower-cost fallback. These hints are deliberately limited to the one third-party origin that supplies the verified critical fonts rather than warming multiple origins.

## Deliberately Not Changed
- No runtime dependencies.
- No theme CSS architecture.
- No dynamic stylesheet injection.
- No font preload for multiple weights; preloading too many fonts can compete with other critical resources.
- No arbitrary JavaScript/CSS size budget was introduced.
- No Supabase schema, cache, tenant, branch, or hydration behavior was changed.

## Verification
- Quality Gate run `34014895325` for the final implementation commit passed all repository steps.
- Verified steps: install, route generation, typecheck, tests, lint, production build, Playwright Chromium, all-theme Browser Template QA, performance baseline upload, and preview shutdown.
- The resource-efficiency contract test is part of the default test suite.

## Research Sources
- MDN — `rel="preconnect"`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect
- MDN — DNS prefetch performance guidance: https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/dns-prefetch
- MDN — `rel="preload"` and CORS-enabled font loading: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload

## Remaining Evidence Gap
- `UNKNOWN`: production real-user performance telemetry is not available in the repository, so the exact field-level real-user improvement from the connection hint cannot be quantified yet.
- Future bundle/resource work should be driven by the production build manifest and browser performance artifact rather than guessed thresholds.
