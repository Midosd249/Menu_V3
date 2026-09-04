# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Theme 1 Essential, Theme 2 Editorial and Theme 3 Noir remain completed milestones; the current product work remains preview rendering integration and responsive QA, not a rebuild.
- Authentication legacy credential reconciliation is DONE / VERIFIED and live sign-in was confirmed by the user after deployment.
- Existing G1–G7.2 completed work remains protected.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and is now a required gate for future relevant UI/template/SEO/conversion work.

## Current Atomic Task
### Visual, functional, research, and template-refinement workflow upgrade — DONE / VERIFIED

**Objective:** make future template creation, template refinement, public-menu UI, SEO, accessibility, responsive, and conversion-flow work evidence-based and visually/functionally verified without changing application behavior or existing templates.

### Completed documentation contract
1. Added `docs/visual-functional-audit.md` as the permanent visual/functional audit record and evidence format.
2. Added `docs/design-research-log.md` as the permanent research evidence log.
3. Added `docs/template-review-checklist.md` as the mandatory completion checklist.
4. Added `docs/template-brief-template.md` as the pre-implementation design brief.
5. Added the permanent `Visual, Interaction, and Conversion Quality Gate` to `AGENTS.md`.
6. Updated continuity files so relevant future work requires research when material, visual scan, functional interaction scan, complete design brief, implementation, real-data testing, visual review, final functional verification, and documentation/evidence.

### Acceptance criteria
1. Future template/public-menu UI work must begin from repository evidence and a complete relevant journey, not an isolated component.
2. Relevant work must cover mobile/responsive, RTL/LTR, realistic data, accessibility, performance, SEO, and core interactions.
3. Cart, WhatsApp, phone, map/location, search, category navigation, and icons are evaluated only when their capabilities exist in the repository.
4. Unsupported checkout/payment or other customer actions must never be implied.
5. Visual claims require screenshots/browser evidence when available; unavailable visual tooling must be marked UNKNOWN.
6. Material external research must be recorded with source, date, finding, principle, relevance, limitation, confidence, and non-copying boundary.
7. Existing product behavior, theme order, templates, database, dependencies, deployment, auth, authorization, and subscriptions remain unchanged by this task.

## Verification Evidence
- **VERIFIED:** current theme registry contains five theme keys: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **VERIFIED:** current public-menu renderer contains search, cart/order, product details/modifiers, phone, map/location, Instagram, and WhatsApp-related UI.
- **VERIFIED:** `package.json` declares Playwright and the `qa:template` script.
- **VERIFIED:** permanent workflow documents were added and AGENTS/continuity rules updated.
- **VERIFIED:** authoritative baseline sources were logged for WCAG 2.2, Google Search Central LocalBusiness, web.dev image performance, Toast menu navigation/search, and Square QR/mobile ordering.
- **UNKNOWN:** executable authenticated browser/device rendering and screenshot/pixel comparison are unavailable in the current agent environment.
- **UNKNOWN:** completeness of the existing `qa:template` script as a screenshot/pixel-regression harness.

## Theme Sequence
- Theme 1 — Essential — DONE / VERIFIED / MERGED; baseline preserved.
- Theme 2 — Editorial — DONE / VERIFIED / MERGED; preview integration stabilized.
- Theme 3 — Noir — DONE / VERIFIED / MERGED; preview integration stabilized.
- Theme 4 — Heritage — TODO only after final Theme 1–3 live QA.
- Theme 5 — Gallery — TODO.
- G7.3 — Premium Theme Commercialization & Billing UX — TODO after the visual sequence.

## Current Product Stop Condition
Do not begin Theme 4 until the five preview variants have been manually checked on the latest deployment at required mobile/desktop breakpoints and the current preview covering-layer risk is visually closed.

## Future UI/Template Work Gate
Before implementation of any relevant template/public-menu/SEO/conversion change:
1. Inspect repository evidence and current architecture.
2. Perform material research and log it in `docs/design-research-log.md`.
3. Complete `docs/template-brief-template.md` for material presentation changes.
4. Complete the visual and functional audit/checklist.
5. Test real-data, RTL/LTR, responsive, accessibility, performance, SEO, and supported conversion states.
6. Review rendered screenshots/browser evidence when tooling is available.
7. Verify core interactions and failure states.
8. Update evidence and continuity files.

## Research Decisions
- Use repository evidence first.
- Use connected sources only when actually available; do not claim access to unconnected analytics, browser sessions, design files, or deployment tooling.
- Prefer official documentation, standards, maintained open-source projects, official competitor documentation, and credible market evidence.
- Extract transferable principles only; never copy proprietary layouts, branding, assets, text, screenshots, or code.
- Preserve the existing theme-family architecture and menu data/business contract unless a future atomic task proves a change necessary.

## Current Known Limitation
- **UNKNOWN:** pixel-level mobile/desktop rendering after hydration cannot be verified from this environment because no authenticated browser/device session is available.
- **BLOCKED for full visual release verification:** the required browser/device evidence must be produced in an environment with an authenticated preview session and screenshot capability.
