# G6 Performance + Media — Initial Audit

## Status
- G6: IN_PROGRESS.
- Atomic milestone: evidence-based performance audit and first targeted optimization guard.
- Date: 2026-09-04.

## Verified Evidence
- `src/components/public-menu.tsx` renders product media through `DishMedia`.
- Product images use native `loading="lazy"`.
- Existing call sites provide explicit media dimensions through CSS classes.
- `src/styles.css` uses IBM Plex Sans Arabic with system fallbacks.
- No new runtime dependency was introduced for G6.

## Unknown / Blocked
- Production font transfer size and preload behavior: UNKNOWN.
- Production JS/image transfer and cache behavior: UNKNOWN until measured against a successful provider deployment.
- Vercel provider deployment is BLOCKED by the existing build-rate-limit; repository CI remains the current verification source.

## First Targeted Optimization
A low-risk regression guard was added to `scripts/quality-workflow.test.mjs` to ensure below-the-fold product media keeps `loading="lazy"`. This protects the existing performance behavior without changing menu data, ordering, auth, tenant isolation, routing, or SEO.

## Measurement Gate
The next G6 step is a reproducible browser measurement gate for LCP, CLS, INP where supported, JS transfer, image transfer/request count, font transfer, and observable cache behavior. Numeric budgets will be chosen only after a real baseline is captured.

## Next Atomic Task
Build the browser performance measurement gate against the local production preview, then target the highest-impact bottleneck supported by evidence.
