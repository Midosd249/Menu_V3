# PROJECT_STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Current Position
- G1–G7.2 completed work remains protected.
- **Premium Theme System — DONE / VERIFIED / MERGED.**
- **Theme 1 — Essential — DONE / VERIFIED / MERGED; no new refinement work is active.**
- **Theme 2 — Editorial — DONE / VERIFIED / MERGED.**
- **Theme 3 — Noir — refinement IN_PROGRESS; other themes remain protected.**
- Authentication reconciliation and the qualified `extensions.crypt(...)` fix remain implemented and live authentication was verified by the user after deployment.
- The reserved `nafas` demo fixture remains the source for the marketing/theme-preview demo when no branch is requested.
- **Visual/Functional Quality System — DONE / VERIFIED / MERGED.** Permanent audit, research-log, checklist, and template-brief rules are part of the repository workflow.
- **External Theme Preview QR Mode — DONE / VERIFIED.** All five themes can be opened against real branch data through a non-persistent `theme` preview query without changing saved theme entitlement.

## Current Atomic Task
### Theme 3 — Noir premium refinement — IN_PROGRESS

**Objective:** complete one evidence-based premium refinement of the existing dark `noir` theme using the existing `fine-dining-hospitality` family and shared public-menu capabilities, without modifying the other themes or weakening product/security behavior.

**Design decision:** retain the existing structured product-card system. The repository source reviewed does not currently contain the reported circular product-card implementation, so a circular-to-grouped rewrite is not authorized speculatively. Improve hierarchy, typography, spacing, image stability, action visibility/styling, and dark first-paint resilience within the existing contract.

## Verification State
- **VERIFIED:** current theme registry contains five themes: `essential`, `editorial`, `noir`, `heritage`, `gallery`.
- **VERIFIED:** `noir` maps to `fine-dining-hospitality`.
- **VERIFIED:** shared public-menu contains supported product details, modifiers, cart/order, search/category navigation, language, and configured customer-action behavior.
- **VERIFIED:** `src/theme-noir.css` already defines a dark cinematic system with sticky navigation, structured product cards, focus states, and reduced-motion handling.
- **VERIFIED:** Part 1 permanent design/functional quality documentation exists and is active.
- **UNKNOWN:** live browser/device screenshots, QR scanning, Opera reproduction, and post-hydration visual evidence are unavailable in the current agent environment.
- **UNKNOWN:** root cause of the reported Opera white background until reproduced with an actual Opera session.
- **UNKNOWN:** root cause of the reported initial old-theme flash until first-paint/server/browser evidence is captured.
- **BLOCKED:** local runtime gates cannot be executed from this GitHub-only environment unless an executable repository runtime becomes available.

## Session Log
- 2026-09-05 — Re-read repository guidance, continuity files, theme registry, public-menu route/template architecture, shared public-menu, theme controller, Noir CSS, and package verification scripts.
- 2026-09-05 — Researched W3C WCAG 2.2, Google Search Central LocalBusiness guidance, web.dev responsive-image/CLS guidance, and Saudi/MENA public digital-menu examples including Al Qaima, Nasj Menu, and TableGreet.
- 2026-09-05 — Added permanent premium digital-menu design intelligence and evidence rules to repository guidance and created the design-intelligence and Noir audit records.
- 2026-09-05 — Began the Noir refinement milestone using the existing theme/template contract; no other theme was redesigned.

## Exact Next Task
Complete and verify the Noir refinement implementation, then run the repository quality gates and obtain browser/device evidence for the remaining visual claims before declaring the milestone `DONE` or `BLOCKED`.
