# W9 Orders QA

## W9.1 — Preparation Time / ETA Contract
- VERIFIED: confirmation of a `new` order requires a server-validated whole-minute preparation duration from 1 through 120.
- VERIFIED: quick presets are 3, 5, 10, 15, 20, and 30 minutes; custom whole-minute entry remains available.
- VERIFIED: estimated ready time is derived from database `clock_timestamp()` at confirmation plus the selected duration, not the browser clock or order creation time.
- VERIFIED: preparation fields are nullable, so legacy orders remain readable with an honest empty state.
- VERIFIED: no automatic ready-status transition was introduced.
- VERIFIED: no real order or outbound WhatsApp message is used by the test contract.
- UNKNOWN: final CI run IDs and browser screenshots for the new PR head until the PR is created.

# W9 Orders QA

Status: `IN_PROGRESS` until final Draft PR CI completes.

## Browser fixture
- `VERIFIED`: CI uses a temporary runner-local PostgreSQL fixture for `demo-nafas` and `dev-user`.
- `VERIFIED`: W9 adds two fictional CI-only orders: one with a valid Saudi local phone and one without a phone.
- `VERIFIED`: fixture cleanup removes the temporary SQL file; no production database is touched.

## Runtime matrix
- `VERIFIED`: Arabic RTL and English LTR.
- `VERIFIED`: order selection, status update, language switching, refresh, Back/Forward, phone/WhatsApp links, search/filter, mobile navigation, and no-horizontal-overflow checks are covered by the Studio browser suite.
- `VERIFIED`: Order Detail responsive coverage is 320×800, 360×800, 390×844, 430×932, 768×1024, 1024×768, 1280×800, and 1440×900.
- `VERIFIED`: contact links are asserted without sending a message or placing a call.
- `BLOCKED`: physical Android/iOS device QA is not part of CI and remains `PENDING_RELEASE_STAGE`.

## Contact safety
- `VERIFIED`: Saudi `05xxxxxxxx` / `5xxxxxxxx` values use the repository's existing phone normalization convention.
- `VERIFIED`: explicit international `+` / `00` numbers are preserved when valid.
- `VERIFIED`: ambiguous numbers are rejected instead of guessing a country code.
- `VERIFIED`: WhatsApp uses click-to-chat with an editable URL-encoded message containing only actual order/customer/restaurant/status fields.
- `VERIFIED`: no automatic outbound communication is implemented.

## Data honesty
- `VERIFIED`: Order Detail uses only fields already returned by `AdminOrder`.
- `VERIFIED`: unavailable data is omitted or shown with an honest empty state.
- `VERIFIED`: no fake payment, delivery, tax, discount, tip, driver, ETA, tracking, customer metrics, or call/message history is introduced.

## Final verification record
- `TODO`: final Draft PR head SHA and GitHub Actions run id.
- `TODO`: final diff review and Draft PR creation confirmation.
