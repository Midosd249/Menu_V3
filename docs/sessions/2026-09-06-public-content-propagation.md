# Session — 2026-09-06 — Public Content Propagation + Typography Decision

## Current Position
P0-01 canonical content audit and P0 public-content propagation are closed and verified. The next design workstream, W6 Typography Evidence & Decision, has also been completed as a decision-only task. Production typography implementation remains intentionally separate.

## Completed Tasks
1. Runtime verification of public-content propagation, including migration application, representative Owner mutations, revision isolation, cache-key versioning, regression coverage, and repository quality gates.
2. Evidence-based Arabic-first typography decision for Menu V3.

## P0 Evidence
- Live Supabase project verified as `ublxptcqefujkbeepylc`, canonical Menu V3 schema `menu_v3`.
- `menu_v3.tenants.public_content_version` exists in the live database.
- Revision triggers exist for tenants, branches, branch hours, categories, products, product variants, modifier groups, modifier options, and product-modifier links.
- Trigger functions explicitly qualify `menu_v3` and use a controlled `search_path`.
- Representative live Owner-side tenant, branch, and product mutations advanced the published tenant revision.
- Separate tenant revision state remained isolated during the live mutation checks.
- `src/lib/menu/public.ts` versions the process-local cache key by tenant, branch, and revision.
- `src/components/public-menu.tsx` has no browser menu-content cache; `src/lib/menu/session.ts` uses browser storage only for anonymous analytics session identity.
- Canonical migration was corrected to explicitly target `menu_v3`; live repair migration was applied successfully.
- GitHub Actions Quality run `34007481599` completed successfully. Route generation, typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA, performance baseline upload, and cleanup all passed.

## Typography Decision Evidence
- Repository inventory found no explicit named typography dependency that must be preserved.
- Eight candidates were evaluated: IBM Plex Sans Arabic + IBM Plex Sans, Noto Sans Arabic + Noto Sans, Tajawal, Mada, Amiri, Noto Kufi Arabic, Lemonada, and Changa.
- Authoritative/open-source sources were checked for licensing and technical/family characteristics.
- **Selected default:** IBM Plex Sans Arabic + IBM Plex Sans.
- **Alternate 1:** Noto Sans Arabic + Noto Sans.
- **Alternate 2:** Tajawal.
- IBM Plex was selected because it provides a coherent Arabic/Latin family, explicit Arabic support, UI-oriented design, OFL-1.1 licensing, and official web WOFF/WOFF2/subset delivery options.
- Noto remains the strongest coverage/resilience alternate, with official Noto guidance recommending the Arabic UI variant for constrained interface elements.
- Tajawal remains the strongest characterful MENA-oriented alternate.
- Amiri, Mada, Noto Kufi Arabic, Lemonada, and Changa remain useful specialized candidates for editorial/display use cases, not the universal system default.
- The IBM npm package was explicitly rejected for this implementation path because its package documentation includes telemetry; the implementation should use official web assets/licensing directly if self-hosting is adopted.

## Decision Boundary
- No application code was changed for typography.
- No theme architecture was changed.
- No database/schema/dependency/deployment change was made.
- The next implementation must self-host/subset the smallest required IBM Plex Arabic/Latin weights, preserve semantic typography roles, and benchmark real Menu V3 Arabic/English/mixed content before broad rollout.

## Documentation
- `docs/design-intelligence.md` now contains the complete typography decision, evidence, candidate matrix, rejection criteria, benchmark content, and smallest next implementation task.
- `PROJECT_STATE.md` records W6 Typography Decision as CLOSED / VERIFIED and names W6-01 as the next atomic task.
- `TASKS.md` records W6 as closed and W6-01 as the sole current task.
- `PLAN.md` remains the active roadmap and the typography decision is now a verified prerequisite for implementation.

## Verification Status
- Typography evidence and licensing decision: VERIFIED.
- Candidate comparison: VERIFIED.
- Final selection: VERIFIED as a design decision.
- Runtime font payload/CLS/visual fit: UNKNOWN until W6-01 implementation benchmark.
- Direct authenticated Owner UI -> Public HTTP response cache behavior: UNKNOWN; interactive authenticated browser surface is unavailable in this environment.

## Exact Next Task
W6-01 — Typography Implementation: introduce IBM Plex Sans Arabic + IBM Plex Sans as the shared typography foundation, self-hosted and subsetted, without changing theme architecture. Run typecheck, tests, lint, build, applicable browser/template QA, and typography/performance inspection; then update continuity files and stop.
