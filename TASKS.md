# TASKS

## Current Atomic Task
### Essential Premium Refinement — IMPLEMENTED / VERIFICATION PENDING
- **Objective:** turn Essential into a production-premium Arabic-first restaurant menu experience without rebuilding the Public Menu or changing other themes.
- **VERIFIED:** removed duplicate `small-menu` template chrome so Essential has one public renderer.
- **VERIFIED:** replaced Essential presentation with a coherent scoped design system covering hero hierarchy, typography, spacing, search/categories, featured composition, product cards, contrast rhythm, hours, customer actions, safe areas, layering, focus, bidi, and reduced motion.
- **VERIFIED:** preserved existing cart/order, product details/modifiers, search/category, language, WhatsApp, map, phone, social, analytics, tenant/branch routing, authorization, and subscription semantics.
- **VERIFIED:** added Essential regression assertions to `tests/preview-shell.test.mjs`.
- **VERIFIED:** added `docs/essential-design-brief.md` and `docs/essential-layering-and-ui-audit.md`.
- **VERIFIED:** added Essential research evidence to `docs/design-research-log.md`.
- **BLOCKED:** local runtime checks cannot run in the current GitHub-only environment.
- **UNKNOWN:** Opera-specific behavior, real-device screenshots, exact first-paint timing, QR scan, post-hydration console output, and pixel comparison until browser evidence is inspected.

## Required Verification Before Closure
1. Inspect GitHub Actions after the Essential batch commit.
2. Confirm typecheck, tests, lint, production build, template QA, and performance audit results.
3. Review Chromium browser QA for Essential on public and preview routes, including RTL/LTR and supported viewport coverage.
4. Confirm no old/default theme flash, no obscured content, no fixed/sticky overlap, and correct empty/populated cart behavior.
5. Confirm configured WhatsApp/map/phone actions are reachable and non-overlapping.
6. Confirm long Arabic/English/mixed-direction names, SAR prices, missing images, sold-out/modifier states, category density, and branch navigation remain stable where supported.
7. Capture or obtain Opera/real-device evidence before declaring `CLOSED`.
8. Review final diff and Vercel deployment evidence; do not claim `DEPLOYED` without direct evidence.

## Protected Scope
- Editorial, Noir, Heritage, and Gallery are not redesigned by this task.
- No new theme is created.
- No database schema, migrations, subscriptions, authentication, authorization, tenant/branch isolation, dependency, CI/CD, or Vercel configuration changes are permitted unless a verified blocker directly requires a minimal change.

## Planned Theme Sequence
1. Theme 1 — Essential — current refinement closure gate.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; protected.
3. Theme 3 — Noir — implementation refinement complete; verification remains separately blocked; protected.
4. Theme 4 — Heritage — TODO after Essential closure.
5. Theme 5 — Gallery — TODO.
6. G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Permanent Quality Gate
Every future template/public-menu UI task must use `AGENTS.md`, `docs/design-intelligence.md`, `docs/template-review-checklist.md`, and the evidence records in `docs/visual-functional-audit.md` and `docs/design-research-log.md`.

## Exact Next Task
Inspect CI/browser evidence for the Essential refinement commit, fix only Essential-scoped failures, then obtain remaining Opera/real-device evidence before closing the milestone.
