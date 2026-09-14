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
- VERIFIED: latest main commit mounts shared nutrition disclosure on the published QR menu route and protects it with a test.
- VERIFIED: R8/R9 protected work remains in history.
- VERIFIED: R10 remains deferred and has not been started.
- VERIFIED: W7.3 is DONE / VERIFIED on working branch; W7.4 is IMPLEMENTED / CI VERIFIED on the same working branch.

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
STATUS: IN_PROGRESS — NON-BLOCKING / INSUFFICIENT EXPOSURE

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
- VERIFIED: prior quality run 1453 passed route generation, typecheck, 265 tests, lint, production build, Playwright runtime/Chromium, all-theme browser QA, performance artifact upload, and cleanup.
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
STATUS: IN_PROGRESS — EXTERNAL EVIDENCE REMAINING

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

## Saudi Food Disclosure Extension — 2026-09-13
- IN_PROGRESS: focused Saudi food disclosure extension implemented locally and applied to canonical `menu_v3.products`.
- VERIFIED: existing calories and free-text allergen behavior preserved.
- VERIFIED: nullable sodium and caffeine fields with explicit caffeine basis (`per_100ml` / `per_cup`) are available to the owner editor and public item details.
- VERIFIED: high-salt state is derived from stored sodium at or above 2,000 mg; no client-controlled flag or fabricated value is used.
- UNKNOWN: exact technical-regulation presentation details, controlled allergen taxonomy, and physical-activity calorie-burn formula remain unverified and are not implemented.
- BLOCKED: TypeScript quality gate remains blocked by pre-existing route/type-generation errors outside the changed Product fields.
- NOT DEPLOYED: release-only workflow remains pending local/CI verification and a coherent release batch.

## Golden Demo Restaurant — 2026-09-13
- VERIFIED: fictional `مائدة سُرى / Sura Table` demo was applied to the authorized existing tenant; one existing branch was preserved and updated to `فرع النخيل / Al Nakheel Branch`.
- VERIFIED: 10 categories, 28 products, 5 Kids Menu products, 4 caffeine products, 2 sodium-derived high-salt cases, varied allergen coverage, 1 unavailable product, 2 modifier groups, 4 modifier options, and 2 variants.
- VERIFIED: every demo image field is empty; no image was generated, downloaded, uploaded, or processed.

## W7 — Internal Product Experience Architecture
STATUS: W7.1 COMPLETE / W7.2 VERIFIED / W7.3 DONE / W7.4 DONE — CURRENT WORKING BRANCH

### W7.1 — COMPLETE
- VERIFIED: W7.1 audited current Studio/Admin source architecture against `main` SHA `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: W7.1 architecture deliverables exist: source sweep, IA audit, route map, and wireframes.
- VERIFIED: `/admin` remains separate and `/studio/growth` + `/studio/guests` are real routes.

### W7.2 — ACCEPTED / VERIFIED
- VERIFIED: route-independent reusable primitives were added in `src/components/internal-design-system.tsx`.
- VERIFIED: route generation run `34898237425` produced `/studio/growth` and `/studio/guests` and passed generated freshness, typecheck, tests, lint, and production build.
- VERIFIED: generator-produced route tree commit `0b4057bbfabadff156fd7f2fd48ecf1e1d8c118d` was used; no hand edit.
- VERIFIED: no page migration, navigation behavior change, backend/security change, dependency addition, merge, or deployment occurred during W7.2.

### W7.3 — DONE / VERIFIED
- VERIFIED: desktop primary workspaces are Home, Menu, Orders, Growth, Customers, Settings.
- VERIFIED: contextual navigation only exposes real existing routes; Reports remains intentionally out of Studio navigation by repository contract.
- VERIFIED: Appearance groups Brand + Design; Publishing groups QR + Preview.
- VERIFIED: mobile primary is Home, Menu, Orders, Growth, More; More is permission-filtered and Escape closes it.
- VERIFIED: existing settings/team permission gates and Platform Admin separation remain intact.
- VERIFIED: the original browser blocker was a CI-only PGlite schema mismatch (`tenant_members.is_active`, followed by `orders.archived_at`).
- VERIFIED: temporary fixture correction solved the blocker inside the isolated runner and was removed on step cleanup; no production migration was committed.
- VERIFIED: accepted browser run `34905256209` actually served `http://127.0.0.1:8082/studio` and passed the W7.3 browser test.
- VERIFIED: accepted run passed route generation, generated freshness, typecheck, 266 tests, lint, production build, Playwright/Chromium, public all-theme browser QA, performance audit, diagnostics upload, and cleanup.
- VERIFIED: browser matrix covered 1280×800, 390×844, 430×932, 768×1024, RTL/LTR, active state, keyboard focus, More/Escape, dead-link exclusion, Reports exclusion, Platform Admin exclusion, and overflow.
- UNKNOWN: physical real-device QA; this remains a release-stage check.

### W7.4 — DONE / VERIFIED
- VERIFIED: Studio Home was started only after W7.3 browser acceptance passed.
- VERIFIED: `/studio/` now renders focused `StudioHome` without changing the route URL.
- VERIFIED: Home uses only existing `useStudio`, `getOwnerAnalytics`, `getOrdersDashboard`, and `buildMenuGrowthAdvisor` data sources.
- VERIFIED: Home contains greeting/current branch context, Needs Attention, Current Performance, Recent Operational Activity, Menu Health, Growth Opportunity, and one contextual next action.
- VERIFIED: loading, error, empty, populated, RTL/LTR, responsive, focus, semantic progress, and permission-aware action states are represented.
- VERIFIED: no fake revenue, orders, guests, conversion rates, recommendations, charts, rankings, or sample numbers were added.
- VERIFIED: W7.4 contract test and browser QA were added and executed through the quality workflow.
- VERIFIED: current-head quality run `34906025538` passed route generation, generated freshness, typecheck, repository tests, W7.4 contract tests, lint, production build, Playwright/Chromium, public browser QA, performance audit, Studio Shell + Home browser QA, artifact upload, and cleanup.
- VERIFIED: no database schema, Supabase, RLS, auth, permissions, subscriptions, AI, orders business logic, public menu, Platform Admin, dependency, merge, or deployment changes were used to implement W7.4.
- UNKNOWN: physical real-device Studio Home QA; release-stage only.

## W7 Continuity Documents
- `docs/W7_3_BROWSER_QA.md` records the PGlite root cause, fixture-only correction, accepted run, browser matrix, and security boundary.
- `docs/W7_4_STUDIO_HOME.md` records Home scope, real data sources, sections, state rules, visual rules, and non-goals.
- `docs/W7_4_HOME_QA.md` records the Home verification contract and release boundary.

## Exact Next Task
### W7.4 — Final diff review only, then stop

W7.4 quality and browser verification is complete. Review the final diff against `main`, ensure forbidden areas remain unchanged, keep PR #146 Draft, do not merge, do not deploy, and stop. R7 remains active independently. R10 remains untouched.

## Continuity Reconciliation Rule
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