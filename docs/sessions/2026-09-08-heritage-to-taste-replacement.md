# Session — 2026-09-08 — Heritage to Taste Replacement

## Request classification
- Significant public-menu theme replacement and visual integration.
- Internal workflows: Principal Engineer, Design Agent, Research/Connected-Tools review, QA/regression, release/reliability review.
- Research level: Focused.

## Scope
Replace the former Heritage presentation with the user-supplied Canva-inspired restaurant-menu direction while preserving the canonical five-theme architecture and the shared public-menu behavior. No backend/schema/auth/authorization/tenant/branch/analytics/deployment changes.

## Verified position before work
- Canonical repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Base commit for this task: `a879e1789c4efa236995035cbc05acc73412f469`.
- Five canonical theme keys remain unchanged.
- Shared public renderer remains the owner of cart, ordering, product details/options, language, customer actions, QR-related preview behavior, and public data.

## Work completed
- Replaced `src/theme-heritage.css` with the modern `Taste` presentation.
- Changed the user-facing `heritage` registry label from `أصالة / Heritage` to `مذاق / Taste` and aligned its visual tokens/layout capabilities.
- Removed the retired Heritage hardening/cascade imports from `src/routes/__root.tsx`.
- Replaced legacy Heritage regression assertions with the new Taste visual contract.
- Added `docs/template-audits/heritage-taste-replacement-2026-09-08.md`.

## Design outcome
- Large image-led hero with readable gradient treatment.
- Compact rounded utility controls.
- Sticky category/search discovery rail.
- Clean image-led featured cards.
- Stable product media geometry.
- Separate product name, description, price, and tags.
- Bidi-safe price presentation.
- Responsive 1/2/3-column behavior by viewport.
- Reduced-motion handling.
- Existing data-driven customer actions remain untouched.

## Verification
- `Menu V3 Quality` GitHub Actions run `34274894014` is **IN_PROGRESS** for PR #42 at session close.
- Browser/device QA has not been executed by this connector session.
- No Vercel deployment was intentionally triggered.

## Known limitation
- Historical `src/theme-heritage-hardening.css` and `src/theme-heritage-cascade.css` remain in the repository filesystem but are no longer imported by the root document. Physical deletion requires exact blob SHAs not exposed by the available connector read surface in this session.

## Status
- Implementation: `IMPLEMENTATION_IN_PROGRESS` pending CI verification.
- Deployment: `DEPLOYMENT_BLOCKED` for this task until the normal verified release batch is complete; no deployment was triggered.
- Exact next task: inspect CI result, resolve any failing checks, then review PR #42 diff and merge only after the quality gate is green.
