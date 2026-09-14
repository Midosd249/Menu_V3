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

## Current Verified Position — 2026-09-14
- VERIFIED: current canonical `main` is `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: latest main commit mounts shared nutrition disclosure on the published QR menu route and protects it with a test.
- VERIFIED: R8/R9 protected work remains in history.
- VERIFIED: R10 remains deferred and has not been started.

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
- VERIFIED: Supabase counts show zero orders for this tenant before and after the replacement; no unrelated tenant was written.
- VERIFIED LOCALLY: 263 repository tests, 19 static theme/public-menu contract tests, 24 focused data/theme/SEO tests, build, lint, and TypeScript passed.
- BLOCKED: browser visual QA could not run because Playwright's browser executable was unavailable and local PGlite lacks the pre-existing `public_content_version` schema; no visual defect was claimed or changed.
- NOT DEPLOYED: no push or Vercel deployment was performed.

## W7 — Internal Product Experience Architecture
STATUS: W7.1 COMPLETE / W7.2 IMPLEMENTATION FOUNDATION COMPLETE / EXECUTION VERIFICATION PENDING

- VERIFIED: W7.1 audited current Studio/Admin source architecture against `main` SHA `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: working branch `w7-1-ia-audit` contains the W7.1 architecture deliverables.
- VERIFIED: `/admin` is a tab-driven monolith with 12 tab/pseudo-route states.
- VERIFIED: `/studio/growth` and `/studio/guests` source routes exist but are absent from the checked-in generated route tree.
- INFERRED: primary internal UX debt is information architecture/discoverability, not missing backend capabilities.
- PROPOSED: Studio hierarchy = Home, Menu, Orders, Growth, Customers, Settings, with Appearance and Publishing as coherent subdomains.
- PROPOSED: desktop grouped navigation and mobile Home/Menu/Orders/Growth/More.
- PROPOSED: contextual detail panels for entity inspection and full pages for dense tables/long forms/analytics.
- BLOCKED: Mobbin direct connected inspection was unavailable/paid; no inaccessible evidence was used.

## W7.2 — Controlled Verification Exception / Internal Design System

- VERIFIED: owner explicitly authorized W7.2 to proceed with a controlled verification exception for route-independent primitives.
- VERIFIED: `src/routes/studio/growth.tsx` exists and declares the expected route path.
- VERIFIED: `src/routes/studio/guests.tsx` exists and declares the expected route path.
- VERIFIED: `src/routeTree.gen.ts` currently does not include those routes.
- VERIFIED: repository CI uses `npx vite build --mode development` to generate the TanStack route tree.
- VERIFIED: current execution environment could not clone/run the repository because GitHub DNS/network access failed.
- PENDING_LOCAL_VERIFICATION: route generation has not successfully executed in a real local/CI environment.
- PENDING_LOCAL_VERIFICATION: typecheck, lint, full tests, build, browser/visual, RTL/accessibility, and real-device QA remain pending.
- VERIFIED: route-independent internal primitives were added in `src/components/internal-design-system.tsx`.
- VERIFIED: `tests/internal-design-system-contract.test.mjs` was added for static contract coverage.
- VERIFIED: W7.2 created `docs/W7_2_INTERNAL_DESIGN_SYSTEM.md` and `docs/W7_2_COMPONENT_INVENTORY.md`.
- VERIFIED: existing UI/token conventions were reused; no dependency was added.
- VERIFIED: no pages were migrated; no Studio navigation behavior changed; no Admin tabs changed.
- VERIFIED: no route, router configuration, generated file, database, RLS, auth, permissions, subscriptions, AI, orders, public menu, deployment, or merge changed.
- VERIFIED: `DetailPanel` and `ConfirmDialog` were intentionally deferred because no existing reusable project Radix dialog/drawer pattern was established that met the requested reuse constraint.
- PENDING_LOCAL_VERIFICATION: Growth and Guests remain excluded from primary navigation until route generation succeeds.

## Exact Next Task
### W7.2 — Finish execution verification and review

Run the exact command below in a real local/CI environment:

```bash
npx vite build --mode development
```

Then run the relevant typecheck, lint, tests, build, browser/RTL/accessibility checks and review the final diff. Only after those checks should W7.2 be marked complete and W7.3 authorized.

R7 remains active independently and does not block W7.2. R10 must remain untouched.

## Session Log — 2026-09-15 — W7.2 Controlled Verification Exception
- VERIFIED: W7.2 proceeded only within the owner-authorized route-independent scope.
- VERIFIED: internal design system primitives and static contract coverage were added without route integration.
- PENDING_LOCAL_VERIFICATION: route generation and executable quality/browser checks remain unverified.
- VERIFIED: no merge or deployment occurred.

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
