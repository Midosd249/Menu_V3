# G6 Performance + Media — Browser Measurement Gate

## Status
- G6: DONE / VERIFIED / CLOSED.
- Atomic milestone: reproducible browser performance measurement plus one low-risk, evidence-driven public-menu media optimization.
- Date: 2026-09-04.

## Verified Repository Evidence
- `src/components/public-menu.tsx` renders product media through `DishMedia`.
- Product images use native `loading="lazy"` and now use asynchronous decoding with low fetch priority for non-critical menu media.
- Existing product-media call sites provide explicit rendered dimensions through CSS classes.
- `src/styles.css` uses IBM Plex Sans Arabic with system fallbacks.
- No new runtime image/font dependency was introduced for G6.
- `scripts/quality-workflow.test.mjs` protects the lazy-loading and low-priority media contract and the CI performance gate.
- `scripts/performance-audit.mjs` uses the repository's existing Playwright dependency and measures the built public-menu preview at a mobile viewport.
- `.github/workflows/quality.yml` starts the existing production preview on `127.0.0.1:8081`, runs the performance audit, retains the JSON baseline as a 14-day CI artifact, then runs Browser Template QA.

## Captured Baseline
Successful GitHub Actions quality run: `33812307525`.
Artifact: `g6-performance-baseline`.

Measured production-preview baseline at 390×844:
- HTTP status: 200.
- FCP: 880 ms.
- CLS: 0.
- INP: no observed interactions; Event Timing API supported.
- Resources: 39.
- JavaScript: 9 requests / 16,785 transfer bytes / 45,974 decoded bytes.
- Images: 6 requests / 1,465,595 transfer bytes / 1,463,795 decoded bytes.
- Fonts: 0 requests / 0 bytes.
- Document images: 17; all 17 retain native lazy loading.
- Observable cached resources: 0 in the clean CI browser profile.
- LCP: not exposed in the captured headless run; therefore no numeric LCP claim is made.

The measurements identify image transfer as the dominant initial transfer class. Because the repository does not currently own an image-processing pipeline and Supabase Storage remains the media source of truth, G6 applies only the safe client-side scheduling/decoding optimization rather than speculative URL rewriting or a new runtime image library.

## Optimization Applied
- `DishMedia` keeps `loading="lazy"`.
- Added `decoding="async"` to prevent image decoding from unnecessarily competing with main-thread rendering.
- Added `fetchPriority="low"` so below-the-fold menu media does not compete with critical navigation/rendering work.
- Header logo uses `decoding="async"` without forcing low priority because it is part of the visible header.

This is intentionally a scheduling optimization; it does not claim to reduce the intrinsic image file sizes. A future image-size optimization requires measured, supported media transformation behavior in the production storage/CDN path.

## Verification
- GitHub Actions run `33812307525`: SUCCESS.
- Typecheck: PASS.
- Tests: PASS.
- Lint: PASS (warnings only; no errors).
- Production build: PASS.
- Playwright Chromium installation: PASS.
- Browser performance measurement: PASS.
- Browser Template QA mobile/tablet/desktop: PASS.
- Performance baseline artifact upload: PASS.

## Unknown / Blocked
- **UNKNOWN:** production Vercel CDN/cache measurements until a successful deployment can be measured.
- **UNKNOWN:** exact image-size savings from future Supabase transformations because no production transformation path was assumed or introduced.
- **BLOCKED:** Vercel provider deployment remains affected by the existing `build-rate-limit`; this does not invalidate the local production-preview gate.

## Guardrails
- G1–G5 behavior, routing, SEO, auth, tenant isolation, ordering, and menu-data contracts remain unchanged.
- No new image/font/runtime dependency was added.
- No hard numeric performance budget was guessed.
- Performance output contains timing and transfer metrics only; it does not log menu/customer content or credentials.

## G6 Closure
G6 is closed because the browser measurement gate is reproducible, the baseline is retained as a CI artifact, the measured dominant transfer class was identified, one low-risk media scheduling optimization was implemented, and the full quality pipeline passed.
