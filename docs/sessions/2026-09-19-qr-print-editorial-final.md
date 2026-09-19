# 2026-09-19 — QR Printing + Editorial Typography + Theme Label Cleanup

## Status
- Implementation: DONE / VERIFIED
- Code merge: PR #203
- Main code merge commit: `d55c6c7b8cc18807b7a20982d803761d8180fc61`
- Production deployment: NOT PERFORMED
- Physical device QA: UNKNOWN

## Scope
1. Restore the QR single-print action.
2. Add multi-copy QR printing for the same branch/menu URL.
3. Finalize Editorial Arabic product title/number/description/price geometry.
4. Remove active decorative theme labels that were adding visual noise.

## Implementation evidence
- `src/routes/studio/qr.tsx`
  - print window opens directly from the click before `await import("qrcode")`;
  - single print remains available;
  - configurable 1–40 copy batch print, default 8;
  - 2×4 print sheet pagination;
  - same exact branch/menu URL is reused for every QR;
  - print labels are escaped before being inserted into the generated document.
- `src/theme-qr-final-fixes.css`
  - dedicated flexible Editorial title column;
  - product number remains separate;
  - price occupies its own row;
  - Arabic title uses normal word wrapping and `text-wrap: pretty`;
  - responsive geometry retained for small screens.
- Active decorative `NOIR / 03`, `N / 03`, and `ISSUE / 03` labels were removed from the active theme presentation layers.
- `tests/theme-qr-final-fixes.test.mjs`
  - QR print user-activation contract;
  - batch 2×4 sheet contract;
  - decorative-label absence contract.

## Verification
- Quality run `35407461902`: PASS.
  - route generation
  - typecheck
  - full tests
  - W7.4–W7.10 contract tests
  - lint
  - production build
  - Playwright/Chromium
  - all-theme browser QA
  - Studio browser QA
  - Platform Admin/W7.10 responsive browser QA
  - performance/diagnostic stages
  - cleanup
- W9 Orders QA run `35407461827`: PASS.
- PR #203 review threads: none unresolved.
- Main code commit verified: `d55c6c7b8cc18807b7a20982d803761d8180fc61`.

## Research
- MDN printing / `@page` / `break-inside` / `Window.open()` transient activation.
- MDN `overflow-wrap`, `word-break`, `text-wrap`, and CSS Grid `minmax()`.

## Remaining risk
- Physical Android/iOS QR scanning, print-preview behavior, and printer/PDF output are not directly verified.
- Current Vercel Production deployment identity for this merged main is UNKNOWN; no deployment was triggered.

## Exact next task
**Real-device production QA — execute the prepared Android/iOS/QR/theme/order/RTL smoke matrix on a physical device, including single QR print and multi-copy QR print-preview checks.**
