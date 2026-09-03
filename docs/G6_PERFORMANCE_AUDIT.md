# G6 Performance + Media — Browser Measurement Gate

## Status
- G6: IN_PROGRESS.
- Atomic milestone: reproducible browser performance measurement against the local production preview.
- Date: 2026-09-04.

## Verified Repository Evidence
- `src/components/public-menu.tsx` renders product media through `DishMedia`.
- Product images use native `loading="lazy"`.
- Existing call sites provide explicit media dimensions through CSS classes.
- `src/styles.css` uses IBM Plex Sans Arabic with system fallbacks.
- No new runtime image/font dependency was introduced for G6.
- `scripts/quality-workflow.test.mjs` protects the lazy-loading contract and the CI performance gate.
- `scripts/performance-audit.mjs` uses the repository's existing Playwright dependency and measures the built public-menu preview at a mobile viewport.
- `.github/workflows/quality.yml` starts the existing production preview on `127.0.0.1:8081`, runs the performance audit, then runs Browser Template QA.

## Measurement Contract
The audit writes `.grok/performance-audit.json` and emits the same machine-readable JSON to stdout. It records:
- navigation timing
- LCP
- CLS
- INP support and observed interaction timing when available
- JavaScript request count and transfer/decoded bytes
- image request count and transfer/decoded bytes
- font request count and transfer/decoded bytes
- document image count and lazy-image count
- observable cache indicators based on Resource Timing transfer size
- first paint and first contentful paint

INP is recorded as unsupported/null when the browser does not expose Event Timing data. No guessed numeric performance budget is enforced by this gate.

## Unknown / Blocked
- **UNKNOWN:** the real production-preview baseline until CI or a local production-preview run produces `performance-audit.json`.
- **UNKNOWN:** provider-specific cache/CDN behavior until a successful Vercel deployment can be measured.
- **BLOCKED:** Vercel provider deployment is currently affected by the existing `build-rate-limit`; this does not block the local production-preview measurement gate.

## Guardrails
- Preserve G1–G5 behavior, routing, SEO, auth, tenant isolation, ordering, and menu-data contracts.
- Do not add image/font/runtime dependencies without measured evidence.
- Do not choose hard budgets before a real baseline is captured.
- Performance output contains timing and transfer metrics only; it does not log menu/customer content or credentials.

## Next Optimization Rule
After the first baseline is captured, choose exactly one highest-impact bottleneck supported by the measurements. Do not make speculative performance changes.
