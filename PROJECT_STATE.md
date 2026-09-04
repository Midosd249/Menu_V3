# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DONE / VERIFIED / MERGED; original baseline restored.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview rendering stabilized.**
- **Theme 3 — Noir — DONE / VERIFIED / MERGED; preview rendering stabilized.**
- Authentication reconciliation and the qualified `extensions.crypt(...)` fix are implemented and live authentication was verified by the user after deployment.
- The reserved `nafas` demo fixture remains the source for the marketing/theme-preview demo when no branch is requested.
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.** Permanent audit, research-log, checklist, and template-brief rules are now part of the repository workflow.

## Current Atomic Task
### Visual, functional, research, and template-refinement workflow upgrade — DONE / VERIFIED

**Objective:** establish a permanent evidence-based quality gate for future template creation, template refinement, public-menu UI, SEO, accessibility, responsive, and conversion-flow work without modifying existing application behavior or templates.

**Completed:**
- Added `docs/visual-functional-audit.md` with visual and interaction audit scope, severity model, evidence format, and explicit UNKNOWN visual-tooling limits.
- Added `docs/design-research-log.md` with permanent source/research recording rules and current authoritative baseline research.
- Added `docs/template-review-checklist.md` with mandatory visual, functional, cart/order, contact/location, search/category, RTL/LTR, real-data, accessibility, SEO, performance, and screenshot/regression gates.
- Added `docs/template-brief-template.md` with action hierarchy, visibility rules, interaction rules, safe-area behavior, sample content, and acceptance criteria.
- Added the permanent `Visual, Interaction, and Conversion Quality Gate` section to `AGENTS.md`.
- Updated `PLAN.md`, `TASKS.md`, and `SESSION_PROTOCOL.md` to make research, visual scan, functional scan, real-data testing, visual review, final verification, and evidence documentation mandatory for future relevant work.
- Preserved the existing theme sequence and all completed milestones.

## Verification State
- **VERIFIED:** repository source and current theme registry were inspected before documentation changes.
- **VERIFIED:** current theme catalog in `src/lib/theme/registry.ts` is five themes: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **VERIFIED:** `src/components/public-menu.tsx` contains public search, cart/order, product details/modifiers, phone, map/location, Instagram, and WhatsApp-related UI code; future behavior must still be browser-verified rather than inferred from icon presence.
- **VERIFIED:** Playwright is declared in `package.json` and `qa:template` exists.
- **VERIFIED:** no application source, templates, database schema/migrations, dependencies, CI/CD, Vercel settings, authentication, authorization, subscriptions, or product features were changed by this task.
- **VERIFIED:** current `main` commit history contains the previously captured preview covering-layer incident and its engineering lessons; those lessons are now incorporated into the permanent audit workflow.
- **VERIFIED:** authoritative baseline research was recorded for WCAG 2.2 target sizes, Google LocalBusiness structured data, web.dev responsive/lazy images, Toast menu search/category navigation, and Square QR/mobile ordering principles.
- **UNKNOWN:** authenticated browser/device visual execution, screenshot capture, pixel comparison, and post-hydration inspection from this agent environment.
- **UNKNOWN:** whether the existing `qa:template` script is sufficient for complete screenshot/pixel regression coverage; this must be verified before relying on it as a complete visual harness.

## Session Log
- 2026-09-05 — Read repository operating contract, continuity files, README, current theme registry, public-menu renderer, package scripts/dependencies, and recent Git history before editing.
- 2026-09-05 — Confirmed current repository is `Midosd249/Menu_V3`, source of truth `main`.
- 2026-09-05 — Confirmed current product template catalog from source is five themes; did not propagate stale eight-theme documentation into the new quality system.
- 2026-09-05 — Added the permanent visual/functional audit, research log, template checklist, and template brief documents.
- 2026-09-05 — Added the permanent `Visual, Interaction, and Conversion Quality Gate` to `AGENTS.md` and aligned the continuity workflow without changing milestone order.
- 2026-09-05 — Recorded authoritative public research and explicitly marked browser/device visual execution as UNKNOWN because no executable authenticated browser/device session is available here.
- 2026-09-05 — Did not modify application code or existing templates.

## Exact Next Task
Perform authenticated browser/device QA of all five theme previews at mobile and desktop breakpoints, specifically verifying the full menu remains visible after hydration and that no transparent/covering layer returns. Only after that verification should Theme 4 — Heritage be treated as ready to begin.