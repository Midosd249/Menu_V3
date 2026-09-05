# PROJECT_STATE

## Identity
- Status: BLOCKED.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — implementation refinement COMPLETE; final visual/device closure BLOCKED pending browser evidence.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED; protected.**
- **Theme 3 — Noir — implementation refinement COMPLETE; release/visual closure remains BLOCKED pending browser/device evidence.**
- Heritage and Gallery remain untouched.
- Authentication reconciliation and live authentication verification remain completed.
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.**
- **External Theme Preview QR Mode — DONE / VERIFIED.** All five themes remain available for non-persistent external preview against real branch data.

## Current Atomic Task
### Theme 1 — Essential premium refinement — IMPLEMENTATION COMPLETE / VERIFICATION BLOCKED

**Objective:** complete the evidence-based refinement of the existing `essential` theme within the `small-menu` family without modifying other themes or weakening product/security behavior.

**Verified implementation already present in repository history:**
- Essential remains the Free `small-menu` theme with the existing horizontal product-card model and sticky category navigation.
- Essential uses scoped warm-paper/ink/atelier styling, stronger hierarchy, stable media boxes, long-text wrapping, SAR price stability, focus states, responsive narrow-phone handling, and preview visibility protection.
- Existing shared cart/order, product details/modifiers, search/category navigation, language, WhatsApp, phone, map, and social behavior remain owned by the shared public-menu renderer.
- No unsupported customer-facing capability was added.

**Design decision:** retain the horizontal Essential card system. Its role is fast, clear everyday hospitality; refinement should improve polish and resilience without turning the Free theme into an image-heavy Premium template.

## Verification State
- **VERIFIED:** current theme registry contains exactly five themes: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **VERIFIED:** `essential` maps to `small-menu` and remains `free`.
- **VERIFIED:** the permanent premium visual/functional/research guidance is active in `AGENTS.md` and the required documentation exists.
- **VERIFIED:** Essential-specific audit now exists at `docs/template-audits/essential-premium-refinement.md`.
- **VERIFIED:** no other theme definition was changed by this Essential closure update.
- **VERIFIED:** no database schema, migrations, dependencies, CI/CD, Vercel settings, authentication, authorization, subscription rules, or routing contracts were changed by the Essential refinement.
- **UNKNOWN:** actual browser/device screenshots, QR scanning, Opera behavior, post-hydration first-paint evidence, console output, and pixel comparison.
- **BLOCKED:** `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, `npm run qa:template`, and `npm run performance:audit` cannot be executed from the current GitHub-only environment because no executable repository checkout/runtime is available here.
- **BLOCKED:** final visual sign-off cannot be claimed without browser/device evidence.

## Session Log
- 2026-09-05 — Re-read repository guidance, continuity files, theme registry, public-menu architecture, Essential stylesheet, Essential refinement brief, package verification scripts, and Essential history.
- 2026-09-05 — Researched W3C WCAG 2.2, Google Search Central LocalBusiness guidance, web.dev responsive-image/CLS guidance, and Saudi/MENA public digital-menu examples.
- 2026-09-05 — Confirmed the permanent visual/functional quality system was already documented and active.
- 2026-09-05 — Recorded the Essential refinement audit and established the current closure boundary; existing Essential implementation was preserved rather than redundantly rewritten.

## Exact Next Task
Run the Essential external preview QR on a real phone/browser and capture small/standard/large mobile plus supported desktop/tablet RTL/LTR evidence; specifically verify long Arabic/English/mixed text, SAR prices, category navigation, product details, cart/order, contact actions, safe areas, first-paint behavior, and console errors. Then run repository quality gates in an executable environment before declaring Essential `DONE` or beginning the next theme.
