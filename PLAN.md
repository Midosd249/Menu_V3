# Menu V3 — Active Plan

## Status
- Status: BLOCKED.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential and Editorial remain protected.
- Theme 3 Noir implementation refinement is complete; final visual/device closure is blocked by unavailable browser execution.
- Heritage and Gallery remain queued and untouched.
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.

## Current Atomic Task
### Theme 3 — Noir premium refinement — IMPLEMENTATION COMPLETE / VERIFICATION BLOCKED

**Completed:**
- Refined the existing `fine-dining-hospitality` masthead to use verified restaurant/branch data and configured tagline with neutral fallback wording.
- Strengthened Noir featured/product-card hierarchy, long-text handling, SAR price stability, image treatment, focus states, sticky navigation, and mobile safe-area behavior.
- Added Noir-specific document background and dark color-scheme rules to reduce light-canvas transitions once the theme is active.
- Preserved shared cart/order, search/category, product detail/modifier, language, WhatsApp, phone, map, and social behavior.
- No unsupported customer-facing action was added.

## Evidence and design decisions
- **VERIFIED:** `noir` maps to `fine-dining-hospitality`.
- **VERIFIED:** current source uses structured horizontal product cards and a featured grid; no circular product-card implementation was found in the reviewed Noir source.
- **PROPOSED:** structured cards are retained because readability and scanability are more important than novelty.
- **UNKNOWN:** screenshot-reported circular runtime composition until a browser screenshot confirms it exists in the deployed rendering.
- **UNKNOWN:** Opera white-background behavior and initial old-theme flash until reproduced with actual browser/first-paint evidence.

## Acceptance state
- **VERIFIED:** scoped implementation complete.
- **BLOCKED:** browser/device visual sign-off, Opera comparison, QR scan, post-hydration inspection, console-error check, and pixel comparison cannot be executed in the current GitHub-only environment.
- **BLOCKED:** local typecheck/test/lint/build/template-QA/performance commands cannot run without an executable repository checkout/runtime.

## Release policy
- Do not claim `DEPLOYED` without real Vercel evidence.
- Do not declare Noir `DONE` until browser/device evidence is captured or an explicit evidence-backed exception is accepted.
- Do not begin Heritage while this verification gate remains unresolved.

## Exact next task
Run the Noir external preview QR on a real phone/browser and capture small/standard/large mobile plus supported desktop/tablet RTL/LTR evidence, specifically checking Opera background behavior, first-paint flash, clipping, sticky/cart overlap, icons, and core customer actions. Then run repository quality gates in an executable environment.
