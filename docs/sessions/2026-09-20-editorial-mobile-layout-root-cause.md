# 2026-09-20 — Editorial Mobile Layout Root-Cause Remediation

## Status

- Classification: public-menu Editorial visual regression / scoped redesign
- Implementation: IN_PROGRESS on branch `fix/editorial-mobile-layout-2026-09-20`
- Main: unchanged at `214dfdedf264ce6e6727dcaddfaedc0eb7f4d1e0`
- Production/Vercel: NOT TOUCHED
- Browser/device verification: BLOCKED until the branch can be rendered in a real browser environment

## Repository evidence

- `src/theme-editorial.css` defines the canonical Editorial presentation.
- `src/theme-editorial-hardening.css`, `src/theme-final-visual-hardening.css`, and `src/theme-qr-final-fixes.css` form successive final presentation layers.
- `src/theme-refinements-v2.css` contains broad legacy Editorial selectors affecting generic public-menu `header`, `main > section`, `main ul > li > button`, and first/last button children.
- `tests/theme-qr-final-fixes.test.mjs` already protects earlier Editorial geometry and QR fixes.
- PR #201 and PR #203 previously recorded Editorial fixes as verified by repository quality/browser contracts, but the supplied current-device screenshots are new runtime evidence that the visual defect still exists.

## Screenshot findings

The supplied Android screenshots show:

1. Featured product names/descriptions visibly clipped at the left edge.
2. Arabic and English product names can fragment or appear partially outside their intended text region.
3. Product price placement is visually detached from the title hierarchy.
4. Featured images occupy a stable visual block, but legacy mobile height/overflow rules can still compete with the current card geometry.
5. Fixed actions remain usable, but the Editorial content hierarchy is weakened when product text is clipped.
6. The same failure pattern appears in both Arabic RTL and English LTR, so this is not an Arabic-only content problem.

## Root-cause conclusion

### VERIFIED

- `theme-refinements-v2.css` applies generic `overflow: clip` to Editorial `main > section` and public-menu buttons.
- The same legacy layer applies a forced first-child height to mobile public-menu buttons.
- `theme-qr-final-fixes.css` previously forced Editorial product names to `direction: rtl`, which is unsafe for English values.
- The current featured-card metadata is implemented as a direction-sensitive grid without a dedicated metadata wrapper.

MDN documents that `overflow: clip` clips overflowing content and can make clipped interactive content unreachable; it also documents that `direction` affects grid column flow and that `unicode-bidi: plaintext` can calculate directionality from the text itself. These behaviors are directly relevant to the observed failure.

## Implementation

The branch adds a final scoped Editorial visual architecture layer that:

- removes clipping from Editorial selection/category containers and featured cards;
- lets featured media own a deterministic `4 / 3` aspect ratio instead of inheriting forced mobile heights;
- gives featured metadata an explicit, stable grid;
- separates index, title, price, and description into predictable regions;
- makes title/description direction content-aware with `unicode-bidi: plaintext`;
- stops forcing Editorial product names into RTL;
- keeps existing ordering/cart/Quick Add/details behavior unchanged;
- adds regression contracts for the new layout.

## Connected tools actually used

- GitHub: repository state, code search, source files, PR/history, branch/diff evidence.
- Agent Spot: discovered `Fix My UX` as a relevant external visual-audit option; pricing/capability execution was not assumed.
- Font Pairing: evaluated the existing Editorial typography direction.
- Color Designer: evaluated the existing Editorial palette without changing it.
- Agent Ready: scanned the current public site; result was `39/100` agent-readability with accessibility `82`. This is web-readability evidence, not proof of the Editorial visual defect.
- Grow My Website: scanned the public site; result `79/100`, with SEO metadata/canonical/OG/structured-data issues reported.
- MDN: reviewed `direction`, `unicode-bidi`, CSS Grid writing modes, logical properties, and `overflow` behavior.

## Verification

- VERIFIED: branch created from current `main`.
- VERIFIED: branch is ahead of main by 2 implementation/test commits; no unrelated application files changed.
- VERIFIED: structural checks for the new CSS/test contracts pass against the branch file contents.
- UNKNOWN/BLOCKED: full `npm test`, typecheck, lint, build, Playwright, and real-device browser QA were not run because this environment cannot clone/install the repository runtime, and no Vercel Preview deployment was intentionally triggered.

## Exact next action

Render branch `fix/editorial-mobile-layout-2026-09-20` at a real mobile viewport and verify Arabic RTL + English LTR with long/short product names, descriptions, prices, missing images, featured items, regular category items, Quick Add, product dialog, cart, and safe-area fixed actions. Only after that evidence should this branch be considered ready for the normal PR/quality/release workflow.
