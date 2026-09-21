# Focused Public UX Follow-up — 2026-09-21

## Status
- IMPLEMENTATION_IN_PROGRESS on `feat/focused-public-whatsapp-footer-2026-09-21`.
- Base: `main` at `91b7e8e6d6b3e5e9be2070a203c501b77bde7feb`.
- Scope: Essential/Noir Featured card information hierarchy, WhatsApp plan messaging, and duplicate brand-name removal from account signup.

## VERIFIED findings
- The shared Featured renderer already contained product title/price data, but the presentation contract was implicit and theme CSS depended on a fragile first-child section structure.
- The attached mobile evidence shows the failure mode where a light trailing card area can visually break a dark Featured card.
- Account signup collected `brandName`, while `/onboarding` collected the brand name again; server registration validation did not use `brandName`, and workspace provisioning already receives the canonical brand name from onboarding.

## Implemented
- Featured cards now use explicit title/price/copy classes.
- Essential and Noir own the complete Featured card surface from the stable `#featured-heading` anchor, with fixed 4:3 media, explicit title/price flow, theme-matched action surface, and no z-index workaround.
- Free, Growth, and Pro plan copy now explicitly states WhatsApp ordering.
- Signup no longer asks for brand name; onboarding remains the single collection point.

## Research
- WhatsApp official Click to Chat guidance confirms international `wa.me/<number>` links and URL-encoded prefilled messages.
- Saudi restaurant/menu research confirms digital-menu products connect menu discovery and ordering; this task only exposes truthful copy for an already implemented capability.

## Verification plan
- GitHub Quality: route generation, typecheck, tests, lint, production build, Playwright/Chromium, all-theme browser QA, Studio/Platform Admin QA, performance.
- W9 Orders QA.
- Final diff review.
- Physical-device Android/iOS visual QA remains release-stage evidence.

## Exact next task
Review the final PR diff and successful CI, then merge PR #232 once. After merge, perform the repository's single authorized Production deployment and real-device QA; do not start another redesign automatically.
