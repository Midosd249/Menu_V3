# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main
- VERIFIED: canonical `main` is `9995848b747bdb238e45b7ed6fe6b551c6779fcc` as directly fetched from GitHub on 2026-09-14.
- VERIFIED: latest main commit mounts the shared nutrition disclosure on the published QR menu route and adds a protecting test.
- VERIFIED: R9 guest relationship work remains protected in history; current main is newer than the prior continuity SHA.
- VERIFIED: R8 and all preceding protected work remain in main.

## Completed Strategic Milestones
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for activation/measurement implementation; outcome pending real exposure.
- R8.1 Action Loop — CLOSED / VERIFIED / MERGED.
- R8.2 Evidence-based Recommendations — CLOSED / VERIFIED / MERGED.
- R8.3 Experiment Expansion — CLOSED / VERIFIED / MERGED.
- R8.4 Evidence-based Upsell — CLOSED / VERIFIED / MERGED.
- R8.5 Restaurant Discovery — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir theme hardening — CLOSED / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.

## R2 — Menu Intelligence Product Layer
STATUS: CLOSED / VERIFIED

```text
R2.1 Menu Health / Completeness       DONE
R2.2 Problem Detection                DONE
R2.3 Priority + Actionable Fixes      DONE
R2.4 Owner Menu Intelligence UX       DONE
R2.5 Verified Analytics Intelligence  DONE
R2.6 Professional Analytics Reports   DONE
R2.7 WhatsApp Report Sharing          DONE
```

## R4 — Owner Intelligence
STATUS: CLOSED / VERIFIED

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              DONE / VERIFIED
```

## R5 — Growth Extensions
STATUS: CLOSED / VERIFIED

- Deterministic distribution action for published zero-activity menus.
- Uses only existing OwnerAnalytics evidence and verified publication state.
- Reuses `/studio/brand`; no duplicate dashboard or route.
- No fabricated metrics or autonomous messaging.

## R6 — Experiments
STATUS: CLOSED / VERIFIED — ACTIVATION COMPLETE; OUTCOME PENDING REAL EXPOSURE

- Experiment: `whatsapp-cta-v1`.
- Stable `control` / `prominent` assignment from existing anonymous session id.
- Server derives the recorded variant.
- Participation is limited to published menus with configured WhatsApp.
- Existing `menu_events` remains canonical through nullable experiment fields.
- Preview/owner-preview does not activate or record the experiment.
- Primary: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Collection target: 50 exposed sessions per variant.
- Directional interpretation only; no statistical significance claim.

## R7 — Initial Evidence Review
STATUS: IN PROGRESS — NON-BLOCKING / INSUFFICIENT EXPOSURE

- VERIFIED: canonical table is `menu_v3.menu_events`.
- VERIFIED: current observed exposure remains 1 distinct `control` session and 2 distinct `prominent` sessions.
- VERIFIED: no treatment decision is justified; continue eligible real exposure.
- VERIFIED: no synthetic traffic is used and no statistical significance claim is made.

## R8 — Closed-Loop Menu Growth Engine
STATUS: CLOSED / VERIFIED / MERGED

- VERIFIED: `/studio/growth` provides the unified owner-facing Observe → Act → Measure surface.
- VERIFIED: recommendations are deterministic and evidence-bound.
- VERIFIED: thin traffic is treated as insufficient evidence.
- VERIFIED: recommendations route to existing supported Studio destinations; no automatic menu mutation.
- VERIFIED: R8.1–R8.5 are complete and protected.

## R9 — Guest Relationships
STATUS: CLOSED / VERIFIED / MERGED

- VERIFIED: PR #136 merged the R9 guest relationship batch.
- VERIFIED: owner-facing Studio guest relationship surface covers Guest CRM, Loyalty, Campaigns, Feedback, and Retention.
- VERIFIED: relationship data is server-authorized and tenant/branch scoped; owner/admin are the elevated roles used by the existing permission contract.
- VERIFIED: loyalty accounts and ledger, owner-controlled campaign drafts, and feedback records have RLS enabled and public access revoked.
- VERIFIED: retention and relationship overview are derived from existing guest/order data; no synthetic evidence is introduced.
- VERIFIED: autonomous outbound messaging, automatic rewards, autonomous campaign execution, predictive claims, and pricing mutation are excluded.
- VERIFIED: prior quality run 1453 passed the configured route generation, typecheck, tests, lint, build, Playwright and browser-quality stages.

## R10
STATUS: DEFERRED / NOT STARTED

R10 is intentionally not started. Do not begin R10 until the owner explicitly authorizes it.

## AI Infrastructure
- VERIFIED: server-side provider abstraction.
- VERIFIED: structured routing for Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing for Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: schema validation, rate limiting, prompt-injection safeguards, and human-review boundaries.
- VERIFIED: server-only credentials.

## Production / Commercial Readiness
STATUS: IN PROGRESS — EXTERNAL EVIDENCE REMAINING

- VERIFIED: repository-side R9 implementation and CI quality gates are complete.
- VERIFIED: GitHub `main` contains the protected product work.
- UNKNOWN: direct current Vercel Production environment-variable values.
- UNKNOWN: current Production deployment commit/state requires direct Vercel evidence.
- UNKNOWN: physical real-device Production QA.
- BLOCKED: unnecessary Vercel deployment retries must not be attempted while the known free daily deployment quota is exhausted.

## Release-Only Vercel Policy
Normal path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

Do not use Vercel as the normal development loop. Do not infer production state from GitHub or HTTP 200. Do not randomly retry quota/rate/build failures.

## Current Release State
- VERIFIED: `main` is `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: the latest main commit was directly fetched from GitHub.
- UNKNOWN: direct current Vercel Production deployment state and environment configuration.
- UNKNOWN: physical real-device Production QA.

