# W7.4 Home QA

## Required Verification

- route generation and generated route freshness;
- typecheck;
- repository tests;
- focused W7.4 Home contract tests;
- lint;
- production build;
- Studio Home Chromium browser QA at 390×844, 430×932, 768×1024, and 1280×800;
- Arabic RTL and supported English LTR;
- no horizontal overflow;
- loading/error/empty/populated behavior;
- real-data-only metrics and activity;
- permission-aware attention actions;
- keyboard/focus and semantic status checks.

## Browser Assertions

The browser spec verifies the Home page reaches the actual `/studio` route, renders its operational sections, maintains RTL, switches to LTR through the existing language control, keeps the menu-health progress semantics, and has no horizontal overflow across the required viewport matrix.

## Data Integrity Review

The Home implementation reads existing server functions and the existing Studio snapshot. It does not create sample orders, sample revenue, synthetic guests, fabricated conversion rates, fake recommendations, or placeholder performance values.

## Release Boundary

W7.4 is not merged or deployed by this task. Physical real-device QA remains a release-stage check after a coherent release batch reaches `main`.
