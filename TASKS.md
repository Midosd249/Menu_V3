# TASKS

## Current Atomic Task
### Visual, functional, research, and template-refinement workflow upgrade — DONE / VERIFIED
- **Objective:** establish a permanent evidence-based quality gate for future template creation, template refinement, public-menu UI, SEO, accessibility, responsive, and conversion-flow work without modifying application behavior or existing templates.
- **Completed:** `docs/visual-functional-audit.md` added with full visual/functional audit scope, interaction checks, severity, evidence, and tooling limitations.
- **Completed:** `docs/design-research-log.md` added with permanent source-recording rules and authoritative baseline research.
- **Completed:** `docs/template-review-checklist.md` added with mandatory visual, functional, cart/order, contact/location, search/category, RTL/LTR, real-data, safe-area, accessibility, SEO, performance, and screenshot/regression checks.
- **Completed:** `docs/template-brief-template.md` added with action hierarchy, visibility rules, interaction hierarchy, safe-area behavior, sample content, and acceptance criteria.
- **Completed:** `AGENTS.md` now contains the permanent `Visual, Interaction, and Conversion Quality Gate`.
- **Completed:** `PROJECT_STATE.md`, `PLAN.md`, and `SESSION_PROTOCOL.md` require the new workflow for future relevant work.
- **Verified:** current source defines five themes only: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **Verified:** public-menu source contains search, cart/order, product details/modifiers, phone, map/location, Instagram, and WhatsApp-related UI.
- **Verified:** Playwright is present as a dev dependency and `qa:template` exists.
- **Verified:** no application code, templates, database, migrations, dependencies, CI/CD, Vercel settings, auth, authorization, subscriptions, or product features were changed.
- **Verified:** authoritative research was logged for WCAG 2.2, Google Search Central LocalBusiness, web.dev image performance, Toast menu search/category navigation, and Square QR/mobile ordering.
- **UNKNOWN:** authenticated browser/device rendering, screenshot capture, pixel comparison, and post-hydration inspection are unavailable in the current environment.

## Planned Theme Sequence
1. Theme 1 — Essential — DONE / VERIFIED / MERGED; original baseline preserved.
2. Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview rendering stabilized.
3. Theme 3 — Noir — DONE / VERIFIED / MERGED; preview rendering stabilized.
4. Theme 4 — Heritage — TODO after final Theme 1–3 live QA.
5. Theme 5 — Gallery — TODO.
6. G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Required Gate for Future UI/Template Work
1. Repository evidence and current architecture inspection.
2. Material source research recorded in `docs/design-research-log.md`.
3. Complete design brief using `docs/template-brief-template.md` when material.
4. Full visual scan using `docs/visual-functional-audit.md` and `docs/template-review-checklist.md`.
5. Functional interaction scan, including supported cart/order, WhatsApp, phone, map/location, search, categories, and icons.
6. Real-data resilience testing.
7. Arabic RTL, English LTR, mixed-direction, and responsive verification.
8. Accessibility, performance, SEO/public-page review.
9. Screenshot/browser visual review when tooling is available.
10. Final functional verification and evidence-backed documentation.

## Completed
### Premium Theme System — 8 → 5 — DONE / VERIFIED / MERGED
- **Catalog:** `essential` (Free), `editorial` (Premium), `noir` (Premium), `heritage` (Premium), `gallery` (Premium).
- **VERIFIED:** five themes only; exactly one Free and four Premium.
- **VERIFIED:** themes are complete visual systems rather than color-only skins.

### Theme 1 — Essential — DONE / VERIFIED / MERGED
- Dedicated Free-theme art direction implemented and isolated from domain/business logic.
- Original visual baseline is preserved.

### Theme 2 — Editorial — DONE / VERIFIED / MERGED
- Dedicated Premium art direction implemented and isolated from domain/business logic.
- Preview integration now uses its intended template family and refinement layers.

### Theme 3 — Noir — DONE / VERIFIED / MERGED
- Dedicated cinematic Premium art direction implemented and isolated from domain/business logic.
- Preview integration now uses its intended template family and refinement layers.

### Authentication — Legacy credential reconciliation — DONE / VERIFIED
- Better Auth accepts native scrypt credentials and migrated Supabase bcrypt credentials.
- Production login was subsequently confirmed by the user after the qualified `extensions.crypt(...)` correction was deployed.

## Notes
- **VERIFIED:** current subscription plans are `free`, `starter`, and `pro`.
- **VERIFIED:** Vercel project `menu-v3` is linked to `Midosd249/Menu_V3`.
- **VERIFIED:** corrected authentication is live.
- **DONE / SOURCE-VERIFIED:** nested preview shell was removed from both preview routes.
- **VERIFIED:** current deployment serves all five theme preview variants with HTTP 200.
- **PENDING:** complete authenticated mobile/desktop browser QA and local quality gates before closing the current product preview task.
- **WORKFLOW:** future template/public-menu UI work is blocked from completion until the permanent visual/functional quality gate is satisfied or an evidence-backed exception is documented.