## Current Strategic Direction
```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
→ Experiments
→ Guest Relationships
→ Production / Commercial Readiness
```

## W7 — Internal Product Experience Architecture
STATUS: W7.1 COMPLETE / W7.2 VERIFIED / W7.3 DONE / W7.4 DONE / W7.5 DONE / W7.6 DONE / W7.7 DONE / W7.8 DONE — CURRENT WORKING BRANCH

### W7.1 — COMPLETE / ANALYSIS ONLY
- VERIFIED: audited current Studio/Admin architecture from `main` SHA `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: created W7.1 source sweep, IA audit, route map, and wireframe documents.
- VERIFIED: `/admin` is a tab-driven monolith and `/studio/growth` + `/studio/guests` source routes exist.
- VERIFIED: no UI implementation or route change occurred.

### W7.2 — ACCEPTED / VERIFIED
- VERIFIED: created route-independent shared internal primitives in `src/components/internal-design-system.tsx`.
- VERIFIED: created W7.2 design-system documentation and static contract coverage.
- VERIFIED: no pages were migrated and no Studio/Admin navigation behavior changed during W7.2.
- VERIFIED: no route, backend, RLS, auth, permissions, subscription, AI, orders, or public-menu code changed.
- VERIFIED: no dependency was added.
- VERIFIED: route generation run `34898237425` generated Growth and Guests and passed freshness, typecheck, tests, lint, and production build.
- VERIFIED: generator-produced route tree commit `0b4057bbfabadff156fd7f2fd48ecf1e1d8c118d` was used; no hand edit.
- `DetailPanel` and `ConfirmDialog` remain deferred.

### W7.3 — DONE / VERIFIED
- VERIFIED: transformed `src/components/studio-shell.tsx` into the approved workspace architecture.
- VERIFIED: desktop primary = Home, Menu, Orders, Growth, Customers, Settings.
- VERIFIED: contextual groups expose only real routes for Menu, Growth, Customers, Appearance/Publishing, and Settings.
- VERIFIED: mobile primary = Home, Menu, Orders, Growth, More using W7.2 `MobileBottomNav`.
- VERIFIED: existing permission gates remain active.
- VERIFIED: Platform Admin remains separate.
- VERIFIED: accepted GitHub Actions run `34905256209` passed all required quality gates and actual `/studio` browser QA.
- VERIFIED: temporary PGlite fixture solved the browser-only schema blocker and was removed from the runner; no production migration was committed.
- VERIFIED: physical device QA remains release-stage evidence only.

### W7.4 — DONE / VERIFIED
- VERIFIED: created `src/components/studio-home.tsx` as the focused operational Home presentation component.
- VERIFIED: `/studio/` now renders `StudioHome` without changing the route URL.
- VERIFIED: Home reads only existing `useStudio`, `getOwnerAnalytics`, `getOrdersDashboard`, and `buildMenuGrowthAdvisor` sources.
- VERIFIED: added W7.4 focused contract test and browser spec.
- VERIFIED: Home contains loading, error, empty, populated, RTL/LTR, responsive, focus, and semantic progress states.
- VERIFIED: no fabricated metrics, sample orders, revenue, guests, conversion rates, recommendations, charts, rankings, or activity were added.
- VERIFIED: W7.4 final-head quality/browser evidence was completed before W7.5 began.

### W7.5 — DONE / VERIFIED
- VERIFIED: `/studio/menu` is a focused Menu Workspace at the existing route.
- VERIFIED: real restaurant/branch context, menu counts/state, search, category/availability filters, existing item/category actions, Options, Import, Preview, QR, AI draft assistance, and Menu QA are preserved.
- VERIFIED: focused tests `tests/w7-5-menu-workspace.test.mjs` and `tests/w7-5-menu-workspace-browser.spec.ts` are present.
- VERIFIED: final current-head CI run `34908577942` passed route generation/freshness, typecheck, 266 repository tests, W7.4/W7.5 tests, lint, production build, Playwright/Chromium, public all-theme QA, Studio Shell/Home/Menu browser QA, performance audit, diagnostics, and cleanup.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

### W7 Continuity Reconciliation — 2026-09-15
- VERIFIED: final W7.5 state before W7.6 was branch `w7-2-internal-design-system`, HEAD `193912be0a2fa9c7fadcd70995108a4ec9166722`, PR #146 Draft, no merge/deployment.
- VERIFIED: continuity records were reconciled before W7.6 implementation began.

### W7.6 — Growth Workspace
STATUS: DONE / VERIFIED

- VERIFIED: current working HEAD is `3fe58decd1f0c39806bd037e717778c4d58d01ab`.
- VERIFIED: current-head quality run `34910495789` passed route generation/freshness, typecheck, 266 repository tests, W7.4/W7.5/W7.6 focused tests, lint, production build, Playwright/Chromium, public all-theme QA, Studio Shell/Home/Menu/Growth browser QA, performance audit, diagnostics, and cleanup.
- VERIFIED: Growth Workspace unifies existing Growth/Intelligence/Actions/Analytics/Reports around Observe → Understand → Act → Measure.
- VERIFIED: existing sources only; no new backend, analytics contract, recommendation engine, experiment engine, charting dependency, or AI business logic.
- VERIFIED: Reports is contextual only and no `/studio/experiments` route was invented.
- VERIFIED: no fake metrics, scores, trends, charts, impact, ROI, conversion claims, experiment results, or production sample data were introduced.
- VERIFIED: the W7.3 More-sheet selector was corrected against the actual `fixed inset-0 z-40` runtime container; no runtime behavior changed.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

### W7.7 — Customers Workspace — DONE / VERIFIED — 2026-09-15
- VERIFIED: current-head quality run `34914024416` / run 1597 passed against implementation HEAD `a89cc5110175d633ac6f3379fdb1ce6ce27fd4fa`.
- VERIFIED: all configured route, typecheck, repository test, W7.4/W7.5/W7.6/W7.7 focused test, lint, build, Playwright, public browser, Studio browser, performance, diagnostics, and cleanup stages passed.
- VERIFIED: Customers browser QA reached `/studio/guests` in the real application using the CI PGlite fixture and auth-disabled local mode.
- VERIFIED: 390×844, 430×932, 768×1024, and 1280×800 were covered; desktop active Customers navigation was asserted at desktop only, mobile navigation at 390×844; RTL/LTR, focus, overflow, and unsupported relationship links passed.
- VERIFIED: final correction was test-only; no runtime Customers behavior changed.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

### W7.8 — Platform Admin Information Architecture and Admin Shell — DONE / VERIFIED — 2026-09-15
- VERIFIED: discovery covered all 12 existing Admin tabs, their real data/action sources, permission boundary, state handling, and current presentation.
- VERIFIED: grouped navigation implemented inside `/admin`: Overview; Customers (Restaurants, Clients, Branches); Commerce (Orders, Subscriptions, Service Requests); Sales (Leads, Projects); Intelligence (Analytics, Activity); System (existing combined system/security view).
- VERIFIED: existing tab state, data hooks, actions, and Platform Admin authorization are preserved.
- VERIFIED: no separate Security, Platform Health, or Configuration destinations were created because the current Admin source does not expose those as independent capabilities.
- VERIFIED: final current-head quality run `34915257732` / run 1601 passed all route, test, lint, build, Playwright, public browser, Studio browser, Platform Admin browser, performance, diagnostics, and cleanup stages.
- VERIFIED: Platform Admin browser QA reached the real `/admin` application in the authorized CI development-user state and covered 390×844, 430×932, 768×1024, 1280×800, RTL structure, grouped navigation, active semantics, keyboard focus, all existing tab reachability, and no horizontal overflow.
- VERIFIED: no fake Admin metrics, totals, health scores, activity, security events, charts, recommendations, or operator data were added.
- VERIFIED: no production database/schema, Supabase, RLS, auth, permissions, subscriptions, AI provider/business logic, orders business logic, public menu behavior, Studio business logic, dependencies, merge, or deployment changed.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

## Exact Next Task
### W7.9 — Platform Admin Route Architecture / Route Splitting
Only W7.9 is authorized next. W7.10 full-product mobile pass, W7.11 final visual QA, merge, deployment, database work, and release work remain out of scope.
