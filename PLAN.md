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
STATUS: W7.1 COMPLETE / W7.2 VERIFIED / W7.3 DONE / W7.4 DONE / W7.5 DONE / W7.6 DONE / W7.7 DONE / W7.8 DONE / W7.9 DONE — CURRENT WORKING BRANCH

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
- VERIFIED: generator-produced route tree was used; no hand edit.

### W7.3 — DONE / VERIFIED
- VERIFIED: transformed `src/components/studio-shell.tsx` into the approved workspace architecture.
- VERIFIED: desktop primary = Home, Menu, Orders, Growth, Customers, Settings.
- VERIFIED: contextual groups expose only real routes; Reports remains outside primary Studio navigation.
- VERIFIED: mobile primary = Home, Menu, Orders, Growth, More.
- VERIFIED: existing permission gates remain active and Platform Admin remains separate.
- VERIFIED: accepted GitHub Actions run `34905256209` passed all required quality gates and actual `/studio` browser QA.
- VERIFIED: physical device QA remains release-stage evidence only.

### W7.4 — DONE / VERIFIED
- VERIFIED: `/studio/` is the focused operational Home using existing `useStudio`, `getOwnerAnalytics`, `getOrdersDashboard`, and `buildMenuGrowthAdvisor` sources.
- VERIFIED: Home has honest loading/error/empty/populated, RTL/LTR, responsive, focus, semantic progress, and permission-aware states.
- VERIFIED: no fabricated business metrics or sample activity were added.

### W7.5 — DONE / VERIFIED
- VERIFIED: `/studio/menu` is a focused Menu Workspace using existing menu data and actions.
- VERIFIED: Options, Import, Preview, and QR are contextual real destinations; no dead routes were invented.
- VERIFIED: final W7.5 CI run `34908577942` passed route generation/freshness, typecheck, 266 tests, focused W7.4/W7.5 tests, lint, build, Playwright/Chromium, public all-theme browser QA, Studio Shell/Home/Menu QA, performance audit, diagnostics, and cleanup.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

### W7.6 — Growth Workspace — DONE / VERIFIED
- VERIFIED: current working HEAD `3fe58decd1f0c39806bd037e717778c4d58d01ab`.
- VERIFIED: final quality run `34910495789` passed route generation/freshness, typecheck, 266 repository tests, focused W7.4/W7.5/W7.6 tests, lint, build, Playwright/Chromium, public all-theme QA, Studio Shell/Home/Menu/Growth QA, performance, diagnostics, and cleanup.
- VERIFIED: Growth unifies existing Growth/Intelligence/Actions/Analytics/Reports around Observe → Understand → Act → Measure.
- VERIFIED: existing sources only; no new backend, analytics contract, recommendation engine, experiment engine, AI business logic, charting dependency, or fabricated data.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

### W7.7 — Customers Workspace — DONE / VERIFIED
- VERIFIED: final quality run `34914024416` / run 1597 passed against implementation HEAD `a89cc5110175d633ac6f3379fdb1ce6ce27fd4fa`.
- VERIFIED: Customers browser QA reached `/studio/guests` in the real application using the CI fixture and auth-disabled local mode; responsive, RTL/LTR, focus, overflow, and unsupported relationship links passed.
- VERIFIED: final correction was test-only and no runtime Customers behavior changed.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

### W7.8 — Platform Admin IA and Admin Shell — DONE / VERIFIED
- VERIFIED: discovery confirmed the real `/admin` tab model, data sources, server-side Platform Admin authorization, existing actions, loading/error/empty boundaries, and absence of separate Security/Platform Health/Configuration capabilities.
- VERIFIED: grouped IA is implemented inside `/admin` without route splitting: Overview; Customers; Commerce; Sales; Intelligence; System.
- VERIFIED: final quality run `34915603884` / run 1602 passed route generation/freshness, typecheck, 266 repository tests, W7.4–W7.8 contracts, lint, production build, Playwright/Chromium, public all-theme QA, Studio Shell/Home/Menu/Growth/Customers QA, Platform Admin browser QA, performance baseline, diagnostics, and cleanup.
- VERIFIED: Platform Admin browser QA reached the actual `/admin` application in the authorized CI development-user state across 390×844, 430×932, 768×1024, and 1280×800.
- VERIFIED: no fake Admin metrics, totals, health scores, activity, security events, charts, recommendations, or operator data were added.
- UNKNOWN: physical real-device QA remains release-stage evidence.

### W7.9 — Platform Admin Route Architecture / Route Splitting — DONE / VERIFIED
- VERIFIED: `/admin` remains the authorized Overview/Shell and `/admin/$workspace` is the whitelisted child-route adapter for all 11 real Admin workspaces.
- VERIFIED: `setTab(next)` remains intact and URL synchronization is additive through `navigate({ to: ADMIN_ROUTES[next] })`.
- VERIFIED: known legacy `/admin?tab=<value>` values normalize to the mapped route, `tab` is removed, unrelated query parameters are preserved through router serialization, and unknown values safely fall back to `/admin` with `replace: true`.
- VERIFIED: original Platform Admin browser blocker was `AUTH_DISABLED_FIXTURE_GAP`; CI now uses an isolated PostgreSQL fixture with compatible existing migrations, Supabase-compatible roles, and `dev-user` in `menu_v3.platform_admins`. No production schema or migration changed.
- VERIFIED: final remaining browser assertion was test-only and corrected to match actual TanStack Router serialization (`keep=%221%22` parses as `"1"`).
- VERIFIED: final quality run `34925141809` / run 1638 passed all route, freshness, typecheck, repository, W7.4–W7.9 contract, lint, production build, Playwright/Chromium, public, Studio, Platform Admin browser, performance, diagnostics, and cleanup stages.
- VERIFIED: no unsupported Admin detail routes or fabricated data, metrics, charts, health scores, security events, recommendations, or operator sample data were introduced.
- VERIFIED: no production database/schema, Supabase, RLS, authentication, authorization/permissions, subscriptions/entitlements, AI provider/business logic, orders business logic, public menu behavior, Studio business logic, dependencies, Vercel configuration, merge, or deployment changed.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

## Exact Next Task
### W7.10 — Full-Product Mobile and Responsive Pass
W7.10 is the next safe phase. W7.11, merge, deployment, database work, and release work remain out of scope until W7.10 is explicitly completed and verified.
