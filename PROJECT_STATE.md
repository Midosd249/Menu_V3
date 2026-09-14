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
- Uses existing OwnerAnalytics evidence and verified publication state.
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
STATUS: W7.1 COMPLETE / W7.2 VERIFIED / W7.3 DONE / W7.4 DONE — CURRENT WORKING BRANCH

- VERIFIED: W7.1 audited current Studio/Admin source architecture against main SHA `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: W7.1 deliverables were added on working branch `w7-1-ia-audit`.
- VERIFIED: `/admin` remains separate and `/studio/growth` + `/studio/guests` are real generated routes.
- VERIFIED: W7.2 route generation run `34898237425` produced Growth + Guests and passed freshness, typecheck, tests, lint, and production build.
- VERIFIED: W7.2 was accepted without page migration or navigation changes.

### W7.3 — Studio Shell Transformation
STATUS: DONE / VERIFIED

- VERIFIED: primary desktop workspaces are Home, Menu, Orders, Growth, Customers, Settings.
- VERIFIED: contextual navigation maps only to real existing routes; Reports remains excluded from Studio navigation by repository contract.
- VERIFIED: Appearance consolidates Brand + Design; Publishing groups QR + Preview.
- VERIFIED: mobile primary is Home, Menu, Orders, Growth, More using W7.2 primitives.
- VERIFIED: existing permission gates and Platform Admin separation remain intact.
- VERIFIED: accepted browser run `34905256209` reached `/studio` and passed the W7.3 shell test.
- VERIFIED: route generation, freshness, typecheck, 266 tests, lint, production build, Playwright/Chromium, public browser QA, performance audit, diagnostics, and cleanup all passed in that run.
- VERIFIED: the CI-only PGlite fixture was temporary and removed by the runner cleanup; no production migration was committed.

### W7.4 — Studio Home
STATUS: DONE / VERIFIED

- VERIFIED: Studio Home is the Arabic-first Premium Operational Workspace and no longer a feature directory.
- VERIFIED: `/studio/` uses existing `useStudio`, `getOwnerAnalytics`, `getOrdersDashboard`, and `buildMenuGrowthAdvisor` sources only.
- VERIFIED: Home includes attention, current performance, recent operational activity, menu health, evidence-bound growth opportunity, and one contextual next action.
- VERIFIED: loading/error/empty/populated, RTL/LTR, responsive, focus, semantic progress, and permission-aware action states are represented.
- VERIFIED: no fabricated business metrics, sample orders, revenue, guests, conversion rates, recommendations, charts, rankings, or activity were added.
- VERIFIED: W7.4 current-head quality/browser evidence was reconciled before W7.5 proceeded.

### W7.5 — Menu Workspace
STATUS: DONE / VERIFIED

- VERIFIED: `/studio/menu` is a focused Menu Workspace using real restaurant/branch context and existing menu operations.
- VERIFIED: existing Options, Import, Preview, and QR routes are exposed contextually; no dead routes were invented.
- VERIFIED: search, category/availability filters, item/category actions, AI draft assistance, and Menu QA preserve existing behavior.
- VERIFIED: honest loading, empty, error, permission, RTL/LTR, mixed-direction, responsive, and keyboard states are covered.
- VERIFIED: no fake metrics, health scores, completeness, revenue, order/customer data, import results, QR state, or sample production data were introduced.
- VERIFIED: final W7.5 CI run `34908577942` passed route generation/freshness, typecheck, 266 repository tests, focused W7.4/W7.5 tests, lint, production build, Playwright/Chromium, public all-theme QA, Studio Shell/Home/Menu browser QA, performance audit, diagnostics, and cleanup.
- UNKNOWN: physical real-device QA remains release-stage evidence.

## W7 Continuity Reconciliation — 2026-09-15
- VERIFIED: final W7.5 state before this update was branch `w7-2-internal-design-system`, HEAD `193912be0a2fa9c7fadcd70995108a4ec9166722`, PR #146 Draft, no merge/deployment.
- VERIFIED: continuity documents were stale against the final W7.5 implementation; this reconciliation records the actual evidence without reopening completed work.
- VERIFIED: documentation-only reconciliation is not code validation; the next W7.6 quality run must validate the complete current head after implementation changes.

## Exact Next Task
### W7.6 — Growth Workspace
Unify existing Growth, Intelligence, Intelligence Actions, Analytics, and contextual Reports/experiment capability where verified into one owner-facing Observe → Understand → Act → Measure workspace. Preserve all business logic and route URLs; do not begin W7.7+.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records when the task reveals a durable lesson;
6. record exactly one next task;
7. stop.