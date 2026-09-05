# TASKS

## Current Atomic Task
### Essential Premium Refinement — IMPLEMENTED / DEPLOYED / QUALITY CLOSURE PENDING
- **Objective:** turn Essential into a production-premium Arabic-first restaurant menu experience without rebuilding the Public Menu or changing other themes.
- **VERIFIED:** removed duplicate `small-menu` template chrome so Essential has one public renderer.
- **VERIFIED:** replaced Essential presentation with a coherent scoped design system covering hero hierarchy, typography, spacing, search/categories, featured composition, product cards, contrast rhythm, hours, customer actions, safe areas, layering, focus, bidi, and reduced motion.
- **VERIFIED:** preserved existing cart/order, product details/modifiers, search/category, language, WhatsApp, map, phone, social, analytics, tenant/branch routing, authorization, and subscription semantics.
- **VERIFIED:** added Essential regression assertions to `tests/preview-shell.test.mjs`.
- **VERIFIED:** added `docs/essential-design-brief.md` and `docs/essential-layering-and-ui-audit.md`.
- **VERIFIED:** added Essential research evidence to `docs/design-research-log.md`.
- **VERIFIED:** deployed commit `48430b67a5d6cd9154db237b4cb801e6ee58109e` to Vercel production; deployment is `READY`.
- **VERIFIED:** deployed public route `/m/mndy-alwtnya` returns HTTP 200 with Essential first-paint theme bootstrap and one public renderer.
- **BLOCKED:** GitHub Actions quality job stops at project-wide TypeScript React declaration errors before tests/lint/browser QA.
- **UNKNOWN:** Opera-specific behavior, real-device screenshots, exact first-paint timing, QR scan, post-hydration console output, and pixel comparison.

## Quality-Gate Finding
- Existing project-wide gap: React 19 runtime packages are present, but `@types/react` / `@types/react-dom` are absent from `devDependencies`.
- CI errors are in existing routes such as `src/routes/themes/index.tsx` and `src/routes/themes/preview.tsx` and are not caused by the Essential changes.
- Do not weaken or bypass typecheck to manufacture a green pipeline.
- Handle the type declaration gap as a separate project-wide maintenance task, then rerun all gates.

## Required Verification Before Essential Closure
1. `npm run typecheck`
2. `npm test`
3. `npm run test:platform`
4. `npm run lint`
5. `npm run build`
6. `npm run qa:template`
7. `npm run performance:audit`
8. Chromium browser QA for Essential public/preview routes.
9. Opera + real-device verification for first-paint, layering, safe areas, and responsive behavior.
10. Final diff review and Vercel deployment evidence.

## Protected Scope
- Editorial, Noir, Heritage, and Gallery are not redesigned by this task.
- No new theme is created.
- No database schema, migrations, subscriptions, authentication, authorization, tenant/branch isolation, dependency, CI/CD, or Vercel configuration changes are permitted for Essential unless a verified blocker directly requires a minimal change.

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
Resolve the existing React type-declaration quality-gate failure as a separate project-wide maintenance task, rerun the full quality pipeline, then capture Opera/real-device evidence and close Essential only when the required gates are green or explicitly verified/blocked with no hidden failures.
