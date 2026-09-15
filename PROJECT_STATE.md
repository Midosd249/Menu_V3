# PROJECT STATE

## Identity
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Product: Menu V3, Arabic-first bilingual multi-tenant digital-menu SaaS for restaurants and cafes.

## Canonical Backend Identity
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: canonical database schema `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary.

## Current Verified Position — 2026-09-15
- VERIFIED: current canonical `main` is `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: R8.1 Action Loop, R8.2 Evidence-based Recommendations, R8.3 Experiment Expansion, R8.4 Evidence-based Upsell, and R8.5 Restaurant Discovery remain complete and protected.
- VERIFIED: R9 Guest CRM, Loyalty, Campaigns, Feedback, and Retention remains complete for the implemented owner-controlled scope.
- VERIFIED: R10 is explicitly deferred and has not been started.
- VERIFIED: W7.2, W7.3, W7.4, W7.5, W7.6, W7.7, W7.8, and W7.9 are complete and verified on the current working branch.

## Completed Protected Work
- G1–G7.2 — CLOSED / VERIFIED.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Visual/Functional Quality System — DONE / VERIFIED / MERGED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- R2.7 WhatsApp Report Sharing — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — DONE / VERIFIED.
- Gallery + Noir theme hardening — DONE / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.
- R8.1 Action Loop — CLOSED / VERIFIED / MERGED.
- R8.2 Evidence-based Recommendations — CLOSED / VERIFIED / MERGED.
- R8.3 Experiment Expansion — CLOSED / VERIFIED / MERGED.
- R8.4 Evidence-based Upsell — CLOSED / VERIFIED / MERGED.
- R8.5 Restaurant Discovery — CLOSED / VERIFIED / MERGED.
- R9 Guest Relationships — CLOSED / VERIFIED / MERGED.

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

Protected R2 principles:
- Database is the source of truth.
- Deterministic findings precede AI explanation.
- AI cannot invent price, availability, allergen, tenant, branch, permission, payment, revenue, or financial truth.
- Reports use canonical verified analytics.
- WhatsApp sharing is owner-reviewed; no autonomous outbound messaging.

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

- VERIFIED: published zero-activity menus surface a deterministic distribution action using existing OwnerAnalytics fields and verified publication state.
- VERIFIED: owner is routed to existing `/studio/brand`; no duplicate route/dashboard was created.
- VERIFIED: unpublished menus retain the existing `publish-menu` action without duplicate guidance.
- VERIFIED: no new metrics, conversion claims, autonomous messaging, or autonomous menu mutation were introduced.

## R6 — Experiments
STATUS: CLOSED / VERIFIED — ACTIVATION COMPLETE; OUTCOME PENDING REAL EXPOSURE

- VERIFIED: `whatsapp-cta-v1` uses the existing anonymous session id for stable `control` / `prominent` assignment and server-derived recorded variant.
- VERIFIED: participation is limited to published menus with configured WhatsApp.
- VERIFIED: existing `menu_events` remains canonical through nullable experiment fields.
- VERIFIED: preview/owner-preview does not activate or record the experiment.
- Measurement: WhatsApp-click sessions / exposed sessions; product-view sessions / exposed sessions as guardrail.
- Collection target: 50 exposed sessions per variant.
- Decision output is directional only; no statistical significance is claimed.

## R7 — Post-Experiment Evidence Review
STATUS: IN PROGRESS — NON-BLOCKING / INSUFFICIENT EXPOSURE

- VERIFIED: canonical table is `menu_v3.menu_events`.
- VERIFIED: observed exposure remains 1 distinct `control` session and 2 distinct `prominent` sessions.
- VERIFIED: no treatment decision is justified; continue eligible real exposure and re-review after meaningful accumulation.
- VERIFIED: no synthetic traffic is used.

## R8 — Closed-Loop Menu Growth Engine
STATUS: CLOSED / VERIFIED / MERGED

- VERIFIED: `/studio/growth` provides Observe → Act → Measure.
- VERIFIED: recommendations are deterministic and evidence-bound.
- VERIFIED: thin traffic is explicitly insufficient evidence.
- VERIFIED: recommendations route to existing Studio destinations; no automatic menu mutation.
- VERIFIED: future experiments require baseline, isolated change, primary metric, guardrail, and owner-approved activation.
- VERIFIED: R8.4 Evidence-based Upsell uses observed co-view/co-cart/co-order evidence and owner approval before measurement.
- VERIFIED: R8.5 Restaurant Discovery covers public discovery/SEO/readability without inventing tenant data.

## R9 — Guest Relationships
STATUS: CLOSED / VERIFIED / MERGED

