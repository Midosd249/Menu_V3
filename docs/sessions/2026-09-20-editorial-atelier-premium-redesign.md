# 2026-09-20 — Editorial Atelier Premium Redesign

## Status
- Classification: public-menu theme replacement / visual architecture cleanup.
- Main baseline: `5f7932df3cdf212cbf2f154b65c9c8abdf7cc2c2`.
- Branch: `redesign/editorial-atelier-premium-2026-09-20`.

## Evidence
The supplied Android screenshots show persistent Editorial defects: clipped/fragmented Arabic names, narrow title columns, detached prices, and fixed actions competing with content.

## Research
Current Arabic hospitality references emphasize readable bilingual hierarchy, stable price placement, food-led imagery, and restrained premium material systems. citeturn6search0turn6search1turn6search2turn6search4

## Decision
Replace the accumulated Editorial presentation with **Atelier** while keeping ThemeKey `editorial` and the existing `contemporary-restaurant` renderer.

## Architecture
- Added `src/theme-editorial-atelier.css` as the new presentation owner.
- Removed `src/theme-editorial.css` and `src/theme-editorial-hardening.css`.
- Removed Editorial selectors from shared legacy presentation layers.
- No changes to auth, DB/RLS, orders, analytics, tenant/branch isolation, SEO architecture, or deployment configuration.

## Verification plan
1. GitHub Quality: typecheck, tests, lint, build, Playwright/browser QA.
2. Real Android: repeat the exact failing Arabic/English states.
3. Verify Quick Add, product options, cart, fixed-action safe area, search, categories, branches, hours, and configured external actions.
4. Review final diff.
5. Only then PR/merge/release.

## Exact next task
Run repository Quality/browser checks for this branch and inspect the resulting visual evidence.



## Closeout — 2026-09-20
- Status: CLOSED / VERIFIED / MERGED for repository implementation.
- Merge commit: `bff4a03be234f3d011f35c935cc0ee57746b5a2d`.
- PR: #221.
- Quality: run `35490043010`, retry attempt 2, SUCCESS.
- W9 Orders QA: run `35489610007`, SUCCESS.
- Review: no unresolved review threads.
- Vercel: GitHub status SUCCESS for the merged implementation commit; Production identity remains UNKNOWN.
- Device: physical Android/iOS QA remains UNKNOWN / external.
- Exact next task: physical Android QA of merged Atelier Editorial using the owner's failing Arabic/English cases and the public-menu/QR/order interaction matrix.
