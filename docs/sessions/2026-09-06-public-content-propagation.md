# Session — 2026-09-06 — Public Content Propagation

## Current Position
P0-01 canonical content audit is closed. P0 public-content propagation is now closed and verified by live database evidence plus the repository Quality workflow.

## Completed Task
Runtime verification of the public-content propagation mechanism, including migration application, representative Owner mutations, revision isolation, cache-key versioning, regression coverage, and repository quality gates.

## Evidence
- Live Supabase project verified as `ublxptcqefujkbeepylc`, canonical Menu V3 schema `menu_v3`.
- `menu_v3.tenants.public_content_version` exists in the live database.
- Revision triggers exist for tenants, branches, branch hours, categories, products, product variants, modifier groups, modifier options, and product-modifier links.
- Trigger functions explicitly qualify `menu_v3` and use a controlled `search_path`.
- Representative live Owner-side tenant, branch, and product mutations advanced the published tenant revision.
- Separate tenant revision state remained isolated during the live mutation checks.
- `src/lib/menu/public.ts` versions the process-local cache key by tenant, branch, and revision.
- `src/components/public-menu.tsx` has no browser menu-content cache; `src/lib/menu/session.ts` uses browser storage only for anonymous analytics session identity.
- Canonical migration was corrected to explicitly target `menu_v3`; live repair migration was applied successfully.
- GitHub Actions Quality run `34007481599` for commit `a43052b0f1c2ce8c64a00c852dd30f863783aa95` completed successfully. Route generation, typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA, performance baseline upload, and cleanup all passed.
- The focused `scripts/public-menu-cache.test.mjs` regression test passed in CI after the lint correction.

## Security / Compatibility
- Existing authorization and active/published gates were not changed.
- Tenant scope is derived from trusted database relationships inside triggers.
- Cache semantics remain process-local with the existing 15-second TTL; revisioning provides correctness across content changes without a second invalidation mechanism.
- No dependency, theme, deployment, or unrelated refactor was introduced.

## Verification Status
- Database migration: VERIFIED.
- Runtime revision propagation: VERIFIED.
- Tenant isolation: VERIFIED for the revision mechanism.
- Cache-key contract: VERIFIED.
- Browser content-cache absence: VERIFIED.
- Typecheck: VERIFIED by CI.
- Tests: VERIFIED by CI.
- Lint: VERIFIED by CI.
- Production build: VERIFIED by CI.
- Browser template QA: VERIFIED by CI.
- Direct authenticated Owner UI -> Public HTTP response cache behavior: UNKNOWN; interactive authenticated browser surface is unavailable in this environment.

## Exact Next Task
W6 — Typography Evidence & Decision. Make the production Arabic-first typography decision from repository usage, authoritative font/licensing evidence, Arabic/Latin readability, numerals/SAR, mixed bidi, performance, and the existing design-system contract. No production typography implementation until the decision is documented.
