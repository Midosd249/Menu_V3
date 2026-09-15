# W7.10 Full-Product Responsive QA

## Status
`PASSED_WITH_RELEASE_STAGE_DEVICE_QA_PENDING` — 2026-09-15.

## Final evidence
- `VERIFIED`: final W7.10 CI run `34932493596` / run 1655 completed successfully.
- `VERIFIED`: run 1655 belongs to implementation HEAD `16d11eae278641062503c0a6d23d60677e6c7cb3`.
- `VERIFIED`: W7.9 final verification remains `34926288817` / run 1646 — PASS.
- `UNKNOWN`: physical Android/iOS device behavior; release-stage evidence remains pending.

## Responsive implementation findings
### F1 — WorkspaceHeader narrow-width wrapping
- `VERIFIED`: the shared WorkspaceHeader could retain a horizontal row at narrow widths.
- Fix: stack the header by default and restore the existing horizontal layout from `sm`; action controls wrap within available width.
- Scope: presentation only.

### F2 — FilterBar action wrapping
- `VERIFIED`: the shared FilterBar action wrapper did not explicitly wrap.
- Fix: enable wrapping on the existing action group.
- Scope: presentation only.

### F3 — Studio Shell 320px header overflow
- `VERIFIED`: a real 320px Studio overflow was measured before the final fix: `scrollWidth=344`, `clientWidth=320`.
- `VERIFIED`: diagnostic evidence identified the Studio Shell top-header action group (Menu Import, notifications, language control, and user controls) as the source of the width pressure.
- Fix: `src/components/studio-shell.tsx` now gives the mobile action group `w-full min-w-0 max-w-full flex-wrap` and restores compact horizontal sizing from `sm`.
- Fix: `src/components/studio-menu-workspace.tsx` adds `min-w-0`/containment to the Menu header row/action group while preserving Import behavior.
- `VERIFIED`: no business/data/permission/route behavior changed.

### F4 — Studio browser readiness selector
- `VERIFIED`: the earlier generic `<main>` readiness assertion did not match the actual Studio Shell landmark.
- Fix: `tests/w7-10-responsive-studio-browser.spec.ts` uses the actual `role="banner"` readiness landmark while retaining route, viewport, overflow, and accessibility assertions.
- Scope: test-only.

## Final browser matrix
The final CI workflow executed the existing public, Studio, and Platform Admin browser suites with the W7.10 matrix.

| Viewport | Public themes | Studio | Platform Admin | Direction/content |
|---|---|---|---|---|
| 320×800 | PASS | PASS | PASS where route fixture supports it | RTL + responsive checks |
| 360×800 | PASS | PASS | PASS where route fixture supports it | RTL + responsive checks |
| 390×844 | PASS | PASS | PASS | RTL/LTR + accessibility/overflow |
| 430×932 | PASS | PASS | PASS | RTL/LTR + accessibility/overflow |
| 768×1024 | PASS | PASS | PASS | RTL/LTR + accessibility/overflow |
| 1024×768 | PASS | PASS | PASS where supported | responsive/overflow |
| 1280×800 | PASS | PASS | PASS | RTL/LTR + active navigation |
| 1440×900 | PASS | PASS where suite supports it | PASS where suite supports it | desktop responsive checks |

The public template QA explicitly reports no horizontal overflow, accessible button/link names, visible headings, document language/direction, and zero runtime console errors across all five themes and the full viewport matrix.

## Areas verified
- Public Menu: all five themes.
- Studio Shell/Home/Menu/Growth/Customers.
- Platform Admin and all verified Admin child routes covered by the existing authorized fixture.
- Legacy Admin compatibility and route behavior remained covered by the W7.9 suite.

## Accessibility checks actually executed
- accessible names for visible links/buttons;
- `aria-current` active navigation semantics;
- keyboard focus on primary navigation and affected controls;
- RTL and supported LTR rendering;
- no horizontal page overflow;
- mobile navigation presence/visibility;
- reduced-motion support in public template QA;
- runtime console error checks in public template QA.

This is not a WCAG certification claim.

## Final quality gates
- route generation: PASS — `npx vite build --mode development`.
- generated route freshness: PASS — `git diff --exit-code -- src/routeTree.gen.ts`.
- typecheck: PASS.
- full repository tests: PASS — 266 tests.
- W7.4–W7.10 focused contracts: PASS.
- lint: PASS — 0 errors; existing warnings remain.
- production build: PASS.
- Playwright runtime/Chromium: PASS.
- public all-theme browser QA: PASS.
- Studio Shell/Home/Menu/Growth/Customers + W7.10 responsive QA: PASS — 9 tests.
- Platform Admin + W7.10 responsive QA: PASS — 20 tests.
- performance audit: PASS; baseline artifact uploaded.
- diagnostics/artifacts: PASS.
- cleanup: PASS.

## Protected boundaries
No production database/schema, Supabase, RLS, authentication, authorization, permissions, subscriptions/entitlements, AI, orders business logic, public-menu business logic, Studio business logic, Admin business logic, dependencies, route architecture, Vercel, merge, or deployment changed for the responsive pass.

## Real-device readiness
`PENDING_RELEASE_STAGE`: Chromium viewport evidence is not physical-device evidence. Physical Android/iOS testing remains a release-stage gate.

## Next phase
W7.11 remains `NOT STARTED`. Do not begin it as part of W7.10.
