# PROJECT_STATE

## Identity
- Status: BLOCKED.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DONE / VERIFIED / MERGED; protected.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED; protected.**
- **Theme 3 — Noir — implementation refinement COMPLETE; release/visual closure BLOCKED pending browser/device evidence.**
- Heritage and Gallery remain untouched.
- Authentication reconciliation and live authentication verification remain completed.
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.**
- **External Theme Preview QR Mode — DONE / VERIFIED.** All five themes remain available for non-persistent external preview against real branch data.

## Current Atomic Task
### Theme 3 — Noir premium refinement — IMPLEMENTATION COMPLETE / VERIFICATION BLOCKED

**Objective:** refine the existing dark `noir` theme within the existing `fine-dining-hospitality` family without modifying other themes or weakening product/security behavior.

**Completed implementation:**
- Refined the Noir hospitality masthead copy to use verified restaurant/branch data and configured tagline, with neutral fallback wording.
- Strengthened Noir featured/product-card hierarchy, long-text handling, SAR price stability, image treatment, focus states, sticky navigation, and mobile safe-area behavior.
- Added dark document background/color-scheme rules targeted only to `noir` to reduce light-canvas transitions when the theme attribute is active.
- Preserved shared cart/order, search, category, product-detail, language, WhatsApp, phone, map, and social behavior.
- Did not introduce new customer-facing capabilities.

**Design decision:** retain the structured card system. Current repository evidence does not contain the reported circular product-card implementation, so no speculative circular rewrite was made.

## Verification State
- **VERIFIED:** current theme registry contains exactly five themes: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **VERIFIED:** `noir` maps to `fine-dining-hospitality`.
- **VERIFIED:** shared public-menu supports product details, modifiers, cart/order, search/category navigation, language, and configured customer actions.
- **VERIFIED:** Part 1 permanent design/functional guidance and required documents exist.
- **VERIFIED:** implementation changes are limited to Noir-specific presentation/template code plus required documentation; other theme definitions were not changed.
- **VERIFIED:** no database schema, migrations, dependencies, CI/CD, Vercel settings, authentication, authorization, subscription rules, or routing contracts were changed by the Noir refinement.
- **UNKNOWN:** actual browser/device screenshots, QR scanning, Opera background reproduction, post-hydration first-paint evidence, console output, and pixel comparison.
- **BLOCKED:** `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, `npm run qa:template`, and `npm run performance:audit` cannot be executed from the current GitHub-only environment because no executable repository checkout/runtime is available here.
- **BLOCKED:** final visual sign-off cannot be claimed without browser/device evidence.

## Session Log
- 2026-09-05 — Re-read repository guidance, continuity files, theme registry, public-menu route/template architecture, shared public-menu, theme controller, Noir CSS, and package verification scripts.
- 2026-09-05 — Researched W3C WCAG 2.2, Google Search Central LocalBusiness guidance, web.dev responsive-image/CLS guidance, and Saudi/MENA public digital-menu examples including Al Qaima, Nasj Menu, and TableGreet.
- 2026-09-05 — Completed Part 1 permanent premium design/functional specialization and supporting documentation.
- 2026-09-05 — Completed the scoped Noir implementation refinement; no other theme was redesigned.
- 2026-09-05 — Attempted repository CI/status verification; no workflow run was available for the latest commit, and no executable local runtime is available in this environment.

## Exact Next Task
Run the Noir preview through the five-theme external QR preview system on a real phone/browser, then perform browser/device QA at small/standard/large mobile and supported desktop/tablet sizes in Arabic RTL and English LTR; specifically capture Opera background behavior and the initial first-paint old-theme flash before declaring Noir `DONE` or making another code change.
