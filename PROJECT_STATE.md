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

## Current Verified Position — 2026-09-13
- VERIFIED: current canonical `main` is `afece1cb591566e885520b703117d0994643597a`.
- VERIFIED: PR #136 merged the R9 guest relationship batch into `main` after final quality run 1453 passed all configured stages.
- VERIFIED: R8.1 Action Loop, R8.2 Evidence-based Recommendations, R8.3 Experiment Expansion, R8.4 Evidence-based Upsell, and R8.5 Restaurant Discovery remain complete and protected.
- VERIFIED: R9 Guest CRM, Loyalty, Campaigns, Feedback, and Retention is complete for the implemented owner-controlled scope.
- VERIFIED: R10 is explicitly deferred and has not been started.

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

- VERIFIED: PR #136 merged into `main` as `afece1cb591566e885520b703117d0994643597a`.
- VERIFIED: owner-facing Studio guest relationship surface covers Guest CRM, Loyalty, Campaigns, Feedback, and Retention.
- VERIFIED: relationship data is server-authorized and tenant/branch scoped; owner/admin are the elevated roles used by the existing permission contract.
- VERIFIED: loyalty accounts and ledger, owner-controlled campaign drafts, and feedback records have RLS enabled and public access revoked.
- VERIFIED: retention and relationship overview are derived from real guest/order data; no synthetic evidence is introduced.
- VERIFIED: autonomous outbound messaging, automatic rewards, autonomous campaign execution, predictive claims, and pricing mutation are excluded.
- VERIFIED: final GitHub Actions quality run 1453 passed route generation, typecheck, 265 tests, lint, production build, Playwright runtime/Chromium, all-theme browser QA, performance artifact upload, and cleanup.
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
- VERIFIED: GitHub `main` contains the R9 merge commit.
- UNKNOWN: direct current Vercel Production environment-variable values.
- UNKNOWN: current Production deployment commit/state requires direct Vercel evidence.
- UNKNOWN: physical real-device Production QA.
- BLOCKED: unnecessary Vercel deployment retries must not be attempted while the known free daily deployment quota is exhausted.

## Release / Deployment
- VERIFIED: release-only Vercel workflow remains mandatory.
- VERIFIED: development must not use Vercel as the iteration loop.
- VERIFIED: GitHub `main` is `afece1cb591566e885520b703117d0994643597a`.
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
- VERIFIED: the explicitly authorized existing tenant `2e3f3c63-7dbd-4af2-920a-5f0c9ced8497`, owned by `midosd2@hotmail.com`, was rebuilt as the fictional `مائدة سُرى / Sura Table` demo.
- VERIFIED: one existing branch was preserved and updated to `فرع النخيل / Al Nakheel Branch`; the user, membership, permissions, and orders were preserved.
- VERIFIED: 10 categories, 28 products, 5 Kids Menu products, 4 caffeine products, 2 sodium-derived high-salt cases, 8 products with no allergens, 13 with multiple allergen entries, 1 unavailable product, 2 modifier groups, 4 modifier options, and 2 variants.
- VERIFIED: every demo image field is empty; no image was generated, downloaded, uploaded, or processed.
- VERIFIED: Supabase counts show zero orders for this tenant before and after the replacement; no unrelated tenant was written.
- VERIFIED LOCALLY: 263 repository tests, 19 static theme/public-menu contract tests, 24 focused data/theme/SEO tests, build, lint, and TypeScript passed.
- BLOCKED: browser visual QA could not run because Playwright's browser executable was unavailable and local PGlite lacks the pre-existing `public_content_version` schema; no visual defect was claimed or changed.
- NOT DEPLOYED: no push or Vercel deployment was performed.

## Exact Next Task
### Production / Commercial Readiness — External Verification Gate

Complete only the remaining evidence-dependent work:
1. verify Vercel Production environment/configuration against canonical Supabase project `ublxptcqefujkbeepylc` and schema `menu_v3`;
2. perform available authenticated/browser/QR/theme/order/RTL Production QA;
3. perform real-device QA when a real device/browser session is available;
4. record direct evidence and close the readiness milestone when all applicable checks pass.

R7 remains active independently and does not block this task. R10 must remain untouched.

## Session Log — 2026-09-13 — R9 Closure
- VERIFIED: PR #136 completed the R9 guest relationship batch and merged into `main`.
- VERIFIED: final main commit is `afece1cb591566e885520b703117d0994643597a`.
- VERIFIED: quality run 1453 passed all configured stages after the R9 migration portability fix.
- VERIFIED: no protected authentication, authorization, tenant/branch isolation, subscription, ordering, R6, or R7 semantics were weakened.
- VERIFIED: R10 is explicitly deferred and not started.
- UNKNOWN/BLOCKED: Vercel Production state and real-device QA remain external evidence items; free daily deployment quota must not be retried unnecessarily.

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
