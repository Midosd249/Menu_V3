# W7.10 Full-Product Responsive Audit

## Status
`IN_PROGRESS` — 2026-09-15.

## Scope
W7.10 is a full-product mobile, responsive, RTL/LTR, accessibility, and real-device-readiness pass. It does not redesign the product or change business logic, routes, authorization, data contracts, dependencies, Supabase, database schema, RLS, Vercel, merge, or deployment.

## Verified baseline
- `VERIFIED`: branch `w7-2-internal-design-system`.
- `VERIFIED`: current baseline before W7.10 implementation is `d8ff2f2cfb275f4018080abc6e912d5b6d291dc0`.
- `VERIFIED`: W7.9 final CI run `34925141809` / run 1638 passed.
- `UNKNOWN`: physical real-device behavior; this remains release-stage evidence.

## Responsive matrix
Required browser evidence for W7.10:
- 320×800
- 360×800
- 390×844
- 430×932
- 768×1024
- 1024×768
- 1280×800
- 1440×900

Direction/content matrix:
- Arabic RTL
- English LTR where supported
- mixed Arabic/English labels
- URLs, emails, phones, IDs, dates, numbers, and SAR values inside Arabic UI

## Screen inventory
| Area | Routes/screens | Risk focus | Initial evidence | Status |
|---|---|---|---|---|
| Public Menu | public menu route + all five themes | narrow layout, images, actions, RTL/LTR, overflow | Existing all-theme QA covers mobile/tablet/desktop; W7.10 expands viewport matrix | `VERIFIED / TEST EXPANDED` |
| Studio Shell | `/studio` | mobile navigation, fixed bottom nav, More surface, header controls | W7.3 browser QA plus current source inspection | `VERIFIED / TEST EXPANDED` |
| Studio Home | `/studio/` | cards, action rows, loading/error/empty | W7.4 browser QA | `VERIFIED / TEST EXPANDED` |
| Studio Menu | `/studio/menu` | filters, header actions, search, tables, options | W7.5 browser QA + narrow-header source evidence | `INFERRED / FIX HARDENED` |
| Studio Growth | `/studio/growth` | filter/action wrapping, evidence cards | W7.6 browser QA | `VERIFIED / TEST EXPANDED` |
| Studio Customers | `/studio/guests` | cards, relationship states, navigation | W7.7 browser QA | `VERIFIED / TEST EXPANDED` |
| Studio Orders | `/studio/orders` | detail/table/filter density | Existing route + W7.10 route matrix | `TEST EXPANDED` |
| Studio Settings | `/studio/settings` and verified contextual settings routes | forms, team/branch controls, wrapping | Existing route + W7.10 route matrix | `TEST EXPANDED` |
| Platform Admin | `/admin` + 11 verified workspaces | grouped navigation, tables, filters, direct routes | W7.8/W7.9 authorized browser QA | `VERIFIED / TEST EXPANDED` |
| Shared design system | `src/components/internal-design-system.tsx` | mobile header/action wrapping, filters, tables, safe area | Static source inspection | `VERIFIED / FIX HARDENED` |

## Findings
### F1 — Shared WorkspaceHeader could keep a row layout at narrow widths
- `VERIFIED`: the prior shared `WorkspaceHeader` used a row layout by default and only changed alignment at `sm`.
- `INFERRED`: long Arabic titles plus action controls could compete for the same inline width at 320–430px.
- Severity: Medium responsive risk.
- Smallest safe fix: stack the header by default, restore the existing horizontal layout from `sm`, and allow action controls to wrap within the available width.
- Business logic impact: none.

### F2 — Shared FilterBar action group did not explicitly wrap
- `VERIFIED`: the shared action wrapper was `flex shrink-0` without `flex-wrap`.
- `INFERRED`: multiple action controls can force unnecessary horizontal pressure on narrow screens.
- Severity: Medium responsive risk.
- Smallest safe fix: add `flex-wrap` to the existing action wrapper.
- Business logic impact: none.

### F3 — Public template QA viewport coverage was incomplete for W7.10
- `VERIFIED`: the existing script covered 390×844, 768×1024, and 1440×900 only.
- Severity: Medium QA coverage gap.
- Smallest safe fix: expand the existing QA matrix to all W7.10 required viewports without changing product behavior.

### F4 — Studio/Admin browser coverage did not exercise the full W7.10 viewport matrix across all verified routes
- `VERIFIED`: W7.3–W7.9 browser suites used focused subsets of viewports/routes.
- Severity: Medium QA coverage gap.
- Smallest safe fix: add CI-only browser matrix coverage using the existing safe fixtures and servers.

## Accessibility checks
The W7.10 browser suites verify, where the existing rendered surface permits automated checks:
- visible accessible names for visible links/buttons;
- route active-state semantics via `aria-current`;
- keyboard focus on primary navigation;
- no horizontal page overflow;
- mobile navigation presence;
- RTL and supported LTR direction.

These checks are not a WCAG conformance claim. WCAG 2.2 Target Size (Minimum) requires at least 24×24 CSS pixels except for defined exceptions; important controls are expected to remain comfortably touchable above that baseline where practical. citeturn0search0

## Directional design principle
`VERIFIED / RESEARCH`: CSS logical start/end properties are preferable when layout should follow writing direction; MDN documents logical properties as direction-relative equivalents of physical left/right properties. citeturn1search0turn1search1

## Protected boundaries
No W7.10 change is allowed to modify production database/schema, Supabase, RLS, authentication, authorization, permissions, tenant/branch isolation, subscriptions, AI/business logic, orders logic, public-menu business logic, Studio business logic, dependencies, Vercel, merge, or deployment.

## Real-device status
`UNKNOWN / PENDING_RELEASE_STAGE`: Chromium viewport evidence is not physical Android/iOS device evidence. W7.10 may only claim browser/CI readiness; physical real-device QA remains a later release-stage gate.

## Evidence labels
- `VERIFIED`: directly supported by current branch source, existing CI evidence, or executed browser/test evidence.
- `INFERRED`: derived responsive risk not yet observed on physical hardware.
- `PROPOSED`: future improvement not required by this pass.
- `UNKNOWN`: not directly measured.
- `BLOCKED`: none at audit creation.
