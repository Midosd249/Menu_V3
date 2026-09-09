# Menu V3 — P2 Final Human / Device Gate

**Date:** 2026-09-09  
**Scope:** Final human/device verification gate after P0/P1 production hardening  
**Branch:** `main`  
**Baseline:** `846c6894d454307672192fdb033e5c91932216ad`

## Status

**P2 — IN PROGRESS / MANUAL DEVICE EVIDENCE REQUIRED**

This task does not reopen or redesign the five canonical themes. It verifies the existing public-menu and Owner/customer flows after P0/P1 hardening.

## Verified repository-side contracts

- Quick Add remains conservative: direct add is limited to eligible available simple products.
- Configurable products remain on the existing details/options flow.
- Item Notes remain bounded to 500 characters and are carried through the existing public order path.
- Cart remains shared with the canonical public order flow.
- Public order pricing and product/variant/modifier validation remain server-side.
- Public-order abuse controls and idempotency are present after P0 hardening.
- Existing browser QA already covers the five protected themes across mobile, tablet, and desktop.

## P2 verification matrix

| Area | Required evidence | Current status |
|---|---|---|
| Android small/standard/large | Real device rendering | BLOCKED — device not available to connector |
| iOS small/standard/large | Real device rendering | BLOCKED — device not available to connector |
| Arabic RTL | Real-device/manual observation | UNKNOWN |
| English LTR | Real-device/manual observation | UNKNOWN |
| Mixed Arabic/English | Real-device/manual observation | UNKNOWN |
| Long product names | Real-device/manual observation | UNKNOWN |
| Long SAR prices | Real-device/manual observation | UNKNOWN |
| Missing images | Real-device/manual observation | UNKNOWN |
| Product details/options | Real-device interaction | UNKNOWN |
| Quick Add | Real-device interaction | UNKNOWN |
| Item Notes | Real-device interaction | UNKNOWN |
| Cart empty/populated | Real-device interaction | UNKNOWN |
| Order success/error states | Real-device interaction | UNKNOWN |
| Sticky/floating controls | Real-device observation | UNKNOWN |
| Safe areas | Real-device observation | UNKNOWN |
| QR camera scan | Physical camera scan | BLOCKED — no physical camera access |
| Screen reader | Manual TalkBack/VoiceOver observation | BLOCKED — assistive technology not exposed |
| Owner keyboard traversal | Manual authenticated keyboard test | BLOCKED — authenticated browser session not exposed |
| Opera/browser-specific behavior | Manual browser test | BLOCKED — browser not exposed |

## Evidence boundary

Repository source, tests, and CI can prove implementation contracts and Chromium/browser behavior, but they cannot prove physical-device pixels, camera scanning, or manual assistive-technology output. These items therefore remain explicitly `UNKNOWN` or `BLOCKED` rather than being marked passed.

## Release rule

P2 is not marked `DONE` until the remaining human/device evidence is collected. No production deployment is triggered by this documentation task.

## Exact next action

Open the current production menu on a real Android device and execute the matrix above. Record screenshots/video for any failure, then fix only reproducible defects and rerun the relevant quality gates.
