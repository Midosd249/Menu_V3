# W8 Visual Delivery QA — 2026-09-15

## Incident scope

This QA record covers the W8 Midnight Ink & Sand visual-delivery correction only.

## Acceptance matrix

| Area | Required evidence | Status |
|---|---|---|
| Studio scope | Explicit Studio runtime landmark matches correction selector | PENDING CI |
| Studio canvas | Computed background `rgb(242, 237, 227)` | PENDING CI |
| Studio surface | Computed semantic surface `#fbf8f2` | PENDING CI |
| Studio ink | Computed semantic ink `#1d2421` | PENDING CI |
| Studio navigation | Computed background `rgb(31, 37, 34)` | PENDING CI |
| Studio active navigation | Computed background `rgb(44, 52, 48)` and white foreground | PENDING CI |
| Studio focus | Semantic ring resolves to `#8b642e` | PENDING CI |
| Platform Admin scope | Existing explicit admin landmark matches W8 scope | PENDING CI |
| Platform Admin canvas/navigation | Computed Midnight Ink & Sand values | PENDING CI |
| RTL/LTR | Existing browser QA remains green | PENDING CI |
| Responsive | Existing 320–1440px coverage remains green where workflow supports it | PENDING CI |
| Public Menu isolation | No public selectors/themes changed | VERIFIED BY DIFF/CONTRACT |
| Dependencies | No dependency or lockfile changes | VERIFIED BY DIFF |
| Production | No deployment action performed by correction workflow | VERIFIED |

## Browser evidence strategy

The existing authenticated local browser fixtures are the safe runtime proof surface because the public Production deployment cannot be used to bypass application authentication. The correction therefore adds computed-style assertions to the existing Studio and Platform Admin browser suites rather than weakening authentication.

The browser assertions inspect the rendered DOM and `getComputedStyle()` values, not only source strings.

## Deployment evidence

The current verified Production deployment is associated with `main` at `6c673606f47c638c8d6f301be58bd792986692eb`. The correction branch must not be described as deployed until a later normal main-linked deployment exists automatically after merge.

## Release boundary

No Vercel redeploy, configuration change, environment change, database change, Supabase change, authentication change, or production side effect is part of this correction.

Real-device Android/iOS QA remains `PENDING_RELEASE_STAGE` after successful main delivery.
