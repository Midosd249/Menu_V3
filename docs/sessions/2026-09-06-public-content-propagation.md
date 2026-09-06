# Session — 2026-09-06 — Public Content Propagation

## Current Position
P0-01 canonical content audit is closed. The concrete public-menu propagation gap is implemented and source-verified; runtime verification remains required.

## Completed Task
Implement the smallest architecture-compatible public-content propagation mechanism.

## Evidence
- Mapped all current Owner mutations in `src/lib/menu/owner.ts` that can affect public content.
- Confirmed those mutations write to `tenants`, `branches`, `branch_hours`, `categories`, `products`, `product_variants`, `modifier_groups`, `modifier_options`, or `product_modifier_groups`.
- Added `tenants.public_content_version` as a database-backed revision.
- Added database triggers for all public-menu mutation surfaces.
- Updated `src/lib/menu/public.ts` so the process-local cache key includes tenant, branch, and content revision.
- Confirmed there is no browser menu-content cache. `src/lib/menu/session.ts` uses `localStorage` only for anonymous analytics session identity.
- Added `scripts/public-menu-cache.test.mjs` for the cache/revision contract.
- Corrected `docs/canonical-content-publishing-audit.md` so the earlier browser-cache assumption is no longer part of the source of truth.

## Security / Compatibility
- Tenant scope is derived from trusted database relationships inside triggers.
- Existing public active/published gates are unchanged.
- Existing owner authorization is unchanged.
- Existing cache TTL remains 15 seconds; correctness is now determined by the database revision.
- No dependency, theme, deployment, or unrelated refactor was introduced.

## Verification
- Source inspection: VERIFIED.
- Mutation coverage: VERIFIED.
- Cache-key isolation: VERIFIED by source inspection.
- Browser content-cache absence: VERIFIED by source inspection.
- Local test execution: BLOCKED because outbound DNS/network access is unavailable in the current agent environment; no test pass is claimed.

## Remaining Runtime Verification
- Apply the migration to the intended database.
- Exercise tenant publish/brand change, category, product, branch/hour, variant/modifier, and product-modifier mutations.
- Confirm `public_content_version` increments once per committed mutation transaction as expected.
- Confirm a fresh public response is returned after a revision change.
- Confirm branch and tenant isolation.
- Run typecheck, tests, lint, build, and focused cache test in a network-enabled repository environment.

## Exact Next Task
P0 — Runtime verification of public-content propagation after Owner mutations, including migration application and cross-branch/tenant isolation.