- VERIFIED: owner-facing Studio guest relationship surface covers Guest CRM, Loyalty, Campaigns, Feedback, and Retention.
- VERIFIED: relationship data is server-authorized and tenant/branch scoped; owner/admin are the elevated roles used by the existing permission contract.
- VERIFIED: loyalty accounts and ledger, owner-controlled campaign drafts, and feedback records have RLS enabled and public access revoked.
- VERIFIED: retention and relationship overview are derived from real guest/order data; no synthetic evidence is introduced.
- VERIFIED: autonomous outbound messaging, automatic rewards, autonomous campaign execution, predictive claims, and pricing mutation are excluded.
- VERIFIED: final GitHub Actions quality run 1453 passed route generation, typecheck, 265 tests, lint, production build, Playwright/Chromium, all-theme browser QA, performance artifact upload, and cleanup.
- VERIFIED: the initial CI failure was a PGlite portability issue caused by unconditional `anon`/`authenticated` role revocation; the migration was hardened conditionally without weakening Supabase security semantics.

## R10
STATUS: DEFERRED / NOT STARTED

R10 is intentionally not started. Do not begin R10 until the owner explicitly authorizes it.

## AI Provider Infrastructure
- VERIFIED: server-side provider abstraction is merged.
- VERIFIED: structured routing supports Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing supports Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.
- VERIFIED: server-only credentials; no client API-key exposure is part of the supported architecture.

## Production / Commercial Readiness
STATUS: IN PROGRESS — EXTERNAL EVIDENCE REMAINING

- VERIFIED: repository-side R9 implementation and CI quality gates are complete.
- VERIFIED: GitHub `main` contains the protected product work.
- UNKNOWN: direct current Vercel Production environment-variable values.
- UNKNOWN: current Production deployment commit/state requires direct Vercel evidence.
- UNKNOWN: physical real-device Production QA.
- BLOCKED: unnecessary Vercel deployment retries must not be attempted while the known free daily deployment quota is exhausted.

## Release / Deployment
- VERIFIED: release-only Vercel workflow remains mandatory.
- VERIFIED: development must not use Vercel as the iteration loop.
- VERIFIED: GitHub `main` is `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- UNKNOWN: direct current Vercel Production environment configuration and deployment state.
- UNKNOWN: physical real-device Production QA.

## Current Strategic Direction
Menu V3 is a Premium Arabic-first Restaurant Presence + Menu Intelligence platform:

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

Do not turn the product into a generic AI chatbot, POS, accounting system, or autonomous restaurant operator.

## W7 — Internal Product Experience Architecture
STATUS: W7.1 COMPLETE / W7.2 VERIFIED / W7.3 DONE / W7.4 DONE / W7.5 DONE / W7.6 DONE / W7.7 DONE / W7.8 DONE / W7.9 DONE — CURRENT WORKING BRANCH

### W7.1 — COMPLETE / ANALYSIS
- VERIFIED: W7.1 audited current Studio/Admin architecture against main SHA `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: source sweep, IA audit, route map, and wireframes exist.
- VERIFIED: `/admin` remains separate and `/studio/growth` + `/studio/guests` are real routes.

### W7.2 — ACCEPTED / VERIFIED
- VERIFIED: shared internal primitives exist in `src/components/internal-design-system.tsx`.
- VERIFIED: route generation run `34898237425` passed generated freshness, typecheck, tests, lint, and production build.
- VERIFIED: no page migration, navigation behavior change, backend/security change, dependency addition, merge, or deployment occurred during W7.2.

### W7.3 — DONE / VERIFIED
- VERIFIED: desktop primary = Home, Menu, Orders, Growth, Customers, Settings.
- VERIFIED: contextual navigation exposes only real routes; Reports remains outside primary Studio navigation.
- VERIFIED: mobile primary = Home, Menu, Orders, Growth, More.
- VERIFIED: accepted browser run `34905256209` passed the W7.3 browser and quality gates.
- VERIFIED: physical real-device QA remains release-stage evidence.

### W7.4 — DONE / VERIFIED
- VERIFIED: `/studio/` is the focused operational Home using existing `useStudio`, `getOwnerAnalytics`, `getOrdersDashboard`, and `buildMenuGrowthAdvisor` sources.
- VERIFIED: Home has honest loading/error/empty/populated, RTL/LTR, responsive, focus, semantic progress, and permission-aware states.
- VERIFIED: no fabricated business metrics or sample activity were added.

### W7.5 — DONE / VERIFIED
- VERIFIED: `/studio/menu` is a focused Menu Workspace using existing menu data and actions.
- VERIFIED: Options, Import, Preview, and QR are contextual real destinations; no dead routes were invented.
- VERIFIED: final W7.5 CI run `34908577942` passed route generation/freshness, typecheck, 266 tests, focused W7.4/W7.5 tests, lint, build, Playwright/Chromium, public all-theme browser QA, Studio Shell/Home/Menu QA, performance audit, diagnostics, and cleanup.
- VERIFIED: no production database/schema, Supabase, RLS, auth, permissions, subscriptions, AI/order logic, public menu, Platform Admin, dependencies, merge, or deployment changes were introduced.
- UNKNOWN: physical real-device QA remains release-stage evidence.

