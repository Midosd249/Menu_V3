# W7.12 — Real-Device QA Protocol

Date: 2026-09-15
Status: PENDING_RELEASE_STAGE — protocol prepared; physical testing has not been performed by ATLAS.

## Purpose

This is a manual release-stage QA protocol. It is a checklist for real Android/iOS devices after an authorized deployment exists. It is **not evidence that device testing occurred**.

## Devices and Browsers

Required where available:
- Android phone — current stable Chrome.
- Android phone — Samsung Internet, current stable.
- iPhone — Safari on a currently supported iOS version.
- iPad — Safari on a currently supported iPadOS version.

Optional:
- Android tablet — Chrome.
- Desktop Safari, Chrome, and Edge for spot checks.

Record for every run: device model, OS version, browser/version, tester, date, connection, viewport/orientation, and evidence.

## Connectivity Matrix

Test on:
- Stable Wi-Fi.
- Throttled/slow network where the browser/devtools permits it.
- Mobile data where available.
- Safe offline/error observation where the flow permits it without destructive actions.

Expected: loading, retry, empty, unavailable, and terminal error states remain understandable; no blank or misleading success state appears.

## Form Factors

- Compact Android phone.
- Large Android phone.
- iPhone standard size.
- iPhone Plus/Max size.
- Tablet portrait.
- Tablet landscape.

## Direction and Content Matrix

Run representative checks in:
- Arabic RTL.
- English LTR where supported.
- Mixed Arabic/English content.

Include long Arabic restaurant/menu names and representative:
- URLs;
- IDs;
- phone numbers;
- email addresses;
- dates;
- numeric values;
- SAR values.

Verify bidi isolation, readable wrapping, and correct direction of technical values.

## Test Record Format

For each scenario record:

| Field | Entry |
|---|---|
| Scenario | — |
| Device / OS | — |
| Browser / version | — |
| Viewport / orientation | — |
| Direction | — |
| Tester | — |
| Date | — |
| Expected | — |
| Result | PASS / FAIL / NOT_TESTED |
| Screenshot/video | — |
| Severity | — |
| Bug report | — |
| Retest result | — |

## Public Menu — Required Scenarios

### 1. Theme coverage

Run each existing public theme:
- Essential
- Editorial
- Noir
- Heritage/Taste
- Gallery

Expected: each theme retains its intended identity, readable hierarchy, correct RTL/LTR behavior, and no unintended horizontal scrolling or clipped content.

### 2. Menu interaction

Check:
- QR/public entry.
- Category browsing.
- Product browsing and scrolling.
- Product detail.
- Options/modifiers where configured.
- Item notes where supported.
- Price and SAR formatting.
- Availability state.
- Language switch.
- Back navigation.

Expected: actions are reachable by touch, content does not jump or clip, and no unsupported action is presented as available.

### 3. Content stress

Use long Arabic item/restaurant/category names and mixed-direction values.

Expected: hierarchy remains readable; text wraps or truncates without hiding required information or actions.

### 4. Motion and errors

Where safely available:
- reduced-motion preference;
- loading state;
- recoverable error;
- empty/unavailable state.

Expected: state change remains understandable and motion does not block completion.

## Studio — Required Scenarios

Use an authorized test account only.

### 5. Authentication and shell

- Sign in through the approved test flow.
- Verify Studio Shell.
- Verify restaurant/branch context.
- Verify desktop navigation where applicable.
- Verify mobile bottom navigation.
- Open More surface and close it normally and with Escape where supported.
- Refresh and use browser Back/Forward.

Expected: no unauthorized content appears; active workspace state is correct; mobile navigation does not obscure content.

### 6. Studio Home

Check:
- initial loading;
- populated state;
- empty state where safely reproducible;
- error/retry where safely reproducible;
- long restaurant/branch names;
- Arabic/English/mixed values;
- primary actions.

Expected: only real available data/capabilities are presented; no fake metrics or actions appear.

### 7. Studio Menu

Check:
- Menu Workspace loading/populated/empty/error boundaries;
- search and filters;
- category/availability controls;
- item/category actions;
- Options;
- Preview;
- QR;
- **Import action at compact phone width**.

Expected for Import: visible, enabled when the existing fixture permits it, touch reachable, keyboard reachable where applicable, accessible name present, and no horizontal page overflow. Existing import behavior must remain unchanged.

### 8. Growth and Customers

Check `/studio/growth` and `/studio/guests`.

Expected: evidence/status language remains honest; unsupported capabilities are clearly unavailable rather than presented as dead or fake destinations.

### 9. Orders and Settings

Where enabled by the authorized test account:
- Orders;
- Settings and verified settings sections.

Check navigation, filters, actions, loading/error/empty/denied states, and back/forward behavior.

Do not perform destructive order/settings actions unless separately authorized.

### 10. Keyboard and browser behavior

Where a physical keyboard is available:
- Tab through navigation and primary actions.
- Confirm visible focus.
- Activate buttons/links by keyboard.
- Confirm Escape closes supported sheets/dialogs.
- Verify focus returns appropriately where the existing component supports restoration.

## Platform Admin — Required Scenarios

Use an authorized Platform Admin test account.

### 11. Admin overview and child routes

Check `/admin` and every currently verified Admin child route.

Expected:
- grouped navigation is usable on mobile and desktop;
- active route is clear;
- `aria-current` semantics remain correct where observable;
- tables remain usable through deliberate horizontal scrolling when necessary;
- filters and actions are reachable;
- no clipped content or fixed-navigation overlap occurs.

### 12. Legacy Admin query compatibility

Open:
- `/admin?tab=orders`

Expected: it resolves to the verified orders workspace, removes the legacy tab parameter according to the existing route contract, and preserves unrelated supported query state.

### 13. Direct URLs and navigation

Open verified child URLs directly, then test Back/Forward and refresh.

Expected: URL and active workspace remain synchronized; authorization boundaries remain enforced.

### 14. Denied behavior

If a safe non-Admin test account is available and explicitly authorized, verify that Admin access is denied without leaking protected platform data.

If no such account is available, mark NOT_TESTED; do not create or alter accounts merely for this protocol.

## Release-Stage Viewport Targets

Use representative device widths corresponding to the automated W7.10 matrix:
- 320×800
- 360×800
- 390×844
- 430×932
- 768×1024
- 1024×768
- 1280×800
- 1440×900 where applicable

Physical device dimensions need not equal these exact CSS viewports; record the actual viewport and device scale factor when available.

## Stop Rules

- Do **not** test against Production until an authorized human approves deployment.
- Do not use real customer data unless explicitly authorized.
- Do not modify Production data.
- Do not execute destructive actions without explicit authorization.
- Do not test payment, subscription, deletion, archival, or other irreversible behavior merely for visual QA.
- Do not expose secrets, tokens, private URLs, or customer PII in screenshots.
- Do not mark device QA complete without real-device evidence.
- A passing desktop/Playwright result is not a substitute for physical Android/iOS QA.

## Completion Gate

Physical QA is complete only when all required scenarios have PASS/NOT_TESTED dispositions with evidence, all failures have issue records and retests, and an authorized human accepts any explicitly deferred scenario.

Current state: **PENDING_RELEASE_STAGE**.
