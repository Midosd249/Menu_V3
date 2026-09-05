# Menu V3 — Active Plan

## Status
- Status: BLOCKED.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential is the current refinement milestone; implementation is complete and final visual/device closure is blocked by unavailable browser execution.
- Editorial remains protected.
- Noir implementation refinement is complete but its final browser/device closure remains separately blocked; do not reopen it during this Essential task.
- Heritage and Gallery remain untouched.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.

## Current Atomic Task
### Theme 1 — Essential premium refinement — IMPLEMENTATION COMPLETE / VERIFICATION BLOCKED

**Completed implementation evidence:**
- `essential` remains the Free `small-menu` theme with its existing horizontal product-card model and sticky category navigation.
- Existing Essential presentation provides warm-paper/ink identity, compact branded header, stronger hierarchy, stable image containers, long-text resilience, SAR price stability, focus treatment, narrow-phone handling, and preview visibility protection.
- Shared cart/order, search/category, product details/modifiers, language, WhatsApp, phone, map, and social behavior remain owned by the shared public-menu renderer.
- No unsupported customer action was introduced.

## Design decision
- **VERIFIED / PROPOSED:** retain Essential's horizontal card system. Essential is the Free everyday-hospitality theme, so the refinement should maximize clarity, speed, scanability, and resilience without turning it into a Premium image-heavy composition.

## Evidence and research
- **VERIFIED:** permanent design/functional guidance is active in `AGENTS.md` and the supporting documentation.
- **VERIFIED:** Essential-specific refinement audit exists at `docs/template-audits/essential-premium-refinement.md`.
- **VERIFIED:** repository evidence confirms the shared public-menu owns cart/order, search/category navigation, product details/modifiers, language, and configured customer actions.
- **VERIFIED:** W3C WCAG 2.2 target-size guidance, Google Search Central LocalBusiness guidance, web.dev responsive-image guidance, and relevant Saudi/MENA digital-menu examples were used as material references.
- **UNKNOWN:** rendered browser/device behavior until QR/browser evidence is captured.

## Acceptance state
- **VERIFIED:** implementation scope is complete for Essential.
- **VERIFIED:** no other theme definition was changed by the current Essential closure documentation.
- **VERIFIED:** no database schema, migrations, dependencies, CI/CD, Vercel settings, authentication, authorization, subscription rules, or routing contracts were changed by this task.
- **BLOCKED:** browser/device visual sign-off, QR scan, post-hydration inspection, console-error check, pixel comparison, and runtime performance checks cannot run in the current GitHub-only environment.

## Release policy
- Do not claim `DEPLOYED` without real Vercel evidence.
- Do not declare Essential `DONE` until browser/device evidence is captured or an explicit evidence-backed exception is accepted.
- Do not begin Heritage while Essential remains at this verification gate.

## Exact next task
Run the Essential external preview QR on a real phone/browser and capture small/standard/large mobile plus supported desktop/tablet evidence in Arabic RTL and English LTR; test long names, mixed-direction text, SAR prices, missing images, sold-out items, modifiers, category density, search, product details, cart/order, contact actions, sticky controls, safe areas, first paint, console errors, and visual overflow. Then run the repository quality gates in an executable environment.