### W7.6 — Growth Workspace — DONE / VERIFIED
- VERIFIED: current working HEAD `3fe58decd1f0c39806bd037e717778c4d58d01ab` and final quality run `34910495789` passed all required W7.6 gates.
- VERIFIED: Growth Workspace unifies existing Growth, Intelligence, Actions, Analytics, and contextual Reports around Observe → Understand → Act → Measure.
- VERIFIED: existing sources only; no new backend, analytics contract, recommendation engine, experiment engine, AI business logic, or charting dependency.
- VERIFIED: no fake metrics, scores, trends, charts, impact, ROI, conversion claims, experiment results, recommendations, or production sample data were added.
- VERIFIED: browser matrix covered 390×844, 430×932, 768×1024, and 1280×800 with RTL/LTR, active navigation, contextual links, focus, and no horizontal overflow.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

### W7.7 — Customers Workspace — DONE / VERIFIED
- VERIFIED: W7.7 final quality run `34914024416` / run 1597 passed against implementation HEAD `a89cc5110175d633ac6f3379fdb1ce6ce27fd4fa`.
- VERIFIED: Customers browser QA reached `/studio/guests` in the real application using the CI fixture and auth-disabled local mode; responsive, RTL/LTR, focus, overflow, and unsupported relationship links passed.
- VERIFIED: final W7.7 correction was test-only and scoped desktop active navigation to desktop; no runtime Customers behavior changed.
- UNKNOWN: physical real-device QA remains release-stage evidence.

### W7.8 — Platform Admin Information Architecture and Admin Shell — DONE / VERIFIED
- VERIFIED: discovery confirmed the real `/admin` tab model, data sources, server-side Platform Admin authorization, existing actions, loading/error/empty boundaries, and absence of separate Security/Platform Health/Configuration capabilities.
- VERIFIED: grouped IA is implemented inside `/admin` without route splitting: Overview; Customers; Commerce; Sales; Intelligence; System.
- VERIFIED: final quality run `34915603884` / run 1602 passed route generation/freshness, typecheck, 266 repository tests, W7.4–W7.8 contracts, lint, production build, Playwright/Chromium, public all-theme QA, Studio Shell/Home/Menu/Growth/Customers QA, Platform Admin browser QA, performance baseline, diagnostics, and cleanup.
- VERIFIED: Platform Admin browser QA reached the actual `/admin` application in the authorized CI development-user state across 390×844, 430×932, 768×1024, and 1280×800.
- VERIFIED: no fake Admin metrics, totals, health scores, activity, security events, charts, recommendations, or operator records were added.
- VERIFIED: no production database/schema, Supabase, RLS, auth, permissions, subscriptions, AI provider/business logic, orders business logic, public menu behavior, Studio business logic, dependencies, merge, or deployment changed.
- UNKNOWN: physical real-device QA remains release-stage evidence.

### W7.9 — Platform Admin Route Architecture / Route Splitting — DONE / VERIFIED
- VERIFIED: `/admin` remains the authorized Overview/Shell and `/admin/$workspace` is the whitelisted child-route adapter for all 11 real Admin workspaces.
- VERIFIED: `setTab(next)` remains the existing runtime contract and URL synchronization is additive through `navigate({ to: ADMIN_ROUTES[next] })`.
- VERIFIED: legacy `/admin?tab=<known>` values normalize to the mapped route; `tab` is removed; unrelated query parameters are preserved through the router serialization contract; unknown values safely fall back to `/admin` with `replace: true`.
- VERIFIED: the original Platform Admin browser blocker was `AUTH_DISABLED_FIXTURE_GAP`; CI now uses an isolated PostgreSQL fixture with compatible existing migrations, Supabase-compatible roles, and `dev-user` seeded in `menu_v3.platform_admins`. No production schema or migration was changed.
- VERIFIED: the final remaining browser assertion was test-only and corrected to match actual TanStack Router serialization: `keep=%221%22` parses as `"1"`.
- VERIFIED: final current-head quality run `34925141809` / run 1638 passed all configured route, freshness, typecheck, repository, W7.4–W7.9 contract, lint, production build, Playwright/Chromium, public, Studio, Platform Admin browser, performance, diagnostics, and cleanup stages.
- VERIFIED: no unsupported Admin detail routes or fabricated data, metrics, charts, health scores, security events, recommendations, or operator sample data were introduced.
- VERIFIED: no production database/schema, Supabase, RLS, authentication, authorization/permissions, subscriptions/entitlements, AI provider/business logic, orders business logic, public menu behavior, Studio business logic, dependencies, Vercel configuration, merge, or deployment changed.
- UNKNOWN: physical real-device QA remains release-stage evidence only.

## Exact Next Task
### W7.10 — Full-Product Mobile and Responsive Pass
W7.10 is the next safe phase. W7.11, merge, deployment, database work, and release work remain out of scope until W7.10 is explicitly completed and verified.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records when the task reveals a durable lesson;
6. record exactly one next task;
7. stop.

## Evidence Labels
`VERIFIED` = direct repository/tool/test/platform evidence.
`INFERRED` = derived from verified evidence.
`PROPOSED` = recommendation not yet proven.
`UNKNOWN` = insufficient evidence.
`BLOCKED` = hard constraint prevents verification or implementation.
