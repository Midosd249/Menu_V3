# W16 — Android Failure Pass and Remediation — 2026-09-09

## Status
- **IMPLEMENTATION_COMPLETE / DEVICE_RETEST_REQUIRED**
- Scope: remediation of the W16 Android findings supplied by the owner.
- No iPhone, VoiceOver, or Opera evidence was available.
- The owner identified `mndy-alwtnya` / «مقهى زهر النعناع» as the canonical test restaurant because it contains the current complete menu data and updates.

## Evidence used
- Owner-provided Android W16 results and defect descriptions.
- Live Supabase production data for `mndy-alwtnya`:
  - tenant: `mndy-alwtnya`
  - branch: `main-branch`
  - published/active
  - theme: `essential`
  - public content version: `118`
  - categories: `7`
  - products: `26`
  - available products: `26`
  - missing product images: `0`
- Current repository `main` baseline and canonical public route/renderer.
- W3C WCAG 2.2 guidance for focus clearance and minimum pointer target sizing.

## Owner-reported failures
- Android overall: FAIL
- RTL: FAIL
- LTR: PASS
- Mixed RTL/LTR: FAIL
- Long content: FAIL
- Images: FAIL
- Categories: FAIL
- Product Details: FAIL
- Quick Add: PASS
- Item Notes: PASS
- Cart: PASS
- Order Flow: PASS
- Sticky/Floating UI: FAIL
- Safe Area: FAIL
- QR: FAIL
- TalkBack: PASS
- iPhone: NOT AVAILABLE
- VoiceOver: NOT AVAILABLE
- Opera: NOT AVAILABLE

## Confirmed implementation findings
1. QR generation used `window.location.origin`, which could encode a Preview/local origin instead of the configured production public origin. This is a credible source of QR destination drift.
2. The public menu route already resolves the canonical tenant/branch data and theme from published data; no data migration was required.
3. The public menu already has a revision-keyed server cache. The W16 remediation therefore does not introduce a second data source.
4. Editorial product headings had a `14ch` presentation constraint capable of producing poor Arabic word wrapping. A W16-scoped override removes that character-width constraint and disables arbitrary word breaking.
5. Noir's shared opening-hours panel uses the generic light `bg-sand` presentation and required a Noir-specific dark treatment to avoid white-background/white-text combinations.
6. Gallery product cards required an explicit full-height/stable content rule so long card content cannot be clipped by a stretched grid row.
7. The legacy Editorial `VOL. 03 — THE TABLE` pseudo-element was still active in the refinement layer and was removed.
8. Editorial media retains the repository's lazy-loading contract, while an Editorial-only client prefetch warms product image URLs so below-the-fold media can render without requiring a user interaction.

## Remediation implemented
- Added `src/theme-w16-mobile-qr-hardening.css`.
- Loaded the W16 layer after existing theme/parity layers in `src/routes/__root.tsx`.
- Added a stable `.menu-lang-toggle` hook in `src/components/lang-toggle.tsx` and an Essential white halo treatment.
- Updated `src/routes/studio/qr.tsx` to use `getPublicOrigin()` with browser-origin fallback.
- Removed the active Editorial `VOL. 03 — THE TABLE` label from `src/theme-refinements.css`.
- Added safe-area/focus clearance for the public fixed action bar.
- Added Editorial Arabic word-boundary protection.
- Added Noir opening-hours contrast/background correction.
- Added Gallery full-height/content visibility correction.
- Added Editorial-only image prefetch while preserving `loading="lazy"` and `fetchPriority="low"` on the actual image element.
- Added regression contracts to `tests/preview-shell.test.mjs`.

## Verification history
- An intermediate CI run failed only because the new Editorial image eager-loading implementation conflicted with two pre-existing repository contracts requiring `loading="lazy"` for public dish media.
- That implementation was corrected to use client prefetch while retaining the original lazy-loading contract.
- A new CI run was triggered automatically for the corrected branch head; final conclusion is pending at the time this record was written.

## Protected behavior
- Quick Add
- Item Notes
- Cart
- Order validation
- Public menu data model
- Authentication/authorization
- Tenant/branch isolation
- Existing five-theme architecture
- No new theme
- No database migration
- No dependency change
- No Vercel deployment was intentionally triggered by this remediation branch

## Verification requirements
Automated/CI verification must confirm:
- W16 stylesheet loads after existing theme layers.
- QR uses configured production public origin.
- Essential language-control hook exists.
- Editorial volume label is absent.
- Arabic word wrapping rules are present.
- Noir opening-hours contrast rules are present.
- Gallery card-height rules are present.
- Existing test suite remains green.

## Device retest gate
The owner must retest the canonical `mndy-alwtnya/main-branch` production QR after the implementation is released. W16 cannot be marked `DONE / VERIFIED` until direct Android evidence confirms the reported device findings are resolved.

## Next action
After release of this remediation, repeat the W16 Android matrix on the canonical production QR. Record PASS/FAIL per category and attach screenshots for any remaining defect. iPhone/VoiceOver/Opera remain `UNKNOWN` until actual device/browser evidence exists.
