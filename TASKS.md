# TASKS

## Current Section
- **G6 — Performance + Media: IN_PROGRESS.** Initial evidence-based audit is complete and the first low-risk media performance guard is implemented.

## Unified Queue
1. **G4 — Arabic/English SEO Architecture:** DONE / VERIFIED / CLOSED.
2. **G5 — Template Ecosystem Expansion:** DONE / VERIFIED / CLOSED.
3. **G6 — Performance + Media:** IN_PROGRESS — initial audit and lazy-loading regression guard complete; next atomic task is reproducible browser performance measurement against the local production preview.
4. **G7 — Analytics, Search Console, Growth, Rollout:** TODO.

## G6 Initial Milestone — IN_PROGRESS
- DONE / VERIFIED: audited current public-menu image rendering and confirmed product media uses native `loading="lazy"`.
- DONE / VERIFIED: audited font declaration and confirmed existing IBM Plex Sans Arabic/system fallback stack.
- DONE / VERIFIED: recorded production-transfer and cache behavior as UNKNOWN until measured rather than guessing.
- DONE / VERIFIED: added a quality regression guard in `scripts/quality-workflow.test.mjs` for the lazy-loading contract.
- DONE / VERIFIED: added `docs/G6_PERFORMANCE_AUDIT.md` with evidence, constraints, and measurement criteria.
- BLOCKED: Vercel provider build-rate-limit prevents current provider-based performance measurement.

## Exact Next Task
- **G6 Performance + Media:** build the reproducible browser performance measurement gate against the existing local production preview; measure LCP, CLS, INP where supported, JS transfer, image transfer/request count, font transfer, and observable cache behavior; then make one evidence-backed optimization.
